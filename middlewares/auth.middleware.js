import { verifyToken } from '../services/auth.service.js';
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de acceso requerido',
        message: 'Debe proporcionar un token Bearer válido en el header Authorization'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Token inválido o expirado',
      message: error.message
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado',
      message: 'Se requieren privilegios de administrador para esta acción'
    });
  }
};