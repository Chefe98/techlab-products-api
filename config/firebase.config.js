import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Validar variables de entorno requeridas
const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_PROJECT_ID',
  'JWT_SECRET'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`❌ Variable de entorno requerida faltante: ${varName}`);
  }
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

console.log('✅ Firebase configurado correctamente');
console.log(`📁 Proyecto: ${process.env.FIREBASE_PROJECT_ID}`);

export { db, app };