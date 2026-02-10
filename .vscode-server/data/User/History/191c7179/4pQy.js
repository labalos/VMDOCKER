// server.js - Versión optimizada y compatible con Mongoose 9.x
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Inicializar app
const app = express();

// ============================================
// 1. CONFIGURACIÓN DE SEGURIDAD Y MIDDLEWARES
// ============================================

// Helmet para seguridad de headers HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configurable
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging con Morgan
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Parsear JSON y URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// 2. CONEXIÓN A MONGODB
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/proyectos_db';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB conectado exitosamente');
  
  // Verificar índices después de conectar
  setTimeout(async () => {
    try {
      const Proyecto = require('./models/Proyecto');
      const indices = await Proyecto.collection.getIndexes();
      console.log('📊 Índices de Proyectos:', Object.keys(indices));
    } catch (error) {
      console.log('⚠️ No se pudieron verificar índices:', error.message);
    }
  }, 1000);
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error.message);
  
  // En desarrollo, intentar conectar a localhost
  if (process.env.NODE_ENV === 'development' && MONGODB_URI.includes('localhost')) {
    console.log('🔄 Intentando conectar a MongoDB local...');
    mongoose.connect('mongodb://127.0.0.1:27017/proyectos_db')
      .then(() => console.log('✅ Conectado a MongoDB local'))
      .catch(err => console.error('❌ Falló conexión local:', err.message));
  }
});

// Eventos de conexión MongoDB
mongoose.connection.on('error', (err) => {
  console.error('❌ Error de MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

// ============================================
// 3. MIDDLEWARES PERSONALIZADOS
// ============================================

// Middleware de logging personalizado
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
});

// Middleware para inyectar info de entorno (solo desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.locals.env = process.env.NODE_ENV;
    next();
  });
}

// ============================================
// 4. IMPORTAR Y CONFIGURAR RUTAS
// ============================================

// Importar rutas
const proyectosRoutes = require('./routes/proyectos');
const authRoutes = require('./routes/auth');
const solicitudesRoutes = require('./routes/solicitudes');
const uploadRoutes = require('./routes/upload');

// Importar rutas de administrador
const adminProyectosRoutes = require('./routes/admin/proyectos');
const adminSolicitudesRoutes = require('./routes/admin/solicitudes');

// ============================================
// 5. RUTAS PRINCIPALES
// ============================================

// Ruta de bienvenida/health check
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión de Proyectos',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      proyectos: '/api/proyectos',
      admin: '/api/admin',
      solicitudes: '/api/solicitudes',
      upload: '/api/upload',
    },
    documentation: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:' + (process.env.PORT || 3001) + '/api/docs'
      : 'Consulte la documentación',
    uptime: process.uptime(),
  });
});

// Health check detallado
app.get('/health', async (req, res) => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV,
  };

  const statusCode = healthcheck.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(healthcheck);
});

// Debug endpoint para verificar autenticación
app.get('/api/debug/auth', require('./middleware/auth'), (req, res) => {
  res.json({
    success: true,
    message: 'Autenticación exitosa',
    usuario: {
      id: req.usuario._id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      role: req.usuario.role,
      estado: req.usuario.estado || 'activo',
    },
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// 6. CONFIGURAR RUTAS DE LA API
// ============================================

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/upload', uploadRoutes);

// Rutas de administrador (con prefijo /api/admin)
app.use('/api/admin/proyectos', adminProyectosRoutes);
app.use('/api/admin/solicitudes', adminSolicitudesRoutes);

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
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
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

    // Forzar cierre después de 10 segundos
    setTimeout(() => {
      console.error('⚠️ Forzando cierre...');
      process.exit(1);
    }, 10000);
  };

  // Manejar señales de terminación
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    console.error('⚠️ Error no capturado:', error.message);
    shutdown('uncaughtException');
  });

  // Manejar promesas rechazadas no manejadas
  process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Promesa rechazada no manejada:', reason);
  });
}

// Exportar app para testing
module.exports = app;