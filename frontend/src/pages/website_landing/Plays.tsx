import { useState, useEffect } from "react";
import { BookOpen, Star, Calendar, MapPin, Clock, Ticket } from "lucide-react";

interface Production {
  id: string;
  title: string;
  status: string;
  statusColor: string;
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
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
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
    statusColor: "bg-purple-50 text-purple-700 border-purple-200",
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
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
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
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
    fetch("http://localhost:5001/api/plays")
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
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <section className="mb-8 border-b border-[#cac6b9]/25 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] bg-[#c6e4f7]/30 px-3 py-1 rounded-full inline-block mb-2">
                Our Stage Plays
              </span>
              <h1 className="font-serif text-3xl md:text-5xl text-[#635f41] font-bold tracking-tight">
                The 2026 Production Season
              </h1>
              <p className="text-xs md:text-sm text-[#49473d] max-w-2xl leading-relaxed font-light mt-2">
                Discover the stories defining our seasonal calendar. Aayam showcases classical and contemporary stagecraft crafted with spatial depth, raw light, and dramatic resonance.
              </p>
            </div>
          </div>
        </section>

        {/* 3-Column Play Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productions.map((play) => (
            <div 
              key={play.id} 
              className="flex flex-col bg-white border border-[#cac6b9]/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Playbill Poster Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#f7f3ee]">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={play.title} 
                  src={play.image}
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold rounded border uppercase tracking-wider bg-white/95 backdrop-blur-sm ${play.statusColor} shadow-sm`}>
                    {play.status}
                  </span>
                </div>
              </div>

              {/* Details & Contents */}
              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#466272] tracking-widest uppercase mb-1 block">
                    {play.season}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#635f41] group-hover:text-[#635f41]/90 transition-colors mb-4">
                    {play.title}
                  </h2>
                  <p className="text-sm text-[#49473d] mb-6 leading-relaxed font-light line-clamp-3">
                    {play.description}
                  </p>

                  {/* High-Fidelity Metadata Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6 pt-4 border-t border-[#cac6b9]/20">
                    <div className="flex items-center gap-2.5 text-xs text-[#49473d]">
                      <MapPin className="w-4 h-4 text-[#635f41] flex-shrink-0" />
                      <span className="truncate">{play.venue}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-[#49473d]">
                      <Calendar className="w-4 h-4 text-[#635f41] flex-shrink-0" />
                      <span className="truncate">{play.dates}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-[#49473d]">
                      <Clock className="w-4 h-4 text-[#635f41] flex-shrink-0" />
                      <span className="truncate">{play.runtime}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-[#49473d]">
                      <Ticket className="w-4 h-4 text-[#635f41] flex-shrink-0" />
                      <span className="font-semibold">{play.price}</span>
                    </div>
                  </div>

                  {/* Production Team details */}
                  <div className="space-y-2 mb-8 bg-[#f7f3ee]/40 p-4 rounded-xl border border-[#cac6b9]/15">
                    <div className="flex items-center gap-3 text-[#466272] text-xs">
                      <BookOpen className="w-3.5 h-3.5 text-[#635f41]" />
                      <span><strong>Director:</strong> {play.director}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#466272] text-xs">
                      <Star className="w-3.5 h-3.5 text-[#635f41]" />
                      <span><strong>Cast:</strong> {play.cast}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex flex-col gap-3 mt-auto">
                  <button className="w-full bg-[#635f41] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#635f41]/90 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Ticket className="w-4 h-4" /> Buy Tickets
                  </button>
                  <button className="w-full border border-[#cac6b9] text-[#635f41] py-3 text-xs font-bold rounded-xl hover:bg-[#635f41]/5 transition-colors uppercase tracking-widest">
                    Sponsor this Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Staging & Hiring Section */}
        <section className="mt-28 bg-[#c6e4f7]/30 rounded-3xl p-12 text-center border border-[#8CC0EB]/20">
          <h2 className="font-serif text-3xl md:text-5xl text-[#635f41] mb-6 font-bold tracking-tight">Custom Productions & Staging</h2>
          <p className="text-base text-[#49473d] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Sponsor a play of your choice or hire our professional ensemble to produce custom theatrical campaigns. We craft tailored productions regarding brand advertisements, corporate messaging, and public awareness campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#635f41] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all">
              Hire Our Ensemble
            </button>
            <button className="border border-[#635f41] text-[#635f41] hover:bg-[#635f41]/5 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300">
              Inquire for Staging & Ads
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
