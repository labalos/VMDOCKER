const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./database'); // ← importa conexión Mongo

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad (ajusta CSP para dev)
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "connect-src": [
        "'self'",
        "http://localhost:3001",
        "http://backend:3001"
      ],
      "img-src": ["'self'", "data:", "blob:"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.1.28:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Conectar a Mongo antes de rutas
connectDB(); // ← llama la conexión

// ⭐ IMPORTAR RUTAS
const proyectosRoutes = require('./routes/proyectos');
const solicitudesRoutes = require('./routes/solicitudes');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente' });
});

// ⭐ MONTAR RUTAS
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://0.0.0.0:${PORT}`);
});

module.exports = app;