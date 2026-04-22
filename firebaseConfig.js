import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBCuphZzfXneM7XUK-HsC6VTKFmm2s5Ino",
  authDomain: "campify-12351.firebaseapp.com",
  projectId: "campify-12351",
  storageBucket: "campify-12351.firebasestorage.app",
  messagingSenderId: "815940379047",
  appId: "1:815940379047:web:54356f8f5e5583eeb0d682",
};

// 1. App initialization (Zaten varsa olanı kullan, yoksa yeni aç)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Auth initialization (Platforma göre persistence seç)
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app); // Web için standart auth
} else {
  // Mobil için AsyncStorage ile güçlendirilmiş auth
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
export default app;