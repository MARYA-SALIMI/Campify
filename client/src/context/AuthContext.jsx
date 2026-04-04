import { createContext, useContext, useState, useEffect } from 'react';

// 1. Context Oluşturma
const AuthContext = createContext();

// 2. Provider Bileşeni (Tüm uygulamayı saracak olan)
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa yenilendiğinde yerel hafızadan kullanıcıyı geri yükle
  useEffect(() => {
    const savedUser = localStorage.getItem('campify_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Giriş Yapma Fonksiyonu
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('campify_user', JSON.stringify(userData));
  };

  // Çıkış Yapma Fonksiyonu
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campify_user');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. useAuth Kancası (Diğer sayfalarda çağırdığımız kısım)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth bir AuthProvider içinde kullanılmalıdır!');
  }
  return context;
};