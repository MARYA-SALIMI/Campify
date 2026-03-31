import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app-layout">
      <Sidebar  darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)}/>
      <main className="app-main">
        <div className="main-content">
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}

export default App;