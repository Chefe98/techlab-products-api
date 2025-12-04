
# 🏢 TechLab Products API - Sistema de Gestión de Productos

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🔸 Introducción

Este proyecto consiste en el desarrollo de una **API REST completa**, con autenticación segura, base de datos en la nube y arquitectura profesional basada en capas.  

El objetivo es ofrecer un sistema robusto que permita gestionar productos desde cualquier frontend, integrando **Firebase Firestore**, **autenticación JWT**, y un **dashboard web totalmente funcional**.

Cada endpoint está diseñado siguiendo buenas prácticas y un enfoque modular, ideal para entornos reales de producción.

---

## 📌 Requerimientos del Proyecto

### 🎯 Requisito #1: Configuración Inicial

**1. Crear directorio e iniciar Node.js:**
```bash
npm init -y
````

**2. Agregar `"type": "module"` al `package.json`:**

```json
{
  "type": "module"
}
```

**3. Agregar scripts de ejecución:**

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

**4. Instalar dependencias principales:**

```bash
npm install express cors body-parser dotenv firebase jsonwebtoken bcryptjs
```

### 🧰 Requisito #2: Arquitectura del Proyecto

La aplicación sigue una **arquitectura en capas**:

* **Routes** → Definición de endpoints HTTP
* **Controllers** → Manejo de peticiones y respuestas
* **Services** → Lógica de negocio
* **Models** → Interacción con Firestore
* **Middlewares** → Autenticación y manejo de errores
* **Config** → Configuración de Firebase y servicios externos

---

## 🚀 Funcionalidades

### 1. 🔐 Sistema de Autenticación Seguro

**Iniciar servidor y acceder al dashboard:**

```bash
npm start
# http://localhost:3000
```

El sistema incluye:

* JWT válidos por 1 hora
* Contraseñas hasheadas con bcrypt
* Sistema de roles (admin/user)
* Validación de email
* Protección de rutas privadas

---

### 2. 📦 Gestión Completa de Productos (solo admin)

#### Crear producto

```http
POST /api/products/create
Authorization: Bearer <token>
Content-Type: application/json
{
  "name": "Laptop TechLab Pro",
  "price": 1299.99,
  "category": "tecnologia",
  "stock": 50
}
```

#### Actualizar producto

```http
PUT /api/products/:id
Authorization: Bearer <token>
{
  "price": 1199.99,
  "stock": 45
}
```

#### Eliminar producto

```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

---

### 3. 👥 Gestión de Usuarios

#### Listar todos los usuarios (solo admin)

```http
GET /api/users
Authorization: Bearer <token>
```

#### Obtener usuario por ID

```http
GET /api/users/:id
Authorization: Bearer <token>
```

---

### 4. 🌐 Dashboard Frontend Integrado

Acceso:

```
http://localhost:3000
```

Incluye:

* Login / Registro
* Vista de usuario
* CRUD de productos
* Panel administrador
* Diseño responsive

---

## 💡 Tecnologías Implementadas

* **Express.js**
* **Firebase Firestore**
* **JWT**
* **bcrypt.js**
* **CORS**
* **dotenv**
* **JavaScript Vanilla (frontend)**

---

## 🧪 Comandos de Ejemplo

```bash
npm run dev       # Modo desarrollo
npm start         # Producción

# Acceder al dashboard
# http://localhost:3000
```

### Credenciales de prueba

```
Admin: admin@techlab.com / admin123
User : user@techlab.com / user123
```

---

## ✨ Características Destacadas

* Arquitectura profesional con separación de capas
* Autenticación JWT + roles
* Base de datos Firestore en la nube
* Dashboard web integrado
* CRUD completo
* Manejo centralizado de errores
* Validaciones en cada capa

---

## 📁 Estructura del Proyecto

```
TECHLAB-PRODUCTS-API/
├── config/
│   └── firebase.config.js
├── controllers/
│   ├── auth.controller.js
│   ├── products.controller.js
│   └── users.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── product.model.js
│   └── user.model.js
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── routes/
│   ├── auth.routes.js
│   ├── products.routes.js
│   └── users.routes.js
├── services/
│   ├── auth.service.js
│   ├── products.service.js
│   └── users.service.js
├── utils/
│   └── logger.js
├── .env-example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

---

## 📋 Requerimientos Cumplidos

| Requerimiento         | Estado | Implementación                   |
| --------------------- | ------ | -------------------------------- |
| Configuración inicial | ✅      | `"type": "module"` + scripts     |
| Dependencias          | ✅      | express, firebase, jwt, bcryptjs |
| Servidor Express      | ✅      | index.js                         |
| Rutas API             | ✅      | users, products, auth            |
| Controladores         | ✅      | capa controllers                 |
| Servicios             | ✅      | capa services                    |
| Modelos               | ✅      | Firestore                        |
| Autenticación JWT     | ✅      | middleware + roles               |
| Manejo de errores     | ✅      | error.middleware.js              |
| Variables de entorno  | ✅      | .env                             |
| Dashboard             | ✅      | en `/public/`                    |

---

## 👨‍💻 Autor

**Emmanuel Mugetti**

* 💼 LinkedIn: [https://www.linkedin.com/in/emmanuelmugetti/](https://www.linkedin.com/in/emmanuelmugetti/)
* 🐙 GitHub: [https://github.com/Chefe98](https://github.com/Chefe98)

---

<div align="center">

## 🧠 Conclusión

Este proyecto demuestra la capacidad de construir un sistema moderno, seguro y escalable con tecnologías actuales.
Integra backend, frontend, autenticación, base de datos en la nube y arquitectura profesional, ideal para entornos empresariales reales.

### 🚀 TechLab Products API — Gestión segura, escalable y profesional.

⭐ ¡Deja una estrella si te fue útil!

</div>
```

---

