import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Home from "../pages/Home";
import MessagePage from "../pages/MessagePage"; // Yorumdan çıkarıldı!
import TeamPage from "../pages/TeamPage";
import ProfilePage from "../pages/ProfilePage";
=======
/*import Home from "../pages/Home";
import ProfilePage from "../pages/ProfilePage";
import PostPage from "../pages/PostPage";
import MessagePage from "../pages/MessagePage";*/
import TeamPage from "../pages/TeamPage";
>>>>>>> main

function AppRoutes() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<Home />} />
      <Route path="/messages" element={<MessagePage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/post" element={<ProfilePage />} />
=======
      {
      /*<Route path="/" element={<Home />} />
      <Route path="/post" element={<PostPage />} />
      <Route path="/messages" element={<MessagePage />} />
      <Route path="/profile" element={<ProfilePage />} />*/
      <Route path="/team" element={<TeamPage />} />
      }
>>>>>>> main
    </Routes>
  );
}

export default AppRoutes;