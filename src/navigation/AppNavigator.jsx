// src/navigation/AppNavigator.jsx (Örnek Mantık)
import { useAuth } from "../context/AuthContext"; // Context'i çektik

import AuthNavigator from "./AuthNavigator"; // Giriş/Kayıt sayfaları
import TabNavigator from "./TabNavigator"; // Senin tasarladığın alt bar ve takım sayfaları

const AppNavigator = () => {
  // Giriş yapmış bir user var mı diye context'e soruyoruz
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Veya bir Splash/Yüklenme ekranı

  return user ? <TabNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
