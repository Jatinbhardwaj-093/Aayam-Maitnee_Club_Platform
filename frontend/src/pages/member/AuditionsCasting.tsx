import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, FileText, Video, Upload, ChevronRight, ListChecks, Check, AlertCircle, BatteryFull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OpenPosition {
  id: string;
  play_id: number;
  title: string;
  category: "Performer" | "Technical Crew" | "Creative Designer" | "Director";
  description: string;
  requirements: string;
  deadline: string;
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
  const { activeUser } = useOutletContext<{ activeUser: any }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Performer" | "Technical Crew" | "Creative Designer" | "Director">("All");
  
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  
  const [applyOpen, setApplyOpen] = useState(false);
  const [activePosition, setActivePosition] = useState<OpenPosition | null>(null);
  
  const [applicantName, setApplicantName] = useState(activeUser?.name || "");
  const [applicantEmail, setApplicantEmail] = useState(activeUser?.email || "");
  const [fileName1, setFileName1] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [aiResult, setAiResult] = useState<any>(null);

  const [analyzing, setAnalyzing] = useState(false);

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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/open-positions`);
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
    // Fallback Positions
    setOpenPositions([
      {
        id: "1_Performer_1",
        play_id: 1,
        title: "Tamashbin Kathputliya - Lead Street Performer",
        category: "Performer",
        description: "Seeking energetic street theatre actor with strong vocal projection and rhythmic dialogue delivery.",
        requirements: "Audition monologue video clip & theatrical resume",
        deadline: "Aug 15, 2026"
      },
      {
        id: "2_TechnicalCrew_2",
        play_id: 2,
        title: "DDDJ Showcase - Technical Stage Director",
        category: "Technical Crew",
        description: "Overseeing stage cues, sound mix balancing, and lighting transitions for the annual showcase.",
        requirements: "Technical staging portfolio PDF & work resume",
        deadline: "Aug 20, 2026"
      },
      {
        id: "3_CreativeDesigner_3",
        play_id: 3,
        title: "Karn Ki Yachika - Classical Costume Designer",
        category: "Creative Designer",
        description: "Designing period-accurate Indian classical drama costumes and headpieces.",
        requirements: "Design portfolio PDF & sketch samples",
        deadline: "Sep 01, 2026"
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
        if (apps.length > 0 && !selectedAppId) {
          setSelectedAppId(apps[0].id);
        }
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePosition || !activeUser) return;
    let aiData: any = null;
    try {
        if (videoFile) {

            setAnalyzing(true);
            
            const formData = new FormData();

            formData.append("video", videoFile);

            const aiResponse = await fetch(
                `${
                    import.meta.env.VITE_API_BASE_URL ??
                    "http://localhost:5005"
                }/api/upload_audition`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            if (!aiResponse.ok) {
                throw new Error("AI analysis failed.");
            }

            aiData = await aiResponse.json();
            setAiResult(aiData);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setAnalyzing(false);
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/audition/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: activeUser.email,
          play_id: activePosition.play_id,
          role: activePosition.title,
          notes: coverNote,

          ai_transcript: aiData?.transcript || "",
          ai_blur: aiData?.blur ?? null,
          ai_brightness: aiData?.brightness ?? null,
          ai_face_detected: aiData?.face_detected ?? null,
          ai_report: aiData?.ai_report || ""
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

        const updatedApps = [newApp, ...applications];
        setApplications(updatedApps);
        setSelectedAppId(newApp.id);
        // setApplyOpen(false);
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

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Helper to determine progress state step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case "Applied": return 0;
      case "Reviewing": return 1;
      case "Interview/Audition": return 2;
      case "Casting Decision": return 3;
      default: return 0;
    }
  };

  const currentStepIndex = selectedApp ? getStepIndex(selectedApp.status) : 0;
  const steps = ["Applied", "Reviewing", "Interview/Audition", "Casting Decision"];

  return (
    <div className="space-y-[32px] font-sans text-[#466272] pb-[120px]">
      {/* Overview Block */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px]">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#466272]/70 font-semibold">Club Staging</span>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Open Auditions &amp; Positions</h2>
          <p className="text-sm text-[#466272]">
            Browse and apply for acting ensemble understudies, crew operations, or creative production designs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e6e2dd] rounded-[8px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {(["All", "Performer", "Technical Crew", "Creative Designer", "Director"] as const).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-[6px] text-xs py-1.5 px-4 font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/95"
                  : "border border-[#e6e2dd] text-[#466272] hover:bg-[#f7f3ee]"
              }`}
            >
              {cat}s
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#466272]/50" />
          <Input
            placeholder="Search open positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-[#e6e2dd] focus-visible:ring-[#8CC0EB] h-9 text-xs"
          />
        </div>
      </div>

      {/* Open Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPositions.map((pos) => (
          <div key={pos.id} className="bg-white border border-[#e6e2dd] rounded-[8px] p-6 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-[#8CC0EB]/30 transition-all">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <Badge className="bg-[#635f41]/10 text-[#635f41] border-[#635f41]/20 font-semibold rounded-[4px] text-[10px] uppercase">
                  {pos.category}
                </Badge>
                <span className="text-[10px] text-red-600/80 font-medium">Deadline: {pos.deadline}</span>
              </div>
              <h3 className="font-bold text-[18px] text-[#635f41] font-serif">{pos.title}</h3>
              <p className="text-xs text-[#466272]/85 leading-relaxed">{pos.description}</p>
            </div>
            
            <div className="border-t border-[#e6e2dd]/60 pt-4 flex flex-col gap-3">
              <div className="flex flex-col text-[11px] text-[#466272]/70 bg-[#f7f3ee]/40 rounded p-2.5">
                <strong className="text-[#635f41] mb-1 font-semibold flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5 text-[#8CC0EB]" /> Required Submissions:
                </strong>
                <span>{pos.requirements}</span>
              </div>
              <Button 
                onClick={() => handleApplyClick(pos)}
                className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] text-xs py-2 w-full transition-all flex items-center justify-center gap-1"
              >
                Apply for Position <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {filteredPositions.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-white border border-[#e6e2dd] rounded-[8px]">
            <AlertCircle className="w-8 h-8 text-[#466272]/40 mx-auto mb-2" />
            <p className="text-xs text-[#466272]/70">No positions found matching "{searchTerm}" in this category.</p>
          </div>
        )}
      </div>

      {/* Apply Position Dialog Modal */}
      {activePosition && (
        <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
          <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-md">
            <form onSubmit={handleFormSubmit}>
              <DialogHeader>
                <DialogTitle className="font-serif text-[#635f41] text-lg font-bold">
                  Apply: {activePosition.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#466272]/85">
                  Complete your details and upload materials. Classification: <strong className="text-[#635f41]">{activePosition.category}</strong>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Full Name</label>
                  <Input 
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-xs h-9 bg-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Email Address</label>
                  <Input 
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-xs h-9 bg-white"
                    required
                  />
                </div>

                {/* Conditional Upload Files based on Member Category */}
                {activePosition.category === "Performer" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#635f41] flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-[#8CC0EB]" /> Audition Monologue Video (.mp4 / .mov)
                      </label>
                      <div className="border border-dashed border-[#e6e2dd] rounded-[8px] bg-white p-2.5 flex items-center justify-between text-xs">
                        <span className="text-[#466272]/70 truncate max-w-[220px]">
                          {fileName1 || "Click to upload monologue clip"}
                        </span>
                        <label className="cursor-pointer bg-[#8CC0EB]/10 hover:bg-[#8CC0EB]/20 text-[#635f41] px-2.5 py-1 rounded-[4px] border border-[#8CC0EB]/20 transition-all font-semibold flex items-center gap-1">
                          <Upload className="w-3 h-3" /> File
                          <input 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            // onChange={(e) => e.target.files?.[0] && setFileName1(e.target.files[0].name)}
                            onChange={(e) => {
                              if (!e.target.files?.length) return;
                              setVideoFile(e.target.files[0]);
                              setFileName1(e.target.files[0].name);
                          }}

                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#635f41] flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#8CC0EB]" /> Headshot / Profile PDF
                      </label>
                      <div className="border border-dashed border-[#e6e2dd] rounded-[8px] bg-white p-2.5 flex items-center justify-between text-xs">
                        <span className="text-[#466272]/70 truncate max-w-[220px]">
                          {fileName2 || "Click to upload headshot file"}
                        </span>
                        <label className="cursor-pointer bg-[#8CC0EB]/10 hover:bg-[#8CC0EB]/20 text-[#635f41] px-2.5 py-1 rounded-[4px] border border-[#8CC0EB]/20 transition-all font-semibold flex items-center gap-1">
                          <Upload className="w-3 h-3" /> File
                          <input 
                            type="file" 
                            accept=".pdf,image/*" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && setFileName2(e.target.files[0].name)}
                          />
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#635f41] flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#8CC0EB]" /> Creative / Technical Portfolio (.pdf / .zip)
                      </label>
                      <div className="border border-dashed border-[#e6e2dd] rounded-[8px] bg-white p-2.5 flex items-center justify-between text-xs">
                        <span className="text-[#466272]/70 truncate max-w-[220px]">
                          {fileName1 || "Click to upload design files"}
                        </span>
                        <label className="cursor-pointer bg-[#8CC0EB]/10 hover:bg-[#8CC0EB]/20 text-[#635f41] px-2.5 py-1 rounded-[4px] border border-[#8CC0EB]/20 transition-all font-semibold flex items-center gap-1">
                          <Upload className="w-3 h-3" /> File
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && setFileName1(e.target.files[0].name)}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#635f41] flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#8CC0EB]" /> Work Experience Resume (.pdf)
                      </label>
                      <div className="border border-dashed border-[#e6e2dd] rounded-[8px] bg-white p-2.5 flex items-center justify-between text-xs">
                        <span className="text-[#466272]/70 truncate max-w-[220px]">
                          {fileName2 || "Click to upload resume PDF"}
                        </span>
                        <label className="cursor-pointer bg-[#8CC0EB]/10 hover:bg-[#8CC0EB]/20 text-[#635f41] px-2.5 py-1 rounded-[4px] border border-[#8CC0EB]/20 transition-all font-semibold flex items-center gap-1">
                          <Upload className="w-3 h-3" /> File
                          <input 
                            type="file" 
                            accept=".pdf" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && setFileName2(e.target.files[0].name)}
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Cover Note / Message to Director</label>
                  <textarea 
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Describe your previous staging experience..."
                    className="w-full border border-[#e6e2dd] rounded-[8px] bg-white text-xs p-2 h-20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8CC0EB]"
                  />
                </div>
              </div>

              
            

              {/* ---------- AI Analysis ---------- */}

              {analyzing && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h3 className="font-semibold text-blue-700">
                          Analyzing audition...
                      </h3>

                      <p className="mt-1 text-sm text-blue-600">
                          Please wait while the AI evaluates the audition video.
                      </p>
                  </div>
                  )}

                  {aiResult && (
                      <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                          <h3 className="mb-4 text-lg font-bold">
                              AI Screening Report
                          </h3>

                          <div className="space-y-3">
                              <div>
                                  <strong>Transcript</strong>

                                  <p className="mt-1 whitespace-pre-wrap">
                                      {aiResult.transcript}
                                  </p>
                              </div>

                              <div>
                                  <strong>Blur Score:</strong>{" "}
                                  {aiResult.blur}
                              </div>

                              <div>
                                  <strong>Brightness:</strong>{" "}
                                  {aiResult.brightness}
                              </div>

                              <div>
                                  <strong>Face Detected:</strong>{" "}
                                  {aiResult.face_detected ? "✅ Yes" : "❌ No"}
                              </div>

                              <div>
                                  <strong>AI Evaluation</strong>

                                  <pre className="mt-2 whitespace-pre-wrap rounded bg-white p-3">
                                      {aiResult.ai_report}
                                  </pre>
                              </div>
                          </div>
                        </div>
                    )}


              
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setApplyOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px] text-xs">
                  Cancel
                </Button>
                <Button type="submit"
                disabled={analyzing}
                className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px] font-semibold text-xs"
              >
                {analyzing ? "Analyzing..." : "Submit Application"}
              </Button>
              </DialogFooter>
             </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Status Bar / Application Tracker (Bottom Fixed Container) */}
      {selectedApp && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#fdf9f4] border-t border-[#e6e2dd] shadow-lg p-4 md:py-6 md:px-8">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Application Details (col-span-3) */}
            <div className="lg:col-span-3 text-left w-full space-y-1.5 pb-3 lg:pb-0 lg:border-r border-[#e6e2dd]/80 lg:pr-6">
              <span className="text-[9px] uppercase font-bold text-[#9B1C31] tracking-wider block">Application Pipeline</span>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedAppId} 
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="text-sm font-bold font-serif text-[#635f41] bg-transparent border-0 hover:underline focus:ring-0 focus:outline-none cursor-pointer p-0 max-w-[180px] truncate"
                >
                  {applications.map(app => (
                    <option key={app.id} value={app.id} className="bg-white text-[#466272]">
                      {app.positionTitle}
                    </option>
                  ))}
                </select>
                <Badge className="bg-[#635f41]/10 text-[#635f41] border-[#635f41]/20 font-normal rounded-[4px] text-[9px] py-0.5 whitespace-nowrap">
                  {selectedApp.category}
                </Badge>
              </div>
              <p className="text-[10px] text-[#466272]/70 truncate">
                <strong className="text-[#635f41] font-medium">Files:</strong> {selectedApp.files.join(", ")}
              </p>
            </div>

            {/* Middle Column: Visual Status Progress Bar (col-span-5) */}
            <div className="lg:col-span-5 w-full py-2 px-2 md:px-4">
              <div className="relative w-full">
                
                {/* Horizontal connector lines wrapper (perfectly aligned with circle centers) */}
                <div className="absolute left-[35px] right-[35px] top-[12px] -translate-y-1/2 h-[2px]">
                  {/* Background line (full width of wrapper) */}
                  <div className="w-full h-full bg-gray-200" />
                  {/* Active progress line (percentage of wrapper) */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#8CC0EB] transition-all duration-500" 
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps Nodes */}
                <div className="flex items-center justify-between w-full relative z-10">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center min-w-[70px]">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                            isCompleted ? "bg-[#8CC0EB] border-[#8CC0EB] text-[#1c1b19]" :
                            isActive ? "bg-white border-[#8CC0EB] text-[#8CC0EB] ring-2 ring-[#8CC0EB]/20 scale-110" :
                            "bg-white border-gray-200 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>
                        <span className={`text-[9px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                          isActive ? "text-[#8CC0EB] font-bold" : 
                          isCompleted ? "text-[#8CC0EB]/90 font-medium" : "text-[#466272]/60"
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Status Summary & Notes (col-span-4) */}
            <div className="lg:col-span-4 flex flex-row items-center gap-4 justify-between lg:justify-end w-full border-t lg:border-t-0 lg:border-l border-[#e6e2dd]/80 pt-3 lg:pt-0 lg:pl-6">
              <div className="text-left lg:text-right max-w-[200px]">
                <span className="text-[9px] text-[#466272]/60 uppercase block">Director Updates</span>
                <p className="text-[11px] text-[#466272]/95 italic font-serif leading-snug mt-0.5">{selectedApp.notes}</p>
              </div>
              <Badge className={`px-3 py-1.5 text-[10px] font-semibold tracking-wider rounded-[4px] uppercase whitespace-nowrap flex-shrink-0 ${
                selectedApp.status === "Casting Decision" ? "bg-[#8CC0EB] text-[#1c1b19]" :
                selectedApp.status === "Interview/Audition" ? "bg-[#8CC0EB] text-[#1c1b19]" :
                "bg-[#f7f3ee] text-[#635f41]"
              }`}>
                {selectedApp.status}
              </Badge>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
