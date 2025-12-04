```markdown
# 🏢 TechLab Products API - Sistema de Gestión de Productos

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🔸 Introducción

**"Este proyecto representa un desafío real: construir una API REST completa con autenticación segura, base de datos en la nube y arquitectura profesional. La misión es crear un sistema que permita gestionar productos desde cualquier frontend, con seguridad empresarial y escalabilidad en mente."**

**"Cada endpoint que desarrolles será consumido por aplicaciones reales, demostrando tu capacidad para integrar servicios en la nube, manejar tokens JWT y estructurar proyectos siguiendo buenas prácticas de desarrollo. Es tu oportunidad de mostrar habilidades técnicas aplicadas a un entorno de producción real."**

## 📌 Requerimientos del Proyecto

### 🎯 Requisito #1: Configuración Inicial

**Crea un directorio para tu proyecto e incluye un archivo index.js como punto de entrada.**

**Inicializa Node.js:**
```bash
npm init -y
```

**En el archivo package.json, agrega:**
```json
{
  "type": "module"
}
```
*Esto habilitará el uso de ESModules.*

**Crea scripts para ejecutar el programa:**
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

**Instala las dependencias necesarias:**
```bash
npm install express cors body-parser dotenv firebase jsonwebtoken bcryptjs
```

🧠 **"Este setup inicial es fundamental para asegurar un entorno profesional, con todas las herramientas necesarias para un proyecto empresarial real."**

### 🧰 Requisito #2: Arquitectura del Proyecto

**La aplicación sigue una arquitectura en capas que separa claramente las responsabilidades:**
- **Routes** - Definición de endpoints HTTP
- **Controllers** - Lógica de manejo de peticiones
- **Services** - Lógica de negocio y validaciones
- **Models** - Interacción con Firebase Firestore
- **Middlewares** - Autenticación y manejo de errores
- **Config** - Configuración de servicios externos

## 🚀 Funcionalidades

### 1. 🔐 Sistema de Autenticación Seguro
**Ejecuta el servidor y accede al dashboard:**
```bash
npm start
# Abre: http://localhost:3000
```

✅ **El sistema permite registro y login con:**
- 🎫 Tokens JWT válidos por 1 hora
- 🔒 Contraseñas hasheadas con bcrypt
- 👑 Sistema de roles (admin/user)
- 📧 Validación de formato de email
- 🛡️ Protección contra datos sensibles

### 2. 📦 Gestión Completa de Productos
**Como administrador autenticado:**

✅ **Crear nuevo producto:**
```http
POST /api/products/create
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json

{
  "name": "Laptop TechLab Pro",
  "price": 1299.99,
  "category": "tecnología",
  "stock": 50
}
```

✅ **Actualizar producto existente:**
```http
PUT /api/products/:id
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json

{
  "price": 1199.99,
  "stock": 45
}
```

✅ **Eliminar producto:**
```http
DELETE /api/products/:id
Authorization: Bearer <tu-token-jwt>
```

### 3. 👥 Gestión de Usuarios
**Como administrador:**

✅ **Listar todos los usuarios:**
```http
GET /api/users
Authorization: Bearer <tu-token-jwt>
```

✅ **Obtener usuario específico:**
```http
GET /api/users/:id
Authorization: Bearer <tu-token-jwt>
```

💡 **Importante:** Solo usuarios con rol "admin" pueden gestionar productos y ver la lista completa de usuarios.

### 4. 🌐 Dashboard Frontend Integrado
**Accede al dashboard completo:**
```
http://localhost:3000
```

✅ **Interfaz web completa que incluye:**
- 🔐 Sistema de login/registro
- 📊 Visualización de productos
- 🛠️ CRUD de productos (solo admin)
- 👤 Información de usuario
- 🎨 Diseño responsive profesional

## 💡 Tecnologías Implementadas

- ✅ **Express.js** - Framework backend robusto y escalable
- ✅ **Firebase Firestore** - Base de datos NoSQL en la nube
- ✅ **JWT (JSON Web Tokens)** - Autenticación stateless segura
- ✅ **bcrypt** - Hashing de contraseñas para seguridad
- ✅ **CORS** - Habilitar peticiones de origen cruzado
- ✅ **dotenv** - Gestión segura de variables de entorno
- ✅ **Arquitectura MVC** - Separación clara de responsabilidades

🧭 **"El código mantiene una estructura modular profesional, con validaciones en cada capa y manejo de errores centralizado. La integración con Firebase demuestra capacidad para trabajar con servicios en la nube."**

## 🧪 Comandos de Ejemplo

```bash
# Iniciar servidor en modo desarrollo
npm run dev

# Iniciar servidor en modo producción
npm start

# Acceder al dashboard
# Abre: http://localhost:3000

# Credenciales de prueba:
# Admin: admin@techlab.com / admin123
# User: user@techlab.com / user123
```

## ✨ Características Destacadas

- 🏗️ **Arquitectura Profesional** - MVC con separación de capas
- 🔐 **Seguridad Empresarial** - JWT, bcrypt, validaciones
- ☁️ **Base de Datos en la Nube** - Firebase Firestore
- 🎨 **Dashboard Integrado** - Frontend completo con JavaScript vanilla
- ⚡ **API REST Completa** - CRUD completo con autenticación
- 🛡️ **Manejo de Errores** - Centralizado con códigos HTTP apropiados
- 👑 **Sistema de Roles** - Permisos diferenciados (admin/user)

## 📁 Estructura del Proyecto

```
TECHLAB-PRODUCTS-API/
├── config/                 # Configuración de servicios externos
│   └── firebase.config.js
├── controllers/           # Controladores de rutas
│   ├── auth.controller.js
│   ├── products.controller.js
│   └── users.controller.js
├── middlewares/          # Middlewares personalizados
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/               # Modelos de base de datos
│   ├── product.model.js
│   └── user.model.js
├── public/               # Frontend estático
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── routes/               # Rutas de la API
│   ├── auth.routes.js
│   ├── products.routes.js
│   └── users.routes.js
├── services/             # Lógica de negocio
│   ├── auth.service.js
│   ├── products.service.js
│   └── users.service.js
├── utils/                # Utilidades
│   └── logger.js
├── .env-example          # Template de variables de entorno
├── .gitignore           # Archivos ignorados por git
├── index.js             # Punto de entrada principal
├── package.json         # Dependencias y scripts
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Runtime**: Node.js 18+
- **Backend Framework**: Express.js
- **Base de Datos**: Firebase Firestore (NoSQL en la nube)
- **Autenticación**: JWT + bcrypt
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Middleware**: CORS, body-parser, error handling
- **Desarrollo**: dotenv, ESModules

## 🔧 Funcionalidades Implementadas

### ✅ Sistema de Autenticación Completo

- **POST /auth/login** - Login con JWT
- **POST /api/users** - Registro de nuevos usuarios
- **Middleware de autenticación** - Protección de rutas
- **Middleware de roles** - Control de acceso por permisos

### ✅ CRUD Completo de Productos

- **GET /api/products** - Listar todos los productos (público)
- **GET /api/products/:id** - Obtener producto específico (público)
- **POST /api/products/create** - Crear producto (solo admin)
- **PUT /api/products/:id** - Actualizar producto (solo admin)
- **DELETE /api/products/:id** - Eliminar producto (solo admin)

### ✅ Gestión de Usuarios

- **GET /api/users** - Listar usuarios (solo admin)
- **GET /api/users/:id** - Obtener usuario
- **PUT /api/users/:id** - Actualizar usuario

### ✅ Dashboard Frontend

- **Interfaz completa** - Login, registro, gestión de productos
- **Comunicación con API** - Fetch API con manejo de headers
- **Manejo de estado** - Almacenamiento de token y usuario
- **Validaciones** - Formularios con validación en tiempo real

## 📋 Requerimientos Cumplidos

| Requerimiento | Estado | Implementación |
|---------------|--------|----------------|
| Configuración inicial | ✅ | `npm init -y` y `"type": "module"` |
| Dependencias instaladas | ✅ | express, cors, body-parser, dotenv, firebase, jsonwebtoken |
| Servidor Express | ✅ | Configuración completa en `index.js` |
| Rutas API | ✅ | `/api/products`, `/auth/login` implementadas |
| Controladores | ✅ | Capa controllers con lógica HTTP |
| Servicios | ✅ | Capa services con lógica de negocio |
| Modelos | ✅ | Capa models con Firebase Firestore |
| Autenticación JWT | ✅ | Middleware de autenticación y protección |
| Manejo de errores | ✅ | Middleware centralizado con códigos HTTP |
| Variables de entorno | ✅ | Archivo `.env` con configuración segura |
| Arquitectura en capas | ✅ | Separación clara de responsabilidades |
| Protección de rutas | ✅ | Middleware de autenticación y roles |
| Dashboard frontend | ✅ | Interfaz web completa en `/public/` |
| Base de datos en la nube | ✅ | Firebase Firestore configurado |

## 👨‍💻 Autor

**Emmanuel Mugetti**  
- 💼 LinkedIn: [Emmanuel Mugetti](https://www.linkedin.com/in/emmanuelmugetti/)
- 🐙 GitHub: [@Chefe98](https://github.com/Chefe98)

<div align="center">

## 🧠 Conclusión

**"Más que una simple API, este proyecto demuestra la capacidad de construir sistemas empresariales completos: desde la integración con servicios en la nube hasta la implementación de seguridad profesional y la creación de interfaces de usuario funcionales. Dominar este stack tecnológico es fundamental para cualquier desarrollador backend que aspire a trabajar en entornos de producción reales."**

### 🚀 TechLab Products API — Gestión segura, escalable y profesional.

**¡Dale una ⭐ si este proyecto te resulta útil!**

</div>
```