const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const auth = require("../middleware/auth");

console.log(">>> Archivo proyectos.js CARGADO <<<");

// ===============================
// GET /proyectos — obtener todos los proyectos
// ===============================
router.get("/", async (req, res) => {
  try {
    console.log(">>> ENTRÓ A LA RUTA GET /proyectos");
    const proyectos = await Proyecto.find().lean();
    console.log("Total proyectos:", proyectos.length);

    // Evitar caché para que siempre haya cuerpo en la respuesta
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });

    res.status(200).json(proyectos);
  } catch (error) {
    console.error("Error obteniendo proyectos:", error);
    res.status(500).json({ error: "Error obteniendo proyectos" });
  }
});

// ===============================
// POST /proyectos — crear un nuevo proyecto
// ===============================
router.post("/", async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body); // Recibir datos dinámicos del cliente
    const proyectoGuardado = await nuevoProyecto.save();
    res.status(201).json(proyectoGuardado);
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
});

// ===============================
// GET /proyectos/:id — obtener un proyecto por ID
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
    console.error("Error obteniendo proyecto:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
});

// ===============================
// PUT /proyectos/:id — actualizar proyecto
// ===============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
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
    console.error("Error actualizando proyecto:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
});

// ===============================
// DELETE /proyectos/:id — eliminar proyecto
// ===============================
router.delete("/:id", async (req, res) => {
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
    console.error("Error eliminando proyecto:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
});

module.exports = router;

// Ensure to define MONGODB_URI in a .env file or configuration file