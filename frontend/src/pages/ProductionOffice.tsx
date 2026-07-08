import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Shirt,
  Armchair,
  Theater,
  Volume2,
  ArrowRight,
  MoreVertical,
  Edit,
  SlidersHorizontal,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RosterMember {
  name: string;
  email: string;
  role: string;
  roleBgClass: string;
  roleTextClass: string;
  availability: string;
  initials: string;
  status: "available" | "checked-out" | "rehearsals";
}

const initialRoster: RosterMember[] = [
  {
    name: "Elena Wells",
    email: "elena.w@stagedoor.art",
    role: "Lead Actress",
    roleBgClass: "bg-sky-blue",
    roleTextClass: "text-on-secondary-fixed-variant",
    availability: "Full-time",
    initials: "EW",
    status: "available"
  },
  {
    name: "Marcus Kane",
    email: "m.kane@stagedoor.art",
    role: "Stage Manager",
    roleBgClass: "bg-soft-peach",
    roleTextClass: "text-on-primary-fixed-variant",
    availability: "Rehearsals Only",
    initials: "MK",
    status: "rehearsals"
  },
  {
    name: "Sofia Chen",
    email: "s.chen@stagedoor.art",
    role: "Set Designer",
    roleBgClass: "bg-sky-blue",
    roleTextClass: "text-on-secondary-fixed-variant",
    availability: "On-call",
    initials: "SC",
    status: "available"
  }
];

export default function ProductionOffice() {
  const [roster, setRoster] = useState<RosterMember[]>(initialRoster);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "available" | "rehearsals">("all");
  const [open, setOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Actor");
  const [newAvailability, setNewAvailability] = useState("Full-time");
  const [newStatus, setNewStatus] = useState<"available" | "checked-out" | "rehearsals">("available");

  // Show inline toast
  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Filter functionality
  const filteredRoster = roster.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && m.status === filterType;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const initials = newName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const isActor = newRole.toLowerCase().includes("actor") || newRole.toLowerCase().includes("actress") || newRole.toLowerCase().includes("lead");

    const newMember: RosterMember = {
      name: newName,
      email: newEmail,
      role: newRole,
      roleBgClass: isActor ? "bg-sky-blue" : "bg-soft-peach",
      roleTextClass: isActor ? "text-on-secondary-fixed-variant" : "text-on-primary-fixed-variant",
      availability: newAvailability,
      initials: initials || "MB",
      status: newStatus
    };

    setRoster([...roster, newMember]);
    setNewName("");
    setNewEmail("");
    setNewRole("Actor");
    setNewAvailability("Full-time");
    setNewStatus("available");
    setOpen(false);
    showToast(`Successfully added ${newName} to roster.`);
  };

  const toggleAvailability = (index: number) => {
    setRoster(prev => prev.map((m, idx) => {
      if (idx === index) {
        const nextStatus = m.status === "available" ? "rehearsals" : "available";
        const nextAvail = nextStatus === "available" ? "Full-time" : "Rehearsals Only";
        showToast(`Toggled ${m.name} availability to ${nextAvail}.`);
        return { ...m, status: nextStatus, availability: nextAvail };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto min-h-screen relative pb-16">
      {/* Header Section */}
      <section className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-[#1c1b19] mb-2 font-serif text-[40px] leading-[48px] font-semibold">
          Production Office
        </h2>
        <p className="font-body-lg text-body-lg text-[#49473d] max-w-2xl opacity-80 text-[18px] leading-[28px]">
          Managing the intricate layers of the 2024 Winter Matinee Season. Every prop, every sponsor, every member matters.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">

        {/* Member Database - 8 Columns */}
        <div
          className="lg:col-span-8 bg-white rounded-xl border border-[#cac6b9] p-6 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-[2px]"
          style={{ boxShadow: "0 8px 32px rgba(140, 192, 235, 0.08)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md text-[#635f41] font-serif text-[28px] leading-[36px] font-semibold">
                Member Database
              </h3>
              <p className="font-label-md text-label-md text-[#49473d] text-[14px]">
                Active cast and crew directory
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative flex items-center bg-[#f7f3ee] px-3 py-1.5 rounded-lg border border-[#cac6b9]/40 text-[#49473d]">
                <Search className="w-4 h-4 mr-1 text-[#49473d]/50" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 text-sm w-36 sm:w-44 placeholder:text-[#49473d]/50 font-sans"
                />
              </div>

              {/* Filter Dropdown */}
              <Dialog open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                <DialogTrigger render={<Button variant="outline" className="px-4 py-2 border border-[#8CC0EB] text-[#466272] font-semibold rounded-lg hover:bg-[#BFDDF0]/20 transition-colors flex items-center gap-2" />}>
                  <Filter className="w-4 h-4" /> Filter
                </DialogTrigger>
                <DialogContent className="bg-[#fdf9f4] border border-[#cac6b9] text-[#466272] max-w-xs">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-[#635f41]">Filter Members</DialogTitle>
                    <DialogDescription className="text-xs text-[#49473d]">
                      Select availability status to filter the roster.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-2">
                    <button
                      onClick={() => { setFilterType("all"); setFilterMenuOpen(false); }}
                      className={`w-full p-2 text-left rounded-lg text-sm transition-all ${filterType === "all" ? "bg-[#8CC0EB]/20 font-bold text-[#635f41]" : "hover:bg-[#f7f3ee]"}`}
                    >
                      All Roster
                    </button>
                    <button
                      onClick={() => { setFilterType("available"); setFilterMenuOpen(false); }}
                      className={`w-full p-2 text-left rounded-lg text-sm transition-all ${filterType === "available" ? "bg-[#8CC0EB]/20 font-bold text-[#635f41]" : "hover:bg-[#f7f3ee]"}`}
                    >
                      Full-time / Active
                    </button>
                    <button
                      onClick={() => { setFilterType("rehearsals"); setFilterMenuOpen(false); }}
                      className={`w-full p-2 text-left rounded-lg text-sm transition-all ${filterType === "rehearsals" ? "bg-[#8CC0EB]/20 font-bold text-[#635f41]" : "hover:bg-[#f7f3ee]"}`}
                    >
                      Rehearsals Only
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Member Dialog */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger render={<Button className="px-4 py-2 bg-[#8CC0EB] text-[#1c1b19] font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm" />}>
                  <Plus className="w-4 h-4" /> Add
                </DialogTrigger>
                <DialogContent className="bg-[#fdf9f4] border border-[#cac6b9] text-[#466272]">
                  <form onSubmit={handleAddMember}>
                    <DialogHeader>
                      <DialogTitle className="font-serif text-[#635f41]">Initialize Roster Member</DialogTitle>
                      <DialogDescription className="text-xs text-[#49473d]">
                        Add a new cast or crew member to the StageDoor database.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#635f41]">Full Name</label>
                        <Input
                          placeholder="Elena Wells"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="border-[#cac6b9] bg-white focus-visible:ring-[#8CC0EB]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#635f41]">Email Address</label>
                        <Input
                          type="email"
                          placeholder="elena.w@stagedoor.art"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="border-[#cac6b9] bg-white focus-visible:ring-[#8CC0EB]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#635f41]">Role Designation</label>
                        <Input
                          placeholder="Lead Actress"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="border-[#cac6b9] bg-white focus-visible:ring-[#8CC0EB]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#635f41]">Availability Type</label>
                        <Input
                          placeholder="Full-time"
                          value={newAvailability}
                          onChange={(e) => setNewAvailability(e.target.value)}
                          className="border-[#cac6b9] bg-white focus-visible:ring-[#8CC0EB]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#635f41]">Status/Availability State</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 text-xs text-[#49473d] cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={newStatus === "available"}
                              onChange={() => setNewStatus("available")}
                            />
                            Available / Active
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-[#49473d] cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={newStatus === "rehearsals"}
                              onChange={() => setNewStatus("rehearsals")}
                            />
                            Rehearsals Only
                          </label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-[#8CC0EB] text-[#466272] hover:bg-[#8CC0EB]/10 rounded-lg">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:opacity-90 rounded-lg">
                        Save Member
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#cac6b9] text-[#49473d]">
                  <th className="pb-4 font-label-md text-label-md uppercase tracking-wider text-[#49473d]/70 text-xs font-semibold">Member</th>
                  <th className="pb-4 font-label-md text-label-md uppercase tracking-wider text-[#49473d]/70 text-xs font-semibold">Role</th>
                  <th className="pb-4 font-label-md text-label-md uppercase tracking-wider text-[#49473d]/70 text-xs font-semibold">Availability</th>
                  <th className="pb-4 font-label-md text-label-md uppercase tracking-wider text-[#49473d]/70 text-xs font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cac6b9]/30">
                {filteredRoster.map((m, idx) => (
                  <tr key={m.email} className="group hover:bg-[#f7f3ee]/20 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FFF9D2] border border-[#cac6b9] flex items-center justify-center text-xs font-bold text-[#635f41]">
                          {m.initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#1c1b19] text-sm">{m.name}</div>
                          <div className="text-xs text-[#49473d]/70">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-none border-none ${m.roleBgClass} ${m.roleTextClass}`}>
                        {m.role}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#466272]">
                        <span className={`w-2 h-2 rounded-full ${m.status === "available" ? "bg-[#635f41]" : "bg-orange-400"}`}></span>
                        {m.availability}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAvailability(idx)}
                        className="text-xs hover:bg-[#8CC0EB]/10 text-[#466272] border border-[#8CC0EB]/20 bg-white shadow-none h-8"
                      >
                        Toggle Status
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredRoster.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-[#49473d]/70">
                      No roster members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue & Sponsorship - 4 Columns */}
        <div className="lg:col-span-4 space-y-6">
          {/* Revenue Tracking Card */}
          <div
            className="bg-[#FFF9D2]/70 rounded-xl border border-[#cac6b9] p-6 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-[2px]"
            style={{ boxShadow: "0 8px 32px rgba(140, 192, 235, 0.08)" }}
          >
            <h3 className="font-headline-md text-headline-md text-[#635f41] font-serif text-[28px] leading-[36px] font-semibold mb-1">
              Revenue Tracking
            </h3>
            <p className="font-label-md text-label-md text-[#49473d] text-sm mb-4">
              Sponsorship &amp; Ad Sales
            </p>
            <div className="flex items-end gap-2 mb-6">
              <span className="font-headline-lg text-headline-lg text-[#1c1b19] font-serif text-[40px] leading-[48px] font-semibold">
                $24,800
              </span>
              <span className="text-[#635f41] font-bold pb-2 text-sm">↑ 12%</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#49473d]">Playbill Ad Slots</span>
                  <span className="font-bold text-[#1c1b19]">18/24 Sold</span>
                </div>
                <div className="w-full bg-[#e6e2dd] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#8CC0EB] h-full w-[75%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#49473d]">Corporate Patrons</span>
                  <span className="font-bold text-[#1c1b19]">12 Active</span>
                </div>
                <div className="w-full bg-[#e6e2dd] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#635f41] h-full w-[50%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Sponsor Card */}
          <div
            className="bg-white rounded-xl border border-[#cac6b9] p-6 shadow-sm relative overflow-hidden group transition-transform duration-300 ease-out hover:-translate-y-[2px]"
            style={{ boxShadow: "0 8px 32px rgba(140, 192, 235, 0.08)" }}
          >
            <div className="relative z-10">
              <h4 className="font-bold text-[#635f41] text-xs mb-2 uppercase tracking-wide">Featured Sponsor</h4>
              <div className="h-12 w-32 bg-[#FFF9D2] border border-[#cac6b9]/40 rounded flex items-center justify-center mb-4">
                <span className="font-headline-md text-lg text-[#635f41] italic font-semibold font-serif">Azure Arts</span>
              </div>
              <p className="text-xs text-[#49473d] mb-4">
                Renewing for the 2025 season. Platinum tier partner.
              </p>
              <button
                onClick={() => showToast("Azure Arts Profile loaded")}
                className="text-sm font-bold text-[#8CC0EB] flex items-center gap-1 hover:gap-2 transition-all"
              >
                Manage Partner <ArrowRight className="w-3 h-3 hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#8CC0EB]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          </div>
        </div>

        {/* Inventory Management - 6 Columns */}
        <div
          className="lg:col-span-6 bg-white rounded-xl border border-[#cac6b9] p-6 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-[2px]"
          style={{ boxShadow: "0 8px 32px rgba(140, 192, 235, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md text-[#635f41] font-serif text-[28px] leading-[36px] font-semibold">
              Inventory &amp; Assets
            </h3>
            <span className="text-[#635f41]/60 text-xs font-semibold bg-[#f7f3ee] px-2.5 py-1 rounded-md border border-[#cac6b9]/30">Auto Audited</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-[#cac6b9]/60 rounded-lg bg-[#fdf9f4]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Shirt className="w-4 h-4 text-[#8CC0EB]" />
                <span className="font-bold text-[#1c1b19] text-xs">Costumes</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#635f41] font-serif">1,240</div>
                <p className="text-[11px] text-[#49473d]/70 mt-1">42 requiring repair</p>
              </div>
            </div>

            <div className="p-4 border border-[#cac6b9]/60 rounded-lg bg-[#fdf9f4]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Armchair className="w-4 h-4 text-[#8CC0EB]" />
                <span className="font-bold text-[#1c1b19] text-xs">Props</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#635f41] font-serif">856</div>
                <p className="text-[11px] text-[#49473d]/70 mt-1">12 out on loan</p>
              </div>
            </div>

            <div className="p-4 border border-[#cac6b9]/60 rounded-lg bg-[#fdf9f4]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Theater className="w-4 h-4 text-[#635f41]" />
                <span className="font-bold text-[#1c1b19] text-xs">Lighting Kit</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#635f41] font-serif">14</div>
                <p className="text-[11px] text-[#49473d]/70 mt-1">All functional</p>
              </div>
            </div>

            <div className="p-4 border border-[#cac6b9]/60 rounded-lg bg-[#fdf9f4]/40 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-[#635f41]" />
                <span className="font-bold text-[#1c1b19] text-xs">Audio Gear</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#635f41] font-serif">22</div>
                <p className="text-[11px] text-[#49473d]/70 mt-1">3 scheduled for maint.</p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => showToast("Generating audit report...")}
            className="w-full mt-6 py-3 border border-[#cac6b9] text-[#49473d] hover:bg-[#f7f3ee] text-xs font-bold rounded-lg transition-colors"
          >
            Full Inventory Audit Report
          </Button>
        </div>

        {/* Place & Stage Booking - 6 Columns */}
        <div
          className="lg:col-span-6 bg-white rounded-xl border border-[#cac6b9] p-6 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-[2px]"
          style={{ boxShadow: "0 8px 32px rgba(140, 192, 235, 0.08)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md text-[#635f41] font-serif text-[28px] leading-[36px] font-semibold">
              Stage &amp; Studio Bookings
            </h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-[#635f41]/10 text-[#635f41] rounded text-[10px] font-bold select-none">Today</span>
              <span className="px-2 py-1 text-[#49473d]/60 rounded text-[10px] font-bold cursor-pointer hover:bg-slate-50 transition-colors select-none">Week</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 hover:bg-[#f7f3ee]/40 rounded-lg transition-colors group">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#FFF9D2] rounded-lg border border-[#cac6b9] text-[#635f41]">
                <span className="text-xs font-bold font-mono">09:00</span>
                <span className="text-[9px] uppercase font-bold tracking-tight">AM</span>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-[#1c1b19] text-sm">Main Stage: Macbeth Rehearsal</h5>
                <p className="text-xs text-[#49473d]">Director: James Thorne • 3 Hours</p>
              </div>
              <Edit className="w-4 h-4 text-[#49473d]/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs" />
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-[#f7f3ee]/40 rounded-lg transition-colors group">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#8CC0EB]/20 rounded-lg border border-[#8CC0EB]/30 text-[#466272]">
                <span className="text-xs font-bold font-mono">02:30</span>
                <span className="text-[9px] uppercase font-bold tracking-tight">PM</span>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-[#1c1b19] text-sm">Studio B: Script Workshop</h5>
                <p className="text-xs text-[#49473d]">Literary Team • 1.5 Hours</p>
              </div>
              <Edit className="w-4 h-4 text-[#49473d]/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs" />
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-[#f7f3ee]/40 rounded-lg transition-colors group">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#FFF9D2] rounded-lg border border-[#cac6b9] text-[#635f41]">
                <span className="text-xs font-bold font-mono">07:00</span>
                <span className="text-[9px] uppercase font-bold tracking-tight">PM</span>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-[#1c1b19] text-sm">Main Stage: Technical Load-in</h5>
                <p className="text-xs text-[#49473d]">Crew A • Overnight</p>
              </div>
              <Edit className="w-4 h-4 text-[#49473d]/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#cac6b9]/40 flex items-center justify-between">
            <p className="text-[11px] text-[#49473d]/80 italic">Next availability: Tomorrow 10:00 AM (Studio A)</p>
            <Button
              onClick={() => showToast("Opening room scheduler...")}
              className="px-4 py-2 bg-[#635f41] text-white hover:opacity-90 rounded-lg text-sm font-semibold transition-opacity"
            >
              Book Room
            </Button>
          </div>
        </div>

      </div>

      {/* Inline Toast Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFF9D2] border-2 border-[#cac6b9] text-[#635f41] px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="text-sm font-bold tracking-wide font-sans">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
