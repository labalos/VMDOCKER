// server.js - Versión optimizada y compatible con Mongoose 9.x
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./database');

// Importar middlewares
const auth = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');

// Inicializar app
const app = express();

// NECESARIO para que req.body funcione
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 1. CONFIGURACIÓN DE SEGURIDAD Y MIDDLEWARES
// ============================================
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.1.28:5174'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(morgan('combined'));

// Endpoint de depuración de la BD
app.get('/api/debug/db', async (req, res) => {
  try {
    const state = mongoose.connection.readyState; // 0=disc,1=conn,2=connecting,3=disconnecting
    const dbName = mongoose.connection.name;
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const count = await mongoose.connection.db.collection('proyectos').countDocuments().catch(() => 0);

    res.json({
      state,
      dbName,
      uri,
      collections: collections.map(c => c.name),
      proyectosCount: count,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/debug/db/counts', async (req, res) => {
  try {
    const cols = await mongoose.connection.db.listCollections().toArray();
    const counts = {};
    for (const c of cols) {
      counts[c.name] = await mongoose.connection.db.collection(c.name).countDocuments();
    }
    res.json({ dbName: mongoose.connection.name, counts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// 6. CONFIGURAR RUTAS DE LA API
// ============================================

const authRoutes = require('./routes/auth');
const proyectosRoutes = require('./routes/proyectos');
const solicitudesRoutes = require('./routes/solicitudes');
const uploadRoutes = require('./routes/upload');
const adminProyectosRoutes = require('./routes/admin/proyectos');
const adminSolicitudesRoutes = require('./routes/admin/solicitudes');

// Rutas públicas (prefijos correctos)
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);      // ✅ api/proyectos
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/upload', uploadRoutes);

// Rutas admin protegidas
app.use('/api/admin/proyectos', auth, adminAuth, adminProyectosRoutes);
app.use('/api/admin/solicitudes', auth, adminAuth, adminSolicitudesRoutes);

// ============================================
// 7. MANEJO DE ERRORES GLOBAL
// ============================================

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.url,
    method: req.method,
  });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error('🔥 Error global:', error.stack || error);

  // Errores de validación
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: Object.values(error.errors).map(e => e.message),
    });
  }

  // Errores de duplicado en MongoDB
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: 'Registro duplicado',
      message: `El ${field} ya existe en el sistema`,
    });
  }

  // Errores de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado',
    });
  }

  // Error por defecto
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      fullError: error 
    }),
  });
});

// ============================================
// 8. CONFIGURACIÓN DEL SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

// Solo iniciar servidor si no estamos en entorno de tests
let server;
if (process.env.NODE_ENV !== 'test') {
  // Conecta BD antes de levantar el servidor
  connectDB().then(() => {
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`
    🚀 Servidor iniciado exitosamente
    📍 Puerto: ${PORT}
    🌍 Entorno: ${process.env.NODE_ENV || 'development'}
    ⏰ Hora: ${new Date().toLocaleString()}
    
    🔗 Endpoints disponibles:
       - http://localhost:${PORT}/
       - http://localhost:${PORT}/health
       - http://localhost:${PORT}/api/auth
       - http://localhost:${PORT}/api/proyectos
       - http://localhost:${PORT}/api/admin/proyectos
       - http://localhost:${PORT}/api/debug/auth
    
    📊 Base de datos: ${mongoose.connection.readyState === 1 ? '✅ Conectada' : '❌ Desconectada'}
    `);
    });
  }).catch((err) => {
    console.error('❌ No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });

  // Manejo de cierre elegante
  const shutdown = async (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`);
    server.close(async () => {
      console.log('✅ Servidor cerrado.');
      try {
        await mongoose.connection.close();
        console.log('✅ Conexión a MongoDB cerrada.');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error cerrando MongoDB:', error.message);
        process.exit(1);
      }
    });
    setTimeout(() => {
      console.error('⚠️ Forzando cierre...');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('uncaughtException', (error) => {
    console.error('⚠️ Error no capturado:', error.message);
    shutdown('uncaughtException');
  });
  process.on('unhandledRejection', (reason) => {
    console.error('⚠️ Promesa rechazada no manejada:', reason);
    shutdown('unhandledRejection');
  });
}

// Exportar app para testing
module.exports = app;