require("dotenv").config();

const express = require('express');
const cors = require('cors');
const conectarDB = require('./database');

const app = express();
const PORT = 3000;

conectarDB();
app.use(cors());
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

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});