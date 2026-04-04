import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from "./components/sidebar/Sidebar";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { Loader2 } from 'lucide-react';
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Router>
      <div className="app-layout">
        {/* Sidebar her yerde görünsün istiyorsanız burada kalabilir, 
            sadece login/register'da gizlemek isterseniz AppRoutes içine taşınmalı. 
            Şimdilik yapıyı bozmuyorum: */}
        <Sidebar darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)}/>
        
        <main className="app-main">
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;