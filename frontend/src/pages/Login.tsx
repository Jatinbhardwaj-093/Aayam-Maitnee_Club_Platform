// @ts-nocheck
import { useState } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Flame,
  AlertCircle,
  KeyRound,
  Layers,
  BookOpen
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Login() {
  const contextData = useOutletContext<any>() || {};
  const setActiveUser = contextData.setActiveUser || (() => {});
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setLoading(true);
    setErrorMsg(null);

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

    try {
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (res.ok && data.status === "success" && data.user) {
        const u = data.user;
        const initials = u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        
        const userData = {
          name: u.name,
          email: u.email,
          role: u.roles && u.roles.length > 0 ? u.roles[0] : (u.role || "Lead Actor & Member"),
          initials: initials || "EM",
          id: u.id,
          member_id: u.member_id
        };

        setActiveUser(userData);
        sessionStorage.setItem("aayam_active_user", JSON.stringify(userData));

        if (userData.role.includes("Maintainer") || userData.role.includes("Secretary") || userData.role.includes("Chief")) {
          navigate("/maintainer");
        } else {
          navigate("/member");
        }
      } else {
        throw new Error(data.message || data.error || "Invalid institutional email or password.");
      }
    } catch (err: any) {
      console.warn("Authentication error:", err);
      setErrorMsg(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left Theatrical Identity Panel (Span 5) */}
          <div className="lg:col-span-5 bg-[#2C2A28] text-white rounded-[2.5rem] p-8 md:p-10 border border-[#353535] shadow-2xl flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
                <Flame className="w-3.5 h-3.5" />
                <span>MEMBER PORTAL</span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl text-[#F7F5F0] font-normal leading-snug">
                The Stage <br />
                <span className="italic font-serif font-light text-[#E85F57]">Access Pass.</span>
              </h2>

              <p className="text-xs text-white/70 leading-relaxed font-light">
                Sign in to manage scripts, review technical cues, view rehearsal schedules, or access the maintainer operations studio.
              </p>

              {/* Portal Capabilities */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#353535]/60 border border-white/10 flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-[#E85F57] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Script Vault & Rehearsal Lines</span>
                    <span className="text-[10px] text-white/50">Access production drafts, cue sheets & blocking maps.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#353535]/60 border border-white/10 flex items-start gap-3">
                  <Layers className="w-4 h-4 text-[#E85F57] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Technical Crew Rigging</span>
                    <span className="text-[10px] text-white/50">Stage lighting presets, soundboard configs & venue passes.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs font-mono text-white/50 flex items-center justify-between">
              <span>Season 2026</span>
              <span className="text-[#E85F57]">AAYAM // IITM</span>
            </div>
          </div>

          {/* Right Login Form (Span 7) */}
          <div className="lg:col-span-7 bg-[#2C2A28] text-white rounded-[2.5rem] p-8 md:p-12 border border-[#353535] shadow-2xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#E85F57] uppercase tracking-widest">
                  PORTAL AUTHENTICATION
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-[#F7F5F0] font-normal">
                  Sign in to Ensemble Studio
                </h1>
                <p className="text-xs text-white/70 font-light">
                  Authenticate using your <strong>Username / Full Name</strong>, registered email, or Member ID.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#E85F57] font-bold block">
                    Username / Email / Member ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <Input
                      required
                      type="text"
                      placeholder="e.g. Samarth Shrivastava, 21f1002840@ds.study.iitm.ac.in, or MC-1003"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="bg-[#353535]/80 border-white/10 text-xs text-white pl-11 h-12 rounded-2xl focus:border-[#E85F57]"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-white/40">
                    You can enter your full name (username), student email, or assigned member ID.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#E85F57] font-bold block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <Input
                      required
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#353535]/80 border-white/10 text-xs text-white pl-11 h-12 rounded-2xl focus:border-[#E85F57]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{loading ? "Authenticating..." : "Enter Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/60">
              <span>New to Aayam Society?</span>
              <Link to="/join" className="text-[#E85F57] font-bold hover:underline">
                Apply for Ensemble Membership →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
