import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star } from "lucide-react";

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
    description: "Secretary of Aayam - IIT Madras BS Drama Society. Directing society operations and stagecraft productions.",
    image: "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
    isFeatured: true
  },
  {
    id: "MC-1002",
    name: "Yuuhi",
    role: "Deputy Secretary",
    roleType: "Production",
    description: "Deputy Secretary of Aayam. Lead performer in Nukkad Natak street plays and stage productions.",
    image: "/aayam_assets/profiles/abay_nandhiga.jpg",
    isFeatured: true
  },
  {
    id: "MC-1003",
    name: "Samarth Shrivastava",
    role: "Chief Coordinator",
    roleType: "Production",
    description: "Chief Coordinator of Aayam. Overseeing production logistics, stage design, and inter-collegiate drama fests.",
    image: "/aayam_assets/profiles/my_pic.jpg",
    isFeatured: true
  },
  {
    id: "MC-1004",
    name: "Krishna Subramanian",
    role: "Dept. Chief Coordinator",
    roleType: "Production",
    description: "Dept. Chief Coordinator. Coordinating technical lighting boards, acoustic soundscapes, and live cues.",
    image: "/aayam_assets/profiles/krishna_subramanian.jpg"
  },
  {
    id: "MC-1005",
    name: "Harsh Aryan",
    role: "PR & Media Member",
    roleType: "Design",
    description: "PR & Media Member managing digital presence, event photography, and press releases.",
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
    description: "Mentor (Directing). Guiding theatrical blocking, dialogue delivery, and stage direction.",
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
    description: "Volunteer Coordinator - Order behind the art. Managing backstage crew and festival ushering.",
    image: "/aayam_assets/profiles/vaishnavi_srivastava.jpg"
  },
  {
    id: "MC-1014",
    name: "Gaurav",
    role: "Members' Coordinator",
    roleType: "Actor",
    description: "Members' Coordinator managing onboarding, rehearsal attendance, and internal communication.",
    image: "/aayam_assets/profiles/chirag_kumar.jpg"
  },
  {
    id: "MC-1015",
    name: "Shrit",
    role: "Members' Coordinator",
    roleType: "Actor",
    description: "Members' Coordinator supporting rehearsal scheduling, script distribution, and auditions.",
    image: "/aayam_assets/profiles/harsh_aryan.jpg"
  },
  {
    id: "MC-1016",
    name: "Dipanshu Bist",
    role: "Meet Host",
    roleType: "Actor",
    description: "Meet Host for Aayam interactive sessions, Sahitya Sabha discussions, and orientation events.",
    image: "/aayam_assets/profiles/utkarsh_yuuhi.jpg"
  },
  {
    id: "MC-1017",
    name: "Neelotpala",
    role: "Mentor",
    roleType: "Director",
    description: "Ensemble Mentor providing creative direction and theatrical dramaturgy.",
    image: "/aayam_assets/profiles/tanu_kurade.jpg"
  },
  {
    id: "MC-1018",
    name: "Kanishk Mishra",
    role: "Stage & Technical Director",
    roleType: "Director",
    description: "Stage & Technical Director managing auditorium acoustics, lighting rigs, and set construction.",
    image: "/aayam_assets/profiles/kanishk_mishra.jpg"
  },
  {
    id: "MC-1019",
    name: "Esha Hinde",
    role: "Costume & Production Coordinator",
    roleType: "Design",
    description: "Costume & Production Coordinator specializing in period costume design, prop curation, and backstage styling.",
    image: "/aayam_assets/profiles/esha_hinde.jpg"
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
              image: m.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAnKUcfY7TKeCByoapSFAmtQIcIc4MmzLibSjnluJbKUysBTKE9qXxmIV3G3iSB8y0k17HEH1E3cfGc0y9OU2Or4LrSIk1pq6J3Skuvg39T7DXSjvd-iBflpXguYRHkVHdb9BJ_Vun0fgkFKmmlnW29sKRqsWDcvSj1_dMPMnE8aCABiaRJWvEyCIOY5pCj3aSn4u_5noKiiqjdzp1cT19rKnbLW9-s_uAzKe2-bkEKYmTE9qGb13joN8SvuzO34Z8BVa05uhfFubR3",
              isFeatured: m.name === "Sneha Vyas"
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

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#353535] uppercase tracking-[0.25em] mb-4 block">
                Creative Ensemble
              </span>
              <h1 className="font-serif text-5xl md:text-7xl text-[#2C2A28] font-bold mb-4 tracking-tight">Ensemble Directory</h1>
              <p className="text-lg text-[#666361] leading-relaxed font-light">
                Discover the extraordinary talent bringing Aayam's stage to life. Explore the artists, directors, and designers behind our theatrical productions.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="mb-12 sticky top-20 z-40 bg-[#E7DDD3]/90 backdrop-blur-md py-4 border-b border-[#D5C9BE]/40">
          <div className="bg-[#2C2A28] text-white border border-[#353535] p-4 md:p-6 shadow-xl flex flex-col md:flex-row gap-5 items-center rounded-3xl">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E85F57] w-4 h-4" />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-[#353535]/80 border border-white/10 rounded-full focus:outline-none focus:border-[#E85F57] text-xs font-mono text-[#F7F5F0] placeholder-white/40 transition-all" 
                placeholder="Search ensemble by name, role, or interest..." 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto shrink-0">
              <span className="text-[10px] font-mono font-bold text-white/50 mr-1 uppercase tracking-widest">ROLES:</span>
              {(["All", "Actor", "Director", "Design", "Production"] as const).map(role => (
                <button 
                  key={role}
                  onClick={() => setFilter(role)}
                  className={`px-4 py-2 text-[10px] font-mono font-bold rounded-full transition-all uppercase tracking-wider ${
                    filter === role 
                      ? "bg-[#E85F57] text-white shadow-md" 
                      : "bg-[#353535] text-white/70 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Member Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, index) => (
            <div key={index} className="group bg-[#2C2A28] text-white border border-[#353535] overflow-hidden rounded-3xl shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#353535]">
                  <img 
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105 filter brightness-90 contrast-105" 
                    alt={member.name} 
                    src={member.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/aayam_assets/tamashbin_user_1.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                  
                  {member.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#2C2A28]/90 border border-[#E85F57]/40 text-[#E85F57] text-[10px] font-mono uppercase tracking-widest px-3 py-1 font-bold rounded-full flex items-center gap-1 shadow-md backdrop-blur-md">
                        <Star className="w-3 h-3 fill-[#E85F57]" /> Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">{member.name}</h3>
                    <span className="text-[10px] font-mono font-semibold text-[#E85F57] tracking-widest uppercase">{member.role}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed line-clamp-3 font-light">
                    {member.description}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link 
                  to={`/profile/${member.id}`} 
                  className="w-full py-3.5 bg-[#E85F57] text-white hover:bg-[#D94538] font-bold text-xs uppercase tracking-widest block text-center rounded-full shadow-md transition-all active:scale-95"
                >
                  View Portfolio
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
