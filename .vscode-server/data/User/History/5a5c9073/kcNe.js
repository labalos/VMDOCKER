const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

console.log(">>> Archivo proyectos.js CARGADO <<<");


// ===============================
// GET /proyectos — obtener proyectos con filtros
// ===============================
router.get("/", async (req, res) => {

  console.log(">>> ENTRÓ A LA RUTA GET /proyectos");

  const query = {};

  if (req.query.search) {
    query.$or = [
      { titulo: new RegExp(req.query.search, "i") },
      { descripcion: new RegExp(req.query.search, "i") }
    ];
  }

  if (req.query.categoria) {
    query.categoria = new RegExp(`^${req.query.categoria}$`, "i");
  }

  if (req.query.ubicacion) {
    query.ubicacion = new RegExp(`^${req.query.ubicacion}$`, "i");
  }

  if (req.query.fecha) {
    query.fecha = req.query.fecha;
  }

  console.log("Query final:", query);

  try {
    const proyectos = await Proyecto.find(query).sort({ fecha: -1 });
    res.json(proyectos);
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

    const nuevoProyecto = new Proyecto({
      ...req.body,
      imagenes
    });

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
