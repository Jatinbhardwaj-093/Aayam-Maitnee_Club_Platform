import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import MemberDashboard from "./pages/member/MemberDashboard";
import ProductionWorkspace from "./pages/ProductionWorkspace";
import AuditionsCasting from "./pages/member/AuditionsCasting";
import SponsorDashboard from "./pages/SponsorDashboard";
import ProductionGallery from "./pages/member/ProductionGallery";
import ProductionOffice from "./pages/ProductionOffice";
import BackstagePass from "./pages/BackstagePass";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="member" element={<MemberDashboard />} />
          <Route path="workspace" element={<ProductionWorkspace />} />
          <Route path="auditions" element={<AuditionsCasting />} />
          <Route path="sponsor" element={<SponsorDashboard />} />
          <Route path="gallery" element={<ProductionGallery />} />
          <Route path="admin" element={<ProductionOffice />} />
          <Route path="backstage" element={<BackstagePass />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
