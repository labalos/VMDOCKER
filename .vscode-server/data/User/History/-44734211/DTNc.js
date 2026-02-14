const express = require("express");
const router = express.Router();
const Solicitud = require("../models/Solicitudes");
const { enviarSolicitudEmail, sendClientConfirmation } = require("../services/emailService");

// ==========================================
// RUTA PÚBLICA: Crear solicitud
// ==========================================

router.post("/", async (req, res) => {
  try {
    const { nombre, email, telefono, service, mensaje, descripcion, ubicacion, presupuesto } = req.body;

    // Validaciones básicas
    if (!nombre?.trim() || !telefono?.trim() || !service?.trim()) {
      return res.status(400).json({ 
        ok: false,
        error: "Nombre, teléfono y servicio son obligatorios" 
      });
    }

    // Preparar datos (mapeo mensaje→descripcion)
    const datosSolicitud = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      service: service.trim(),
      descripcion: (mensaje || descripcion || "").trim(),
      email: email?.trim().toLowerCase() || undefined,
      ubicacion: ubicacion?.trim() || undefined,
      presupuesto: presupuesto || undefined
    };

    const nuevaSolicitud = await Solicitud.create(datosSolicitud);
    
    // Enviar emails (no bloquear respuesta)
    enviarEmailsAsync(datosSolicitud, nuevaSolicitud._id);

    res.status(201).json({
      ok: true,
      message: "Solicitud recibida correctamente",
      request: {
        id: nuevaSolicitud._id,
        name: nuevaSolicitud.nombre,
        service: nuevaSolicitud.service,
        status: nuevaSolicitud.estado,
        date: nuevaSolicitud.fecha,
        reference: `#${nuevaSolicitud._id.toString().slice(-6).toUpperCase()}`
      }
    });

  } catch (error) {
    console.error("❌ Error POST /solicitudes:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        ok: false, 
        error: "Error de validación", 
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ ok: false, error: "Error interno del servidor" });
  }
});

// ==========================================
// RUTA PÚBLICA: Consultar por ID (solo datos básicos)
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id)
      .select('nombre service estado fecha descripcion') // Solo campos seguros
      .lean();

    if (!solicitud) {
      return res.status(404).json({ ok: false, error: "Solicitud no encontrada" });
    }

    res.json({ ok: true, data: solicitud });
    
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ==========================================
// HELPERS
// ==========================================

async function enviarEmailsAsync(datos, solicitudId) {
  try {
    await enviarSolicitudEmail({ ...datos, id: solicitudId });
    if (datos.email) {
      await sendClientConfirmation(datos);
    }
  } catch (error) {
    console.error("Error enviando emails:", error);
  }
}

module.exports = router;