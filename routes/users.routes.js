import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser
} from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/users - Obtener todos los usuarios (PROTEGIDA)
router.get('/', authenticateToken, getAllUsers);

// GET /api/users/:id - Obtener usuario por ID (PROTEGIDA)
router.get('/:id', authenticateToken, getUserById);

// POST /api/users - Crear nuevo usuario
router.post('/', createUser);

// POST /api/users/login - Login de usuario
router.post('/login', loginUser);

// PUT /api/users/:id - Actualizar usuario (PROTEGIDA)
router.put('/:id', authenticateToken, updateUser);

export default router;

//POST /api/users           # Registrar nuevo usuario
//POST /api/users/login     # Login (obtener token)
//GET  /api/users           # Listar usuarios (PROTEGIDO - ADMIN)
//GET  /api/users/:id       # Obtener usuario (PROTEGIDO)
//PUT  /api/users/:id       # Actualizar usuario (PROTEGIDO)