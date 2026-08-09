// @ts-nocheck
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Mail, Share2, Calendar, Award, BookOpen, Quote, Shield, Tag } from "lucide-react";

interface PortfolioItem {
  title: string;
  role: string;
  year: number;
  image: string;
  description: string;
}

interface MemberProfile {
  id: string;
  name: string;
  role: string;
  email?: string;
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
          // Find matching member by ID, member_id, or email
          const found = membersData.find(
            (m: any) =>
              (m.member_id && m.member_id.toLowerCase() === memberId?.toLowerCase()) ||
              (m.id && m.id.toString() === memberId) ||
              (m.email && m.email.toLowerCase() === memberId?.toLowerCase()) ||
              (m.name && m.name.toLowerCase().replace(/\s+/g, "-") === memberId?.toLowerCase())
          );

          if (found) {
            const roleName = found.roles && found.roles.length > 0 ? found.roles[0] : "Ensemble Member";
            const nameLower = (found.name || "").toLowerCase();

            // Personalized profiles per member
            let personalizedData = {
              activeSince: 2023,
              tier: roleName.includes("Maintainer") || roleName.includes("Secretary") || roleName.includes("Chief") ? "Core Executive Committee" : "Principal Performer",
              statementTitle: "Artistic Vision & Stagecraft",
              statementBody: found.bio || `${found.name} is a dedicated leader and performer at Aayam - IIT Madras BS Drama Society.`,
              statementSecondary: `Active in ${found.city || "IIT Madras BS"} chapter. Specializing in ${found.interest || "Stagecraft and Theatrical Expression"}.`,
              specializations: (found.interest || "Method Acting, Script Analysis, Stagecraft, Direction").split(",").map((s: string) => s.trim().toUpperCase()),
              quote: "The stage is not a mirror to reflect reality, but a prism to refract human truth.",
              portfolio: [
                {
                  title: "Tamashbin Kathputliya",
                  role: roleName,
                  year: 2024,
                  image: "/aayam_assets/tamashbin_user_1.jpg",
                  description: "Lead involvement in satirical street play performance and stage direction at open courtyard."
                },
                {
                  title: "DDDJ Stage Showcase",
                  role: "Ensemble Lead",
                  year: 2024,
                  image: "/aayam_assets/dddj_user_1.jpg",
                  description: "Featured in full-length stage drama with dynamic spotlight choreography."
                }
              ]
            };

            if (nameLower.includes("abay")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Secretary & Executive Leader",
                statementTitle: "Society Governance & Stage Direction",
                statementBody: "Abay leads the overall strategic vision, inter-collegiate partnerships, and theatrical productions of Aayam - IIT Madras BS Drama Society.",
                statementSecondary: "Pioneered society expansion, festival participation, and collaborative playwriting workshops across campuses.",
                specializations: ["SOCIETY GOVERNANCE", "STAGE DIRECTION", "PRODUCTION MANAGEMENT", "NUKKAD NATAK"],
                quote: "Theatre is not just performance; it is a movement that connects hearts across campuses.",
                portfolio: [
                  {
                    title: "Tamashbin Kathputliya",
                    role: "Executive Producer & Coordinator",
                    year: 2024,
                    image: "/aayam_assets/tamashbin_user_1.jpg",
                    description: "Spearheaded the satirical street play production, securing top honors in inter-collegiate drama competitions."
                  },
                  {
                    title: "DDDJ Stage Production",
                    role: "Production Director",
                    year: 2024,
                    image: "/aayam_assets/dddj_user_2.jpg",
                    description: "Directed stage cue timing, lighting shifts, and ensemble cast positioning for the annual theatrical showcase."
                  }
                ]
              };
            } else if (nameLower.includes("yuuhi") || nameLower.includes("utkarsh")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Deputy Secretary & Director",
                statementTitle: "Street Play Creation & Actor Development",
                statementBody: "Yuuhi specializes in high-energy street theatre, character work, and scriptwriting for competitive Nukkad Natak plays.",
                statementSecondary: "Conducts acting masterclasses and physical theatre drills for incoming ensemble members.",
                specializations: ["STREET THEATRE", "ACTING WORKSHOPS", "PLAYWRITING", "PHYSICAL DRAMA"],
                quote: "When the drum beats in the open courtyard, truth needs no amplification.",
                portfolio: [
                  {
                    title: "Tamashbin Kathputliya",
                    role: "Director & Lead Actor",
                    year: 2024,
                    image: "/aayam_assets/tamashbin_user_2.jpg",
                    description: "Designed the central satirical monologue and performed as the lead street-play narrator."
                  },
                  {
                    title: "Karn Ki Yachika",
                    role: "Dramatic Lead",
                    year: 2024,
                    image: "/aayam_assets/kky_user_1.jpg",
                    description: "Delivered intense tragic monologues in classical Hindi theatrical drama."
                  }
                ]
              };
            } else if (nameLower.includes("samarth")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Chief Coordinator",
                statementTitle: "Technical Stagecraft & Production Operations",
                statementBody: "Samarth oversees stage logistics, venue arrangements, equipment procurement, and backstage crew coordination.",
                statementSecondary: "Ensures technical perfection across all acoustic soundscapes, prop transfers, and lighting boards.",
                specializations: ["PRODUCTION LOGISTICS", "PROPS MANAGEMENT", "SOUND DESIGN", "VENUE CURATION"],
                quote: "Behind every seamless curtain call lies hours of invisible precision.",
                portfolio: [
                  {
                    title: "Samatvam Physical Theatre",
                    role: "Chief Production Coordinator",
                    year: 2024,
                    image: "/aayam_assets/samatvam_user_1.jpg",
                    description: "Coordinated complex group movement timing, props placement, and stage lighting transitions."
                  },
                  {
                    title: "Speak Up Tara",
                    role: "Stage Operations Director",
                    year: 2024,
                    image: "/aayam_assets/speak_up_tara_user_1.webp",
                    description: "Managed acoustic sound mixing and auditorium stage set construction."
                  }
                ]
              };
            } else if (nameLower.includes("krishna")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Dept. Chief Coordinator",
                statementTitle: "Lighting Engineering & Live Acoustics",
                statementBody: "Krishna specializes in lighting board programming, acoustic soundscapes, and live cue execution during major stage plays.",
                statementSecondary: "Oversees technical crew training and sound-check protocols for external auditoriums.",
                specializations: ["LIGHTING DESIGN", "ACOUSTIC ENGINEERING", "LIVE SOUND MIXING", "TECHNICAL CUES"],
                quote: "Light creates shadow, and shadow creates drama.",
                portfolio: [
                  {
                    title: "DDDJ Stage Production",
                    role: "Technical Lighting Director",
                    year: 2024,
                    image: "/aayam_assets/dddj_user_3.jpg",
                    description: "Programmed high-contrast spotlight shifts and dramatic color saturations."
                  },
                  {
                    title: "Speak Up Tara",
                    role: "Soundboard Lead",
                    year: 2024,
                    image: "/aayam_assets/speak_up_tara_user_3.webp",
                    description: "Designed live audio cues and background scoring for social drama performance."
                  }
                ]
              };
            } else if (nameLower.includes("swati")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Content & Copywriting Head",
                statementTitle: "Dramatic Writing & Promotional Narrative",
                statementBody: "Swati heads content creation, promotional scriptwriting, press releases, and dramatic literature for Aayam.",
                statementSecondary: "Crafts compelling play synopses, social media narratives, and archival documentation.",
                specializations: ["PLAYWRITING", "DRAMATIC COPYWRITING", "PUBLIC RELATIONS", "CONTENT STRATEGY"],
                quote: "A single spoken word on stage can ripple through an entire auditorium.",
                portfolio: [
                  {
                    title: "Speak Up Tara",
                    role: "Script Editor & Publicist",
                    year: 2024,
                    image: "/aayam_assets/speak_up_tara_user_2.webp",
                    description: "Authored promotional narratives and refined dialogue for high emotional impact."
                  },
                  {
                    title: "Tamashbin Kathputliya",
                    role: "Street Play Scriptwriter",
                    year: 2024,
                    image: "/aayam_assets/tamashbin_user_4.jpg",
                    description: "Co-wrote satirical rhymes and rhythmic chants for street play chorus."
                  }
                ]
              };
            } else if (nameLower.includes("harsh")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Web Operations & Tech Lead",
                statementTitle: "Digital Platform Architecture & Archival",
                statementBody: "Harsh leads digital platform development, online audition portals, media databases, and web maintenance for Aayam.",
                statementSecondary: "Maintains smooth digital operations for ensemble members, maintainers, and public patrons.",
                specializations: ["WEB OPERATIONS", "MEDIA ARCHIVAL", "UI/UX DESIGN", "PLATFORM ARCHITECTURE"],
                quote: "Bridging the timeless art of the stage with modern digital innovation.",
                portfolio: [
                  {
                    title: "Aayam Digital Platform",
                    role: "Lead Web Architect",
                    year: 2024,
                    image: "/aayam_assets/speak_up_tara_user_5.webp",
                    description: "Built and deployed the digital member directory, gallery database, and maintainer control panel."
                  },
                  {
                    title: "Karn Ki Yachika Digital Archival",
                    role: "Media Manager",
                    year: 2024,
                    image: "/aayam_assets/kky_user_5.jpg",
                    description: "Curated high-resolution photo archives and video press kits."
                  }
                ]
              };
            } else if (nameLower.includes("tanu")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Social Media & Brand Head",
                statementTitle: "Visual Branding & Multimedia Storytelling",
                statementBody: "Tanu manages visual identity, reel production, performance teasers, and social media campaigns for Aayam.",
                statementSecondary: "Drives visual engagement across digital channels before every major theatrical premiere.",
                specializations: ["SOCIAL MEDIA", "VISUAL DESIGN", "VIDEO PRODUCTION", "BRAND AESTHETICS"],
                quote: "Capturing the fleeting magic of live theater in everlasting visuals.",
                portfolio: [
                  {
                    title: "Karn Ki Yachika Teaser Campaign",
                    role: "Social Media Director",
                    year: 2024,
                    image: "/aayam_assets/kky_user_3.jpg",
                    description: "Produced behind-the-scenes teasers and promotional photo showcases."
                  },
                  {
                    title: "DDDJ Promo Reels",
                    role: "Creative Media Editor",
                    year: 2024,
                    image: "/aayam_assets/dddj_user_5.jpg",
                    description: "Edited dynamic trailer reels capturing highlight moments of the play."
                  }
                ]
              };
            } else if (nameLower.includes("esha")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Costume & Styling Coordinator",
                statementTitle: "Scenic Art & Costume Design",
                statementBody: "Esha leads period costume styling, character wardrobe selection, prop curation, and backstage quick-change coordination for Aayam.",
                statementSecondary: "Crafts hand-embroidered theatrical garments and prop sets for historical and contemporary stage plays.",
                specializations: ["COSTUME DESIGN", "PROP CURATION", "STAGE STYLING", "PERIOD WARDROBE"],
                quote: "Every costume tells a story before a single word is spoken.",
                portfolio: [
                  {
                    title: "Karn Ki Yachika Costumes",
                    role: "Lead Costume Designer",
                    year: 2024,
                    image: "/aayam_assets/kky_user_2.jpg",
                    description: "Designed authentic classical costumes and traditional stage drapes."
                  },
                  {
                    title: "Speak Up Tara Styling",
                    role: "Backstage Stylist",
                    year: 2024,
                    image: "/aayam_assets/speak_up_tara_user_4.webp",
                    description: "Managed contemporary wardrobe coordination and quick-change backstage queues."
                  }
                ]
              };
            } else if (nameLower.includes("kanishk")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Stage & Technical Director",
                statementTitle: "Acoustic Engineering & Technical Direction",
                statementBody: "Kanishk manages auditorium acoustics, lighting rigs, set construction, and live technical cue sync during major stage performances.",
                statementSecondary: "Coordinates inter-collegiate venue setups and soundboard soundscapes.",
                specializations: ["STAGE DIRECTION", "ACOUSTIC RIGS", "TECHNICAL CUES", "SET CONSTRUCTION"],
                quote: "Precision in technical cues elevates pure performance into magic.",
                portfolio: [
                  {
                    title: "DDDJ Technical Direction",
                    role: "Stage Technical Director",
                    year: 2024,
                    image: "/aayam_assets/dddj_user_3.jpg",
                    description: "Engineered stage light saturation and multi-channel sound mixing."
                  },
                  {
                    title: "Tamashbin Courtyard Setup",
                    role: "Technical Operations",
                    year: 2024,
                    image: "/aayam_assets/tamashbin_user_3.jpg",
                    description: "Designed outdoor courtyard acoustic sound amplification."
                  }
                ]
              };
            } else if (nameLower.includes("aditi")) {
              personalizedData = {
                activeSince: 2023,
                tier: "Principal Dramatic Performer",
                statementTitle: "Character Portrayal & Dramatic Expression",
                statementBody: "Aditi is a lead dramatic actress featured in contemporary stage plays, emotional monologues, and street play chorus roles.",
                statementSecondary: "Specializes in voice modulation, emotional realism, and high-energy ensemble performance.",
                specializations: ["METHOD ACTING", "CHARACTER PORTRAYAL", "DRAMATIC MONOLOGUES", "STREET THEATRE"],
                quote: "Acting is living truthfully under imaginary circumstances.",
                portfolio: [
                  {
                    title: "Speak Up Tara",
                    role: "Lead Dramatic Actress",
                    year: 2024,
                    image: "/aayam_assets/speak_up_tara_user_1.webp",
                    description: "Portrayed the central character in the social drama production."
                  },
                  {
                    title: "Tamashbin Kathputliya Chorus",
                    role: "Ensemble Performer",
                    year: 2024,
                    image: "/aayam_assets/tamashbin_user_5.jpg",
                    description: "Performed in high-energy street play chorus and crowd engagement scenes."
                  }
                ]
              };
            }

            setProfile({
              id: found.member_id || found.id.toString(),
              name: found.name,
              role: roleName,
              email: found.email,
              activeSince: personalizedData.activeSince,
              tier: personalizedData.tier,
              image: found.avatarUrl || "/aayam_assets/profiles/abay_nandhiga.jpg",
              statementTitle: personalizedData.statementTitle,
              statementBody: personalizedData.statementBody,
              statementSecondary: personalizedData.statementSecondary,
              specializations: personalizedData.specializations,
              quote: personalizedData.quote,
              portfolio: personalizedData.portfolio
            });
            setLoading(false);
            return;
          }
        }

        // Default Fallback profile if member ID is not matched
        setProfile({
          id: "MC-1001",
          name: "Sneha Vyas",
          role: "Director Coordinator",
          email: "sneha@handle.com",
          activeSince: 2018,
          tier: "Core Ensemble Leader",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
          statementTitle: "Finding the Human Core",
          statementBody: "Sneha is a classical performer and director who believes stage acting is a high-contrast study of raw human vulnerability.",
          statementSecondary: "Over her years at Aayam, she has taken on the most challenging dramatic roles and directed multiple award-winning plays.",
          specializations: ["METHOD ACTING", "CLASSICAL DRAMA", "DIRECTION", "STAGE MANAGEMENT"],
          quote: "Acting is not about being someone else; it's about finding the likeness of another human in yourself.",
          portfolio: [
            {
              title: "Tughlaq Premiere",
              role: "Director",
              year: 2024,
              image: "https://images.unsplash.com/photo-1507676184212-d0330a151f15?q=80&w=600&auto=format&fit=crop",
              description: "Directed opening night of Girish Karnad's Tughlaq under dramatic lighting."
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
      <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans py-32 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#635f41]/10 text-[#635f41] flex items-center justify-center mx-auto animate-spin">
            🎭
          </div>
          <p className="text-sm font-bold text-[#635f41]">Loading Ensemble Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] pt-2 pb-12">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header */}
        <header className="mb-16 border-b border-[#cac6b9]/30 pb-6 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-[#635f41] uppercase tracking-[0.25em] mb-2 block">
              Ensemble Member Profile
            </span>
            <h1 className="font-serif text-5xl font-bold text-[#1c1b19] tracking-tight">{profile.name}</h1>
          </div>
          <p className="text-sm text-[#635f41] mt-2 md:mt-0 font-bold uppercase tracking-wider">
            {profile.role} at Aayam
          </p>
        </header>

        {/* 3-Column Community Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Sidebar - Profile Summary */}
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-28">
            <div className="bg-[#f7f3ee] p-6 rounded-2xl border border-[#cac6b9]/40 shadow-sm flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-white/50 shadow-md">
                <img 
                  className="w-full h-full object-cover" 
                  alt={`${profile.name} headshot`} 
                  src={profile.image}
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#635f41] mb-1">{profile.name}</h3>
              <p className="text-xs font-bold text-[#466272] uppercase tracking-wider mb-4">{profile.role}</p>
              
              <div className="w-full border-t border-[#cac6b9]/25 pt-4 space-y-3 text-left">
                {profile.email && (
                  <div className="flex items-center gap-3 text-xs text-[#49473d] truncate">
                    <Mail className="w-4 h-4 text-[#635f41] flex-shrink-0" />
                    <span className="truncate"><strong>Email:</strong> {profile.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-[#49473d]">
                  <Calendar className="w-4 h-4 text-[#635f41] flex-shrink-0" />
                  <span><strong>Active Since:</strong> {profile.activeSince}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#49473d]">
                  <Shield className="w-4 h-4 text-[#635f41] flex-shrink-0" />
                  <span><strong>Ensemble Tier:</strong> {profile.tier}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6 w-full">
                <a
                  href={`mailto:${profile.email || "ensemble@matinee.club"}`}
                  className="flex-1 py-2.5 bg-[#635f41] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#635f41]/90 shadow-xs transition-all active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              </div>
            </div>
            
            {/* Navigation Link */}
            <div className="hidden lg:flex flex-col bg-white rounded-2xl border border-[#cac6b9]/30 p-4 space-y-1">
              <Link to="/directory" className="px-4 py-2.5 rounded-lg text-[#635f41] hover:bg-[#635f41]/5 text-xs font-bold flex items-center gap-2 transition-all">
                ← Back to Directory
              </Link>
            </div>
          </aside>

          {/* Center Column - Production Portfolio Feed */}
          <div className="lg:col-span-6 space-y-8" id="portfolio">
            <h2 className="text-xs font-bold text-[#635f41] uppercase tracking-[0.25em] mb-4 block">
              Curated Production Feed
            </h2>
            
            {profile.portfolio.map((item, index) => (
              <article key={index} className="bg-white rounded-2xl overflow-hidden border border-[#cac6b9]/25 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#c6e4f7] flex items-center justify-center text-[#2e4a5a]">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1c1b19]">{item.role}</h4>
                        <p className="text-[11px] text-[#49473d]">{item.year} Production</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#635f41] uppercase bg-[#635f41]/10 border border-[#635f41]/20 px-3 py-1 rounded">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-sm text-[#49473d] mb-4 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
                <div className="aspect-[16/10] relative overflow-hidden bg-[#f7f3ee]">
                  <img 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    alt={item.title} 
                    src={item.image || profile.image}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = profile.image;
                    }}
                  />
                </div>
              </article>
            ))}
          </div>

          {/* Right Sidebar - Artistic Statement & Skills */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Artistic Statement Card */}
            <section className="bg-white p-6 rounded-2xl border border-[#cac6b9]/30 shadow-xs" id="statement">
              <h3 className="text-xs font-bold text-[#635f41] uppercase tracking-wider mb-4 pb-2 border-b border-[#cac6b9]/10 flex items-center justify-between">
                <span>{profile.statementTitle}</span>
                <BookOpen className="w-4 h-4" />
              </h3>
              <p className="text-xs text-[#49473d] leading-relaxed mb-4 font-light">
                {profile.statementBody}
              </p>
              <p className="text-xs text-[#49473d] leading-relaxed font-light">
                {profile.statementSecondary}
              </p>
            </section>

            {/* Specializations & Skills */}
            <section className="bg-white p-6 rounded-2xl border border-[#cac6b9]/30 shadow-xs">
              <h3 className="text-xs font-bold text-[#635f41] uppercase tracking-wider mb-4 pb-2 border-b border-[#cac6b9]/10 flex items-center justify-between">
                <span>Specializations</span>
                <Tag className="w-4 h-4" />
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map(skill => (
                  <span key={skill} className="bg-[#e2fdff] text-[#324b4d] px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest border border-[#324b4d]/10">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Favorite Quote Card */}
            <section className="p-5 border-l-4 border-[#635f41] bg-[#635f41]/5 rounded-r-2xl">
              <Quote className="w-6 h-6 text-[#635f41] opacity-40 mb-2" />
              <p className="text-xs italic text-[#49473d] leading-relaxed font-light">
                "{profile.quote}"
              </p>
            </section>
          </aside>

        </div>
      </main>
    </div>
  );
}
