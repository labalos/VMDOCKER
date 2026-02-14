const multer = require('multer');
const sharp = require('sharp');
const { v2: cloudinary } = require('cloudinary');

// Multer: memoria (no escribe a disco)
const upload = multer({ storage: multer.memoryStorage() });= multer({ storage: multer.memoryStorage() });

// Middleware compuesto: procesa imagen y sube a Cloudinary procesa imagen y sube a Cloudinary
async function processAndUpload(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' }); if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });

    // Procesar con sharp (resize y calidad)    // Procesar con sharp (resize y calidad)
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 1600, height: 900, fit: 'inside' })
      .toFormat('webp', { quality: 80 })
      .toBuffer();





























module.exports = { upload, processAndUpload };}  }    res.status(500).json({ error: 'Error al procesar o subir la imagen' });    console.error('Error subiendo imagen:', err);  } catch (err) {    next();    };      format: result.format,      height: result.height,      width: result.width,      public_id: result.public_id,      url: result.secure_url,    req.uploadResult = {    // Adjunta URL al request para el controlador    });      stream.end(buffer);      );        (err, res) => (err ? reject(err) : resolve(res))        { folder, resource_type: 'image', format: 'webp' },      const stream = cloudinary.uploader.upload_stream(    const result = await new Promise((resolve, reject) => {    const folder = 'proyectos';    // Subir a Cloudinary via stream      .toBuffer();      .toBuffer();

    // Subir a Cloudinary via stream
    const folder = 'proyectos';
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(









module.exports = { upload, processAndUpload };
}
  }
    res.status(500).json({ error: 'Error al procesar o subir la imagen' });

    console.error('Error subiendo imagen:', err);
  } catch (err) {
    next();    };
      format: result.format,      height: result.height,
      width: result.width,
      public_id: result.public_id,      url: result.secure_url,    req.uploadResult = {    // Adjunta URL al request para el controlador
    });      stream.end(buffer);
      );
        (err, res) => (err ? reject(err) : resolve(res))        { folder, resource_type: 'image', format: 'webp' },