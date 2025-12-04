import * as authService from '../services/auth.service.js';

// POST /auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'Email y password son campos requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El formato del email es inválido'
      });
    }

    // Validar credenciales
    const result = await authService.validateCredentials(email, password);
    
    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Error de autenticación',
        message: 'Credenciales inválidas'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        },
        token: {
          access_token: result.token,
          token_type: 'Bearer',
          expires_in: '1h'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};