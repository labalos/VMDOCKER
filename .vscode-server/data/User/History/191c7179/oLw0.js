const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./database'); // ← importa conexión Mongo
require('./config/cloudinary');

const app = express();

// Parsers de body (JSON y URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isDev = process.env.NODE_ENV !== 'production';

// Seguridad (ajusta CSP para dev)
app.use(
  helmet(
    isDev
      ? {
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
        }
      : {
          contentSecurityPolicy: {
            useDefaults: true
          },
          crossOriginEmbedderPolicy: false
        }
  )
);

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
const authMiddleware = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const proyectosRoutes = require('./routes/proyectos');
const solicitudesRoutes = require('./routes/solicitudes');
const uploadRoutes = require('./routes/upload');

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente' });
});

// ⭐ MONTAR RUTAS
// Login SIN auth
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/proyectos', authMiddleware, proyectosRoutes);
app.use('/api/solicitudes', authMiddleware, solicitudesRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://0.0.0.0:${PORT}`);
});

module.exports = app;