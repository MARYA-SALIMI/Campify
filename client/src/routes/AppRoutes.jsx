import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MessagePage from "../pages/MessagePage"; // Yorumdan çıkarıldı!
/*import TeamPage from "../pages/TeamPage";*/
import ProfilePage from "../pages/ProfilePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/messages" element={<MessagePage />} />
     {/* <Route path="/team" element={<TeamPage />} />*/}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/post" element={<ProfilePage />} />
    </Routes>
  );
}

export default AppRoutes;