console.log("Cargando rutas de solicitudes...");

const express = require("express");
const Solicitud = require("../models/Solicitudes");
const { enviarSolicitudEmail, sendClientConfirmation } = require("../services/emailService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { 
      nombre, 
      email, 
      telefono, 
      service, 
      mensaje,         // Del frontend
      descripcion,     // Alternativo del frontend
      ubicacion, 
      presupuesto 
    } = req.body;

    // 1. Validar campos obligatorios (según modelo)
    if (!nombre || !telefono || !service) {
      return res.status(400).json({ 
        error: "Faltan campos obligatorios: nombre, teléfono y servicio son requeridos" 
      });
    }

    // 2. Validar email si se proporciona
    if (email) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }
    }

    // 3. Validar teléfono
    const telefonoRegex = /^[0-9\s\-\+\(\)]{8,20}$/;
    if (!telefonoRegex.test(telefono.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        error: "Teléfono inválido. Use 8-20 dígitos, puede incluir +, (), -" 
      });
    }

    // 4. Mapear "mensaje" del frontend a "descripcion" del modelo
    const descripcionFinal = mensaje || descripcion || "";

    // 5. Preparar datos para el modelo
    const datosSolicitud = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      service: service.trim(),
      descripcion: descripcionFinal.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      ubicacion: ubicacion ? ubicacion.trim() : undefined,
      presupuesto: presupuesto ? presupuesto.trim() : undefined
    };

    console.log("Creando solicitud con datos:", datosSolicitud);

    // 6. Crear la solicitud (Mongoose hará sus validaciones)
    const nuevaSolicitud = await Solicitud.create(datosSolicitud);

    console.log("✅ Solicitud guardada en BD:", nuevaSolicitud._id);

    // 7. Intentar enviar email (no bloquear si falla)
    try {
      console.log(">>> Enviando email de notificación...");
      await enviarSolicitudEmail({
        nombre: datosSolicitud.nombre,
        email: datosSolicitud.email || "no-email@provided.com",
        telefono: datosSolicitud.telefono,
        service: datosSolicitud.service,
        mensaje: datosSolicitud.descripcion,
        ubicacion: datosSolicitud.ubicacion,
        presupuesto: datosSolicitud.presupuesto
      });
      console.log("✅ Email enviado exitosamente");
    } catch (error) {
      console.warn("⚠️  Error al enviar email (continuando):", error.message);
      // No fallamos la solicitud por error de email
    }

    // 8. Responder al cliente
    res.status(201).json({
      ok: true,
      mensaje: "Solicitud recibida correctamente",
      solicitud: {
        id: nuevaSolicitud._id,
        nombre: nuevaSolicitud.nombre,
        service: nuevaSolicitud.service,
        estado: nuevaSolicitud.estado,
        fecha: nuevaSolicitud.fecha
      }
    });

  } catch (error) {
    console.error("❌ Error en POST /solicitudes:", error);

    // Manejar errores de validación de Mongoose mejor
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        ok: false, 
        error: "Error de validación", 
        detalles: errores 
      });
    }

    // Error genérico
    res.status(500).json({ 
      ok: false, 
      error: "Error interno del servidor al procesar la solicitud" 
    });
  }
});

// 🆕 Ruta adicional para obtener solicitudes (si necesitas panel admin)
router.get("/", async (req, res) => {
  try {
    const solicitudes = await Solicitud.find().sort({ fecha: -1 }).limit(100);
    res.json({ ok: true, total: solicitudes.length, solicitudes });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// 🆕 Ruta para cambiar estado (para panel admin)
router.patch("/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;
    
    const solicitud = await Solicitud.findByIdAndUpdate(
      id, 
      { estado }, 
      { new: true, runValidators: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ ok: false, error: "Solicitud no encontrada" });
    }
    
    res.json({ ok: true, solicitud });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

module.exports = router;