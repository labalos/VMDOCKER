const mongoose = require("mongoose");

const SolicitudSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"]
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es obligatorio"]
  },
  email: {
    type: String
  },
  tipoServicio: {
    type: String
  },
  ubicacion: {
    type: String
  },
  descripcion: {
    type: String
  },
  presupuesto: {
    type: String
  },
  estado: {
    type: String,
    default: "nuevo"
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Solicitud", SolicitudSchema);