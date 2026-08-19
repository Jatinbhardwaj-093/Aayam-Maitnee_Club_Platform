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
    <div className="flex flex-col h-full bg-[#EFE8E1] border-r border-[#DDD8CE] text-[#666361] font-sans relative">
      {/* Sidebar Brand Header */}
      <div className={`p-6 border-b border-[#DDD8CE] flex ${collapsed ? "flex-col items-center gap-4" : "items-center justify-between"}`}>
        {collapsed ? (
          <>
            <span className="text-lg font-bold font-serif text-[#353535]">SD</span>
            <button 
              onClick={() => setIsCollapsed(false)} 
              className="text-[#666361] hover:text-[#353535] p-1.5 hover:bg-[#DDD8CE]/60 rounded-full transition-all"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#353535] font-bold">AAYAM</span>
              <h2 className="text-xl font-bold font-serif text-[#353535] mt-0.5 leading-tight">The Matinee Club</h2>
            </div>
            {!isMobile && (
              <button 
                onClick={() => setIsCollapsed(true)} 
                className="text-[#666361] hover:text-[#353535] p-1.5 hover:bg-[#DDD8CE]/60 rounded-full transition-all"
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
                    ? "bg-[#353535]/10 text-[#353535] font-bold"
                    : "hover:bg-[#353535]/5 hover:text-[#353535]"
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? "text-[#353535]" : "text-[#666361]/70"
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
                  ? "bg-[#353535]/10 text-[#353535] font-bold"
                  : "hover:bg-[#353535]/5 hover:text-[#353535]"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                isActive ? "text-[#353535]" : "text-[#666361]/70"
              }`} />
              <div className="flex flex-col text-left">
                <span>{item.label}</span>
                <span className="text-[10px] text-[#666361]/65 font-normal leading-none mt-0.5 group-hover:text-[#666361]/85">
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
        className={`p-4 border-t border-[#DDD8CE] bg-[#DDD8CE]/40 flex text-left w-full hover:bg-[#DDD8CE]/65 transition-all ${collapsed ? "justify-center" : "items-center gap-3"}`}
        title="User Account Details"
      >
        <div className="w-9 h-9 rounded-full bg-[#353535]/10 border border-[#DDD8CE] flex items-center justify-center text-[#353535] font-bold flex-shrink-0">
          {activeUser?.initials || activeUser?.name?.slice(0, 2).toUpperCase() || "AU"}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#353535] truncate">{activeUser?.name || "Aayam Member"}</p>
            <p className="text-[10px] text-[#666361]/75 truncate">{activeUser?.role || "Member"}</p>
          </div>
        )}
      </button>

      {/* Floating Popover Window */}
      {showPopover && (
        <div 
          className={`absolute bottom-20 bg-[#E7DDD3] border border-[#D5C9BE]/40 shadow-xl rounded-xl p-4 z-50 text-left ${
            collapsed ? "left-16 w-60" : "left-4 right-4"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#353535]/10 border border-[#DDD8CE] flex items-center justify-center text-[#353535] font-bold text-sm">
                {activeUser?.initials || activeUser?.name?.slice(0, 2).toUpperCase() || "AU"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#353535] truncate">{activeUser?.name || "Aayam Member"}</p>
                <p className="text-xs text-[#666361]/70 truncate">{activeUser?.role || "Member"}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPopover(false)} 
              className="text-[#666361]/50 hover:text-[#666361] text-xs font-semibold p-1"
            >
              ✕
            </button>
          </div>
          {activeUser?.email && (
            <div className="text-xs text-[#666361]/85 mb-4 border-t border-[#DDD8CE] pt-2 space-y-1">
              <p className="truncate"><strong>Email:</strong> {activeUser.email}</p>
            </div>
          )}
          <Link
            to="/profile/view"
              onClick={() => setShowPopover(false)}
              className="w-full bg-[#E85F57] text-[#2C2A28] hover:bg-[#E85F57]/90 rounded-md text-xs font-semibold py-2 px-3 transition-all text-center block mb-2"
            >
              See Full Profile
            </Link>
            <Link
              to="/profile/edit"
              onClick={() => setShowPopover(false)}
              className="w-full bg-[#353535] text-white hover:bg-[#353535]/90 rounded-md text-xs font-semibold py-2 px-3 transition-all text-center block mb-2"
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
