// Importamos la función para iniciar Firebase
import { initializeApp } from "firebase/app"

// Importamos Authentication para crear e iniciar usuarios
import { getAuth } from "firebase/auth"

// Firestore se utiliza para guardar información de la aplicación
import { getFirestore } from "firebase/firestore"

// Configuración de nuestro proyecto Entre Destinos
const firebaseConfig = {
    apiKey: "AIzaSyBv1VhAChhMVHTC8z2HmXUQaBd_q44JfMA",
    authDomain: "entre-destinos.firebaseapp.com",
    projectId: "entre-destinos",
    storageBucket: "entre-destinos.firebasestorage.app",
    messagingSenderId: "97954612692",
    appId: "1:97954612692:web:ef37932e2403c0cb398241"
}


// Iniciamos Firebase
const app = initializeApp(firebaseConfig)


// Exportamos Authentication para utilizarlo en Register.jsx y Login.jsx
export const auth = getAuth(app)

// Iniciamos Firestore
export const db = getFirestore(app)