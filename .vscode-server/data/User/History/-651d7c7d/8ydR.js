const mongoose = require("mongoose");
const Proyecto = require("./models/Proyecto"); // Ajusta la ruta si es necesario

async function migrar() {
  try {
    await mongoose.connect("mongodb://localhost:27017/portafolio");

    console.log("Conectado a MongoDB");

    const proyectos = await Proyecto.find();

    for (const p of proyectos) {
      if (p.imagen && (!p.imagenes || p.imagenes.length === 0)) {
        p.imagenes = [p.imagen];
        p.imagen = undefined; // elimina el campo viejo
        await p.save();
        console.log(`Migrado: ${p.titulo}`);
      }
    }

    console.log("Migración completada");
    process.exit();

  } catch (error) {
    console.error("Error en la migración:", error);
    process.exit(1);
  }
}

migrar();