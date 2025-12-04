import * as productModel from '../models/product.model.js';

export const getAllProducts = async () => {
  try {
    return await productModel.getAllProducts();
  } catch (error) {
    throw new Error(`Error en servicio al obtener productos: ${error.message}`);
  }
};

export const getProductById = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de producto es requerido');
    }
    return await productModel.getProductById(id);
  } catch (error) {
    throw new Error(`Error en servicio al obtener producto: ${error.message}`);
  }
};

export const createProduct = async (productData) => {
  try {
    // Validaciones adicionales
    if (productData.price && productData.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (productData.stock && productData.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    return await productModel.createProduct(productData);
  } catch (error) {
    throw new Error(`Error en servicio al crear producto: ${error.message}`);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    if (!id) {
      throw new Error('ID de producto es requerido');
    }
    return await productModel.updateProduct(id, productData);
  } catch (error) {
    throw new Error(`Error en servicio al actualizar producto: ${error.message}`);
  }
};

export const deleteProduct = async (id) => {
  try {
    if (!id) {
      throw new Error('ID de producto es requerido');
    }
    return await productModel.deleteProduct(id);
  } catch (error) {
    throw new Error(`Error en servicio al eliminar producto: ${error.message}`);
  }
};