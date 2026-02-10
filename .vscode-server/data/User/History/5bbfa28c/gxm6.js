import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuid } from "uuid";
import fs from "fs";

const router = express.Router();

// multer: guardar archivo temporalmente
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      public_id: uuid(),
      folder: "proyectos"
    });

    // borrar archivo temporal
    fs.unlinkSync(req.file.path);

    res.json({ url: resultado.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error subiendo imagen" });
  }
});

export default router;