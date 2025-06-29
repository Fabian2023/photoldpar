// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadString } from "firebase/storage";

// Tu configuración de Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyBnXaUXZ6FBfc63oZwBcMguTJNY9Vz31qs",
  authDomain: "photobooth-ia.firebaseapp.com",
  projectId: "photobooth-ia",
  storageBucket: "photobooth-ia.firebasestorage.app",
  messagingSenderId: "731336246655",
  appId: "1:731336246655:web:c1ee157165f15c0d5e464a"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Función para guardar los datos en Firestore y la imagen en Firebase Storage
const saveDataToFirebase = async (name, email, imageData) => {
  try {
    // Guardar la imagen en Firebase Storage
    const storageRef = ref(storage, `images/${Date.now()}.png`);
    await uploadString(storageRef, imageData, 'data_url'); // Subir la imagen en formato base64



  
    await addDoc(collection(db, "users"), {
      name: name,
      email: email,
      timestamp: new Date(),
    
    });

    console.log("Datos guardados correctamente");
  } catch (error) {
    console.error("Error al guardar los datos en Firebase: ", error);
  }
};

export { db, storage, saveDataToFirebase };
