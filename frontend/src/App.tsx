import { BrowserRouter, Routes, Route, useOutletContext } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import MemberDashboard from "./pages/member/MemberDashboard";
import ProductionWorkspace from "./pages/ProductionWorkspace";
import AuditionsCasting from "./pages/member/AuditionsCasting";
import SponsorDashboard from "./pages/SponsorDashboard";
import ProductionGallery from "./pages/member/ProductionGallery";
import ProductionOffice from "./pages/ProductionOffice";
import BackstagePass from "./pages/BackstagePass";

// Maintainer pages
import MaintainerDashboard from "./pages/maintainers/MaintainerDashboard";
import PlatformAnalytics from "./pages/maintainers/PlatformAnalytics";
import ComplianceLedger from "./pages/maintainers/ComplianceLedger";
import ProductionControlPanel from "./pages/maintainers/ProductionControlPanel";
import MemberProfileAudit from "./pages/maintainers/MemberProfileAudit";
import MediaModeration from "./pages/maintainers/MediaModeration";
import EventsManagement from "./pages/maintainers/EventsManagement";
import AllMembersDirectory from "./pages/maintainers/AllMembersDirectory";

// Landing pages
import Landing from "./pages/website_landing/Landing";
import Plays from "./pages/website_landing/Plays";
import Events from "./pages/website_landing/Events";
import Directory from "./pages/website_landing/Directory";
import Profile from "./pages/website_landing/Profile";
import JoinClub from "./pages/JoinClub";

function DirectoryWrapper() {
  const context = useOutletContext<{ activeUser: any }>();
  const activeUser = context?.activeUser;
  if (activeUser?.role.toLowerCase().includes("maintainer")) {
    return <AllMembersDirectory />;
  }
  return <Directory />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Landing />} />
          <Route path="plays" element={<Plays />} />
          <Route path="events" element={<Events />} />
          <Route path="directory" element={<DirectoryWrapper />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:memberId" element={<Profile />} />
          <Route path="join" element={<JoinClub />} />
          
          {/* Portal / Dashboard paths */}
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

