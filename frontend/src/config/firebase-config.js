import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7K2gj_a4xVObC0Y4FKHFosxNywpwzz-0",
  authDomain: "reactlearn-cb432.firebaseapp.com",
  projectId: "reactlearn-cb432",
  storageBucket: "reactlearn-cb432.firebasestorage.app",
  messagingSenderId: "966346441863",
  appId: "1:966346441863:web:6aef0b3b19d3d1c8fd6422",
  measurementId: "G-0HYETNREWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);  
