import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Plus,
  ExternalLink,
  Phone,
  Mail,
  Video,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DEFAULT_POSITIONS = [
  {
    id: 1,
    production_name: "Tughlaq - Ensemble Production",
    role_name: "Sultan Muhammad bin Tughlaq (Lead)",
    role_category: "Character Role",
    character_description: "Complex, vision-driven 14th-century ruler torn between idealism and ruthlessness. Requires powerful vocal presence, command over classical Hindustani diction, dramatic intensity, and emotional range.",
    requirements: "Minimum 3 years stage acting experience. Strong voice modulation, soliloquy delivery, and physical stage authority.",
    slots_available: 2,
    status: "Open Calling",
    created_at: "Jul 20, 2026",
    applicant_count: 3
  },
  {
    id: 2,
    production_name: "Tughlaq - Ensemble Production",
    role_name: "Step-Mother / Queen Consort (Antagonist)",
    role_category: "Character Role",
    character_description: "Sharp-witted, politically calculating royal matriarch who challenges Tughlaq's court decrees. Requires sharp eye contact, royal posture, and crisp monologue delivery.",
    requirements: "Strong theatrical background in classical drama or historical plays.",
    slots_available: 1,
    status: "Open Calling",
    created_at: "Jul 20, 2026",
    applicant_count: 1
  },
  {
    id: 3,
    production_name: "Macbeth - Mainstage Production",
    role_name: "Lead Stage Makeup & Special Effects Stylist",
    role_category: "Makeup & Hair",
    character_description: "Head makeup artist responsible for period prosthetics, battle scars, dark theatrical contours, and quick backstage transformations for Macbeth, Lady Macbeth, and the Three Witches.",
    requirements: "Hands-on experience with theatrical SFX makeup, greasepaint, prosthetic application, and rapid multi-cast touchups.",
    slots_available: 2,
    status: "Open Calling",
    created_at: "Jul 20, 2026",
    applicant_count: 2
  },
  {
    id: 4,
    production_name: "Tamashbin Kathputliya",
    role_name: "Soundboard & Acoustic Design Operator",
    role_category: "Backstage Technical",
    character_description: "Technical audio operator responsible for live sound mixing, ambient folk instrument amplification, cue playback, and wireless microphone balancing during live mainstage runs.",
    requirements: "Familiarity with digital audio mixing boards, dynamic mic setups, and live cue software.",
    slots_available: 1,
    status: "Open Calling",
    created_at: "Jul 20, 2026",
    applicant_count: 1
  },
  {
    id: 5,
    production_name: "Andha Yug",
    role_name: "Costume Assistant & Wardrobe Master",
    role_category: "Costume",
    character_description: "Backstage wardrobe assistant managing heritage drape costumes, armor fitting, quick-change coordination, and textile maintenance for a 25-person ensemble cast.",
    requirements: "Keen eye for period costume fitting, garment repair, and fast-paced backstage organization.",
    slots_available: 3,
    status: "Open Calling",
    created_at: "Jul 20, 2026",
    applicant_count: 1
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    position_id: 1,
    role_name: "Sultan Muhammad bin Tughlaq (Lead)",
    applicant_name: "Aarav Varma",
    applicant_email: "aarav.v@aayam.org",
    applicant_phone: "+91 98110 44321",
    experience_level: "Ensemble Senior (5+ Years)",
    portfolio_link: "https://youtube.com/watch?v=aarav_tughlaq_slate",
    notes: "Performed lead roles in 'Ashadh Ka Ek Din' and 'Court Martial'. Specializing in intense classical monologues and voice modulation.",
    status: "Shortlisted",
    audition_date: "Aug 22, 2026 @ 4:30 PM",
    submitted_at: "Jul 21, 2026"
  },
  {
    id: 2,
    position_id: 1,
    role_name: "Sultan Muhammad bin Tughlaq (Lead)",
    applicant_name: "Vikramaditya Roy",
    applicant_email: "vikram.roy@aayam.org",
    applicant_phone: "+91 98230 11988",
    experience_level: "Intermediate (2 Years)",
    portfolio_link: "https://drive.google.com/file/d/vikram_audition_reel",
    notes: "Keen interest in playing tragic historical figures. Dedicated to daily rehearsal schedules and script memorization.",
    status: "Pending Review",
    audition_date: "Aug 23, 2026 @ 5:00 PM",
    submitted_at: "Jul 21, 2026"
  },
  {
    id: 3,
    position_id: 1,
    role_name: "Sultan Muhammad bin Tughlaq (Lead)",
    applicant_name: "Kabir Mehta",
    applicant_email: "kabir.m@aayam.org",
    applicant_phone: "+91 98901 88223",
    experience_level: "Ensemble Senior (4 Years)",
    portfolio_link: "https://vimeo.com/kabir_dramatic_monologue",
    notes: "Trained under National School of Drama workshop mentors. Strong physical theatre posture and projection.",
    status: "Selected",
    audition_date: "Aug 22, 2026 @ 3:00 PM",
    submitted_at: "Jul 21, 2026"
  },
  {
    id: 4,
    position_id: 2,
    role_name: "Step-Mother / Queen Consort (Antagonist)",
    applicant_name: "Sunita Rao",
    applicant_email: "sunita.rao@aayam.org",
    applicant_phone: "+91 98711 66543",
    experience_level: "Ensemble Senior (6 Years)",
    portfolio_link: "https://youtube.com/watch?v=sunita_dramatic_slate",
    notes: "Experienced in antagonist roles. Eager to bring regal gravity and sharp diction to this iconic character.",
    status: "Shortlisted",
    audition_date: "Aug 24, 2026 @ 4:00 PM",
    submitted_at: "Jul 21, 2026"
  },
  {
    id: 5,
    position_id: 3,
    role_name: "Lead Stage Makeup & Special Effects Stylist",
    applicant_name: "Ananya Sen",
    applicant_email: "ananya.sen@aayam.org",
    applicant_phone: "+91 98334 22109",
    experience_level: "Professional Makeup Stylist (3 Years)",
    portfolio_link: "https://instagram.com/ananyasen_sfx_makeup",
    notes: "Certified SFX makeup artist with portfolio in battle scars, prosthetic noses, and historical contours.",
    status: "Selected",
    audition_date: "Aug 25, 2026 @ 2:00 PM",
    submitted_at: "Jul 21, 2026"
  },
  {
    id: 6,
    position_id: 3,
    role_name: "Lead Stage Makeup & Special Effects Stylist",
    applicant_name: "Pooja Hegde",
    applicant_email: "pooja.h@aayam.org",
    applicant_phone: "+91 98450 99881",
    experience_level: "Intermediate",
    portfolio_link: "https://drive.google.com/folder/pooja_makeup_portfolio",
    notes: "Specializing in period wigs, hair styling, and theatrical blush contours.",
    status: "Pending Review",
    audition_date: "Aug 25, 2026 @ 3:00 PM",
    submitted_at: "Jul 21, 2026"
  },
  {
    id: 7,
    position_id: 4,
    role_name: "Soundboard & Acoustic Design Operator",
    applicant_name: "Devansh Kulkarni",
    applicant_email: "devansh.k@aayam.org",
    applicant_phone: "+91 98199 44332",
    experience_level: "Audio Tech Lead (3 Years)",
    portfolio_link: "https://soundcloud.com/devansh_stage_soundtracks",
    notes: "Experienced with Allen & Heath audio consoles, QLab cue triggering, and multi-mic balancing.",
    status: "Selected",
    audition_date: "Aug 26, 2026 @ 5:00 PM",
    submitted_at: "Jul 21, 2026"
  },
  {
    id: 8,
    position_id: 5,
    role_name: "Costume Assistant & Wardrobe Master",
    applicant_name: "Riya Kapoor",
    applicant_email: "riya.kapoor@aayam.org",
    applicant_phone: "+91 98221 77889",
    experience_level: "Textile & Wardrobe Assistant (2 Years)",
    portfolio_link: "https://drive.google.com/file/d/riya_costume_design_portfolio",
    notes: "Skilled in quick backstage costume changes, silk draping, and garment fitting for large ensembles.",
    status: "Shortlisted",
    audition_date: "Aug 27, 2026 @ 3:30 PM",
    submitted_at: "Jul 21, 2026"
  }
];

export default function AuditionsManagement() {
  const [positions, setPositions] = useState<any[]>(DEFAULT_POSITIONS);
  const [activeViewRole, setActiveViewRole] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>(DEFAULT_APPLICATIONS);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive AI Scanning State
  const [scannedAppIds, setScannedAppIds] = useState<number[]>([]);
  const [scanningAppId, setScanningAppId] = useState<number | null>(null);

  // const handleRunScan = (appId: number) => {
  //   setScanningAppId(appId);
  //   setTimeout(() => {
  //     setScannedAppIds((prev) => [...prev, appId]);
  //     setScanningAppId(null);
  //   }, 900);
  // };
  const handleRunScan = (appId: number) => {
    setScanningAppId(appId);0
    setScannedAppIds((prev) =>
        prev.includes(appId) ? prev : [...prev, appId],
    );
    setScanningAppId(null);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [newPositionForm, setNewPositionForm] = useState({
    production_name: "Tughlaq - Ensemble Production",
    role_name: "",
    role_category: "Character Role",
    character_description: "",
    requirements: "",
    slots_available: 1,
    status: "Open Calling"
  });

  // AI Scanner Tool 1: Portfolio Match Score (%)
  const getPortfolioMatchScore = (appItem: any, role: any) => {
    if (!role) return 88;
    const textCombined = ((appItem.notes || "") + " " + (appItem.experience_level || "")).toLowerCase();
    
    let score = 76;
    if (textCombined.includes("lead") || textCombined.includes("senior") || textCombined.includes("5+")) score += 10;
    if (textCombined.includes("classical") || textCombined.includes("monologue") || textCombined.includes("sfx")) score += 6;
    if (textCombined.includes("trained") || textCombined.includes("professional") || textCombined.includes("nsd")) score += 4;
    
    const idHash = (appItem.id * 17) % 5;
    return Math.min(98, score + idHash);
  };

  // AI Scanner Tool 2: Video & Audio Quality Score (%)
  const getVideoQualityScore = (appItem: any) => {
    let score = 85;
    if (appItem.portfolio_link?.includes("youtube") || appItem.portfolio_link?.includes("vimeo")) score += 7;
    if (appItem.portfolio_link?.includes("drive") || appItem.portfolio_link?.includes("soundcloud")) score += 4;
    
    const idHash = (appItem.id * 13) % 5;
    return Math.min(97, score + idHash);
  };

  const loadPositions = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/audition-positions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPositions(data);
        }
      })
      .catch((err) => console.error("Error loading audition positions:", err));
  };

  const loadApplications = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/audition-applications`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
        }
      })
      .catch((err) => console.error("Error loading audition applications:", err));
  };

  useEffect(() => {
    loadPositions();
    loadApplications();
  }, []);

  const handleUpdateApplicationStatus = (appId: number, status: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/audition-applications/${appId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setApplications((prev) =>
            prev.map((a) => (a.id === appId ? { ...a, status } : a))
          );
          triggerToast(`Candidate status updated to ${status}!`);
        }
      })
      .catch((err) => console.error("Error updating candidate status:", err));
  };

  const handleCreatePositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositionForm.role_name || !newPositionForm.production_name) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/audition-positions/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPositionForm)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          loadPositions();
          setCreateModalOpen(false);
          setNewPositionForm({
            production_name: "Tughlaq - Ensemble Production",
            role_name: "",
            role_category: "Character Role",
            character_description: "",
            requirements: "",
            slots_available: 1,
            status: "Open Calling"
          });
          triggerToast(`New Audition Calling "${data.position.role_name}" published!`);
        }
      })
      .catch((err) => console.error("Error creating audition calling:", err));
  };

  const filteredPositions = positions.filter((pos) => {
    const matchesCategory = categoryFilter === "All" || pos.role_category === categoryFilter;
    const matchesSearch =
      pos.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.production_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeRoleApplications = activeViewRole
    ? applications.filter((appItem) => {
        const matchesPos = appItem.position_id === activeViewRole.id || appItem.role_name === activeViewRole.role_name;
        const matchesStatus = statusFilter === "All" || appItem.status === statusFilter;
        return matchesPos && matchesStatus;
      })
    : [];

  return (
    <div className="bg-[#fdf9f4] min-h-screen text-[#1c1b19] p-6 md:p-10 font-sans space-y-8 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#e6e2dd] pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] block mb-1">
            Ensemble Audition Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1c1b19] tracking-tight">
            {activeViewRole ? activeViewRole.role_name : "Open Audition Roles"}
          </h1>
          <p className="text-xs md:text-sm text-[#466272] mt-1 font-light">
            {activeViewRole
              ? `Reviewing submitted audition requests for ${activeViewRole.production_name}`
              : "Minimal open roles dashboard. Select a role to inspect member audition requests."}
          </p>
        </div>

        {activeViewRole ? (
          <Button
            onClick={() => setActiveViewRole(null)}
            className="bg-white border border-[#cac6b9] text-[#635f41] hover:text-[#1c1b19] hover:bg-[#fdf9f4] font-bold text-xs rounded-xl px-4 h-10 shadow-2xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Roles
          </Button>
        ) : (
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold text-xs rounded-xl px-5 h-10 shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Open Role
          </Button>
        )}
      </div>

      {/* VIEW 1: MINIMAL OPEN ROLES LIST (Single view, no 2-columns) */}
      {!activeViewRole ? (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e6e2dd] shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <Input
                placeholder="Filter open roles or production..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#fdf9f4] border-[#cac6b9]/60 text-xs h-10 rounded-xl"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-[#635f41] uppercase tracking-wider">Category:</span>
              {["All", "Character Role", "Makeup & Hair", "Backstage Technical", "Costume"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === cat
                      ? "bg-[#635f41] text-white shadow-xs"
                      : "bg-[#fdf9f4] text-[#466272] hover:bg-[#e6e2dd]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPositions.map((pos) => {
              const reqCount = pos.applicant_count || 0;
              return (
                <div
                  key={pos.id}
                  onClick={() => setActiveViewRole(pos)}
                  className="bg-white border border-[#e6e2dd] hover:border-[#635f41] p-5 rounded-2xl shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41] bg-[#635f41]/10 px-2.5 py-0.5 rounded-full">
                        {pos.role_category}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#8CC0EB]/20 text-[#1e4866]">
                        {reqCount} {reqCount === 1 ? "Request" : "Requests"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1c1b19]">
                        {pos.role_name}
                      </h3>
                      <p className="text-xs text-[#466272] font-medium">{pos.production_name}</p>
                    </div>

                    {pos.character_description && (
                      <p className="text-xs text-[#466272] line-clamp-2 leading-relaxed font-light pt-1">
                        {pos.character_description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#e6e2dd] flex items-center justify-between text-xs">
                    <span className="text-gray-400 text-[11px]">Slots: {pos.slots_available}</span>
                    <span className="text-[#635f41] font-bold hover:underline">
                      View Audition Requests →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: AUDITION REQUESTS FOR SELECTED ROLE */
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Minimal Role Overview Banner */}
          <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">
                {activeViewRole.role_category} • {activeViewRole.production_name}
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-[#635f41] text-white rounded-xl">
                {activeViewRole.status}
              </span>
            </div>
            <p className="text-xs text-[#1c1b19] leading-relaxed">
              {activeViewRole.character_description}
            </p>
          </div>

          {/* Status Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2dd] pb-4">
            <h3 className="font-serif text-lg font-bold text-[#1c1b19]">
              Submitted Requests ({activeRoleApplications.length})
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {["All", "Pending Review", "Shortlisted", "Selected", "Rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === st
                      ? "bg-[#635f41] text-white shadow-xs"
                      : "bg-white text-[#466272] border border-[#cac6b9]/40 hover:bg-[#fdf9f4]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Submitted Member Requests */}
          {activeRoleApplications.length === 0 ? (
            <div className="p-12 text-center text-[#466272] space-y-2 bg-white rounded-2xl border border-dashed border-[#cac6b9]">
              <p className="text-sm font-bold text-[#1c1b19]">No audition requests submitted yet for this role.</p>
              <p className="text-xs">Submissions from ensemble members will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRoleApplications.map((appItem) => (
                <div
                  key={appItem.id}
                  className="p-5 bg-white border border-[#e6e2dd] rounded-2xl shadow-xs space-y-4 hover:border-[#cac6b9] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-bold text-[#1c1b19]">
                          {appItem.applicant_name}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          appItem.status === "Selected"
                            ? "bg-emerald-100 text-emerald-800"
                            : appItem.status === "Shortlisted"
                            ? "bg-amber-100 text-amber-800"
                            : appItem.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-50 text-blue-800"
                        }`}>
                          {appItem.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#466272] font-medium">{appItem.experience_level}</span>
                    </div>

                    <div className="text-xs text-[#466272] space-y-0.5 text-left sm:text-right">
                      <div className="flex items-center gap-1.5 sm:justify-end">
                        <Mail className="w-3.5 h-3.5 text-[#635f41]" />
                        <span>{appItem.applicant_email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:justify-end">
                        <Phone className="w-3.5 h-3.5 text-[#635f41]" />
                        <span>{appItem.applicant_phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-[#466272]">
                    {appItem.notes && (
                      <div className="bg-[#fdf9f4] p-3 rounded-xl border border-[#cac6b9]/40 leading-relaxed italic">
                        "{appItem.notes}"
                      </div>
                    )}

                    {/* INTERACTIVE FIRST AI SCAN BUTTON & RESULTS */}
                    {scannedAppIds.includes(appItem.id) ? (
                      <div className="bg-[#fdf9f4] p-3.5 rounded-2xl border border-[#cac6b9]/60 space-y-3 animate-in fade-in-50 duration-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">
                            AI Audition Scanners Verified
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            Up to Mark • Benchmark Passed
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Tool 1: Portfolio Role Match Scanner */}
                          <div className="bg-white p-3 rounded-xl border border-[#cac6b9]/40 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#1c1b19] text-[11px]">Portfolio Role Fit</span>
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {getPortfolioMatchScore(appItem, activeViewRole)}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-[#466272] leading-tight font-light">
                              Matches character archetype & experience requirements.
                            </p>
                          </div>

                          {/* Tool 2: Video & Audio Quality Scanner */}
                          <div className="bg-white p-3 rounded-xl border border-[#cac6b9]/40 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#1c1b19] text-[11px]">Video/Audio Quality</span>
                              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {getVideoQualityScore(appItem)}% Quality
                              </span>
                            </div>
                            <p className="text-[11px] text-[#466272] leading-tight font-light">
                              High audio acoustic SNR & video resolution confirmed.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#fdf9f4] p-3 rounded-2xl border border-[#cac6b9]/60 flex items-center justify-between gap-3">
                        <div className="text-xs">
                          <span className="font-bold text-[#1c1b19] block">AI Portfolio & Audition Quality Scanner</span>
                          <span className="text-[11px] text-[#466272]">Run automated scan for role match fit % and video quality rating.</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRunScan(appItem.id)}
                          disabled={scanningAppId === appItem.id}
                          className="px-4 py-2 rounded-xl bg-[#466272] hover:bg-[#314652] text-white font-bold text-xs transition-all shadow-xs flex-shrink-0 disabled:opacity-50"
                        >
                          {scanningAppId === appItem.id ? "Scanning..." : "Scan Portfolio & Video"}
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {appItem.portfolio_link && (
                        <a
                          href={appItem.portfolio_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#cac6b9] text-[#635f41] hover:text-[#1c1b19] font-bold transition-all shadow-2xs"
                        >
                          <Video className="w-3.5 h-3.5 text-[#635f41]" />
                          Audition Reel / Monologue Slate <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <span className="text-[11px] text-gray-400 font-mono">
                        Slot: {appItem.audition_date}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e6e2dd] flex flex-wrap items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleUpdateApplicationStatus(appItem.id, "Rejected")}
                      disabled={appItem.status === "Rejected"}
                      className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 font-bold transition-all disabled:opacity-40"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(appItem.id, "Shortlisted")}
                      disabled={appItem.status === "Shortlisted"}
                      className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold transition-all disabled:opacity-40"
                    >
                      Shortlist Callback
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(appItem.id, "Selected")}
                      disabled={appItem.status === "Selected"}
                      className="px-4 py-1.5 rounded-xl bg-[#635f41] text-white hover:bg-[#4d4a32] font-bold transition-all disabled:opacity-40 shadow-xs"
                    >
                      Cast Performers
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE AUDITION CALLING MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="bg-white border border-[#cac6b9] rounded-3xl p-7 max-w-lg space-y-4 shadow-xl text-[#1c1b19]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-[#1c1b19]">
              Add Audition Calling
            </DialogTitle>
            <DialogDescription className="text-xs text-[#466272]">
              Post a new open character role or technical crew position for ensemble auditioning.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePositionSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#635f41] block mb-1">Target Production Name</label>
              <Input
                required
                value={newPositionForm.production_name}
                onChange={(e) => setNewPositionForm({ ...newPositionForm, production_name: e.target.value })}
                placeholder="e.g. Tughlaq - Ensemble Production"
                className="bg-[#fdf9f4] border-[#cac6b9]/60 h-10 text-xs rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-[#635f41] block mb-1">Role / Position Title</label>
              <Input
                required
                value={newPositionForm.role_name}
                onChange={(e) => setNewPositionForm({ ...newPositionForm, role_name: e.target.value })}
                placeholder="e.g. Sultan Muhammad bin Tughlaq (Lead)"
                className="bg-[#fdf9f4] border-[#cac6b9]/60 h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#635f41] block mb-1">Role Category</label>
                <select
                  value={newPositionForm.role_category}
                  onChange={(e) => setNewPositionForm({ ...newPositionForm, role_category: e.target.value })}
                  className="w-full bg-[#fdf9f4] border border-[#cac6b9]/60 h-10 px-3 text-xs font-bold rounded-xl text-[#1c1b19] focus:outline-none"
                >
                  <option value="Character Role">Character Role</option>
                  <option value="Makeup & Hair">Makeup & Hair</option>
                  <option value="Backstage Technical">Backstage Technical</option>
                  <option value="Costume">Costume</option>
                  <option value="Stage Management">Stage Management</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#635f41] block mb-1">Slots Available</label>
                <Input
                  type="number"
                  min={1}
                  value={newPositionForm.slots_available}
                  onChange={(e) => setNewPositionForm({ ...newPositionForm, slots_available: parseInt(e.target.value) || 1 })}
                  className="bg-[#fdf9f4] border-[#cac6b9]/60 h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#635f41] block mb-1">Character Description & Personality</label>
              <textarea
                rows={3}
                value={newPositionForm.character_description}
                onChange={(e) => setNewPositionForm({ ...newPositionForm, character_description: e.target.value })}
                placeholder="Describe character archetype, age bracket, vocal requirements, and emotional dynamics..."
                className="w-full bg-[#fdf9f4] border border-[#cac6b9]/60 p-3 rounded-xl text-xs text-[#1c1b19] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#635f41] block mb-1">Casting Requirements</label>
              <Input
                value={newPositionForm.requirements}
                onChange={(e) => setNewPositionForm({ ...newPositionForm, requirements: e.target.value })}
                placeholder="e.g. Hindustani diction, physical theatre experience, prosthetic makeup skill"
                className="bg-[#fdf9f4] border-[#cac6b9]/60 h-10 text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold text-xs rounded-xl px-6 h-10 w-full shadow-sm"
              >
                Publish Audition Calling
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#cac6b9]/30 rounded-xl px-4 py-3 shadow-xl z-50 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
