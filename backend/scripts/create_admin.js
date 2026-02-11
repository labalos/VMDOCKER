const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

(async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyectos_db';
  await mongoose.connect(uri);

  const email = 'abainf@gmail.com';
  const passwordPlano = '123456';
  const hash = await bcrypt.hash(passwordPlano, 10);

  let user = await Usuario.findOne({ email });
  if (user) {
    user.password = hash;
    user.role = 'admin';
    user.estado = 'activo';
    await user.save();
    console.log('Admin actualizado:', email);
  } else {
    await Usuario.create({ nombre: 'Admin', email, password: hash, role: 'admin', estado: 'activo' });
    console.log('Admin creado:', email);
  }

  await mongoose.disconnect();
  process.exit(0);
})();