const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const router = express.Router();

// Registrar admin (solo usar una vez)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ msg: "El usuario ya existe" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const nuevoUsuario = new Usuario({ email, password: hash });
    await nuevoUsuario.save();

    res.json({ msg: "Administrador creado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

router.post("/login", async (req, res) => {

    console.log("LOGIN RECIBIDO");

    try {
      const { email, password } = req.body;
  
      const usuario = await Usuario.findOne({ email });
      if (!usuario) return res.status(400).json({ msg: "Credenciales inválidas" });
  
      const esValido = bcrypt.compareSync(password, usuario.password);
      if (!esValido) return res.status(400).json({ msg: "Credenciales inválidas" });
  
      const token = jwt.sign(
        { id: usuario._id },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ msg: "Error en el servidor" });
    }
  });

module.exports = router;