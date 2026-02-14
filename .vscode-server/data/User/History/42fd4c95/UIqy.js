const mongoose = require('mongoose');
const Proyecto = require('../models/Proyecto');

(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi_base_de_datos';
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB para seed');

    // Limpia y agrega datos de ejemplo
    await Proyecto.deleteMany({});
    await Proyecto.insertMany([
      { titulo: 'P1', descripcion: 'Desc 1', categoria: 'General', ubicacion: 'CDMX', imagenes: [] },
      { titulo: 'P2', descripcion: 'Desc 2', categoria: 'General', ubicacion: 'GDL', imagenes: [] },
    ]);

    console.log('Seed listo');
  } catch (e) {
    console.error('Error en seed:', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();