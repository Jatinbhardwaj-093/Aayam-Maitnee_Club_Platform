// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Users, BookOpen, HeartHandshake, ArrowRight, Compass, Theater, Mail, ExternalLink, Quote, Flame, Eye, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-[#E7DDD3] text-[#232323] font-sans pb-24 selection:bg-[#F8E8E4]">
      
      {/* 1. MANIFESTO HERO HEADER */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-b border-[#D5C9BE]/40 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-xs font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
            <span className="w-2 h-2 rounded-full bg-[#E85F57] animate-pulse" />
            <span>FOUNDING TREATISE // AAYAM 2026</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-normal font-serif tracking-tight leading-[0.92] text-[#232323]">
            We do not just act. <br />
            <span className="italic font-serif font-light text-[#E85F57]">We inhabit.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#666361] max-w-3xl leading-relaxed font-normal">
            Aayam is the archival theatrical collective of IIT Madras BS. We exist to reclaim the raw physical vitality of the stage — fusing visceral street satire with the intellectual weight of classical tragedy.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link
              to="/plays"
              className="bg-[#E85F57] text-white hover:bg-[#D94538] px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2.5 group"
            >
              <span>Explore Theatrical Works</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/directory"
              className="border border-[#353535]/30 text-[#232323] bg-white/40 hover:bg-[#232323] hover:text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
            >
              The Ensemble Roster
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE MANIFESTO TREATISE (EDITORIAL ESSAY) */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto space-y-16 border-b border-[#D5C9BE]/40">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57]">
              ARTICLE I // CONVICTION
            </span>
            <h3 className="font-serif text-3xl font-normal text-[#232323] leading-snug">
              The Stage as an Arena of Truth
            </h3>
          </div>

          <div className="md:col-span-8 space-y-6 text-sm md:text-base text-[#666361] leading-relaxed font-light">
            <p>
              In an era dominated by transient digital feeds and passive consumption, live dramaturgy remains the singular space where human beings gather in real space, breathing identical air, witnessing real vulnerability without a safety net.
            </p>
            <p>
              We reject sterile imitation. Whether performing in the unvarnished dust of the Student Activity Centre courtyard for a <em>Nukkad Natak</em>, or under the calibrated spotlights of the Central Lecture Theatre, every actor at Aayam is trained to dissolve self-consciousness into the character’s moral spine.
            </p>
          </div>
        </div>

        {/* Highlighted Quote Callout */}
        <div className="bg-[#232323] text-white p-10 md:p-14 rounded-3xl border border-[#353535] shadow-2xl space-y-6">
          <Quote className="w-8 h-8 text-[#E85F57] opacity-80" />
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F7F5F0] font-normal leading-snug">
            "Theatre does not exist to comfort our certainties. It exists to dismantle them, allowing empathy to take root where dogma once stood."
          </blockquote>
          <div className="pt-2 text-xs font-mono text-[#E85F57] tracking-widest uppercase">
            — AAYAM DIRECTORIAL COUNCIL • EST. 2024
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE ARTISTIC DOCTRINES */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto space-y-16 border-b border-[#D5C9BE]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57] mb-1.5">
              <span>ARTICLE II // PILLARS</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-[#232323] tracking-tight">
              Artistic Doctrines
            </h2>
          </div>
          <span className="text-xs font-mono text-[#666361] uppercase tracking-wider">
            FOUR PILLARS OF PERFORMANCE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Doctrine 1 */}
          <div className="bg-[#232323] text-white border border-[#353535] p-8 md:p-10 rounded-3xl space-y-5 shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#353535] text-[#E85F57] flex items-center justify-center font-bold">
                <Theater className="w-6 h-6 text-[#E85F57]" />
              </div>
              <span className="font-mono text-xs text-white/40 font-bold">01 // NATAK</span>
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#F7F5F0]">Street Satire & Courtyard Directness</h3>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light">
              High-impact <em>Nukkad Natak</em> street theatre. We break formal boundaries by using the natural resonance of dholak beats, choral sync, and biting satire to challenge social inequities in public courtyards.
            </p>
          </div>

          {/* Doctrine 2 */}
          <div className="bg-[#232323] text-white border border-[#353535] p-8 md:p-10 rounded-3xl space-y-5 shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#353535] text-[#E85F57] flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6 text-[#E85F57]" />
              </div>
              <span className="font-mono text-xs text-white/40 font-bold">02 // SAHITYA</span>
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#F7F5F0]">Classical Weight & Dramaturgy</h3>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light">
              Rigorous script analysis and classical verse performance. We honor historical tragedies, ethical dilemmas (such as <em>Karn Ki Yachika</em>), and multi-layered proscenium narratives with authenticity.
            </p>
          </div>

          {/* Doctrine 3 */}
          <div className="bg-[#232323] text-white border border-[#353535] p-8 md:p-10 rounded-3xl space-y-5 shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#353535] text-[#E85F57] flex items-center justify-center font-bold">
                <Compass className="w-6 h-6 text-[#E85F57]" />
              </div>
              <span className="font-mono text-xs text-white/40 font-bold">03 // ABHINAYA</span>
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#F7F5F0]">Physical Expression & Spatial Geometry</h3>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light">
              Movement is dialogue. From Navarasa facial control to synchronized ensemble stage blocking, we construct compelling spatial tableaux that evoke emotional tension without excess ornamentation.
            </p>
          </div>

          {/* Doctrine 4 */}
          <div className="bg-[#232323] text-white border border-[#353535] p-8 md:p-10 rounded-3xl space-y-5 shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#353535] text-[#E85F57] flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6 text-[#E85F57]" />
              </div>
              <span className="font-mono text-xs text-white/40 font-bold">04 // SANGHA</span>
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#F7F5F0]">Open Platform & Collaborative Craft</h3>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light">
              An inclusive home for student actors, scriptwriters, directors, light technicians, costume designers, and cultural patrons across the nationwide IIT Madras BS community.
            </p>
          </div>
        </div>
      </section>

      {/* 4. EXECUTIVE COMMITTEE & GOVERNANCE */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#D5C9BE]/40 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57]">
              <span>EXECUTIVE GOVERNANCE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-normal font-serif text-[#232323] tracking-tight">
              Directorial & Executive Council
            </h2>
          </div>
          <Link to="/directory" className="text-xs font-bold text-[#232323] hover:text-[#E85F57] uppercase tracking-widest flex items-center gap-1.5 transition-colors">
            <span>View Ensemble Directory</span> <ArrowRight className="w-4 h-4 text-[#E85F57]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Abay */}
          <div className="bg-[#232323] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/utkarsh_yuuhi.jpg" alt="Abay Nandhiga" className="w-full h-48 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
            <div>
              <h4 className="font-normal font-serif text-xl text-[#F7F5F0]">Abay Nandhiga</h4>
              <span className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-wider block">Secretary Aayam</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Directing play runs, managing society governance, and inter-collegiate drama festival tours.
            </p>
          </div>

          {/* Yuuhi */}
          <div className="bg-[#232323] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/abay_nandhiga.jpg" alt="Yuuhi" className="w-full h-48 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
            <div>
              <h4 className="font-normal font-serif text-xl text-[#F7F5F0]">Yuuhi</h4>
              <span className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-wider block">Deputy Secretary</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Lead street theatre performer, Nukkad Natak director, and acting masterclass facilitator.
            </p>
          </div>

          {/* Samarth */}
          <div className="bg-[#232323] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/samarth_shrivastava.jpg" alt="Samarth Shrivastava" className="w-full h-48 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
            <div>
              <h4 className="font-normal font-serif text-xl text-[#F7F5F0]">Samarth Shrivastava</h4>
              <span className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-wider block">Chief Coordinator</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Overseeing stage production logistics, venue allocations, and auditorium technical setups.
            </p>
          </div>

          {/* Swati */}
          <div className="bg-[#232323] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/swati_singh.jpg" alt="Swati Singh" className="w-full h-48 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
            <div>
              <h4 className="font-normal font-serif text-xl text-[#F7F5F0]">Swati Singh</h4>
              <span className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-wider block">Content & Web Lead</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Managing digital archives, web portal infrastructure, and official script publications.
            </p>
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL CHANNELS & AUDITIONS CTA */}
      <section className="px-6 md:px-12 pt-8">
        <div className="max-w-5xl mx-auto bg-[#232323] text-white rounded-3xl p-10 md:p-16 text-center space-y-8 border border-[#353535] shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
            <span>OFFICIAL DESK // REACH OUT</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-normal font-serif text-[#F7F5F0] tracking-tight">
            Step Into the Circle
          </h2>

          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light">
            Whether you are an aspiring actor, seasoned scriptwriter, or backstage coordinator — your voice belongs on the stage.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
            <a 
              href="https://www.instagram.com/iitmbs_dramasociety" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#353535]/80 hover:bg-[#353535] border border-white/10 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs"
            >
              Instagram <ExternalLink className="w-3 h-3 text-[#E85F57]" />
            </a>

            <a 
              href="https://www.youtube.com/@AayamIITMBSDramaSociety" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#353535]/80 hover:bg-[#353535] border border-white/10 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs"
            >
              YouTube <ExternalLink className="w-3 h-3 text-[#E85F57]" />
            </a>

            <a 
              href="https://linktr.ee/aayamdramasociety" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#353535]/80 hover:bg-[#353535] border border-white/10 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs"
            >
              Linktree <ExternalLink className="w-3 h-3 text-[#E85F57]" />
            </a>

            <a 
              href="mailto:drama.society@study.iitm.ac.in" 
              className="bg-[#353535]/80 hover:bg-[#353535] border border-white/10 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#E85F57]" /> Email
            </a>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link to="/join">
              <Button className="bg-[#E85F57] hover:bg-[#D94538] text-white font-bold px-9 py-4 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                Apply for Auditions
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" className="border border-white/20 bg-transparent text-[#F7F5F0] hover:bg-white/10 px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                Upcoming Happenings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
