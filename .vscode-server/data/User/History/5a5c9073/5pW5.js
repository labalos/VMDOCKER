const express = require('express');
const router = express.Router();
const Proyecto = require('../../models/Proyecto');
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

console.log(">>> Archivo proyectos.js CARGADO <<<");


// ===============================
// GET /proyectos — listar con filtros y paginación
// ===============================
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

    res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error obteniendo proyectos:", error);
    res.status(500).json({ error: "Error obteniendo proyectos" });
  }
});


// ===============================
// POST /proyectos — crear proyecto (PROTEGIDO + IMÁGENES)
// ===============================
router.post("/", auth, upload.array("imagenes", 10), async (req, res) => {
  try {
    const imagenes = req.files?.map(file => file.path) || [];
    const nuevoProyecto = new Proyecto({ ...req.body, imagenes });
    const proyectoGuardado = await nuevoProyecto.save();
    res.status(201).json(proyectoGuardado);
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(400).json({ error: "Error al crear el proyecto" });
  }
});


// ===============================
// GET /proyectos/:id — obtener proyecto por ID
// ===============================
router.get('/:id', async (req, res) => {

  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(proyecto);

  } catch (error) {

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }

});


// ===============================
// PUT /proyectos/:id — actualizar proyecto (PROTEGIDO + IMÁGENES)
// ===============================
router.put("/:id", auth, upload.array("imagenes", 10), async (req, res) => {

  const { id } = req.params;

  try {

    let datosActualizados = { ...req.body };

    if (req.files?.length) {
      datosActualizados.imagenes = req.files.map(file => file.path);
    }

    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      id,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    );

    if (!proyectoActualizado) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(proyectoActualizado);

  } catch (error) {

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    console.error("Error al actualizar proyecto:", error);
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }

});


// ===============================
// DELETE /proyectos/:id — eliminar proyecto (PROTEGIDO)
// ===============================
router.delete("/:id", auth, async (req, res) => {

  const { id } = req.params;

  try {

    const proyectoEliminado = await Proyecto.findByIdAndDelete(id);

    if (!proyectoEliminado) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({
      mensaje: 'Proyecto eliminado correctamente',
      proyecto: proyectoEliminado
    });

  } catch (error) {

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }

});


module.exports = router;
