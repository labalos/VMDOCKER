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

app.use(cors(corsOptions));
// Preflight solo para API (evita wildcards inválidos)
app.options('/api/*', cors(corsOptions));

// ...existing code de rutas y middlewares...

module.exports = app;

