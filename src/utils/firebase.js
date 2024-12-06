import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";  
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyAOsZ4f0DVyUbxnxoulretuvdNYP7SnJSI",
  authDomain: "login-lospapis.firebaseapp.com",
  projectId: "login-lospapis",
  storageBucket: "login-lospapis.appspot.com",
  messagingSenderId: "602861898863",
  appId: "1:602861898863:web:540ba4f297f2d2ec1c919a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };  
export const auth = getAuth(app);