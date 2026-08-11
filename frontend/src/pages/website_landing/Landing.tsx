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
    <div className="bg-[#fdf9f4] text-[#1c1b19] font-sans selection:bg-[#c6e4f7] selection:text-[#001e2c] min-h-screen pt-4 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-16 border-b border-[#cac6b9]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c6e4f7]/40 text-[#2e4a5a] text-[11px] font-bold uppercase tracking-widest border border-[#c6e4f7]">
                <Sparkles className="w-3.5 h-3.5 text-[#2e4a5a]" />
                Celebrating Stagecraft & Artistry
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#1c1b19] font-bold leading-[1.08] tracking-tight">
                The Stage <br />
                <span className="text-[#635f41] italic font-serif font-normal">Reimagined.</span>
              </h1>

              <p className="text-sm md:text-base text-[#49473d] max-w-xl leading-relaxed font-light">
                Welcome to <strong className="text-[#635f41] font-semibold">Aayam</strong> — the premier theatrical collective. We craft intellectual, inviting stage experiences, connecting actors, directors, and cultural patrons.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/join"
                  className="bg-[#635f41] text-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#635f41]/90 active:scale-95 transition-all flex items-center gap-2"
                >
                  Join Ensemble <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/plays"
                  className="border border-[#cac6b9] text-[#635f41] bg-white px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#f7f3ee] transition-all"
                >
                  Explore Plays
                </Link>
              </div>

              {/* Dynamic Metrics Row */}
              <div className="pt-6 border-t border-[#cac6b9]/25 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-bold text-[#635f41]">
                    {plays.length > 0 ? plays.length : 12}+
                  </div>
                  <span className="text-[10px] font-bold text-[#466272] uppercase tracking-wider">
                    Active Plays
                  </span>
                </div>
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-bold text-[#635f41]">
                    {members.length > 0 ? members.length : 45}+
                  </div>
                  <span className="text-[10px] font-bold text-[#466272] uppercase tracking-wider">
                    Ensemble Artists
                  </span>
                </div>
                <div>
                  <div className="font-serif text-2xl md:text-3xl font-bold text-[#635f41]">
                    {events.length > 0 ? events.length : 18}+
                  </div>
                  <span className="text-[10px] font-bold text-[#466272] uppercase tracking-wider">
                    Annual Events
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#cac6b9] shadow-md bg-gray-100 group">
                <img
                  src="/aayam_assets/tamashbin_user_1.jpg"
                  alt="Aayam Stage Performance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="bg-white/90 text-[#635f41] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border">
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

      {/* 2. DYNAMIC FEATURED PLAYS CAROUSEL / GRID */}
      <section className="py-16 border-b border-[#cac6b9]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] block mb-1">
                Curated Productions
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b19] tracking-tight">
                Featured Stage Plays
              </h2>
            </div>
            <Link
              to="/plays"
              className="text-xs font-bold text-[#635f41] uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View Full Season <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPlays.map((play) => (
              <div
                key={play.id}
                className="bg-white border border-[#cac6b9]/30 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                    <img
                      src={play.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"}
                      alt={play.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {play.status && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/95 text-[#635f41] text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs border">
                          {play.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="text-[10px] font-bold text-[#466272] uppercase tracking-widest">
                      {play.season || "2026 Season"}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#635f41] group-hover:text-[#466272] transition-colors">
                      {play.title}
                    </h3>
                    <p className="text-xs text-[#49473d] line-clamp-2 leading-relaxed font-light">
                      {play.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 text-xs text-[#466272] flex items-center justify-between font-semibold mt-2">
                  <span>Venue: {play.venue || "Prithvi Theatre"}</span>
                  <span className="text-[#635f41]">{play.price || "₹300"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. UPCOMING EVENTS LOG (BACKEND SYNCED) */}
      <section className="py-16 border-b border-[#cac6b9]/30 bg-[#f7f3ee]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] block mb-1">
                Calendar Highlights
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b19] tracking-tight">
                Upcoming Happenings
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs font-bold text-[#635f41] uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              See Calendar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white border border-[#cac6b9]/30 rounded-2xl p-6 shadow-xs space-y-4 hover:border-[#8CC0EB] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#c6e4f7]/40 text-[#2e4a5a] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {evt.category || "Scheduled"}
                  </span>
                  <span className="text-xs font-bold text-[#635f41]">{evt.date}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1c1b19]">{evt.title}</h3>

                <p className="text-xs text-[#49473d] line-clamp-2 leading-relaxed font-light">
                  {evt.description}
                </p>

                <div className="pt-3 border-t border-gray-100 text-xs text-[#466272] flex justify-between font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#635f41]" /> {evt.venue}
                  </span>
                  <span>{evt.timeRange}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC ENSEMBLE MEMBERS PREVIEW */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] block mb-1">
                Creative Collective
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b19] tracking-tight">
                Meet The Ensemble
              </h2>
            </div>
            <Link
              to="/directory"
              className="text-xs font-bold text-[#635f41] uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              Full Roster Directory <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredMembers.map((m) => (
              <Link
                key={m.id}
                to={`/profile/${m.member_id || m.id}`}
                className="bg-white border border-[#cac6b9]/25 rounded-2xl p-4 shadow-xs text-center space-y-3 hover:border-[#635f41] hover:shadow-md transition-all group block"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-[#fdf9f4] shadow-xs">
                  <img
                    src={m.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1c1b19] group-hover:text-[#635f41] transition-colors truncate">
                    {m.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-[#466272] uppercase tracking-wider block truncate">
                    {m.roles && m.roles.length > 0 ? m.roles[0] : "Member"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 PUBLIC MEDIA GALLERY PREVIEW */}
      <section className="py-16 bg-[#f7f3ee] border-y border-[#cac6b9]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] block mb-1">
                Visual Archives & Stage Captures
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b19] tracking-tight">
                Authentic Production Gallery
              </h2>
            </div>
            <Link
              to="/gallery"
              className="bg-[#635f41] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#635f41]/90 transition-all flex items-center gap-2"
            >
              Explore Full Gallery <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative aspect-square rounded-xl overflow-hidden border border-[#cac6b9]/40 shadow-xs group">
              <img
                src="/aayam_assets/tamashbin_user_1.jpg"
                alt="Tamashbin Kathputliya"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Tamashbin Kathputliya</span>
                <span className="text-xs font-serif font-bold">Street Play Ensemble</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-[#cac6b9]/40 shadow-xs group">
              <img
                src="/aayam_assets/dddj_user_1.jpg"
                alt="DDDJ"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">DDDJ</span>
                <span className="text-xs font-serif font-bold">Stage Production</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-[#cac6b9]/40 shadow-xs group">
              <img
                src="/aayam_assets/kky_user_1.jpg"
                alt="Karn Ki Yachika"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Karn Ki Yachika</span>
                <span className="text-xs font-serif font-bold">Classical Tragedy</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-[#cac6b9]/40 shadow-xs group">
              <img
                src="/aayam_assets/samatvam_user_1.jpg"
                alt="Samatvam"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Samatvam</span>
                <span className="text-xs font-serif font-bold">Physical Movement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="px-6 md:px-12 pt-8">
        <div className="max-w-7xl mx-auto bg-[#635f41] text-white rounded-3xl p-10 md:p-16 text-center space-y-6 shadow-sm border border-[#cac6b9]/30">
          <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
            Join The Matinee Movement
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
            Ready to Take Center Stage?
          </h2>
          <p className="text-xs md:text-sm text-white/90 max-w-xl mx-auto leading-relaxed font-light">
            Become an ensemble member or patron of Aayam. Gain access to backstage script readings, auditions, and VIP opening galas.
          </p>
          <div className="pt-2">
            <Link
              to="/join"
              className="inline-block bg-[#8CC0EB] text-[#001e2c] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#8CC0EB]/90 transition-all shadow-sm active:scale-95"
            >
              Apply For Membership
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
