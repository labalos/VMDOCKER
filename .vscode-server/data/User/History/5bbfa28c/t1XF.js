const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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