require("dotenv").config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Seguridad HTTP
const conectarDB = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONEXIÓN A DB
// ==========================================
conectarDB();

// ==========================================
// SEGURIDAD
// ==========================================
app.use(helmet()); // Cabeceras seguras

// ==========================================
// CORS
// ==========================================
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://192.168.1.28:5173',
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-token', 'Accept'],
  credentials: true
};
app.use(cors(corsOptions));

// ==========================================
// BODY PARSER
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// LOGGING DE REQUESTS
// ==========================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

console.log("🚀 Backend iniciado en modo desarrollo");

// ==========================================
// RUTAS
// ==========================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Proyectos
const proyectosRouter = require('./routes/proyectos');
app.use('/api/proyectos', proyectosRouter);

// Upload
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Auth
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Solicitudes
const solicitudesRouter = require("./routes/solicitudes");
app.use("/api/solicitudes", solicitudesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API Construction Pro ✅',
    version: '1.0.0',
    endpoints: ['/api/proyectos', '/api/upload', '/api/auth', '/api/solicitudes']
  });
});

// ==========================================
// ERRORES
// ==========================================

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.path });
});

// 500
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Contacta al administrador'
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend: http://localhost:${PORT}`);
  console.log(`✅ Health:  http://localhost:${PORT}/health`);
  console.log(`🌐 CORS:    localhost, 192.168.1.28`);
});
