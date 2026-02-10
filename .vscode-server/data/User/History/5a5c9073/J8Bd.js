// routes/admin/proyectos.js
const express = require('express');
const router = express.Router();
const Proyecto = require('../../models/Proyecto');
const Usuario = require('../../models/Usuario');
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

// Aplicar autenticación y autorización admin a TODAS las rutas
router.use(auth);
router.use(adminAuth);

// ===============================
// GET /admin/proyectos — Obtener TODOS los proyectos con filtros
// ===============================
router.get("/", async (req, res) => {
  console.log(`👑 Admin ${req.usuario.email} accediendo a proyectos`);

  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      categoria, 
      estado,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId
    } = req.query;

    const query = {};

    // Filtros
    if (search) {
      query.$or = [
        { titulo: new RegExp(search, "i") },
        { descripcion: new RegExp(search, "i") },
        { tecnologias: new RegExp(search, "i") }
      ];
    }

    if (categoria && categoria !== 'todas') {
      query.categoria = new RegExp(`^${categoria}$`, "i");
    }

    if (estado && estado !== 'todos') {
      query.estado = estado;
    }

    if (userId) {
      query.userId = userId;
    }

    // Paginación
    const skip = (page - 1) * limit;
    
    // Ordenamiento
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Ejecutar consultas con populate
    const [proyectos, total] = await Promise.all([
      Proyecto.find(query)
        .populate('userId', 'nombre email role')
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
      usuario: proyecto.userId ? {
        id: proyecto.userId._id,
        nombre: proyecto.userId.nombre,
        email: proyecto.userId.email,
        role: proyecto.userId.role
      } : null,
      _id: proyecto._id.toString(),
      // URLs para acciones
      acciones: {
        ver: `/admin/proyectos/${proyecto._id}`,
        editar: `/admin/proyectos/${proyecto._id}/editar`,
        eliminar: `/admin/proyectos/${proyecto._id}`,
      }
    }));

    // Obtener estadísticas para filtros
    const [categorias, estados] = await Promise.all([
      Proyecto.distinct('categoria'),
      Proyecto.distinct('estado')
    ]);

    res.json({
      success: true,
      data: proyectosFormateados,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filtros: {
        categorias: categorias.filter(c => c),
        estados: estados.filter(e => e),
      },
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        role: req.usuario.role
      }
    });

  } catch (error) {
    console.error("❌ Error en GET /admin/proyectos:", error);
    res.status(500).json({ 
      success: false,
      error: "Error obteniendo proyectos",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===============================
// GET /admin/proyectos/:id — Obtener proyecto específico
// ===============================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id)
      .populate('userId', 'nombre email telefono createdAt')
      .lean();

    if (!proyecto) {
      return res.status(404).json({ 
        success: false,
        error: 'Proyecto no encontrado' 
      });
    }

    // Agregar información adicional para admin
    const proyectoConInfo = {
      ...proyecto,
      fechaFormateada: new Date(proyecto.createdAt).toLocaleDateString('es-ES'),
      fechaActualizacion: proyecto.updatedAt 
        ? new Date(proyecto.updatedAt).toLocaleDateString('es-ES')
        : null,
      totalSolicitudes: 0, // Podrías agregar un count de solicitudes
      usuario: proyecto.userId ? {
        id: proyecto.userId._id,
        nombre: proyecto.userId.nombre,
        email: proyecto.userId.email,
        telefono: proyecto.userId.telefono,
        miembroDesde: new Date(proyecto.userId.createdAt).toLocaleDateString('es-ES')
      } : null
    };

    res.json({
      success: true,
      data: proyectoConInfo,
      permisos: {
        puedeEditar: true,
        puedeEliminar: true,
        puedeCambiarEstado: true
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
// PUT /admin/proyectos/:id — Actualizar proyecto
// ===============================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  console.log(`👑 Admin ${req.usuario.email} actualizando proyecto ${id}`);

  try {
    // Verificar que el proyecto exista
    const proyectoExistente = await Proyecto.findById(id);
    if (!proyectoExistente) {
      return res.status(404).json({ 
        success: false,
        error: 'Proyecto no encontrado' 
      });
    }

    // Registrar quién hizo el cambio
    datosActualizados.modificadoPor = req.usuario._id;
    datosActualizados.fechaModificacion = new Date();

    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      id,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    ).populate('userId', 'nombre email').lean();

    // Log de la acción
    console.log(`✅ Proyecto ${id} actualizado por admin ${req.usuario.email}`);

    res.json({
      success: true,
      data: proyectoActualizado,
      message: 'Proyecto actualizado correctamente',
      cambios: Object.keys(datosActualizados)
    });

  } catch (error) {
    console.error("❌ Error actualizando proyecto:", error);

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
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar el proyecto' 
    });
  }
});

// ===============================
// DELETE /admin/proyectos/:id — Eliminar proyecto
// ===============================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(`👑 Admin ${req.usuario.email} eliminando proyecto ${id}`);

  try {
    // Verificar que el proyecto exista
    const proyectoExistente = await Proyecto.findById(id);
    if (!proyectoExistente) {
      return res.status(404).json({ 
        success: false,
        error: 'Proyecto no encontrado' 
      });
    }

    const proyectoEliminado = await Proyecto.findByIdAndDelete(id).lean();

    // Log de la acción
    console.log(`🗑️ Proyecto ${id} eliminado por admin ${req.usuario.email}`);

    res.json({
      success: true,
      message: 'Proyecto eliminado correctamente',
      data: proyectoEliminado,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Error eliminando proyecto:", error);

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
// GET /admin/proyectos/stats/estadisticas — Estadísticas
// ===============================
router.get("/stats/estadisticas", async (req, res) => {
  try {
    const [
      totalProyectos,
      proyectosActivos,
      proyectosPendientes,
      proyectosCompletados,
      proyectosPorCategoria,
      proyectosPorMes,
      ultimosProyectos
    ] = await Promise.all([
      Proyecto.countDocuments(),
      Proyecto.countDocuments({ estado: 'activo' }),
      Proyecto.countDocuments({ estado: 'pendiente' }),
      Proyecto.countDocuments({ estado: 'completado' }),
      Proyecto.aggregate([
        { $match: { categoria: { $ne: null } } },
        { $group: { _id: "$categoria", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Proyecto.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Proyecto.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'nombre email')
        .lean()
    ]);

    // Formatear proyectos por mes
    const graficoProyectos = proyectosPorMes.map(item => ({
      mes: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      cantidad: item.count
    }));

    // Formatear últimos proyectos
    const ultimosProyectosFormateados = ultimosProyectos.map(proyecto => ({
      id: proyecto._id,
      titulo: proyecto.titulo,
      estado: proyecto.estado,
      fecha: new Date(proyecto.createdAt).toLocaleDateString('es-ES'),
      usuario: proyecto.userId ? proyecto.userId.nombre : 'Sin usuario'
    }));

    res.json({
      success: true,
      stats: {
        total: totalProyectos,
        activos: proyectosActivos,
        pendientes: proyectosPendientes,
        completados: proyectosCompletados,
        porCategoria: proyectosPorCategoria,
        grafico: graficoProyectos,
        ultimosProyectos: ultimosProyectosFormateados
      },
      updatedAt: new Date().toISOString(),
      generadoPor: req.usuario.email
    });

  } catch (error) {
    console.error("❌ Error en estadísticas:", error);
    res.status(500).json({ 
      success: false,
      error: "Error obteniendo estadísticas" 
    });
  }
});

// ===============================
// PATCH /admin/proyectos/:id/estado — Cambiar estado
// ===============================
router.patch("/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { estado, motivo } = req.body;

  console.log(`👑 Admin ${req.usuario.email} cambiando estado del proyecto ${id} a ${estado}`);

  try {
    const estadosPermitidos = ['activo', 'pendiente', 'completado', 'rechazado', 'pausado'];
    
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        error: `Estado inválido. Debe ser uno de: ${estadosPermitidos.join(', ')}`
      });
    }

    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      id,
      { 
        $set: { 
          estado,
          motivoCambioEstado: motivo,
          estadoCambiadoPor: req.usuario._id,
          fechaCambioEstado: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate('userId', 'nombre email').lean();

    if (!proyectoActualizado) {
      return res.status(404).json({ 
        success: false,
        error: 'Proyecto no encontrado' 
      });
    }

    // Aquí podrías enviar una notificación al usuario
    // await enviarNotificacionEstado(proyectoActualizado.userId.email, estado, motivo);

    res.json({
      success: true,
      data: proyectoActualizado,
      message: `Estado cambiado a "${estado}" correctamente`
    });

  } catch (error) {
    console.error("❌ Error cambiando estado:", error);
    res.status(500).json({ 
      success: false,
      error: 'Error al cambiar el estado' 
    });
  }
});

module.exports = router;