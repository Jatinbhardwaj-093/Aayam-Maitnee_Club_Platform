// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, PlayCircle, Users, MapPin, Calendar, Clock, Award, ArrowRight, BookOpen, Layers, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Play {
  id: number;
  title: string;
  description: string;
  director: string;
  cast?: string;
  venue?: string;
  season?: string;
  runtime?: string;
  dates?: string;
  price?: string;
  status?: string;
}

const detailedPlayInfo: Record<string, any> = {
  "Tamashbin Kathputliya": {
    tagline: "A Satirical Street Play on Modern Society & Puppetry of Fate",
    acts: "1 Act • Continuous Open Street Performance",
    castCount: "15 Ensemble Performers",
    theme: "Social Satire, Street Theatre, Folk Rhythms",
    rehearsalSchedule: "Tuesdays & Thursdays (Courtyard Stage)",
    scriptUrl: "/scripts/tamashbin_script.pdf"
  },
  "DDDJ": {
    tagline: "High-Tension Dramatic Spotlight Showcase & Monologue Series",
    acts: "2 Acts • 8 Dramatic Sequences",
    castCount: "12 Ensemble Performers",
    theme: "Psychological Drama, Character Monologues",
    rehearsalSchedule: "Wednesdays & Saturdays (CLT Hall)",
    scriptUrl: "/scripts/dddj_script.pdf"
  },
  "Karn Ki Yachika": {
    tagline: "Classical Hindi Tragedy on Duty, Honor, and Moral Dilemmas",
    acts: "3 Acts • Classical Stage Drama",
    castCount: "18 Performers & Chorus",
    theme: "Epic Tragedy, Classical Verse, Moral Philosophy",
    rehearsalSchedule: "Mondays & Fridays (SAC Amphitheatre)",
    scriptUrl: "/scripts/kky_script.pdf"
  },
  "Samatvam": {
    tagline: "Physical Theatre & Contemporary Rhythmic Movement Exploration",
    acts: "1 Act • Rhythmic Sequence",
    castCount: "10 Movement Performers",
    theme: "Physical Theatre, Group Balance, Expression",
    rehearsalSchedule: "Sundays (Studio Hall 2)",
    scriptUrl: "/scripts/samatvam_script.pdf"
  },
  "Speak Up Tara": {
    tagline: "Empowering Social Drama on Identity, Courage, and Voice",
    acts: "2 Acts • 6 Scenes",
    castCount: "10 Lead & Supporting Performers",
    theme: "Social Expression, Contemporary Realism",
    rehearsalSchedule: "Tuesdays & Saturdays (Open Stage)",
    scriptUrl: "/scripts/speak_up_tara_script.pdf"
  }
};

export default function MemberPlays() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/plays`)
      .then(res => res.json())
      .then(data => {
        setPlays(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-[32px] font-sans text-[#666361]">
      {/* Header Banner - Clean Text Style without Image Overlay */}
      <div className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-[16px] p-[28px] md:p-[36px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] shadow-xs">
        <div className="space-y-[12px] flex-1">
          <Badge className="bg-[#353535] text-white border-0 rounded-[4px] uppercase tracking-wider text-[10px] font-bold">
            Repertoire & Production Vault
          </Badge>
          <h2 className="text-[32px] font-bold font-serif text-[#353535] tracking-tight">Production Plays</h2>
          <p className="text-[14px] text-[#666361] max-w-3xl leading-relaxed font-light">
            Comprehensive production guides, staging details, cast rosters, and rehearsal specifications for Aayam theatrical works. Clean, bannerless cards detailed for directors, performers, and technical crew.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link to="/member-scripts">
            <Button className="bg-[#E85F57] hover:bg-[#E85F57]/90 text-[#001e2c] font-bold rounded-[8px] py-[12px] px-[22px] gap-2 shadow-sm transition-all active:scale-95">
              <FileText className="w-4.5 h-4.5 text-[#001e2c]" /> Open Script Library
            </Button>
          </Link>
        </div>
      </div>

      {/* Plays Grid - Clean Bannerless Informative Cards */}
      {loading ? (
        <div className="text-center py-16 text-[#666361]/70 font-semibold italic">Loading production details...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          {plays.map((play) => {
            const extra = detailedPlayInfo[play.title] || {
              tagline: "Aayam Stage Production & Rehearsal Guide",
              acts: "Full Length Production",
              castCount: "Ensemble Cast",
              theme: "Theatrical Performance",
              rehearsalSchedule: "Weekly Rehearsal Slots"
            };

            return (
              <div 
                key={play.id} 
                className="bg-white border border-[#DDD8CE] rounded-2xl p-6 md:p-8 hover:border-[#353535] hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                {/* Header Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-[#DDD8CE]/60 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#353535] uppercase tracking-[0.2em] block mb-1">
                        {play.season || "2024-2025 Lineage"}
                      </span>
                      <h3 className="text-2xl font-bold font-serif text-[#232323] tracking-tight">{play.title}</h3>
                      <p className="text-xs text-[#353535] font-semibold italic mt-1">{extra.tagline}</p>
                    </div>
                    <Badge className="bg-[#353535]/10 text-[#353535] border border-[#353535]/20 font-bold text-[10px] uppercase tracking-wider px-3 py-1 flex-shrink-0">
                      {play.status || "Active Repertoire"}
                    </Badge>
                  </div>

                  {/* Key Specifications Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#E7DDD3] p-4 rounded-xl border border-[#DDD8CE]/80 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666361]/70 block flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#353535]" /> Director
                      </span>
                      <span className="font-bold text-[#232323] truncate block">{play.director || "Ensemble Lead"}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666361]/70 block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#353535]" /> Venue
                      </span>
                      <span className="font-bold text-[#232323] truncate block">{play.venue || "OAT IIT Madras"}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666361]/70 block flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#353535]" /> Runtime
                      </span>
                      <span className="font-bold text-[#232323] truncate block">{play.runtime || "90 Mins"}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666361]/70 block flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#353535]" /> Structure
                      </span>
                      <span className="font-bold text-[#232323] truncate block">{extra.acts}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666361]/70 block flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#353535]" /> Cast Size
                      </span>
                      <span className="font-bold text-[#232323] truncate block">{extra.castCount}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666361]/70 block flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#353535]" /> Rehearsals
                      </span>
                      <span className="font-bold text-[#232323] truncate block">{extra.rehearsalSchedule}</span>
                    </div>
                  </div>

                  {/* Synopsis Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#353535]">Production Synopsis & Themes</h4>
                    <p className="text-xs text-[#666361] leading-relaxed font-light">
                      {play.description}
                    </p>
                  </div>

                  {/* Featured Cast Roster */}
                  {play.cast && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold text-[#353535] uppercase tracking-wider block">Featured Performers:</span>
                      <p className="text-xs font-medium text-[#232323] bg-gray-50 p-2.5 rounded-lg border border-gray-200/60">
                        {play.cast}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-[#DDD8CE] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-[#666361] font-semibold">
                    <Tag className="w-3.5 h-3.5 text-[#E85F57]" /> {extra.theme}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link 
                      to="/member-scripts" 
                      className="flex-1 sm:flex-initial bg-[#E85F57] text-[#001e2c] hover:bg-[#E85F57]/90 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" /> Download Script
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
