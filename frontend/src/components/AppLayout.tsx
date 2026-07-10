import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Calendar, Users, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NavLinkItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navLinks: NavLinkItem[] = [
  { label: "Our Plays", path: "/plays", icon: BookOpen },
  { label: "Events", path: "/events", icon: Calendar },
  { label: "Member Directory", path: "/directory", icon: Users },
];

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdf9f4] text-[#1c1b19] flex flex-col font-sans selection:bg-[#c6e4f7] selection:text-[#001e2c]">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 bg-[#fdf9f4]/90 backdrop-blur-xl border-b border-[#cac6b9]/40 h-20 transition-all duration-300">
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
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-semibold tracking-wide transition-all ${
                      isActive
                        ? "text-[#635f41] border-b-2 border-[#635f41] pb-1"
                        : "text-[#466272] hover:text-[#635f41]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-[#466272] hover:text-[#635f41] text-sm font-semibold px-4 py-2 transition-all">
              Login
            </button>
            <button className="bg-[#8CC0EB] text-[#001e2c] px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:brightness-105 transition-all active:scale-95">
              Join Club
            </button>
          </div>

          {/* Mobile Sidebar/Menu Trigger */}
          <div className="md:hidden flex items-center">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="text-[#466272] hover:bg-[#f7f3ee]" />}>
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="right" className="p-6 bg-[#fdf9f4] border-l border-[#cac6b9]/40 w-72 flex flex-col justify-between text-[#1c1b19]">
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-serif text-2xl font-bold tracking-wider text-[#635f41]">AAYAM</span>
                    <button onClick={() => setMobileOpen(false)} className="text-[#466272] p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <nav className="flex flex-col gap-4">
                    <Link
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-all ${
                        location.pathname === "/"
                          ? "bg-[#635f41]/10 text-[#635f41]"
                          : "text-[#466272] hover:bg-[#f7f3ee]"
                      }`}
                    >
                      <Home className="w-5 h-5" /> Home
                    </Link>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-[#635f41]/10 text-[#635f41]"
                              : "text-[#466272] hover:bg-[#f7f3ee]"
                          }`}
                        >
                          <Icon className="w-5 h-5" /> {link.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="space-y-3 pt-6 border-t border-[#cac6b9]/40">
                  <button className="w-full py-3 text-center text-[#466272] hover:text-[#635f41] text-sm font-semibold transition-all border border-[#cac6b9] rounded-lg bg-white">
                    Login
                  </button>
                  <button className="w-full py-3 text-center bg-[#8CC0EB] text-[#001e2c] text-sm font-semibold rounded-lg shadow-sm hover:brightness-105 transition-all">
                    Join Club
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white py-16 px-6 md:px-12 border-t border-[#cac6b9]/30 mt-auto">
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
    </div>
  );
}
