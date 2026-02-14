// middleware/adminAuth.js
module.exports = function (req, res, next) {
  try {
    // req.usuario debería estar seteado por el middleware auth
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        msg: "Autenticación requerida"
      });
    }

    // Verificar rol de administrador (usando 'rol')
    if (req.usuario.rol !== "admin") {
      console.log(`❌ Usuario ${req.usuario.email} (${req.usuario.rol}) intentó acceder a admin`);
      return res.status(403).json({
        success: false,
        msg: "Permisos insuficientes. Se requiere rol de administrador"
      });
    }

    console.log(`✅ Admin ${req.usuario.email} accediendo`);
    next();

  } catch (error) {
    console.error("Error en adminAuth:", error);
    res.status(500).json({
      success: false,
      msg: "Error en autorización"
    });
  }
};