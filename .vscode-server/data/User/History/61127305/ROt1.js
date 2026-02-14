const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('BODY RECIBIDO:', req.body);
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Faltan email o password' });
    }

    const usuario = await Usuario.findOne({ email });
    console.log('Usuario encontrado:', usuario ? { email: usuario.email, rol: usuario.rol } : null);

    if (!usuario) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas' });
    }

    if (!usuario.password) {
      return res.status(500).json({ ok: false, error: 'Usuario sin contraseña almacenada' });
    }

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no definido en .env');
      return res.status(500).json({ ok: false, error: 'Config JWT inválida' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      ok: true,
      token,
      usuario: { id: usuario._id, email: usuario.email, nombre: usuario.nombre }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ ok: false, error: error.message || 'Error del servidor' });
  }
});

// POST /api/auth/register (opcional, para crear admins)
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ 
        ok: false,
        error: 'El email ya está registrado' 
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const usuario = new Usuario({
      nombre,
      email,
      password: hashedPassword
    });

    await usuario.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ 
      ok: false,
      error: 'Error del servidor' 
    });
  }
});

module.exports = router;