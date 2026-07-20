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
    image: "/aayam_assets/profiles/samarth_shrivastava.jpg",
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
    fetch("http://localhost:5001/api/members")
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
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#635f41] uppercase tracking-[0.25em] mb-4 block">
                Creative Ensemble
              </span>
              <h1 className="font-serif text-5xl md:text-7xl text-[#1c1b19] font-bold mb-4 tracking-tight">Ensemble Directory</h1>
              <p className="text-lg text-[#49473d] leading-relaxed font-light">
                Discover the extraordinary talent bringing Aayam's stage to life. Explore the artists, directors, and designers behind our theatrical productions.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="mb-12 sticky top-20 z-40 bg-[#fdf9f4] py-4 border-b border-[#cac6b9]/30">
          <div className="bg-[#f7f3ee] border border-[#cac6b9]/30 p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center rounded-2xl">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-white border-0 border-b border-[#cac6b9]/40 focus:ring-0 focus:border-[#635f41] text-sm text-[#1c1b19] placeholder-gray-400" 
                placeholder="Search by name or keyword..." 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
              <label className="text-xs font-bold text-[#49473d] mr-2 uppercase tracking-wider">Roles:</label>
              {(["All", "Actor", "Director", "Design", "Production"] as const).map(role => (
                <button 
                  key={role}
                  onClick={() => setFilter(role)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider ${
                    filter === role 
                      ? "bg-[#635f41] text-white shadow-sm" 
                      : "bg-[#c6e4f7] text-[#2e4a5a] hover:bg-[#c6e4f7]/80"
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
            <div key={index} className="group bg-white border border-[#cac6b9]/25 overflow-hidden rounded-2xl shadow-sm hover:border-[#635f41]/25 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f3ee]">
                  <img 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                    alt={member.name} 
                    src={member.image}
                  />
                  {member.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#fff9d2] border border-[#635f41]/20 text-[#635f41] text-[10px] uppercase tracking-widest px-3 py-1 font-bold rounded flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-[#635f41]" /> Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-1 mb-4">
                    <h3 className="font-serif text-xl font-bold text-[#1c1b19] group-hover:text-[#635f41] transition-colors">{member.name}</h3>
                    <span className="text-xs font-bold text-[#466272] tracking-widest uppercase">{member.role}</span>
                  </div>
                  <p className="text-sm text-[#49473d] leading-relaxed line-clamp-3 font-light">
                    {member.description}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link 
                  to={`/profile/${member.id}`} 
                  className="w-full py-3 bg-[#635f41] text-white hover:bg-[#635f41]/90 font-bold text-xs uppercase tracking-wider block text-center rounded-xl shadow-md transition-all active:scale-95"
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
