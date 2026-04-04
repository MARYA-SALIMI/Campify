import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { auth } from "../firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithEmailAndPassword, 
  signOut,
  updateProfile as updateFirebaseProfile
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.error('Failed to parse user', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // GİRİŞ YAPMA (LOGIN)
  const login = async (email, password) => {
    try {
      // 1. Firebase ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // 2. Mail onaylı mı kontrol et?
      if (!fbUser.emailVerified) {
        await signOut(auth); // Onaylı değilse Firebase oturumunu kapat
        return { 
          success: false, 
          error: "Lütfen önce @ogr.sdu.edu.tr uzantılı mailinize gelen onay linkine tıklayın." 
        };
      }

      // 3. Backend login (JWT Token almak için)
      const { data } = await api.post('/v1/auth/login', { email, password });
      
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return { success: true };
      } else {
        return { success: false, error: 'Sunucudan geçersiz yanıt geldi.' };
      }

    } catch (err) {
      console.error('Login error:', err);
      let message = "Giriş başarısız.";
      if (err.code === 'auth/invalid-credential') message = "E-posta veya şifre hatalı.";
      if (err.code === 'auth/user-not-found') message = "Kullanıcı bulunamadı.";
      
      return { 
        success: false, 
        error: err.response?.data?.message || message 
      };
    }
  };

  // KAYIT OLMA (REGISTER)
  const register = async (formData) => {
    try {
      // GÜVENLİK KONTROLÜ: Sadece SDÜ mailine izin ver
      if (!formData.email.toLowerCase().endsWith('@ogr.sdu.edu.tr')) {
        throw new Error("Sadece @ogr.sdu.edu.tr uzantılı öğrenci maili ile kayıt olabilirsiniz.");
      }

      // 1. Firebase ile kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // 2. Firebase Profilini Güncelle (Ad Soyad ekle)
      await updateFirebaseProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // 3. Doğrulama mailini gönder
      await sendEmailVerification(userCredential.user);

      //Kendi backend veritabanına ilk kaydı at
       await api.post('/v1/auth/register', { 
       uid: userCredential.user.uid, 
        email: formData.email,
        password: formData.password,
       firstName: formData.firstName,
      lastName: formData.lastName
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Kayıt Hatası:", error);
      let message = error.message || "Kayıt başarısız.";
      if (error.code === 'auth/email-already-in-use') message = "Bu e-posta zaten kullanımda.";
      if (error.code === 'auth/weak-password') message = "Şifre çok zayıf.";

      throw new Error(message);
    }
  };

  // ÇIKIŞ YAPMA (LOGOUT)
  const logout = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        await api.post('/v1/auth/logout');
      }
      await signOut(auth); // Firebase oturumunu da kapat
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
    }
  };

  // PROFİL GETİR
  const getProfile = async () => {
    try {
      const { data } = await api.get('/v1/profile');
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return { success: true, user: data };
      }
      return { success: false, error: 'Profil alınamadı.' };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Profil yüklenemedi.' 
      };
    }
  };

  // PROFİL GÜNCELLE
  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/v1/profile', userData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Güncelleme başarısız.' 
      };
    }
  };

  // HESAP SİL
  const deleteAccount = async () => {
    try {
      await api.delete('/v1/profile');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Hesap silinemedi.' 
      };
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      getProfile,
      updateProfile, 
      deleteAccount, 
      loading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};