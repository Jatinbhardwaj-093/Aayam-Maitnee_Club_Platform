// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Plus,
  Save,
  Send,
  BookOpen,
  CheckCircle2,
  X,
  FileText,
  Sparkles,
  Sliders,
  Wand2,
  Feather,
  Bot,
  UserCheck,
  RefreshCw,
  Activity,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import PlateEditor from "@/components/PlateEditor";
import { CharacterDirectory, type CharacterItem } from "@/components/CharacterDirectory";
import SseAnalysis from "@/components/SseAnalysis";
import AiSuggestions from "@/components/AiSuggestions";

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
  "#353535",
  "#E85F57",
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
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [charNameInput, setCharNameInput] = useState("");
  const [charTraitsInput, setCharTraitsInput] = useState("");

  // AI Character Suggestor States
  const [charTab, setCharTab] = useState<"analyzer" | "assistant">("analyzer");
  const [aiPretext, setAiPretext] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiCharacterSuggestion | null>(null);

  // Step 3: Storyline Canvas
  const [markdownContent, setMarkdownContent] = useState("");
  const lastAnalyzedTextRef = useRef("");

  // Script Auto-Extractor Modal State
  const [importOpen, setImportOpen] = useState(false);
  const [rawScriptText, setRawScriptText] = useState("");

  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);

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
        .catch((err) => {
          console.warn("GET /api/scripts/:id failed, falling back to query list", err);
          return null;
        })
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

            let loadedMarkdown = "";
            try {
              if (found.content && (found.content.trim().startsWith("{") || found.content.trim().startsWith("["))) {
                const parsed = JSON.parse(found.content);
                if (parsed.characters && parsed.characters.length > 0) setCharacters(parsed.characters);
                if (parsed.abstract) setAbstract(parsed.abstract);
                if (parsed.labels) setLabels(parsed.labels);
                if (parsed.theme) setTheme(parsed.theme);
                if (parsed.settingInfo) setSettingInfo(parsed.settingInfo);

                if (parsed.lines && parsed.lines.length > 0) {
                  // Build a nice Markdown presentation of the dialogue lines
                  loadedMarkdown = parsed.lines.map((line: any) => {
                    if (line.characterName === "stage-note" || line.characterId === "stage-note") {
                      return `(${line.text})`;
                    }
                    return `**${line.characterName}**:\n${line.text}`;
                  }).join("\n\n");
                }
              } else if (found.content) {
                loadedMarkdown = found.content;
              }
            } catch (e) {
              console.warn("Script content parse fallback:", e);
              loadedMarkdown = found.content || "";
            }
            setMarkdownContent(loadedMarkdown);
          }
        })
        .catch(console.error);
    }
  }, [scriptId]);


  // AI Story Abstract Generator
  const handleAiGenerateAbstract = () => {
    if (!title.trim()) {
      alert("Please enter a script title first to generate a synopsis.");
      return;
    }
    setAiGenerating(true);
    setTimeout(() => {
      const selectedGenre = genre || "Drama";
      const selectedTheme = theme || "morality, ambition and justice";
      const selectedSetting = settingInfo || "a dramatic setting";

      const generationTemplates = [
        `"${title}" is a powerful ${selectedGenre.toLowerCase()} centering on the theme of ${selectedTheme}. Set in ${selectedSetting}, the piece delves into the fragile boundary between personal integrity and external pressure as the central conflict unfolds.`,
        `Set against the backdrop of ${selectedSetting}, "${title}" explores the themes of ${selectedTheme}. This ${selectedGenre.toLowerCase()} maps the emotional landscape of modern struggles, weaving together ambition, secrets, and eventual revelation.`,
        `In "${title}", a gripping ${selectedGenre.toLowerCase()} set in ${selectedSetting}, the stage becomes a battleground for ${selectedTheme}. As conflicts arise and relationships are tested, the story charts an unforgettable journey of identity and choices.`
      ];

      const randomIndex = Math.floor(Math.random() * generationTemplates.length);
      setAbstract(generationTemplates[randomIndex]);
      setAiGenerating(false);
    }, 1200);
  };

  // Fetch database characters (SQLite)
  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/characters`);
      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  // Save selected character to database (SQLite)
  const handleSaveCharacter = async (char: CharacterItem) => {
    try {
      const response = await fetch(`${baseUrl}/api/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(char)
      });
      if (response.ok) {
        await fetchCharacters();
      }
    } catch (error) {
      console.error("Error saving character:", error);
    }
  };

  // Delete character from database (SQLite)
  const handleDeleteCharacter = async (id: string | number) => {
    try {
      const response = await fetch(`${baseUrl}/api/characters?id=${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchCharacters();
      }
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  // Handle Manual Form Addition
  const handleAddCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charNameInput.trim()) return;

    const newChar: CharacterItem = {
      name: charNameInput.trim(),
      description: "Manually registered in Script Builder.",
      traits: charTraitsInput.trim() ? charTraitsInput.split(",").map(t => t.trim()) : ["custom"],
      motivation: "Not declared",
      role: "Supporting"
    };

    await handleSaveCharacter(newChar);
    setCharNameInput("");
    setCharTraitsInput("");
  };

  // Auto-Extract Raw Script Text into Script Markdown
  const handleAutoExtractScript = async () => {
    if (!rawScriptText.trim()) return;

    setExtracting(true);
    try {
      const response = await fetch(`${baseUrl}/api/auto-extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: rawScriptText,
          script_id: scriptId
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.dialogue_script) {
          setMarkdownContent(data.dialogue_script);
        }
        // Force refresh character roster Directory list
        await fetchCharacters();
        // Redirect to Step 2 (Characters) to show the updated directory roster
        setCurrentStep(2);
        setImportOpen(false);
      } else {
        alert("Failed to auto-extract text. Please try again.");
      }
    } catch (e) {
      console.error("Auto-extraction error:", e);
      alert("Error occurred during extraction.");
    } finally {
      setExtracting(false);
    }
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
      const payload = {
        title: title.trim(),
        playwright: playwright.trim() || activeUser.name,
        genre,
        language,
        acts: "Script Edition",
        pages: Math.max(1, Math.ceil(markdownContent.split("\n\n").length / 5)),
        rolesCount: `${characters.length} Characters`,
        rehearsalFocus: theme || "Dialogue & Scene Work",
        excerpt: abstract || "Play script draft.",
        content: markdownContent,
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
    <div className="min-h-screen bg-[#E7DDD3] font-sans text-[#666361] pb-24 selection:bg-[#E85F57]/30">
      {/* Studio Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#DDD8CE] sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Top Row: Title & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Title & Back */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/member-scripts")}
                className="p-2 text-[#666361] hover:text-[#353535] hover:bg-[#E7DDD3] rounded-xl border border-transparent hover:border-[#DDD8CE] transition-all"
                title="Back to Script Vault"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#353535] flex items-center gap-1">
                  <Feather className="w-3 h-3 text-[#353535]" /> Script Studio
                </span>
                <h1 className="text-lg sm:text-xl font-bold font-serif text-[#232323] tracking-tight truncate max-w-xs sm:max-w-md">
                  {title || "Untitled Production Script"}
                </h1>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => setImportOpen(true)}
                variant="outline"
                className="border-[#353535]/40 text-[#353535] hover:bg-[#353535]/10 text-xs font-bold h-9 rounded-xl flex items-center gap-1.5 px-3.5 shadow-xs transition-all active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Extract</span>
              </Button>

              <Button
                onClick={() => handleSaveScript("Draft")}
                disabled={saving}
                variant="outline"
                className="border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1] text-xs font-bold h-9 rounded-xl px-3.5 shadow-xs transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
              </Button>

              {isMaintainer ? (
                <Button
                  onClick={() => handleSaveScript("Public")}
                  disabled={saving}
                  className="bg-[#353535] hover:bg-[#4d4a32] text-white text-xs font-bold h-9 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 px-4"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Publish to Vault
                </Button>
              ) : (
                <Button
                  onClick={() => handleSaveScript("Pending")}
                  disabled={saving}
                  className="bg-[#E85F57] hover:bg-[#68a0cd] text-[#001e2c] text-xs font-bold h-9 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 px-4"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Request Publish
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Row: Centered Responsive 4-Step Navigation */}
          <div className="flex items-center justify-start sm:justify-center border-t border-[#DDD8CE]/70 pt-2.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 bg-[#f4efe8] p-1.5 rounded-2xl border border-[#D5C9BE]/50 text-xs flex-nowrap shadow-2xs">
              <button
                onClick={() => setCurrentStep(1)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentStep === 1
                  ? "bg-[#353535] text-white shadow-sm"
                  : "text-[#666361] hover:text-[#232323] hover:bg-white/60"
                  }`}
              >
                <Sliders className="w-3.5 h-3.5" /> 1. Setup
              </button>

              <button
                onClick={() => setCurrentStep(2)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentStep === 2
                  ? "bg-[#353535] text-white shadow-sm"
                  : "text-[#666361] hover:text-[#232323] hover:bg-white/60"
                  }`}
              >
                <Users className="w-3.5 h-3.5" /> 2. Characters
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentStep === 3
                  ? "bg-[#353535] text-white shadow-sm"
                  : "text-[#666361] hover:text-[#232323] hover:bg-white/60"
                  }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> 3. Storyline
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${currentStep === 4
                  ? "bg-[#353535] text-white shadow-sm"
                  : "text-[#666361] hover:text-[#232323] hover:bg-white/60"
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
          <div className="space-y-5 max-w-3xl mx-auto">
            <div className="bg-white border border-[#DDD8CE] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-[#DDD8CE] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#353535]">Production Setup & Metadata</h2>
                  <p className="text-xs text-[#666361]/80 mt-0.5">Define story title, labels, setting details, theme, and abstract</p>
                </div>
                <Badge className="bg-[#353535]/10 text-[#353535] font-bold text-xs rounded-full px-3 py-1">Step 1 of 4</Badge>
              </div>



              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Script Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mahabhoj Courtroom Drama"
                    className="bg-[#E7DDD3] border-[#DDD8CE] h-10 text-sm rounded-xl focus:ring-2 focus:ring-[#353535]/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Playwright / Adapter</label>
                  <Input
                    value={playwright}
                    onChange={(e) => setPlaywright(e.target.value)}
                    placeholder="e.g. Mannu Bhandari"
                    className="bg-[#E7DDD3] border-[#DDD8CE] h-10 text-sm rounded-xl focus:ring-2 focus:ring-[#353535]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">Genre</label>
                  <Input
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Political Drama"
                    className="bg-[#E7DDD3] border-[#DDD8CE] h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">Language</label>
                  <Input
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Hindi & English"
                    className="bg-[#E7DDD3] border-[#DDD8CE] h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">Story Labels / Tags</label>
                  <Input
                    value={labels}
                    onChange={(e) => setLabels(e.target.value)}
                    placeholder="Classic, Courtroom, Ensemble"
                    className="bg-[#E7DDD3] border-[#DDD8CE] h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Characteristic Theme</label>
                  <Input
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Struggle for justice, moral dilemmas"
                    className="bg-[#E7DDD3] border-[#DDD8CE] h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Setting & Time Period</label>
                  <Input
                    value={settingInfo}
                    onChange={(e) => setSettingInfo(e.target.value)}
                    placeholder="e.g. Rural North India, late 1970s"
                    className="bg-[#E7DDD3] border-[#DDD8CE] h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Story Abstract / Synopsis</label>
                  <button
                    type="button"
                    onClick={handleAiGenerateAbstract}
                    disabled={aiGenerating}
                    className="text-xs text-[#353535] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#353535]" /> AI Auto-Generate Abstract
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Provide a brief synopsis of the play plot, key conflicts, and theme summary..."
                  className="w-full bg-[#E7DDD3] border border-[#DDD8CE] p-3.5 text-xs font-serif leading-relaxed rounded-xl focus:outline-none focus:ring-2 focus:ring-[#353535]/30 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-[#DDD8CE] flex justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#353535] hover:bg-[#4d4a32] text-white text-xs font-bold rounded-xl px-6 h-10 shadow-sm"
                >
                  Proceed to Characters →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHARACTERS & AI CHARACTER SUGGESTOR */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Left side: Character Directory roster + Add Manually Form */}
              <div className="md:col-span-6 flex flex-col space-y-6 bg-white border border-[#DDD8CE] rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#DDD8CE] pb-3">
                  <h3 className="text-base font-serif font-bold text-[#353535] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#353535]" />
                    <span>Roster Directory ({characters.length})</span>
                  </h3>
                </div>

                <div className="flex-1 min-h-[400px] overflow-y-auto">
                  <CharacterDirectory
                    characters={characters}
                    onDeleteCharacter={handleDeleteCharacter}
                  />
                </div>

                <div className="border-t border-[#DDD8CE] pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#353535]">Add Character Manually</h4>
                  <form onSubmit={handleAddCharacter} className="flex flex-col sm:flex-row items-center gap-2">
                    <Input
                      required
                      value={charNameInput}
                      onChange={(e) => setCharNameInput(e.target.value)}
                      placeholder="Name (e.g. Tara)"
                      className="bg-[#E7DDD3] border-[#DDD8CE] h-9 text-xs rounded-xl flex-1"
                    />
                    <Input
                      value={charTraitsInput}
                      onChange={(e) => setCharTraitsInput(e.target.value)}
                      placeholder="Traits (e.g. Lead)"
                      className="bg-[#E7DDD3] border-[#DDD8CE] h-9 text-xs rounded-xl flex-1"
                    />
                    <Button
                      type="submit"
                      className="bg-[#353535] hover:bg-[#4d4a32] text-white font-bold h-9 rounded-xl text-xs px-5"
                    >
                      <Plus className="w-3.5 h-3.5 mr-0.5" /> Add
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right side: Tabs (Stream Analyzer, AI Assistant) */}
              <div className="md:col-span-6 flex flex-col bg-white border border-[#DDD8CE] rounded-3xl overflow-hidden shadow-sm">
                <div className="flex border-b border-[#DDD8CE] select-none bg-[#E7DDD3]">
                  <button
                    onClick={() => setCharTab("analyzer")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${charTab === "analyzer"
                      ? "border-[#353535] text-[#353535] bg-white font-extrabold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Stream Analyzer</span>
                  </button>
                  <button
                    onClick={() => setCharTab("assistant")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${charTab === "assistant"
                      ? "border-[#353535] text-[#353535] bg-white font-extrabold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto min-h-[400px]">
                  {charTab === "analyzer" && (
                    <SseAnalysis
                      onAddToDirectory={handleSaveCharacter}
                      savedCharacters={characters}
                      scriptId={scriptId}
                      hasContent={!!markdownContent?.trim()}
                    />
                  )}
                  {charTab === "assistant" && (
                    <AiSuggestions
                      onSaveCharacter={handleSaveCharacter}
                      storyContext={markdownContent}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#DDD8CE] shadow-xs">
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="border-[#D5C9BE] text-[#666361] text-xs font-bold rounded-xl h-9 px-4"
              >
                ← Back to Setup
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                className="bg-[#353535] hover:bg-[#4d4a32] text-white text-xs font-bold rounded-xl h-9 px-6 shadow-sm cursor-pointer"
              >
                Proceed to Storyline →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: STORYLINE CANVAS & TYPING BAR */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <PlateEditor
              markdownContent={markdownContent}
              onChangeMarkdown={(markdown) => setMarkdownContent(markdown)}
              onChangeText={async (text) => {
                if (!text.trim() || text === lastAnalyzedTextRef.current) return;
                lastAnalyzedTextRef.current = text;
                try {
                  await fetch(`${baseUrl}/api/analyze-text`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text, script_id: scriptId })
                  });
                } catch (error) {
                  console.error("Text analysis error:", error);
                }
              }}
            />

            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#DDD8CE] mt-4 shadow-xs">
              <Button onClick={() => setCurrentStep(2)} variant="outline" className="border-[#D5C9BE] text-[#666361] text-xs font-bold rounded-xl h-9 px-4">
                ← Edit Characters
              </Button>
              <Button onClick={() => setCurrentStep(4)} className="bg-[#353535] hover:bg-[#4d4a32] text-white text-xs font-bold rounded-xl h-9 px-6 shadow-sm">
                Proceed to Preview →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: FINAL PREVIEW & EXPORT */}
        {currentStep === 4 && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Complete Playbook Preview Card */}
            <div className="bg-white border-2 border-[#353535]/30 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 font-serif text-left">
              <div className="text-center border-b border-[#DDD8CE] pb-6 space-y-2">
                <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#353535]">
                  Official Aayam Playbook
                </span>
                <h1 className="text-4xl font-bold text-[#232323] tracking-tight">{title || "Untitled Script"}</h1>
                <p className="text-xs font-sans text-[#666361]">
                  Playwright: <strong>{playwright}</strong> | Genre: {genre} | Language: {language}
                </p>
                {labels && (
                  <div className="flex justify-center flex-wrap gap-1.5 pt-2 font-sans">
                    {labels.split(",").map((lbl, idx) => (
                      <span key={idx} className="bg-[#353535]/10 text-[#353535] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
                        {lbl.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme & Setting Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs bg-[#E7DDD3] p-5 rounded-2xl border border-[#DDD8CE]">
                <div>
                  <strong className="text-[#353535] uppercase tracking-wider block mb-1">Theme & Conflict:</strong>
                  <span className="text-[#232323] leading-relaxed">{theme || "N/A"}</span>
                </div>
                <div>
                  <strong className="text-[#353535] uppercase tracking-wider block mb-1">Setting & Time:</strong>
                  <span className="text-[#232323] leading-relaxed">{settingInfo || "N/A"}</span>
                </div>
              </div>

              {abstract && (
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-1 font-sans text-xs">
                  <strong className="text-[#353535] uppercase tracking-wider block mb-1">Abstract / Synopsis:</strong>
                  <p className="text-[#666361] leading-relaxed italic">{abstract}</p>
                </div>
              )}

              {/* Dramatis Personae */}
              <div className="font-sans text-xs space-y-3 border-b border-[#DDD8CE] pb-6">
                <strong className="text-[#353535] uppercase tracking-wider block">Dramatis Personae:</strong>
                <div className="flex flex-wrap gap-2.5">
                  {characters.map((c) => (
                    <span key={c.id} className="bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full font-semibold text-[#232323]">
                      {c.name} ({Array.isArray(c.traits) ? c.traits.join(", ") : c.traits})
                    </span>
                  ))}
                </div>
              </div>

              {/* Complete Storyline Flow */}
              <div className="space-y-5 pt-2">
                <PlateEditor
                  markdownContent={markdownContent}
                  readOnly={true}
                />
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-[#DDD8CE] shadow-xs">
              <Button onClick={() => setCurrentStep(3)} variant="outline" className="border-[#D5C9BE] text-[#666361] rounded-xl px-4 h-9">
                ← Back to Storyline
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleSaveScript("Draft")}
                  variant="outline"
                  className="border-[#D5C9BE] text-[#666361] font-bold text-xs rounded-xl px-4 h-9"
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Save as Personal Draft
                </Button>

                {isMaintainer ? (
                  <Button
                    onClick={() => handleSaveScript("Public")}
                    className="bg-[#353535] hover:bg-[#4d4a32] text-white font-bold text-xs rounded-xl px-4 h-9 shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Publish to Vault
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSaveScript("Pending")}
                    className="bg-[#E85F57] hover:bg-[#68a0cd] text-[#001e2c] font-bold text-xs rounded-xl px-4 h-9 shadow-md"
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
        <DialogContent className="max-w-2xl bg-white border border-[#D5C9BE] rounded-3xl p-6 sm:p-8">
          <DialogHeader className="text-left space-y-1.5 border-b border-[#DDD8CE] pb-4">
            <DialogTitle className="text-xl font-bold font-serif text-[#353535] flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#353535]" /> Auto-Extract Characters & Storyline
            </DialogTitle>
            <DialogDescription className="text-xs text-[#666361]">
              Paste your raw script text below. Our auto-parser will extract character names, stage directions, and dialogue lines automatically!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#353535]">
              Raw Script Text *
            </label>
            <textarea
              rows={10}
              value={rawScriptText}
              onChange={(e) => setRawScriptText(e.target.value)}
              placeholder={`Example:\n\nTARA: If we don't speak up today, our silence will betray us!\n[Pacing across stage]\nRAJA: Silence is sometimes the highest virtue of statecraft.\nTARA: Or the quietest form of surrender.`}
              className="w-full bg-[#E7DDD3] border border-[#DDD8CE] p-4 text-xs font-serif leading-relaxed rounded-xl focus:outline-none focus:ring-2 focus:ring-[#353535]/30 transition-all"
            />
          </div>

          <DialogFooter className="pt-3 flex justify-between items-center gap-3 border-t border-[#DDD8CE]">
            <Button variant="outline" onClick={() => setImportOpen(false)} disabled={extracting} className="border-[#D5C9BE] text-[#666361] rounded-xl px-4 h-9">
              Cancel
            </Button>
            <Button
              onClick={handleAutoExtractScript}
              disabled={extracting}
              className="bg-[#353535] hover:bg-[#4d4a32] text-white font-bold text-xs px-6 shadow-sm rounded-xl h-9 flex items-center gap-1.5"
            >
              {extracting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" /> Run Parser & Extract
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
