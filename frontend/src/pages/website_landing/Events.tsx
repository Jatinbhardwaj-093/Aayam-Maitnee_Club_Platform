import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Calendar as CalendarIcon, MapPin, User, Tag } from "lucide-react";

interface Event {
  title: string;
  description: string;
  category: "Plays" | "Workshops" | "Meetups";
  categoryBg: string;
  categoryColor: string;
  date: string;
  day: number;
  month: string;
  image: string;
  status: "upcoming" | "concluded";
  venue: string;
  timeRange: string;
  host: string;
  priceInfo: string;
  capacity: string;
}

const getCategoryStyles = (category: string) => {
  if (category === "Plays") {
    return { bg: "bg-[#BFDDF0] text-[#2e4a5a]", color: "text-[#2e4a5a]" };
  } else if (category === "Workshops") {
    return { bg: "bg-[#FFEBCC] text-[#765d00]", color: "text-[#765d00]" };
  } else {
    return { bg: "bg-[#E2FDFF] text-[#324b4d]", color: "text-[#324b4d]" };
  }
};

const fallbackEvents: Event[] = [
  {
    title: "Tughlaq Premiere",
    description: "The opening night of Tughlaq by Girish Karnad, showcasing under dramatic lighting.",
    category: "Plays",
    categoryBg: "bg-[#BFDDF0] text-[#2e4a5a]",
    categoryColor: "text-[#2e4a5a]",
    date: "Aug 12, 2026",
    day: 12,
    month: "Aug",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtdENLvD3N-a9btMoGsPtbSbUQtSPaSBrEeP2Jgfyd3VportsleV-2pAckg6xgekm8mK9FSwhNkL_KQ8p3CMlW6We0Bai8RJB_wXYdN_uTzrFLc7KGbqCrUe53sL52qCIuiqWjHze9pJNKgNETpCUBMn9ceMimt2eXX6zjbAWVKTquXwKQYOAO2CwRSECu9qu2z0c_dqG32E2SNvcfhz2Jsq4-7G-3aPJUBUnLeNoEGkqT7zP5-WJb",
    status: "upcoming",
    venue: "Prithvi Theatre, Mumbai",
    timeRange: "19:30 - 21:30",
    host: "Sneha Vyas",
    priceInfo: "₹300 Tickets",
    capacity: "200 seats"
  },
  {
    title: "Natya Shastra Acting Workshop",
    description: "Unlock standard acting methodologies, resonance, and mudras with veteran coordinator Sneha Vyas.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Aug 19, 2026",
    day: 19,
    month: "Aug",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdWUP6RopdqRMW48GJ5lkG-OGGRusLe0GexKuJ9TiXT4XGPICqz7v2KG9L_mG1id42B-WgZLewLqL7Dd63Qz7tWK4ALX14zX6kuV392i6mruLaV7UVbRoBFHmPjcO24On54aXGBZgoS5KdsDqIBgE1kuL0NmuS6yzjrQNN6U9X3XdZ56zuBNTC77mDLHrSAon1yryXGD-erDERjIt19ILq-FKRUNicV1D1-ptPjvnGMEe1mMewddO7",
    status: "upcoming",
    venue: "Studio Workshop Room, Mumbai",
    timeRange: "10:00 - 13:00",
    host: "Sneha Vyas",
    priceInfo: "Registration Required",
    capacity: "20 seats"
  },
  {
    title: "Chai & Playwriting Meetup",
    description: "An informal session to read new scripts, enjoy hot masala chai, and connect with regional performers.",
    category: "Meetups",
    categoryBg: "bg-[#E2FDFF] text-[#324b4d]",
    categoryColor: "text-[#324b4d]",
    date: "Aug 30, 2026",
    day: 30,
    month: "Aug",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuk8WjtWLoR2TuUYyoLkZfAiEHid8OpAJtGE5o8KgkUUP9SoIVxVCzYPUxOcxUARV5rNNTqimtr-yH4S_al391d2kCLDjx_Q_n58n2hhlaJmVXFjOZ7lPJPF52PuaoLWDCKRIog2WrCYyWULP4S5hLFZtbOb2sSpYvNwaZfeItTA9n7q8k1j2nPyROKOvHzUR0DteXxwfD2g2DY1J_53sJ4wUh7yLnB-RYHHZ9imWiLFOmgvka5l0M",
    status: "upcoming",
    venue: "Ensemble Lounge, Ahmedabad",
    timeRange: "16:00 - 18:00",
    host: "Kabir Mehta",
    priceInfo: "Free Entry",
    capacity: "Open to All"
  },
  {
    title: "Yakshagana Physical Theatre Intensive",
    description: "Learn the traditional footwork, dramatic expressions, and costume rhythms of Yakshagana with Kabir Mehta.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Oct 15, 2026",
    day: 15,
    month: "Oct",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
    status: "upcoming",
    venue: "Ranga Shankara Studio, Bengaluru",
    timeRange: "09:00 - 12:00",
    host: "Kabir Mehta",
    priceInfo: "Registration Required",
    capacity: "30 seats"
  },
  {
    title: "Habib Tanvir Folk Satire Discussion",
    description: "A panel discussion exploring the integration of rural Chhattisgarhi folk traditions into urban political satire.",
    category: "Meetups",
    categoryBg: "bg-[#E2FDFF] text-[#324b4d]",
    categoryColor: "text-[#324b4d]",
    date: "Oct 08, 2026",
    day: 8,
    month: "Oct",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtdENLvD3N-a9btMoGsPtbSbUQtSPaSBrEeP2Jgfyd3VportsleV-2pAckg6xgekm8mK9FSwhNkL_KQ8p3CMlW6We0Bai8RJB_wXYdN_uTzrFLc7KGbqCrUe53sL52qCIuiqWjHze9pJNKgNETpCUBMn9ceMimt2eXX6zjbAWVKTquXwKQYOAO2CwRSECu9qu2z0c_dqG32E2SNvcfhz2Jsq4-7G-3aPJUBUnLeNoEGkqT7zP5-WJb",
    status: "upcoming",
    venue: "Shree Ram Centre, New Delhi",
    timeRange: "17:30 - 19:30",
    host: "Siddharth Verma",
    priceInfo: "Free Entry",
    capacity: "80 seats"
  },
  {
    title: "Badal Sircar Third Theatre Workshop",
    description: "Understand Sircar's philosophy of Third Theatre: breaking the stage boundary and using open spaces.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Nov 14, 2026",
    day: 14,
    month: "Nov",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
    status: "upcoming",
    venue: "Academy of Fine Arts, Kolkata",
    timeRange: "14:00 - 17:00",
    host: "Kabir Mehta",
    priceInfo: "Registration Required",
    capacity: "40 seats"
  },
  {
    title: "Marathi Realistic Drama Panel",
    description: "Deconstructing Vijay Tendulkar's realistic masterpieces and their societal impact with Sneha Vyas.",
    category: "Meetups",
    categoryBg: "bg-[#E2FDFF] text-[#324b4d]",
    categoryColor: "text-[#324b4d]",
    date: "Dec 05, 2026",
    day: 5,
    month: "Dec",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
    status: "upcoming",
    venue: "Bal Gandharva Rang Mandir, Pune",
    timeRange: "18:00 - 20:00",
    host: "Sneha Vyas",
    priceInfo: "Free Entry",
    capacity: "100 seats"
  }
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);
  const [filter, setFilter] = useState<"All" | "Plays" | "Workshops" | "Meetups">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Soon to Happen" | "Concluded">("All");

  useEffect(() => {
    fetch("http://localhost:5001/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((e: any) => {
            const styles = getCategoryStyles(e.category);
            return {
              ...e,
              categoryBg: styles.bg,
              categoryColor: styles.color
            };
          });
          setEvents(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load events from backend:", err);
      });
  }, []);

  const filteredEvents = events.filter(e => {

    const matchesCategory = filter === "All" || e.category === filter;
    const matchesStatus = statusFilter === "All" ||
      (statusFilter === "Soon to Happen" && e.status === "upcoming") ||
      (statusFilter === "Concluded" && e.status === "concluded");
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] py-24">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-[#635f41] uppercase tracking-[0.25em] mb-3 block">
                Log & Calendar
              </span>
              <h1 className="font-serif text-5xl md:text-7xl text-[#1c1b19] font-bold tracking-tight">Events & Meetups</h1>
            </div>
            <p className="max-w-md text-base text-[#49473d] leading-relaxed font-light">
              Experience the visual elegance of live stagecraft. From active plays and local meetups to concluded rehearsal archives, browse all happenings at Aayam.
            </p>
          </div>
        </section>

        {/* Calendar and Highlight Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
          {/* Calendar Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#cac6b9]/30 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold text-[#635f41]">October 2024</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#f7f3ee] rounded-full border border-[#cac6b9]/40 text-[#466272] transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-[#f7f3ee] rounded-full border border-[#cac6b9]/40 text-[#466272] transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-l border-t border-[#cac6b9]/20 text-center text-xs font-bold text-[#49473d] uppercase tracking-wider">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
                <div key={day} className="p-3 border-r border-b border-[#cac6b9]/20">
                  {day}
                </div>
              ))}
              {/* Empty days */}
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 bg-[#f7f3ee]/30"></div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 bg-[#f7f3ee]/30"></div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 bg-[#f7f3ee]/30"></div>
              
              {/* Date cells */}
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">1</div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">2</div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold relative text-[#1c1b19]">
                3
                <div className="absolute bottom-2 left-2 right-2 bg-[#c6e4f7] p-1.5 rounded-lg text-[9px] font-bold text-[#2e4a5a] truncate">Rehearsal</div>
              </div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">4</div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">5</div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">6</div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">7</div>
              
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold bg-[#fff9d2]/20 ring-1 ring-inset ring-[#635f41]/20 text-[#1c1b19]">
                8
                <div className="mt-1 bg-[#635f41] text-white p-1.5 rounded-lg text-[9px] font-bold truncate">Macbeth Premiere</div>
              </div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">9</div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">10</div>
              <div className="h-24 md:h-32 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-400">11</div>
            </div>
          </div>

          {/* Featured Highlight Card */}
          <div className="bg-[#635f41] text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-sm border border-[#cac6b9]/25">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Featured Highlight
              </span>
              <h2 className="font-serif text-3xl mt-6 leading-tight font-bold">
                Community Coffee & Script Read
              </h2>
              <p className="mt-4 text-sm text-white/90 leading-relaxed font-light">
                Our cozy member-lead meetup. Bring your favorite classical dialogues and scripts.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Clock className="w-8 h-8 text-white/80" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">Meetup Time</p>
                  <p className="text-sm font-semibold">Oct 30 at 16:00</p>
                </div>
              </div>
              <button className="w-full bg-[#8CC0EB] text-[#001e2c] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#8CC0EB]/95 active:scale-95 transition-all shadow-sm">
                Register Seat
              </button>
            </div>
          </div>
        </section>

        {/* All Events List */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 border-b border-[#cac6b9]/30 pb-6">
            <h2 className="font-serif text-3xl font-bold text-[#1c1b19] tracking-tight">Event Schedule & Archive</h2>
            
            {/* Double Filters (Category + Status) */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex gap-1.5 bg-[#f7f3ee] p-1 rounded-full border border-[#cac6b9]/20">
                {(["All", "Plays", "Workshops", "Meetups"] as const).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                      filter === cat 
                        ? "bg-[#635f41] text-white shadow-sm" 
                        : "hover:bg-black/5 text-[#49473d]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex gap-1.5 bg-[#f7f3ee] p-1 rounded-full border border-[#cac6b9]/20">
                {(["All", "Soon to Happen", "Concluded"] as const).map(statusOpt => (
                  <button 
                    key={statusOpt}
                    onClick={() => setStatusFilter(statusOpt)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                      statusFilter === statusOpt 
                        ? "bg-[#466272] text-white shadow-sm" 
                        : "hover:bg-black/5 text-[#49473d]"
                    }`}
                  >
                    {statusOpt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt, index) => (
              <div key={index} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#cac6b9]/25 shadow-sm group hover:border-[#635f41]/20 transition-all duration-300">
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={evt.title} 
                    src={evt.image}
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg text-center shadow-md border border-[#cac6b9]/20">
                    <p className="text-[10px] font-bold text-[#466272] uppercase leading-none">{evt.month}</p>
                    <p className="text-xl font-bold text-[#635f41] leading-none mt-1">{evt.day}</p>
                  </div>
                  
                  {/* Status Overlay Badge (Top Right) */}
                  <div className="absolute top-4 right-4">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider ${
                      evt.status === "concluded" 
                        ? "bg-gray-100 text-gray-600 border border-gray-200" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {evt.status === "concluded" ? "Concluded" : "Soon to Happen"}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${evt.categoryBg}`}>
                      {evt.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1c1b19] mb-2 group-hover:text-[#635f41] transition-colors">{evt.title}</h3>
                    <p className="text-sm text-[#49473d] mb-4 leading-relaxed font-light line-clamp-3">{evt.description}</p>
                    
                    {/* Rich Metadata Section */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-6 pt-4 border-t border-[#cac6b9]/15">
                      <div className="flex items-center gap-2 text-xs text-[#49473d]">
                        <MapPin className="w-3.5 h-3.5 text-[#635f41] flex-shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#49473d]">
                        <Clock className="w-3.5 h-3.5 text-[#635f41] flex-shrink-0" />
                        <span className="truncate">{evt.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#49473d]">
                        <User className="w-3.5 h-3.5 text-[#635f41] flex-shrink-0" />
                        <span className="truncate">{evt.host}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#49473d]">
                        <Tag className="w-3.5 h-3.5 text-[#635f41] flex-shrink-0" />
                        <span className="font-semibold truncate">{evt.priceInfo} ({evt.capacity})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#cac6b9]/15">
                    {evt.status === "upcoming" ? (
                      <button className="w-full bg-[#635f41] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#635f41]/95 transition-all shadow-sm flex items-center justify-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> Book Seat
                      </button>
                    ) : (
                      <button className="w-full bg-gray-100 border border-gray-200 text-gray-400 py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-default flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-400" /> Event Concluded
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-[#f7f3ee] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-[#cac6b9]/30 shadow-sm">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-serif text-3xl font-bold mb-6 text-[#1c1b19] tracking-tight">Stay Connected</h2>
            <p className="text-base text-[#49473d] mb-10 font-light">
              Subscribe to the Aayam calendar updates to receive notifications for plays, workshops, and community meetups.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input 
                className="flex-grow bg-white border-none border-b border-[#cac6b9] focus:ring-0 focus:border-[#635f41] text-[#1c1b19] px-6 py-4 text-sm rounded-lg" 
                placeholder="Email Address" 
                type="email"
              />
              <button className="bg-[#635f41] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#635f41]/90 transition-all shadow-md active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
