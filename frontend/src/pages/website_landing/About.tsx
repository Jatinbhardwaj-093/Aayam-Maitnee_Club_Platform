// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Users, BookOpen, HeartHandshake, ArrowRight, Compass, Theater, Mail, ExternalLink, Quote, Flame, Eye, Landmark, MoveRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-[#E7DDD3] text-[#2C2A28] font-sans pb-24 selection:bg-[#F8E8E4]">
      
      {/* 1. MANIFESTO HERO HEADER WITH IMAGE */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 overflow-hidden border-b border-[#D5C9BE]/40">
        <div className="absolute inset-0 z-0">
          <img src="/aayam_assets/aayam_site_img_1.jpg" alt="Aayam Hero" className="w-full h-full object-cover opacity-20 object-center mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#E7DDD3]/80 via-[#E7DDD3]/95 to-[#E7DDD3]" />
        </div>
        
        <div className="max-w-6xl mx-auto space-y-8 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-xs font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
            <span className="w-2 h-2 rounded-full bg-[#E85F57] animate-pulse" />
            <span>FOUNDING TREATISE // AAYAM 2026</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal font-serif tracking-tight leading-[0.92] text-[#2C2A28] max-w-4xl mx-auto">
            We do not just act. <br />
            <span className="italic font-serif font-light text-[#E85F57]">We inhabit.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#666361] max-w-2xl mx-auto leading-relaxed font-normal">
            Aayam is the archival theatrical collective of IIT Madras BS. We exist to reclaim the raw physical vitality of the stage — fusing visceral street satire with the intellectual weight of classical tragedy.
          </p>

          <div className="pt-8 flex flex-wrap gap-4 items-center justify-center w-full">
            <Link
              to="/plays"
              className="bg-[#E85F57] text-white hover:bg-[#D94538] px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-xl active:scale-95 transition-all flex items-center gap-2.5 group"
            >
              <span>Explore Theatrical Works</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE MANIFESTO TREATISE (EDITORIAL ESSAY) WITH SPLIT LAYOUT */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16 border-b border-[#D5C9BE]/40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57]">
                ARTICLE I // CONVICTION
              </span>
              <h3 className="font-serif text-4xl md:text-5xl font-normal text-[#2C2A28] leading-snug">
                The Stage as an Arena of Truth
              </h3>
            </div>

            <div className="space-y-6 text-sm md:text-lg text-[#666361] leading-relaxed font-light">
              <p>
                In an era dominated by transient digital feeds and passive consumption, live dramaturgy remains the singular space where human beings gather in real space, breathing identical air, witnessing real vulnerability without a safety net.
              </p>
              <p>
                We reject sterile imitation. Whether performing in the unvarnished dust of the Student Activity Centre courtyard for a <em>Nukkad Natak</em>, or under the calibrated spotlights of the Central Lecture Theatre, every actor at Aayam is trained to dissolve self-consciousness into the character’s moral spine.
              </p>
              <p className="font-medium text-[#2C2A28]">
                Theatre is not a mirror reflecting society; it is a hammer shaping it. We build that hammer through relentless rehearsal, intellectual rigor, and an uncompromising dedication to the ensemble.
              </p>
            </div>
          </div>
          
          <div className="relative">
             <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
               <img src="/aayam_assets/aayam_site_img_2.jpg" alt="Aayam Performance" className="w-full h-full object-cover filter contrast-125 brightness-90" />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-[#2C2A28] text-white p-8 rounded-3xl border border-[#353535] shadow-2xl max-w-sm hidden md:block">
               <Quote className="w-8 h-8 text-[#E85F57] opacity-80 mb-4" />
               <p className="font-serif text-lg leading-relaxed">"Theatre does not exist to comfort our certainties. It exists to dismantle them."</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE ARTISTIC DOCTRINES (ENHANCED) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16 border-b border-[#D5C9BE]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57] mb-3">
              <span>ARTICLE II // PILLARS</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-normal text-[#2C2A28] tracking-tight">
              Artistic Doctrines
            </h2>
            <p className="mt-4 text-[#666361] text-lg">The foundational methodologies that govern our rehearsal spaces and stagecraft.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: "01", title: "Street Satire", desc: "High-impact Nukkad Natak street theatre. We break formal boundaries by using the natural resonance of dholak beats, choral sync, and biting satire.", img: "/aayam_assets/tamashbin_1.jpg", icon: Theater, tag: "NATAK" },
            { id: "02", title: "Classical Weight", desc: "Rigorous script analysis and classical verse performance. We honor historical tragedies, ethical dilemmas, and multi-layered proscenium narratives.", img: "/aayam_assets/kky_1.jpg", icon: BookOpen, tag: "SAHITYA" },
            { id: "03", title: "Physical Expression", desc: "Movement is dialogue. From Navarasa facial control to synchronized ensemble stage blocking, we construct compelling spatial tableaux.", img: "/aayam_assets/samatvam_1.jpg", icon: Compass, tag: "ABHINAYA" },
            { id: "04", title: "Collaborative Craft", desc: "An inclusive home for student actors, scriptwriters, directors, light technicians, costume designers, and cultural patrons.", img: "/aayam_assets/dddj_1.jpg", icon: HeartHandshake, tag: "SANGHA" }
          ].map((doc, idx) => (
            <div key={idx} className="group bg-[#2C2A28] text-white border border-[#353535] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row">
              <div className="md:w-2/5 aspect-square md:aspect-auto overflow-hidden">
                <img src={doc.img} alt={doc.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="p-8 md:p-10 space-y-4 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#E85F57] font-bold tracking-widest">{doc.id} // {doc.tag}</span>
                  <doc.icon className="w-5 h-5 text-white/40" />
                </div>
                <h3 className="text-2xl font-normal font-serif text-[#F7F5F0]">{doc.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed font-light">
                  {doc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXECUTIVE COMMITTEE & GOVERNANCE */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-[#D5C9BE]/40 pb-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57]">
              <span>EXECUTIVE GOVERNANCE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-normal font-serif text-[#2C2A28] tracking-tight">
              Directorial Council
            </h2>
          </div>
          <Link to="/directory" className="text-xs font-bold text-[#2C2A28] hover:text-[#E85F57] uppercase tracking-widest flex items-center gap-1.5 transition-colors bg-white/40 px-6 py-3 rounded-full border border-[#353535]/10 hover:bg-[#2C2A28] hover:text-white">
            <span>View Ensemble Directory</span> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Abay */}
          <div className="bg-[#2C2A28] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/utkarsh_yuuhi.jpg" alt="Abay Nandhiga" className="w-full h-56 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
            <div>
              <h4 className="font-normal font-serif text-xl text-[#F7F5F0]">Abay Nandhiga</h4>
              <span className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-wider block">Secretary Aayam</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Directing play runs, managing society governance, and inter-collegiate drama festival tours.
            </p>
          </div>

          {/* Yuuhi */}
          <div className="bg-[#2C2A28] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/abay_nandhiga.jpg" alt="Yuuhi" className="w-full h-56 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
            <div>
              <h4 className="font-normal font-serif text-xl text-[#F7F5F0]">Yuuhi</h4>
              <span className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-wider block">Deputy Secretary</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Lead street theatre performer, Nukkad Natak director, and acting masterclass facilitator.
            </p>
          </div>

          {/* Samarth */}
          <div className="bg-[#2C2A28] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/my_pic.jpg" alt="Samarth Shrivastava" className="w-full h-56 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
            <div>
              <h4 className="font-normal font-serif text-xl text-[#F7F5F0]">Samarth Shrivastava</h4>
              <span className="text-[10px] font-mono font-semibold text-[#E85F57] uppercase tracking-wider block">Chief Coordinator</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Overseeing stage production logistics, venue allocations, and auditorium technical setups.
            </p>
          </div>

          {/* Swati */}
          <div className="bg-[#2C2A28] text-white border border-[#353535] rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-[#E85F57]/50 transition-all">
            <img src="/aayam_assets/profiles/swati_singh.jpg" alt="Swati Singh" className="w-full h-56 object-cover object-top rounded-2xl filter brightness-90 contrast-105" />
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
      <section className="px-6 md:px-12 pt-12 pb-12">
        <div className="max-w-7xl mx-auto bg-[#2C2A28] text-white rounded-[3rem] p-12 md:p-24 text-center space-y-8 border border-[#353535] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/aayam_assets/aayam_site_img_3.jpg')] opacity-10 bg-cover bg-center mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E85F57]/20 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30 mb-6">
              <span>OFFICIAL DESK // REACH OUT</span>
            </div>

            <h2 className="text-4xl md:text-7xl font-normal font-serif text-[#F7F5F0] tracking-tight max-w-3xl mx-auto leading-tight">
              Step Into the Circle
            </h2>

            <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light mt-6 mb-12">
              Whether you are an aspiring actor, seasoned scriptwriter, or backstage coordinator — your voice belongs on the stage. Join the ensemble.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
              <a 
                href="https://www.instagram.com/iitmbs_dramasociety" 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#353535]/80 hover:bg-[#E85F57] border border-white/10 hover:border-transparent p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs group"
              >
                <ExternalLink className="w-5 h-5 text-[#E85F57] group-hover:text-white mb-1" /> Instagram
              </a>

              <a 
                href="https://www.youtube.com/@AayamIITMBSDramaSociety" 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#353535]/80 hover:bg-[#E85F57] border border-white/10 hover:border-transparent p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs group"
              >
                <ExternalLink className="w-5 h-5 text-[#E85F57] group-hover:text-white mb-1" /> YouTube
              </a>

              <a 
                href="https://linktr.ee/aayamdramasociety" 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#353535]/80 hover:bg-[#E85F57] border border-white/10 hover:border-transparent p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs group"
              >
                <ExternalLink className="w-5 h-5 text-[#E85F57] group-hover:text-white mb-1" /> Linktree
              </a>

              <a 
                href="mailto:drama.society@study.iitm.ac.in" 
                className="bg-[#353535]/80 hover:bg-[#E85F57] border border-white/10 hover:border-transparent p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-mono text-white/80 hover:text-white transition-all shadow-xs group"
              >
                <Mail className="w-5 h-5 text-[#E85F57] group-hover:text-white mb-1" /> Email
              </a>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/join">
                <Button className="bg-[#E85F57] hover:bg-white hover:text-[#E85F57] text-white font-bold px-10 py-6 rounded-full text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
                  Apply for Auditions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
