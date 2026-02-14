const mongoose = require("mongoose");

const SolicitudSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    maxlength: [100, "El nombre no puede exceder 100 caracteres"]
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es obligatorio"],
    trim: true,
    match: [/^[0-9\s\-\+\(\)]{8,20}$/, "Formato de teléfono inválido"]
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Email inválido"]
  },
  service: {
    type: String,
    required: [true, "El servicio es obligatorio"],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    default: ""
  },
  ubicacion: {
    type: String,
    trim: true
  },
  presupuesto: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    default: "nuevo",
    enum: ["nuevo", "pendiente", "contactado", "cotizado", "aprobado", "rechazado", "finalizado"]
  },
  notas: [
    {
      contenido: String,
      autor: { type: String, default: "System" },
      fecha: { type: Date, default: Date.now }
    }
  ],
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejor rendimiento
SolicitudSchema.index({ estado: 1 });
SolicitudSchema.index({ fecha: -1 });
SolicitudSchema.index({ email: 1 });

module.exports = mongoose.model("Solicitud", SolicitudSchema);