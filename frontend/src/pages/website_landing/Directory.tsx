// @ts-nocheck
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Flame, ArrowRight, ArrowUpRight, Filter, Users } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  roleType: "Actor" | "Director" | "Design" | "Production";
  description: string;
  image: string;
  isFeatured?: boolean;
}

const mapRoleType = (role: string): "Actor" | "Director" | "Design" | "Production" => {
  const r = role.toLowerCase();
  if (r.includes("director")) return "Director";
  if (r.includes("artist") || r.includes("design") || r.includes("choreographer")) return "Design";
  if (r.includes("maintainer") || r.includes("coordinator") || r.includes("production")) return "Production";
  return "Actor";
};

const fallbackMembers: Member[] = [
  {
    id: "MC-1001",
    name: "Abay Nandhiga",
    role: "Secretary (2024-2025)",
    roleType: "Production",
    description: "Secretary of Aayam - IIT Madras BS Drama Society. Directing society operations, stagecraft productions, and national festival tours.",
    image: "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
    isFeatured: true
  },
  {
    id: "MC-1002",
    name: "Yuuhi",
    role: "Deputy Secretary",
    roleType: "Production",
    description: "Deputy Secretary of Aayam. Lead performer in Nukkad Natak street plays, monologue actor, and directorial facilitator.",
    image: "/aayam_assets/profiles/abay_nandhiga.jpg",
    isFeatured: true
  },
  {
    id: "MC-1003",
    name: "Samarth Shrivastava",
    role: "Chief Coordinator",
    roleType: "Production",
    description: "Chief Coordinator of Aayam. Overseeing production logistics, stage design, auditorium booking, and festival operations.",
    image: "/aayam_assets/profiles/samarth_shrivastava.jpg",
    isFeatured: true
  },
  {
    id: "MC-1004",
    name: "Krishna Subramanian",
    role: "Dept. Chief Coordinator",
    roleType: "Production",
    description: "Dept. Chief Coordinator. Coordinating technical lighting boards, acoustic soundscapes, and live proscenium cues.",
    image: "/aayam_assets/profiles/krishna_subramanian.jpg"
  },
  {
    id: "MC-1005",
    name: "Harsh Aryan",
    role: "PR & Media Member",
    roleType: "Design",
    description: "PR & Media Member managing digital presence, event photography, press releases, and production stills.",
    image: "/aayam_assets/profiles/harsh_aryan.jpg"
  },
  {
    id: "MC-1006",
    name: "Swati Singh",
    role: "Web Admin & Tech Lead",
    roleType: "Production",
    description: "Web Admin & Tech Lead. Maintaining digital member roster, booking engines, and online portal infrastructure.",
    image: "/aayam_assets/profiles/swati_singh.jpg"
  },
  {
    id: "MC-1007",
    name: "Sneha Das",
    role: "Design Head",
    roleType: "Design",
    description: "Design Head at Aayam. Painting scenic backdrops, prop design, and visual brand identity.",
    image: "/aayam_assets/profiles/sylene_bansal.jpg"
  },
  {
    id: "MC-1008",
    name: "Tanu Kurade",
    role: "Mentor (Directing)",
    roleType: "Director",
    description: "Mentor (Directing). Directing multi-act stage plays, script adaptation, and classical blocking design.",
    image: "/aayam_assets/profiles/tanu_kurade.jpg"
  },
  {
    id: "MC-1009",
    name: "S. Sri Vaishnavi",
    role: "Mentor (Directing)",
    roleType: "Director",
    description: "Mentor (Directing). Guiding theatrical blocking, dialogue delivery, and proscenium stage direction.",
    image: "/aayam_assets/profiles/vaishnavi_srivastava.jpg"
  },
  {
    id: "MC-1010",
    name: "Akanksha Kadam",
    role: "Logistics Head",
    roleType: "Production",
    description: "Logistics Head overseeing stage props, auditorium venue booking, and travel transport.",
    image: "/aayam_assets/profiles/akanksha_kadam.jpg"
  },
  {
    id: "MC-1011",
    name: "Anshi Jain",
    role: "PR Head",
    roleType: "Design",
    description: "PR Head leading public relations, social media outreach, and audience engagement.",
    image: "/aayam_assets/profiles/chirag_kumar.jpg"
  },
  {
    id: "MC-1012",
    name: "Kaushal Raj",
    role: "Outreach Head",
    roleType: "Production",
    description: "Outreach Head building partnerships with corporate sponsors and festival patron circles.",
    image: "/aayam_assets/profiles/sneha_das.jpg"
  },
  {
    id: "MC-1013",
    name: "Vaishnavi Srivastava",
    role: "Volunteer Coordinator",
    roleType: "Actor",
    description: "Volunteer Coordinator managing backstage crew and festival ushering.",
    image: "/aayam_assets/profiles/vaishnavi_srivastava.jpg"
  },
  {
    id: "MC-1020",
    name: "Aditi",
    role: "Principal Dramatic Actress",
    roleType: "Actor",
    description: "Principal Dramatic Actress featured in contemporary stage adaptations and street play ensembles.",
    image: "/aayam_assets/profiles/aditi_drama.jpg"
  }
];

export default function Directory() {
  const [members, setMembers] = useState<Member[]>(fallbackMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"All" | "Actor" | "Director" | "Design" | "Production">("All");

  useEffect(() => {
    fetch("http://localhost:5005/api/members")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((m: any) => {
            const roleName = m.roles && m.roles.length > 0 ? m.roles[0] : "Member";
            return {
              id: m.member_id || m.id.toString(),
              name: m.name,
              role: roleName,
              roleType: mapRoleType(roleName),
              description: m.bio || "",
              image: m.avatarUrl || "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
              isFeatured: ["Abay Nandhiga", "Yuuhi", "Samarth Shrivastava", "Swati Singh"].includes(m.name)
            };
          });
          setMembers(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load members from backend:", err);
      });
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || member.roleType === filter;
    return matchesSearch && matchesFilter;
  });

  const featuredLeaders = members.filter(m => m.isFeatured).slice(0, 3);

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
        
        {/* Header Section */}
        <section className="pb-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57]">
                <Flame className="w-3.5 h-3.5" />
                <span>ARTISTIC ROSTER // 2026</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C2A28] font-normal tracking-tight leading-none">
                Ensemble Directory
              </h1>
              <p className="text-sm md:text-base text-[#666361] max-w-2xl leading-relaxed font-light mt-1">
                Discover the actors, directors, writers, and technicians who breathe life into Aayam's stagecraft.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 bg-[#2C2A28] text-white px-4 py-2 rounded-full border border-[#353535] shrink-0 text-xs font-mono">
              <Users className="w-3.5 h-3.5 text-[#E85F57]" />
              <span>{members.length} Ensemble Artists</span>
            </div>
          </div>
        </section>

        {/* Search & Dynamic Filter Pill Bar (Centered between top & bottom divider) */}
        <section className="sticky top-20 z-40 bg-[#E7DDD3]/95 backdrop-blur-md py-4 border-y border-[#D5C9BE]/60">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E85F57] w-4 h-4" />
              <input 
                className="w-full pl-11 pr-4 py-3 bg-white/80 border border-[#D5C9BE] rounded-full focus:outline-none focus:border-[#E85F57] text-xs font-mono text-[#2C2A28] placeholder-[#666361]/60 shadow-xs transition-all" 
                placeholder="Search artists by name, role, or craft..." 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
              {(["All", "Actor", "Director", "Design", "Production"] as const).map(role => (
                <button 
                  key={role}
                  onClick={() => setFilter(role)}
                  className={`px-5 py-2.5 text-xs font-mono font-bold rounded-full transition-all uppercase tracking-wider ${
                    filter === role 
                      ? "bg-[#2C2A28] text-white shadow-md" 
                      : "bg-white/60 text-[#666361] hover:bg-white border border-[#D5C9BE]/60"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Member Grid (Magazine / Editorial Style Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredMembers.map((member) => (
            <div 
              key={member.id} 
              className="group bg-[#2C2A28] text-white border border-[#353535] rounded-[2rem] overflow-hidden shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Profile Photo */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#353535]">
                  <img 
                    className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105 brightness-90 contrast-105" 
                    alt={member.name} 
                    src={member.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/aayam_assets/profiles/utkarsh_yuuhi.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-[#2C2A28]/20 to-transparent" />
                  
                  {member.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#2C2A28]/90 border border-[#E85F57]/40 text-[#E85F57] text-[9px] font-mono uppercase tracking-widest px-3 py-1 font-bold rounded-full flex items-center gap-1 shadow-md backdrop-blur-md">
                        <Star className="w-3 h-3 fill-[#E85F57]" /> Council
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-5 right-5">
                    <span className="text-[10px] font-mono font-bold text-[#E85F57] tracking-widest uppercase block mb-1">
                      {member.roleType}
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="text-xs font-mono text-white/60 pb-2 border-b border-white/10">
                    {member.role}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed line-clamp-3 font-light">
                    {member.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link 
                  to={`/profile/${member.id}`} 
                  className="w-full py-3 bg-[#E85F57] hover:bg-[#D94538] text-white font-bold text-xs font-mono uppercase tracking-widest block text-center rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>View Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}
