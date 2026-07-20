import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Home,
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  User,
  LineChart,
  Scale,
  Sliders,
  HardDrive,
  Calendar,
  Menu,
  ShieldAlert,
  PlayCircle,
  FileText
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
}

const navItems: NavItem[] = [
  { label: "Drama Club Home", path: "/", icon: Home, description: "Public landing page" },
  { label: "Member Dashboard", path: "/member", icon: LayoutDashboard, description: "Your rehearsals & schedules" },
  { label: "My Schedule", path: "/schedule", icon: Calendar, description: "Your production schedule" },
  { label: "Auditions", path: "/auditions", icon: ClipboardList, description: "Apply for play casting" },
  { label: "Plays & Productions", path: "/member-plays", icon: PlayCircle, description: "Production lineup & scripts" },
  { label: "Script Vault", path: "/member-scripts", icon: FileText, description: "Confidential play scripts" },
];

const maintainerNavItems: NavItem[] = [
  { label: "Maintainer Dashboard", path: "/maintainer", icon: LayoutDashboard, description: "System & Core Maintenance" },
  { label: "Production Control", path: "/control-panel", icon: Sliders, description: "Technical & access control panel" },
  { label: "Events Management", path: "/events-admin", icon: Calendar, description: "Proposal curation & concurrent lock editor" },
  { label: "Members Directory", path: "/directory-admin", icon: Users, description: "Ensemble & crew directory" },
  { label: "Media Moderation", path: "/media-moderation", icon: HardDrive, description: "Review gallery content & storage" },
  { label: "Platform Analytics", path: "/analytics", icon: LineChart, description: "Forecasting & system health" },
  { label: "Compliance Ledger", path: "/compliance", icon: Scale, description: "Financial audit & ledger" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Active User Profile (persisted in sessionStorage to survive page refresh and allow multiple sessions across tabs)
  const [activeUser, setActiveUser] = useState<any>(() => {
    const saved = sessionStorage.getItem("aayam_active_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Interactive States
  const [hasUnread, setHasUnread] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

  // Notifications from Backend
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!activeUser?.email) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/notifications?email=${encodeURIComponent(activeUser.email)}`);
        if (res.ok) {
          const data = await res.json();
          setDbNotifications(data);
          const unread = data.some((n: any) => !n.is_read);
          setHasUnread(unread);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [activeUser]);

  const handleMarkAllRead = async () => {
    if (!activeUser?.email) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/notifications/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: activeUser.email })
      });
      setHasUnread(false);
      setDbNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const isMaintainer = activeUser?.role.toLowerCase().includes("maintainer") || activeUser?.isAdmin || false;

  const isLandingPage = ["/", "/about", "/manifesto", "/plays", "/events", "/directory", "/gallery", "/public-gallery"].includes(location.pathname) || location.pathname.startsWith("/profile") || !activeUser;

  const filteredNavItems = isMaintainer
    ? maintainerNavItems
    : navItems.filter((item) => {
        if (item.path === "/") {
          return false;
        }
        const isNormalMember = !isMaintainer;
        if (isNormalMember) {
          // Display only Member Dashboard, My Schedule, Auditions, Plays, and Scripts.
          return ["/member", "/schedule", "/auditions", "/member-plays", "/member-scripts"].includes(item.path);
        }
        return true;
      });

  const activeItem = navItems.find((item) => item.path === location.pathname) ||
    maintainerNavItems.find((item) => item.path === location.pathname) ||
    navItems[0];

  const handleLoginSubmit = async (email: string, password?: string) => {
    setLoginError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: password || "" }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setLoginError(errData.error || "Login request failed");
        return;
      }

      const data = await response.json();
      if (data.status === "success" && data.user) {
        const user = data.user;
        sessionStorage.setItem("aayam_active_user", JSON.stringify(user));
        if (data.token) {
          sessionStorage.setItem("aayam_session_token", data.token);
        }
        setActiveUser(user);
        setPortalOpen(false);

        // Redirect based on role
        if (user.role.toLowerCase().includes("maintainer") || user.isAdmin) {
          navigate("/maintainer");
        } else {
          navigate("/member");
        }
      } else {
        setLoginError("Invalid response from login endpoint");
        return;
      }
    } catch (err: any) {
      console.warn("Backend login failed:", err);
      setLoginError("Unable to login right now. Please try again.");
    }
  };

  const handleLogOut = () => {
    sessionStorage.removeItem("aayam_active_user");
    sessionStorage.removeItem("aayam_session_token");
    setActiveUser(null);
    navigate("/");
  };

  const isMember = activeUser ? !isMaintainer : false;
  const isAllowedPath = ["/", "/member", "/schedule", "/auditions", "/member-plays", "/member-scripts", "/plays", "/events", "/directory", "/gallery", "/public-gallery"].includes(location.pathname) || location.pathname.startsWith("/profile");
  const showAccessDenied = activeUser && !isMaintainer && isMember && !isAllowedPath;

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
              isMobile={false}
              onLogOut={handleLogOut}
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
                    to="/about"
                    className={`text-sm font-semibold tracking-wide transition-all ${
                      location.pathname === "/about" || location.pathname === "/manifesto"
                        ? "text-[#635f41] border-b-2 border-[#635f41] pb-1"
                        : "text-[#466272] hover:text-[#635f41]"
                    }`}
                  >
                    About / Manifesto
                  </Link>
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
                  <Link
                    to="/gallery"
                    className={`text-sm font-semibold tracking-wide transition-all ${
                      location.pathname === "/gallery" || location.pathname === "/public-gallery"
                        ? "text-[#635f41] border-b-2 border-[#635f41] pb-1"
                        : "text-[#466272] hover:text-[#635f41]"
                    }`}
                  >
                    Gallery
                  </Link>
                </nav>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                {activeUser ? (
                  <Link
                    to={isMaintainer ? "/maintainer" : "/member"}
                    className="bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-[8px] h-9 px-4 flex items-center text-xs font-semibold tracking-wider transition-all uppercase"
                  >
                    Dashboard
                  </Link>
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
                      setMobileOpen={setMobileOpen}
                      isMobile={true}
                      onLogOut={handleLogOut}
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
                  <Link
                    to="/"
                    className="border border-[#cac6b9]/40 text-[#635f41] hover:bg-[#e6e2dd]/40 rounded-[8px] h-9 px-4 flex items-center text-xs font-semibold tracking-wider transition-all uppercase"
                  >
                    Landing Page
                  </Link>
                  {/* Notification Trigger */}
                  <Dialog open={notificationsOpen} onOpenChange={(openState) => {
                    setNotificationsOpen(openState);
                    if (openState) {
                      handleMarkAllRead();
                    }
                  }}>
                    <DialogTrigger render={<Button variant="ghost" size="icon" className="relative text-[#466272] hover:bg-[#f7f3ee] rounded-full" />}>
                      <Bell className="w-5 h-5" />
                      {hasUnread && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#fdf9f4]"></span>
                      )}
                    </DialogTrigger>
                    <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-[#635f41] flex items-center justify-between gap-2">
                          <span className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[#8CC0EB]" /> Notifications Inbox
                          </span>
                          {hasUnread && (
                            <Badge className="bg-red-100 text-red-700 text-[10px] font-bold">New Updates</Badge>
                          )}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#466272]/85">
                          Live dispatches and production updates for <strong>{activeUser.name}</strong>.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {dbNotifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#466272]/70 italic">
                            No notifications in your inbox.
                          </div>
                        ) : (
                          dbNotifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-3.5 border rounded-[10px] space-y-1 transition-all ${
                                notif.is_read ? "bg-white/70 border-[#e6e2dd]" : "bg-white border-[#8CC0EB] shadow-xs"
                              }`}
                            >
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-xs font-bold text-[#635f41] flex items-center gap-1.5">
                                  {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#8CC0EB] inline-block"></span>}
                                  {notif.title || "Production Notice"}
                                </span>
                                <span className="text-[10px] text-[#466272]/60 font-mono flex-shrink-0">
                                  {notif.created_at || "Recent"}
                                </span>
                              </div>
                              <p className="text-xs text-[#466272]/90 leading-relaxed font-light">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      <DialogFooter className="sm:justify-between items-center gap-4 border-t border-[#e6e2dd] pt-3">
                        <span className="text-[11px] text-[#466272]/60 italic">Live SQLite DB Feed</span>
                        <div className="flex gap-2">
                          <Button onClick={handleMarkAllRead} variant="outline" className="text-xs font-bold border-[#e6e2dd] text-[#635f41]">
                            Mark All Read
                          </Button>
                          <Button onClick={() => setNotificationsOpen(false)} className="bg-[#8CC0EB] text-[#001e2c] font-bold hover:bg-[#8CC0EB]/90 rounded-[8px]">
                            Dismiss
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
              handleLoginSubmit(target.email.value, target.password.value);
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
                  <Link className="text-[#466272]/85 hover:text-[#635f41] transition-colors" to="/public-gallery">Gallery</Link>
                </nav>
              </div>
            </footer>
          </>
        ) : (
          <main className="flex-1 px-4 md:px-8 py-4 md:py-6 max-w-[1280px] mx-auto w-full">
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
