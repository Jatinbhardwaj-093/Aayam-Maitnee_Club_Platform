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
    id: "tughlaq",
    title: "Tughlaq",
    status: "SELLING FAST",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Girish Karnad's classic play exploring the visionary but chaotic reign of Muhammad bin Tughlaq. A timeless political allegory that resonates with modern times.",
    director: "Sneha Vyas",
    cast: "Jayesh Dave, Amit Sharma, Pooja Patel",
    season: "Monsoon 2026 Season",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAzuMBaCOUMEUXFsi58uX4Sk0JbT72vPkeMf7KwisCYFvuX3Bk8gP1e__uZ8B3G4bYBmYBQjlPftJgABVJuuHuLNh_AIDoUgyAwaSJBouCjuqcQ7quRshTI9hepIQebEmL3pvhyyO6hPnGW2vUGYrayYRqt1rRMyl1OCAIad0kKVUn46ZjCsSI_nQCNnUrcxx_B1Rvmvml5deoCtkUqY61szLjR8uoRvQhIHhNvsCHkKUY4niHP9cI",
    venue: "Prithvi Theatre, Mumbai",
    dates: "Aug 12 - Sep 04, 2026",
    runtime: "120 Mins (With Intermission)",
    price: "Tickets from ₹300"
  },
  {
    id: "andha-yug",
    title: "Andha Yug",
    status: "LIMITED TICKETS",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Dharamvir Bharati's epic anti-war play set on the final day of the Mahabharata war. It delves into the dark psychology of greed, vengeance, and moral collapse.",
    director: "Sneha Vyas",
    cast: "Amit Sharma, Rohan Sen, Jayesh Dave",
    season: "Monsoon 2026 Season",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
    venue: "Kamani Auditorium, Delhi",
    dates: "Sep 15 - Oct 02, 2026",
    runtime: "110 Mins (No Intermission)",
    price: "Tickets from ₹250"
  },
  {
    id: "hayavadana",
    title: "Hayavadana",
    status: "TICKETS ON SALE",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "A brilliant play by Girish Karnad exploring identity, completeness, and love through a mythical story of swapped heads. Combines Yakshagana folk performance with modern theatrical dialogue.",
    director: "Kabir Mehta",
    cast: "Priya Nair, Arjun Kapoor, Jayesh Dave",
    season: "Monsoon 2026 Season",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
    venue: "Ranga Shankara, Bengaluru",
    dates: "Oct 10 - Oct 28, 2026",
    runtime: "100 Mins (With Intermission)",
    price: "Tickets from ₹350"
  },
  {
    id: "charandas-chor",
    title: "Charandas Chor",
    status: "SELLING FAST",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Habib Tanvir's masterpiece, a delightful folk comedy and satire adapted from a Rajasthani folktale about a thief with a strict vow of truth.",
    director: "Rohan Sen",
    cast: "Jayesh Dave, Priya Nair, Arjun Kapoor",
    season: "Monsoon 2026 Season",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtdENLvD3N-a9btMoGsPtbSbUQtSPaSBrEeP2Jgfyd3VportsleV-2pAckg6xgekm8mK9FSwhNkL_KQ8p3CMlW6We0Bai8RJB_wXYdN_uTzrFLc7KGbqCrUe53sL52qCIuiqWjHze9pJNKgNETpCUBMn9ceMimt2eXX6zjbAWVKTquXwKQYOAO2CwRSECu9qu2z0c_dqG32E2SNvcfhz2Jsq4-7G-3aPJUBUnLeNoEGkqT7zP5-WJb",
    venue: "Shree Ram Centre, New Delhi",
    dates: "Oct 05 - Oct 18, 2026",
    runtime: "115 Mins (With Intermission)",
    price: "Tickets from ₹200"
  },
  {
    id: "ebong-indrajit",
    title: "Ebong Indrajit",
    status: "LIMITED TICKETS",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Badal Sircar's landmark absurdist play that redefined Indian theatre, capturing the existential angst, dreams, and conformity of post-independence urban youth.",
    director: "Kabir Mehta",
    cast: "Arjun Kapoor, Priya Nair, Amit Sharma",
    season: "Winter 2026 Season",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
    venue: "Academy of Fine Arts, Kolkata",
    dates: "Nov 10 - Nov 25, 2026",
    runtime: "90 Mins (No Intermission)",
    price: "Tickets from ₹150"
  },
  {
    id: "sakharam-binder",
    title: "Sakharam Binder",
    status: "TICKETS ON SALE",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Vijay Tendulkar's raw and powerful Marathi classic exposing domestic power dynamics, gender roles, and hypocrisy in middle-class society.",
    director: "Sneha Vyas",
    cast: "Jayesh Dave, Priya Nair, Rohan Sen",
    season: "Winter 2026 Season",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
    venue: "Bal Gandharva Rang Mandir, Pune",
    dates: "Dec 01 - Dec 15, 2026",
    runtime: "130 Mins (With Intermission)",
    price: "Tickets from ₹250"
  },
  {
    id: "karnabhari",
    title: "Karnabhari",
    status: "SELLING FAST",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "A highly stylized Sopanam-style physical theatre adaptation of Bhasa's classic Sanskrit play, exploring the tragic nobility, loyalty, and ultimate sacrifice of Karna.",
    director: "Siddharth Verma",
    cast: "Amit Sharma, Rohan Sen, Jayesh Dave",
    season: "Winter 2026 Season",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATbMC775hHvfLLb9F3mVPtw4K2dw6bGMuAuAuNqBovs8EsF9N3G3_w8RYPIzK24kl4nL3A2DRk0sT2WMSGIR67XDJ7SOl5T5_KuNWq0NeIzlmTVsTRR4TC3aqN2-IxIimwn6aModCBNDR65E1xTAZoR_gM5_7rOL2lpXligIvYygov1cKDqNOK9M9K-IxYwoxrN-btwTvrc9pE9DM1hl-jltrWvaKlcKIkUQJ3C3BLPAG1rjHfjMRy",
    venue: "Fine Arts Hall, Kochi",
    dates: "Dec 20 - Dec 30, 2026",
    runtime: "80 Mins (No Intermission)",
    price: "Tickets from ₹300"
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
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] py-24">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <section className="mb-20 text-center md:text-left">
          <span className="text-xs font-semibold text-[#635f41] uppercase tracking-[0.25em] bg-[#c6e4f7]/30 px-3.5 py-1.5 rounded-full">
            Our Plays
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-[#635f41] mt-8 mb-4 font-bold tracking-tight">The 2024 Season</h1>
          <p className="text-lg text-[#49473d] max-w-2xl leading-relaxed font-light">
            Discover the stories defining our seasonal calendar. Aayam showcases classical and contemporary stagecraft crafted with spatial depth, raw light, and dramatic resonance.
          </p>
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
