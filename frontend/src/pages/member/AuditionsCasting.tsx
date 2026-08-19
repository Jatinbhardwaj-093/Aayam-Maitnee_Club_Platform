import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, FileText, Video, Upload, ChevronRight, ListChecks, Check, AlertCircle, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface OpenPosition {
  id: string;
  play_id: number;
  title: string;
  category: "Performer" | "Technical Crew" | "Creative Designer" | "Director";
  description: string;
  requirements: string;
  deadline: string;
  status?: string;
  slots_available?: number;
}

interface Application {
  id: string;
  positionId: string;
  positionTitle: string;
  category: string;
  submittedAt: string;
  status: "Applied" | "Reviewing" | "Interview/Audition" | "Casting Decision";
  notes?: string;
  files: string[];
}

export default function AuditionsCasting() {
  const contextData = useOutletContext<{ activeUser: any }>() || {};
  const activeUser = contextData.activeUser || JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Performer" | "Technical Crew" | "Creative Designer" | "Director">("All");
  
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [applyOpen, setApplyOpen] = useState(false);
  const [activePosition, setActivePosition] = useState<OpenPosition | null>(null);
  
  const [applicantName, setApplicantName] = useState(activeUser?.name || "");
  const [applicantEmail, setApplicantEmail] = useState(activeUser?.email || "");
  const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [coverNote, setCoverNote] = useState("");

  useEffect(() => {
    if (activeUser) {
      setApplicantName(activeUser.name || "");
      setApplicantEmail(activeUser.email || "");
    }
  }, [activeUser]);

  const fetchOpenPositions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/audition-positions`);
      if (res.ok) {
        const positions = await res.json();
        if (Array.isArray(positions) && positions.length > 0) {
          setOpenPositions(positions);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback Positions synchronized with Real Aayam Productions
    setOpenPositions([
      {
        id: "1",
        play_id: 1,
        title: "Karn Ki Yachika - Lead Performer (Karn)",
        category: "Performer",
        description: "Monumental tragic protagonist navigating moral dilemma, honor, and destiny. High-intensity classical Hindi monologue & verse delivery required.",
        requirements: "Audition monologue video clip (2 mins) & theatrical bio",
        deadline: "Sep 25, 2026"
      },
      {
        id: "2",
        play_id: 2,
        title: "Tamashbin Kathputliya - Dholak & Courtyard Chorus Lead",
        category: "Performer",
        description: "High-energy street drama performer skilled in vocal projection, folk rhythm synchronization, and crowd interaction.",
        requirements: "Live percussion video or street drama reel",
        deadline: "Sep 22, 2026"
      },
      {
        id: "3",
        play_id: 3,
        title: "DDDJ - Proscenium Lighting & DMX Rig Operator",
        category: "Technical Crew",
        description: "Technical crew member managing DMX lighting console, spot gels, color transitions, and live proscenium stage cues.",
        requirements: "Technical crew portfolio or stage experience summary",
        deadline: "Sep 28, 2026"
      },
      {
        id: "4",
        play_id: 4,
        title: "Samatvam - Physical Movement & Body Ensemble",
        category: "Performer",
        description: "Experimental physical theatre actor exploring body synchronization, Navarasa facial control, and synchronized spatial movement.",
        requirements: "Movement audition tape & physical theatre bio",
        deadline: "Sep 30, 2026"
      },
      {
        id: "5",
        play_id: 5,
        title: "Speak Up Tara - Assistant Stage Director & Dramaturge",
        category: "Director",
        description: "Collaborate with principal director on scene blocking, actor notes, script adaptation, and rehearsal pacing.",
        requirements: "Directorial concept note or previous play review",
        deadline: "Oct 05, 2026"
      }
    ]);
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
  }, []);

  useEffect(() => {
    fetchMyAuditions();
  }, [activeUser]);

  const handleApplyClick = (pos: OpenPosition) => {
    setActivePosition(pos);
    setFileName1("");
    setFileName2("");
    setCoverNote("");
    setApplyOpen(true);
  };

  const handleWithdrawApplication = (appId: string, positionTitle: string) => {
    if (!confirm(`Are you sure you want to withdraw your audition application for "${positionTitle}"?`)) return;
    setApplications(prev => prev.filter(a => a.id !== appId && a.positionTitle !== positionTitle));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePosition || !activeUser) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/audition/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeUser.email,
          play_id: activePosition.play_id,
          role: activePosition.title,
          notes: coverNote,
          ai_transcript: "",
          ai_blur: null,
          ai_brightness: null,
          ai_face_detected: null,
          ai_report: ""
        })
      });
      if (res.ok) {
        const data = await res.json();
        const filesUploaded = [];
        if (fileName1) filesUploaded.push(fileName1);
        if (fileName2) filesUploaded.push(fileName2);
        if (filesUploaded.length === 0) {
          filesUploaded.push(activePosition.category === "Performer" ? "audition_monologue.mp4" : "portfolio_materials.pdf");
        }

        const newApp: Application = {
          id: `app${data.id || Date.now()}`,
          positionId: activePosition.id,
          positionTitle: activePosition.title,
          category: activePosition.category,
          submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          status: "Applied",
          notes: "Application received and logged. Creative board is reviewing your materials.",
          files: filesUploaded,
        };

        setApplications(prev => [newApp, ...prev]);
        setApplyOpen(false);
        fetchMyAuditions();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const filteredPositions = openPositions.filter((pos) => {
    const matchesSearch = pos.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pos.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || pos.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const steps = ["Applied", "Reviewing", "Interview/Audition", "Casting Decision"];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Applied": return 0;
      case "Reviewing": return 1;
      case "Interview/Audition": return 2;
      case "Casting Decision": return 3;
      default: return 0;
    }
  };

  // FULL IN-PAGE VIEW WHEN APPLYING FOR A ROLE
  if (activePosition && applyOpen) {
    return (
      <div className="space-y-6 font-sans text-[#666361] animate-in fade-in-50 duration-200 pb-16">
        {/* Navigation & Status Header */}
        <div className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setApplyOpen(false)}
              className="text-xs font-bold text-[#353535] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
            >
              ← Back to Open Auditions
            </button>
            <span className="text-xs uppercase tracking-widest text-[#9B1C31] font-bold block">
              Ensemble Casting Application
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#353535]">
              Apply: {activePosition.title}
            </h2>
            <p className="text-xs md:text-sm text-[#666361]">
              Production: <strong>{activePosition.title}</strong> • Classification: <strong>{activePosition.category}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#353535] text-white font-mono text-xs font-bold px-3 py-1">
              {activePosition.category}
            </Badge>
            <Badge className="bg-[#E85F57]/20 text-[#2C2A28] border-[#E85F57]/40 font-semibold text-xs py-1">
              Deadline: {activePosition.deadline || 'Sep 25, 2026'}
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-800 font-semibold text-xs py-1">
              Slots: {activePosition.slots_available || 1} Openings
            </Badge>
          </div>
        </div>

        {/* 2-Column Application Form & Specifications */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Left Column: Role & Character Specifications (col-span-6) */}
            <div className="lg:col-span-6 space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-[#DDD8CE] shadow-xs">
              <div className="space-y-2">
                <strong className="text-xs font-bold text-[#353535] uppercase tracking-wider block">
                  Character & Role Specifications
                </strong>
                <p className="text-xs md:text-sm text-[#2C2A28] leading-relaxed font-light bg-[#E7DDD3] p-4 rounded-xl border border-[#D5C9BE]/40">
                  {activePosition.description || "Seeking dedicated ensemble member with strong stage presence, dramatic projection, and commitment to rehearsal schedules."}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DDD8CE]">
                <strong className="text-xs font-bold text-[#353535] uppercase tracking-wider block flex items-center gap-1">
                  <ListChecks className="w-4 h-4 text-[#E85F57]" /> Audition Requirements & Skill Benchmark
                </strong>
                <div className="text-xs md:text-sm text-[#2C2A28] bg-[#E7DDD3] p-4 rounded-xl border border-[#D5C9BE]/40 space-y-2">
                  <p className="leading-relaxed font-medium">
                    {activePosition.requirements || "Audition monologue clip / Technical PDF portfolio submission."}
                  </p>
                  <ul className="list-disc pl-4 text-xs text-[#666361] space-y-1.5 pt-2 border-t border-[#DDD8CE]">
                    <li>High commitment to scheduled ensemble table-reads & stage rehearsals</li>
                    <li>Audition slate or portfolio file review by maintainer creative board</li>
                    <li>Selected candidates will be notified via email for call-back auditions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#E85F57]/10 p-4 rounded-xl border border-[#E85F57]/30 space-y-1">
                <span className="text-xs font-bold text-[#353535] block">Casting Process Note:</span>
                <p className="text-xs text-[#666361] leading-relaxed">
                  Applications submit directly to the maintainer review portal. Maintainers perform automated portfolio & video quality verification scans during review.
                </p>
              </div>
            </div>

            {/* Right Column: Applicant Details Form (col-span-6) */}
            <div className="lg:col-span-6 space-y-5 bg-white p-6 md:p-8 rounded-2xl border border-[#DDD8CE] shadow-xs">
              <strong className="text-xs font-bold text-[#353535] uppercase tracking-wider block border-b border-[#DDD8CE] pb-3">
                Applicant Information Form
              </strong>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#353535]">Full Name *</label>
                <Input 
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="border-[#D5C9BE]/60 focus-visible:ring-[#E85F57] text-xs h-10 bg-[#E7DDD3] rounded-xl"
                  placeholder="e.g. Aarav Varma"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#353535]">Email Address *</label>
                <Input 
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="border-[#D5C9BE]/60 focus-visible:ring-[#E85F57] text-xs h-10 bg-[#E7DDD3] rounded-xl"
                  placeholder="e.g. member@aayam.org"
                  required
                />
              </div>

              {/* File Upload Section */}
              {activePosition.category === "Performer" ? (
                <div className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#353535] flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-[#E85F57]" /> Audition Monologue Video (.mp4 / .mov)
                    </label>
                    <div className="border border-dashed border-[#D5C9BE] rounded-xl bg-[#E7DDD3] p-3.5 flex items-center justify-between text-xs">
                      <span className="text-[#666361]/80 truncate max-w-[240px]">
                        {fileName1 || "Upload monologue video clip"}
                      </span>
                      <label className="cursor-pointer bg-[#E85F57]/20 hover:bg-[#E85F57]/30 text-[#2C2A28] px-3 py-1.5 rounded-lg border border-[#E85F57]/40 transition-all font-semibold flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> File
                        <input 
                          type="file" 
                          accept="video/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (!e.target.files?.length) return;
                            setFileName1(e.target.files[0].name);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#353535] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#E85F57]" /> Headshot & Theatrical Resume PDF
                    </label>
                    <div className="border border-dashed border-[#D5C9BE] rounded-xl bg-[#E7DDD3] p-3.5 flex items-center justify-between text-xs">
                      <span className="text-[#666361]/80 truncate max-w-[240px]">
                        {fileName2 || "Upload resume PDF"}
                      </span>
                      <label className="cursor-pointer bg-[#E85F57]/20 hover:bg-[#E85F57]/30 text-[#2C2A28] px-3 py-1.5 rounded-lg border border-[#E85F57]/40 transition-all font-semibold flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> File
                        <input 
                          type="file" 
                          accept=".pdf,image/*" 
                          className="hidden" 
                          onChange={(e) => e.target.files?.[0] && setFileName2(e.target.files[0].name)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#353535] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#E85F57]" /> Creative / Technical Portfolio PDF
                    </label>
                    <div className="border border-dashed border-[#D5C9BE] rounded-xl bg-[#E7DDD3] p-3.5 flex items-center justify-between text-xs">
                      <span className="text-[#666361]/80 truncate max-w-[240px]">
                        {fileName1 || "Upload portfolio PDF"}
                      </span>
                      <label className="cursor-pointer bg-[#E85F57]/20 hover:bg-[#E85F57]/30 text-[#2C2A28] px-3 py-1.5 rounded-lg border border-[#E85F57]/40 transition-all font-semibold flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> File
                        <input 
                          type="file" 
                          accept=".pdf,.zip" 
                          className="hidden" 
                          onChange={(e) => e.target.files?.[0] && setFileName1(e.target.files[0].name)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#353535] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#E85F57]" /> Experience Resume PDF
                    </label>
                    <div className="border border-dashed border-[#D5C9BE] rounded-xl bg-[#E7DDD3] p-3.5 flex items-center justify-between text-xs">
                      <span className="text-[#666361]/80 truncate max-w-[240px]">
                        {fileName2 || "Upload resume PDF"}
                      </span>
                      <label className="cursor-pointer bg-[#E85F57]/20 hover:bg-[#E85F57]/30 text-[#2C2A28] px-3 py-1.5 rounded-lg border border-[#E85F57]/40 transition-all font-semibold flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> File
                        <input 
                          type="file" 
                          accept=".pdf" 
                          className="hidden" 
                          onChange={(e) => e.target.files?.[0] && setFileName2(e.target.files[0].name)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#353535]">Candidate Experience Notes / Message to Director</label>
                <textarea 
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Mention past theatrical productions, classical training, or specific role preparation..."
                  className="w-full border border-[#D5C9BE]/60 rounded-xl bg-[#E7DDD3] text-xs p-3 h-28 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E85F57]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-[#DDD8CE] pt-6 bg-white p-4 rounded-2xl">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setApplyOpen(false)} 
              className="border-2 border-[#D5C9BE] text-[#353535] hover:bg-gray-100 rounded-xl text-xs font-bold px-8 h-11"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#353535] hover:bg-[#4d4a32] text-white rounded-xl font-bold text-xs px-10 h-11 shadow-md"
            >
              Submit Official Audition Application
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // STANDARD AUDITIONS PAGE GRID
  return (
    <div className="space-y-[32px] font-sans text-[#666361] pb-12">
      {/* Overview Block */}
      <div className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-2xl p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px]">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#666361]/70 font-semibold">Club Staging</span>
          <h2 className="text-[32px] font-bold font-serif text-[#353535]">Auditions &amp; Casting</h2>
          <p className="text-sm text-[#666361]">
            Browse and apply for acting ensemble understudies, crew operations, or creative production designs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DDD8CE] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {(["All", "Performer", "Technical Crew", "Creative Designer", "Director"] as const).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl text-xs py-1.5 px-4 font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#353535] text-white hover:bg-[#4d4a32]"
                  : "border border-[#DDD8CE] text-[#666361] hover:bg-[#EFE8E1]"
              }`}
            >
              {cat}s
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#666361]/50" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-[#DDD8CE] focus-visible:ring-[#E85F57] h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Open Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPositions.map((pos) => {
          const isClosed = pos.status === "Casting Closed" || pos.status === "In Review";
          
          // Check if user has already submitted an application for this position
          const existingApp = applications.find(
            app => app.positionId === pos.id || app.positionTitle === pos.title
          );
          const currentStepIndex = existingApp ? getStepIndex(existingApp.status) : 0;

          return (
            <div key={pos.id} className="bg-white border border-[#DDD8CE] rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-[#E85F57]/30 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <Badge className="bg-[#353535]/10 text-[#353535] border-[#353535]/20 font-semibold rounded-md text-[10px] uppercase">
                    {pos.category}
                  </Badge>
                  {existingApp ? (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold rounded-md text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Application Submitted
                    </Badge>
                  ) : isClosed ? (
                    <Badge className="bg-red-100 text-red-700 border-red-200 font-bold rounded-md text-[10px]">
                      {pos.status || "Casting Closed"}
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-red-600/80 font-medium">Deadline: {pos.deadline || 'Sep 25, 2026'}</span>
                  )}
                </div>
                <h3 className="font-bold text-[18px] text-[#353535] font-serif">{pos.title}</h3>
                <p className="text-xs text-[#666361]/85 leading-relaxed">{pos.description}</p>
              </div>

              {/* IN-CARD APPLICATION TRACKING BAR (Shown if applied) */}
              {existingApp ? (
                <div className="bg-[#E7DDD3] border border-[#D5C9BE]/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-[#DDD8CE] pb-2">
                    <span className="font-bold text-[#353535] text-[11px] uppercase tracking-wider">
                      Application Status Pipeline
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Submitted: {existingApp.submittedAt}
                    </span>
                  </div>

                  {/* 4-Step In-Card Progress Bar */}
                  <div className="relative w-full py-2">
                    <div className="absolute left-[30px] right-[30px] top-[12px] -translate-y-1/2 h-[2px]">
                      <div className="w-full h-full bg-gray-200" />
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#E85F57] transition-all duration-500" 
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between w-full relative z-10">
                      {steps.map((step, idx) => {
                        const isCompleted = idx < currentStepIndex;
                        const isActive = idx === currentStepIndex;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div 
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                                isCompleted ? "bg-[#E85F57] border-[#E85F57] text-[#2C2A28]" :
                                isActive ? "bg-white border-[#E85F57] text-[#E85F57] ring-2 ring-[#E85F57]/20 scale-110" :
                                "bg-white border-gray-200 text-gray-400"
                              }`}
                            >
                              {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                            </div>
                            <span className={`text-[8px] mt-1 font-semibold text-center whitespace-nowrap ${
                              isActive ? "text-[#E85F57] font-bold" : 
                              isCompleted ? "text-[#E85F57]/90 font-medium" : "text-[#666361]/60"
                            }`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {existingApp.notes && (
                    <div className="text-[11px] text-[#666361] bg-white p-2.5 rounded-lg border border-[#D5C9BE]/40 italic">
                      <strong className="text-[#353535] not-italic block text-[10px]">Director Note:</strong>
                      "{existingApp.notes}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-500 truncate max-w-[200px]">
                      Files: {existingApp.files.join(", ")}
                    </span>
                    <Button 
                      variant="outline"
                      onClick={() => handleWithdrawApplication(existingApp.id, pos.title)}
                      className="border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold h-7 px-3 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Withdraw
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-[#DDD8CE]/60 pt-4 flex flex-col gap-3">
                  <div className="flex flex-col text-[11px] text-[#666361]/70 bg-[#EFE8E1]/40 rounded p-2.5">
                    <strong className="text-[#353535] mb-1 font-semibold flex items-center gap-1">
                      <ListChecks className="w-3.5 h-3.5 text-[#E85F57]" /> Required Submissions:
                    </strong>
                    <span>{pos.requirements}</span>
                  </div>
                  {isClosed ? (
                    <Button 
                      disabled
                      className="bg-gray-200 text-gray-500 font-semibold rounded-xl text-xs py-2 w-full cursor-not-allowed border border-gray-300"
                    >
                      Casting Closed
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleApplyClick(pos)}
                      className="bg-[#353535] hover:bg-[#4d4a32] text-white font-semibold rounded-xl text-xs py-2.5 w-full transition-all flex items-center justify-center gap-1 shadow-xs"
                    >
                      Apply for Position <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filteredPositions.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-white border border-[#DDD8CE] rounded-2xl">
            <AlertCircle className="w-8 h-8 text-[#666361]/40 mx-auto mb-2" />
            <p className="text-xs text-[#666361]/70">No positions found matching "{searchTerm}" in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
