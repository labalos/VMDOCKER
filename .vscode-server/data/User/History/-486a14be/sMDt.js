// middleware/adminAuth.js
module.exports = function (req, res, next) {
    try {
      // Verificar que req.usuario exista (seteado por auth.js)
      if (!req.usuario) {
        return res.status(401).json({ 
          success: false,
          msg: "Autenticación requerida" 
        });
      }
  
      // Verificar que el usuario sea administrador
      if (req.usuario.role !== "admin") {
        return res.status(403).json({ 
          success: false,
          msg: "Permisos insuficientes. Se requiere rol de administrador" 
        });
      }
  
      next();
    } catch (error) {
      console.error("Error en autorización admin:", error);
      res.status(500).json({ 
        success: false,
        msg: "Error en autorización" 
      });
    }
  };