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
  Loader2,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  CornerDownLeft,
  Sparkle,
  Copy,
  Check,
  ChevronDown,
  AlignLeft,
  Layers,
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import PlateEditor from "@/components/PlateEditor";
import { CharacterDirectory, type CharacterItem } from "@/components/CharacterDirectory";
import SseAnalysis from "@/components/SseAnalysis";
import AiSuggestions from "@/components/AiSuggestions";
import { exportScriptToPdf } from "@/utils/scriptPdfExport";

export interface StoryboardLine {
  id: string;
  characterName: string;
  characterId?: string;
  text: string;
  color?: string;
  type?: "dialogue" | "stage-note" | "scene-heading";
}

const defaultColors = [
  "#8C241E", // Crimson
  "#1E40AF", // Blue
  "#065F46", // Emerald
  "#6B21A8", // Purple
  "#B45309", // Amber
  "#9F1239", // Rose
  "#374151"  // Slate
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
  const [genre, setGenre] = useState("Classical Mythological Tragedy");
  const [language, setLanguage] = useState("Hindustani & Sanskritized Verse");
  const [labels, setLabels] = useState("Classical Tragedy, Ensemble, Festival Play");
  const [theme, setTheme] = useState("Honor, Destiny, Sacrifice & Moral Paradox");
  const [settingInfo, setSettingInfo] = useState("Kurukshetra battlefield under a blood-amber twilight sky");
  const [abstract, setAbstract] = useState("");

  // Step 2: Characters
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [charNameInput, setCharNameInput] = useState("");
  const [charTraitsInput, setCharTraitsInput] = useState("");

  // AI Character Suggestor States
  const [charTab, setCharTab] = useState<"analyzer" | "assistant">("analyzer");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Step 3: Storyboard & Storyline Canvas
  const [storyboardLines, setStoryboardLines] = useState<StoryboardLine[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<string>("stage-note");
  const [currentLineInput, setCurrentLineInput] = useState<string>("");
  const [storyViewMode, setStoryViewMode] = useState<"storyboard" | "freeform">("storyboard");
  const [markdownContent, setMarkdownContent] = useState("");
  const lastAnalyzedTextRef = useRef("");
  const storyboardEndRef = useRef<HTMLDivElement | null>(null);

  // Script Auto-Extractor Modal State
  const [importOpen, setImportOpen] = useState(false);
  const [rawScriptText, setRawScriptText] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);

  // Helper: Convert Storyboard Lines to Markdown
  const convertStoryboardLinesToMarkdown = (lines: StoryboardLine[]): string => {
    return lines.map((line) => {
      if (line.type === "scene-heading" || line.characterName === "scene-heading") {
        return `[${line.text.toUpperCase()}]`;
      }
      if (line.type === "stage-note" || line.characterName === "stage-note") {
        return `(${line.text})`;
      }
      return `**${line.characterName}**:\n${line.text}`;
    }).join("\n\n");
  };

  // Helper: Parse Markdown to Storyboard Lines
  const parseMarkdownToStoryboardLines = (markdown: string, charList: CharacterItem[]): StoryboardLine[] => {
    if (!markdown || !markdown.trim()) return [];

    const blocks = markdown.split(/\n\n+/);
    const result: StoryboardLine[] = [];

    blocks.forEach((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return;

      // Check if stage note / scene heading: (Note) or [Note]
      if ((trimmed.startsWith("(") && trimmed.endsWith(")")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
        const innerText = trimmed.replace(/^[\(\[]|[\)\]]$/g, "").trim();
        const isHeading = innerText.toUpperCase().startsWith("ACT ") || innerText.toUpperCase().startsWith("SCENE ");
        result.push({
          id: `line-${idx}-${Date.now()}`,
          characterName: isHeading ? "scene-heading" : "stage-note",
          text: innerText,
          color: isHeading ? "#8C241E" : "#8C5A54",
          type: isHeading ? "scene-heading" : "stage-note"
        });
        return;
      }

      // Check if speech: **KARN**: or KARN:
      const speechMatch = trimmed.match(/^(\*\*([^*]+)\*\*|([A-Za-z0-9\s]+)):\s*([\s\S]*)$/);
      if (speechMatch) {
        const charName = (speechMatch[2] || speechMatch[3] || "Character").trim();
        const speechText = speechMatch[4].trim();
        const matchedChar = charList.find((c) => c.name.toLowerCase() === charName.toLowerCase());
        result.push({
          id: `line-${idx}-${Date.now()}`,
          characterName: charName,
          characterId: matchedChar?.id?.toString(),
          text: speechText.replace(/^["']|["']$/g, ""),
          color: matchedChar?.color || "#8C241E",
          type: "dialogue"
        });
        return;
      }

      // Fallback stage note
      result.push({
        id: `line-${idx}-${Date.now()}`,
        characterName: "stage-note",
        text: trimmed,
        color: "#8C5A54",
        type: "stage-note"
      });
    });

    return result;
  };

  // Sync active speaker with characters if needed
  useEffect(() => {
    if (characters.length > 0 && activeSpeaker === "stage-note") {
      setActiveSpeaker(characters[0].name);
    }
  }, [characters]);

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
            let loadedLines: StoryboardLine[] = [];
            let loadedChars: CharacterItem[] = [];

            try {
              if (found.content && (found.content.trim().startsWith("{") || found.content.trim().startsWith("["))) {
                const parsed = JSON.parse(found.content);
                if (parsed.characters && parsed.characters.length > 0) {
                  loadedChars = parsed.characters;
                  setCharacters(parsed.characters);
                }
                if (parsed.abstract) setAbstract(parsed.abstract);
                if (parsed.labels) setLabels(parsed.labels);
                if (parsed.theme) setTheme(parsed.theme);
                if (parsed.settingInfo) setSettingInfo(parsed.settingInfo);

                if (parsed.lines && parsed.lines.length > 0) {
                  loadedLines = parsed.lines.map((l: any, i: number) => ({
                    id: l.id || `line-${i}-${Date.now()}`,
                    characterName: l.characterName || (l.characterId === "stage-note" ? "stage-note" : "Character"),
                    characterId: l.characterId,
                    text: l.text || "",
                    color: l.color || "#8C241E",
                    type: l.characterName === "stage-note" || l.characterId === "stage-note" ? "stage-note" : "dialogue"
                  }));
                  setStoryboardLines(loadedLines);
                  loadedMarkdown = convertStoryboardLinesToMarkdown(loadedLines);
                }
              } else if (found.content) {
                loadedMarkdown = found.content;
                loadedLines = parseMarkdownToStoryboardLines(found.content, loadedChars);
                setStoryboardLines(loadedLines);
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
      const selectedSetting = settingInfo || "a dramatic theatrical setting";

      const generationTemplates = [
        `"${title}" is a powerful ${selectedGenre.toLowerCase()} centering on the core theme of ${selectedTheme}. Staged against ${selectedSetting}, the piece delves into the fragile boundary between personal integrity, institutional duty, and external pressure as the central conflict reaches its climax.`,
        `Set against the vivid backdrop of ${selectedSetting}, "${title}" explores the deep currents of ${selectedTheme}. This ${selectedGenre.toLowerCase()} maps the emotional landscape of human conviction, weaving together unspoken loyalties, hidden fractures, and eventual catharsis.`,
        `In "${title}", a gripping ${selectedGenre.toLowerCase()} staged in ${selectedSetting}, the theatrical space transforms into a testing ground for ${selectedTheme}. As dramatic stakes escalate and relationships fracture, the narrative charts an unforgettable journey of truth and consequence.`
      ];

      const randomIndex = Math.floor(Math.random() * generationTemplates.length);
      setAbstract(generationTemplates[randomIndex]);
      setAiGenerating(false);
    }, 900);
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
      const color = defaultColors[characters.length % defaultColors.length];
      const charWithColor = { ...char, color };
      const response = await fetch(`${baseUrl}/api/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(charWithColor)
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

    const color = defaultColors[characters.length % defaultColors.length];
    const newChar: CharacterItem = {
      name: charNameInput.trim(),
      description: charTraitsInput.trim() || "Theatrical character",
      traits: charTraitsInput ? charTraitsInput.split(",").map((t) => t.trim()) : ["Dramatic"],
      role: "Supporting",
      motivation: "Artistic dramatic arc",
      color
    };

    await handleSaveCharacter(newChar);
    setCharNameInput("");
    setCharTraitsInput("");
  };

  // Trigger Live Text Analysis
  const triggerLiveAnalysis = async (text: string) => {
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
  };

  // ADD LINE TO STORYBOARD
  const handleAddStoryboardLine = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentLineInput.trim()) return;

    const text = currentLineInput.trim();
    let charName = activeSpeaker;
    let lineType: "dialogue" | "stage-note" | "scene-heading" = "dialogue";
    let color = "#8C241E";

    if (activeSpeaker === "stage-note" || activeSpeaker === "Stage Note") {
      lineType = "stage-note";
      charName = "stage-note";
      color = "#8C5A54";
    } else if (activeSpeaker === "scene-heading" || activeSpeaker === "Scene Heading") {
      lineType = "scene-heading";
      charName = "scene-heading";
      color = "#8C241E";
    } else {
      const matched = characters.find((c) => c.name.toLowerCase() === activeSpeaker.toLowerCase());
      color = matched?.color || "#8C241E";
    }

    const newLine: StoryboardLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      characterName: charName,
      text,
      color,
      type: lineType
    };

    const updatedLines = [...storyboardLines, newLine];
    setStoryboardLines(updatedLines);
    const updatedMd = convertStoryboardLinesToMarkdown(updatedLines);
    setMarkdownContent(updatedMd);
    setCurrentLineInput("");

    triggerLiveAnalysis(updatedMd);

    setTimeout(() => {
      storyboardEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // UPDATE LINE IN STORYBOARD
  const handleUpdateLineText = (lineId: string, newText: string) => {
    const updated = storyboardLines.map((l) => (l.id === lineId ? { ...l, text: newText } : l));
    setStoryboardLines(updated);
    const updatedMd = convertStoryboardLinesToMarkdown(updated);
    setMarkdownContent(updatedMd);
  };

  // CHANGE SPEAKER OF A LINE
  const handleUpdateLineSpeaker = (lineId: string, newSpeaker: string) => {
    let lineType: "dialogue" | "stage-note" | "scene-heading" = "dialogue";
    let color = "#8C241E";

    if (newSpeaker === "stage-note" || newSpeaker === "Stage Note") {
      lineType = "stage-note";
      color = "#8C5A54";
    } else if (newSpeaker === "scene-heading" || newSpeaker === "Scene Heading") {
      lineType = "scene-heading";
      color = "#8C241E";
    } else {
      const matched = characters.find((c) => c.name.toLowerCase() === newSpeaker.toLowerCase());
      color = matched?.color || "#8C241E";
    }

    const updated = storyboardLines.map((l) =>
      l.id === lineId ? { ...l, characterName: newSpeaker, type: lineType, color } : l
    );
    setStoryboardLines(updated);
    const updatedMd = convertStoryboardLinesToMarkdown(updated);
    setMarkdownContent(updatedMd);
  };

  // DELETE LINE
  const handleDeleteLine = (lineId: string) => {
    const updated = storyboardLines.filter((l) => l.id !== lineId);
    setStoryboardLines(updated);
    const updatedMd = convertStoryboardLinesToMarkdown(updated);
    setMarkdownContent(updatedMd);
  };

  // MOVE LINE
  const handleMoveLine = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === storyboardLines.length - 1)) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newLines = [...storyboardLines];
    const temp = newLines[index];
    newLines[index] = newLines[targetIndex];
    newLines[targetIndex] = temp;

    setStoryboardLines(newLines);
    const updatedMd = convertStoryboardLinesToMarkdown(newLines);
    setMarkdownContent(updatedMd);
  };

  // Auto-Extract Script
  const handleAutoExtractScript = async () => {
    if (!rawScriptText.trim() && !uploadFile) return;
    setExtracting(true);
    try {
      let response;
      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        if (scriptId) formData.append("script_id", scriptId);
        if (rawScriptText.trim()) formData.append("text", rawScriptText);

        response = await fetch(`${baseUrl}/api/extract-script`, {
          method: "POST",
          body: formData
        });
      } else {
        response = await fetch(`${baseUrl}/api/extract-script`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: rawScriptText,
            script_id: scriptId
          })
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (data.dialogue_script) {
          setMarkdownContent(data.dialogue_script);
          const parsedLines = parseMarkdownToStoryboardLines(data.dialogue_script, characters);
          setStoryboardLines(parsedLines);
        }
        await fetchCharacters();
        setCurrentStep(3);
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
        acts: "3 Acts",
        pages: Math.max(1, Math.ceil(storyboardLines.length / 4)),
        rolesCount: `${characters.length || 6} Roles`,
        rehearsalFocus: theme || "Dialogue & Scene Work",
        excerpt: abstract || "Aayam official script draft.",
        content: JSON.stringify({
          title,
          playwright,
          abstract,
          theme,
          settingInfo,
          labels,
          characters,
          lines: storyboardLines
        }),
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
          alert("Publish request submitted to Aayam Maintainers!");
        } else if (targetStatus === "Public") {
          alert("Script published directly to Aayam Script Vault!");
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
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4 md:px-8 font-sans text-[#5C3B37] pb-24 selection:bg-[#8C241E]/20">
      {/* Studio Theatrical Header Box (Matching width with bottom cards) */}
      <header className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-7 md:p-8 shadow-xs space-y-5 w-full text-left">
        {/* Top Row: Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate("/member-scripts")}
              className="w-10 h-10 rounded-full bg-[#FAF2EE] hover:bg-[#EEDBD5] border border-[#DCBAB2] flex items-center justify-center text-[#5C3B37] hover:text-[#2A1816] transition-all cursor-pointer shadow-xs shrink-0"
              title="Back to Script Vault"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#2A1816] tracking-tight">
                {title || "Untitled Production Script"}
              </h1>
              <p className="text-[11px] font-mono text-[#8C5A54] uppercase tracking-wider font-semibold mt-0.5">
                {playwright || "Playwright"} • {genre || "Drama"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="px-4 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>Auto-Extract</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveScript("Draft")}
              disabled={saving}
              className="px-4 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>Save Draft</span>
            </button>

            {isMaintainer ? (
              <button
                type="button"
                onClick={() => handleSaveScript("Public")}
                disabled={saving}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#8C241E]/20 flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F] disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD0CC]" />
                <span>Publish to Vault</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSaveScript("Pending")}
                disabled={saving}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#8C241E]/20 flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#FFD0CC]" />
                <span>Request Publish</span>
              </button>
            )}
          </div>
        </div>

        {/* Stepper Pill Bar */}
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center gap-1.5 bg-[#FAF2EE] p-1.5 rounded-full border border-[#DCBAB2] shadow-xs max-w-full overflow-x-auto custom-scrollbar">
            {[
              { step: 1, label: "1. Setup", icon: Sliders },
              { step: 2, label: `2. Characters (${characters.length})`, icon: Users },
              { step: 3, label: `3. Storyline (${storyboardLines.length} Lines)`, icon: MessageSquare },
              { step: 4, label: "4. Final Preview", icon: BookOpen }
            ].map(({ step, label, icon: Icon }) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step as any)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentStep === step
                    ? "bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]"
                    : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Form & Storyboard Canvas Body */}
      <main className="space-y-6 w-full">
        {/* STEP 1: SETUP & METADATA */}
        {currentStep === 1 && (
          <div className="space-y-6 w-full">
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-8 sm:p-10 shadow-xs space-y-6 text-left w-full">
              <div className="border-b border-[#DCBAB2]/70 pb-4 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                  Playbook Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] font-normal tracking-tight">
                  Play Specification & Metadata
                </h2>
                <p className="text-xs sm:text-sm text-[#6E4742] font-serif italic">
                  Define production premise, dramaturgy themes, and setting constraints before structuring dialogue.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Play Title *
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dharmakshetra: The Final Soliloquy of Karn"
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all placeholder:text-[#8C5A54]/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Playwright / Authorship
                  </label>
                  <input
                    value={playwright}
                    onChange={(e) => setPlaywright(e.target.value)}
                    placeholder="e.g. Abay Nandhiga & Aayam Writing Cell"
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Genre / Dramatic Style
                  </label>
                  <input
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Classical Tragedy"
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Language & Dialect
                  </label>
                  <input
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Hindustani & Sanskritized Verse"
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Production Tags
                  </label>
                  <input
                    value={labels}
                    onChange={(e) => setLabels(e.target.value)}
                    placeholder="Classical, Ensemble, OAT Showcase"
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Characteristic Theme
                  </label>
                  <input
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Moral dilemma, honor, existential justice"
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Setting & Time Period
                  </label>
                  <input
                    value={settingInfo}
                    onChange={(e) => setSettingInfo(e.target.value)}
                    placeholder="e.g. Kurukshetra dusk, 17th Day of Battle"
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Story Synopsis & Premise
                  </label>
                  <button
                    type="button"
                    onClick={handleAiGenerateAbstract}
                    disabled={aiGenerating}
                    className="text-xs font-mono font-bold text-[#8C241E] hover:text-[#731B16] flex items-center gap-1.5 cursor-pointer uppercase tracking-wider disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B32D25]" />
                    <span>{aiGenerating ? "Generating..." : "AI Auto-Generate Synopsis"}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Provide a comprehensive synopsis of the dramatic conflict, character stakes, and narrative trajectory..."
                  className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-2xl p-4 text-xs sm:text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all placeholder:text-[#8C5A54]/60"
                />
              </div>

              <div className="pt-4 border-t border-[#DCBAB2]/70 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-8 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#8C241E]/20 flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F]"
                >
                  <span>Proceed to Characters</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHARACTERS & AI ASSISTANT */}
        {currentStep === 2 && (
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
              {/* Left side: Character Directory roster + Add Manually Form */}
              <div className="md:col-span-6 flex flex-col space-y-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-7 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#DCBAB2]/70 pb-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider font-semibold">
                      Dramatis Personae
                    </span>
                    <h3 className="text-lg font-serif font-normal text-[#2A1816] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#8C241E]" />
                      <span>Roster Directory ({characters.length})</span>
                    </h3>
                  </div>
                </div>

                <div className="flex-1 min-h-[420px] overflow-y-auto custom-scrollbar">
                  <CharacterDirectory
                    characters={characters}
                    onDeleteCharacter={handleDeleteCharacter}
                  />
                </div>

                <div className="border-t border-[#DCBAB2]/70 pt-4 space-y-3">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Add Character Manually
                  </h4>
                  <form onSubmit={handleAddCharacter} className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      required
                      value={charNameInput}
                      onChange={(e) => setCharNameInput(e.target.value)}
                      placeholder="Name (e.g. Karn)"
                      className="w-full bg-[#F5EAE6] border border-[#DCBAB2] h-10 px-3 text-xs rounded-xl text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none"
                    />
                    <input
                      value={charTraitsInput}
                      onChange={(e) => setCharTraitsInput(e.target.value)}
                      placeholder="Traits (e.g. Tragic, Noble)"
                      className="w-full bg-[#F5EAE6] border border-[#DCBAB2] h-10 px-3 text-xs rounded-xl text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider h-10 rounded-xl px-5 border border-[#A6352F] shrink-0 cursor-pointer shadow-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Right side: Tabs (Stream Analyzer, AI Assistant) */}
              <div className="md:col-span-6 flex flex-col bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] overflow-hidden shadow-xs">
                <div className="flex border-b border-[#DCBAB2] select-none bg-[#F5EAE6]">
                  <button
                    onClick={() => setCharTab("analyzer")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      charTab === "analyzer"
                        ? "border-[#8C241E] text-[#8C241E] bg-[#FAF2EE]"
                        : "border-transparent text-[#8C5A54] hover:text-[#2A1816] hover:bg-[#EEDBD5]/50"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Stream Analyzer</span>
                  </button>
                  <button
                    onClick={() => setCharTab("assistant")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      charTab === "assistant"
                        ? "border-[#8C241E] text-[#8C241E] bg-[#FAF2EE]"
                        : "border-transparent text-[#8C5A54] hover:text-[#2A1816] hover:bg-[#EEDBD5]/50"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Assistant</span>
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto min-h-[420px] custom-scrollbar">
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

            <div className="flex justify-between items-center bg-[#FAF2EE] p-5 rounded-2xl border border-[#DCBAB2] shadow-xs">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                ← Back to Setup
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#8C241E]/20 flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
              >
                <span>Proceed to Storyline</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE STORYBOARD & DIALOGUE COMPOSER */}
        {currentStep === 3 && (
          <div className="space-y-6 w-full">
            {/* View Mode Switcher Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAF2EE] p-4 sm:p-5 rounded-2xl border border-[#DCBAB2] shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#8C241E]" />
                  <h3 className="font-serif text-lg text-[#2A1816] font-normal">
                    Interactive Storyboard & Line Composer
                  </h3>
                </div>
                <p className="text-xs text-[#6E4742] font-serif italic">
                  Select a character from your roster, write the dialogue line, and press Enter to instantly append to the live Storyboard.
                </p>
              </div>

              {/* Toggle Storyboard vs Freeform */}
              <div className="flex items-center gap-1 bg-[#F5EAE6] p-1 rounded-full border border-[#DCBAB2]">
                <button
                  type="button"
                  onClick={() => setStoryViewMode("storyboard")}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    storyViewMode === "storyboard"
                      ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs border border-[#A6352F]"
                      : "text-[#5C3B37] hover:text-[#2A1816]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Storyboard Mode ({storyboardLines.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const md = convertStoryboardLinesToMarkdown(storyboardLines);
                    setMarkdownContent(md);
                    setStoryViewMode("freeform");
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    storyViewMode === "freeform"
                      ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs border border-[#A6352F]"
                      : "text-[#5C3B37] hover:text-[#2A1816]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Freeform Text</span>
                </button>
              </div>
            </div>

            {storyViewMode === "storyboard" ? (
              <div className="space-y-6">
                {/* 1. DIALOGUE COMPOSER INPUT BAR */}
                <div className="bg-[#FAF2EE] border-2 border-[#DCBAB2] rounded-[2.5rem] p-6 sm:p-7 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                        <span>1. Choose Character / Action:</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#8C5A54]">
                        Active: <strong className="text-[#8C241E] uppercase">{activeSpeaker}</strong>
                      </span>
                    </div>

                    {/* Character Quick Selection Pills */}
                    <div className="flex flex-wrap gap-2 items-center">
                      {characters.map((c) => (
                        <button
                          key={c.id || c.name}
                          type="button"
                          onClick={() => setActiveSpeaker(c.name)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
                            activeSpeaker.toLowerCase() === c.name.toLowerCase()
                              ? "bg-[#8C241E] text-[#FDF8F7] border-[#A6352F] shadow-sm ring-2 ring-[#8C241E]/30"
                              : "bg-[#F5EAE6] text-[#2A1816] border-[#DCBAB2] hover:bg-[#EEDBD5]"
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: c.color || "#8C241E" }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}

                      {/* Stage Direction Pill */}
                      <button
                        type="button"
                        onClick={() => setActiveSpeaker("stage-note")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                          activeSpeaker === "stage-note"
                            ? "bg-[#5C3B37] text-[#FDF8F7] border-[#3E2723] shadow-sm ring-2 ring-[#5C3B37]/30"
                            : "bg-[#F5EAE6] text-[#5C3B37] border-[#DCBAB2] hover:bg-[#EEDBD5]"
                        }`}
                      >
                        <span>🎬 Stage Direction / Cue</span>
                      </button>

                      {/* Scene Heading Pill */}
                      <button
                        type="button"
                        onClick={() => setActiveSpeaker("scene-heading")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                          activeSpeaker === "scene-heading"
                            ? "bg-[#2A1816] text-[#FDF8F7] border-black shadow-sm ring-2 ring-black/30"
                            : "bg-[#F5EAE6] text-[#2A1816] border-[#DCBAB2] hover:bg-[#EEDBD5]"
                        }`}
                      >
                        <span>🏛️ Scene Heading</span>
                      </button>
                    </div>
                  </div>

                  {/* Dialogue Text Input + Enter to Submit */}
                  <form onSubmit={handleAddStoryboardLine} className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                      <div className="relative flex-1">
                        <textarea
                          rows={2}
                          value={currentLineInput}
                          onChange={(e) => setCurrentLineInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddStoryboardLine();
                            }
                          }}
                          placeholder={
                            activeSpeaker === "stage-note"
                              ? "Write stage blocking, lighting cues, or movement notes... (Press Enter ↵)"
                              : activeSpeaker === "scene-heading"
                              ? "e.g. ACT I, SCENE 1: KURUKSHETRA DUSK... (Press Enter ↵)"
                              : `Write dialogue spoken by ${activeSpeaker}... (Press Enter ↵ to add to Storyboard)`
                          }
                          className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-2xl p-3.5 text-xs sm:text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 transition-all placeholder:text-[#8C5A54]/60 resize-none"
                        />
                        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#8C5A54] pointer-events-none hidden sm:block">
                          ↵ Enter to Add
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!currentLineInput.trim()}
                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider px-6 rounded-2xl shadow-md shadow-[#8C241E]/20 flex items-center justify-center gap-2 border border-[#A6352F] cursor-pointer transition-all disabled:opacity-50 min-h-[50px] shrink-0"
                      >
                        <Plus className="w-4 h-4 text-[#FFD0CC]" />
                        <span>Add Line ↵</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. THE LIVE STORYBOARD CANVAS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                      Sequential Storyboard ({storyboardLines.length} Entries)
                    </span>
                    <span className="text-[10px] font-mono text-[#8C5A54]">
                      Click text on any card to edit in-place
                    </span>
                  </div>

                  {storyboardLines.length === 0 ? (
                    <div className="bg-[#FAF2EE] border border-dashed border-[#DCBAB2] rounded-[2.5rem] p-12 text-center space-y-3">
                      <Film className="w-10 h-10 text-[#8C5A54]/60 mx-auto" />
                      <h4 className="font-serif text-lg text-[#2A1816]">Storyboard is empty</h4>
                      <p className="text-xs text-[#6E4742] font-serif italic max-w-md mx-auto">
                        Choose a character above, enter their opening dialogue or stage direction, and press <strong>Enter</strong> to construct your script line by line.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {storyboardLines.map((line, idx) => (
                        <div
                          key={line.id}
                          className={`rounded-2xl p-4 sm:p-5 transition-all shadow-xs border text-left group ${
                            line.type === "scene-heading"
                              ? "bg-[#2A1816] text-[#FDF8F7] border-black"
                              : line.type === "stage-note"
                              ? "bg-[#F5EAE6] border-l-4 border-l-[#8C241E] border-[#DCBAB2]"
                              : "bg-[#FAF2EE] border-[#DCBAB2] hover:border-[#B32D25]/50"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-current/10">
                            {/* Speaker Tag / Dropdown Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-[#8C5A54] uppercase">
                                #{idx + 1}
                              </span>

                              {line.type === "scene-heading" ? (
                                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD0CC]">
                                  🏛️ Scene Heading
                                </span>
                              ) : line.type === "stage-note" ? (
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8C241E]">
                                  🎬 Stage Direction
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: line.color || "#8C241E" }}
                                  />
                                  <select
                                    value={line.characterName}
                                    onChange={(e) => handleUpdateLineSpeaker(line.id, e.target.value)}
                                    className="bg-[#F5EAE6] border border-[#DCBAB2] rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816] cursor-pointer focus:outline-none"
                                  >
                                    {characters.map((c) => (
                                      <option key={c.id || c.name} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                    <option value="stage-note">🎬 Stage Direction</option>
                                    <option value="scene-heading">🏛️ Scene Heading</option>
                                  </select>
                                </div>
                              )}
                            </div>

                            {/* Card Quick Actions: Reorder & Delete */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveLine(idx, "up")}
                                className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === storyboardLines.length - 1}
                                onClick={() => handleMoveLine(idx, "down")}
                                className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLine(line.id)}
                                className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 flex items-center justify-center transition-all cursor-pointer"
                                title="Delete Line"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Inline Editable Dialogue Textarea */}
                          <div className="pt-2.5">
                            <textarea
                              rows={Math.max(1, Math.ceil(line.text.length / 80))}
                              value={line.text}
                              onChange={(e) => handleUpdateLineText(line.id, e.target.value)}
                              className={`w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#8C241E]/30 rounded-lg p-1.5 transition-all resize-none leading-relaxed ${
                                line.type === "scene-heading"
                                  ? "font-mono font-bold uppercase tracking-wider text-sm text-[#FDF8F7]"
                                  : line.type === "stage-note"
                                  ? "font-serif italic text-xs sm:text-sm text-[#5C3B37]"
                                  : "font-serif text-sm sm:text-base text-[#2A1816]"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                      <div ref={storyboardEndRef} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Freeform Plate Rich Text Editor Canvas */
              <div className="space-y-4">
                <PlateEditor
                  markdownContent={markdownContent}
                  onChangeMarkdown={(markdown) => {
                    setMarkdownContent(markdown);
                    const parsed = parseMarkdownToStoryboardLines(markdown, characters);
                    setStoryboardLines(parsed);
                  }}
                  onChangeText={(text) => triggerLiveAnalysis(text)}
                />
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex justify-between items-center bg-[#FAF2EE] p-5 rounded-2xl border border-[#DCBAB2] shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                ← Edit Characters
              </button>
              <button
                type="button"
                onClick={() => {
                  const md = convertStoryboardLinesToMarkdown(storyboardLines);
                  setMarkdownContent(md);
                  setCurrentStep(4);
                }}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#8C241E]/20 flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
              >
                <span>Proceed to Preview</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: FINAL PREVIEW & EXPORT */}
        {currentStep === 4 && (
          <div className="space-y-6 w-full">
            {/* Complete Playbook Preview Card */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-8 sm:p-12 shadow-md space-y-8 font-serif text-left">
              <div className="text-center border-b border-[#DCBAB2]/70 pb-6 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                  Official Aayam Playbook
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#2A1816] tracking-tight">
                  {title || "Untitled Script"}
                </h1>
                <p className="text-xs sm:text-sm font-serif italic text-[#6E4742]">
                  by {playwright} • {genre} • {language}
                </p>
                {labels && (
                  <div className="flex justify-center flex-wrap gap-2 pt-2">
                    {labels.split(",").map((lbl, idx) => (
                      <span
                        key={idx}
                        className="bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      >
                        {lbl.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme & Setting Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs bg-[#F5EAE6] p-5 rounded-2xl border border-[#DCBAB2]">
                <div>
                  <strong className="text-[#8C5A54] font-mono text-[10px] uppercase tracking-wider block mb-1">
                    Theme & Dramatic Conflict:
                  </strong>
                  <span className="text-[#2A1816] leading-relaxed font-serif text-xs">{theme || "N/A"}</span>
                </div>
                <div>
                  <strong className="text-[#8C5A54] font-mono text-[10px] uppercase tracking-wider block mb-1">
                    Setting & Atmosphere:
                  </strong>
                  <span className="text-[#2A1816] leading-relaxed font-serif text-xs">{settingInfo || "N/A"}</span>
                </div>
              </div>

              {abstract && (
                <div className="bg-[#F5EAE6] p-5 rounded-2xl border border-[#DCBAB2] space-y-1 font-serif text-xs">
                  <strong className="text-[#8C5A54] font-mono text-[10px] uppercase tracking-wider block mb-1">
                    Story Synopsis:
                  </strong>
                  <p className="text-[#5C3B37] leading-relaxed italic">{abstract}</p>
                </div>
              )}

              {/* Dramatis Personae */}
              <div className="space-y-2.5 border-b border-[#DCBAB2]/70 pb-6">
                <strong className="text-[#8C5A54] font-mono text-[10px] uppercase tracking-wider block">
                  Dramatis Personae ({characters.length} Roles):
                </strong>
                <div className="flex flex-wrap gap-2">
                  {characters.map((c) => (
                    <span
                      key={c.id || c.name}
                      className="bg-[#FAF2EE] border border-[#DCBAB2] px-3.5 py-1.5 rounded-full font-mono text-[10px] font-semibold text-[#2A1816] flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color || "#8C241E" }} />
                      {c.name} {c.traits && <span className="text-[#8C5A54] font-normal">({Array.isArray(c.traits) ? c.traits.join(", ") : c.traits})</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Theatrical Playbook Flow */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#DCBAB2]/60">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#8C241E]">
                    Script Playbook & Spoken Lines ({storyboardLines.length} Entries)
                  </h3>
                  <span className="text-[10px] font-mono text-[#8C5A54]">
                    Formatted Dramatic Manuscript
                  </span>
                </div>

                <div className="space-y-3.5 p-6 bg-[#F5EAE6]/50 rounded-2xl border border-[#DCBAB2]">
                  {storyboardLines.length > 0 ? (
                    storyboardLines.map((line, idx) => {
                      if (line.type === "scene-heading") {
                        return (
                          <div key={line.id || idx} className="text-center py-2.5 border-y border-[#DCBAB2]/70 my-3">
                            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8C241E]">
                              [{line.text}]
                            </span>
                          </div>
                        );
                      }
                      if (line.type === "stage-note") {
                        return (
                          <div key={line.id || idx} className="p-3 bg-[#FAF2EE] border-l-3 border-[#8C241E] rounded-r-xl font-mono text-xs text-[#6E4742] italic">
                            ({line.text})
                          </div>
                        );
                      }
                      return (
                        <div key={line.id || idx} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color || "#8C241E" }} />
                            <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: line.color || "#8C241E" }}>
                              {line.characterName}:
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#2A1816] font-serif leading-relaxed pl-4 border-l border-[#DCBAB2]/50">
                            "{line.text}"
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <PlateEditor
                      markdownContent={markdownContent}
                      readOnly={true}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FAF2EE] p-6 rounded-2xl border border-[#DCBAB2] shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                ← Back to Storyline
              </button>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    exportScriptToPdf({
                      title: title.trim() || "Untitled Production Script",
                      playwright: playwright.trim() || activeUser?.name,
                      genre,
                      language,
                      acts: "3 Acts",
                      pages: Math.max(1, Math.ceil(storyboardLines.length / 4)),
                      rolesCount: `${characters.length || 6} Roles`,
                      excerpt: abstract,
                      content: JSON.stringify({
                        title,
                        playwright,
                        abstract,
                        theme,
                        settingInfo,
                        labels,
                        characters,
                        lines: storyboardLines
                      })
                    })
                  }
                  className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#8C241E] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveScript("Draft")}
                  className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Save Draft</span>
                </button>

                {isMaintainer ? (
                  <button
                    type="button"
                    onClick={() => handleSaveScript("Public")}
                    className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#8C241E]/20 flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD0CC]" />
                    <span>Publish to Vault</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSaveScript("Pending")}
                    className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-[#8C241E]/20 flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
                  >
                    <Send className="w-3.5 h-3.5 text-[#FFD0CC]" />
                    <span>Submit Request to Publish</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auto-Extract Raw Script Modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent showCloseButton={false} className="max-w-2xl bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-0 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={() => setImportOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
            title="Close dialog"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-10 text-left space-y-4">
            <DialogHeader className="text-left space-y-1.5 border-b border-[#DCBAB2]/70 pb-4 pr-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                Intelligent Dialogue Parser
              </span>
              <DialogTitle className="text-2xl font-serif font-normal text-[#2A1816] flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#8C241E]" /> Auto-Extract Characters & Storyline
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6E4742] font-serif">
                Paste raw theatrical draft text below. The AI parser extracts character voices, stage cues, and line assignments automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2 text-left">
              <div
                className="w-full bg-[#FAF2EE] border-2 border-dashed border-[#DCBAB2] hover:border-[#8C241E]/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setUploadFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <input 
                  type="file" 
                  accept=".pdf,.txt" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-10 h-10 rounded-full bg-[#EEDBD5] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#8C241E]" />
                </div>
                <div className="text-center space-y-1 pointer-events-none">
                  <p className="text-sm font-serif font-medium text-[#2A1816]">
                    {uploadFile ? uploadFile.name : "Upload PDF or Text File"}
                  </p>
                  <p className="text-xs text-[#8C5A54] font-mono">
                    {uploadFile ? "Click or drag to replace" : "Drag & drop your script here, or click to browse"}
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 border-t border-[#DCBAB2]/70"></div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] bg-[#F5EAE6] px-2">OR</span>
                <div className="flex-1 border-t border-[#DCBAB2]/70"></div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                  Paste Raw Script Text
                </label>
                <textarea
                  rows={6}
                  value={rawScriptText}
                  onChange={(e) => setRawScriptText(e.target.value)}
                  placeholder={`Example:\n\nKARN: Ruk gaye na mere pahiye bhi, Keshav?\n[Pacing across stage beside sunken wheel]\nKRISHNA: Pahiya mitti mein nahi phasa Radheya, ahankaar mein phasa hai.`}
                  className="w-full bg-[#FAF2EE] border border-[#DCBAB2] p-4 text-xs font-serif leading-relaxed rounded-2xl focus:outline-none focus:border-[#B32D25] focus:ring-1 focus:ring-[#8C241E]/30 transition-all text-[#2A1816]"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 flex justify-between items-center gap-3 border-t border-[#DCBAB2]/70">
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                disabled={extracting}
                className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAutoExtractScript}
                disabled={extracting}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-[#8C241E]/20 flex items-center gap-1.5 border border-[#A6352F] cursor-pointer transition-all disabled:opacity-50"
              >
                {extracting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD0CC]" />
                    <span>Extracting Script...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FFD0CC]" />
                    <span>Run Parser & Extract</span>
                  </>
                )}
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
