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

const profilesData: Record<string, MemberProfile> = {
  "elena-vance": {
    id: "elena-vance",
    name: "Elena Vance",
    role: "Lead Actor",
    activeSince: 2018,
    tier: "Principal Ensemble",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOcdtiEQoy0zh7y5qSW0Em4w87Fz4lYTZmmBHcfyhtbFSceWTs6u9jCaB86rGeiDJkDrywYIgX71l3jt19-0GLz9-vbEQ-9wH6XExEEXWnd-ExlGcaR80XF_2ycyoeJtC9ptjtv9sSbWmZOHsPUPoR-4etUI75RDr-GDf_pEtBNVXP7Dc6V7lxKNmtdTXyiO2m0B-OKU6_dR-PpXk-5toQXim5hfvEU-2yxU896g2mz9Jw3CKPdSJv",
    statementTitle: "Finding the Human Core",
    statementBody: "Elena is a classical performer who believes stage acting is a high-contrast study of raw human vulnerability. Every posture, sigh, and silence on stage must tell an authentic truth.",
    statementSecondary: "Over her years at Aayam, she has taken on the most challenging dramatic roles, bringing depth and intellectual weight to classical and contemporary interpretations.",
    specializations: ["METHOD ACTING", "CLASSICAL DRAMA", "SHAKESPEAREAN VERSE", "IMPROVISATION"],
    quote: "Acting is not about being someone else; it's about finding the likeness of another human in yourself.",
    portfolio: [
      {
        title: "The Glass Orchestration",
        role: "Lead Cast (Violinist)",
        year: 2024,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAzuMBaCOUMEUXFsi58uX4Sk0JbT72vPkeMf7KwisCYFvuX3Bk8gP1e__uZ8B3G4bYBmYBQjlPftJgABVJuuHuLNh_AIDoUgyAwaSJBouCjuqcQ7quRshTI9hepIQebEmL3pvhyyO6hPnGW2vUGYrayYRqt1rRMyl1OCAIad0kKVUn46ZjCsSI_nQCNnUrcxx_B1Rvmvml5deoCtkUqY61szLjR8uoRvQhIHhNvsCHkKUY4niHP9cI",
        description: "Played a reclusive virtuoso facing the loss of her hearing. A highly physical, silent performance."
      },
      {
        title: "Blue Horizon",
        role: "Monologue Performer",
        year: 2023,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
        description: "Engaged in an experimental series of interconnected monologues exploring isolation."
      }
    ]
  },
  "marcus-thorne": {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    role: "Director",
    activeSince: 2017,
    tier: "Master Director",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASrF76oyehZoH0Mp6atVLKf1XKX3tY2Q3-v1ZO9_y46IBhoVb597s54MEzoQVZ9ByIRvg5T0utOwDy8G93a0g7JDTLaq75m_dJkTVqR-tz6Ljvhc6MD4cB1NZ-GKU1fdDkMPdQPflf5NTN84uED9M4V3qPGbpaCptepJqWcOetCzmYbC9fAqhr2dFzcblWzWTMv6LICPucZiomxUrFjioKszlnFL2RRBl-p01evg3dOSqdBQX3FSBS",
    statementTitle: "Silence and Light",
    statementBody: "Marcus Thorne focuses on minimalist stage architectures, using stark lighting shadows and spatial geometry to enhance dialogue. He strips away set pieces to amplify the actor.",
    statementSecondary: "His directorial vision has brought critical acclaim to Aayam's modern black-box experimental initiatives.",
    specializations: ["SET DIRECTION", "MINIMALIST STAGING", "LIGHTING DESIGN", "TEXT ANALYSIS"],
    quote: "A good stage layout doesn't hide the actors behind scenery; it forces them to be fully seen.",
    portfolio: [
      {
        title: "Blue Horizon",
        role: "Director",
        year: 2023,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
        description: "Directed the award-winning experimental monologue series utilizing spotlight staging."
      },
      {
        title: "Antigone: Reborn",
        role: "Lighting Consult",
        year: 2024,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
        description: "Created high-contrast shadow casting for the glass-metropolis themed classical adaptation."
      }
    ]
  },
  "sienna-lopez": {
    id: "sienna-lopez",
    name: "Sienna Lopez",
    role: "Scenic Artist",
    activeSince: 2019,
    tier: "Master Craftsman",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCriANEGDPnpWF8zDsu7mv1efvGVJTz43tLNpo0iKYmMNrXAlqwT8q1YgteTWb_JWv5DDzS00j2JgpuOB65dt5LBR2xvDl_DNzKM9dZ8m6Z5tAmJn0AE2rJmW4OqEZuixxnCVYsnD_CyvaaYxr3x0V4oe-Ind7ffzi9PBm2zQkRlx2v-4XQJe0ouNR5skkT9lf9iA3mya74pOReSx6PmY_Cu5rVySlcZIn8_rw1-AzevATQVpd_zfO1",
    statementTitle: "Painting the Narrative",
    statementBody: "Sienna transforms raw stage platforms into historical environments. Her scenic design philosophy is focused on rich textures, using custom pigment mixes and shadow gradients.",
    statementSecondary: "She leads the stagecraft workshop series at Aayam, training members in classical set design.",
    specializations: ["SCENIC PAINTING", "TEXTURE MURAL", "BACKSTAGE STAGECRAFT", "MODEL MAKING"],
    quote: "The background is not passive; it sets the key of the entire dramatic melody.",
    portfolio: [
      {
        title: "The Glass Orchestration",
        role: "Lead Scenic Painter",
        year: 2024,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAzuMBaCOUMEUXFsi58uX4Sk0JbT72vPkeMf7KwisCYFvuX3Bk8gP1e__uZ8B3G4bYBmYBQjlPftJgABVJuuHuLNh_AIDoUgyAwaSJBouCjuqcQ7quRshTI9hepIQebEmL3pvhyyO6hPnGW2vUGYrayYRqt1rRMyl1OCAIad0kKVUn46ZjCsSI_nQCNnUrcxx_B1Rvmvml5deoCtkUqY61szLjR8uoRvQhIHhNvsCHkKUY4niHP9cI",
        description: "Created the dust-kissed vintage attic texture that served as the primary set."
      },
      {
        title: "Antigone: Reborn",
        role: "Mural Artist",
        year: 2024,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
        description: "Painted a 30-foot monochromatic cityscape backdrop that altered with lighting."
      }
    ]
  },
  "julian-thorne": {
    id: "julian-thorne",
    name: "Julian Thorne",
    role: "Club President & Director",
    activeSince: 2016,
    tier: "Gold Patron",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkD84l9bATTsiV52kbs28_DoHe5f-PFPhB-nnNhuVMs3HgrRA5SWWYHicVET7ryt72YNgtmpyADDdAyM-UziuL4jidI_Uni24HQ1_fqFqT6iaR8ty6GLtE7dKiThcvvU2uOhqsHlIJRuEnhZtJ7Z3-utaWmwkRwcx8efca5RxbgMzf7ztWCU6bYzK3tAIT63YZC8h4zZsX7T8zsxCc1NbgZ4W_b-A_nqNfAWBXbjEPH3d6iKTlACia",
    statementTitle: "Refined Authentic Stagecraft",
    statementBody: "Julian Thorne’s work is characterized by a relentless pursuit of emotional authenticity and architectural staging. He believes the stage is not a mirror to reflect reality, but a prism to refract the truth of the human condition.",
    statementSecondary: "As Club President, Julian focuses on the Aayam gallery philosophy—treating every production as a highly curated work of art.",
    specializations: ["METHOD ACTING", "SHAKESPEAREAN VERSE", "LIGHTING DESIGN", "AVANT-GARDE"],
    quote: "The space surrounding a performance is as vital as the performance itself. Art needs room to breathe.",
    portfolio: [
      {
        title: "Hamlet",
        role: "Director & Creative Lead",
        year: 2023,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwnnZye0KPP3r94Z29TetFlhF1LLpPlPyypffGxSP0iUB2-BTIS0q2m3ETBdeSzVuerW9_cCjxEzdVkopIprrgAJT35wVngEJZiOrASQVkve4PUPJ8kKL3nerDAXbnl5C8_ad-YceCL69xD5eHfyWMi4AHc1LXu2gqeHgj6d2W9eh4AgOfNHkALswL2eDtZxF3vKydFBfCVsFfgugh3aUs8DqTFvgY-BIoPdVDSPUhuycwfjvF-ZnZ",
        description: "A minimalist staging using high-contrast lighting and stark architectural set designs."
      },
      {
        title: "Macbeth",
        role: "Lead Actor (Macbeth)",
        year: 2022,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBubACyxVb-RtxTv5FTf38GrUKNTvw2ymFVu45WsGKenO-yXW7ppBRbpQpwSUJeUmu1jC6BEiXpcPAaNRYyRUGW0p5Scxos4p1wnL5CmO-nFqLSReX9xjG5UWCZsVjRvWq3uJf5FQ2lwWwPg3YLQ9Jjwzo2EWLynDBHgjO2Oi6ySQ_BbeASJjWxQ0czBK3E2whutymwTAMIFFYapve1DhzUrlbmKDE_6zM9zC_DrFLQD8c1BqrHWMYT",
        description: "Immersive representation of Macbeth's fall, exploring physical drama and psychological breakdown."
      },
      {
        title: "The Seagull",
        role: "Director",
        year: 2021,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsJC8Pbq3-tVA2qUFFEs7Zm1gP8bXhxTk-LVkYewm3ZewL6tdA1xkC_KE4R4ALkEE_qvKFwZlVwRebCKRdHyuyX72-Wk7apIQIg6p8td3IwTXReDKdolE6OGy-ladRynLN2O4T3e3k8iMx4JUUUhY4hlzCfDiMiG9eIRHTZPb4hclRlrvm2rEG1fhb3t4k8qJRtMjzuTNtSk5nzkAxeRuV909vwuj2jVkEXAj-PqVjf5ekKdLvxnhE",
        description: "A light, airy production focusing on realism, natural light, and the subtlety of human interaction."
      }
    ]
  }
};

export default function Profile() {
  const { memberId } = useParams<{ memberId: string }>();
  
  // Default to Julian Thorne if no ID is specified or match not found
  const activeId = memberId && profilesData[memberId] ? memberId : "julian-thorne";
  const profile = profilesData[activeId];

  return (
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] py-24">
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

        {/* 3-Column Community Hub Inspired Layout */}
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
                <div className="flex items-center gap-3 text-sm text-[#49473d]">
                  <Calendar className="w-4 h-4 text-[#635f41]" />
                  <span><strong>Active Since:</strong> {profile.activeSince}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#49473d]">
                  <Shield className="w-4 h-4 text-[#635f41]" />
                  <span><strong>Ensemble Tier:</strong> {profile.tier}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6 w-full">
                <button className="flex-1 py-2.5 bg-[#635f41] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#635f41]/90 shadow-md transition-all active:scale-95">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button className="p-2.5 border border-[#cac6b9] rounded-xl hover:bg-white/5 transition-all text-[#49473d]">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Quick Links / Navigation */}
            <div className="hidden lg:flex flex-col bg-white rounded-2xl border border-[#cac6b9]/30 p-4 space-y-1">
              <a href="#statement" className="px-4 py-2.5 rounded-lg text-[#49473d] hover:bg-white/5 text-sm font-semibold flex items-center gap-2 transition-all">
                <Quote className="w-4 h-4 text-[#635f41]" /> Artistic Statement
              </a>
              <a href="#portfolio" className="px-4 py-2.5 rounded-lg text-[#49473d] hover:bg-white/5 text-sm font-semibold flex items-center gap-2 transition-all">
                <BookOpen className="w-4 h-4 text-[#635f41]" /> Curated Portfolio
              </a>
              <Link to="/directory" className="px-4 py-2.5 rounded-lg text-[#635f41] hover:bg-[#635f41]/5 text-sm font-bold flex items-center gap-2 transition-all mt-4 border-t border-[#cac6b9]/20 pt-4">
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
              <article key={index} className="bg-white rounded-2xl overflow-hidden border border-[#cac6b9]/25 shadow-sm hover:shadow-md transition-all duration-300">
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
                    src={item.image}
                  />
                </div>
              </article>
            ))}
          </div>

          {/* Right Sidebar - Artistic Statement & Skills */}
          <aside className="lg:col-span-3 space-y-8">
            {/* Artistic Statement Card */}
            <section className="bg-white p-6 rounded-2xl border border-[#cac6b9]/30 shadow-sm" id="statement">
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
            <section className="bg-white p-6 rounded-2xl border border-[#cac6b9]/30 shadow-sm">
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
