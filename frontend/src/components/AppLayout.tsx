import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Home,
  LayoutDashboard,
  Folder,
  Users,
  Image as ImageIcon,
  Coins,
  Menu,
  Bell,
  User,
  ShieldCheck,
  ClipboardList,
  LogOut,
  Settings,
  ShieldAlert,
  LineChart,
  Scale,
  Sliders,
  HardDrive,
  Calendar
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
}

const navItems: NavItem[] = [
  { label: "Drama Club Home", path: "/", icon: Home, description: "Public landing page" },
  { label: "Member Dashboard", path: "/member", icon: LayoutDashboard, description: "Your rehearsals & schedules" },
  { label: "Macbeth Workspace", path: "/workspace", icon: Folder, description: "Props transfers & expenses" },
  { label: "Auditions & Casting", path: "/auditions", icon: Users, description: "Casting portal & applications" },
  { label: "Sponsor Dashboard", path: "/sponsor", icon: Coins, description: "VIP lounge & sponsorships" },
  { label: "Gallery", path: "/gallery", icon: ImageIcon, description: "Performances & backstage media" },
  { label: "Production Office", path: "/admin", icon: ShieldCheck, description: "Director availability & admin" },
  { label: "Backstage Pass", path: "/backstage", icon: ClipboardList, description: "Tasks & check-ins" },
];

const maintainerNavItems: NavItem[] = [
  { label: "Maintainer Dashboard", path: "/maintainer", icon: LayoutDashboard, description: "System & Core Maintenance" },
  { label: "Platform Analytics", path: "/analytics", icon: LineChart, description: "Forecasting & system health" },
  { label: "Compliance Ledger", path: "/compliance", icon: Scale, description: "Financial audit & ledger" },
  { label: "Production Control", path: "/control-panel", icon: Sliders, description: "Technical & access control panel" },
  { label: "Profile Audit", path: "/profile-audit", icon: Users, description: "Member profile & audit trail" },
  { label: "Media Moderation", path: "/media-moderation", icon: HardDrive, description: "Review gallery content & storage" },
  { label: "Events Management", path: "/events-admin", icon: Calendar, description: "Proposal curation & concurrent lock editor" },
];

const personas = [
  { name: "Jayesh Dave", role: "Lead Actor & Member", initials: "JD", email: "jayesh.d@matinee.club" },
  { name: "Siddharth Verma", role: "Production Coordinator", initials: "SV", email: "siddharth.v@matinee.club" },
  { name: "Lakshya Hari", role: "Grand Patron & Sponsor", initials: "LH", email: "lakshya.h@matinee.club" },
  { name: "Sneha Vyas", role: "Director & Coordinator", initials: "SV", email: "sneha.v@matinee.club" },
  { name: "Julian Devereux", role: "Core Maintainer", initials: "JD", email: "maintainer@matinee.club" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Interactive States
  const [hasUnread, setHasUnread] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  // Active User Profile (starts as null for public guest)
  const [activeUser, setActiveUser] = useState<any>(null);

  // Editing Profile states
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editNumber, setEditNumber] = useState("+91 98765 43210");
  const [headshotName, setHeadshotName] = useState("jayesh_headshot.jpg");
  const [resumeName, setResumeName] = useState("jayesh_resume.pdf");
  const [rolePreference, setRolePreference] = useState("Performer");

  const isLandingPage = location.pathname === "/";

  const filteredNavItems = activeUser?.role.toLowerCase().includes("maintainer")
    ? maintainerNavItems
    : navItems.filter((item) => {
      const isMember = activeUser?.role.toLowerCase().includes("member") || false;
      if (isMember) {
        // Display only Home, Member Dashboard, Auditions & Casting, and Gallery.
        return ["/", "/member", "/auditions", "/gallery"].includes(item.path);
      }
      return true;
    });

  const activeItem = navItems.find((item) => item.path === location.pathname) ||
    maintainerNavItems.find((item) => item.path === location.pathname) ||
    navItems[0];

  const handleSwitchPersona = (personaName: string) => {
    const selected = personas.find(p => p.name === personaName);
    if (selected) {
      setActiveUser(selected);
      setEditName(selected.name);
      setEditRole(selected.role);
      setEditEmail(selected.email);
      setPortalOpen(false);

      // Sync mocked user states
      if (personaName === "Jayesh Dave") {
        setEditNumber("+91 98765 43210");
        setHeadshotName("jayesh_headshot.jpg");
        setResumeName("jayesh_resume.pdf");
        setRolePreference("Performer");
      } else if (personaName === "Siddharth Verma") {
        setEditNumber("+91 98765 12345");
        setHeadshotName("siddharth_headshot.jpg");
        setResumeName("siddharth_resume.pdf");
        setRolePreference("Technical Crew");
      } else if (personaName === "Lakshya Hari") {
        setEditNumber("+91 98765 99999");
        setHeadshotName("lakshya_headshot.jpg");
        setResumeName("lakshya_resume.pdf");
        setRolePreference("Creative Designer");
      } else if (personaName === "Julian Devereux") {
        setEditNumber("+91 98765 88888");
        setHeadshotName("julian_headshot.jpg");
        setResumeName("julian_resume.pdf");
        setRolePreference("Core Maintainer");
      } else {
        setEditNumber("+91 98765 33333");
        setHeadshotName("sneha_headshot.jpg");
        setResumeName("sneha_resume.pdf");
        setRolePreference("Director");
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveUser({
      name: editName,
      role: editRole,
      email: editEmail,
      initials: editName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    });
    setProfileSettingsOpen(false);
  };

  const handleLogOut = () => {
    setActiveUser(null);
    setProfileSettingsOpen(false);
    navigate("/");
  };

  const isMember = activeUser?.role.toLowerCase().includes("member") || false;
  const isAllowedPath = ["/", "/member", "/auditions", "/gallery"].includes(location.pathname);
  const showAccessDenied = activeUser && isMember && !isAllowedPath;

  const sidebarWidthClass = isCollapsed ? "w-[72px]" : "w-64 xl:w-72";

  return (
    <div className="min-h-screen flex bg-[#fdf9f4] text-[#466272] font-sans">
      {/* Desktop Sidebar */}
      {!isLandingPage && activeUser && (
        <aside className={`hidden md:block ${sidebarWidthClass} flex-shrink-0 transition-all duration-300`}>
          <div className={`fixed top-0 left-0 bottom-0 ${sidebarWidthClass} transition-all duration-300`}>
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              filteredNavItems={filteredNavItems}
              activeUser={activeUser}
              setProfileSettingsOpen={setProfileSettingsOpen}
              isMobile={false}
            />
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#fdf9f4]/80 backdrop-blur-md border-b border-[#e6e2dd] h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            {!isLandingPage && activeUser && (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-[#466272] hover:bg-[#f7f3ee]" />}>
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 border-r-0">
                  <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    filteredNavItems={filteredNavItems}
                    activeUser={activeUser}
                    setProfileSettingsOpen={setProfileSettingsOpen}
                    setMobileOpen={setMobileOpen}
                    isMobile={true}
                  />
                </SheetContent>
              </Sheet>
            )}

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#466272]/75 font-semibold hidden sm:inline">
                {activeItem.description}
              </span>
              <h1 className="text-lg font-bold font-serif text-[#635f41] leading-tight">
                {activeItem.label}
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {activeUser && (
              <>
                {/* Notification Trigger */}
                <Dialog open={notificationsOpen} onOpenChange={(openState) => {
                  setNotificationsOpen(openState);
                  if (openState) setHasUnread(false);
                }}>
                  <DialogTrigger render={<Button variant="ghost" size="icon" className="relative text-[#466272] hover:bg-[#f7f3ee] rounded-full" />}>
                    <Bell className="w-5 h-5" />
                    {hasUnread && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#fdf9f4]"></span>
                    )}
                  </DialogTrigger>
                  <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-[#635f41] flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#8CC0EB]" /> Notifications Inbox
                      </DialogTitle>
                      <DialogDescription className="text-xs text-[#466272]/85">
                        Recent backstage dispatches and production updates.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                      <div className="p-3 bg-white border border-[#e6e2dd] rounded-[8px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#635f41]">Macbeth Rehearsal Update</span>
                          <span className="text-[10px] text-[#466272]/60">10m ago</span>
                        </div>
                        <p className="text-xs text-[#466272]/90">
                          Dress run and stage lighting sync confirmed for July 07 at 4:00 PM. Presence required.
                        </p>
                      </div>
                      <div className="p-3 bg-white border border-[#e6e2dd] rounded-[8px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#635f41]">Prop Transfer Registered</span>
                          <span className="text-[10px] text-[#466272]/60">2h ago</span>
                        </div>
                        <p className="text-xs text-[#466272]/90">
                          Jayesh Dave checked out <strong>Banquet Goblet (Gold)</strong>. Return window is 2 days.
                        </p>
                      </div>
                      <div className="p-3 bg-white border border-[#e6e2dd] rounded-[8px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#635f41]">Budget Claim Approved</span>
                          <span className="text-[10px] text-[#466272]/60">1d ago</span>
                        </div>
                        <p className="text-xs text-[#466272]/90">
                          Velvet curtains fabric claim ($350.00) signed off by sponsor committee.
                        </p>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-between items-center gap-4">
                      <span className="text-[11px] text-[#466272]/60 italic">Authenticated via Aayam Hub</span>
                      <Button onClick={() => setNotificationsOpen(false)} className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                        Dismiss
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {isLandingPage && (
                  <button
                    onClick={() => setProfileSettingsOpen(true)}
                    className="w-9 h-9 rounded-full bg-[#635f41]/10 border border-[#e6e2dd] flex items-center justify-center text-[#635f41] font-bold text-sm hover:bg-[#635f41]/15 transition-all"
                    title="User Profile Settings"
                  >
                    {activeUser.initials}
                  </button>
                )}
              </>
            )}

            {/* Portal Access Dialog (Login Button) - shown only when logged out */}
            {!activeUser && (
              <Dialog open={portalOpen} onOpenChange={setPortalOpen}>
                <DialogTrigger render={<Button className="gap-2 bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/95 font-semibold rounded-[8px] h-9 px-4 transition-all active:scale-95 flex items-center" />}>
                  <User className="w-4 h-4 text-[#1c1b19]" />
                  <span className="text-xs font-semibold">Portal Access</span>
                </DialogTrigger>
                <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-[#635f41] flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-[#8CC0EB]" /> Swapping Persona
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#466272]/85">
                      Select a local role to simulate permissions across different Aayam boards.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-2">
                    {personas.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => handleSwitchPersona(p.name)}
                        className={`w-full p-3 rounded-[8px] border text-left flex items-center justify-between hover:bg-[#e6e2dd]/40 transition-all ${activeUser && activeUser.name === p.name
                          ? "border-[#8CC0EB] bg-white font-bold text-[#635f41]"
                          : "border-[#e6e2dd] bg-[#f7f3ee]/40 text-[#466272]"
                          }`}
                      >
                        <div>
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-[10px] text-[#466272]/70 font-normal">{p.role}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-gray-500 rounded-[4px]">
                          {p.initials}
                        </Badge>
                      </button>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setPortalOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px] w-full">
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {/* User Account Settings Sheet */}
        <Sheet open={profileSettingsOpen} onOpenChange={setProfileSettingsOpen}>
          <SheetContent side="right" className="bg-[#fdf9f4] border-l border-[#e6e2dd] text-[#466272] w-full sm:max-w-md overflow-y-auto">
            {activeUser && (
              <form onSubmit={handleSaveProfile}>
                <SheetHeader className="pb-6 border-b border-[#e6e2dd]">
                  <SheetTitle className="font-serif text-[#635f41] text-lg font-bold flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#8CC0EB]" /> Account Settings
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[#466272]/85">
                    Update your Matinee Club profile details, preferences, and files.
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#635f41]">Profile Initials Avatar</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#635f41]/10 border border-[#e6e2dd] flex items-center justify-center text-[#635f41] font-bold text-lg">
                          {activeUser.initials}
                        </div>
                        <span className="text-xs text-[#466272]/65 italic">Autogenerated from your Name.</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#635f41]">Display Name</label>
                      <Input
                        placeholder="e.g., Jayesh Dave"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#635f41]">Phone Number</label>
                      <Input
                        placeholder="e.g., +91 98765 43210"
                        value={editNumber}
                        onChange={(e) => setEditNumber(e.target.value)}
                        className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#635f41]">Email Address</label>
                      <Input
                        type="email"
                        placeholder="e.g., jayesh.d@matinee.club"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                        required
                      />
                    </div>

                    {/* File Upload Slots */}
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-3">
                        <div className="text-left">
                          <p className="text-xs font-semibold text-[#635f41]">Headshot Photo</p>
                          <p className="text-[10px] text-[#466272]/70 truncate max-w-[200px]">{headshotName}</p>
                        </div>
                        <label className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 cursor-pointer rounded-[4px] px-2.5 py-1 text-[10px] font-semibold transition-all">
                          Upload File
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setHeadshotName(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex justify-between items-center bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-3">
                        <div className="text-left">
                          <p className="text-xs font-semibold text-[#635f41]">Resume / Bio File</p>
                          <p className="text-[10px] text-[#466272]/70 truncate max-w-[200px]">{resumeName}</p>
                        </div>
                        <label className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 cursor-pointer rounded-[4px] px-2.5 py-1 text-[10px] font-semibold transition-all">
                          Upload File
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setResumeName(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#635f41] block mb-1">Member Classification</label>
                      <Select value={rolePreference} onValueChange={(val) => setRolePreference(val ?? "")}>
                        <SelectTrigger className="w-full border-[#e6e2dd] bg-white text-[#466272] hover:bg-gray-50 focus:ring-[#8CC0EB] text-sm h-10 px-3 flex items-center justify-between rounded-lg">
                          <SelectValue placeholder="Select Classification" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#e6e2dd] text-[#466272] rounded-lg shadow-md mt-1 z-[100] max-h-60 overflow-y-auto">
                          <SelectGroup>
                            <SelectItem value="Performer" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Performer</SelectItem>
                            <SelectItem value="Technical Crew" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Technical Crew</SelectItem>
                            <SelectItem value="Creative Designer" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Creative Designer</SelectItem>
                            <SelectItem value="Director" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Director</SelectItem>
                            <SelectItem value="Core Maintainer" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Core Maintainer</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#e6e2dd] flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogOut}
                    className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[8px] flex-1"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </Button>
                  <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px] flex-1">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </SheetContent>
        </Sheet>

        {/* Dynamic Route Content */}
        <main className="flex-1 px-4 md:px-[64px] py-8 md:py-[48px] max-w-[1280px] mx-auto w-full">
          {showAccessDenied ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white border border-[#e6e2dd] rounded-[8px] space-y-6 shadow-xs max-w-md mx-auto mt-8">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-[#635f41]">Restricted Stage Access</h3>
                <p className="text-sm text-[#466272] leading-relaxed">
                  Your current role (<strong className="text-[#635f41]">{activeUser.role}</strong>) does not have authorization to access this operational area.
                </p>
              </div>
              <Link
                to="/member"
                className="bg-[#8CC0EB] hover:bg-[#8CC0EB]/90 text-[#1c1b19] font-semibold text-xs rounded-[8px] py-2.5 px-6 shadow-sm transition-all active:scale-95 flex items-center gap-2"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
