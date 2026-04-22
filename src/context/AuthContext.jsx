// src/context/AuthContext.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Context'i oluştur
const AuthContext = createContext();

// 2. Tüm uygulamayı sarmalayacak Provider bileşeni
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Kullanıcı bilgileri (isim, _id vb.)
  const [token, setToken] = useState(null); // JWT Biletimiz
  const [isLoading, setIsLoading] = useState(true); // Uygulama ilk açıldığında kontrol durumu

  // Uygulama açıldığında cihaz hafızasında kayıtlı token var mı bak
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Giriş Yapma Fonksiyonu (Login ekranında çalıştıracaksın)
  const login = async (userData, jwtToken) => {
    try {
      await AsyncStorage.setItem("userToken", jwtToken);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
    } catch (error) {
      console.error("Giriş yapılırken hata:", error);
    }
  };

  // Çıkış Yapma Fonksiyonu (Profil ekranında çalıştıracaksın)
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Diğer dosyalarda kolayca kullanmak için özel Hook yazıyoruz
export const useAuth = () => useContext(AuthContext);
