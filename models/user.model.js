import { db } from '../config/firebase.config.js';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc,
  query,
  where 
} from 'firebase/firestore';

// Nombre de la colección en Firestore
const collectionName = 'users';

/**
 * Modelo de Usuarios - Maneja operaciones CRUD con la colección 'users' en Firestore
 * Implementa el patrón Data Mapper para separar la lógica de acceso a datos
 */

/**
 * Obtiene todos los usuarios de la base de datos
 * @returns {Promise<Array>} Lista de usuarios sin información sensible
 * @throws {Error} Si ocurre un error al acceder a Firestore
 */
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    if (querySnapshot.empty) {
      return [];
    }

    const users = [];
    
    // Mapear documentos de Firestore a objetos de dominio
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Remover contraseña por seguridad (principio de mínima exposición)
      const { password, ...userWithoutPassword } = userData;
      
      users.push({
        id: doc.id,
        ...userWithoutPassword
      });
    });

    return users;
  } catch (error) {
    // Log detallado para debugging en desarrollo
    console.error(`Error en getAllUsers: ${error.message}`);
    throw new Error('Error al obtener usuarios de la base de datos');
  }
};

/**
 * Obtiene un usuario específico por su ID de documento
 * @param {string} id - ID único del documento en Firestore
 * @returns {Promise<Object|null>} Usuario sin datos sensibles o null si no existe
 * @throws {Error} Si ocurre un error en la consulta
 */
export const getUserById = async (id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const userData = docSnap.data();
    
    // Aplicar transformación de datos para ocultar información sensible
    const { password, ...userWithoutPassword } = userData;
    
    return {
      id: docSnap.id,
      ...userWithoutPassword
    };
  } catch (error) {
    console.error(`Error en getUserById para ID ${id}: ${error.message}`);
    throw new Error('Error al obtener información del usuario');
  }
};

/**
 * Busca un usuario por su dirección de email
 * @param {string} email - Email único del usuario
 * @returns {Promise<Object|null>} Usuario con estructura normalizada o null si no existe
 * @throws {Error} Si ocurre un error en la búsqueda
 */
export const getUserByEmail = async (email) => {
  try {
    // Consulta optimizada usando índice de email
    const q = query(collection(db, collectionName), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    // Normalización de datos para garantizar consistencia en la respuesta
    const normalizedUser = {
      id: userDoc.id,
      email: userData.email,
      name: userData.name || '',
      role: userData.role || 'customer',
      
      // Manejo de campos con nombres diferentes (backward compatibility)
      is_active: userData.is_active !== undefined ? userData.is_active : 
                (userData.isActive !== undefined ? userData.isActive : true),
      
      // Timestamps con valores por defecto
      created_at: userData.created_at || userData.registrationDate || new Date().toISOString(),
      
      // Campo password (puede no existir en usuarios antiguos)
      password: userData.password || null,
      
      // Campos opcionales solo si existen
      ...(userData.lastname && { lastname: userData.lastname }),
      ...(userData.dni && { dni: userData.dni }),
      ...(userData.phone && { phone: userData.phone })
    };

    return normalizedUser;
  } catch (error) {
    console.error(`Error en getUserByEmail para ${email}: ${error.message}`);
    throw new Error('Error al buscar usuario por email');
  }
};

/**
 * Crea un nuevo usuario en la base de datos
 * @param {Object} userData - Datos del usuario a crear
 * @returns {Promise<Object>} Usuario creado sin información sensible
 * @throws {Error} Si falla la creación del usuario
 */
export const createUser = async (userData) => {
  try {
    const timestamp = new Date().toISOString();
    
    // Enriquecer datos con metadatos de auditoría
    const userWithTimestamps = {
      ...userData,
      created_at: timestamp,
      updated_at: timestamp,
      is_active: true
    };

    // Persistir en Firestore
    const docRef = await addDoc(collection(db, collectionName), userWithTimestamps);
    
    // Retornar usuario recién creado (sin datos sensibles)
    const newUser = await getUserById(docRef.id);
    return newUser;
  } catch (error) {
    console.error(`Error en createUser: ${error.message}`);
    throw new Error('Error al crear nuevo usuario');
  }
};

/**
 * Actualiza un usuario existente
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} updateData - Campos a actualizar
 * @returns {Promise<Object|null>} Usuario actualizado o null si no existe
 * @throws {Error} Si falla la actualización
 */
export const updateUser = async (id, updateData) => {
  try {
    const userRef = doc(db, collectionName, id);
    const existingUser = await getUserById(id);

    if (!existingUser) {
      return null;
    }

    // Agregar timestamp de actualización
    const updateWithTimestamp = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // Actualizar documento en Firestore
    await updateDoc(userRef, updateWithTimestamp);
    
    // Retornar usuario actualizado
    return await getUserById(id);
  } catch (error) {
    console.error(`Error en updateUser para ID ${id}: ${error.message}`);
    throw new Error('Error al actualizar usuario');
  }
};