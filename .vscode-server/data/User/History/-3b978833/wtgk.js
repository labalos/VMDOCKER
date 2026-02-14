const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

module.exports = (req, res, next) => {
  try {
    console.log('AUTH HEADER RECIBIDO:', req.headers.authorization);

    let token = req.header('Authorization') || req.header('authorization');
    if (token?.startsWith('Bearer ')) token = token.slice(7).trim();

    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (e) {
    console.error('Error auth:', e.message);
    return res.status(401).json({ error: 'invalid token' });
  }
};