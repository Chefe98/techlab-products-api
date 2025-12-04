import { db } from '../config/firebase.config.js';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

const collectionName = 'products';

export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    if (querySnapshot.empty) {
      return [];
    }

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return products;
  } catch (error) {
    throw new Error(`Error al obtener productos: ${error.message}`);
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    throw new Error(`Error al obtener producto: ${error.message}`);
  }
};

export const createProduct = async (productData) => {
  try {
    const timestamp = new Date().toISOString();
    
    const productWithTimestamps = {
      ...productData,
      created_at: timestamp,
      updated_at: timestamp,
      is_active: true
    };

    const docRef = await addDoc(collection(db, collectionName), productWithTimestamps);
    
    // Obtener el producto recién creado
    const newProduct = await getProductById(docRef.id);
    return newProduct;
  } catch (error) {
    throw new Error(`Error al crear producto: ${error.message}`);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const productRef = doc(db, collectionName, id);
    const product = await getProductById(id);

    if (!product) {
      return null;
    }

    const updateData = {
      ...productData,
      updated_at: new Date().toISOString()
    };

    await updateDoc(productRef, updateData);
    return await getProductById(id);
  } catch (error) {
    throw new Error(`Error al actualizar producto: ${error.message}`);
  }
};

export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, collectionName, id);
    const product = await getProductById(id);

    if (!product) {
      return false;
    }

    await deleteDoc(productRef);
    return true;
  } catch (error) {
    throw new Error(`Error al eliminar producto: ${error.message}`);
  }
};