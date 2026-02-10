// routes/admin/proyectos.js
const express = require('express');
const router = express.Router();
const Proyecto = require('../../models/Proyecto');
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

console.log(">>> Archivo admin/proyectos.js CARGADO <<<");

// Aplicar autenticación y autorización admin a TODAS las rutas
router.use(auth);
router.use(adminAuth);

// ===============================
// GET /admin/proyectos — Obtener TODOS los proyectos (solo admin)
// ===============================
router.get("/", async (req, res) => {
  console.log(">>> ENTRÓ A LA RUTA ADMIN GET /admin/proyectos");
  console.log("Usuario admin:", req.usuario.email);

  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      categoria, 
      estado,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Filtros
    if (search) {
      query.$or = [
        { titulo: new RegExp(search, "i") },
        { descripcion: new RegExp(search, "i") }
      ];
    }

    if (categoria) {
      query.categoria = new RegExp(`^${categoria}$`, "i");
    }

    if (estado) {
      query.estado = estado;
    }

    // Paginación
    const skip = (page - 1) * limit;
    
    // Ordenamiento
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Ejecutar consultas
    const [proyectos, total] = await Promise.all([
      Proyecto.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort(sort)
        .lean(),
      Proyecto.countDocuments(query)
    ]);

    // Formatear respuesta
    const proyectosFormateados = proyectos.map(proyecto => ({
      ...proyecto,
      fechaFormateada: new Date(proyecto.createdAt).toLocaleDateString('es-ES'),
      usuarioInfo: proyecto.userId ? {
        id: proyecto.userId,
        nombre: proyecto.nombreUsuario || 'Sin nombre'
      } : null
    }));

    res.json({
      success: true,
      data: proyectosFormateados,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        role: req.usuario.role
      }
    });

  } catch (error) {
    console.error("Error en GET /admin/proyectos:", error);
    res.status(500).json({ 
      success: false,
      error: "Error obteniendo proyectos" 
    });
  }
});

// ===============================
// GET /admin/proyectos/:id — Obtener proyecto específico (solo admin)
// ===============================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id).lean();

    if (!proyecto) {
      return res.status(404).json({ 
        success: false,
        error: 'Proyecto no encontrado' 
      });
    }

    res.json({
      success: true,
      data: proyecto,
      permisos: {
        puedeEditar: true,
        puedeEliminar: true
      }
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'ID inválido' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Error al obtener el proyecto' 
    });
  }
});

// ===============================
// PUT /admin/proyectos/:id — Actualizar proyecto (solo admin)
// ===============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  console.log(`Admin ${req.usuario.email} actualizando proyecto ${id}`);

  try {
    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      id,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    ).lean();

    if (!proyectoActualizado) {
      return res.status(404).json({ 
        success: false,
        error: 'Proyecto no encontrado' 
      });
    }

    res.json({
      success: true,
      data: proyectoActualizado,
      message: 'Proyecto actualizado correctamente'
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'ID inválido' 
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: 'Datos inválidos',
        details: error.errors 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar el proyecto' 
    });
  }
});

// ===============================
// DELETE /admin/proyectos/:id — Eliminar proyecto (solo admin)
// ===============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(`Admin ${req.usuario.email} eliminando proyecto ${id}`);

  try {
    const proyectoEliminado = await Proyecto.findByIdAndDelete(id).lean();

    if (!proyectoEliminado) {
      return res.status(404).json({ 
        success: false,
        error: 'Proyecto no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Proyecto eliminado correctamente',
      data: proyectoEliminado
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'ID inválido' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar el proyecto' 
    });
  }
});

// ===============================
// GET /admin/proyectos/stats — Estadísticas (solo admin)
// ===============================
router.get("/stats/estadisticas", async (req, res) => {
  try {
    const [
      totalProyectos,
      proyectosActivos,
      proyectosPendientes,
      proyectosCompletados,
      proyectosPorCategoria
    ] = await Promise.all([
      Proyecto.countDocuments(),
      Proyecto.countDocuments({ estado: 'activo' }),
      Proyecto.countDocuments({ estado: 'pendiente' }),
      Proyecto.countDocuments({ estado: 'completado' }),
      Proyecto.aggregate([
        { $group: { _id: "$categoria", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        total: totalProyectos,
        activos: proyectosActivos,
        pendientes: proyectosPendientes,
        completados: proyectosCompletados,
        porCategoria: proyectosPorCategoria
      },
      updatedAt: new Date()
    });

  } catch (error) {
    console.error("Error en stats:", error);
    res.status(500).json({ 
      success: false,
      error: "Error obteniendo estadísticas" 
    });
  }
});

module.exports = router;