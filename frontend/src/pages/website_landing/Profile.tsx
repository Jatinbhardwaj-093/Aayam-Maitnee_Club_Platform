// @ts-nocheck
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Mail,
  Calendar,
  Award,
  BookOpen,
  Quote,
  Shield,
  Tag,
  MapPin,
  ArrowLeft,
  ArrowUpRight,
  Flame,
  Star,
  Sparkles,
  Layers
} from "lucide-react";

interface PortfolioItem {
  title: string;
  role: string;
  year: number;
  image: string;
  description: string;
}

interface MemberProfile {
  id: string;
  member_id: string;
  name: string;
  role: string;
  email?: string;
  city?: string;
  state?: string;
  pronouns?: string;
  activeSince: number;
  tier: string;
  image: string;
  statementTitle: string;
  statementBody: string;
  statementSecondary: string;
  specializations: string[];
  quote: string;
  portfolio: PortfolioItem[];
}

export default function Profile() {
  const { memberId } = useParams<{ memberId: string }>();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    
    fetch(`${baseUrl}/api/members`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((membersData) => {
        if (Array.isArray(membersData)) {
          // Find matching member by ID, member_id, or email, or normalized name
          const found = membersData.find(
            (m: any) =>
              (m.member_id && m.member_id.toLowerCase() === memberId?.toLowerCase()) ||
              (m.id && m.id.toString() === memberId) ||
              (m.email && m.email.toLowerCase() === memberId?.toLowerCase()) ||
              (m.name && m.name.toLowerCase().replace(/\s+/g, "-") === memberId?.toLowerCase())
          );

          if (found) {
            const roleName = found.roles && found.roles.length > 0 ? found.roles[0] : (found.role || "Ensemble Member");
            const pData = found.portfolioData || {};

            setProfile({
              id: found.id?.toString() || "1",
              member_id: found.member_id || "MC-1001",
              name: found.name,
              role: roleName,
              email: found.email,
              city: found.city || "IIT Madras BS",
              state: found.state || "Tamil Nadu",
              pronouns: found.pronouns || "they/them",
              activeSince: pData.activeSince || 2023,
              tier: pData.tier || "Core Theatrical Ensemble",
              image: found.avatarUrl || found.image || "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
              statementTitle: pData.statementTitle || "Artistic Vision & Stagecraft",
              statementBody: pData.statementBody || found.bio || `${found.name} is a dedicated performer and coordinator at Aayam.`,
              statementSecondary: pData.statementSecondary || `Active in ${found.city || "IIT Madras BS"} chapter. Specializing in ${found.interest || "Theatrical Expression"}.`,
              specializations: pData.specializations || (found.interest || "Acting, Stagecraft, Direction").split(",").map((s: string) => s.trim().toUpperCase()),
              quote: pData.quote || "The stage is not a mirror to reflect reality, but a prism to refract human truth.",
              portfolio: pData.portfolio && pData.portfolio.length > 0 ? pData.portfolio : [
                {
                  title: "Aayam Seasonal Repertoire",
                  role: roleName,
                  year: 2026,
                  image: "/aayam_assets/tamashbin_user_1.jpg",
                  description: "Core participation in annual stage showcases, street play festivals, and collegiate dramatics."
                }
              ]
            });
            setLoading(false);
            return;
          }
        }

        // Fallback if not found in list
        setProfile({
          id: "MC-1001",
          member_id: "MC-1001",
          name: "Abay Nandhiga",
          role: "Secretary Aayam",
          email: "23f2000668@ds.study.iitm.ac.in",
          city: "Chennai",
          state: "Tamil Nadu",
          pronouns: "he/him",
          activeSince: 2023,
          tier: "Core Directorial Council",
          image: "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
          statementTitle: "Society Governance & Stage Direction",
          statementBody: "Directing society operations, stagecraft productions, and national festival tours across India.",
          statementSecondary: "Pioneered society expansion and collaborative playwriting workshops across IIT Madras BS.",
          specializations: ["SOCIETY GOVERNANCE", "STAGE DIRECTION", "PRODUCTION MANAGEMENT", "NUKKAD NATAK"],
          quote: "Theatre is not just performance; it is a movement that connects hearts across campuses.",
          portfolio: [
            {
              title: "Tamashbin Kathputliya",
              role: "Executive Producer",
              year: 2026,
              image: "/aayam_assets/tamashbin_user_1.jpg",
              description: "Spearheaded satirical street play production across IIT campus festival circuit."
            },
            {
              title: "DDDJ Stage Production",
              role: "Production Director",
              year: 2026,
              image: "/aayam_assets/dddj_user_1.jpg",
              description: "Directed high-contrast proscenium blocking and lighting cues for CLT auditorium."
            }
          ]
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, [memberId]);

  if (loading || !profile) {
    return (
      <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#E85F57]/20 text-[#E85F57] flex items-center justify-center mx-auto animate-pulse">
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#666361]">
            Loading Ensemble Portfolio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-24">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#D5C9BE]/50 pb-4">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#2C2A28] hover:text-[#E85F57] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Ensemble Directory</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[#666361]">
            <span className="text-[#E85F57]">●</span>
            <span>ID: {profile.member_id}</span>
          </div>
        </div>

        {/* Master Profile Hero Header Banner */}
        <section className="bg-[#2C2A28] text-white rounded-[2.5rem] p-8 md:p-12 border border-[#353535] shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Avatar Headshot with Ring */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden border-2 border-white/15 shadow-2xl group bg-[#353535]">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent opacity-40" />
              </div>
            </div>

            {/* Profile Core Details */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="bg-[#E85F57] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                  {profile.tier}
                </span>
                {profile.pronouns && (
                  <span className="bg-[#353535] text-white/70 text-[10px] font-mono px-3 py-1 rounded-full border border-white/10">
                    {profile.pronouns}
                  </span>
                )}
                <span className="bg-[#353535] text-white/70 text-[10px] font-mono px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E85F57]" /> {profile.city}, {profile.state}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F7F5F0] font-normal tracking-tight leading-tight">
                {profile.name}
              </h1>

              <p className="text-sm font-mono text-[#E85F57] tracking-wider uppercase font-semibold">
                {profile.role}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="bg-[#E85F57] hover:bg-[#D94538] text-white px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Artist</span>
                  </a>
                )}
                <div className="text-xs font-mono text-white/50 flex items-center gap-2 py-3 px-4 rounded-full bg-white/5 border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-[#E85F57]" />
                  <span>Ensemble Member Since {profile.activeSince}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2-Column Editorial Body: Sidebar (Statement/Skills/Quote) + Portfolio Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Vision, Skills, Quote (Span 4) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* Statement Card */}
            <div className="bg-[#2C2A28] text-white rounded-[2rem] p-7 md:p-8 border border-[#353535] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono font-bold text-[#E85F57] uppercase tracking-widest">
                  ARTISTIC STATEMENT
                </span>
                <BookOpen className="w-4 h-4 text-[#E85F57]" />
              </div>

              <h3 className="font-serif text-2xl text-[#F7F5F0] font-normal leading-snug">
                {profile.statementTitle}
              </h3>

              <p className="text-xs text-white/70 leading-relaxed font-light">
                {profile.statementBody}
              </p>

              <p className="text-xs text-white/50 leading-relaxed font-light pt-2 border-t border-white/5">
                {profile.statementSecondary}
              </p>
            </div>

            {/* Specializations Pills */}
            <div className="bg-[#2C2A28] text-white rounded-[2rem] p-7 md:p-8 border border-[#353535] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono font-bold text-[#E85F57] uppercase tracking-widest">
                  THEATRICAL SPECIALIZATIONS
                </span>
                <Tag className="w-4 h-4 text-[#E85F57]" />
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="bg-[#353535] text-white/90 text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full border border-white/10 tracking-wider uppercase"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Dramatic Philosophy Quote */}
            <div className="bg-[#2C2A28] text-white rounded-[2rem] p-7 md:p-8 border-l-4 border-[#E85F57] border-t border-b border-r border-[#353535] shadow-xl space-y-3">
              <Quote className="w-6 h-6 text-[#E85F57] opacity-80" />
              <p className="font-serif text-base italic text-[#F7F5F0] leading-relaxed">
                "{profile.quote}"
              </p>
              <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">
                — {profile.name} // Aayam Dramaturgy
              </span>
            </div>

          </div>

          {/* Right Column: Curated Production Works (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#D5C9BE]/50">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57]">
                <Layers className="w-4 h-4" />
                <span>CURATED REPERTOIRE & PRODUCTIONS</span>
              </div>
              <span className="text-xs font-mono text-[#666361]">
                {profile.portfolio.length} Production Works
              </span>
            </div>

            <div className="space-y-6">
              {profile.portfolio.map((item, idx) => (
                <article
                  key={idx}
                  className="bg-[#2C2A28] text-white rounded-[2rem] border border-[#353535] overflow-hidden shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                    
                    {/* Media Preview */}
                    <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto min-h-[220px] overflow-hidden bg-[#353535]">
                      <img
                        src={item.image || profile.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = profile.image;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent md:hidden" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#2C2A28]/90 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-mono px-3 py-1 rounded-full font-bold">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    {/* Work Details */}
                    <div className="md:col-span-7 p-7 md:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[#E85F57] uppercase tracking-wider">
                            {item.role}
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl md:text-3xl text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-white/70 font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                        <span>Aayam Production Season</span>
                        <Link to="/plays" className="text-[#E85F57] hover:underline flex items-center gap-1 font-semibold">
                          View Playbill <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </article>
              ))}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
