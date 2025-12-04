const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('📁 Stack:', err.stack);

  // Error de validación de datos
  if (err.message.includes('requerido') || 
      err.message.includes('inválido') || 
      err.message.includes('formato')) {
    return res.status(400).json({
      success: false,
      error: 'Solicitud incorrecta',
      message: err.message
    });
  }

  // Error de recurso no encontrado
  if (err.message.includes('no encontrado') || err.message.includes('no existe')) {
    return res.status(404).json({
      success: false,
      error: 'Recurso no encontrado',
      message: err.message
    });
  }

  // Error de autenticación
  if (err.message.includes('Credenciales') || 
      err.message.includes('Token') || 
      err.message.includes('autenticación')) {
    return res.status(401).json({
      success: false,
      error: 'Error de autenticación',
      message: err.message
    });
  }

  // Error de conflicto (usuario ya existe)
  if (err.message.includes('ya existe')) {
    return res.status(409).json({
      success: false,
      error: 'Conflicto',
      message: err.message
    });
  }

  // Error de permisos
  if (err.message.includes('permisos') || err.message.includes('privilegios')) {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado',
      message: err.message
    });
  }

  // Error de base de datos Firebase
  if (err.message.includes('Firebase') || 
      err.message.includes('Firestore') || 
      err.message.includes('permission-denied')) {
    return res.status(500).json({
      success: false,
      error: 'Error del servidor',
      message: 'Error en la base de datos. Por favor, intente más tarde.'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal en el servidor'
  });
};

export default errorHandler;