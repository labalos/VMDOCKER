

const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname.toLowerCase()); // extrae .jpg, .png, etc. y si viene JPG lo convierte en minisculas jpg
      cb(null, uuid() + ext); // nombre único + extensión
    }
  });
  
  const upload = multer({ storage });



router.post("/", upload.single("imagen"), async (req, res) => {

    console.log(">>> ENTRÓ A LA RUTA POST /upload");
    console.log("req.file:", req.file);
  
  

  try {
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      public_id: uuid(),
      folder: "proyectos"
    });

    fs.unlinkSync(req.file.path);

    res.json({ url: resultado.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error subiendo imagen" });
  }
});

module.exports = router;