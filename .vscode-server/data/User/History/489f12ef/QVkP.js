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
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
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
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // ✅ Esto agrega createdAt y updatedAt automáticamente
});

// ⚠️ ELIMINA TODOS LOS MIDDLEWARE TEMPORALMENTE
// SolicitudSchema.pre("save", function(next) {
//   // COMENTA TODO ESTO TEMPORALMENTE
//   next();
// });

// Índices básicos
SolicitudSchema.index({ estado: 1 });
SolicitudSchema.index({ fecha: -1 });

module.exports = mongoose.model("Solicitud", SolicitudSchema);