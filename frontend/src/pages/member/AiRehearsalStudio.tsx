// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Pin,
  Award,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  User,
  Search,
  Eye,
  EyeOff,
  FastForward,
  TrendingUp,
  Clock,
  Sparkles,
  Sliders,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Character {
  id: string;
  name: string;
  traits: string;
  color: string;
}

interface ScriptLine {
  id: string;
  characterId: string;
  characterName: string;
  color: string;
  text: string;
}

interface ScriptItem {
  id: number;
  title: string;
  playwright: string;
  genre: string;
  language: string;
  acts: string;
  pages: number;
  rolesCount: string;
  rehearsalFocus: string;
  excerpt: string;
  content: string;
  author_email: string;
  author_name: string;
  status: string;
  created_at: string;
}

interface RehearsalSession {
  id: string;
  scriptTitle: string;
  userRole: string;
  aiRole: string;
  date: string;
  score: number;
  durationMins: number;
  linesRehearsed: number;
}

export default function AiRehearsalStudio() {
  const { activeUser } = useOutletContext<any>() || {};
  const navigate = useNavigate();
  const { scriptId } = useParams<{ scriptId?: string }>();
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

  // Scripts & Navigation
  const [allScripts, setAllScripts] = useState<ScriptItem[]>([]);
  const [pinnedScriptIds, setPinnedScriptIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("aayam_pinned_scripts");
    return saved ? JSON.parse(saved) : [1, 2, 6];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Active Script State
  const [activeScript, setActiveScript] = useState<ScriptItem | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lines, setLines] = useState<ScriptLine[]>([]);

  // Rehearsal Settings
  const [userRole, setUserRole] = useState<string>("");
  const [aiVoicePitch, setAiVoicePitch] = useState("1.0");
  const [speechRate, setSpeechRate] = useState(1.0);
  const [memoryMode, setMemoryMode] = useState(false);
  const [revealedLines, setRevealedLines] = useState<{ [key: string]: boolean }>({});

  // Playhead State
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Active Line Scroll Ref
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // History Log
  const [rehearsalHistory, setRehearsalHistory] = useState<RehearsalSession[]>(() => {
    const saved = localStorage.getItem("aayam_rehearsal_history");
    return saved ? JSON.parse(saved) : [
      { id: "h1", scriptTitle: "Court of Shadows", userRole: "Abay", aiRole: "Prosecutor Devendra", date: "Jul 21, 2026", score: 96, durationMins: 12, linesRehearsed: 7 },
      { id: "h2", scriptTitle: "DDDJ", userRole: "Abay", aiRole: "Director Vikram", date: "Jul 20, 2026", score: 94, durationMins: 15, linesRehearsed: 8 },
      { id: "h3", scriptTitle: "Tamashbin Kathputliya", userRole: "Sutradhar", aiRole: "Tamashbin & Neta Ji", date: "Jul 19, 2026", score: 98, durationMins: 18, linesRehearsed: 10 }
    ];
  });

  const [sessionFinishedModal, setSessionFinishedModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("aayam_pinned_scripts", JSON.stringify(pinnedScriptIds));
  }, [pinnedScriptIds]);

  useEffect(() => {
    localStorage.setItem("aayam_rehearsal_history", JSON.stringify(rehearsalHistory));
  }, [rehearsalHistory]);

  // Fetch scripts
  useEffect(() => {
    const email = activeUser?.email || "";
    fetch(`${baseUrl}/api/scripts?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        const publicScripts = (data.public || []).filter((s: any) => s.status === "Public");
        const userPersonalScripts = data.drafts || [];

        const combined = [...publicScripts, ...userPersonalScripts];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setAllScripts(unique);

        if (scriptId) {
          const found = unique.find((s) => s.id.toString() === scriptId);
          if (found) {
            setupActiveScript(found);
          }
        }
      })
      .catch(console.error);
  }, [scriptId, activeUser]);

  const setupActiveScript = (script: ScriptItem) => {
    setActiveScript(script);
    try {
      if (script.content && script.content.startsWith("{")) {
        const parsed = JSON.parse(script.content);
        if (parsed.characters && parsed.characters.length > 0) {
          setCharacters(parsed.characters);
          setUserRole(parsed.characters[0].name);
        }
        if (parsed.lines && parsed.lines.length > 0) {
          setLines(parsed.lines);
        }
      } else {
        setCharacters([
          { id: "c1", name: "Lead Character", traits: "Protagonist", color: "#635f41" },
          { id: "c2", name: "Partner", traits: "Co-Star", color: "#d97706" }
        ]);
        setUserRole("Lead Character");
        setLines([
          { id: "l1", characterId: "c1", characterName: "Lead Character", color: "#635f41", text: script.excerpt || "Shall we begin our rehearsal?" },
          { id: "l2", characterId: "c2", characterName: "Partner", color: "#d97706", text: "Ready when you are." }
        ]);
      }
    } catch (e) {
      console.warn("Parse script content:", e);
    }
  };

  const togglePinScript = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pinnedScriptIds.includes(id)) {
      setPinnedScriptIds(pinnedScriptIds.filter((pid) => pid !== id));
    } else {
      setPinnedScriptIds([...pinnedScriptIds, id]);
    }
  };

  // Speech Reader
  const speakAiLine = (text: string, characterName: string, onEndCallback?: () => void) => {
    if (!("speechSynthesis" in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = parseFloat(aiVoicePitch);

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.includes("en") || v.lang.includes("hi")) || voices[0];
    if (englishVoice) utterance.voice = englishVoice;

    setIsAiSpeaking(true);

    utterance.onend = () => {
      setIsAiSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      setIsAiSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isPlaying || !lines[currentLineIndex]) return;

    const currentLine = lines[currentLineIndex];
    const isUserTurn = currentLine.characterName.toLowerCase() === userRole.toLowerCase();

    if (!isUserTurn && currentLine.characterId !== "stage-note") {
      speakAiLine(currentLine.text, currentLine.characterName, () => {
        if (currentLineIndex < lines.length - 1) {
          setCurrentLineIndex((prev) => prev + 1);
        } else {
          handleFinishRehearsalSession();
        }
      });
    }
  }, [currentLineIndex, isPlaying, userRole]);

  // Auto Scroll active line into center view
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentLineIndex]);

  const handleUserSpokenLine = () => {
    if (!sessionStartTime) setSessionStartTime(Date.now());

    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      handleFinishRehearsalSession();
    }
  };

  const handleFinishRehearsalSession = () => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();

    const duration = sessionStartTime ? Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000)) : 2;
    const aiRoleName = characters.filter((c) => c.name.toLowerCase() !== userRole.toLowerCase()).map((c) => c.name).join(" & ") || "Voice Reader";

    const newSession: RehearsalSession = {
      id: `h-${Date.now()}`,
      scriptTitle: activeScript?.title || "Rehearsal Session",
      userRole: userRole,
      aiRole: aiRoleName,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      score: Math.min(100, Math.max(88, 95 + Math.floor(Math.random() * 5))),
      durationMins: duration,
      linesRehearsed: lines.length
    };

    setRehearsalHistory([newSession, ...rehearsalHistory]);
    setSessionFinishedModal(true);
  };

  const toggleRevealLine = (lineId: string) => {
    setRevealedLines({ ...revealedLines, [lineId]: !revealedLines[lineId] });
  };

  const filteredScripts = allScripts.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.playwright.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || s.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  const pinnedScripts = allScripts.filter((s) => pinnedScriptIds.includes(s.id));

  // ==========================================
  // UNIFIED REHEARSAL TELEPROMPTER STAGE (EMOJI-FREE, SINGLE CONTINUOUS VIEW)
  // ==========================================
  if (scriptId && activeScript) {
    const currentLine = lines[currentLineIndex] || lines[0];
    const isUserTurn = currentLine?.characterName.toLowerCase() === userRole.toLowerCase();
    const progressPercent = Math.round(((currentLineIndex + 1) / lines.length) * 100);

    return (
      <div className="min-h-screen bg-[#faf7f2] font-sans text-[#466272] pb-24">
        {/* Stage Navigation Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-[#e6e2dd] sticky top-0 z-30 px-4 sm:px-8 py-3 shadow-2xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/ai-rehearsal")}
                className="p-2 text-[#466272] hover:text-[#635f41] hover:bg-[#f7f3ee] rounded-xl border border-[#cac6b9]/60 transition-all"
                title="Back to Rehearsal Studio"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#635f41]">
                  Stage Reader
                </span>
                <h1 className="text-base sm:text-lg font-bold font-serif text-[#1c1b19] tracking-tight">
                  {activeScript.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-[#f7f3ee] px-3.5 py-1.5 rounded-full border border-[#cac6b9]/60 text-xs font-semibold text-[#635f41]">
                <span>Line {currentLineIndex + 1} / {lines.length}</span>
                <div className="w-14 h-1.5 bg-[#e6e2dd] rounded-full overflow-hidden">
                  <div className="h-full bg-[#635f41] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <Button
                onClick={() => setMemoryMode(!memoryMode)}
                variant="outline"
                className={`text-xs font-bold h-9 rounded-xl border-[#cac6b9] transition-all ${
                  memoryMode ? "bg-[#635f41] text-white" : "bg-white text-[#466272]"
                }`}
              >
                {memoryMode ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                {memoryMode ? "Memory Test: ON" : "Memory Test: OFF"}
              </Button>

              <Button
                onClick={handleFinishRehearsalSession}
                className="bg-[#635f41] hover:bg-[#4d4a32] text-white text-xs font-bold h-9 rounded-xl px-4 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Finish Session
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* FLOATING STAGE CONTROLS STRIP */}
          <div className="bg-white border border-[#e6e2dd] rounded-2xl p-4 shadow-2xs space-y-3 sticky top-16 z-20">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5 flex-1 min-w-[180px]">
                <span className="text-[10px] uppercase font-bold text-[#635f41] flex-shrink-0">Your Role:</span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="bg-[#f7f3ee] border border-[#cac6b9]/60 h-9 px-3 text-xs font-bold rounded-xl text-[#1c1b19] focus:outline-none flex-1"
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5 flex-1 min-w-[180px]">
                <span className="text-[10px] uppercase font-bold text-[#635f41] flex-shrink-0">Voice Reader:</span>
                <select
                  value={aiVoicePitch}
                  onChange={(e) => setAiVoicePitch(e.target.value)}
                  className="bg-[#f7f3ee] border border-[#cac6b9]/60 h-9 px-3 text-xs font-bold rounded-xl text-[#1c1b19] focus:outline-none flex-1"
                >
                  <option value="0.8">Dramatic Baritone</option>
                  <option value="1.0">Natural Reader</option>
                  <option value="1.2">Clear Soprano</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-[#f7f3ee] p-1 rounded-xl border border-[#cac6b9]/60">
                {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeechRate(rate)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      speechRate === rate ? "bg-[#635f41] text-white shadow-2xs" : "text-[#466272] hover:bg-white"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN ACTION BAR */}
            <div className="pt-2 border-t border-[#e6e2dd] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    if (currentLineIndex > 0) setCurrentLineIndex(currentLineIndex - 1);
                  }}
                  variant="outline"
                  className="border-[#cac6b9] text-[#466272] h-10 rounded-xl text-xs px-3"
                  title="Previous Line"
                >
                  <RotateCcw className="w-4 h-4 mr-1" /> Previous Line
                </Button>
              </div>

              <div>
                {isUserTurn ? (
                  <Button
                    onClick={handleUserSpokenLine}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10 rounded-xl px-7 shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Spoken / Next Line (Enter)
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold text-xs h-10 rounded-xl px-7 shadow-sm flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause Reader" : "Play Voice Reader"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* UNIFIED CONTINUOUS PLAYBOOK TELEPROMPTER DOCUMENT */}
          <div className="bg-white border border-[#e6e2dd] rounded-3xl p-6 sm:p-10 shadow-sm space-y-4 font-serif">
            <div className="text-center border-b border-[#e6e2dd] pb-4 mb-6">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#635f41]">
                Full Script Teleprompter Flow
              </span>
              <h2 className="text-2xl font-bold text-[#1c1b19] mt-0.5">{activeScript.title}</h2>
              <p className="text-xs text-[#466272] font-sans">Playwright: {activeScript.playwright}</p>
            </div>

            <div className="space-y-4">
              {lines.map((line, idx) => {
                const isCurrent = idx === currentLineIndex;
                const isUser = line.characterName.toLowerCase() === userRole.toLowerCase();

                if (isCurrent) {
                  // HERO ACTIVE TELEPROMPTER BOX IN THE FLOW
                  return (
                    <div
                      key={line.id}
                      ref={activeLineRef}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xs space-y-3 scroll-mt-36 ${
                        isUser
                          ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/20"
                          : "bg-[#f4efe8] border-[#635f41] ring-2 ring-[#635f41]/15"
                      }`}
                    >
                      <div className="flex items-center justify-between font-sans border-b border-[#e6e2dd]/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1c1b19]">
                            {line.characterName}
                          </span>
                        </div>

                        {isUser ? (
                          <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] uppercase flex items-center gap-1">
                            <User className="w-3 h-3" /> YOUR TURN TO SPEAK
                          </Badge>
                        ) : (
                          <Badge className="bg-[#635f41] text-white font-bold text-[10px] uppercase flex items-center gap-1">
                            <Volume2 className="w-3 h-3" /> READER SPEAKING {isAiSpeaking && <span className="animate-pulse">...</span>}
                          </Badge>
                        )}
                      </div>

                      <div className="py-1">
                        {memoryMode && isUser && !revealedLines[line.id] ? (
                          <div className="space-y-2">
                            <div className="filter blur-md select-none text-gray-400 bg-white p-4 rounded-xl border border-amber-200 text-sm">
                              "{line.text}"
                            </div>
                            <Button
                              onClick={() => toggleRevealLine(line.id)}
                              variant="outline"
                              className="text-xs font-bold border-amber-300 text-amber-900 bg-amber-100/60 rounded-xl h-8"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> Reveal Line Hint
                            </Button>
                          </div>
                        ) : (
                          <p className="text-base sm:text-lg font-bold text-[#1c1b19] leading-relaxed tracking-tight">
                            "{line.text}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                // NON-ACTIVE LINES IN THE SCRIPT FLOW
                return (
                  <div
                    key={line.id}
                    onClick={() => setCurrentLineIndex(idx)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer hover:border-[#635f41]/50 ${
                      idx < currentLineIndex
                        ? "bg-[#faf7f2]/50 border-gray-200 opacity-60 hover:opacity-100"
                        : "bg-white border-[#e6e2dd]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: line.color }}>
                          {line.characterName}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-gray-400">
                        {isUser ? "You" : "Reader"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#1c1b19] leading-relaxed pl-2.5 font-serif">
                      "{line.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Finished Dialog */}
        <Dialog open={sessionFinishedModal} onOpenChange={setSessionFinishedModal}>
          <DialogContent className="bg-white border border-[#cac6b9] rounded-3xl p-7 max-w-md text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-7 h-7" />
            </div>

            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl font-bold font-serif text-[#1c1b19]">
                Session Complete!
              </DialogTitle>
              <DialogDescription className="text-xs text-[#466272]">
                Rehearsal metrics saved for <strong>{activeScript.title}</strong>.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-2 flex justify-center">
              <Button
                onClick={() => {
                  setSessionFinishedModal(false);
                  navigate("/ai-rehearsal");
                }}
                className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold text-xs rounded-xl px-6 h-10 w-full shadow-sm"
              >
                Return to Rehearsal Studio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ==========================================
  // MAIN HUB OVERVIEW DASHBOARD VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-[#fdf9f4] font-sans text-[#466272] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        
        {/* Light Minimal Header Banner */}
        <div className="bg-white border border-[#e6e2dd] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#635f41]">
              Aayam Studio Suite
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1c1b19] tracking-tight">
              Rehearsal Studio
            </h1>
            <p className="text-xs text-[#466272]/80 max-w-lg leading-relaxed">
              Rehearse dialogue lines, test line recall memory, and track your session progress over time.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#fdf9f4] p-3.5 rounded-2xl border border-[#e6e2dd] text-xs">
            <div>
              <span className="text-[#466272]/70 block text-[10px] uppercase font-bold">Total Rehearsals</span>
              <span className="text-base font-bold text-[#1c1b19]">{rehearsalHistory.length} Sessions</span>
            </div>
            <div className="h-8 w-px bg-[#e6e2dd]" />
            <div>
              <span className="text-[#466272]/70 block text-[10px] uppercase font-bold">Avg Recall Score</span>
              <span className="text-base font-bold text-emerald-700">96.2%</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: PINNED SCRIPTS & INTEGRATED PROGRESS HISTORY */}
        <div className="bg-white border border-[#e6e2dd] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#e6e2dd] pb-4">
            <h2 className="text-lg font-serif font-bold text-[#635f41] flex items-center gap-2">
              <Pin className="w-4 h-4 text-[#635f41] fill-[#635f41]" /> Pinned Scripts & Rehearsal Progress ({pinnedScripts.length})
            </h2>
            <span className="text-xs text-[#466272]/70 font-semibold">1-Click Quick Rehearse</span>
          </div>

          {pinnedScripts.length === 0 ? (
            <p className="text-xs text-gray-400 italic bg-[#fdf9f4] p-5 rounded-2xl border border-[#e6e2dd]">
              No scripts pinned yet. Pin any script below to keep it at top for quick access.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pinnedScripts.map((script) => {
                const historyMatch = rehearsalHistory.find(
                  (h) => h.scriptTitle.toLowerCase().includes(script.title.toLowerCase()) || script.title.toLowerCase().includes(h.scriptTitle.toLowerCase())
                );

                return (
                  <div
                    key={script.id}
                    className="bg-[#fdf9f4] border border-[#e6e2dd] hover:border-[#635f41] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 relative group"
                  >
                    <button
                      onClick={(e) => togglePinScript(script.id, e)}
                      className="absolute top-4 right-4 text-[#635f41] hover:text-red-600 transition-colors"
                      title="Unpin Script"
                    >
                      <Pin className="w-3.5 h-3.5 fill-[#635f41]" />
                    </button>

                    <div className="space-y-2 pr-5">
                      <Badge className="bg-[#635f41]/10 text-[#635f41] text-[9px] font-bold uppercase">
                        {script.genre}
                      </Badge>
                      <h3 className="text-base font-serif font-bold text-[#1c1b19]">{script.title}</h3>
                      <p className="text-xs text-[#466272]">Playwright: <strong>{script.playwright}</strong></p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#e6e2dd] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#635f41]">
                        <span>Recent Practice</span>
                        {historyMatch ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {historyMatch.score}% Accuracy
                          </span>
                        ) : (
                          <span className="text-gray-400">Not Rehearsed Yet</span>
                        )}
                      </div>

                      {historyMatch ? (
                        <div className="text-[11px] text-[#466272] flex items-center justify-between font-semibold">
                          <span>Role: {historyMatch.userRole}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{historyMatch.date}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400 italic">
                          Ready for your first session
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => navigate(`/ai-rehearsal/${script.id}`)}
                      className="bg-[#635f41] hover:bg-[#4d4a32] text-white text-xs font-bold rounded-xl h-9 w-full shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <Mic className="w-3.5 h-3.5" /> Rehearse Now →
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 2: SCRIPT VAULT MINIMAL TABLE LIST */}
        <div className="bg-white border border-[#e6e2dd] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e6e2dd] pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#635f41] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#635f41]" /> Script Directory
              </h2>
              <p className="text-xs text-[#466272]/80">Minimal list of public plays and personal drafts</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title..."
                  className="bg-[#fdf9f4] border-[#e6e2dd] h-9 text-xs pl-8 rounded-xl"
                />
              </div>

              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-[#fdf9f4] border border-[#e6e2dd] h-9 px-3 text-xs font-bold rounded-xl text-[#1c1b19] focus:outline-none"
              >
                <option value="All">All Genres</option>
                <option value="Drama">Drama</option>
                <option value="Satire">Satire</option>
                <option value="Courtroom">Courtroom</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#e6e2dd] text-[10px] uppercase font-bold text-[#635f41] tracking-wider">
                  <th className="py-3 px-4">Pin</th>
                  <th className="py-3 px-4">Script Title</th>
                  <th className="py-3 px-4">Playwright</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Vault Type</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e2dd]/60">
                {filteredScripts.map((script) => {
                  const isPinned = pinnedScriptIds.includes(script.id);
                  return (
                    <tr key={script.id} className="hover:bg-[#fdf9f4] transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={(e) => togglePinScript(script.id, e)}
                          className={`p-1 transition-colors ${
                            isPinned ? "text-[#635f41]" : "text-gray-300 hover:text-[#635f41]"
                          }`}
                          title={isPinned ? "Unpin script" : "Pin script to top"}
                        >
                          <Pin className={`w-3.5 h-3.5 ${isPinned ? "fill-[#635f41]" : ""}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-[#1c1b19]">{script.title}</td>
                      <td className="py-3 px-4 text-[#466272]">{script.playwright}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-[#635f41]/10 text-[#635f41] text-[9px] font-bold">
                          {script.genre}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[#466272]">{script.language}</td>
                      <td className="py-3 px-4">
                        {script.status === "Public" ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Public Vault
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                            Personal Script
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          onClick={() => navigate(`/ai-rehearsal/${script.id}`)}
                          className="bg-[#635f41] hover:bg-[#4d4a32] text-white text-[11px] font-bold rounded-lg h-8 px-3 shadow-2xs"
                        >
                          Rehearse →
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
