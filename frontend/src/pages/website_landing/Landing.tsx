// @ts-nocheck
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ShieldCheck,
  Heart
} from "lucide-react";

export default function Landing() {
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

  const upcomingEvents = events.filter(e => e.status === "upcoming" || e.status === "Upcoming").slice(0, 3);
  const featuredPlays = plays.slice(0, 3);
  const featuredMembers = members.slice(0, 5);

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] font-sans selection:bg-[#F8E8E4] selection:text-[#001e2c] min-h-screen pt-4 pb-16">
      
      {/* 1. CLEAN TWO-COLUMN HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 border-b border-[#D5C9BE]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8E8E4] text-[#E85F57] text-xs font-semibold tracking-wide border border-[#E85F57]/20 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E85F57] animate-pulse" />
                <span className="uppercase tracking-widest text-[10px] font-bold">Theatrical Arts Collective</span>
                <span className="text-[#E85F57]/40">•</span>
                <span className="text-[11px] font-medium text-[#2C2A28]/80">Season 2026</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#2C2A28] font-normal leading-[1.05] tracking-tight">
                The Stage <br />
                <span className="italic font-serif font-light text-[#E85F57]">Reimagined.</span>
              </h1>

              <p className="text-sm md:text-base text-[#666361] max-w-xl leading-relaxed font-normal">
                Welcome to <strong className="text-[#2C2A28] font-semibold">Aayam</strong> — the premier theatrical collective. We craft intellectual, inviting stage experiences, connecting actors, directors, and cultural patrons.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/join"
                  className="bg-[#E85F57] text-white hover:bg-[#D94538] px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  Join Ensemble <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/plays"
                  className="border border-[#D5C9BE] text-[#2C2A28] bg-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#EFE8E1] transition-all"
                >
                  Explore Plays
                </Link>
              </div>

              {/* Dynamic Metrics Row */}
              <div className="pt-6 border-t border-[#D5C9BE]/50 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-normal text-[#2C2A28]">
                    {plays.length > 0 ? plays.length : 12}+
                  </div>
                  <span className="text-[10px] font-bold text-[#666361] uppercase tracking-wider">
                    Active Plays
                  </span>
                </div>
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-normal text-[#2C2A28]">
                    {members.length > 0 ? members.length : 45}+
                  </div>
                  <span className="text-[10px] font-bold text-[#666361] uppercase tracking-wider">
                    Ensemble Artists
                  </span>
                </div>
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-normal text-[#2C2A28]">
                    {events.length > 0 ? events.length : 18}+
                  </div>
                  <span className="text-[10px] font-bold text-[#666361] uppercase tracking-wider">
                    Annual Events
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#D5C9BE] shadow-md bg-gray-100 group">
                <img
                  src="/aayam_assets/tamashbin_user_1.jpg"
                  alt="Aayam Stage Performance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                  <span className="bg-[#E85F57] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    Featured Season Matinee
                  </span>
                  <h3 className="font-serif text-2xl font-bold">Tamashbin Kathputliya</h3>
                  <p className="text-xs text-white/80 line-clamp-1">OAT IIT Madras • Direction by Utkarsh (Yuuhi)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC FEATURED PLAYS GRID (DARK GRAPHITE CARDS) */}
      <section className="py-20 border-b border-[#D5C9BE]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57] mb-1.5">
                <span>02 // CURATED PRODUCTIONS</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#2C2A28] tracking-tight">
                Featured Stage Plays
              </h2>
            </div>
            <Link
              to="/plays"
              className="text-xs font-bold text-[#2C2A28] hover:text-[#E85F57] uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Season</span>
              <ChevronRight className="w-4 h-4 text-[#E85F57]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredPlays.map((play, idx) => (
              <div
                key={play.id}
                className="bg-[#2C2A28] text-white border border-[#353535] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#E85F57]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-56 overflow-hidden relative bg-[#353535]">
                    <img
                      src={play.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"}
                      alt={play.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-black/20" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#2C2A28]/90 backdrop-blur-md text-[#E85F57] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#E85F57]/30 shadow-md">
                        {play.status || "Season Matinee"}
                      </span>
                    </div>

                    {/* Numeric Index Tag */}
                    <div className="absolute bottom-3 left-6 text-xs font-mono font-bold text-white/50">
                      0{idx + 1}
                    </div>
                  </div>

                  <div className="p-7 space-y-3">
                    <div className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-widest">
                      {play.season || "2026 Season"}
                    </div>
                    <h3 className="font-serif text-2xl font-normal text-[#EFE8E1] group-hover:text-[#E85F57] transition-colors leading-snug">
                      {play.title}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-light">
                      {play.description}
                    </p>
                  </div>
                </div>

                <div className="p-7 pt-4 border-t border-white/10 text-xs text-white/70 flex items-center justify-between font-mono">
                  <span className="truncate pr-2">{play.venue || "OAT IIT Madras"}</span>
                  <span className="text-[#E85F57] font-bold shrink-0">{play.price || "Free Admission"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. UPCOMING EVENTS LOG (DARK SLATE CARDS) */}
      <section className="py-20 border-b border-[#D5C9BE]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57] mb-1.5">
                <span>03 // CALENDAR HIGHLIGHTS</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#2C2A28] tracking-tight">
                Upcoming Happenings
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs font-bold text-[#2C2A28] hover:text-[#E85F57] uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>See Full Calendar</span>
              <ChevronRight className="w-4 h-4 text-[#E85F57]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#2C2A28] text-white border border-[#353535] rounded-3xl p-7 shadow-xl space-y-4 hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#E85F57]/30">
                      {evt.category || "Scheduled"}
                    </span>
                    <span className="text-xs font-mono text-white/60">{evt.date}</span>
                  </div>

                  <h3 className="font-serif text-xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-light">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 text-xs text-white/60 flex justify-between font-mono">
                  <span className="flex items-center gap-1.5 truncate pr-2">
                    <MapPin className="w-3.5 h-3.5 text-[#E85F57] shrink-0" /> {evt.venue}
                  </span>
                  <span className="shrink-0">{evt.timeRange}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 4. PUBLIC MEDIA GALLERY (CURATED STAGE CAPTURES) */}
      <section className="py-20 border-b border-[#D5C9BE]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57] mb-1.5">
                <span>04 // VISUAL ARCHIVES</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#2C2A28] tracking-tight">
                Authentic Production Gallery
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs font-bold text-[#2C2A28] hover:text-[#E85F57] uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Full Gallery</span>
              <ChevronRight className="w-4 h-4 text-[#E85F57]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#2C2A28] rounded-3xl overflow-hidden border border-[#353535] shadow-lg group flex flex-col justify-between hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-[#353535]">
                <img
                  src="/aayam_assets/tamashbin_user_1.jpg"
                  alt="Tamashbin Kathputliya"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                <span className="absolute top-3.5 right-3.5 bg-[#2C2A28]/80 backdrop-blur-md text-[#E85F57] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E85F57]/30">
                  Street Play
                </span>
              </div>
              <div className="p-5 space-y-1">
                <h4 className="font-serif text-lg text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                  Tamashbin Kathputliya
                </h4>
                <p className="text-xs text-white/60 font-mono">OAT IIT Madras • Ensemble</p>
              </div>
            </div>

            <div className="bg-[#2C2A28] rounded-3xl overflow-hidden border border-[#353535] shadow-lg group flex flex-col justify-between hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-[#353535]">
                <img
                  src="/aayam_assets/dddj_user_1.jpg"
                  alt="DDDJ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                <span className="absolute top-3.5 right-3.5 bg-[#2C2A28]/80 backdrop-blur-md text-[#E85F57] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E85F57]/30">
                  Stage Proscenium
                </span>
              </div>
              <div className="p-5 space-y-1">
                <h4 className="font-serif text-lg text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                  DDDJ Production
                </h4>
                <p className="text-xs text-white/60 font-mono">CLT Stage • Cast Ensemble</p>
              </div>
            </div>

            <div className="bg-[#2C2A28] rounded-3xl overflow-hidden border border-[#353535] shadow-lg group flex flex-col justify-between hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-[#353535]">
                <img
                  src="/aayam_assets/kky_user_1.jpg"
                  alt="Karn Ki Yachika"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                <span className="absolute top-3.5 right-3.5 bg-[#2C2A28]/80 backdrop-blur-md text-[#E85F57] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E85F57]/30">
                  Classical Drama
                </span>
              </div>
              <div className="p-5 space-y-1">
                <h4 className="font-serif text-lg text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                  Karn Ki Yachika
                </h4>
                <p className="text-xs text-white/60 font-mono">Kashiyatra • Stage Play</p>
              </div>
            </div>

            <div className="bg-[#2C2A28] rounded-3xl overflow-hidden border border-[#353535] shadow-lg group flex flex-col justify-between hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-[#353535]">
                <img
                  src="/aayam_assets/samatvam_user_1.jpg"
                  alt="Samatvam"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                <span className="absolute top-3.5 right-3.5 bg-[#2C2A28]/80 backdrop-blur-md text-[#E85F57] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E85F57]/30">
                  Live Matinee
                </span>
              </div>
              <div className="p-5 space-y-1">
                <h4 className="font-serif text-lg text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                  Samatvam
                </h4>
                <p className="text-xs text-white/60 font-mono">Open Air Theatre • Act 02</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER (DARK GRAPHITE ARCHIVE THEME) */}
      <section className="px-6 md:px-12 pt-12 pb-8">
        <div className="max-w-7xl mx-auto bg-[#2C2A28] text-white rounded-3xl p-10 md:p-16 text-center space-y-6 shadow-2xl border border-[#353535]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
            <span>AAYAM COLLECTIVE</span>
            <span>•</span>
            <span>MEMBERSHIP OPEN</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-[#F7F5F0] font-normal tracking-tight">
            Ready to Take Center Stage?
          </h2>

          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light">
            Become an ensemble member or patron of Aayam. Gain access to backstage script readings, auditions, and VIP opening galas.
          </p>

          <div className="pt-3">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 bg-[#E85F57] text-white hover:bg-[#D94538] px-9 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 group"
            >
              <span>Apply For Membership</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
