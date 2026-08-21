import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  filteredNavItems: any[];
  setMobileOpen?: (open: boolean) => void;
  isMobile?: boolean;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  filteredNavItems,
  setMobileOpen,
  isMobile = false,
}: SidebarProps) {
  const location = useLocation();
  const collapsed = isCollapsed && !isMobile;

  return (
    <div className="flex flex-col h-full bg-[#E7DDD3] border-r border-[#D5C9BE]/50 text-[#353535] font-sans relative">
      {/* Sidebar Brand Header */}
      <div className={`p-6 md:p-8 flex ${collapsed ? "flex-col items-center gap-4" : "items-center justify-between"}`}>
        {collapsed ? (
          <>
            <div className="w-8 h-8 rounded-full bg-[#E85F57] text-[#F7F5F0] flex items-center justify-center font-serif font-bold text-lg leading-none shadow-sm">
              A
            </div>
            <button 
              onClick={() => setIsCollapsed(false)} 
              className="text-[#666361] hover:text-[#353535] p-2 hover:bg-[#E7DDD3]/50 rounded-full transition-all mt-2"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E85F57] text-[#F7F5F0] flex items-center justify-center font-serif font-bold text-lg leading-none shadow-sm shrink-0">
              A
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#E85F57] font-mono font-bold leading-none mb-1">
                  AAYAM
                </span>
                <h2 className="text-xl font-bold font-serif text-[#2C2A28] leading-none tracking-tight truncate">
                  CLUB
                </h2>
              </div>
            </div>
            {!isMobile && (
              <button 
                onClick={() => setIsCollapsed(true)} 
                className="text-[#666361] hover:text-[#353535] p-1.5 hover:bg-[#E7DDD3]/50 rounded-full transition-all shrink-0"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Navigation List */}
      <nav className={`flex-1 px-4 py-4 space-y-1.5 overflow-y-auto no-scrollbar ${collapsed ? "flex flex-col items-center" : ""}`}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (collapsed) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-[#2C2A28] text-white shadow-md"
                    : "hover:bg-[#E7DDD3]/50 text-[#666361] hover:text-[#353535]"
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : ""}`} />
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E85F57]" />
                )}
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group relative ${
                isActive
                  ? "bg-[#2C2A28] text-white shadow-md"
                  : "hover:bg-[#E7DDD3]/50 text-[#666361] hover:text-[#353535]"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 shrink-0 ${isActive ? "text-white" : "text-[#666361] group-hover:text-[#353535]"}`} />
              
              <div className="flex flex-col text-left min-w-0">
                <span className={`font-mono text-[10px] font-bold tracking-widest uppercase truncate ${isActive ? "text-white" : "text-[#353535]"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="text-[9px] font-sans font-medium leading-tight text-white/70 mt-0.5 truncate">
                    {item.description}
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#E85F57]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
