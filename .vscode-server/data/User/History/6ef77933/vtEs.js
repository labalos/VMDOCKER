const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const { upload, processAndUpload } = require('../middleware/upload');

router.get("/", async (req, res) => {
  try {
    const { search, categoria, ubicacion, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { titulo: new RegExp(search, "i") },
        { descripcion: new RegExp(search, "i") },
      ];
    }
    if (categoria) query.categoria = categoria;
    if (ubicacion) query.ubicacion = ubicacion;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Proyecto.find(query).skip(skip).limit(Number(limit)).lean(),
      Proyecto.countDocuments(query),
    ]);

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error obteniendo proyectos:", error);
    res.status(500).json({ error: "Error obteniendo proyectos" });
  }
});

// ⭐ POST /api/proyectos — crear un proyecto
router.post("/", async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    const guardado = await nuevoProyecto.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error creando proyecto:", error);
    res.status(400).json({ error: "Error al crear el proyecto" });
  }
});

router.post("/:id/imagenes", upload.single("imagen"), processAndUpload, async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) return res.status(404).json({ error: "Proyecto no encontrado" });

    // Usa la URL devuelta por Cloudinary
    const url = req.uploadResult?.url;
    if (!url) return res.status(500).json({ error: "No se obtuvo URL de la imagen" });

    proyecto.imagenes = [...(proyecto.imagenes || []), url];
    await proyecto.save();

    res.json(proyecto);
  } catch (e) {
    console.error("Error subiendo imagen al proyecto:", e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;