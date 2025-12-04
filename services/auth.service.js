import * as userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Servicio de Autenticación - Maneja lógica de negocio relacionada con autenticación
 * Responsabilidades: validación de credenciales, generación de tokens, verificación de identidad
 */

/**
 * Valida las credenciales de un usuario y genera token de acceso
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<Object|null>} Objeto con usuario y token JWT, o null si credenciales inválidas
 * @throws {Error} Si ocurre un error en el proceso de autenticación
 */
export const validateCredentials = async (email, password) => {
  try {
    // Buscar usuario en la base de datos
    const user = await userModel.getUserByEmail(email);
    
    // Validación: usuario existente
    if (!user) {
      console.warn(`Intento de login fallido: usuario no encontrado - ${email}`);
      return null;
    }

    // Validación: usuario tiene contraseña configurada
    if (!user.password) {
      console.warn(`Intento de login fallido: usuario sin contraseña configurada - ${email}`);
      return null;
    }

    // Verificar contraseña usando bcrypt (comparación segura)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.warn(`Intento de login fallido: contraseña incorrecta - ${email}`);
      return null;
    }

    // Generar token JWT con información del usuario
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expira en 1 hora
    );

    // Remover contraseña del objeto de usuario antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    // Log estructurado para monitoreo
    console.error(`Error crítico en validateCredentials para ${email}:`, {
      error: error.message,
      stack: error.stack
    });
    
    throw new Error('Error en el proceso de autenticación');
  }
};

/**
 * Verifica la validez y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado del token
 * @throws {Error} Si el token es inválido, expirado o tiene firma incorrecta
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Clasificar tipos de error para mejor manejo
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token con formato inválido');
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token no válido aún');
    }
    
    throw new Error('Error al verificar token de acceso');
  }
};

/**
 * Genera un nuevo token de refresco (para implementación futura)
 * @param {Object} user - Objeto usuario
 * @returns {string} Token de refresco
 */
export const generateRefreshToken = (user) => {
  // Implementación para refresh tokens (scalability)
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};