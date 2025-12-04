import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/products - Devuelve todos los productos
router.get('/', getAllProducts);

// GET /api/products/:id - Devuelve el producto con el ID indicado
router.get('/:id', getProductById);

// PROTEGER RUTAS SENSIBLES
router.post('/create', authenticateToken, requireAdmin, createProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

// Rutas SIN protección (temporal para pruebas)
//router.post('/create', createProduct);
//router.put('/:id', updateProduct);
//router.delete('/:id', deleteProduct);

export default router;

//GET    /api/products           # Público
//GET    /api/products/:id       # Público  
//POST   /api/products/create    # PROTEGIDO (solo admin)
//PUT    /api/products/:id       # PROTEGIDO (solo admin)
//DELETE /api/products/:id       # PROTEGIDO (solo admin)