import { Routes, Route, Navigate } from "react-router-dom";
import MessagePage from "../pages/MessagePage";
import Profile from "../pages/ProfilePage";

export default function AppRoutes({ isDark }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/messages" />} />
      <Route path="/profile" element={<Profile isDark={isDark} />} />
      <Route path="/messages" element={<MessagePage isDark={isDark} />} />
      <Route path="*" element={<Navigate to="/messages" />} />
    </Routes>
  );
}