// @ts-nocheck
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Star, Calendar, MapPin, Clock, Ticket, ArrowRight, Flame, ArrowUpRight, ChevronRight } from "lucide-react";

interface Production {
  id: string;
  title: string;
  status: string;
  statusColor?: string;
  description: string;
  director: string;
  cast: string;
  season: string;
  image: string;
  venue: string;
  dates: string;
  runtime: string;
  price: string;
}

const fallbackProductions: Production[] = [
  {
    id: "kky",
    title: "Karn Ki Yachika",
    status: "SELLING FAST",
    description: "A monumental classical tragedy exploring Karn's moral dilemma, honor, and destiny on the battleground of Kurukshetra.",
    director: "S. Sri Vaishnavi",
    cast: "Abay Nandhiga, Utkarsh (Yuuhi), Samarth Shrivastava",
    season: "2026 Production Season",
    image: "/aayam_assets/kky_user_5.jpg",
    venue: "Kashiyatra Stage, IIT BHU / OAT IIT Madras",
    dates: "Aug 28 - Sep 15, 2026",
    runtime: "75 Mins (No Intermission)",
    price: "Free Admission"
  },
  {
    id: "tamashbin-kathputliya",
    title: "Tamashbin Kathputliya",
    status: "LIMITED TICKETS",
    description: "A high-energy street play (Nukkad Natak) combining puppetry motifs, live dholak rhythms, and political satire.",
    director: "Utkarsh (Yuuhi)",
    cast: "Samarth Shrivastava, Krishna Subramanian, Swati Singh",
    season: "2026 Production Season",
    image: "/aayam_assets/tamashbin_user_1.jpg",
    venue: "Open Air Theatre (OAT), IIT Madras",
    dates: "Sep 08 - Sep 22, 2026",
    runtime: "45 Mins (No Intermission)",
    price: "Free Open Stage"
  },
  {
    id: "dddj",
    title: "DDDJ - Stage Production",
    status: "TICKETS ON SALE",
    description: "An intense proscenium drama exploring relationship dynamics, ambition, and modern societal pressures.",
    director: "S. Sri Vaishnavi",
    cast: "Abay Nandhiga, Krishna Subramanian, Sneha Das",
    season: "2026 Production Season",
    image: "/aayam_assets/dddj_user_1.jpg",
    venue: "CLT Auditorium, IIT Madras",
    dates: "Sep 25 - Oct 08, 2026",
    runtime: "85 Mins (With Intermission)",
    price: "Registration Required"
  },
  {
    id: "samatvam",
    title: "Samatvam",
    status: "TICKETS ON SALE",
    description: "An intense ensemble drama exploring inner conflict, balance, and human empathy in modern high-pressure academic society.",
    director: "Tanu Kurade",
    cast: "Abay Nandhiga, Sneha Das, Anshi Jain",
    season: "2026 Production Season",
    image: "/aayam_assets/samatvam_user_1.jpg",
    venue: "CLT Auditorium, IIT Madras",
    dates: "Oct 05 - Oct 20, 2026",
    runtime: "90 Mins (With Intermission)",
    price: "Free Entry"
  },
  {
    id: "speak-up-tara",
    title: "Speak Up Tara",
    status: "SELLING FAST",
    description: "A powerful social awareness play highlighting gender equality, courage, and standing up against societal silence.",
    director: "S. Sri Vaishnavi",
    cast: "Anshi Jain, Sneha Das, Swati Singh",
    season: "2026 Production Season",
    image: "/aayam_assets/speak_up_tara_user_1.webp",
    venue: "Kashiyatra Festival Stage, IIT BHU",
    dates: "Nov 02 - Nov 15, 2026",
    runtime: "60 Mins (No Intermission)",
    price: "Festival Pass Required"
  }
];

export default function Plays() {
  const [productions, setProductions] = useState<Production[]>(fallbackProductions);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    fetch("http://localhost:5005/api/plays")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductions(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load plays from backend:", err);
      });
  }, []);

  const spotlightPlay = productions[0] || fallbackProductions[0];
  const otherPlays = productions.slice(1);

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        
        {/* Header Section */}
        <section className="border-b border-[#D5C9BE]/50 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57]">
                <Flame className="w-3.5 h-3.5" />
                <span>SEASON REPERTOIRE // 2026</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#2C2A28] font-normal tracking-tight leading-none">
                Curated Stage Plays
              </h1>
              <p className="text-base text-[#666361] max-w-2xl leading-relaxed font-light mt-2">
                Discover the productions defining our theatrical year. Classical tragedies, courtyard satire, and contemporary proscenium experiments.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-[#2C2A28] text-white px-5 py-2.5 rounded-full border border-[#353535] shrink-0 text-xs font-mono">
              <span className="text-[#E85F57] font-bold">●</span>
              <span>{productions.length} Productions Touring</span>
            </div>
          </div>
        </section>

        {/* 1. MASTER SPOTLIGHT HERO PRODUCTION */}
        {spotlightPlay && (
          <section className="relative rounded-[2.5rem] overflow-hidden border border-[#353535] bg-[#2C2A28] text-white shadow-2xl group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Image Banner */}
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[350px] overflow-hidden">
                <img
                  src={spotlightPlay.image}
                  alt={spotlightPlay.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#2C2A28] via-[#2C2A28]/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="bg-[#E85F57] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    {spotlightPlay.status || "Spotlight Premier"}
                  </span>
                </div>
              </div>

              {/* Spotlight Content */}
              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-mono font-semibold text-[#E85F57] uppercase tracking-widest">
                    {spotlightPlay.season || "2026 Production Season"}
                  </div>
                  
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F7F5F0] font-normal leading-tight">
                    {spotlightPlay.title}
                  </h2>

                  <p className="text-sm text-white/70 font-light leading-relaxed">
                    {spotlightPlay.description}
                  </p>

                  {/* Production Key Info Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono text-white/70">
                    <div className="space-y-1">
                      <span className="text-[#E85F57] block text-[10px] uppercase">Director</span>
                      <span className="text-white font-medium truncate block">{spotlightPlay.director}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[#E85F57] block text-[10px] uppercase">Runtime</span>
                      <span className="text-white font-medium truncate block">{spotlightPlay.runtime}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[#E85F57] block text-[10px] uppercase">Venue</span>
                      <span className="text-white font-medium truncate block">{spotlightPlay.venue}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[#E85F57] block text-[10px] uppercase">Access</span>
                      <span className="text-[#E85F57] font-bold block">{spotlightPlay.price}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert(`Seat reservation requested for ${spotlightPlay.title}`)}
                    className="w-full bg-[#E85F57] text-white hover:bg-[#D94538] py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Reserve Matinee Pass</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 2. REPERTOIRE CATALOG (MAGAZINE GRID) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5C9BE]/40 pb-4">
            <h3 className="font-serif text-2xl md:text-3xl text-[#2C2A28] font-normal">
              Touring Repertoire
            </h3>
            <span className="text-xs font-mono text-[#666361]">
              Showing {otherPlays.length} productions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherPlays.map((play, idx) => (
              <div 
                key={play.id || idx} 
                className="bg-[#2C2A28] text-white rounded-[2rem] border border-[#353535] overflow-hidden shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#353535]">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105" 
                      alt={play.title} 
                      src={play.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider bg-[#2C2A28]/90 text-[#E85F57] border border-[#E85F57]/30 shadow-md backdrop-blur-md">
                        {play.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-6 text-xs font-mono font-bold text-white/50">
                      0{idx + 2} // {play.season || "2026"}
                    </div>
                  </div>

                  <div className="p-7 space-y-4">
                    <h3 className="font-serif text-2xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                      {play.title}
                    </h3>

                    <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-2">
                      {play.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs font-mono text-white/70">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                        <span className="truncate">{play.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                        <span className="truncate">{play.runtime}</span>
                      </div>
                    </div>

                    <div className="bg-[#353535]/50 p-3.5 rounded-xl border border-white/5 text-xs text-white/80 space-y-1">
                      <div className="truncate"><strong>Director:</strong> {play.director}</div>
                      <div className="truncate text-white/60"><strong>Cast:</strong> {play.cast}</div>
                    </div>
                  </div>
                </div>

                <div className="p-7 pt-0 flex items-center justify-between border-t border-white/10 text-xs font-mono pt-4">
                  <span className="text-[#E85F57] font-bold">{play.price}</span>
                  <button
                    onClick={() => alert(`Seat pass requested for ${play.title}`)}
                    className="px-5 py-2 rounded-full bg-white/10 hover:bg-[#E85F57] text-white text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5"
                  >
                    Reserve <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. COMMISSION / STAGING CTA */}
        <section className="bg-[#2C2A28] text-white rounded-[2.5rem] p-10 md:p-16 text-center border border-[#353535] space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
            <span>COLLECTIVE STAGE CRAFT</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F7F5F0] font-normal tracking-tight max-w-2xl mx-auto leading-tight">
            Custom Productions & Ensemble Commission
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light">
            Sponsor a tour performance or commission our ensemble to produce bespoke theatrical campaigns and campus workshops.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              to="/join"
              className="bg-[#E85F57] text-white hover:bg-[#D94538] px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-95"
            >
              Commission Ensemble
            </Link>
            <Link
              to="/events"
              className="border border-white/20 text-[#F7F5F0] hover:bg-white/10 px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
            >
              Inquire for Staging & Tour
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
