const mongoose = require('mongoose');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/proyectos_db';
  const max = 10;
  for (let i = 1; i <= max; i++) {
    try {
      await mongoose.connect(uri);
      console.log('✅ MongoDB conectado:', mongoose.connection.host);
      console.log('📊 Base de datos:', mongoose.connection.name);
      return true;
    } catch (err) {
      console.error(`❌ Intento ${i}/${max}: ${err.message}`);
      if (i === max) process.exit(1);
      await sleep(2000);
    }
  }
};

module.exports = connectDB;