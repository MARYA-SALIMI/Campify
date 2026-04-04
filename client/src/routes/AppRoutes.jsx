import { Routes, Route, Navigate } from "react-router-dom";
import MessagePage from "../pages/MessagePage";
import Profile from "../pages/ProfilePage";
import FeedPage from "../pages/Home";
import TeamPage from "../pages/TeamPage"; // Bu import kesinlikle olmalı

export default function AppRoutes({ isDark }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" />} />
      <Route path="/feed" element={<FeedPage isDark={isDark} />} /> 
      
      {/* İŞTE SENİ GERİ FIRLATMASINI ENGELLEYEN SATIR BU */}
      <Route path="/team" element={<TeamPage />} /> 
      
      <Route path="/profile" element={<Profile isDark={isDark} />} />
      <Route path="/messages" element={<MessagePage isDark={isDark} />} />
      <Route path="*" element={<Navigate to="/messages" />} />
    </Routes>
  );
}