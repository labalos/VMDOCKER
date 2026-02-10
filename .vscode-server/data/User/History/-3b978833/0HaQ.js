const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso denegado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};