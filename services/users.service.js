import * as userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Servicio de Usuarios - Lógica de negocio para operaciones de usuarios
 */

/**
 * Obtiene todos los usuarios
 * @returns {Array} Lista de usuarios
 */
export const getAllUsers = async () => {
  try {
    return await userModel.getAllUsers();
  } catch (error) {
    throw new Error(`Error en servicio al obtener usuarios: ${error.message}`);
  }
};

/**
 * Obtiene un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Object} Usuario
 */
export const getUserById = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de usuario es requerido');
    }
    return await userModel.getUserById(id);
  } catch (error) {
    throw new Error(`Error en servicio al obtener usuario: ${error.message}`);
  }
};

/**
 * Obtiene usuario por email
 * @param {string} email - Email del usuario
 * @returns {Object} Usuario
 */
export const getUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error('Email es requerido');
    }
    return await userModel.getUserByEmail(email);
  } catch (error) {
    throw new Error(`Error en servicio al buscar usuario por email: ${error.message}`);
  }
};

/**
 * Crea un nuevo usuario con contraseña hasheada
 * @param {Object} userData - Datos del usuario
 * @returns {Object} Usuario creado
 */
export const createUser = async (userData) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await userModel.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('El usuario con este email ya existe');
    }

    // Hash de contraseña para seguridad
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    return await userModel.createUser({
      ...userData,
      password: hashedPassword // Guardar hash en lugar de texto plano
    });
  } catch (error) {
    throw new Error(`Error en servicio al crear usuario: ${error.message}`);
  }
};

/**
 * Autentica usuario y genera token JWT
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Object} Objeto con usuario y token
 */
export const loginUser = async (email, password) => {
  try {
    // Buscar usuario por email
    const user = await userModel.getUserByEmail(email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.password) {
      console.error('❌ Usuario sin contraseña en login:', email);
      throw new Error('Configuración de usuario inválida - falta contraseña');
    }

    // Comparar contraseña hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar usuario sin password y token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    console.error('❌ Error en loginUser:', error);
    throw new Error(`Error en servicio de login: ${error.message}`);
  }
};

/**
 * Actualiza un usuario
 * @param {string} id - ID del usuario
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} Usuario actualizado
 */
export const updateUser = async (id, updateData) => {
  try {
    if (!id) {
      throw new Error('ID de usuario es requerido');
    }
    return await userModel.updateUser(id, updateData);
  } catch (error) {
    throw new Error(`Error en servicio al actualizar usuario: ${error.message}`);
  }
};

/**
 * Verifica un token JWT (usado en middleware)
 * @param {string} token - Token JWT
 * @returns {Object} Payload decodificado
 */
export const validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};