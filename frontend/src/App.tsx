import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import MemberDashboard from "./pages/member/MemberDashboard";
import MySchedule from "./pages/member/MySchedule";
import ProductionWorkspace from "./pages/ProductionWorkspace";
import AuditionsCasting from "./pages/member/AuditionsCasting";
import SponsorDashboard from "./pages/SponsorDashboard";
import ProductionGallery from "./pages/member/ProductionGallery";
import ProductionOffice from "./pages/ProductionOffice";
import BackstagePass from "./pages/BackstagePass";
import EditProfile from "./pages/member/EditProfile";
import ViewProfile from "./pages/member/ViewProfile";
import MemberPlays from "./pages/member/MemberPlays";
import MemberScripts from "./pages/member/MemberScripts";
import ScriptBuilder from "./pages/member/ScriptBuilder";
import AiRehearsalStudio from "./pages/member/AiRehearsalStudio";

// Maintainer pages
import MaintainerDashboard from "./pages/maintainers/MaintainerDashboard";
import PlatformAnalytics from "./pages/maintainers/PlatformAnalytics";
import ProductionControlPanel from "./pages/maintainers/ProductionControlPanel";
import MemberProfileAudit from "./pages/maintainers/MemberProfileAudit";
import MediaModeration from "./pages/maintainers/MediaModeration";
import EventsManagement from "./pages/maintainers/EventsManagement";
import AllMembersDirectory from "./pages/maintainers/AllMembersDirectory";
import AuditionsManagement from "./pages/maintainers/AuditionsManagement";

// Landing pages
import Landing from "./pages/website_landing/Landing";
import Plays from "./pages/website_landing/Plays";
import Events from "./pages/website_landing/Events";
import Directory from "./pages/website_landing/Directory";
import Gallery from "./pages/website_landing/Gallery";
import Profile from "./pages/website_landing/Profile";
import About from "./pages/website_landing/About";
import JoinClub from "./pages/JoinClub";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Landing />} />
          <Route path="about" element={<About />} />
          <Route path="manifesto" element={<About />} />
          <Route path="plays" element={<Plays />} />
          <Route path="events" element={<Events />} />
          <Route path="directory" element={<Directory />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="public-gallery" element={<Gallery />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/view" element={<ViewProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="profile/:memberId" element={<Profile />} />
          <Route path="join" element={<JoinClub />} />

          {/* Portal / Dashboard paths */}
          <Route path="member" element={<MemberDashboard />} />
          <Route path="schedule" element={<MySchedule />} />
          <Route path="workspace" element={<ProductionWorkspace />} />
          <Route path="auditions" element={<AuditionsCasting />} />
          <Route path="member-plays" element={<MemberPlays />} />
          <Route path="member-scripts" element={<MemberScripts />} />
          <Route path="script-builder" element={<ScriptBuilder />} />
          <Route path="script-builder/:scriptId" element={<ScriptBuilder />} />
          <Route path="ai-rehearsal" element={<AiRehearsalStudio />} />
          <Route path="ai-rehearsal/:scriptId" element={<AiRehearsalStudio />} />
          <Route path="sponsor" element={<SponsorDashboard />} />
          <Route path="member-gallery" element={<ProductionGallery />} />
          <Route path="admin" element={<ProductionOffice />} />
          <Route path="backstage" element={<BackstagePass />} />
          <Route path="maintainer" element={<MaintainerDashboard />} />
          <Route path="schedule-admin" element={<MySchedule />} />
          <Route path="analytics" element={<PlatformAnalytics />} />
          <Route path="control-panel" element={<ProductionControlPanel />} />
          <Route path="profile-audit" element={<MemberProfileAudit />} />
          <Route path="media-moderation" element={<MediaModeration />} />
          <Route path="events-admin" element={<EventsManagement />} />
          <Route path="auditions-admin" element={<AuditionsManagement />} />
          <Route path="directory-admin" element={<AllMembersDirectory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

