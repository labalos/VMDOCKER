const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs"); // 👈 IMPORTANTE
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, uuid() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post("/", upload.single("imagen"), async (req, res) => {
  console.log(">>> ENTRÓ A LA RUTA POST /upload");
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);

  try {
    // Validar si se recibió un archivo
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    // Validar el tipo de archivo
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "El archivo debe ser una imagen válida (JPEG, PNG, WEBP)" });
    }

    const absolutePath = path.resolve(req.file.path);
    const fixedPath = absolutePath + "_fixed.jpg";

   // Procesar la imagen con sharp (versión que repara JPEGs corruptos)
       await sharp(absolutePath, { failOnError: false })
       .jpeg({ quality: 90 })
       .toFile(fixedPath);
    // Subir la imagen procesada a Cloudinary
    const resultado = await cloudinary.uploader.upload(fixedPath, {
      public_id: uuid(),
      folder: "proyectos"
    });

    // Eliminar los archivos temporales
    fs.unlinkSync(absolutePath);
    fs.unlinkSync(fixedPath);

    res.json({ url: resultado.secure_url });

  } catch (error) {
    console.error("ERROR EN /upload:", error.message);
    console.error(error);

    // Manejo específico para errores de sharp
    if (error.message.includes("VipsJpeg")) {
      return res.status(400).json({ error: "El archivo de imagen está corrupto o es inválido" });
    }

    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;