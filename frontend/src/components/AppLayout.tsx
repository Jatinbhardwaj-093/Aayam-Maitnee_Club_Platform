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
  { label: "Media Moderation", path: "/media-moderation", icon: HardDrive, description: "Review gallery content & storage" },
  { label: "Events Management", path: "/events-admin", icon: Calendar, description: "Proposal curation & concurrent lock editor" },
  { label: "Members Directory", path: "/directory", icon: Users, description: "Ensemble & crew directory" },
];

// personas deleted

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
  const [loginError, setLoginError] = useState<string | null>(null);

  // Editing Profile states
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editNumber, setEditNumber] = useState("+91 98765 43210");
  const [headshotName, setHeadshotName] = useState("jayesh_headshot.jpg");
  const [resumeName, setResumeName] = useState("jayesh_resume.pdf");
  const [rolePreference, setRolePreference] = useState("Performer");

  const isLandingPage = ["/", "/plays", "/events", "/directory"].includes(location.pathname) || location.pathname.startsWith("/profile") || !activeUser;

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

  const handleLoginSubmit = async (email: string) => {
    setLoginError(null);
    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Login request failed");
      }

      const data = await response.json();
      if (data.status === "success" && data.user) {
        const user = data.user;
        setActiveUser(user);
        setEditName(user.name);
        setEditRole(user.role);
        setEditEmail(user.email);
        setPortalOpen(false);

        // Sync mocked/stored user details based on role and redirect
        if (user.role.includes("Maintainer")) {
          setEditNumber("+91 98765 88888");
          setHeadshotName("julian_headshot.jpg");
          setResumeName("julian_resume.pdf");
          setRolePreference("Core Maintainer");
          navigate("/maintainer");
        } else if (user.role.includes("Sponsor")) {
          setEditNumber("+91 98765 99999");
          setHeadshotName("lakshya_headshot.jpg");
          setResumeName("lakshya_resume.pdf");
          setRolePreference("Creative Designer");
          navigate("/member");
        } else if (user.name === "Sneha Vyas") {
          setEditNumber("+91 98765 33333");
          setHeadshotName("sneha_headshot.jpg");
          setResumeName("sneha_resume.pdf");
          setRolePreference("Director");
          navigate("/member");
        } else {
          setEditNumber("+91 98765 43210");
          setHeadshotName("jayesh_headshot.jpg");
          setResumeName("jayesh_resume.pdf");
          setRolePreference("Performer");
          navigate("/member");
        }
      } else {
        throw new Error("Invalid response from login endpoint");
      }
    } catch (err: any) {
      console.warn("Using local fallback credentials because backend login failed:", err);
      let user: any = null;
      const lowerEmail = email.toLowerCase();
      
      if (lowerEmail.includes("maintainer") || lowerEmail.includes("admin")) {
        user = { name: "Julian Devereux", role: "Core Maintainer", initials: "JD", email: email };
      } else if (lowerEmail.includes("sponsor") || lowerEmail.includes("patron")) {
        user = { name: "Lakshya Hari", role: "Grand Patron & Sponsor", initials: "LH", email: email };
      } else if (lowerEmail.includes("director")) {
        user = { name: "Sneha Vyas", role: "Director & Coordinator", initials: "SV", email: email };
      } else if (lowerEmail.includes("coordinator")) {
        user = { name: "Siddharth Verma", role: "Production Coordinator", initials: "SV", email: email };
      } else {
        user = { name: "Jayesh Dave", role: "Lead Actor & Member", initials: "JD", email: email };
      }
      
      setActiveUser(user);
      setEditName(user.name);
      setEditRole(user.role);
      setEditEmail(user.email);
      setPortalOpen(false);
      
      // Sync mocked user states & redirect
      if (user.role.includes("Maintainer")) {
        setEditNumber("+91 98765 88888");
        setHeadshotName("julian_headshot.jpg");
        setResumeName("julian_resume.pdf");
        setRolePreference("Core Maintainer");
        navigate("/maintainer");
      } else if (user.role.includes("Sponsor")) {
        setEditNumber("+91 98765 99999");
        setHeadshotName("lakshya_headshot.jpg");
        setResumeName("lakshya_resume.pdf");
        setRolePreference("Creative Designer");
        navigate("/member");
      } else if (user.name === "Sneha Vyas") {
        setEditNumber("+91 98765 33333");
        setHeadshotName("sneha_headshot.jpg");
        setResumeName("sneha_resume.pdf");
        setRolePreference("Director");
        navigate("/member");
      } else {
        setEditNumber("+91 98765 43210");
        setHeadshotName("jayesh_headshot.jpg");
        setResumeName("jayesh_resume.pdf");
        setRolePreference("Performer");
        navigate("/member");
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
  const isAllowedPath = ["/", "/member", "/auditions", "/gallery", "/plays", "/events", "/directory"].includes(location.pathname) || location.pathname.startsWith("/profile");
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
        {isLandingPage ? (
          <header className="sticky top-0 z-40 bg-[#fdf9f4]/90 backdrop-blur-xl border-b border-[#cac6b9]/40 h-20 transition-all duration-300">
            <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-7xl mx-auto h-full">
              {/* Logo / Brand */}
              <div className="flex items-center gap-12">
                <Link 
                  to="/" 
                  className="font-serif text-2xl font-bold tracking-tight text-[#635f41] hover:opacity-90 active:scale-95 transition-all"
                >
                  AAYAM
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-8">
                  <Link
                    to="/plays"
                    className={`text-sm font-semibold tracking-wide transition-all ${
                      location.pathname === "/plays"
                        ? "text-[#635f41] border-b-2 border-[#635f41] pb-1"
                        : "text-[#466272] hover:text-[#635f41]"
                    }`}
                  >
                    Our Plays
                  </Link>
                  <Link
                    to="/events"
                    className={`text-sm font-semibold tracking-wide transition-all ${
                      location.pathname === "/events"
                        ? "text-[#635f41] border-b-2 border-[#635f41] pb-1"
                        : "text-[#466272] hover:text-[#635f41]"
                    }`}
                  >
                    Events
                  </Link>
                  <Link
                    to="/directory"
                    className={`text-sm font-semibold tracking-wide transition-all ${
                      location.pathname === "/directory"
                        ? "text-[#635f41] border-b-2 border-[#635f41] pb-1"
                        : "text-[#466272] hover:text-[#635f41]"
                    }`}
                  >
                    Member Directory
                  </Link>
                </nav>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                {activeUser ? (
                  <button
                    onClick={() => setProfileSettingsOpen(true)}
                    className="w-9 h-9 rounded-full bg-[#635f41]/10 border border-[#e6e2dd] flex items-center justify-center text-[#635f41] font-bold text-sm hover:bg-[#635f41]/15 transition-all"
                    title="User Profile Settings"
                  >
                    {activeUser.initials}
                  </button>
                ) : (
                  <>
                    <Link
                      to="/join"
                      className="bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-[8px] h-9 px-4 flex items-center text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Join Club
                    </Link>
                    <Button 
                      onClick={() => setPortalOpen(true)}
                      className="gap-2 bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/95 font-semibold rounded-[8px] h-9 px-4 transition-all active:scale-95 flex items-center"
                    >
                      <User className="w-4 h-4 text-[#1c1b19]" />
                      <span className="text-xs font-semibold">Portal Access</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>
        ) : (
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

                  <button
                    onClick={() => setProfileSettingsOpen(true)}
                    className="w-9 h-9 rounded-full bg-[#635f41]/10 border border-[#e6e2dd] flex items-center justify-center text-[#635f41] font-bold text-sm hover:bg-[#635f41]/15 transition-all"
                    title="User Profile Settings"
                  >
                    {activeUser.initials}
                  </button>
                </>
              )}

              {/* Portal Access Dialog (Login Button) - shown only when logged out */}
              {!activeUser && (
                <Button 
                  onClick={() => setPortalOpen(true)}
                  className="gap-2 bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/95 font-semibold rounded-[8px] h-9 px-4 transition-all active:scale-95 flex items-center"
                >
                  <User className="w-4 h-4 text-[#1c1b19]" />
                  <span className="text-xs font-semibold">Portal Access</span>
                </Button>
              )}
            </div>
          </header>
        )}

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
                  <Button
                    type="button"
                    onClick={() => {
                      setProfileSettingsOpen(false);
                      navigate(activeUser?.role.toLowerCase().includes("maintainer") ? "/maintainer" : "/member");
                    }}
                    className="bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-lg w-full mb-6 font-semibold py-3 flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </Button>

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

        {/* Login Dialog */}
        <Dialog open={portalOpen} onOpenChange={setPortalOpen}>
          <DialogContent className="bg-[#fdf9f4] border border-[#cac6b9] text-[#466272] max-w-sm rounded-2xl shadow-xl p-6">
            <DialogHeader className="border-b border-[#e6e2dd]/60 pb-3 text-center">
              <DialogTitle className="font-serif text-[24px] text-[#635f41] leading-tight">Ensemble Portal</DialogTitle>
              <DialogDescription className="text-xs text-[#466272]/85 mt-1">
                Enter your credentials to access the Aayam backstage boards.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              handleLoginSubmit(target.email.value);
            }} className="py-4 space-y-4 text-left">
              {loginError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5 text-center font-medium animate-pulse">
                  {loginError}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. maintainer@matinee.club"
                  className="border-[#e6e2dd] h-10 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all text-sm rounded-lg"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Prototype info: any password is accepted."); }} className="text-[10px] text-[#8CC0EB] hover:underline font-semibold">Forgot?</a>
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="border-[#e6e2dd] h-10 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all text-sm rounded-lg"
                  required
                />
              </div>

              <span className="text-[9px] text-[#466272]/70 leading-relaxed block italic pt-1">
                Note: Use email containing <strong>'maintainer'</strong> for Admin, <strong>'sponsor'</strong> for Sponsor boards, or others for Member portal.
              </span>

              <DialogFooter className="pt-4 border-t border-[#e6e2dd]/60 flex flex-col gap-2 sm:flex-row">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setPortalOpen(false)} 
                  className="border-[#cac6b9] text-[#466272] hover:bg-[#f7f3ee] rounded-lg text-xs font-bold py-2.5 flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-lg text-xs font-bold py-2.5 flex-1"
                >
                  Sign In
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dynamic Route Content */}
        {isLandingPage ? (
          <>
            <main className="flex-1 w-full">
              <Outlet context={{ activeUser, setActiveUser }} />
            </main>
            
            {/* Footer */}
            <footer className="bg-white py-16 px-6 md:px-12 border-t border-[#cac6b9]/30 mt-auto w-full">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <h3 className="font-serif text-3xl font-bold text-[#635f41] mb-2 tracking-tight">AAYAM</h3>
                  <p className="text-sm text-[#466272]/70">Celebrating theatrical excellence and refined stagecraft.</p>
                </div>
                <nav className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-wider">
                  <Link className="text-[#466272]/85 hover:text-[#635f41] transition-colors" to="/">Home</Link>
                  <Link className="text-[#466272]/85 hover:text-[#635f41] transition-colors" to="/plays">Our Plays</Link>
                  <Link className="text-[#466272]/85 hover:text-[#635f41] transition-colors" to="/events">Upcoming Events</Link>
                  <Link className="text-[#466272]/85 hover:text-[#635f41] transition-colors" to="/directory">Member Directory</Link>
                </nav>
              </div>
            </footer>
          </>
        ) : (
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
              <Outlet context={{ activeUser, setActiveUser }} />
            )}
          </main>
        )}
      </div>
    </div>
  );
}
