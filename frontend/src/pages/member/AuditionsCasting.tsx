// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { 
  Search, 
  FileText, 
  Video, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  Trash2, 
  CheckCircle2, 
  Mic,
  Calendar,
  Layers,
  Sparkles,
  Award,
  X,
  PlayCircle,
  SlidersHorizontal,
  RotateCcw
} from "lucide-react";

interface OpenPosition {
  id: string;
  play_id?: number;
  title: string;
  production_name?: string;
  role_name?: string;
  role_category?: string;
  category?: string;
  character_description?: string;
  description: string;
  requirements: string;
  deadline: string;
  status?: string;
  slots_available?: number;
  applicant_count?: number;
}

interface Application {
  id: string;
  positionId?: string;
  position_id?: number;
  positionTitle?: string;
  role_name?: string;
  category?: string;
  submittedAt?: string;
  submitted_at?: string;
  status: string;
  audition_date?: string;
  notes?: string;
  portfolio_link?: string;
  files?: string[];
}

export default function AuditionsCasting() {
  const contextData = useOutletContext<{ activeUser: any }>() || {};
  const activeUser = contextData.activeUser || JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduction, setSelectedProduction] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [applyOpen, setApplyOpen] = useState(false);
  const [activePosition, setActivePosition] = useState<OpenPosition | null>(null);
  
  const [applicantName, setApplicantName] = useState(activeUser?.name || "");
  const [applicantEmail, setApplicantEmail] = useState(activeUser?.email || "");
  const [applicantPhone, setApplicantPhone] = useState(activeUser?.phone || "+91 98110 44321");
  const [experienceLevel, setExperienceLevel] = useState("Ensemble Senior (3+ Years)");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (activeUser) {
      if (!applicantName) setApplicantName(activeUser.name || "");
      if (!applicantEmail) setApplicantEmail(activeUser.email || "");
      if (!applicantPhone && activeUser.phone) setApplicantPhone(activeUser.phone);
    }
  }, [activeUser]);

  const fetchOpenPositions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/audition-positions`);
      if (res.ok) {
        const positions = await res.json();
        if (Array.isArray(positions)) {
          setOpenPositions(positions);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAuditions = async () => {
    if (!activeUser?.email) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/my-auditions?email=${encodeURIComponent(activeUser.email)}`);
      if (res.ok) {
        const apps = await res.json();
        setApplications(apps);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOpenPositions();
    fetchMyAuditions();
  }, [activeUser]);

  const handleApplyClick = (pos: OpenPosition) => {
    setActivePosition(pos);
    setPortfolioLink("");
    setCoverNote("");
    setSuccessMsg("");
    setApplyOpen(true);
  };

  const handleWithdrawApplication = async (appId: string | number, roleTitle: string) => {
    if (!confirm(`Are you sure you want to withdraw your casting application for "${roleTitle}"?`)) return;
    setApplications(prev => prev.filter(app => String(app.id) !== String(appId)));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePosition) return;
    setSubmittingApp(true);

    const payload = {
      position_id: parseInt(activePosition.id) || activePosition.play_id || 1,
      role_name: activePosition.role_name || activePosition.title,
      applicant_name: applicantName || activeUser?.name || "Ensemble Performer",
      applicant_email: applicantEmail || activeUser?.email || "",
      applicant_phone: applicantPhone || "+91 98110 44321",
      experience_level: experienceLevel,
      portfolio_link: portfolioLink || "https://youtube.com/watch?v=sample_slate",
      notes: coverNote,
      status: "Pending Review"
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/audition/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg(`Your application for "${payload.role_name}" has been recorded for directorial review!`);
        setTimeout(() => {
          setApplyOpen(false);
          setSuccessMsg("");
          setActivePosition(null);
          fetchMyAuditions();
          fetchOpenPositions();
        }, 2000);
      } else {
        alert("Submission failed. Please check details and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server. Please try again.");
    } finally {
      setSubmittingApp(false);
    }
  };

  const hasActiveFilters = selectedProduction !== "All" || selectedCategory !== "All";
  const activeFilterCount = (selectedProduction !== "All" ? 1 : 0) + (selectedCategory !== "All" ? 1 : 0);

  const resetFilters = () => {
    setSelectedProduction("All");
    setSelectedCategory("All");
    setSearchTerm("");
  };

  const filteredPositions = openPositions.filter((pos) => {
    const titleStr = (pos.title || pos.role_name || "").toLowerCase();
    const prodStr = (pos.production_name || "").toLowerCase();
    const descStr = (pos.description || pos.character_description || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = titleStr.includes(query) || prodStr.includes(query) || descStr.includes(query);
    const matchesProd = selectedProduction === "All" || (pos.production_name && pos.production_name.toLowerCase().includes(selectedProduction.toLowerCase()));
    
    const cat = pos.category || pos.role_category || "";
    const matchesCat = selectedCategory === "All" || cat.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesProd && matchesCat;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8C5A54] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2]">
              Talent Acquisition & Casting Callboard
            </span>
            <span className="font-mono text-xs text-[#8C5A54]">• Autumn Season 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2A1816] tracking-tight font-normal">
            Auditions & Casting
          </h1>
          <p className="text-xs sm:text-sm text-[#5C3B37] leading-relaxed max-w-3xl font-light">
            Audition for character roles, assistant directorial appointments, light console leads, SFX makeup stylists, and soundscape artists for Aayam's upcoming Indian productions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/member-plays"
            className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#8C241E]" />
            <span>View Productions</span>
          </Link>
          <Link
            to="/member-scripts"
            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 transition-all border border-[#A6352F]"
          >
            <FileText className="w-3.5 h-3.5 text-[#FFD0CC]" />
            <span>Review Scripts</span>
          </Link>
        </div>
      </div>

      {/* Active Casting Applications Section */}
      {applications.length > 0 && (
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-4">
            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-serif text-[#2A1816] tracking-tight font-normal">
                My Audition Applications
              </h2>
              <p className="text-xs text-[#6E4742] font-light">
                Directorial review status, audition slot times, and candidate updates
              </p>
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider bg-[#EEDBD5] text-[#8C241E] px-3.5 py-1 rounded-full border border-[#D5AAA2]">
              {applications.length} Active Calling{applications.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => {
              const roleTitle = app.role_name || app.positionTitle || "Production Role";
              const isShortlisted = app.status === "Shortlisted" || app.status === "Selected";

              return (
                <div
                  key={app.id}
                  className="bg-[#F5EAE6] border border-[#DEBEB7] rounded-2xl p-5 hover:border-[#B32D25]/50 transition-all flex flex-col justify-between space-y-4 shadow-xs relative group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54]">
                        {app.category || "Audition Role"}
                      </span>
                      <span
                        className={`font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isShortlisted
                            ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                            : app.status === "Pending Review"
                            ? "bg-amber-700/15 text-amber-950 border-amber-700/30"
                            : "bg-[#EEDBD5] text-[#5C3B37] border-[#D5AAA2]"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif text-[#2A1816] tracking-tight font-normal leading-snug">
                      {roleTitle}
                    </h3>

                    {app.audition_date && (
                      <p className="text-xs font-mono text-[#8C241E] font-medium flex items-center gap-1.5 pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Audition Slot: {app.audition_date}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#DEBEB7]/60 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#8C5A54]">
                      {app.submitted_at ? `Date: ${app.submitted_at}` : "Under Review"}
                    </span>
                    <button
                      onClick={() => handleWithdrawApplication(app.id, roleTitle)}
                      className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-700 hover:text-rose-900 flex items-center gap-1 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Withdraw
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TONED-DOWN EDITORIAL FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-2.5 sm:p-3 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C5A54]" />
          <input
            type="text"
            placeholder="Search roles, characters, departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-transparent text-xs font-sans text-[#2A1816] placeholder:text-[#8C5A54]/70 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C5A54] hover:text-[#2A1816]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active filter pills & Filter Options Popup button */}
        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-[#DCBAB2]/60 pt-2 sm:pt-0">
          {hasActiveFilters && (
            <div className="hidden md:flex items-center gap-1.5">
              {selectedProduction !== "All" && (
                <span className="inline-flex items-center gap-1 bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] px-2.5 py-1 rounded-full text-[10px] font-mono font-medium">
                  <span>{selectedProduction}</span>
                  <button onClick={() => setSelectedProduction("All")} className="hover:text-[#2A1816]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] px-2.5 py-1 rounded-full text-[10px] font-mono font-medium">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory("All")} className="hover:text-[#2A1816]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[10px] font-mono text-[#8C5A54] hover:text-[#8C241E] underline px-1"
              >
                Reset
              </button>
            </div>
          )}

          <button
            onClick={() => setFilterModalOpen(true)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
              hasActiveFilters
                ? "bg-[#8C241E] text-[#FDF8F7] border-[#A6352F] shadow-xs"
                : "bg-[#F5EAE6] text-[#5C3B37] hover:bg-[#EEDBD5] border-[#D5AAA2]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Options</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#FAF2EE] text-[#8C241E] w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* FILTER OPTIONS POPUP WINDOW */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCBAB2]/70 pb-3 pr-8">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                  Callboard Preferences
                </span>
                <h3 className="font-serif text-2xl text-[#2A1816] font-normal">
                  Filter Audition Roles
                </h3>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 text-xs font-sans">
              {/* Option 1: Production Filter */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                  Production Premiere
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: "All", label: "All Upcoming Indian Plays" },
                    { id: "Hayavadana", label: "Hayavadana (Girish Karnad)" },
                    { id: "Ashadh Ka Ek Din", label: "Ashadh Ka Ek Din (Mohan Rakesh)" },
                    { id: "Charandas Chor", label: "Charandas Chor (Habib Tanvir)" }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedProduction(opt.id)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        selectedProduction === opt.id
                          ? "bg-[#8C241E] text-[#FDF8F7] font-bold shadow-xs"
                          : "bg-[#FAF2EE] text-[#5C3B37] hover:bg-[#EEDBD5] border border-[#DCBAB2]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedProduction === opt.id && <Check className="w-3.5 h-3.5 text-[#FDF8F7]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Role Department */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                  Department & Role Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { id: "All", label: "All Roles" },
                    { id: "Performer", label: "Actor / Cast" },
                    { id: "Technical Crew", label: "Tech & Light Man" },
                    { id: "Creative Designer", label: "Makeup & SFX" },
                    { id: "Director", label: "Direction & Stage" }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedCategory(opt.id)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        selectedCategory === opt.id
                          ? "bg-[#8C241E] text-[#FDF8F7] font-bold shadow-xs"
                          : "bg-[#FAF2EE] text-[#5C3B37] hover:bg-[#EEDBD5] border border-[#DCBAB2]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedCategory === opt.id && <Check className="w-3 h-3 text-[#FDF8F7]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCBAB2]/70 flex items-center justify-between">
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-mono text-[#8C5A54] hover:text-[#8C241E] flex items-center gap-1.5 font-bold uppercase tracking-wider"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer border border-[#A6352F]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALM EDITORIAL OPEN POSITIONS GRID */}
      {loading ? (
        <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm">
          Loading audition callboard...
        </div>
      ) : filteredPositions.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm space-y-3">
          <p>No audition positions match the selected filters.</p>
          <button
            onClick={resetFilters}
            className="text-xs font-mono text-[#8C241E] font-bold uppercase tracking-wider underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPositions.map((pos, idx) => {
            const hasApplied = applications.some(a => String(a.position_id) === String(pos.id) || a.role_name === (pos.role_name || pos.title));
            
            const prodImg = (pos.production_name || "").toLowerCase().includes("hayavadana")
              ? "/aayam_assets/hayavadana.jpg"
              : (pos.production_name || "").toLowerCase().includes("ashadh")
              ? "/aayam_assets/ashadh_ka_ek_din.jpg"
              : (pos.production_name || "").toLowerCase().includes("charandas")
              ? "/aayam_assets/charandas_chor.jpg"
              : "/aayam_assets/samatvam_user_1.jpg";

            return (
              <div
                key={pos.id || idx}
                className="bg-[#FAF2EE] text-[#2A1816] rounded-[2rem] border border-[#DCBAB2] overflow-hidden shadow-md hover:border-[#B32D25]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Card Image Header */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#E8D6CF]">
                    <img
                      src={prodImg}
                      alt={pos.role_name || pos.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A1816]/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider bg-[#FAF2EE]/90 text-[#8C241E] border border-[#D5AAA2] shadow-sm backdrop-blur-md">
                        {pos.slots_available ? `${pos.slots_available} Slot${pos.slots_available > 1 ? "s" : ""}` : "Open"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-5 text-xs font-mono font-bold text-[#FAF2EE] drop-shadow-sm">
                      {pos.production_name || "Upcoming Premiere"}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#8C241E]">
                        {pos.role_category || pos.category || "Role Calling"}
                      </span>
                      <h3 className="font-serif text-2xl font-normal text-[#2A1816] group-hover:text-[#8C241E] transition-colors leading-snug">
                        {pos.role_name || pos.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#5C3B37] leading-relaxed font-light line-clamp-2">
                      {pos.character_description || pos.description}
                    </p>

                    <div className="bg-[#F5EAE6] p-3.5 rounded-xl border border-[#DEBEB7] text-xs text-[#5C3B37] space-y-1">
                      <div className="truncate"><strong>Department:</strong> {pos.role_category || pos.category}</div>
                      <div className="truncate text-[#6E4742]"><strong>Requires:</strong> {pos.requirements || "Audition slate & role readiness"}</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 sm:p-7 pt-0 flex items-center justify-between border-t border-[#DCBAB2]/60 text-xs font-mono pt-4">
                  <span className="text-[10px] font-mono text-[#8C5A54]">
                    Due: {pos.deadline || "Sep 25, 2026"}
                  </span>

                  {hasApplied ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-700/15 text-emerald-950 border border-emerald-700/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(pos)}
                      className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 transition-all cursor-pointer border border-[#A6352F]"
                    >
                      <span>Apply</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AUDITION APPLICATION MODAL */}
      {applyOpen && activePosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setApplyOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            <div className="space-y-6">
              <div className="space-y-1.5 pr-8">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                  {activePosition.production_name || "Upcoming Indian Premiere"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                  Apply: {activePosition.role_name || activePosition.title}
                </h2>
                <p className="text-xs text-[#5C3B37] font-light leading-relaxed">
                  Submit your candidate audition slate, portfolio link, or technical experience summary.
                </p>
              </div>

              {successMsg ? (
                <div className="p-5 rounded-2xl bg-emerald-700/15 border border-emerald-700/30 text-emerald-950 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold font-mono uppercase tracking-wider">Application Submitted</p>
                    <p>{successMsg}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={e => setApplicantName(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={e => setApplicantEmail(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={e => setApplicantPhone(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Experience Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={e => setExperienceLevel(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                      >
                        <option value="Ensemble Member (1-2 Years)">Ensemble Member (1-2 Years)</option>
                        <option value="Ensemble Senior (3-5 Years)">Ensemble Senior (3-5 Years)</option>
                        <option value="Lead Theatrical Artist (5+ Years)">Lead Theatrical Artist (5+ Years)</option>
                        <option value="Technical Crew Specialist">Technical Crew Specialist</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                      Audition Video / Portfolio Reel Link
                    </label>
                    <input
                      type="url"
                      value={portfolioLink}
                      onChange={e => setPortfolioLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                      Candidate Statement / Role Notes
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={coverNote}
                      onChange={e => setCoverNote(e.target.value)}
                      placeholder="Mention your classical dialogue preparation, voice modulation training, or lighting console familiarity..."
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl p-3 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyOpen(false)}
                      className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingApp}
                      className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F] disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{submittingApp ? "Submitting..." : "Submit Audition"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


