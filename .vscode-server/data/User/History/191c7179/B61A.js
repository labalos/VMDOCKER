const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.1.28:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Aplica CORS global antes de las rutas
app.use(cors(corsOptions));
// Preflight solo para API (evita '*', usa patrón válido)
app.options('/api/*', cors(corsOptions));

