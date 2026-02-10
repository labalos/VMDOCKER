require("dotenv").config();

const express = require('express');
const cors = require('cors');
const conectarDB = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

// 🎯 CONFIGURACIÓN CORRECTA DE CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Puertos de Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-token'],
  credentials: true
}));

app.use(express.json());

console.log("Cargando rutas desde:", __dirname);

// RUTA DE PROYECTOS
const proyectosRouter = require('./routes/proyectos');
app.use('/proyectos', proyectosRouter);

// RUTA DE SUBIDA DE IMÁGENES
const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);

// RUTA DE AUTENTICACION
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// RUTA DE SOLICITUDES
const solicitudesRouter = require("./routes/solicitudes");
app.use("/api/solicitudes", solicitudesRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API funcionando correctamente',
    rutas: {
      solicitudes: '/api/solicitudes',
      auth: '/api/auth',
      proyectos: '/proyectos',
      upload: '/upload'
    }
  });
});

// Middleware para manejar errores de CORS
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}`);
  console.log(`✅ Frontend URL: http://localhost:5173`);
  console.log(`✅ Backend URL: http://localhost:${PORT}`);
  console.log(`✅ Ruta de solicitudes: http://localhost:${PORT}/api/solicitudes`);
});