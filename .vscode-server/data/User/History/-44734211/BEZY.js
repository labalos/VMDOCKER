console.log("Cargando rutas de solicitudes...");

const express = require("express");
const Solicitud = require("../models/Solicitudes");
const { enviarSolicitudEmail } = require("../services/emailService");
const router = express.Router();

router.post("/", async (req, res) => {
  const { nombre, email, telefono, service, mensaje } = req.body;

  // 1. Validar campos obligatorios
  if (!nombre || !email || !telefono || !service) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // 2. Validar email
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  // 3. Validar teléfono
  const soloNumeros = /^[0-9]+$/;
  if (!soloNumeros.test(telefono)) {
    return res.status(400).json({ error: "El teléfono debe contener solo números" });
  }

  if (telefono.length < 8 || telefono.length > 15) {
    return res.status(400).json({ error: "El teléfono tiene una longitud inválida" });
  }

  // 4. Validar servicio permitido
  const serviciosPermitidos = [
    "Remodeling",
    "Construction",
    "Painting",
    "Flooring",
    "Other"
  ];

  if (!serviciosPermitidos.includes(service)) {
    return res.status(400).json({ error: "Servicio no permitido" });
  }

  // Si todo está OK, guardar la solicitud
  try {
    const nuevaSolicitud = await Solicitud.create({
      nombre,
      email,
      telefono,
      service,
      mensaje
    });

    console.log(">>> Entrando a enviarSolicitudEmail...");

    try {
      await enviarSolicitudEmail({
        nombre,
        email,
        telefono,
        service,
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