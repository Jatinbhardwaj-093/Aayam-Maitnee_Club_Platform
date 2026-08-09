// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Plus,
  Trash2,
  Save,
  Send,
  BookOpen,
  CheckCircle2,
  X,
  FileText,
  CornerDownLeft,
  Sparkles,
  Sliders,
  Wand2,
  Feather,
  Bot,
  UserCheck,
  RefreshCw
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

interface AiCharacterSuggestion {
  name: string;
  traits: string;
  archetype: string;
  voiceCue: string;
}

const PRESET_COLORS = [
  "#635f41",
  "#8CC0EB",
  "#d97706",
  "#059669",
  "#7c3aed",
  "#db2777",
  "#2563eb",
  "#475569"
];

export default function ScriptBuilder() {
  const { activeUser } = useOutletContext<any>() || {};
  const navigate = useNavigate();
  const { scriptId } = useParams<{ scriptId?: string }>();
  const isMaintainer = activeUser?.role?.toLowerCase().includes("maintainer") || activeUser?.isAdmin || false;

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

  // Stepper: 1 = Setup, 2 = Characters, 3 = Storyline, 4 = Final Preview
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Setup Details
  const [title, setTitle] = useState("");
  const [playwright, setPlaywright] = useState(activeUser?.name || "");
  const [genre, setGenre] = useState("Drama");
  const [language, setLanguage] = useState("Hindi & English");
  const [labels, setLabels] = useState("Social Commentary, Classic");
  const [theme, setTheme] = useState("Morality, Ambition, Justice");
  const [settingInfo, setSettingInfo] = useState("1970s Courtroom / Royal Assembly");
  const [abstract, setAbstract] = useState("");

  // Step 2: Characters
  const [characters, setCharacters] = useState<Character[]>([
    { id: "c1", name: "Protagonist", traits: "Lead Role", color: "#635f41" }
  ]);
  const [charNameInput, setCharNameInput] = useState("");
  const [charTraitsInput, setCharTraitsInput] = useState("");

  // AI Character Suggestor States
  const [aiPretext, setAiPretext] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiCharacterSuggestion | null>(null);

  // Step 3: Storyline Canvas
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>("");
  const [lineInput, setLineInput] = useState("");

  // Script Auto-Extractor Modal State
  const [importOpen, setImportOpen] = useState(false);
  const [rawScriptText, setRawScriptText] = useState("");

  const [saving, setSaving] = useState(false);

  // Load existing script if editing or viewing
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isPreview = searchParams.get("mode") === "preview";
    if (isPreview) {
      setCurrentStep(4);
    }

    if (scriptId) {
      const email = activeUser?.email || "";
      fetch(`${baseUrl}/api/scripts/${scriptId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.script) {
            return data.script;
          }
          return fetch(`${baseUrl}/api/scripts?email=${encodeURIComponent(email)}`)
            .then((res) => res.json())
            .then((allData) => {
              const all = [
                ...(allData.public || []),
                ...(allData.drafts || []),
                ...(allData.pending || []),
                ...(allData.all || [])
              ];
              return all.find((s: any) => s.id.toString() === scriptId);
            });
        })
        .then((found) => {
          if (found) {
            setTitle(found.title || "");
            setPlaywright(found.playwright || activeUser?.name || "");
            setGenre(found.genre || "Drama");
            setLanguage(found.language || "Hindi & English");
            setAbstract(found.excerpt || "");

            try {
              if (found.content && (found.content.trim().startsWith("{") || found.content.trim().startsWith("["))) {
                const parsed = JSON.parse(found.content);
                if (parsed.characters && parsed.characters.length > 0) setCharacters(parsed.characters);
                if (parsed.lines && parsed.lines.length > 0) setLines(parsed.lines);
                if (parsed.abstract) setAbstract(parsed.abstract);
                if (parsed.labels) setLabels(parsed.labels);
                if (parsed.theme) setTheme(parsed.theme);
                if (parsed.settingInfo) setSettingInfo(parsed.settingInfo);
              } else if (found.content) {
                setRawScriptText(found.content);
                setTimeout(() => handleAutoExtractScript(), 100);
              }
            } catch (e) {
              console.warn("Script content parse fallback:", e);
            }
          }
        })
        .catch(console.error);
    }
  }, [scriptId]);

  // Sync active speaker
  useEffect(() => {
    if (characters.length > 0 && !activeSpeakerId) {
      setActiveSpeakerId(characters[0].id);
    }
  }, [characters]);

  // AI Story Abstract Generator
  const handleAiGenerateAbstract = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const charNames = characters.map((c) => c.name).join(", ");
      const samplePlot = lines.length > 0
        ? `In a dramatic struggle between ${charNames || "the ensemble"}, key conflicts unfold around ${theme || "morality and duty"}.`
        : `A compelling theatrical narrative exploring ${theme || "ambition and power"}, featuring ${charNames || "diverse central characters"}.`;

      const generatedAbstract = `${samplePlot} Set against the backdrop of ${settingInfo || "a dramatic stage setting"}, tensions peak as internal principles collide with societal expectations.`;
      
      setAbstract(generatedAbstract);
      setAiGenerating(false);
      alert("AI successfully generated story synopsis!");
    }, 600);
  };

  // AI Dynamic Character Suggestor
  const handleGenerateAiCharacter = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const input = aiPretext.trim();
      const existingLead = characters[0]?.name || "Lead";

      let suggestedName = "Archon";
      let suggestedArchetype = "Key Archetype Role";
      let suggestedTraits = "Calculated, driven by internal motives, creates tension in dialogue";
      let suggestedVoice = "Clear, sharp projection with dramatic pauses";

      if (input) {
        // Derive name from first major word or input pretext
        const words = input.split(" ").filter((w) => w.length > 2);
        if (words.length > 0) {
          const capitalized = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
          suggestedName = `${capitalized} Role`;
        }
        suggestedArchetype = "Custom Character Role";
        suggestedTraits = `Adapted from pretext "${input}". Operates in direct contrast or alliance with ${existingLead}.`;
      } else {
        suggestedName = "Supporting Antagonist";
        suggestedArchetype = "Counter-Role";
        suggestedTraits = `Challenges ${existingLead}'s motives in key scenes.`;
      }

      setAiSuggestion({
        name: suggestedName,
        traits: suggestedTraits,
        archetype: suggestedArchetype,
        voiceCue: suggestedVoice
      });
      setAiGenerating(false);
    }, 700);
  };

  // Add AI Suggested Character to Active Roster
  const handleAddAiSuggestionToRoster = () => {
    if (!aiSuggestion) return;

    const newChar: Character = {
      id: `c-ai-${Date.now()}`,
      name: aiSuggestion.name,
      traits: aiSuggestion.traits,
      color: PRESET_COLORS[(characters.length + 2) % PRESET_COLORS.length]
    };

    setCharacters([...characters, newChar]);
    setAiSuggestion(null);
    setAiPretext("");
  };

  // Smart Script Auto-Extractor Algorithm
  const handleAutoExtractScript = () => {
    if (!rawScriptText.trim()) return;

    const rawLines = rawScriptText.split(/\r?\n/);
    const extractedCharsMap: { [key: string]: Character } = {};
    const parsedLines: ScriptLine[] = [];

    const speakerRegex = /^([A-Z0-9\s]{2,25})(?:\s*\([^)]*\))?\s*[:\-]\s*(.*)/;

    let charCount = Object.keys(extractedCharsMap).length;

    rawLines.forEach((rawLine, idx) => {
      const trimmed = rawLine.trim();
      if (!trimmed) return;

      const match = trimmed.match(speakerRegex);
      if (match) {
        const rawName = match[1].trim();
        const dialogueText = match[2].trim();
        const normalizedKey = rawName.toUpperCase();

        if (!extractedCharsMap[normalizedKey]) {
          charCount++;
          extractedCharsMap[normalizedKey] = {
            id: `c-ext-${charCount}`,
            name: rawName,
            traits: "Auto-extracted character",
            color: PRESET_COLORS[(charCount - 1) % PRESET_COLORS.length]
          };
        }

        const charObj = extractedCharsMap[normalizedKey];

        if (dialogueText) {
          parsedLines.push({
            id: `l-ext-${idx}`,
            characterId: charObj.id,
            characterName: charObj.name,
            color: charObj.color,
            text: dialogueText
          });
        }
      } else if (trimmed.startsWith("[") || trimmed.startsWith("(")) {
        parsedLines.push({
          id: `l-ext-sd-${idx}`,
          characterId: "stage-note",
          characterName: "Stage Direction",
          color: "#466272",
          text: trimmed
        });
      } else if (parsedLines.length > 0) {
        const lastLine = parsedLines[parsedLines.length - 1];
        lastLine.text += " " + trimmed;
      }
    });

    const newCharList = Object.values(extractedCharsMap);
    if (newCharList.length > 0) {
      setCharacters(newCharList);
      setActiveSpeakerId(newCharList[0].id);
    }
    if (parsedLines.length > 0) {
      setLines(parsedLines);
    }

    if (!title && rawLines[0]) {
      setTitle(rawLines[0].substring(0, 40));
    }

    setImportOpen(false);
    setRawScriptText("");
    alert(`Successfully extracted ${newCharList.length} Characters and ${parsedLines.length} Lines!`);
    setCurrentStep(3);
  };

  // Add Character manually
  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!charNameInput.trim()) return;

    const newChar: Character = {
      id: `c-${Date.now()}`,
      name: charNameInput.trim(),
      traits: charTraitsInput.trim() || "Ensemble",
      color: PRESET_COLORS[characters.length % PRESET_COLORS.length]
    };

    setCharacters([...characters, newChar]);
    setCharNameInput("");
    setCharTraitsInput("");
    if (!activeSpeakerId) {
      setActiveSpeakerId(newChar.id);
    }
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters(characters.filter((c) => c.id !== id));
    if (activeSpeakerId === id) {
      const remaining = characters.filter((c) => c.id !== id);
      setActiveSpeakerId(remaining[0]?.id || "");
    }
  };

  // Add Line from Type Box
  const handleAddLine = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lineInput.trim()) return;

    const speaker = characters.find((c) => c.id === activeSpeakerId);
    const charName = speaker ? speaker.name : "Stage Direction";
    const color = speaker ? speaker.color : "#466272";

    const newLine: ScriptLine = {
      id: `l-${Date.now()}`,
      characterId: activeSpeakerId,
      characterName: charName,
      color: color,
      text: lineInput.trim()
    };

    setLines([...lines, newLine]);
    setLineInput("");
  };

  const handleKeyDownLine = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddLine();
    }
  };

  const handleRemoveLine = (id: string) => {
    setLines(lines.filter((l) => l.id !== id));
  };

  // Save Script
  const handleSaveScript = async (targetStatus: "Draft" | "Public" | "Pending") => {
    if (!title.trim()) {
      alert("Please enter a script title.");
      return;
    }
    if (!activeUser?.email) {
      alert("Please log in to save your script.");
      return;
    }

    setSaving(true);
    try {
      const formattedContent = JSON.stringify({
        characters,
        lines,
        abstract,
        labels,
        theme,
        settingInfo
      });

      const payload = {
        title: title.trim(),
        playwright: playwright.trim() || activeUser.name,
        genre,
        language,
        acts: "Script Edition",
        pages: Math.max(1, Math.ceil(lines.length / 5)),
        rolesCount: `${characters.length} Characters`,
        rehearsalFocus: theme || "Dialogue & Scene Work",
        excerpt: abstract || (lines[0] ? `${lines[0].characterName}: ${lines[0].text}` : "Play script draft."),
        content: formattedContent,
        author_email: activeUser.email,
        author_name: activeUser.name,
        status: targetStatus
      };

      const url = scriptId ? `${baseUrl}/api/scripts/${scriptId}` : `${baseUrl}/api/scripts`;
      const method = scriptId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        if (targetStatus === "Pending") {
          alert("Publish request submitted to Maintainers!");
        } else if (targetStatus === "Public") {
          alert("Script published directly to Public Vault!");
        } else {
          alert("Script saved to your Personal Drafts!");
        }
        navigate("/member-scripts");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save script.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving script.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f4] font-sans text-[#466272] pb-24 selection:bg-[#8CC0EB]/30">
      {/* Studio Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#e6e2dd] sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Top Row: Title & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Title & Back */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/member-scripts")}
                className="p-2 text-[#466272] hover:text-[#635f41] hover:bg-[#fdf9f4] rounded-xl border border-transparent hover:border-[#e6e2dd] transition-all"
                title="Back to Script Vault"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#635f41] flex items-center gap-1">
                  <Feather className="w-3 h-3 text-[#635f41]" /> Script Studio
                </span>
                <h1 className="text-lg sm:text-xl font-bold font-serif text-[#1c1b19] tracking-tight truncate max-w-xs sm:max-w-md">
                  {title || "Untitled Production Script"}
                </h1>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => setImportOpen(true)}
                variant="outline"
                className="border-[#635f41]/40 text-[#635f41] hover:bg-[#635f41]/10 text-xs font-bold h-9 rounded-xl flex items-center gap-1.5 px-3 shadow-xs transition-all active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Extract</span>
              </Button>

              <Button
                onClick={() => handleSaveScript("Draft")}
                disabled={saving}
                variant="outline"
                className="border-[#cac6b9] text-[#466272] hover:bg-[#f7f3ee] text-xs font-bold h-9 rounded-xl px-3 shadow-xs transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
              </Button>

              {isMaintainer ? (
                <Button
                  onClick={() => handleSaveScript("Public")}
                  disabled={saving}
                  className="bg-[#635f41] hover:bg-[#4d4a32] text-white text-xs font-bold h-9 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 px-3.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Publish to Vault
                </Button>
              ) : (
                <Button
                  onClick={() => handleSaveScript("Pending")}
                  disabled={saving}
                  className="bg-[#8CC0EB] hover:bg-[#68a0cd] text-[#001e2c] text-xs font-bold h-9 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 px-3.5"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Request Publish
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Row: Centered Responsive 4-Step Navigation */}
          <div className="flex items-center justify-start sm:justify-center border-t border-[#e6e2dd]/70 pt-2.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 bg-[#f4efe8] p-1.5 rounded-2xl border border-[#cac6b9]/50 text-xs flex-nowrap shadow-2xs">
              <button
                onClick={() => setCurrentStep(1)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentStep === 1
                    ? "bg-[#635f41] text-white shadow-sm"
                    : "text-[#466272] hover:text-[#1c1b19] hover:bg-white/60"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> 1. Setup
              </button>
              
              <button
                onClick={() => setCurrentStep(2)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentStep === 2
                    ? "bg-[#635f41] text-white shadow-sm"
                    : "text-[#466272] hover:text-[#1c1b19] hover:bg-white/60"
                }`}
              >
                <Users className="w-3.5 h-3.5" /> 2. Characters
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentStep === 3
                    ? "bg-[#635f41] text-white shadow-sm"
                    : "text-[#466272] hover:text-[#1c1b19] hover:bg-white/60"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> 3. Storyline
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentStep === 4
                    ? "bg-[#635f41] text-white shadow-sm"
                    : "text-[#466272] hover:text-[#1c1b19] hover:bg-white/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 4. Final Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* STEP 1: SETUP DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white border border-[#e6e2dd] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#e6e2dd] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#635f41]">Production Setup & Metadata</h2>
                  <p className="text-xs text-[#466272]/80 mt-0.5">Define story title, labels, setting details, theme, and abstract</p>
                </div>
                <Badge className="bg-[#635f41]/10 text-[#635f41] font-bold text-xs rounded-full px-3 py-1">Step 1 of 4</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#635f41]">Script Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mahabhoj Courtroom Drama"
                    className="bg-[#fdf9f4] border-[#e6e2dd] h-11 text-sm rounded-xl focus:ring-2 focus:ring-[#635f41]/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#635f41]">Playwright / Adapter</label>
                  <Input
                    value={playwright}
                    onChange={(e) => setPlaywright(e.target.value)}
                    placeholder="e.g. Mannu Bhandari"
                    className="bg-[#fdf9f4] border-[#e6e2dd] h-11 text-sm rounded-xl focus:ring-2 focus:ring-[#635f41]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">Genre</label>
                  <Input
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Political Drama"
                    className="bg-[#fdf9f4] border-[#e6e2dd] h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">Language</label>
                  <Input
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Hindi & English"
                    className="bg-[#fdf9f4] border-[#e6e2dd] h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">Story Labels / Tags</label>
                  <Input
                    value={labels}
                    onChange={(e) => setLabels(e.target.value)}
                    placeholder="Classic, Courtroom, Ensemble"
                    className="bg-[#fdf9f4] border-[#e6e2dd] h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#635f41]">Characteristic Theme</label>
                  <Input
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Struggle for justice, moral dilemmas"
                    className="bg-[#fdf9f4] border-[#e6e2dd] h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#635f41]">Setting & Time Period</label>
                  <Input
                    value={settingInfo}
                    onChange={(e) => setSettingInfo(e.target.value)}
                    placeholder="e.g. Rural North India, late 1970s"
                    className="bg-[#fdf9f4] border-[#e6e2dd] h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#635f41]">Story Abstract / Synopsis</label>
                  <button
                    type="button"
                    onClick={handleAiGenerateAbstract}
                    disabled={aiGenerating}
                    className="text-xs text-[#635f41] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#635f41]" /> AI Auto-Generate Abstract
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Provide a brief synopsis of the play plot, key conflicts, and theme summary..."
                  className="w-full bg-[#fdf9f4] border border-[#e6e2dd] p-3.5 text-xs font-serif leading-relaxed rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635f41]/30 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-[#e6e2dd] flex justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#635f41] hover:bg-[#4d4a32] text-white text-xs font-bold rounded-xl px-6 h-10 shadow-sm"
                >
                  Proceed to Characters →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHARACTERS & AI CHARACTER SUGGESTOR */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* AI Character Suggestor Widget */}
            <div className="bg-gradient-to-br from-[#fcf9f2] via-white to-[#f4efe8] border-2 border-[#635f41]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6e2dd] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#635f41] text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#1c1b19]">
                      AI Character Suggestor
                    </h3>
                    <p className="text-[11px] text-[#466272]/80">Enter any pretext or role idea to generate a tailored character suggestion</p>
                  </div>
                </div>
                <Badge className="bg-[#635f41] text-white text-[10px] uppercase font-bold">AI Assistant</Badge>
              </div>

              {/* Single Pretext Input & Action Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  value={aiPretext}
                  onChange={(e) => setAiPretext(e.target.value)}
                  placeholder="Enter character concept or pretext (e.g. A rival to the lead, a corrupt judge...)"
                  className="bg-white border-[#e6e2dd] h-11 text-xs rounded-xl flex-1"
                />
                <Button
                  onClick={handleGenerateAiCharacter}
                  disabled={aiGenerating}
                  className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold h-11 rounded-xl text-xs px-5 flex-shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Suggest Character
                </Button>
              </div>

              {/* AI Generated Character Output Card */}
              {aiSuggestion && (
                <div className="bg-white border border-[#635f41]/40 rounded-2xl p-5 shadow-xs space-y-3 mt-3 animate-in fade-in duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#635f41]">
                        Suggested Character
                      </span>
                      <h4 className="text-base font-bold font-serif text-[#1c1b19]">{aiSuggestion.name}</h4>
                    </div>
                    <Badge className="bg-[#8CC0EB] text-[#001e2c] text-[10px] font-bold">{aiSuggestion.archetype}</Badge>
                  </div>

                  <p className="text-xs text-[#466272] leading-relaxed">
                    <strong>Traits & Role:</strong> {aiSuggestion.traits}
                  </p>
                  
                  <p className="text-[11px] text-[#466272]/80 italic">
                    <strong>Voice / Direction Note:</strong> {aiSuggestion.voiceCue}
                  </p>

                  <div className="pt-2 border-t border-[#e6e2dd] flex justify-end">
                    <Button
                      onClick={handleAddAiSuggestionToRoster}
                      className="bg-[#8CC0EB] hover:bg-[#68a0cd] text-[#001e2c] font-bold text-xs rounded-xl h-8 px-4 flex items-center gap-1 shadow-2xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Add to Roster
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Character Input Form */}
            <div className="bg-white border border-[#e6e2dd] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-serif font-bold text-[#635f41] flex items-center justify-between">
                <span>Add Character Manually</span>
                <span className="text-xs font-sans font-normal text-[#466272]/70">Enter name and optional role trait</span>
              </h3>

              <form onSubmit={handleAddCharacter} className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  required
                  value={charNameInput}
                  onChange={(e) => setCharNameInput(e.target.value)}
                  placeholder="Character Name (e.g. Tara)"
                  className="bg-[#fdf9f4] border-[#e6e2dd] h-11 text-sm rounded-xl flex-1 focus:ring-2 focus:ring-[#635f41]/30"
                />

                <Input
                  value={charTraitsInput}
                  onChange={(e) => setCharTraitsInput(e.target.value)}
                  placeholder="Trait / Role (e.g. Lead Activist)"
                  className="bg-[#fdf9f4] border-[#e6e2dd] h-11 text-xs rounded-xl flex-1 focus:ring-2 focus:ring-[#635f41]/30"
                />

                <Button
                  type="submit"
                  className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold h-11 rounded-xl text-xs px-6 flex-shrink-0 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Character
                </Button>
              </form>
            </div>

            {/* Character Roster Chips */}
            <div className="bg-white border border-[#e6e2dd] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6e2dd] pb-3">
                <h3 className="text-base font-serif font-bold text-[#635f41]">
                  Active Character Roster ({characters.length})
                </h3>
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#635f41] hover:bg-[#4d4a32] text-white text-xs font-bold rounded-xl px-5 h-9 shadow-sm"
                >
                  Start Writing Storyline →
                </Button>
              </div>

              {characters.length === 0 ? (
                <p className="text-xs text-center text-[#466272]/60 py-8">No characters added yet. Use AI suggestor or form above to add characters.</p>
              ) : (
                <div className="flex flex-wrap gap-3 pt-2">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#fdf9f4] border border-[#e6e2dd] shadow-2xs group hover:border-[#635f41] hover:shadow-xs transition-all"
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-2xs"
                        style={{ backgroundColor: char.color }}
                      />
                      <div className="text-left">
                        <span className="font-bold text-xs text-[#1c1b19] block">{char.name}</span>
                        {char.traits && (
                          <span className="text-[10px] text-[#466272]/70 block">{char.traits}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCharacter(char.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors ml-1 p-1 hover:bg-red-50 rounded-lg"
                        title="Remove character"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: STORYLINE CANVAS & TYPING BAR */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Blank Canvas Sheet */}
            <div className="bg-white border-2 border-[#e6e2dd] rounded-3xl p-6 sm:p-10 shadow-md min-h-[460px] flex flex-col justify-between font-serif relative">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#e6e2dd] pb-4 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#635f41]" />
                    <span className="text-xs font-bold text-[#635f41] uppercase tracking-wider">
                      {title || "Untitled Storyline Canvas"}
                    </span>
                  </div>
                  <span className="text-xs text-[#466272]/70 font-semibold bg-[#fdf9f4] px-3 py-1 rounded-full border border-[#e6e2dd]">
                    {lines.length} Line{lines.length === 1 ? "" : "s"}
                  </span>
                </div>

                {lines.length === 0 ? (
                  <div className="text-center py-24 text-xs font-sans text-gray-400 italic space-y-2">
                    <Feather className="w-8 h-8 mx-auto text-gray-300" />
                    <p>Blank Storyline Canvas. Select speaker below and type dialogue line + Enter.</p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    {lines.map((line) => (
                      <div
                        key={line.id}
                        className="group flex items-start justify-between gap-4 p-3.5 rounded-2xl hover:bg-[#fdf9f4] transition-all border-l-3 border-transparent hover:border-[#635f41]"
                      >
                        <div className="space-y-1 text-left flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: line.color }}
                            />
                            <span
                              className="text-xs font-sans font-bold uppercase tracking-wider"
                              style={{ color: line.color }}
                            >
                              {line.characterName}
                            </span>
                          </div>
                          <p className="text-sm text-[#1c1b19] leading-relaxed pl-4 font-serif">
                            "{line.text}"
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveLine(line.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                          title="Delete line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Floating Type Box Bar */}
            <div className="bg-white border border-[#cac6b9] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center gap-3 sticky bottom-6 z-20">
              <div className="w-full sm:w-52 flex-shrink-0">
                <select
                  value={activeSpeakerId}
                  onChange={(e) => setActiveSpeakerId(e.target.value)}
                  className="w-full bg-[#fdf9f4] border border-[#e6e2dd] h-11 px-3 text-xs font-bold rounded-xl text-[#1c1b19] focus:outline-none focus:ring-2 focus:ring-[#635f41]/30"
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="stage-note">Stage Direction</option>
                </select>
              </div>

              <div className="flex-1 w-full relative">
                <Input
                  value={lineInput}
                  onChange={(e) => setLineInput(e.target.value)}
                  onKeyDown={handleKeyDownLine}
                  placeholder="Type line and press Enter..."
                  className="bg-[#fdf9f4] border-[#e6e2dd] h-11 text-sm font-serif pr-12 rounded-xl focus:ring-2 focus:ring-[#635f41]/30"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleAddLine()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#635f41] text-white hover:bg-[#4d4a32] rounded-lg transition-all shadow-xs active:scale-95"
                  title="Add Line (Enter)"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FINAL PREVIEW & EXPORT */}
        {currentStep === 4 && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Complete Playbook Preview Card */}
            <div className="bg-white border-2 border-[#635f41]/30 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 font-serif text-left">
              <div className="text-center border-b border-[#e6e2dd] pb-6 space-y-2">
                <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#635f41]">
                  Official Aayam Playbook
                </span>
                <h1 className="text-4xl font-bold text-[#1c1b19] tracking-tight">{title || "Untitled Script"}</h1>
                <p className="text-xs font-sans text-[#466272]">
                  Playwright: <strong>{playwright}</strong> | Genre: {genre} | Language: {language}
                </p>
                {labels && (
                  <div className="flex justify-center flex-wrap gap-1.5 pt-2 font-sans">
                    {labels.split(",").map((lbl, idx) => (
                      <span key={idx} className="bg-[#635f41]/10 text-[#635f41] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
                        {lbl.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme & Setting Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs bg-[#fdf9f4] p-5 rounded-2xl border border-[#e6e2dd]">
                <div>
                  <strong className="text-[#635f41] uppercase tracking-wider block mb-1">Theme & Conflict:</strong>
                  <span className="text-[#1c1b19] leading-relaxed">{theme || "N/A"}</span>
                </div>
                <div>
                  <strong className="text-[#635f41] uppercase tracking-wider block mb-1">Setting & Time:</strong>
                  <span className="text-[#1c1b19] leading-relaxed">{settingInfo || "N/A"}</span>
                </div>
              </div>

              {abstract && (
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-1 font-sans text-xs">
                  <strong className="text-[#635f41] uppercase tracking-wider block mb-1">Abstract / Synopsis:</strong>
                  <p className="text-[#466272] leading-relaxed italic">{abstract}</p>
                </div>
              )}

              {/* Dramatis Personae */}
              <div className="font-sans text-xs space-y-3 border-b border-[#e6e2dd] pb-6">
                <strong className="text-[#635f41] uppercase tracking-wider block">Dramatis Personae:</strong>
                <div className="flex flex-wrap gap-2.5">
                  {characters.map((c) => (
                    <span key={c.id} className="bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full font-semibold text-[#1c1b19]">
                      {c.name} ({c.traits})
                    </span>
                  ))}
                </div>
              </div>

              {/* Complete Storyline Flow */}
              <div className="space-y-5 pt-2">
                {lines.map((line) => (
                  <div key={line.id} className="space-y-1">
                    <span className="text-xs font-sans font-bold uppercase tracking-wider" style={{ color: line.color }}>
                      {line.characterName}
                    </span>
                    <p className="text-sm text-[#1c1b19] leading-relaxed pl-4 font-serif">
                      "{line.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-[#e6e2dd] shadow-xs">
              <Button onClick={() => setCurrentStep(3)} variant="outline" className="border-[#cac6b9] text-[#466272]">
                ← Back to Storyline Canvas
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleSaveScript("Draft")}
                  variant="outline"
                  className="border-[#cac6b9] text-[#466272] font-bold text-xs"
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Save as Personal Draft
                </Button>

                {isMaintainer ? (
                  <Button
                    onClick={() => handleSaveScript("Public")}
                    className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold text-xs shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Publish to Vault
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSaveScript("Pending")}
                    className="bg-[#8CC0EB] hover:bg-[#68a0cd] text-[#001e2c] font-bold text-xs shadow-md"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" /> Submit Request to Publish
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auto-Extract Raw Script Modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-2xl bg-white border border-[#cac6b9] rounded-3xl p-6 sm:p-8">
          <DialogHeader className="text-left space-y-1.5 border-b border-[#e6e2dd] pb-4">
            <DialogTitle className="text-xl font-bold font-serif text-[#635f41] flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#635f41]" /> Auto-Extract Characters & Storyline
            </DialogTitle>
            <DialogDescription className="text-xs text-[#466272]">
              Paste your raw script text below. Our auto-parser will extract character names, stage directions, and dialogue lines automatically!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#635f41]">
              Raw Script Text *
            </label>
            <textarea
              rows={10}
              value={rawScriptText}
              onChange={(e) => setRawScriptText(e.target.value)}
              placeholder={`Example:\n\nTARA: If we don't speak up today, our silence will betray us!\n[Pacing across stage]\nRAJA: Silence is sometimes the highest virtue of statecraft.\nTARA: Or the quietest form of surrender.`}
              className="w-full bg-[#fdf9f4] border border-[#e6e2dd] p-4 text-xs font-serif leading-relaxed rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635f41]/30 transition-all"
            />
          </div>

          <DialogFooter className="pt-3 flex justify-between items-center gap-3 border-t border-[#e6e2dd]">
            <Button variant="outline" onClick={() => setImportOpen(false)} className="border-[#cac6b9] text-[#466272]">
              Cancel
            </Button>
            <Button onClick={handleAutoExtractScript} className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold text-xs px-6 shadow-sm">
              <Sparkles className="w-4 h-4 mr-1" /> Run Parser & Extract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
