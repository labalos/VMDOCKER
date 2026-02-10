// middleware/auth.js
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario"); // Asegúrate de importar el modelo

module.exports = async function (req, res, next) {
  try {
    // 1. Obtener token de diferentes fuentes
    let token;
    
    if (req.header("x-token")) {
      token = req.header("x-token");
    } else if (req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. Verificar si existe token
    if (!token) {
      return res.status(401).json({ 
        success: false,
        msg: "No hay token, permiso denegado" 
      });
    }

    // 3. Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Buscar usuario en la base de datos
    const usuario = await Usuario.findById(decoded.id)
      .select("-password") // Excluir contraseña
      .lean(); // Retornar objeto plano

    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        msg: "Usuario no encontrado" 
      });
    }

    // 5. Verificar si el usuario está activo
    if (usuario.estado !== 'activo') {
      return res.status(403).json({ 
        success: false,
        msg: "Cuenta desactivada" 
      });
    }

    // 6. Adjuntar usuario completo a la request
    req.usuario = usuario;
    req.userId = usuario._id; // Para compatibilidad
    req.token = token;
    
    // 7. Continuar
    next();
    
  } catch (error) {
    console.error("Error en autenticación:", error.message);
    
    // Manejar diferentes tipos de errores
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        msg: "Token inválido" 
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        msg: "Token expirado" 
      });
    }
    
    // Error de servidor
    res.status(500).json({ 
      success: false,
      msg: "Error en el servidor de autenticación" 
    });
  }
};