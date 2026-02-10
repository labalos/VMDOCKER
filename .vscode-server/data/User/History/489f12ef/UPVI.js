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
  },
  fechaContacto: {
    type: Date,
    default: null
  },
  fechaCierre: {
    type: Date,
    default: null
  }
}, {
  timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// ✅ MIDDLEWARE CORREGIDO - CON next()
SolicitudSchema.pre("save", function(next) {
  // Actualizar fechas según estado
  if (this.isModified("estado")) {
    if (this.estado === "contactado" && !this.fechaContacto) {
      this.fechaContacto = new Date();
    }
    
    if (["aprobado", "rechazado", "finalizado"].includes(this.estado) && !this.fechaCierre) {
      this.fechaCierre = new Date();
    }
  }
  
  // ✅ SIEMPRE llamar a next() en middleware de Mongoose
  next();
});

// Índices para mejor performance
SolicitudSchema.index({ estado: 1 });
SolicitudSchema.index({ fecha: -1 });
SolicitudSchema.index({ service: 1 });

module.exports = mongoose.model("Solicitud", SolicitudSchema);
