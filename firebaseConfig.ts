// File: firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  
  apiKey: "AIzaSyCWaE1stn3VJ1Z8OCh2lr_8TIR4hOxJ2oQ", 
  authDomain: "thequanhverse.firebaseapp.com",
  projectId: "thequanhverse",
  storageBucket: "thequanhverse.firebasestorage.app",
  messagingSenderId: "821696410018",
  appId: "1:821696410018:web:c281d20a3c07be6da542fb",
  measurementId: "G-3D8PVE6C1G"
 
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
