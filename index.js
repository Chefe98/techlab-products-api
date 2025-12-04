import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Importar rutas
import productsRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';

// Importar middleware de errores
import errorHandler from './middlewares/error.middleware.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// SERVIR ARCHIVOS ESTÁTICOS desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'TechLab Products API is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta principal
//app.get('/', (req, res) => {
//  res.status(200).json({
//    success: true,
//    message: 'Bienvenido a TechLab Products API',
//    version: '1.0.0',
//    endpoints: {
//      products: '/api/products',
//      auth: '/auth',
//      users: '/api/users',
//      health: '/health'
//    }
//  });
//});

// ✅ RUTA PRINCIPAL - Sirve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de rutas no encontradas (404)
//app.use('*', (req, res) => {
//  res.status(404).json({
//    success: false,
//    error: 'Ruta no encontrada',
//    message: `La ruta ${req.originalUrl} no existe en este servidor`,
//    available_endpoints: ['/api/products', '/auth/login', '/api/users', '/health']
//  });
//});

// ✅ MANEJAR RUTAS NO ENCONTRADAS para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
//app.listen(PORT, () => {
//  console.log('🚀 ' + '='.repeat(50));
//  console.log(`   TechLab Products API`);
//  console.log(`   📍 Puerto: ${PORT}`);
//  console.log(`   🌐 URL: http://localhost:${PORT}`);
//  console.log(`   📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
//  console.log('🚀 ' + '='.repeat(50));
//});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📦 API Products: http://localhost:${PORT}/api/products`);
    console.log(`👤 API Users: http://localhost:${PORT}/api/users`);
    console.log(`🖥️  Dashboard: http://localhost:${PORT}`);
    console.log(`📚 Estructura: HTML semántico + CSS modular + JavaScript organizado`);
});

export default app;