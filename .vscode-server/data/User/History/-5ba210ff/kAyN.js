const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/proyectos_db';
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado:', mongoose.connection.host);
    console.log('📊 Base de datos:', mongoose.connection.name);
    return true;
  } catch (error) {
    console.error('❌ Error MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;