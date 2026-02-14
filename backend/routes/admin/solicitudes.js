const express = require('express');
const router = express.Router();
const Solicitud = require('../../models/Solicitud');
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

// Middleware de autenticación para todas las rutas
router.use(auth);
router.use(adminAuth);

// ==========================================
// LISTADO CON PAGINACIÓN Y FILTROS BÁSICOS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const { estado, page = 1, limit = 50, search } = req.query;
    
    const query = estado ? { estado } : {};
    
    // Búsqueda simple por nombre o email
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [solicitudes, total] = await Promise.all([
      Solicitud.find(query)
        .sort({ fecha: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Solicitud.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: solicitudes,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error("Error admin/solicitudes:", error);
    res.status(500).json({ success: false, error: "Error obteniendo solicitudes" });
  }
});

// ==========================================
// DETALLE COMPLETO
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    
    if (!solicitud) {
      return res.status(404).json({ success: false, error: "Solicitud no encontrada" });
    }

    res.json({ success: true, data: solicitud });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// CAMBIO DE ESTADO
// ==========================================

router.patch("/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    
    // Validar estado permitido (según tu schema actual)
    const estadosPermitidos = ["nuevo", "pendiente", "contactado", "cotizado", "aprobado", "rechazado", "finalizado"];
    
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ 
        success: false, 
        error: `Estado inválido. Permitidos: ${estadosPermitidos.join(", ")}` 
      });
    }
    
    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ success: false, error: "Solicitud no encontrada" });
    }
    
    res.json({ 
      success: true, 
      message: `Estado actualizado a ${estado}`,
      data: { id: solicitud._id, estado: solicitud.estado }
    });
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==========================================
// AGREGAR NOTA
// ==========================================

router.post("/:id/notas", async (req, res) => {
  try {
    const { contenido, autor } = req.body;
    
    if (!contenido?.trim()) {
      return res.status(400).json({ success: false, error: "El contenido es obligatorio" });
    }
    
    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          notas: { 
            contenido: contenido.trim(),
            autor: autor || req.user?.nombre || "Admin",
            fecha: new Date()
          } 
        } 
      },
      { new: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ success: false, error: "Solicitud no encontrada" });
    }
    
    res.json({ 
      success: true, 
      message: "Nota agregada",
      data: solicitud.notas[solicitud.notas.length - 1]
    });
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;