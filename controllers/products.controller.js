import * as productService from '../services/products.service.js';

// GET /api/products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
      message: products.length > 0 ? 'Productos obtenidos exitosamente' : 'No hay productos registrados'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto requerido'
      });
    }

    const product = await productService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Producto obtenido exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products/create
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Validaciones básicas
    if (!productData.name || !productData.price) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'Nombre y precio son campos requeridos'
      });
    }

    if (typeof productData.price !== 'number' || productData.price < 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El precio debe ser un número positivo'
      });
    }

    const newProduct = await productService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto requerido'
      });
    }

    const updatedProduct = await productService.updateProduct(id, productData);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto requerido'
      });
    }

    const deleted = await productService.deleteProduct(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
        message: `No existe un producto con el ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};