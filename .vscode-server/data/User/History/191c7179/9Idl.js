const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad
app.use(helmet());

// CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.1.28:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // ← único uso de CORS

// ...existing code de rutas y middlewares...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://0.0.0.0:${PORT}`);
});

module.exports = app;

