const multer = require('multer');
const sharp = require('sharp');
const { v2: cloudinary } = require('cloudinary');

// Multer en memoria (no escribe a disco)
const upload = multer({ storage: multer.memoryStorage() });

// Procesa imagen y sube a Cloudinary
async function processAndUpload(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });

    // Resize y conversión a webp
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 1600, height: 900, fit: 'inside' })
      .toFormat('webp', { quality: 80 })
      .toBuffer();

    const folder = 'proyectos';
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', format: 'webp' },
        (err, resUpload) => (err ? reject(err) : resolve(resUpload))
      );
      stream.end(buffer);
    });

    // Adjunta resultado para usar en la ruta
    req.uploadResult = {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };

    next();
  } catch (err) {
    console.error('Error subiendo imagen:', err);
    res.status(500).json({ error: 'Error al procesar o subir la imagen' });
  }
}

module.exports = { upload, processAndUpload };