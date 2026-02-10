const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"]
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"]
  },
  categoria: {
    type: String,
    required: [true, "La categoría es obligatoria"]
  },
  ubicacion: {
    type: String,
    
  },
  imagenes: {
    type: [String],
    default: []
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Proyecto', ProyectoSchema);

