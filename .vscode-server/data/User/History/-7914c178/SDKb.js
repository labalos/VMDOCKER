const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  ubicacion: { type: String },
  imagenes: { type: [String], default: [] },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);

