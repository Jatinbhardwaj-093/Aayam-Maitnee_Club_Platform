import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Home,
  Users,
  ClipboardList,
  Bell,
  User,
  LineChart,
  HardDrive,
  Calendar,
  Menu,
  ShieldAlert,
  PlayCircle,
  FileText,
  Eye,
  EyeOff,
  Bot,
  Globe
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Drama Club Home", path: "/", icon: Home, description: "Public landing page" },
  { label: "My Schedule", path: "/schedule", icon: Calendar, description: "Your rehearsals & call attendance" },
  { label: "Auditions & Casting", path: "/auditions", icon: ClipboardList, description: "Apply for play casting" },
  { label: "Plays & Productions", path: "/member-plays", icon: PlayCircle, description: "Production lineup & scripts" },
  { label: "Script Vault", path: "/member-scripts", icon: FileText, description: "Confidential play scripts" },
  { label: "Rehearsal Studio", path: "/ai-rehearsal", icon: Bot, description: "Interactive voice script rehearsal & memory test" },
];

const maintainerNavItems: NavItem[] = [
  { label: "My Schedule", path: "/schedule", icon: Calendar, description: "Your rehearsals & call attendance" },
  { label: "Production Callboard", path: "/schedule-admin", icon: Calendar, description: "Rehearsal call sheets & attendance roster" },
  { label: "Plays & Productions", path: "/member-plays", icon: PlayCircle, description: "Production lineup & scripts" },
  { label: "Events Management", path: "/events-admin", icon: Calendar, description: "Proposal curation & sponsor deals" },
  { label: "Auditions & Casting", path: "/auditions-admin", icon: ClipboardList, description: "Role callings & candidate requests" },
  { label: "Members Directory", path: "/directory-admin", icon: Users, description: "Ensemble & crew directory" },
  { label: "Script Vault", path: "/member-scripts", icon: FileText, description: "Confidential play scripts & texts" },
  { label: "Rehearsal Studio", path: "/ai-rehearsal", icon: Bot, description: "Interactive voice script rehearsal" },
  { label: "Media Moderation", path: "/media-moderation", icon: HardDrive, description: "Review gallery content & storage" },
  { label: "Platform Analytics", path: "/analytics", icon: LineChart, description: "Graphical analytics & financial ledger" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setProfilePopoverOpen(false);
      }
    }
    if (profilePopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profilePopoverOpen]);


  useEffect(() => {
    const token = sessionStorage.getItem("aayam_session_token");
    if (token && activeUser) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      fetch(`${baseUrl}/api/profile/get`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          const updatedUser = { ...activeUser, ...data, image: data.image || data.avatarUrl };
          setActiveUser(updatedUser);
          sessionStorage.setItem("aayam_active_user", JSON.stringify(updatedUser));
        }
      })
      .catch(() => {});
    }
  }, []);


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
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleNotifClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleNotifClickOutside);
    } else {
      document.removeEventListener("mousedown", handleNotifClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleNotifClickOutside);
  }, [notificationsOpen]);
  const [portalOpen, setPortalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Notifications from Backend
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!activeUser?.email) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/notifications?email=${encodeURIComponent(activeUser.email)}`);
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
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/notifications/mark-read`, {
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

  const isMaintainer = (activeUser?.role && activeUser.role.toLowerCase().includes("maintainer")) || activeUser?.isAdmin || false;

  const isLandingPage = !activeUser || ["/", "/about", "/manifesto", "/plays", "/events", "/directory", "/gallery", "/public-gallery"].includes(location.pathname);

  const filteredNavItems = isMaintainer
    ? maintainerNavItems
    : navItems.filter((item) => {
      if (item.path === "/") {
        return false;
      }
      const isNormalMember = !isMaintainer;
      if (isNormalMember) {
        // Display My Schedule, Auditions, Plays, Scripts, and Rehearsal Studio.
        return ["/schedule", "/auditions", "/member-plays", "/member-scripts", "/ai-rehearsal"].includes(item.path);
      }
      return true;
    });

  const activeItem = navItems.find((item) => item.path === location.pathname) ||
    maintainerNavItems.find((item) => item.path === location.pathname) ||
    navItems[0];

  const handleLoginSubmit = async (identifier: string, password?: string) => {
    setLoginError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: identifier, email: identifier, password: password || "" }),
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

        // Default dashboard landing page is My Schedule for all members & maintainers
        navigate("/schedule");
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
  const isAllowedPath = ["/", "/member", "/schedule", "/schedule-admin", "/auditions", "/auditions-admin", "/member-plays", "/member-scripts", "/script-builder", "/ai-rehearsal", "/plays", "/events", "/events-admin", "/directory-admin", "/maintainer", "/analytics", "/directory", "/gallery", "/public-gallery"].includes(location.pathname) || location.pathname.startsWith("/profile") || location.pathname.startsWith("/script-builder") || location.pathname.startsWith("/ai-rehearsal");
  const showAccessDenied = activeUser && !isMaintainer && isMember && !isAllowedPath;

  const sidebarWidthClass = isCollapsed ? "w-[72px]" : "w-56 xl:w-64";

  
  const avatarFallbackMap: Record<string, string> = {
    "Aditi": "/aayam_assets/profiles/aditi_drama.jpg",
    "Samarth Shrivastava": "/aayam_assets/profiles/samarth_shrivastava.jpg",
    "Krishna Subramanian": "/aayam_assets/profiles/krishna_subramanian.jpg",
    "Harsh Aryan": "/aayam_assets/profiles/harsh_aryan.jpg",
    "Swati Singh": "/aayam_assets/profiles/swati_singh.jpg",
    "Sneha Das": "/aayam_assets/profiles/sylene_bansal.jpg",
    "Tanu Kurade": "/aayam_assets/profiles/tanu_kurade.jpg",
    "Akanksha Kadam": "/aayam_assets/profiles/akanksha_kadam.jpg",
    "Chirag Kumar": "/aayam_assets/profiles/chirag_kumar.jpg",
    "Sylene Bansal": "/aayam_assets/profiles/sylene_bansal.jpg",
    "Esha Hinde": "/aayam_assets/profiles/esha_hinde.jpg",
    "Aarav Varma": "/aayam_assets/profiles/kanishk_mishra.jpg",
    "Abay Nandhiga": "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
    "Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg",
    "Utkarsh / Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg"
  };

  const resolvedAvatar = activeUser?.image || activeUser?.avatarUrl || (activeUser ? avatarFallbackMap[activeUser.name] : null);


  return (
    <div className="min-h-screen flex bg-[#E7DDD3] text-[#666361] font-sans">
      {/* Desktop Sidebar */}
      {!isLandingPage && activeUser && (
        <aside className={`hidden md:block ${sidebarWidthClass} flex-shrink-0 transition-all duration-300`}>
          <div className={`fixed top-0 left-0 bottom-0 ${sidebarWidthClass} transition-all duration-300`}>
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              filteredNavItems={filteredNavItems}
              
              isMobile={false}
              
            />
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Top Navigation Bar */}
        {isLandingPage ? (
          <header className="sticky top-0 z-40 bg-[#E7DDD3]/90 backdrop-blur-xl border-b border-[#D5C9BE]/40 h-20 transition-all duration-300">
            <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-7xl mx-auto h-full">
              {/* Logo / Brand */}
              <div className="flex items-center gap-10">
                <Link
                  to="/"
                  className="group flex items-center gap-2.5"
                >
                  <span className="font-serif text-2xl font-semibold tracking-wider text-[#2C2A28] group-hover:text-[#E85F57] transition-colors">
                    AAYAM
                  </span>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-8">
                  <Link
                    to="/about"
                    className={`text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === "/about" || location.pathname === "/manifesto"
                      ? "text-[#E85F57] border-b-2 border-[#E85F57] pb-1"
                      : "text-[#666361] hover:text-[#2C2A28]"
                      }`}
                  >
                    Manifesto
                  </Link>
                  <Link
                    to="/plays"
                    className={`text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === "/plays"
                      ? "text-[#E85F57] border-b-2 border-[#E85F57] pb-1"
                      : "text-[#666361] hover:text-[#2C2A28]"
                      }`}
                  >
                    Our Plays
                  </Link>
                  <Link
                    to="/events"
                    className={`text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === "/events"
                      ? "text-[#E85F57] border-b-2 border-[#E85F57] pb-1"
                      : "text-[#666361] hover:text-[#2C2A28]"
                      }`}
                  >
                    Events
                  </Link>
                  <Link
                    to="/directory"
                    className={`text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === "/directory"
                      ? "text-[#E85F57] border-b-2 border-[#E85F57] pb-1"
                      : "text-[#666361] hover:text-[#2C2A28]"
                      }`}
                  >
                    Member Directory
                  </Link>
                  <Link
                    to="/gallery"
                    className={`text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === "/gallery" || location.pathname === "/public-gallery"
                      ? "text-[#E85F57] border-b-2 border-[#E85F57] pb-1"
                      : "text-[#666361] hover:text-[#2C2A28]"
                      }`}
                  >
                    Gallery
                  </Link>
                </nav>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                {activeUser ? (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/schedule"
                      className="group bg-[#2C2A28] text-white hover:bg-[#E85F57] pl-5 pr-1.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-3 border border-[#353535] hover:border-[#E85F57]"
                    >
                      <span>{isMaintainer ? "Maintainer Schedule" : "My Schedule"}</span>
                      <div className="w-7 h-7 bg-[#F7F5F0]/20 rounded-full flex items-center justify-center group-hover:bg-[#F7F5F0]/30 transition-colors">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/join"
                      className="border border-[#2C2A28]/20 text-[#2C2A28] hover:bg-[#2C2A28] hover:text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Join Club
                    </Link>
                    <Link
                      to="/login"
                      className="bg-[#E85F57] text-white hover:bg-[#D94538] font-bold rounded-full h-9 px-5 transition-all active:scale-95 flex items-center gap-2 shadow-xs text-xs uppercase tracking-wider"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Portal Access</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>
        ) : (
          <header className="sticky top-0 z-40 bg-[#E7DDD3]/95 backdrop-blur-xl border-b border-[#D5C9BE]/50 h-20 flex items-center justify-between px-6 md:px-10 transition-all">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Trigger */}
              {!isLandingPage && activeUser && (
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-[#666361] hover:bg-[#EFE8E1]" />}>
                    <Menu className="w-5 h-5" />
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72 border-r-0">
                    <Sidebar
                      isCollapsed={isCollapsed}
                      setIsCollapsed={setIsCollapsed}
                      filteredNavItems={filteredNavItems}
                      
                      setMobileOpen={setMobileOpen}
                      isMobile={true}
                      
                    />
                  </SheetContent>
                </Sheet>
              )}

              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#E85F57] font-mono font-bold hidden sm:block mb-1">
                  {activeItem.description}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#2C2A28] leading-none tracking-tight">
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
                    className="group border border-[#D5C9BE]/80 bg-[#F7F5F0]/50 text-[#666361] hover:bg-[#F7F5F0] hover:text-[#E85F57] hover:border-[#E85F57]/50 rounded-full h-10 pl-4 pr-1.5 flex items-center gap-3 text-[10px] font-bold tracking-widest transition-all uppercase shadow-sm"
                  >
                    <span>Public Site</span>
                    <div className="w-7 h-7 bg-[#E7DDD3] rounded-full flex items-center justify-center group-hover:bg-[#F8E8E4] transition-colors">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                  {/* Notification Trigger */}

                  <div className="relative">
                    <button 
                      onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
                      className="w-10 h-10 rounded-xl bg-[#2C2A28] border border-[#353535] flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0 hover:bg-[#353535] transition-colors ml-2 overflow-hidden"
                    >
                      {resolvedAvatar ? (
                        <img src={resolvedAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        activeUser?.initials || activeUser?.name?.slice(0, 1).toUpperCase() || "A"
                      )}
                    </button>
                    
                    {profilePopoverOpen && (
                      <div className="absolute top-12 right-0 w-64 bg-[#2C2A28] border border-[#353535] shadow-2xl rounded-2xl p-5 z-50 text-left">
                        <div className="flex items-start justify-between mb-4 border-b border-[#353535] pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#F7F5F0]/10 border border-white/20 flex items-center justify-center text-[#E85F57] font-serif font-bold text-xl overflow-hidden">
                              {resolvedAvatar ? (
                                <img src={resolvedAvatar} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                activeUser?.initials || activeUser?.name?.slice(0, 1).toUpperCase() || "A"
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-base font-serif font-bold text-[#F7F5F0] truncate">{activeUser?.name || "Member"}</p>
                              <p className="text-[9px] font-mono font-bold text-[#E85F57] uppercase tracking-widest truncate">{activeUser?.role || "Role"}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setProfilePopoverOpen(false)} 
                            className="text-white/40 hover:text-white p-1 rounded-full hover:bg-[#F7F5F0]/10 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                        
                        {activeUser?.email && (
                          <div className="mb-4">
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block mb-0.5">Linked Email</span>
                            <span className="text-xs font-sans text-white/80 truncate block">{activeUser.email}</span>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Link
                            to="/profile/view"
                            onClick={() => setProfilePopoverOpen(false)}
                            className="w-full bg-[#F7F5F0]/10 text-white hover:bg-[#F7F5F0]/20 rounded-xl text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-3 transition-all text-center block"
                          >
                            Full Profile
                          </Link>
                          <Link
                            to="/profile/edit"
                            onClick={() => setProfilePopoverOpen(false)}
                            className="w-full bg-[#F7F5F0]/10 text-white hover:bg-[#F7F5F0]/20 rounded-xl text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-3 transition-all text-center block"
                          >
                            Edit Profile
                          </Link>
                          <button
                            onClick={() => {
                              setProfilePopoverOpen(false);
                              handleLogOut();
                            }}
                            className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-3 transition-all text-center"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  
                  <div className="relative" ref={notificationRef}>
                    <button 
                      onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                        if (!notificationsOpen) handleMarkAllRead();
                      }}
                      className="relative w-10 h-10 rounded-xl hover:bg-[#D5C9BE]/30 flex items-center justify-center text-[#353535] transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      {hasUnread && (
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#E85F57] rounded-full border-2 border-[#E7DDD3]"></span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="absolute top-12 right-0 w-80 bg-[#2C2A28] border border-[#353535] shadow-2xl rounded-2xl p-0 z-50 text-left overflow-hidden flex flex-col max-h-[70vh]">
                        
                        <div className="p-5 border-b border-[#353535] flex items-center justify-between shrink-0 bg-[#2C2A28]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E85F57]/20 flex items-center justify-center text-[#E85F57]">
                              <Bell className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-serif text-[#F7F5F0] font-bold text-lg leading-none">Inbox</h3>
                              <p className="text-[9px] font-mono uppercase tracking-widest text-white/50 mt-1">Live Dispatches</p>
                            </div>
                          </div>
                          {hasUnread && (
                            <span className="bg-[#E85F57] text-[#F7F5F0] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>

                        <div className="overflow-y-auto flex-1 p-3 space-y-2 no-scrollbar">
                          {dbNotifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center">
                              <Bell className="w-8 h-8 text-white/10 mb-3" />
                              <p className="text-xs font-mono uppercase tracking-widest text-white/40">Inbox is empty</p>
                            </div>
                          ) : (
                            dbNotifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-4 rounded-xl transition-all border ${
                                  notif.is_read 
                                    ? "bg-[#F7F5F0]/5 border-white/5 hover:bg-[#F7F5F0]/10" 
                                    : "bg-[#353535] border-[#E85F57]/30 shadow-lg"
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                  <span className="text-xs font-bold text-[#F7F5F0] flex items-center gap-2">
                                    {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#E85F57] shrink-0"></span>}
                                    {notif.title || "Notice"}
                                  </span>
                                  <span className="text-[9px] text-[#E85F57] font-mono tracking-wider shrink-0 mt-0.5">
                                    {notif.created_at ? notif.created_at.split(" ")[1].substring(0, 5) : "Now"}
                                  </span>
                                </div>
                                <p className="text-xs text-white/70 leading-relaxed font-sans">
                                  {notif.message}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="p-3 border-t border-[#353535] bg-[#353535]/30 shrink-0">
                          <button 
                            onClick={() => setNotificationsOpen(false)}
                            className="w-full bg-[#F7F5F0]/5 hover:bg-[#F7F5F0]/10 text-[#F7F5F0] rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest py-2 transition-all"
                          >
                            Close Inbox
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Portal Access Dialog (Login Button) - shown only when logged out */}
              {!activeUser && (
                <Button
                  onClick={() => setPortalOpen(true)}
                  className="gap-2 bg-[#E85F57] text-[#2C2A28] hover:bg-[#E85F57]/95 font-semibold rounded-[8px] h-9 px-4 transition-all active:scale-95 flex items-center"
                >
                  <User className="w-4 h-4 text-[#2C2A28]" />
                  <span className="text-xs font-semibold">Portal Access</span>
                </Button>
              )}
            </div>
          </header>
        )}




        {/* Login Dialog */}
        <Dialog open={portalOpen} onOpenChange={setPortalOpen}>
          <DialogContent className="bg-[#E7DDD3]/95 backdrop-blur-md border border-[#D5C9BE]/80 text-[#666361] max-w-md rounded-3xl shadow-2xl p-7 transition-all duration-300">
            <DialogHeader className="border-b border-[#DDD8CE]/80 pb-4 text-center space-y-1.5">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-[#353535]/10 flex items-center justify-center mb-1 text-[#353535] shadow-inner">
                <User className="w-6 h-6" />
              </div>
              <DialogTitle className="font-serif text-2xl font-bold text-[#353535] tracking-tight">Ensemble Portal</DialogTitle>
              <DialogDescription className="text-xs text-[#666361]/80 font-medium max-w-xs mx-auto">
                Sign in with your username or email address to access your Aayam workspace.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              handleLoginSubmit(target.identifier.value, target.password.value);
            }} className="pt-4 space-y-4 text-left">
              {loginError && (
                <div className="text-xs text-red-600 bg-red-50/90 border border-red-200/80 rounded-xl p-3 text-center font-medium shadow-sm animate-shake">
                  {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold block">
                  Username or Email Address
                </label>
                <Input
                  type="text"
                  name="identifier"
                  placeholder="Username or user@domain.com"
                  className="border-[#DDD8CE] h-11 bg-[#F7F5F0]/90 focus-visible:ring-2 focus-visible:ring-[#353535]/40 focus-visible:border-[#353535] transition-all text-sm rounded-xl px-3.5 shadow-sm"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("Prototype info: any password is accepted."); }}
                    className="text-[11px] text-[#353535] hover:underline font-semibold transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="border-[#DDD8CE] h-11 bg-[#F7F5F0]/90 focus-visible:ring-2 focus-visible:ring-[#353535]/40 focus-visible:border-[#353535] transition-all text-sm rounded-xl pl-3.5 pr-10 shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666361]/60 hover:text-[#353535] transition-colors focus:outline-none p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-[#f4efe8]/70 border border-[#DDD8CE] rounded-xl p-2.5">
                <span className="text-[10px] text-[#666361]/85 leading-relaxed block text-center">
                  <strong>Tip:</strong> Log in with <strong>username</strong> or <strong>email</strong> (e.g. <em>maintainer@matinee.club</em> for Admin).
                </span>
              </div>

              <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPortalOpen(false)}
                  className="border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1] rounded-xl text-xs font-semibold h-11 flex-1 shadow-sm transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#353535] text-white hover:bg-[#4d4a32] active:scale-[0.99] rounded-xl text-xs font-bold h-11 flex-1 shadow-md hover:shadow-lg transition-all"
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
            <footer className="bg-[#E7DDD3] py-16 px-6 md:px-12 border-t border-[#D5C9BE]/50 mt-auto w-full">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left space-y-1">
                  <h3 className="font-serif text-3xl font-normal text-[#2C2A28] tracking-tight">AAYAM</h3>
                  <p className="text-xs text-[#666361]">Celebrating theatrical excellence and archival stagecraft.</p>
                </div>
                <nav className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest">
                  <Link className="text-[#666361] hover:text-[#E85F57] transition-colors" to="/">Home</Link>
                  <Link className="text-[#666361] hover:text-[#E85F57] transition-colors" to="/plays">Our Plays</Link>
                  <Link className="text-[#666361] hover:text-[#E85F57] transition-colors" to="/events">Upcoming Events</Link>
                  <Link className="text-[#666361] hover:text-[#E85F57] transition-colors" to="/directory">Member Directory</Link>
                  <Link className="text-[#666361] hover:text-[#E85F57] transition-colors" to="/public-gallery">Gallery</Link>
                </nav>
              </div>
            </footer>
          </>
        ) : (
          <main className="flex-1 px-4 md:px-8 py-4 md:py-6 max-w-[1280px] mx-auto w-full">
            {showAccessDenied ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-[#F7F5F0] border border-[#DDD8CE] rounded-[8px] space-y-6 shadow-xs max-w-md mx-auto mt-8">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-serif text-[#353535]">Restricted Stage Access</h3>
                  <p className="text-sm text-[#666361] leading-relaxed">
                    Your current role (<strong className="text-[#353535]">{activeUser.role}</strong>) does not have authorization to access this operational area.
                  </p>
                </div>
                <Link
                  to="/schedule"
                  className="bg-[#E85F57] hover:bg-[#E85F57]/90 text-[#2C2A28] font-semibold text-xs rounded-[8px] py-2.5 px-6 shadow-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  Return to My Schedule
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
