import { useState, useEffect } from "react";
import { BookOpen, Star, Calendar, MapPin, Clock, Ticket, ArrowRight } from "lucide-react";

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
    description: "A monumental classical Malayalam/Hindi tragedy exploring Karn's moral dilemma, honor, and destiny on the battleground of Kurukshetra.",
    director: "S. Sri Vaishnavi",
    cast: "Abay Nandhiga, Utkarsh (Yuuhi), Samarth Shrivastava",
    season: "2026 Production Season",
    image: "/aayam_assets/kky_user_1.jpg",
    venue: "Kashiyatra Stage, IIT BHU / OAT IIT Madras",
    dates: "Aug 12 - Sep 04, 2026",
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
    dates: "Sep 12 - Sep 25, 2026",
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
    dates: "Sep 28 - Oct 10, 2026",
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

  return (
    <div className="bg-[#E7DDD3] text-[#232323] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        {/* Header Section */}
        <section className="border-b border-[#D5C9BE]/40 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57] mb-2">
                <span>SEASON ARCHIVE // 2026</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#232323] font-normal tracking-tight">
                Curated Stage Productions
              </h1>
              <p className="text-sm md:text-base text-[#666361] max-w-2xl leading-relaxed font-normal mt-3">
                Discover the stories defining our seasonal calendar. Aayam showcases classical and contemporary stagecraft crafted with spatial depth, raw lighting, and visceral dramaturgy.
              </p>
            </div>
            <div className="text-xs font-mono text-[#666361] bg-[#EFE8E1] px-4 py-2 rounded-full border border-[#D5C9BE]/50 shrink-0 self-start md:self-auto">
              TOTAL PRODUCTIONS: <strong className="text-[#232323]">{productions.length}</strong>
            </div>
          </div>
        </section>

        {/* 3-Column Dark Slate Play Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productions.map((play, idx) => (
            <div 
              key={play.id} 
              className="flex flex-col bg-[#232323] text-white border border-[#353535] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#E85F57]/50 hover:-translate-y-1 transition-all duration-300 group justify-between"
            >
              <div>
                {/* Playbill Poster Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#353535]">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105" 
                    alt={play.title} 
                    src={play.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#232323] via-transparent to-black/20" />
                  
                  {/* Status Capsule Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider bg-[#232323]/90 text-[#E85F57] border border-[#E85F57]/30 shadow-md backdrop-blur-md">
                      {play.status}
                    </span>
                  </div>

                  {/* Numeral Index */}
                  <div className="absolute bottom-3 left-6 text-xs font-mono font-bold text-white/50">
                    0{idx + 1}
                  </div>
                </div>

                {/* Details & Contents */}
                <div className="p-7 space-y-5">
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-[#E85F57] tracking-widest uppercase mb-1 block">
                      {play.season}
                    </span>
                    <h2 className="font-serif text-2xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                      {play.title}
                    </h2>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-3">
                    {play.description}
                  </p>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-white/10 text-xs font-mono text-white/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#E85F57] flex-shrink-0" />
                      <span className="truncate">{play.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#E85F57] flex-shrink-0" />
                      <span className="truncate">{play.dates}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#E85F57] flex-shrink-0" />
                      <span className="truncate">{play.runtime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-3.5 h-3.5 text-[#E85F57] flex-shrink-0" />
                      <span className="font-bold text-[#E85F57] truncate">{play.price}</span>
                    </div>
                  </div>

                  {/* Production Team details */}
                  <div className="space-y-2 bg-[#353535]/40 p-4 rounded-2xl border border-white/5 text-xs text-white/80">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#E85F57]" />
                      <span><strong>Director:</strong> {play.director}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Star className="w-3.5 h-3.5 text-[#E85F57]" />
                      <span className="truncate"><strong>Cast:</strong> {play.cast}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="p-7 pt-0 flex flex-col gap-3">
                <button className="w-full bg-[#E85F57] text-white hover:bg-[#D94538] py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 group">
                  <Ticket className="w-4 h-4" />
                  <span>Reserve Pass</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Staging & Hiring Banner */}
        <section className="mt-16 bg-[#232323] text-white rounded-3xl p-10 md:p-14 text-center border border-[#353535] space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
            <span>COLLECTIVE STAGE CRAFT</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-[#F7F5F0] font-normal tracking-tight">
            Custom Productions & Ensemble Commission
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            Sponsor a play of your choice or commission our ensemble to produce bespoke theatrical campaigns, corporate performances, and societal awareness narratives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button className="bg-[#E85F57] text-white hover:bg-[#D94538] px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all">
              Commission Ensemble
            </button>
            <button className="border border-white/20 text-[#F7F5F0] hover:bg-white/10 px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
              Inquire for Staging & Ads
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
