
const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');

// GET /proyectos — listar todos los proyectos
router.get('/', async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});


// GET /proyectos/:id — obtener un proyecto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Buscar el proyecto por ID
    const proyecto = await Proyecto.findById(id);

    // 2. Si no existe → devolver 404
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // 3. Si existe → devolverlo
    res.json(proyecto);

  } catch (error) {
    // 4. Si el ID es inválido (CastError) → devolver 400
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // 5. Cualquier otro error → 500
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
});


// PUT /proyectos/:id — actualizar un proyecto parcialmente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    // 1. Actualizar solo los campos enviados
    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      id,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    );

    // 2. Si no existe → 404
    if (!proyectoActualizado) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // 3. Devolver el proyecto actualizado
    res.json(proyectoActualizado);

  } catch (error) {
    // 4. ID inválido → 400
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // 5. Error de validación → 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    // 6. Cualquier otro error → 500
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
});


// DELETE /proyectos/:id — eliminar un proyecto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Intentar eliminar el proyecto
    const proyectoEliminado = await Proyecto.findByIdAndDelete(id);

    // 2. Si no existe → 404
    if (!proyectoEliminado) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // 3. Si existe → devolver mensaje + proyecto eliminado
    res.json({
      mensaje: 'Proyecto eliminado correctamente',
      proyecto: proyectoEliminado
    });

  } catch (error) {
    // 4. ID inválido → 400
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // 5. Cualquier otro error → 500
    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
});


// POST /proyectos — crear un nuevo proyecto
router.post('/', async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    const proyectoGuardado = await nuevoProyecto.save();
    res.status(201).json(proyectoGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el proyecto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Proyecto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando proyecto' });
  }
});

module.exports = router;
