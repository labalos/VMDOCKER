const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

console.log(">>> Archivo proyectos.js CARGADO <<<");


// GET /proyectos — obtener todos los proyectos

router.get("/", async (req, res) => {

  try {
    const filtro = {};

    // BÚSQUEDA POR TEXTO (título o descripción)
    if (req.query.search) {
      filtro.$or = [
        { titulo: new RegExp(req.query.search, "i") },
        { descripcion: new RegExp(req.query.search, "i") }
      ];
    }

    // FILTRO POR CATEGORÍA
    if (req.query.categoria) {
      filtro.categoria = req.query.categoria;
    }

    // FILTRO POR UBICACIÓN
    if (req.query.ubicacion) {
      filtro.ubicacion = req.query.ubicacion;
    }

    // FILTRO POR FECHA EXACTA
    if (req.query.fecha) {
      filtro.fecha = req.query.fecha;
    }

    const proyectos = await Proyecto.find(filtro);
    res.json(proyectos);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo proyectos" });
  }
});

// POST /proyectos — crear un proyecto
router.post('/', async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    const proyectoGuardado = await nuevoProyecto.save();
    res.status(201).json(proyectoGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el proyecto' });
  }
});

// GET /proyectos/:id — obtener un proyecto por ID
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

// PUT /proyectos/:id — actualizar parcialmente un proyecto
router.put('/:id', async (req, res) => {
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
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
});

// DELETE /proyectos/:id — eliminar un proyecto
router.delete('/:id', async (req, res) => {
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

    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
});

module.exports = router;
