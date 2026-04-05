import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Senin Bileşenlerin
import Sidebar from "./components/sidebar/Sidebar";
import TeamPage from "./pages/TeamPage";
/* import Home from "../pages/Home";
import PostPage from "../pages/PostPage";
import MessagePage from "../pages/MessagePage"; */

// Arkadaşının Bileşenleri
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import "./App.css";

/**
 * PROTECTED LAYOUT (Korumalı Sayfa Düzeni)
 * Hem kullanıcının giriş yapıp yapmadığını kontrol eder, 
 * hem de senin Sidebar ve Karanlık Mod (Dark Mode) mantığını çalıştırır.
 */
function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  
  // Senin Karanlık Mod mantığın
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Yüklenme durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa Login'e yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Kullanıcı giriş yapmışsa Sidebar'lı düzeni göster
  return (
    <div className="app-layout">
      <Sidebar darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
      <main className="app-main">
        <div className="main-content">
          {/* Outlet, aşağıda bu layout'un içine yazdığımız alt rotaları (Profile, Team vb.) buraya render eder */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

/**
 * ANA APP BİLEŞENİ
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* HERKESE AÇIK ROTALAR (Sidebar yok) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* KORUMALI ROTALAR (Sidebar var, giriş zorunlu) */}
        <Route element={<ProtectedLayout />}>
          {/* Outlet'in yerine geçecek sayfalar */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/home" element={<Home />} />
          {/* İleride açacağın diğer sayfalar */}
          {/* <Route path="/home" element={<Home />} /> */}
          {/* <Route path="/post" element={<PostPage />} /> */}
          {/* <Route path="/messages" element={<MessagePage />} /> */}

          {/* Ana dizine gelindiğinde varsayılan olarak bir yere yönlendir */}
          <Route path="/" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;