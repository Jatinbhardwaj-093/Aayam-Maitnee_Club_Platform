// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Users, BookOpen, HeartHandshake, ArrowRight, Compass, Theater, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <div className="min-h-screen bg-[#fdf9f4] text-[#466272] font-sans pb-20">
      {/* Hero Section - Warm Aayam Theme */}
      <section className="bg-[#f7f3ee] border-b border-[#e6e2dd] py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#635f41]/10 border border-[#635f41]/20 rounded-full px-4 py-1.5 text-xs text-[#635f41] font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#635f41]" /> The Manifesto | About Aayam
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight leading-tight text-[#635f41]">
            We do not just act. <br />
            <span className="text-[#8CC0EB] italic font-normal">We inhabit.</span>
          </h1>

          <p className="text-base md:text-xl text-[#466272] max-w-3xl leading-relaxed font-light">
            Read our philosophy and open a channel. Aayam is the official drama society of IIT Madras BS. We cultivate character, street satire, and dramatic storytelling across physical courtyards and proscenium auditoriums.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/directory">
              <Button className="bg-[#8CC0EB] hover:bg-[#8CC0EB]/90 text-[#001e2c] font-bold rounded-lg px-6 py-3 text-sm transition-all active:scale-95 shadow-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-[#001e2c]" /> Explore Ensemble Roster
              </Button>
            </Link>
            <Link to="/plays">
              <Button variant="outline" className="border border-[#e6e2dd] bg-white text-[#635f41] hover:bg-[#f7f3ee] rounded-lg px-6 py-3 text-sm font-semibold transition-all">
                Staged Productions <ArrowRight className="w-4 h-4 ml-1 text-[#635f41]" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Philosophy & Pillars */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-[#635f41] text-white border-0 uppercase tracking-widest text-[10px] font-bold px-3 py-1">
            Artistic Pillars
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#635f41]">The Philosophy of Aayam</h2>
          <p className="text-sm text-[#466272] leading-relaxed font-light">
            Four core tenets defining our creative vision, character building, and theatrical productions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white border border-[#e6e2dd] p-8 rounded-2xl space-y-4 hover:border-[#635f41] transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#635f41]/10 text-[#635f41] flex items-center justify-center font-bold">
              <Theater className="w-6 h-6 text-[#635f41]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#635f41]">Street Satire</h3>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              High-impact Nukkad Natak street theatre. Breaking barriers in open courtyards to trigger social awareness and dialogue.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-[#e6e2dd] p-8 rounded-2xl space-y-4 hover:border-[#635f41] transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#8CC0EB]/20 text-[#001e2c] flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6 text-[#001e2c]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#635f41]">Classical Weight</h3>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              Respecting classical drama, verse tragedy, and moral dilemmas performed on stage with intensity and authenticity.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-[#e6e2dd] p-8 rounded-2xl space-y-4 hover:border-[#635f41] transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#635f41]/10 text-[#635f41] flex items-center justify-center font-bold">
              <Compass className="w-6 h-6 text-[#635f41]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#635f41]">Physical Expression</h3>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              Synchronized movement, rhythmic breathwork, and body language balancing the visual rhythm of the ensemble.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-[#e6e2dd] p-8 rounded-2xl space-y-4 hover:border-[#635f41] transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#8CC0EB]/20 text-[#001e2c] flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6 text-[#001e2c]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#635f41]">Inclusive Platform</h3>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              Welcoming student actors, scriptwriters, directors, prop designers, sound engineers, and production leads nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Ensemble Lineage & Executive Leadership */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#e6e2dd] pb-8">
          <div className="space-y-2">
            <Badge className="bg-[#8CC0EB] text-[#001e2c] border-0 font-bold text-[10px] uppercase tracking-wider">
              Ensemble Leadership
            </Badge>
            <h2 className="text-3xl font-bold font-serif text-[#635f41]">Executive Committee (2024–2025)</h2>
          </div>
          <Link to="/directory" className="text-xs font-bold text-[#8CC0EB] hover:text-[#635f41] flex items-center gap-1">
            View Complete Ensemble Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Abay */}
          <div className="bg-white border border-[#e6e2dd] rounded-xl overflow-hidden p-6 space-y-4 shadow-xs">
            <img src="/aayam_assets/profiles/utkarsh_yuuhi.jpg" alt="Abay Nandhiga" className="w-full h-48 object-cover rounded-lg" />
            <div>
              <h4 className="font-bold font-serif text-lg text-[#635f41]">Abay Nandhiga</h4>
              <span className="text-xs font-semibold text-[#8CC0EB] block">Secretary Aayam</span>
            </div>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              Directing play runs, managing society governance, and inter-collegiate drama festival tours.
            </p>
          </div>

          {/* Yuuhi */}
          <div className="bg-white border border-[#e6e2dd] rounded-xl overflow-hidden p-6 space-y-4 shadow-xs">
            <img src="/aayam_assets/profiles/abay_nandhiga.jpg" alt="Yuuhi" className="w-full h-48 object-cover rounded-lg" />
            <div>
              <h4 className="font-bold font-serif text-lg text-[#635f41]">Yuuhi</h4>
              <span className="text-xs font-semibold text-[#8CC0EB] block">Deputy Secretary</span>
            </div>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              Lead street theatre performer, Nukkad Natak director, and acting masterclass facilitator.
            </p>
          </div>

          {/* Samarth */}
          <div className="bg-white border border-[#e6e2dd] rounded-xl overflow-hidden p-6 space-y-4 shadow-xs">
            <img src="/aayam_assets/profiles/samarth_shrivastava.jpg" alt="Samarth Shrivastava" className="w-full h-48 object-cover rounded-lg" />
            <div>
              <h4 className="font-bold font-serif text-lg text-[#635f41]">Samarth Shrivastava</h4>
              <span className="text-xs font-semibold text-[#8CC0EB] block">Chief Coordinator</span>
            </div>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              Overseeing stage production logistics, venue allocations, and auditorium technical setups.
            </p>
          </div>

          {/* Swati */}
          <div className="bg-white border border-[#e6e2dd] rounded-xl overflow-hidden p-6 space-y-4 shadow-xs">
            <img src="/aayam_assets/profiles/swati_singh.jpg" alt="Swati Singh" className="w-full h-48 object-cover rounded-lg" />
            <div>
              <h4 className="font-bold font-serif text-lg text-[#635f41]">Swati Singh</h4>
              <span className="text-xs font-semibold text-[#8CC0EB] block">Content & Web Lead</span>
            </div>
            <p className="text-xs text-[#466272] leading-relaxed font-light">
              Managing digital archives, web portal infrastructure, and official script publications.
            </p>
          </div>
        </div>
      </section>

      {/* Official Channels & Contact */}
      <section className="bg-[#f7f3ee] border-t border-[#e6e2dd] py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-[#635f41] text-white border-0 font-bold uppercase tracking-widest text-[10px] px-3 py-1">
            Open Channel
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#635f41]">Connect With Aayam Drama Society</h2>
          <p className="text-sm md:text-base text-[#466272] max-w-2xl mx-auto leading-relaxed font-light">
            Follow our rehearsal logs, watch performance highlights, or reach out to the executive team.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <a 
              href="https://www.instagram.com/iitmbs_dramasociety" 
              target="_blank" 
              rel="noreferrer"
              className="bg-white border border-[#e6e2dd] hover:border-[#635f41] p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-semibold text-[#466272] hover:text-[#635f41] transition-all shadow-xs"
            >
              <svg className="w-4 h-4 text-[#8CC0EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"/></svg> Instagram <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a 
              href="https://www.youtube.com/@AayamIITMBSDramaSociety" 
              target="_blank" 
              rel="noreferrer"
              className="bg-white border border-[#e6e2dd] hover:border-[#635f41] p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-semibold text-[#466272] hover:text-[#635f41] transition-all shadow-xs"
            >
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> YouTube <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a 
              href="https://linktr.ee/aayamdramasociety" 
              target="_blank" 
              rel="noreferrer"
              className="bg-white border border-[#e6e2dd] hover:border-[#635f41] p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-semibold text-[#466272] hover:text-[#635f41] transition-all shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-emerald-600" /> Linktree
            </a>

            <a 
              href="mailto:drama.society@study.iitm.ac.in" 
              className="bg-white border border-[#e6e2dd] hover:border-[#635f41] p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-semibold text-[#466272] hover:text-[#635f41] transition-all shadow-xs"
            >
              <Mail className="w-4 h-4 text-[#635f41]" /> Official Email
            </a>
          </div>

          <div className="pt-6 flex flex-wrap gap-4 justify-center">
            <Link to="/auditions">
              <Button className="bg-[#8CC0EB] text-[#001e2c] hover:bg-[#8CC0EB]/90 font-bold px-8 py-3 rounded-lg text-sm transition-all shadow-sm">
                Apply for Auditions
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" className="border border-[#e6e2dd] bg-white text-[#635f41] hover:bg-[#f7f3ee] px-8 py-3 rounded-lg text-sm font-semibold transition-all">
                Attend Workshops
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
