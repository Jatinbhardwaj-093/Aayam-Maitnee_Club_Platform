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
    name: "Sneha Vyas",
    role: "Director Coordinator",
    roleType: "Director",
    description: "Award-winning director from Mumbai with 15+ years of experience directing modern adaptions of Sanskrit classics.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnKUcfY7TKeCByoapSFAmtQIcIc4MmzLibSjnluJbKUysBTKE9qXxmIV3G3iSB8y0k17HEH1E3cfGc0y9OU2Or4LrSIk1pq6J3Skuvg39T7DXSjvd-iBflpXguYRHkVHdb9BJ_Vun0fgkFKmmlnW29sKRqsWDcvSj1_dMPMnE8aCABiaRJWvEyCIOY5pCj3aSn4u_5noKiiqjdzp1cT19rKnbLW9-s_uAzKe2-bkEKYmTE9qGb13joN8SvuzO34Z8BVa05uhfFubR3",
    isFeatured: true
  },
  {
    id: "MC-1005",
    name: "Jayesh Dave",
    role: "Lead Actor & Member",
    roleType: "Actor",
    description: "Method actor specializing in intense protagonist roles. Acted in over 20 stage plays.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkD84l9bATTsiV52kbs28_DoHe5f-PFPhB-nnNhuVMs3HgrRA5SWWYHicVET7ryt72YNgtmpyADDdAyM-UziuL4jidI_Uni24HQ1_fqFqT6iaR8ty6GLtE7dKiThcvvU2uOhqsHlIJRuEnhZtJ7Z3-utaWmwkRwcx8efca5RxbgMzf7ztWCU6bYzK3tAIT63YZC8h4zZsX7T8zsxCc1NbgZ4W_b-A_nqNfAWBXbjEPH3d6iKTlACia"
  },
  {
    id: "MC-1007",
    name: "Pooja Patel",
    role: "Scenic Artist",
    roleType: "Design",
    description: "Creating magnificent, detailed set backdrops inspired by Indian heritage and mythology.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCriANEGDPnpWF8zDsu7mv1efvGVJTz43tLNpo0iKYmMNrXAlqwT8q1YgteTWb_JWv5DDzS00j2JgpuOB65dt5LBR2xvDl_DNzKM9dZ8m6Z5tAmJn0AE2rJmW4OqEZuixxnCVYsnD_CyvaaYxr3x0V4oe-Ind7ffzi9PBm2zQkRlx2v-4XQJe0ouNR5skkT9lf9iA3mya74pOReSx6PmY_Cu5rVySlcZIn8_rw1-AzevATQVpd_zfO1"
  },
  {
    id: "MC-1002",
    name: "Kabir Mehta",
    role: "Core Maintainer",
    roleType: "Production",
    description: "Lead developer and technical coordinator, crafting immersive interactive stages and platform experiences.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASrF76oyehZoH0Mp6atVLKf1XKX3tY2Q3-v1ZO9_y46IBhoVb597s54MEzoQVZ9ByIRvg5T0utOwDy8G93a0g7JDTLaq75m_dJkTVqR-tz6Ljvhc6MD4cB1NZ-GKU1fdDkMPdQPflf5NTN84uED9M4V3qPGbpaCptepJqWcOetCzmYbC9fAqhr2dFzcblWzWTMv6LICPucZiomxUrFjioKszlnFL2RRBl-p01evg3dOSqdBQX3FSBS"
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
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] py-24">
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
