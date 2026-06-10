import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCuphZzfXneM7XUK-HsC6VTKFmm2s5Ino",
  authDomain: "campify-12351.firebaseapp.com",
  projectId: "campify-12351",
  storageBucket: "campify-12351.firebasestorage.app",
  messagingSenderId: "815940379047",
  appId: "1:815940379047:web:54356f8f5e5583eeb0d682",
  measurementId: "G-G3TJ440XMD"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth servisini dışarı aktar ki her yerde kullanabilelim
export const auth = getAuth(app);
export default app;