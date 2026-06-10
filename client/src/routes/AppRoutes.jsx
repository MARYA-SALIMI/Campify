<<<<<<< HEAD
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
=======
import { Routes, Route } from "react-router-dom";
/*import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import PostPage from "../pages/PostPage";
import MessagePage from "../pages/MessagePage";*/
import TeamPage from "../pages/TeamPage";

function AppRoutes() {
  return (
    <Routes>
      {
      /*<Route path="/" element={<Home />} />
      <Route path="/post" element={<PostPage />} />
      <Route path="/messages" element={<MessagePage />} />
      <Route path="/profile" element={<ProfilePage />} />*/
      <Route path="/team" element={<TeamPage />} />
      }
    </Routes>
  );
}

export default AppRoutes;
>>>>>>> 9124b8ba3ac5117ae373ba07500183d7b6f14971
