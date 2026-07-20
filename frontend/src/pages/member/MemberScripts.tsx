// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Download, FileText, Lock, BookOpen, Users, Layers, CheckCircle2, ShieldCheck, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScriptItem {
  id: number;
  title: string;
  genre: string;
  playwright: string;
  adaptation: string;
  pages: number;
  acts: string;
  rolesCount: string;
  language: string;
  rehearsalFocus: string;
  excerpt: string;
  fileSize: string;
}

const scriptVaultDetails: Record<string, Partial<ScriptItem>> = {
  "Tamashbin Kathputliya": {
    playwright: "Aayam Collective & Utkarsh (Yuuhi)",
    adaptation: "Hindi Street Play Edition (2024)",
    pages: 34,
    acts: "1 Act (Continuous Courtyard Staging)",
    rolesCount: "15 Roles (5 Lead, 10 Chorus)",
    language: "Hindi / Hindustani Folk",
    rehearsalFocus: "Courtyard Projection & Rhythmic Chants",
    excerpt: "Suno suno re bhaiyo, suno tamashbin ka khel! Kathputliya naachegi, bolega sach ka mel...",
    fileSize: "2.4 MB"
  },
  "DDDJ": {
    playwright: "Abay Nandhiga & Aayam Writing Cell",
    adaptation: "Full Stage Director's Cut (2024)",
    pages: 52,
    acts: "2 Acts (8 Dramatic Scenes)",
    rolesCount: "12 Roles (4 Lead, 8 Ensemble)",
    language: "Hindi / Hinglish",
    rehearsalFocus: "High-Contrast Monologues & Spotlight Cues",
    excerpt: "When the lights fade into crimson, the stage forgets who you were before the curtain rose...",
    fileSize: "3.8 MB"
  },
  "Karn Ki Yachika": {
    playwright: "Classical Hindi Adaptation",
    adaptation: "Verse Tragedy Master Edition (2024)",
    pages: 68,
    acts: "3 Acts (Classical Sanskritic Form)",
    rolesCount: "18 Roles (6 Lead, 12 Chorus)",
    language: "Shuddha Hindi Verse",
    rehearsalFocus: "Voice Modulation & Soliloquy Delivery",
    excerpt: "Dharm rakshti rakshita! Kaun hai jo destiny ko badal sake jab rath ka chakka dharti me dhas jaaye...",
    fileSize: "4.5 MB"
  },
  "Samatvam": {
    playwright: "Samarth Shrivastava",
    adaptation: "Physical Movement & Cue Notation (2024)",
    pages: 28,
    acts: "1 Act (12 Movement Movements)",
    rolesCount: "10 Roles (Synchronized Ensemble)",
    language: "Gestural / Minimal Dialogue",
    rehearsalFocus: "Spatial Rhythm & Synchronized Breathing",
    excerpt: "(Movement Cue 4): The ensemble forms a concentric circle. Slow breathing sync on beat 3...",
    fileSize: "1.9 MB"
  },
  "Speak Up Tara": {
    playwright: "Swati Singh",
    adaptation: "Contemporary Social Drama Script (2024)",
    pages: 44,
    acts: "2 Acts (6 Scenes)",
    rolesCount: "10 Roles (3 Lead, 7 Supporting)",
    language: "Hindi & English",
    rehearsalFocus: "Emotional Realism & Dialogue Pacing",
    excerpt: "Tara: Silence isn't safety. If we don't speak up today, our stories will be written by others...",
    fileSize: "3.1 MB"
  }
};

export default function MemberScripts() {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/plays`)
      .then(res => res.json())
      .then(data => {
        setScripts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDownload = (title: string) => {
    alert(`Downloading official annotated script: ${title}_Official_Script.pdf`);
  };

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Header - Clean Bannerless Styling */}
      <div className="bg-[#fdf9f4] border border-[#e6e2dd] rounded-[16px] p-[28px] md:p-[36px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] shadow-xs">
        <div className="space-y-[10px] flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#635f41]/10 text-[#635f41] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-[#635f41]" />
            </div>
            <div>
              <h2 className="text-[28px] font-bold font-serif text-[#635f41] tracking-tight">Script Vault & Production Texts</h2>
              <p className="text-xs text-[#466272]/80 font-medium">Official Playbooks • Rehearsal Cuts • Cue Annotations</p>
            </div>
          </div>
          <p className="text-[13px] text-[#466272] leading-relaxed max-w-3xl font-light pt-1">
            Access complete production playbooks, character breakdowns, and line cuts verified by Aayam's directorial team. All scripts contain scene cues and rehearsal notations.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 font-bold text-xs flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-700" /> Ensemble Confidential
          </Badge>
        </div>
      </div>

      {/* Script Cards Grid - Clean, Bannerless & Richly Informative */}
      {loading ? (
        <div className="text-center py-16 text-[#466272]/70 font-semibold italic">Accessing script vault...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          {scripts.map((item) => {
            const meta = scriptVaultDetails[item.title] || {
              playwright: item.director || "Aayam Creative Cell",
              adaptation: "Standard Staging Edition",
              pages: 40,
              acts: "Full Length Script",
              rolesCount: "Ensemble Roster",
              language: "Hindi & English",
              rehearsalFocus: "Dialogue & Scene Work",
              excerpt: "Official rehearsal playbook excerpt available in full PDF script download.",
              fileSize: "3.0 MB"
            };

            return (
              <div 
                key={item.id}
                className="bg-white border border-[#e6e2dd] rounded-2xl p-6 md:p-8 hover:border-[#635f41] hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                {/* Script Title & Playwright Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-[#e6e2dd]/60 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.2em] block mb-1">
                        {meta.adaptation}
                      </span>
                      <h3 className="text-2xl font-bold font-serif text-[#1c1b19] tracking-tight">{item.title}</h3>
                      <p className="text-xs text-[#466272] font-semibold mt-1">
                        Playwright / Adaptation: <span className="text-[#1c1b19]">{meta.playwright}</span>
                      </p>
                    </div>
                    <Badge className="bg-[#8CC0EB]/20 text-[#001e2c] border border-[#8CC0EB]/40 font-bold text-[10px] uppercase tracking-wider px-3 py-1 flex-shrink-0">
                      {meta.language}
                    </Badge>
                  </div>

                  {/* Informative Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#fdf9f4] p-4 rounded-xl border border-[#e6e2dd]/80 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#466272]/70 block flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#635f41]" /> Length
                      </span>
                      <span className="font-bold text-[#1c1b19] block">{meta.pages} Pages</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#466272]/70 block flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#635f41]" /> Structure
                      </span>
                      <span className="font-bold text-[#1c1b19] truncate block">{meta.acts}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#466272]/70 block flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#635f41]" /> Cast Roster
                      </span>
                      <span className="font-bold text-[#1c1b19] truncate block">{meta.rolesCount}</span>
                    </div>
                  </div>

                  {/* Scene Excerpt */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#635f41] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#635f41]" /> Script Scene Excerpt
                    </h4>
                    <div className="p-3.5 bg-[#f7f3ee]/60 border border-[#e6e2dd] rounded-xl font-serif text-xs italic text-[#1c1b19] leading-relaxed">
                      "{meta.excerpt}"
                    </div>
                  </div>

                  {/* Rehearsal Focus */}
                  <div className="flex items-center gap-2 text-xs text-[#466272] bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    <ShieldCheck className="w-4 h-4 text-[#8CC0EB] flex-shrink-0" />
                    <span><strong>Rehearsal Focus:</strong> {meta.rehearsalFocus}</span>
                  </div>
                </div>

                {/* Download Footer */}
                <div className="pt-4 border-t border-[#e6e2dd] flex items-center justify-between gap-4">
                  <div className="text-xs text-[#466272] font-mono">
                    <strong>Format:</strong> Annotated PDF ({meta.fileSize})
                  </div>
                  <Button 
                    onClick={() => handleDownload(item.title)}
                    className="bg-[#635f41] hover:bg-[#635f41]/90 text-white font-bold rounded-lg px-5 py-2.5 text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download Script PDF
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
