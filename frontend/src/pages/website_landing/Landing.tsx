// @ts-nocheck
import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Ticket,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Theater,
  Flame,
  ArrowUpRight,
  Layers,
  Compass
} from "lucide-react";

export default function Landing() {
  const contextData = useOutletContext<any>() || {};
  const activeUser = contextData.activeUser || JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");

  const isMaintainer = activeUser?.role?.includes("Maintainer") || 
                       activeUser?.role?.includes("Secretary") || 
                       activeUser?.role?.includes("Chief") || 
                       activeUser?.role?.includes("Lead");

  const auditionPath = activeUser 
    ? (isMaintainer ? "/auditions-admin" : "/auditions")
    : "/join";

  const [plays, setPlays] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

    // Fetch Plays from Backend
    fetch(`${baseUrl}/api/plays`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPlays(data);
      })
      .catch((err) => console.error("Error fetching plays:", err));

    // Fetch Events from Backend
    fetch(`${baseUrl}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch((err) => console.error("Error fetching events:", err));

    // Fetch Members from Backend
    fetch(`${baseUrl}/api/members`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
      })
      .catch((err) => console.error("Error fetching members:", err));
  }, []);

  const upcomingEvents = events.filter(e => e.status === "upcoming" || e.status === "Upcoming").slice(0, 4);
  const primaryPlay = plays[0] || {
    id: 1,
    title: "Tamashbin Kathputliya",
    status: "Featured Matinee",
    season: "Season 2026",
    description: "High-impact satirical Nukkad Natak exploring societal facades through vibrant rhythm, dholak percussion, and ensemble dialogue.",
    image: "/aayam_assets/tamashbin_user_1.jpg",
    venue: "OAT, IIT Madras",
    price: "Free Admission"
  };
  const secondaryPlays = plays.slice(1, 4);

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] font-sans selection:bg-[#F8E8E4] selection:text-[#2C2A28] min-h-screen">
      
      {/* 1. CINEMATIC EDITORIAL HERO */}
      <section className="relative pt-10 pb-20 md:pt-14 md:pb-28 overflow-hidden border-b border-[#D5C9BE]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Headline & Pitch */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#E85F57]/20">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Theatrical Arts & Dramaturgy</span>
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight text-[#2C2A28]">
                  Stories that <br />
                  <span className="italic font-serif font-light text-[#E85F57]">breathe fire.</span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[#666361] max-w-xl leading-relaxed font-light">
                Reclaiming raw physical vitality on stage. From poignant courtyard <em className="text-[#2C2A28] font-normal">Nukkad Natak</em> street plays to high-concept classical tragedies, we unite student artists, playwrights, and audience into one pulse.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/plays"
                  className="bg-[#E85F57] text-white hover:bg-[#D94538] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-xl active:scale-95 transition-all flex items-center gap-3 group"
                >
                  <span>Explore Season Works</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={auditionPath}
                  className="bg-white/80 hover:bg-white text-[#2C2A28] border border-[#D5C9BE] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xs"
                >
                  {activeUser ? "Auditions Portal" : "Audition Call"}
                </Link>
              </div>

              {/* Minimal inline badges */}
              <div className="pt-6 flex items-center gap-8 text-xs font-mono text-[#666361]">
                <div>
                  <span className="block font-serif text-2xl text-[#2C2A28] font-normal">06</span>
                  <span className="uppercase text-[10px] tracking-wider font-semibold">Active Plays</span>
                </div>
                <div className="h-8 w-px bg-[#D5C9BE]" />
                <div>
                  <span className="block font-serif text-2xl text-[#2C2A28] font-normal">13</span>
                  <span className="uppercase text-[10px] tracking-wider font-semibold">Lead Artists</span>
                </div>
                <div className="h-8 w-px bg-[#D5C9BE]" />
                <div>
                  <span className="block font-serif text-2xl text-[#2C2A28] font-normal">100%</span>
                  <span className="uppercase text-[10px] tracking-wider font-semibold">Live Energy</span>
                </div>
              </div>
            </div>

            {/* Right Asymmetrical Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Back offset decorative card */}
                <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-[#E85F57]/30 to-[#D5C9BE]/60 blur-xl opacity-60" />
                
                {/* Main Hero Card */}
                <div className="relative rounded-[2rem] overflow-hidden border border-[#353535] bg-[#2C2A28] text-white shadow-2xl group">
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img
                      src={primaryPlay.image || "/aayam_assets/tamashbin_user_1.jpg"}
                      alt={primaryPlay.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-[#2C2A28]/30 to-transparent" />
                    
                    <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                      <span className="bg-[#2C2A28]/80 backdrop-blur-md border border-white/15 text-[#E85F57] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Spotlight Production
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono px-3 py-1 rounded-full">
                        {primaryPlay.season || "2026"}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] font-normal leading-snug">
                        {primaryPlay.title}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-2 font-light leading-relaxed">
                        {primaryPlay.description}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#E85F57] border-t border-white/10">
                        <span>{primaryPlay.venue}</span>
                        <span className="text-white/90 font-bold">{primaryPlay.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating secondary badge */}
                <div className="absolute -bottom-6 -left-6 bg-[#E7DDD3] border border-[#D5C9BE] p-4 rounded-2xl shadow-xl max-w-[200px] hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E85F57] text-white flex items-center justify-center font-serif text-lg font-bold shrink-0">
                    आ
                  </div>
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold block text-[#2C2A28]">IIT Madras BS</span>
                    <span className="text-[#666361] font-mono text-[10px]">Drama Society</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SEASON PRODUCTIONS (ASYMMETRIC SPOTLIGHT + STACK) */}
      <section className="py-20 md:py-28 border-b border-[#D5C9BE]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57]">
                <span>01 // CURRENT REPERTOIRE</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-normal text-[#2C2A28] tracking-tight">
                Featured Productions
              </h2>
              <p className="text-sm md:text-base text-[#666361] font-light">
                Discover the current stage repertoire touring inter-college fests and proscenium halls.
              </p>
            </div>
            
            <Link
              to="/plays"
              className="text-xs font-bold text-[#2C2A28] hover:text-[#E85F57] uppercase tracking-widest flex items-center gap-2 transition-colors group"
            >
              <span>View Repertoire</span>
              <ArrowRight className="w-4 h-4 text-[#E85F57] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Asymmetric layout: 1 Large Hero Banner + 2 Complementary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Primary Featured Card (Span 7) */}
            <div className="lg:col-span-7 bg-[#2C2A28] text-white rounded-[2rem] border border-[#353535] overflow-hidden shadow-xl hover:border-[#E85F57]/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={plays[1]?.image || "/aayam_assets/dddj_user_1.jpg"}
                  alt={plays[1]?.title || "DDDJ Production"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-[#2C2A28]/20 to-transparent" />
                
                <div className="absolute top-5 left-5">
                  <span className="bg-[#E85F57] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {plays[1]?.status || "Selling Fast"}
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#E85F57]">
                  <span className="uppercase tracking-widest">{plays[1]?.season || "2026 Production"}</span>
                  <span className="text-white/60">{plays[1]?.runtime || "85 min"}</span>
                </div>

                <h3 className="font-serif text-3xl md:text-4xl text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                  {plays[1]?.title || "DDDJ – Stage Production"}
                </h3>

                <p className="text-sm text-white/70 font-light leading-relaxed">
                  {plays[1]?.description || "An intense, high-stakes proscenium dialogue sequence set in classical theatrical style with calibrated live cue acoustics."}
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
                  <span>{plays[1]?.venue || "CLT Auditorium, IIT Madras"}</span>
                  <Link to="/plays" className="text-[#E85F57] font-bold flex items-center gap-1 hover:underline">
                    Playbill Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Stacked Complementary Cards (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              {secondaryPlays.slice(1, 3).map((play, idx) => (
                <div
                  key={play.id || idx}
                  className="bg-[#2C2A28] text-white rounded-[2rem] border border-[#353535] p-6 md:p-8 shadow-xl hover:border-[#E85F57]/50 transition-all flex flex-col justify-between group flex-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#E85F57] font-bold uppercase tracking-wider">{play.status || "Season Matinee"}</span>
                      <span className="text-white/50">{play.runtime || "60 min"}</span>
                    </div>

                    <h4 className="font-serif text-2xl text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                      {play.title}
                    </h4>

                    <p className="text-xs text-white/70 font-light line-clamp-2 leading-relaxed">
                      {play.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                    <span className="truncate pr-2">{play.venue || "OAT IIT Madras"}</span>
                    <Link to="/plays" className="text-[#E85F57] font-semibold shrink-0 hover:underline flex items-center gap-1">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. AGENDA & HAPPENINGS (FLUID LIST LAYOUT INSTEAD OF BOX CARDS) */}
      <section className="py-20 md:py-28 border-b border-[#D5C9BE]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57]">
                <span>02 // DIARY & GATHERINGS</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-normal text-[#2C2A28] tracking-tight">
                Upcoming Happenings
              </h2>
            </div>
            
            <Link
              to="/events"
              className="text-xs font-bold text-[#2C2A28] hover:text-[#E85F57] uppercase tracking-widest flex items-center gap-2 transition-colors group"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-4 h-4 text-[#E85F57] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Fluid Interactive Event List */}
          <div className="space-y-4">
            {upcomingEvents.map((evt, idx) => (
              <div
                key={evt.id || idx}
                className="group bg-[#2C2A28] text-white rounded-2xl md:rounded-3xl border border-[#353535] p-6 md:p-8 shadow-lg hover:border-[#E85F57]/50 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Date & Category */}
                <div className="flex items-center gap-5 md:w-1/4 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#353535] text-[#E85F57] flex flex-col items-center justify-center font-mono font-bold text-xs border border-white/10 shrink-0">
                    <span className="text-[10px] text-white/50">AUG</span>
                    <span className="text-lg text-[#F7F5F0] leading-none">{15 + idx * 7}</span>
                  </div>
                  <div>
                    <span className="inline-block bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E85F57]/30 mb-1">
                      {evt.category || "Workshop"}
                    </span>
                    <div className="text-xs font-mono text-white/50">{evt.date || "Upcoming"}</div>
                  </div>
                </div>

                {/* Event Name & Short Desc */}
                <div className="md:w-1/2 space-y-1">
                  <h3 className="font-serif text-xl md:text-2xl text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-white/70 font-light line-clamp-1">
                    {evt.description}
                  </p>
                </div>

                {/* Location & CTA */}
                <div className="md:w-1/4 flex items-center justify-between md:justify-end gap-4 text-xs font-mono text-white/60">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                    {evt.venue || "SAC, IIT Madras"}
                  </span>
                  <Link
                    to="/events"
                    className="w-10 h-10 rounded-full bg-[#353535] group-hover:bg-[#E85F57] group-hover:text-white flex items-center justify-center transition-colors shrink-0 text-white/80"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. VISUAL ARCHIVES (ORGANIC MASONRY MOSAIC) */}
      <section className="py-20 md:py-28 border-b border-[#D5C9BE]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57]">
                <span>03 // VISUAL MEMORY</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-normal text-[#2C2A28] tracking-tight">
                Production Archives
              </h2>
            </div>
            
            <Link
              to="/gallery"
              className="text-xs font-bold text-[#2C2A28] hover:text-[#E85F57] uppercase tracking-widest flex items-center gap-2 transition-colors group"
            >
              <span>Explore 60+ Photos</span>
              <ArrowRight className="w-4 h-4 text-[#E85F57] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Dynamic Mosaic Collage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-5 bg-[#2C2A28] rounded-[2rem] overflow-hidden border border-[#353535] shadow-xl group relative aspect-[4/5]">
              <img
                src="/aayam_assets/kky_user_5.jpg"
                alt="Karn Ki Yachika"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-[#2C2A28]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="bg-[#E85F57] text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Tragedy Stage
                </span>
                <h4 className="font-serif text-2xl text-[#F7F5F0]">Karn Ki Yachika</h4>
                <p className="text-xs font-mono text-white/60">Kashiyatra Showcase • Classical Play</p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-[#2C2A28] rounded-[2rem] overflow-hidden border border-[#353535] shadow-lg group relative aspect-square">
                <img
                  src="/aayam_assets/samatvam_user_1.jpg"
                  alt="Samatvam"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 space-y-1">
                  <h4 className="font-serif text-lg text-[#F7F5F0]">Samatvam</h4>
                  <p className="text-[11px] font-mono text-white/60">Ensemble Movement</p>
                </div>
              </div>

              <div className="bg-[#2C2A28] rounded-[2rem] overflow-hidden border border-[#353535] shadow-lg group relative aspect-square">
                <img
                  src="/aayam_assets/dddj_user_1.jpg"
                  alt="DDDJ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 space-y-1">
                  <h4 className="font-serif text-lg text-[#F7F5F0]">DDDJ Proscenium</h4>
                  <p className="text-[11px] font-mono text-white/60">Central Lecture Theatre</p>
                </div>
              </div>

              <div className="sm:col-span-2 bg-[#2C2A28] rounded-[2rem] overflow-hidden border border-[#353535] shadow-lg group relative aspect-[21/9]">
                <img
                  src="/aayam_assets/tamashbin_user_2.jpg"
                  alt="Tamashbin Street"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-xl text-[#F7F5F0]">Courtyard Satire Assembly</h4>
                    <p className="text-xs font-mono text-white/60">Open Air Theatre Stage</p>
                  </div>
                  <span className="text-xs font-mono text-[#E85F57] font-bold">Nukkad Natak</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. ELEVATED CALL TO ACTION */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto relative rounded-[3rem] overflow-hidden border border-[#353535] bg-[#2C2A28] text-white p-10 md:p-20 shadow-2xl">
          
          {/* Subtle backdrop texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E85F57]/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E85F57]/20 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
              <span>MEMBERSHIP & ENSEMBLE</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-[#F7F5F0] font-normal tracking-tight leading-[1.05]">
              Step inside the rehearsal circle.
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-light">
              Audition for actor roles, join backstage production, or collaborate on theatrical stage scripts for our upcoming national tours.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={auditionPath}
                className="bg-[#E85F57] hover:bg-white hover:text-[#E85F57] text-white font-bold px-10 py-4 rounded-full text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2 group"
              >
                <span>{activeUser ? "Auditions & Casting Portal" : "Audition For Aayam"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/directory"
                className="border border-white/20 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all"
              >
                Meet the Ensemble
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
