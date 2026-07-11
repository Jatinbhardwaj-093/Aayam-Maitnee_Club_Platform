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
import MaintainerDashboard from "./pages/MaintainerDashboard";
import PlatformAnalytics from "./pages/PlatformAnalytics";
import ComplianceLedger from "./pages/ComplianceLedger";
import ProductionControlPanel from "./pages/ProductionControlPanel";
import MemberProfileAudit from "./pages/MemberProfileAudit";
import MediaModeration from "./pages/MediaModeration";
import EventsManagement from "./pages/EventsManagement";
import AllMembersDirectory from "./pages/AllMembersDirectory";

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
          <Route path="maintainer" element={<MaintainerDashboard />} />
          <Route path="analytics" element={<PlatformAnalytics />} />
          <Route path="compliance" element={<ComplianceLedger />} />
          <Route path="control-panel" element={<ProductionControlPanel />} />
          <Route path="profile-audit" element={<MemberProfileAudit />} />
          <Route path="media-moderation" element={<MediaModeration />} />
          <Route path="events-admin" element={<EventsManagement />} />
          <Route path="directory" element={<AllMembersDirectory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
