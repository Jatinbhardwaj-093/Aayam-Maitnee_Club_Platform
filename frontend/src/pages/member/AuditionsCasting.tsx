// @ts-nocheck
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, FileText, Video, Upload, ChevronRight, ListChecks, Check, AlertCircle, Trash2, CheckCircle2, Mic } from "lucide-react";

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
    setApplications(prev => prev.filter(app => app.id !== appId));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePosition) return;
    
    if (activePosition.category === "Performer" && !fileName1) {
      alert("Please upload your audition monologue video clip.");
      return;
    }
    if (activePosition.category !== "Performer" && !fileName1) {
      alert("Please upload your portfolio PDF.");
      return;
    }
    
    const newApp: Application = {
      id: "app-" + Math.random().toString(36).substr(2, 9),
      positionId: activePosition.id,
      positionTitle: activePosition.title,
      category: activePosition.category,
      submittedAt: new Date().toISOString(),
      status: "Applied",
      notes: coverNote,
      files: [fileName1, fileName2].filter(Boolean)
    };
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/my-auditions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newApp, applicantEmail })
      });
    } catch (err) {}
    
    setApplications(prev => [newApp, ...prev]);
    setApplyOpen(false);
    setActivePosition(null);
    alert("Audition application submitted successfully to maintainer desk!");
  };

  const filteredPositions = openPositions.filter((pos) => {
    const matchesSearch = pos.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pos.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || pos.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (applyOpen && activePosition) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 md:px-8 font-sans text-[#2C2A28] animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => setApplyOpen(false)}
          className="text-xs font-mono font-bold uppercase tracking-widest text-[#666361] hover:text-[#E85F57] transition-all flex items-center gap-2"
        >
          ← Back to Board
        </button>

        <div className="bg-white border border-[#D5C9BE]/60 rounded-[2.5rem] p-8 shadow-xl">
          <div className="space-y-4 pb-8 border-b border-[#D5C9BE]/60">
            <span className="inline-block px-3 py-1 bg-[#E85F57]/10 text-[#E85F57] border border-[#E85F57]/20 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
              {activePosition.category} Role
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-[#2C2A28] leading-tight">
              {activePosition.title}
            </h1>
            <p className="text-sm text-[#666361] font-light max-w-2xl">
              {activePosition.description}
            </p>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">Full Name *</label>
                <input 
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[#D5C9BE]/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E85F57] transition-colors"
                  placeholder="e.g. Aarav Varma"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">Email Address *</label>
                <input 
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[#D5C9BE]/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E85F57] transition-colors"
                  placeholder="e.g. member@aayam.org"
                  required
                />
              </div>
            </div>

            <div className="space-y-6 bg-[#F7F5F0] border border-[#D5C9BE]/40 p-6 rounded-[1.5rem]">
              <h3 className="font-serif text-xl text-[#2C2A28]">Required Attachments</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361] flex items-center gap-1.5">
                    {activePosition.category === "Performer" ? <Video className="w-3.5 h-3.5 text-[#E85F57]" /> : <FileText className="w-3.5 h-3.5 text-[#E85F57]" />}
                    {activePosition.category === "Performer" ? "Audition Tape (.mp4)" : "Portfolio PDF"}
                  </label>
                  <label className="flex items-center justify-between bg-white border border-dashed border-[#D5C9BE] px-4 py-3 rounded-xl cursor-pointer hover:border-[#E85F57] transition-colors">
                    <span className="text-xs text-[#666361] truncate max-w-[200px]">
                      {fileName1 || "Select file..."}
                    </span>
                    <span className="bg-[#2C2A28] text-white px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase">Browse</span>
                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setFileName1(e.target.files[0].name)} />
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#E85F57]" /> Headshot / Resume PDF
                  </label>
                  <label className="flex items-center justify-between bg-white border border-dashed border-[#D5C9BE] px-4 py-3 rounded-xl cursor-pointer hover:border-[#E85F57] transition-colors">
                    <span className="text-xs text-[#666361] truncate max-w-[200px]">
                      {fileName2 || "Select file..."}
                    </span>
                    <span className="bg-[#2C2A28] text-white px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase">Browse</span>
                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setFileName2(e.target.files[0].name)} />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">Message to Director (Optional)</label>
              <textarea 
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Mention past theatrical productions, classical training, or specific role preparation..."
                className="w-full bg-[#F7F5F0] border border-[#D5C9BE]/60 rounded-xl px-4 py-3 text-sm h-32 focus:outline-none focus:border-[#E85F57] transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#D5C9BE]/60">
              <button 
                type="button" 
                onClick={() => setApplyOpen(false)}
                className="px-6 py-3 rounded-full border border-[#D5C9BE] text-[#666361] hover:bg-[#F7F5F0] text-xs font-mono font-bold uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-3 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4 md:px-8 font-sans text-[#2C2A28]">
      
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D5C9BE]/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57]">
            <Mic className="w-3.5 h-3.5" />
            <span>TALENT ACQUISITION</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C2A28] font-normal tracking-tight">
            Auditions & Casting
          </h1>
          <p className="text-sm text-[#666361] max-w-xl font-light">
            Review open production roles, submit your audition tape or technical portfolio, and track your active casting applications.
          </p>
        </div>
      </section>

      {/* Applied Roles Section */}
      {applications.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5C9BE]/60">
            <h2 className="font-serif text-2xl text-[#2C2A28]">My Casting Applications</h2>
            <span className="px-3 py-1 bg-[#2C2A28] text-white rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
              {applications.length} ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white/60 border border-[#D5C9BE] rounded-[1.5rem] p-6 hover:bg-white transition-all space-y-4 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-md border text-[9px] font-mono font-bold uppercase tracking-widest ${
                    app.status === 'Applied' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    app.status === 'Reviewing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    app.status === 'Interview/Audition' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {app.status}
                  </span>
                </div>
                
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361] mb-1 block">
                    {app.category} Role
                  </span>
                  <h3 className="font-serif text-xl text-[#2C2A28] pr-16 leading-tight">
                    {app.positionTitle}
                  </h3>
                  <p className="text-[10px] font-mono text-[#666361] mt-2">
                    SUBMITTED: {new Date(app.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-[#D5C9BE]/60 flex items-center justify-between">
                  <span className="text-xs font-light text-[#666361]">
                    {app.files.length} attachment(s)
                  </span>
                  <button 
                    onClick={() => handleWithdrawApplication(app.id, app.positionTitle)}
                    className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" /> Withdraw
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Open Casting Call Board */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-10 bg-[#E7DDD3]/90 backdrop-blur-md py-4 border-y border-[#D5C9BE]/60">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666361]" />
            <input 
              type="text" 
              placeholder="Search roles or productions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-[#D5C9BE] rounded-full text-sm focus:outline-none focus:border-[#E85F57] focus:bg-white transition-all font-mono"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {(["All", "Performer", "Technical Crew", "Creative Designer", "Director"] as const).map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? "bg-[#2C2A28] text-white shadow-md" 
                    : "bg-white/60 text-[#666361] hover:bg-white border border-[#D5C9BE]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPositions.map((pos) => {
            const hasApplied = applications.some(a => a.positionId === pos.id);
            
            return (
              <div key={pos.id} className="bg-white/60 border border-[#D5C9BE] rounded-[2rem] p-8 hover:border-[#E85F57]/40 hover:shadow-xl transition-all space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-[#2C2A28] text-white border border-[#353535] rounded-full text-[9px] font-mono font-bold uppercase tracking-widest">
                      {pos.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57] bg-[#E85F57]/10 px-3 py-1 rounded-full">
                      DUE: {pos.deadline}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-2xl text-[#2C2A28] leading-tight mb-3">
                    {pos.title}
                  </h3>
                  <p className="text-sm text-[#666361] font-light leading-relaxed">
                    {pos.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-[#D5C9BE]/60 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#666361]">
                    <AlertCircle className="w-4 h-4 text-[#E85F57] shrink-0" />
                    <span><strong className="text-[#2C2A28]">Requires:</strong> {pos.requirements}</span>
                  </div>
                  
                  {hasApplied ? (
                    <button disabled className="w-full py-3.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Application Submitted
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApplyClick(pos)}
                      className="w-full py-3.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      Apply Now <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredPositions.length === 0 && (
          <div className="text-center py-16 bg-white/40 border border-[#D5C9BE]/40 rounded-[2rem]">
            <p className="text-sm font-light text-[#666361]">No open casting calls match your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
