import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ7dZXerfjbZUohFepiZGc51joY7ik6Mg",
  authDomain: "snap2fix-397fc.firebaseapp.com",
  projectId: "snap2fix-397fc",
  storageBucket: "snap2fix-397fc.firebasestorage.app",
  messagingSenderId: "972163844214",
  appId: "1:972163844214:web:88a5ae3ea861b23f8a3757",
  measurementId: "G-4XV98LLQ7X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);