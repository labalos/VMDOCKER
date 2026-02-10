require("dotenv").config();

const express = require('express');
const cors = require('cors');
const conectarDB = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

// CONFIGURACIÓN COMPLETA DE CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://192.168.1.28:5173',  // ← AGREGAR ESTA
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-token', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware adicional para headers CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-token');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      message: 'CORS preflight successful'
    });
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🚀 Backend iniciado en modo desarrollo");

// RUTA DE PRUEBA
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    routes: {
      solicitudes: '/api/solicitudes',
      auth: '/api/auth',
      proyectos: '/proyectos',
      upload: '/upload'
    }
  });
});

// RUTAS
const proyectosRouter = require('./routes/proyectos');
app.use('/proyectos', proyectosRouter);

const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const solicitudesRouter = require("./routes/solicitudes");
app.use("/api/solicitudes", solicitudesRouter);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API Construction Pro - Funcionando ✅',
    version: '1.0.0',
    endpoints: {
      solicitudes: {
        POST: '/api/solicitudes',
        GET: '/api/solicitudes'
      },
      auth: '/api/auth',
      proyectos: '/proyectos',
      upload: '/upload'
    },
    cors: {
      allowedOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    availableRoutes: ['/api/solicitudes', '/api/auth', '/proyectos', '/upload']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error del servidor:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Contacta al administrador'
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend corriendo en: http://localhost:${PORT}`);
  console.log(`✅ Frontend esperado en: http://localhost:5173`);
  console.log(`✅ Ruta de solicitudes: http://localhost:${PORT}/api/solicitudes`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS configurado para: http://localhost:5173`);
});