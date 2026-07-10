import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Landing from "./pages/website_landing/Landing";
import Plays from "./pages/website_landing/Plays";
import Events from "./pages/website_landing/Events";
import Directory from "./pages/website_landing/Directory";
import Profile from "./pages/website_landing/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Landing />} />
          <Route path="plays" element={<Plays />} />
          <Route path="events" element={<Events />} />
          <Route path="directory" element={<Directory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:memberId" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
