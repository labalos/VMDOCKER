const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const { v4: uuid } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, uuid() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const absolutePath = path.resolve(req.file.path);
    const fixedPath = absolutePath + "_fixed.jpg";

    await sharp(absolutePath).jpeg({ quality: 90 }).toFile(fixedPath);

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