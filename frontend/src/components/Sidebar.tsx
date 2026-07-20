import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  filteredNavItems: any[];
  activeUser: { name: string; role: string; initials: string; email?: string; isAdmin?: boolean };
  setMobileOpen?: (open: boolean) => void;
  isMobile?: boolean;
  onLogOut?: () => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  filteredNavItems,
  activeUser,
  setMobileOpen,
  isMobile = false,
  onLogOut,
}: SidebarProps) {
  const location = useLocation();
  const collapsed = isCollapsed && !isMobile;
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f7f3ee] border-r border-[#e6e2dd] text-[#466272] font-sans relative">
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
        {filteredNavItems.map((item) => {
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
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[8px] text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-[#635f41]/10 text-[#635f41] font-bold"
                  : "hover:bg-[#635f41]/5 hover:text-[#635f41]"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                isActive ? "text-[#635f41]" : "text-[#466272]/70"
              }`} />
              <div className="flex flex-col text-left">
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
        onClick={() => setShowPopover(!showPopover)}
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

      {/* Floating Popover Window */}
      {showPopover && (
        <div 
          className={`absolute bottom-20 bg-[#fdf9f4] border border-[#cac6b9]/40 shadow-xl rounded-xl p-4 z-50 text-left ${
            collapsed ? "left-16 w-60" : "left-4 right-4"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#635f41]/10 border border-[#e6e2dd] flex items-center justify-center text-[#635f41] font-bold text-sm">
                {activeUser.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#635f41] truncate">{activeUser.name}</p>
                <p className="text-xs text-[#466272]/70 truncate">{activeUser.role}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPopover(false)} 
              className="text-[#466272]/50 hover:text-[#466272] text-xs font-semibold p-1"
            >
              ✕
            </button>
          </div>
          {activeUser.email && (
            <div className="text-xs text-[#466272]/85 mb-4 border-t border-[#e6e2dd] pt-2 space-y-1">
              <p className="truncate"><strong>Email:</strong> {activeUser.email}</p>
            </div>
          )}
          <Link
            to="/profile/view"
              onClick={() => setShowPopover(false)}
              className="w-full bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-md text-xs font-semibold py-2 px-3 transition-all text-center block mb-2"
            >
              See Full Profile
            </Link>
            <Link
              to="/profile/edit"
              onClick={() => setShowPopover(false)}
              className="w-full bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-md text-xs font-semibold py-2 px-3 transition-all text-center block mb-2"
            >
              Edit Profile
            </Link>
            <button
              onClick={() => {
                setShowPopover(false);
                if (onLogOut) onLogOut();
              }}
              className="w-full border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-xs font-semibold py-2 px-3 transition-all text-center"
            >
              Log Out
            </button>
        </div>
      )}
    </div>
  );
}
