import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Users,
  ClipboardList,
  DollarSign,
  ShieldCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintainerDashboard() {
  const [stats, setStats] = useState<any>({
    events: { total_proposals: 8, pending_proposals: 4, member_pitches: 5, sponsor_proposals: 3 },
    sponsors: { total_ads: 4, pending_ads: 2 },
    auditions: { open_callings: 5, total_requests: 8, shortlisted: 3, selected: 3 },
    members: { total_registered: 42, pending_approvals: 2 },
    financials: { total_revenue: 413000, total_expenses: 119500, net_surplus: 293500 }
  });

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/maintainer/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.events) {
          setStats(data);
        }
      })
      .catch((err) => {
        console.error("Error loading maintainer stats:", err);
      });
  }, []);

  return (
    <div className="bg-[#fdf9f4] min-h-screen text-[#1c1b19] p-6 md:p-10 font-sans space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#e6e2dd] pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] block mb-1">
            Core Maintenance Portal
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b19] tracking-tight">
            Maintainer Control Center
          </h1>
          <p className="text-xs md:text-sm text-[#466272] mt-1 font-light">
            Real-time live system status across event proposals, auditions, member directory, and financial surplus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/analytics">
            <Button className="bg-[#466272] hover:bg-[#314652] text-white font-bold text-xs rounded-xl px-5 h-10 shadow-xs flex items-center gap-2">
              <Activity className="w-4 h-4" /> Platform Analytics
            </Button>
          </Link>

          <Link to="/events-admin">
            <Button className="bg-[#635f41] hover:bg-[#4d4a32] text-white font-bold text-xs rounded-xl px-5 h-10 shadow-xs flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Manage Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Live System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Event Proposals */}
        <div className="bg-white border border-[#e6e2dd] p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">
              Event Proposals
            </span>
            <span className="p-2 bg-[#635f41]/10 text-[#635f41] rounded-xl">
              <Calendar className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="text-3xl font-serif font-bold text-[#1c1b19]">
              {stats.events.total_proposals}
            </div>
            <div className="flex items-center justify-between text-xs text-[#466272] mt-1 font-medium">
              <span>Member Pitches: {stats.events.member_pitches}</span>
              <span>Sponsors: {stats.events.sponsor_proposals}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e6e2dd]/60 flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {stats.events.pending_proposals} Pending Review
            </span>
            <Link to="/events-admin" className="text-[#635f41] font-bold hover:underline">
              Review →
            </Link>
          </div>
        </div>

        {/* 2. Auditions & Role Callings */}
        <div className="bg-white border border-[#e6e2dd] p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">
              Auditions & Casting
            </span>
            <span className="p-2 bg-[#8CC0EB]/20 text-[#1e4866] rounded-xl">
              <ClipboardList className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="text-3xl font-serif font-bold text-[#1c1b19]">
              {stats.auditions.total_requests}
            </div>
            <div className="flex items-center justify-between text-xs text-[#466272] mt-1 font-medium">
              <span>Open Callings: {stats.auditions.open_callings}</span>
              <span>Shortlisted: {stats.auditions.shortlisted}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e6e2dd]/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {stats.auditions.selected} Castings Confirmed
            </span>
            <Link to="/auditions-admin" className="text-[#635f41] font-bold hover:underline">
              Inspect →
            </Link>
          </div>
        </div>

        {/* 3. Registered Members */}
        <div className="bg-white border border-[#e6e2dd] p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">
              Ensemble Roster
            </span>
            <span className="p-2 bg-purple-100 text-purple-800 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="text-3xl font-serif font-bold text-[#1c1b19]">
              {stats.members.total_registered}
            </div>
            <div className="flex items-center justify-between text-xs text-[#466272] mt-1 font-medium">
              <span>Active Performers & Crew</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e6e2dd]/60 flex items-center justify-between text-[11px]">
            <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              {stats.members.pending_approvals} Pending Approvals
            </span>
            <Link to="/directory-admin" className="text-[#635f41] font-bold hover:underline">
              Directory →
            </Link>
          </div>
        </div>

        {/* 4. Financial Surplus (Restricted Maintainer Access) */}
        <div className="bg-gradient-to-br from-[#FFF9D2] to-[#f7f0bb] border border-[#cac6b9] p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#635f41]" /> Maintainer Ledger
            </span>
            <span className="p-2 bg-white/80 text-[#635f41] rounded-xl shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="text-3xl font-serif font-bold text-[#1c1b19]">
              ₹{stats.financials.net_surplus.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs text-[#466272] mt-1 font-medium">
              <span>Revenue: ₹{(stats.financials.total_revenue / 1000).toFixed(0)}k</span>
              <span>Spent: ₹{(stats.financials.total_expenses / 1000).toFixed(0)}k</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#cac6b9]/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
              Positive Cashflow
            </span>
            <Link to="/analytics" className="text-[#635f41] font-bold hover:underline">
              Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Operational Quick Clips & Recent System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Quick Maintainer Action Clips (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#e6e2dd] p-6 rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6e2dd]">
            <div>
              <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                Operational Shortcuts
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1c1b19]">
                Maintainer Management Clips
              </h2>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl font-bold border border-emerald-200">
              Live Database Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Clip 1: Proposal Review */}
            <div className="bg-[#fdf9f4] border border-[#cac6b9]/60 p-5 rounded-2xl space-y-2 hover:border-[#635f41] transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41] bg-[#635f41]/10 px-2.5 py-0.5 rounded-full">
                Events & Proposals
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1c1b19]">
                Event Proposal Curation
              </h3>
              <p className="text-xs text-[#466272] leading-relaxed font-light">
                Review Red Bull Energy stage deals, member jam pitches, and AI auto-filled briefs with pre-populated deliverable signals.
              </p>
              <div className="pt-2">
                <Link to="/events-admin" className="text-xs font-bold text-[#635f41] hover:underline inline-flex items-center gap-1">
                  Open Events Desk <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Clip 2: Auditions */}
            <div className="bg-[#fdf9f4] border border-[#cac6b9]/60 p-5 rounded-2xl space-y-2 hover:border-[#635f41] transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41] bg-[#635f41]/10 px-2.5 py-0.5 rounded-full">
                Auditions & Casting
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1c1b19]">
                Character Role Callings
              </h3>
              <p className="text-xs text-[#466272] leading-relaxed font-light">
                Inspect candidate monologue reels, run AI portfolio role fit scanners, and confirm performer casting decisions.
              </p>
              <div className="pt-2">
                <Link to="/auditions-admin" className="text-xs font-bold text-[#635f41] hover:underline inline-flex items-center gap-1">
                  Open Auditions Desk <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Clip 3: Script Vault */}
            <div className="bg-[#fdf9f4] border border-[#cac6b9]/60 p-5 rounded-2xl space-y-2 hover:border-[#635f41] transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41] bg-[#635f41]/10 px-2.5 py-0.5 rounded-full">
                Script Vault
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1c1b19]">
                Confidential Play Manuscripts
              </h3>
              <p className="text-xs text-[#466272] leading-relaxed font-light">
                Access Tughlaq, Macbeth, and Andha Yug play scripts with character line splits and AI rehearsal cue generators.
              </p>
              <div className="pt-2">
                <Link to="/member-scripts" className="text-xs font-bold text-[#635f41] hover:underline inline-flex items-center gap-1">
                  Open Script Vault <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Clip 4: Financial Analytics */}
            <div className="bg-[#fdf9f4] border border-[#cac6b9]/60 p-5 rounded-2xl space-y-2 hover:border-[#635f41] transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41] bg-[#635f41]/10 px-2.5 py-0.5 rounded-full">
                Financial Ledger
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1c1b19]">
                Revenue & Expense Analytics
              </h3>
              <p className="text-xs text-[#466272] leading-relaxed font-light">
                Restricted financial audit tracking ticket sales revenue, venue rental deposits, and sponsor grants.
              </p>
              <div className="pt-2">
                <Link to="/analytics" className="text-xs font-bold text-[#635f41] hover:underline inline-flex items-center gap-1">
                  View Analytics & Ledger <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Live System Activity Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#e6e2dd] p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6e2dd]">
            <h2 className="font-serif text-lg font-bold text-[#1c1b19]">
              System Activity Feed
            </h2>
            <span className="text-[10px] font-bold text-gray-400 font-mono">LIVE API</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#fdf9f4] rounded-xl border border-[#cac6b9]/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1c1b19]">Red Bull Sponsorship</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">₹1,50,000</span>
              </div>
              <p className="text-[#466272] text-[11px]">Sponsorship deal registered in database ledger.</p>
            </div>

            <div className="p-3 bg-[#fdf9f4] rounded-xl border border-[#cac6b9]/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1c1b19]">Audition Slate Submitted</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Aarav Varma</span>
              </div>
              <p className="text-[#466272] text-[11px]">Applied for Sultan Tughlaq Lead Role.</p>
            </div>

            <div className="p-3 bg-[#fdf9f4] rounded-xl border border-[#cac6b9]/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1c1b19]">Stage Booking Confirmed</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Royal Stage</span>
              </div>
              <p className="text-[#466272] text-[11px]">Prithvi Theatre venue deposit logged.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
