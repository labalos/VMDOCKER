require("dotenv").config();
const mongoose = require("mongoose");
const Proyecto = require("../models/Proyecto"); // Ajusta si tu path es distinto
const conectarDB = require("../database");

async function seed() {
  await conectarDB();

  // Borra los proyectos existentes (opcional)
  await Proyecto.deleteMany({});

  const proyectos = [
    {
      titulo: "Edificio Central",
      categoria: "Comercial",
      ubicacion: "Pittsburgh",
      descripcion: "Construcción de un edificio de oficinas de 12 pisos",
      imagenes: [
        "https://via.placeholder.com/600x400?text=Edificio+1",
        "https://via.placeholder.com/600x400?text=Edificio+2"
      ]
    },
    {
      titulo: "Residencia Moderna",
      categoria: "Residencial",
      ubicacion: "New York",
      descripcion: "Casa moderna con diseño minimalista",
      imagenes: [
        "https://via.placeholder.com/600x400?text=Casa+1"
      ]
    },
    {
      titulo: "Centro Comercial Downtown",
      categoria: "Comercial",
      ubicacion: "Los Angeles",
      descripcion: "Ampliación y remodelación del centro comercial",
      imagenes: [
        "https://via.placeholder.com/600x400?text=Centro+1",
        "https://via.placeholder.com/600x400?text=Centro+2",
        "https://via.placeholder.com/600x400?text=Centro+3"
      ]
    }
  ];

  await Proyecto.insertMany(proyectos);
  console.log("✅ Proyectos de prueba insertados correctamente");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
