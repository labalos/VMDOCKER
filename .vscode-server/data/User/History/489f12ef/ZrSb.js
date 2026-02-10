const mongoose = require("mongoose");

const SolicitudSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,  //  Elimina espacios extras (no rompe nada)
    maxlength: [100, "El nombre no puede exceder 100 caracteres"] //  Límite seguro
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es obligatorio"],
    trim: true  //  Solo limpia espacios
  },
  email: {
    type: String,
    trim: true,  //  Solo limpia espacios
    lowercase: true  //  Guarda en minúsculas automáticamente
  },
  // MANTENEMOS "service" pero agregamos "servicio" como alias
  service: {
    type: String,
    required: [true, "El servicio es obligatorio"],
    trim: true
  },
  // Campo adicional que puedes usar en el futuro
  servicio: {
    type: String,
    trim: true,
    // Se llenará automáticamente si no se proporciona
    default: function() {
      return this.service;  // Copia de 'service' por defecto
    }
  },
  ubicacion: {
    type: String,
    trim: true  //  Solo limpia espacios
  },
  descripcion: {
    type: String,
    trim: true,  //  Solo limpia espacios
    maxlength: [1000, "La descripción no puede exceder 1000 caracteres"] //  Límite seguro
  },
  presupuesto: {
    type: String,  //  MANTENEMOS String por compatibilidad
    trim: true
  },
  // 🆕 Campo numérico opcional para el futuro
  presupuestoNumero: {
    type: Number,
    min: [0, "El presupuesto no puede ser negativo"],
    default: null
  },
  estado: {
    type: String,
    default: "nuevo",  //  MANTENEMOS "nuevo" por compatibilidad
    enum: ["nuevo", "pendiente", "contactado", "cotizado", "aprobado", "rechazado", "finalizado"] // Controla valores
  },
  fecha: {
    type: Date,
    default: Date.now,
    index: true  //  Mejora rendimiento sin romper nada
  },
  // 🆕 Campos opcionales que no afectan funcionalidad existente
  fechaContacto: {
    type: Date,
    default: null
  },
  //  Para saber cuándo fue actualizada por última vez
  actualizadoEn: {
    type: Date,
    default: Date.now
  }
}, {
  //  timestamp opcional (puedes activarlo luego)
  // timestamps: true  // Descomenta cuando quieras
});

//  Middleware seguro: se ejecuta antes de guardar
SolicitudSchema.pre("save", function(next) {
  // 1. Sincroniza 'service' y 'servicio' si uno cambia
  if (this.isModified("service") && this.service !== this.servicio) {
    this.servicio = this.service;
  }
  
  if (this.isModified("servicio") && this.servicio !== this.service) {
    this.service = this.servicio;
  }
  
  // 2. Convierte presupuesto a número si es posible
  if (this.presupuesto && !this.presupuestoNumero) {
    const num = parseFloat(this.presupuesto.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(num)) {
      this.presupuestoNumero = num;
    }
  }
  
  // 3. Actualiza 'actualizadoEn' automáticamente
  this.actualizadoEn = new Date();
  
  next();
});

// Índice para búsquedas comunes (no afecta datos)
SolicitudSchema.index({ estado: 1 });
SolicitudSchema.index({ fecha: -1 });

//  Método seguro para cambiar estado
SolicitudSchema.methods.cambiarEstado = function(nuevoEstado) {
  const estadosPermitidos = ["nuevo", "pendiente", "contactado", "cotizado", "aprobado", "rechazado", "finalizado"];
  
  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error(`Estado no válido. Usa: ${estadosPermitidos.join(", ")}`);
  }
  
  this.estado = nuevoEstado;
  
  // Registra fecha de contacto si es relevante
  if (nuevoEstado === "contactado" && !this.fechaContacto) {
    this.fechaContacto = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model("Solicitud", SolicitudSchema);