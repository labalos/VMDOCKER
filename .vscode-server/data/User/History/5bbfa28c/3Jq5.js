

const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const router = express.Router();
const sharp = requiere("sharp");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname.toLowerCase()); // extrae .jpg, .png, etc. y si viene JPG lo convierte en minisculas jpg
      console.log(">>> EXTENSION GENERADA:", ext);
      cb(null, uuid() + ext); // nombre único + extensión
    }
  });
  
  const upload = multer({ storage });

  router.post("/upload", upload.single("imagen"), async (req, res) => {
    try {
      const absolutePath = path.resolve(req.file.path);
      console.log(">>> ABSOLUTE PATH:", absolutePath);
  
      // 🔧 Reparar/convertir la imagen con sharp
      const fixedPath = absolutePath + "_fixed.jpg";
  
      await sharp(absolutePath)
        .jpeg({ quality: 90 })
        .toFile(fixedPath);
  
      // 📤 Subir a Cloudinary la imagen reparada
      const resultado = await cloudinary.uploader.upload(fixedPath, {
        public_id: uuid(),
        folder: "proyectos"
      });
  
      res.json({ url: resultado.secure_url });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al subir imagen" });
    }
  });

module.exports = router;