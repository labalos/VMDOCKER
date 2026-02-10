const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenes: { type: [String], default: [] },
  categoria: { type: String },
  fecha: { type: Date },
  ubicacion: { type: String }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);
