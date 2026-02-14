// scripts/verificar-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

async function verificarAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('🔍 Verificando usuarios administradores...\n');
    
    const admins = await Usuario.find({ role: 'admin' })
      .select('nombre email role createdAt estado')
      .lean();
    
    if (admins.length === 0) {
      console.log('❌ NO HAY USUARIOS ADMINISTRADORES');
      console.log('\nPara crear un admin, ejecuta en MongoDB:');
      console.log(`
        db.usuarios.updateOne(
          { email: "admin@ejemplo.com" },
          { $set: { role: "admin" } }
        )
      `);
    } else {
      console.log(`✅ ${admins.length} Administradores encontrados:\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.nombre} (${admin.email})`);
        console.log(`   Rol: ${admin.role} | Estado: ${admin.estado || 'activo'}`);
        console.log(`   Creado: ${new Date(admin.createdAt).toLocaleDateString()}`);
        console.log('');
      });
    }
    
    // Verificar proyectos
    const Proyecto = require('../models/Proyecto');
    const totalProyectos = await Proyecto.countDocuments();
    console.log(`📊 Total de proyectos en sistema: ${totalProyectos}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔗 Conexión cerrada');
  }
}

verificarAdmins();