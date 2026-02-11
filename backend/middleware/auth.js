const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

module.exports = async function (req, res, next) {
  try {
    const token = req.header("x-token");
    if (!token) {
      return res.status(401).json({ success: false, msg: "No hay token, permiso denegado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select("-password").lean();
    if (!usuario) {
      return res.status(401).json({ success: false, msg: "Usuario no encontrado" });
    }

    req.usuario = usuario;
    req.userId = usuario._id;
    next();
  } catch (error) {
    console.error("Error auth:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, msg: "Token no válido" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, msg: "Token expirado" });
    }
    res.status(500).json({ success: false, msg: "Error en autenticación" });
  }
};