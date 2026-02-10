console.log("Cargando rutas de solicitudes...");

const express = require("express");
const Solicitud = require("../models/Solicitudes");
const { enviarSolicitudEmail } = require("../services/emailService");
const router = express.Router();

router.post("/", async (req, res) => {
  const { nombre, email, telefono, servicio, mensaje } = req.body;

  // 1. Validar campos obligatorios
  if (!nombre || !email || !telefono || !servicio) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // 2. Validar email
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  // 3. Validar teléfono (solo números + longitud razonable)
  const soloNumeros = /^[0-9]+$/;
  if (!soloNumeros.test(telefono)) {
    return res.status(400).json({ error: "El teléfono debe contener solo números" });
  }

  if (telefono.length < 8 || telefono.length > 15) {
    return res.status(400).json({ error: "El teléfono tiene una longitud inválida" });
  }

  // 4. Validar servicio permitido
  const serviciosPermitidos = ["remodelación", "construcción", "pintura", "diseño"];
  if (!serviciosPermitidos.includes(servicio)) {
    return res.status(400).json({ error: "Servicio no permitido" });
  }

  // Si todo está OK, guardar la solicitud
  try {
    const nuevaSolicitud = await Solicitud.create({
      nombre,
      email,
      telefono,
      servicio,
      mensaje
    });

    // Enviar email (sin romper la ruta si falla)
    try {
      await enviarSolicitudEmail({
        nombre,
        email,
        telefono,
        servicio,
        mensaje
      });
    } catch (error) {
      console.warn("Error al enviar el email:", error.message);
    }

    res.status(201).json({
      ok: true,
      solicitud: nuevaSolicitud
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;