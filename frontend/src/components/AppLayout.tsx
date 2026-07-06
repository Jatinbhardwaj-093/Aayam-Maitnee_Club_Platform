import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  ShieldAlert
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  { label: "Production Gallery", path: "/gallery", icon: ImageIcon, description: "Performances & backstage media" },
  { label: "Production Office", path: "/admin", icon: ShieldCheck, description: "Director availability & admin" },
  { label: "Backstage Pass", path: "/backstage", icon: ClipboardList, description: "Tasks & check-ins" },
];

const personas = [
  { name: "Julian Devereux", role: "Lead Actor & Member", initials: "JD", email: "julian.d@matinee.club" },
  { name: "Sebastian Vance", role: "Production Coordinator", initials: "SV", email: "sebastian.v@matinee.club" },
  { name: "Lord Harrington", role: "Grand Patron & Sponsor", initials: "LH", email: "harrington@matinee.club" },
  { name: "Sarah Vance", role: "Director & Coordinator", initials: "SV", email: "sarah.v@matinee.club" },
];

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Interactive States
  const [hasUnread, setHasUnread] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  // Active User Profile
  const [activeUser, setActiveUser] = useState(personas[0]);

  // Editing Profile states
  const [editName, setEditName] = useState(activeUser.name);
  const [editRole, setEditRole] = useState(activeUser.role);
  const [editEmail, setEditEmail] = useState(activeUser.email);

  const activeItem = navItems.find((item) => item.path === location.pathname) || navItems[0];

  const handleSwitchPersona = (personaName: string) => {
    const selected = personas.find(p => p.name === personaName);
    if (selected) {
      setActiveUser(selected);
      setEditName(selected.name);
      setEditRole(selected.role);
      setEditEmail(selected.email);
      setPortalOpen(false);
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

  const SidebarContent = ({ isMobile = false }) => {
    const collapsed = isCollapsed && !isMobile;

    return (
      <div className="flex flex-col h-full bg-[#f7f3ee] border-r border-[#e6e2dd] text-[#466272] font-sans">
        {/* Sidebar Brand Header */}
        <div className={`p-6 border-b border-[#e6e2dd] flex ${collapsed ? "flex-col items-center gap-4" : "items-center justify-between"}`}>
          {collapsed ? (
            <>
              <span className="text-lg font-bold font-serif text-[#635f41]">SD</span>
              <button 
                onClick={() => setIsCollapsed(false)} 
                className="text-[#466272] hover:text-[#635f41] p-1.5 hover:bg-[#e6e2dd]/60 rounded-full transition-all"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#635f41] font-bold">AAYAM</span>
                <h2 className="text-xl font-bold font-serif text-[#635f41] mt-0.5 leading-tight">The Matinee Club</h2>
              </div>
              {!isMobile && (
                <button 
                  onClick={() => setIsCollapsed(true)} 
                  className="text-[#466272] hover:text-[#635f41] p-1.5 hover:bg-[#e6e2dd]/60 rounded-full transition-all"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation List */}
        <nav className={`flex-1 px-4 py-6 space-y-1.5 overflow-y-auto ${collapsed ? "flex flex-col items-center" : ""}`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (collapsed) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-center w-10 h-10 rounded-[8px] transition-all group relative ${
                    isActive
                      ? "bg-[#635f41]/10 text-[#635f41] font-bold"
                      : "hover:bg-[#635f41]/5 hover:text-[#635f41]"
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#635f41]" : "text-[#466272]/70"
                  }`} />
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[8px] text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-[#635f41]/10 text-[#635f41] font-bold"
                    : "hover:bg-[#635f41]/5 hover:text-[#635f41]"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                  isActive ? "text-[#635f41]" : "text-[#466272]/70"
                }`} />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  <span className="text-[10px] text-[#466272]/65 font-normal leading-none mt-0.5 group-hover:text-[#466272]/85">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info (Interactive Profile Trigger) */}
        <button 
          onClick={() => setProfileSettingsOpen(true)}
          className={`p-4 border-t border-[#e6e2dd] bg-[#e6e2dd]/40 flex text-left w-full hover:bg-[#e6e2dd]/65 transition-all ${collapsed ? "justify-center" : "items-center gap-3"}`}
          title="User Account Details"
        >
          <div className="w-9 h-9 rounded-full bg-[#635f41]/10 border border-[#e6e2dd] flex items-center justify-center text-[#635f41] font-bold flex-shrink-0">
            {activeUser.initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#635f41] truncate">{activeUser.name}</p>
              <p className="text-[10px] text-[#466272]/75 truncate">{activeUser.role}</p>
            </div>
          )}
        </button>
      </div>
    );
  };

  const sidebarWidthClass = isCollapsed ? "w-[72px]" : "w-64 xl:w-72";

  return (
    <div className="min-h-screen flex bg-[#fdf9f4] text-[#466272] font-sans">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block ${sidebarWidthClass} flex-shrink-0 transition-all duration-300`}>
        <div className={`fixed top-0 left-0 bottom-0 ${sidebarWidthClass} transition-all duration-300`}>
          <SidebarContent isMobile={false} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#fdf9f4]/80 backdrop-blur-md border-b border-[#e6e2dd] h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-[#466272] hover:bg-[#f7f3ee]" />}>
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0">
                <SidebarContent isMobile={true} />
              </SheetContent>
            </Sheet>

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
                      Julian Devereux checked out <strong>Banquet Goblet (Gold)</strong>. Return window is 2 days.
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

            <div className="h-6 w-px bg-[#e6e2dd]" />

            {/* Portal Access Dialog */}
            <Dialog open={portalOpen} onOpenChange={setPortalOpen}>
              <DialogTrigger render={<Button variant="outline" className="gap-2 border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px] h-9 px-4" />}>
                <User className="w-4 h-4 text-[#8CC0EB]" />
                <span className="text-xs font-semibold hidden sm:inline">Portal Access</span>
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
                      className={`w-full p-3 rounded-[8px] border text-left flex items-center justify-between hover:bg-[#e6e2dd]/40 transition-all ${
                        activeUser.name === p.name 
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
          </div>
        </header>

        {/* User Account Settings Dialog (Bottom Left profile menu) */}
        <Dialog open={profileSettingsOpen} onOpenChange={setProfileSettingsOpen}>
          <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-md">
            <form onSubmit={handleSaveProfile}>
              <DialogHeader>
                <DialogTitle className="font-serif text-[#635f41] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#8CC0EB]" /> Account Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-[#466272]/85">
                  Update active credentials and contact information.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
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
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] bg-white text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Role Designation</label>
                  <Input 
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] bg-white text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Email Address</label>
                  <Input 
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] bg-white text-sm"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setProfileSettingsOpen(false)}
                  className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[8px]"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </Button>
                <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dynamic Route Content */}
        <main className="flex-1 px-4 md:px-[64px] py-8 md:py-[48px] max-w-[1280px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
