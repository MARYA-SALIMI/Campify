import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
/*import ProfilePage from "../pages/ProfilePage";
import PostPage from "../pages/PostPage";
import MessagePage from "../pages/MessagePage";*/
import TeamPage from "../pages/TeamPage";

function AppRoutes() {
  return (
    <Routes>
     
      <Route path="/" element={<Home />} />
      {/*<Route path="/post" element={<PostPage />} />
      <Route path="/messages" element={<MessagePage />} />
      <Route path="/profile" element={<ProfilePage />} />*/}
      <Route path="/team" element={<TeamPage />} />
      
    </Routes>
  );
}

export default AppRoutes;