// routes/admin/solicitudes.js
const express = require('express');
const router = express.Router();
const Solicitud = require('../../models/Solicitud');
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

router.use(auth);
router.use(adminAuth);

// Obtener todas las solicitudes
router.get("/", async (req, res) => {
  try {
    const solicitudes = await Solicitud.find()
      .populate('usuarioId', 'nombre email')
      .populate('proyectoId', 'titulo')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: solicitudes,
      count: solicitudes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error obteniendo solicitudes"
    });
  }
});

module.exports = router;