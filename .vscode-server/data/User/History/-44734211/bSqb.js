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
        ok: false,
        error: "Missing required fields: name, phone and service are required" 
      });
    }

    // 2. Validar email si se proporciona
    if (email) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          ok: false,
          error: "Invalid email address" 
        });
      }
    }

    // 3. Validar teléfono
    const telefonoRegex = /^[0-9\s\-\+\(\)]{8,20}$/;
    if (!telefonoRegex.test(telefono.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        ok: false,
        error: "Invalid phone number. Use 8-20 digits, may include +, (), -" 
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

    console.log("📝 Creando solicitud con datos:", {
      nombre: datosSolicitud.nombre,
      service: datosSolicitud.service,
      telefono: datosSolicitud.telefono
    });

    // 6. Crear la solicitud (Mongoose hará sus validaciones)
    const nuevaSolicitud = await Solicitud.create(datosSolicitud);

    console.log("✅ Solicitud guardada en BD:", nuevaSolicitud._id);

    // 7. Enviar emails (no bloquear si fallan)
    const emailResults = {
      admin: { ok: false, error: null },
      client: { ok: false, error: null }
    };

    try {
      console.log("📧 Enviando email al administrador...");
      const adminResult = await enviarSolicitudEmail({
        nombre: datosSolicitud.nombre,
        email: datosSolicitud.email || "no-email@provided.com",
        telefono: datosSolicitud.telefono,
        service: datosSolicitud.service,
        mensaje: datosSolicitud.descripcion,
        ubicacion: datosSolicitud.ubicacion,
        presupuesto: datosSolicitud.presupuesto
      });
      
      emailResults.admin = adminResult.ok 
        ? { ok: true, message: "Admin email sent" }
        : { ok: false, error: adminResult.error };
      
      console.log("✅ Email al admin enviado");
    } catch (error) {
      emailResults.admin = { ok: false, error: error.message };
      console.warn("⚠️  Error enviando email al admin:", error.message);
    }

    // 8. Enviar confirmación en inglés al cliente (solo si tiene email)
    if (datosSolicitud.email) {
      try {
        console.log("📧 Enviando confirmación al cliente:", datosSolicitud.email);
        
        const clientResult = await sendClientConfirmation({
          nombre: datosSolicitud.nombre,
          email: datosSolicitud.email,
          telefono: datosSolicitud.telefono,
          service: datosSolicitud.service,
          ubicacion: datosSolicitud.ubicacion,
          presupuesto: datosSolicitud.presupuesto
        });
        
        emailResults.client = clientResult.ok
          ? { ok: true, message: "Client confirmation sent" }
          : { ok: false, error: clientResult.error };
        
        console.log("✅ Confirmación enviada al cliente");
      } catch (error) {
        emailResults.client = { ok: false, error: error.message };
        console.warn("⚠️  Error enviando confirmación al cliente:", error.message);
      }
    } else {
      console.log("ℹ️  No client email provided, skipping confirmation");
      emailResults.client = { ok: false, error: "No email provided for client confirmation" };
    }

    // 9. Responder al cliente
    const response = {
      ok: true,
      message: "Request received successfully",
      request: {
        id: nuevaSolicitud._id,
        name: nuevaSolicitud.nombre,
        service: nuevaSolicitud.service,
        status: nuevaSolicitud.estado,
        date: nuevaSolicitud.fecha,
        reference: `#${nuevaSolicitud._id.toString().slice(-6).toUpperCase()}`
      },
      notifications: {
        adminEmail: emailResults.admin.ok,
        clientConfirmation: datosSolicitud.email ? emailResults.client.ok : "skipped (no email)"
      }
    };

    // Si el cliente proporcionó email pero no se pudo enviar confirmación, informar
    if (datosSolicitud.email && !emailResults.client.ok) {
      response.message += ". Note: We couldn't send the confirmation email, but your request was saved.";
    }

    res.status(201).json(response);

  } catch (error) {
    console.error("❌ Error en POST /solicitudes:", error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        ok: false, 
        error: "Validation error", 
        details: errores 
      });
    }

    // Error de duplicado (si aplica)
    if (error.code === 11000) {
      return res.status(400).json({ 
        ok: false, 
        error: "Duplicate entry found" 
      });
    }

    // Error genérico
    res.status(500).json({ 
      ok: false, 
      error: "Internal server error processing your request" 
    });
  }
});

// 🆕 Ruta adicional para obtener solicitudes (si necesitas panel admin)
router.get("/", async (req, res) => {
  try {
    const { estado, limit = 100, page = 1 } = req.query;
    const query = estado ? { estado } : {};
    
    const solicitudes = await Solicitud.find(query)
      .sort({ fecha: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Solicitud.countDocuments(query);
    
    res.json({ 
      ok: true, 
      total, 
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      solicitudes 
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// 🆕 Ruta para obtener una solicitud específica
router.get("/:id", async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    
    if (!solicitud) {
      return res.status(404).json({ ok: false, error: "Request not found" });
    }
    
    res.json({ ok: true, solicitud });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// 🆕 Ruta para cambiar estado (para panel admin)
router.patch("/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;
    
    // Validar estado
    const estadosPermitidos = ["nuevo", "pendiente", "contactado", "cotizado", "aprobado", "rechazado", "finalizado"];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ 
        ok: false, 
        error: `Invalid status. Allowed: ${estadosPermitidos.join(", ")}` 
      });
    }
    
    const solicitud = await Solicitud.findByIdAndUpdate(
      id, 
      { estado }, 
      { new: true, runValidators: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ ok: false, error: "Request not found" });
    }
    
    res.json({ 
      ok: true, 
      message: `Status updated to ${estado}`,
      solicitud 
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

// 🆕 Ruta para agregar nota a una solicitud
router.post("/:id/notas", async (req, res) => {
  try {
    const { contenido, autor } = req.body;
    const { id } = req.params;
    
    if (!contenido) {
      return res.status(400).json({ ok: false, error: "Note content is required" });
    }
    
    const solicitud = await Solicitud.findByIdAndUpdate(
      id,
      { 
        $push: { 
          notas: { 
            contenido: contenido.trim(),
            autor: autor || "System",
            fecha: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ ok: false, error: "Request not found" });
    }
    
    res.json({ 
      ok: true, 
      message: "Note added successfully",
      nota: solicitud.notas[solicitud.notas.length - 1],
      solicitud 
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

module.exports = router;