const mongoose = require('mongoose');

async function conectarDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/proyectos_db';

  try {
    await mongoose.connect(MONGO_URI); // ✅ No más options obsoletas
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = conectarDB;
