import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    LayoutDashboard,
    Folder,
    Users,
    Image as ImageIcon,
    Coins,
    ShieldCheck,
    ClipboardList,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<any>;
    description: string;
}

export const navItems: NavItem[] = [
    { label: "Drama Club Home", path: "/", icon: Home, description: "Public landing page" },
    { label: "Member Dashboard", path: "/member", icon: LayoutDashboard, description: "Your rehearsals & schedules" },
    { label: "Macbeth Workspace", path: "/workspace", icon: Folder, description: "Props transfers & expenses" },
    { label: "Auditions & Casting", path: "/auditions", icon: Users, description: "Casting portal & applications" },
    { label: "Sponsor Dashboard", path: "/sponsor", icon: Coins, description: "VIP lounge & sponsorships" },
    { label: "Production Gallery", path: "/gallery", icon: ImageIcon, description: "Performances & backstage media" },
    { label: "Production Office", path: "/admin", icon: ShieldCheck, description: "Director availability & admin" },
    { label: "Backstage Pass", path: "/backstage", icon: ClipboardList, description: "Tasks & check-ins" },
];

export interface SidebarProps {
    activeUser: {
        name: string;
        role: string;
        initials: string;
        email: string;
    };
    onOpenProfileSettings: () => void;
    isMobile?: boolean;
}

export function Sidebar({ activeUser, onOpenProfileSettings, isMobile = false }: SidebarProps) {
    const location = useLocation();
    const { collapsed, setCollapsed, setOpenMobile } = useSidebar();
    const isCurrentlyCollapsed = collapsed && !isMobile;

    return (
        <div className="flex flex-col h-full bg-[#f7f3ee] border-r border-[#e6e2dd] text-[#466272] font-sans">
            {/* Sidebar Brand Header */}
            <div className={`p-6 border-b border-[#e6e2dd] flex ${isCurrentlyCollapsed ? "flex-col items-center gap-4" : "items-center justify-between"}`}>
                {isCurrentlyCollapsed ? (
                    <>
                        <span className="text-lg font-bold font-serif text-[#635f41]">SD</span>
                        <button
                            onClick={() => setCollapsed(false)}
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
                                onClick={() => setCollapsed(true)}
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
            <nav className={`flex-1 px-4 py-6 space-y-1.5 overflow-y-auto ${isCurrentlyCollapsed ? "flex flex-col items-center" : ""}`}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    if (isCurrentlyCollapsed) {
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-center w-10 h-10 rounded-[8px] transition-all group relative ${isActive
                                    ? "bg-[#635f41]/10 text-[#635f41] font-bold"
                                    : "hover:bg-[#635f41]/5 hover:text-[#635f41]"
                                    }`}
                                title={item.label}
                            >
                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-[#635f41]" : "text-[#466272]/70"
                                    }`} />
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpenMobile(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] text-sm font-medium transition-all group relative ${isActive
                                ? "bg-[#635f41]/10 text-[#635f41] font-bold"
                                : "hover:bg-[#635f41]/5 hover:text-[#635f41]"
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? "text-[#635f41]" : "text-[#466272]/70"
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
                onClick={onOpenProfileSettings}
                className={`p-4 border-t border-[#e6e2dd] bg-[#e6e2dd]/40 flex text-left w-full hover:bg-[#e6e2dd]/65 transition-all ${isCurrentlyCollapsed ? "justify-center" : "items-center gap-3"}`}
                title="User Account Details"
            >
                <div className="w-9 h-9 rounded-full bg-[#635f41]/10 border border-[#e6e2dd] flex items-center justify-center text-[#635f41] font-bold flex-shrink-0">
                    {activeUser.initials}
                </div>
                {!isCurrentlyCollapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#635f41] truncate">{activeUser.name}</p>
                        <p className="text-[10px] text-[#466272]/75 truncate">{activeUser.role}</p>
                    </div>
                )}
            </button>
        </div>
    );
}
