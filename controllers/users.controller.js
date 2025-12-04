import * as userService from '../services/users.service.js';

// GET /api/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      message: 'Usuarios obtenidos exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuario requerido'
      });
    }

    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Usuario obtenido exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users
export const createUser = async (req, res, next) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // Validaciones
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'Email, password y name son campos requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El formato del email es inválido'
      });
    }

    const newUser = await userService.createUser({
      email,
      password,
      name,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    if (error.message.includes('ya existe')) {
      return res.status(409).json({
        success: false,
        error: 'Usuario ya existe',
        message: error.message
      });
    }
    next(error);
  }
};

// POST /api/users/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'Email y password son requeridos'
      });
    }

    const result = await userService.loginUser(email, password);
    
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
    if (error.message.includes('Credenciales') || error.message.includes('no encontrado')) {
      return res.status(401).json({
        success: false,
        error: 'Error de autenticación',
        message: error.message
      });
    }
    next(error);
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuario requerido'
      });
    }

    // No permitir actualizar campos sensibles
    delete updateData.password;
    delete updateData.id;
    delete updateData.email;

    const updatedUser = await userService.updateUser(id, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};