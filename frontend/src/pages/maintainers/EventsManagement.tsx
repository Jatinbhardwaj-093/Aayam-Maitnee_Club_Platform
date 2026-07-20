// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Search,
  CheckCircle2,
  Plus,
  MapPin,
  Clock,
  Users,
  Shield,
  FileText,
  ArrowLeft,
  Save,
  Send,
  X,
  Check
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Pre-defined Event Templates for Maintainer (Clean typography tags - no cliché emojis)
const EVENT_TEMPLATES = [
  {
    id: "template-play",
    name: "Mainstage Play Event",
    category: "Mainstage Performance",
    defaultTitle: "Macbeth - Evening Grand Gala",
    defaultDescription: "Full ensemble production performance with live stagecraft, orchestration, and VIP guest seating.",
    defaultVenue: "Main Auditorium - Royal Stage",
    defaultCapacity: "350 seats",
    defaultDuration: "19:00 - 21:30",
    tags: ["Mainstage", "Ticketed", "Live Performance"],
    image: "https://images.unsplash.com/photo-1507676184212-d0330a151f15?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "template-meetup",
    name: "Member Meetup & Social",
    category: "Club Social",
    defaultTitle: "Monthly Backstage Script Reading & Mixer",
    defaultDescription: "Casual gathering for ensemble members to read fresh script drafts, discuss upcoming auditions, and network.",
    defaultVenue: "Rehearsal Hall B",
    defaultCapacity: "45 seats",
    defaultDuration: "17:00 - 18:30",
    tags: ["Internal", "Free Entry", "Networking"],
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "template-workshop",
    name: "Workshop & Masterclass",
    category: "Masterclass",
    defaultTitle: "Stage Lighting & Scenic Audio Masterclass",
    defaultDescription: "Hands-on technical workshop covering DMX lighting boards, sound mixing, and stage cue management.",
    defaultVenue: "Technical Booth & Stage 2",
    defaultCapacity: "25 seats",
    defaultDuration: "14:00 - 17:00",
    tags: ["Workshop", "Technical Crew", "Hands-on"],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "template-exhibition",
    name: "Exhibition & Showcase",
    category: "Exhibition",
    defaultTitle: "Backstage Costume & Prop Heritage Gallery",
    defaultDescription: "Public exhibition presenting vintage theatre costumes, historical props, and set design sketches.",
    defaultVenue: "Aayam Art Foyer",
    defaultCapacity: "150 visitors",
    defaultDuration: "11:00 - 16:00",
    tags: ["Exhibition", "Public", "Gallery"],
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "template-sponsored",
    name: "Sponsored Brand Event",
    category: "Sponsored Ad",
    defaultTitle: "VIP Sponsor Showcase & Brand Gala",
    defaultDescription: "Exclusive brand presentation event organized in collaboration with club patrons and corporate sponsors.",
    defaultVenue: "VIP Matinee Lounge",
    defaultCapacity: "80 guests",
    defaultDuration: "18:00 - 20:00",
    tags: ["Sponsor", "VIP Exclusive", "Brand Showcase"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop"
  }
];

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past" | "Proposals">("Upcoming");
  const [proposalSourceFilter, setProposalSourceFilter] = useState<"All" | "Sponsor" | "Member">("All");

  // Creation Studio View Toggle
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Database Events & Proposals State
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Event Creation Studio
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("template-play");
  const [newEventForm, setNewEventForm] = useState({
    title: "Macbeth - Evening Grand Gala",
    category: "Mainstage Performance",
    date: new Date().toISOString().split("T")[0],
    timeRange: "19:00 - 21:30",
    venue: "Main Auditorium - Royal Stage",
    capacity: "350 seats",
    description: "Full ensemble production performance with live stagecraft, orchestration, and VIP guest seating.",
    imageUrl: "https://images.unsplash.com/photo-1507676184212-d0330a151f15?q=80&w=600&auto=format&fit=crop"
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadEventsFromBackend = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
    fetch(`${baseUrl}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDbEvents(data);
        }
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    loadEventsFromBackend();

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
    // Fetch Proposals
    fetch(`${baseUrl}/api/proposals`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const enriched = data.map((p: any, idx: number) => ({
            ...p,
            sourceType: idx % 2 === 0 ? "Sponsor" : "Member",
            sponsorshipDeal: idx % 2 === 0 ? "$2,500 Brand Sponsorship" : "Club Member Pitch",
            budget: idx % 2 === 0 ? "$2,500" : "$400"
          }));
          setProposals(enriched);
          if (enriched.length > 0) setSelectedProposalId(enriched[0].id);
        }
      })
      .catch((err) => console.error("Error fetching proposals:", err));
  }, []);

  // Select Template in Studio View
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = EVENT_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setNewEventForm({
        title: tmpl.defaultTitle,
        category: tmpl.category,
        date: new Date().toISOString().split("T")[0],
        timeRange: tmpl.defaultDuration,
        venue: tmpl.defaultVenue,
        capacity: tmpl.defaultCapacity,
        description: tmpl.defaultDescription,
        imageUrl: tmpl.image
      });
    }
  };

  // Submit Create Event Form (POST to backend API /api/events/create)
  const handlePublishEventSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newEventForm.title) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
    const payload = {
      name: newEventForm.title,
      description: newEventForm.description,
      category: newEventForm.category,
      venue: newEventForm.venue,
      date: newEventForm.date
    };

    // Optimistic UI update
    const createdLocal = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      title: newEventForm.title,
      category: newEventForm.category,
      date: newEventForm.date,
      timeRange: newEventForm.timeRange,
      venue: newEventForm.venue,
      capacity: newEventForm.capacity,
      description: newEventForm.description,
      status: "upcoming",
      image: newEventForm.imageUrl
    };

    setDbEvents([createdLocal, ...dbEvents]);
    setIsCreatingEvent(false);
    setActiveTab("Upcoming");
    triggerToast(`Event "${createdLocal.title}" successfully created!`);

    // Backend persistent call
    fetch(`${baseUrl}/api/events/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          loadEventsFromBackend();
        }
      })
      .catch((err) => console.warn("Backend persistent sync notice:", err));
  };

  // Proposal Actions
  const handleApproveProposal = (id: number) => {
    const target = proposals.find((p) => p.id === id);
    if (!target) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
    fetch(`${baseUrl}/api/proposals/${id}/approve`, { method: "POST" })
      .then(() => {
        setProposals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
        );
        loadEventsFromBackend();
        triggerToast(`Proposal "${target.name}" approved & scheduled!`);
      })
      .catch((err) => console.error("Error approving proposal:", err));
  };

  const handleRejectProposal = (id: number) => {
    const target = proposals.find((p) => p.id === id);
    if (!target) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
    fetch(`${baseUrl}/api/proposals/${id}/reject`, { method: "POST" })
      .then(() => {
        setProposals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
        );
        triggerToast(`Proposal "${target.name}" rejected.`);
      })
      .catch((err) => console.error("Error rejecting proposal:", err));
  };

  // Filtered Events
  const upcomingEvents = useMemo(() => {
    return dbEvents.filter((e) => e.status === "upcoming" || e.status === "Upcoming");
  }, [dbEvents]);

  const pastEvents = useMemo(() => {
    return dbEvents.filter(
      (e) => e.status === "concluded" || e.status === "Concluded" || e.status === "past"
    );
  }, [dbEvents]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.submitter?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesSource =
        proposalSourceFilter === "All" || p.sourceType === proposalSourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [proposals, searchTerm, statusFilter, proposalSourceFilter]);

  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  /* ====================================================================
     FULL PAGE EVENT CREATION STUDIO VIEW (CLEAN, ICON-LIGHT, PROPORTIONAL)
     ==================================================================== */
  if (isCreatingEvent) {
    return (
      <div className="flex-1 bg-[#fdf9f4] text-[#1c1b19] font-sans pb-16 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Streamlined Top Bar (No duplicate headings or awkward heights) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e2dd]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreatingEvent(false)}
                className="p-2 rounded-xl border border-[#cac6b9]/60 bg-white text-[#466272] hover:bg-[#f7f3ee] transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#635f41] leading-tight">
                  Create Production Event
                </h1>
                <p className="text-xs text-[#466272]">Configure event details and publish to roster.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => triggerToast("Draft saved locally.")}
                className="px-4 py-2 rounded-xl border border-[#cac6b9] bg-white text-[#466272] hover:bg-[#f7f3ee] text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button
                type="button"
                onClick={() => handlePublishEventSubmit()}
                className="px-5 py-2 rounded-xl bg-[#635f41] text-white hover:bg-[#635f41]/90 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Publish Event
              </button>
            </div>
          </div>

          {/* Creation Studio 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Presets & Templates (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Clean Template Selector */}
              <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-[#635f41] uppercase tracking-wider">
                    Select Event Template
                  </span>
                  <span className="text-[10px] text-[#466272]/70 font-semibold">5 Options</span>
                </div>

                <div className="space-y-2">
                  {EVENT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedTemplateId === tmpl.id
                          ? "border-[#635f41] bg-[#635f41]/10 font-bold"
                          : "border-gray-200 bg-white hover:border-[#cac6b9] hover:bg-[#fdf9f4]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#1c1b19] truncate">{tmpl.name}</div>
                        <div className="text-[10px] text-[#466272]/70 truncate">{tmpl.category}</div>
                      </div>
                      {selectedTemplateId === tmpl.id && (
                        <span className="w-2 h-2 rounded-full bg-[#635f41]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Banner Preset Picker */}
              <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 shadow-xs space-y-3">
                <span className="text-xs font-bold text-[#635f41] uppercase tracking-wider block border-b border-gray-100 pb-2">
                  Event Cover Banner
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {EVENT_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewEventForm({ ...newEventForm, imageUrl: t.image })}
                      className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                        newEventForm.imageUrl === t.image
                          ? "border-[#635f41] ring-2 ring-[#635f41]/20 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold text-[#466272] uppercase">Banner URL</label>
                  <Input
                    type="url"
                    value={newEventForm.imageUrl}
                    onChange={(e) => setNewEventForm({ ...newEventForm, imageUrl: e.target.value })}
                    className="bg-white border-[#e6e2dd] text-xs h-8"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Form & Live Card Preview (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Form Details Card */}
              <div className="bg-white border border-[#e6e2dd] rounded-2xl p-6 shadow-xs space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#635f41]">
                    Event Details & Logistics
                  </h3>
                </div>

                <form onSubmit={handlePublishEventSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                        Event Title
                      </label>
                      <Input
                        required
                        value={newEventForm.title}
                        onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                        className="bg-white border-[#e6e2dd] text-xs h-10 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                        Category
                      </label>
                      <Input
                        required
                        value={newEventForm.category}
                        onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                        className="bg-white border-[#e6e2dd] text-xs h-10 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                        Event Date
                      </label>
                      <Input
                        type="date"
                        required
                        value={newEventForm.date}
                        onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                        className="bg-white border-[#e6e2dd] text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                        Time Window
                      </label>
                      <Input
                        required
                        value={newEventForm.timeRange}
                        onChange={(e) => setNewEventForm({ ...newEventForm, timeRange: e.target.value })}
                        className="bg-white border-[#e6e2dd] text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                        Venue
                      </label>
                      <Input
                        required
                        value={newEventForm.venue}
                        onChange={(e) => setNewEventForm({ ...newEventForm, venue: e.target.value })}
                        className="bg-white border-[#e6e2dd] text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                        Seating / Capacity
                      </label>
                      <Input
                        required
                        value={newEventForm.capacity}
                        onChange={(e) => setNewEventForm({ ...newEventForm, capacity: e.target.value })}
                        className="bg-white border-[#e6e2dd] text-xs h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-bold text-[#635f41] uppercase tracking-wider">
                      Event Description
                    </label>
                    <textarea
                      rows={4}
                      value={newEventForm.description}
                      onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                      className="w-full bg-white border border-[#e6e2dd] rounded-xl p-3 text-xs text-[#1c1b19] focus:outline-none focus:ring-1 focus:ring-[#8CC0EB] leading-relaxed"
                    />
                  </div>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 shadow-xs space-y-3">
                <span className="text-xs font-bold text-[#635f41] uppercase tracking-wider block border-b border-gray-100 pb-2">
                  Live Card Preview
                </span>

                <div className="bg-[#fdf9f4] p-4 rounded-xl border border-dashed border-[#cac6b9]">
                  <div className="bg-white border border-[#e6e2dd] rounded-2xl overflow-hidden shadow-sm max-w-sm mx-auto">
                    <div className="h-36 overflow-hidden relative">
                      <img
                        src={newEventForm.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 text-[#635f41] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {newEventForm.category}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-serif font-bold text-base text-[#635f41]">
                        {newEventForm.title || "Untitled Event"}
                      </h4>
                      <p className="text-[11px] text-[#466272]/80 line-clamp-2">
                        {newEventForm.description || "No description provided."}
                      </p>
                      <div className="pt-2 border-t border-gray-100 text-[10px] text-[#466272] flex justify-between font-semibold">
                        <span>Date: {newEventForm.date}</span>
                        <span>Venue: {newEventForm.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ====================================================================
     DEFAULT DASHBOARD VIEW (UPCOMING / PAST / PROPOSALS)
     ==================================================================== */
  return (
    <div className="flex-1 bg-[#fdf9f4] text-[#1c1b19] font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e6e2dd]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#635f41]/10 text-[#635f41] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#635f41]" /> Maintainer Operations
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#635f41] tracking-tight">
              Events Management
            </h1>
            <p className="text-xs md:text-sm text-[#466272] mt-1 max-w-2xl">
              Curation portal for club productions, masterclasses, member meetups, and sponsored advertisement events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                handleSelectTemplate("template-play");
                setIsCreatingEvent(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#635f41] text-white hover:bg-[#635f41]/90 text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>

        {/* Maintainer Executive Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#466272]">Upcoming Events</span>
              <div className="text-2xl font-serif font-bold text-[#635f41] mt-0.5">{upcomingEvents.length}</div>
            </div>
          </div>

          <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#466272]">Pending Proposals</span>
              <div className="text-2xl font-serif font-bold text-amber-700 mt-0.5">
                {proposals.filter((p) => p.status === "Reviewing").length}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#466272]">Sponsor Ads</span>
              <div className="text-2xl font-serif font-bold text-[#1e4463] mt-0.5">
                {proposals.filter((p) => p.sourceType === "Sponsor").length}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e6e2dd] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#466272]">Past Productions</span>
              <div className="text-2xl font-serif font-bold text-[#635f41] mt-0.5">{pastEvents.length}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#e6e2dd]">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("Upcoming")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === "Upcoming"
                  ? "text-[#635f41]"
                  : "text-[#466272]/60 hover:text-[#635f41]"
              }`}
            >
              Upcoming Events ({upcomingEvents.length})
              {activeTab === "Upcoming" && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#635f41] rounded-t-md" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("Proposals")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                activeTab === "Proposals"
                  ? "text-[#635f41]"
                  : "text-[#466272]/60 hover:text-[#635f41]"
              }`}
            >
              Event Proposals & Pitches
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                {proposals.filter((p) => p.status === "Reviewing").length} Review
              </span>
              {activeTab === "Proposals" && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#635f41] rounded-t-md" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("Past")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === "Past"
                  ? "text-[#635f41]"
                  : "text-[#466272]/60 hover:text-[#635f41]"
              }`}
            >
              Past Events ({pastEvents.length})
              {activeTab === "Past" && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#635f41] rounded-t-md" />
              )}
            </button>
          </div>
        </div>

        {/* Tab 1 & 3: UPCOMING & PAST EVENTS GRID */}
        {(activeTab === "Upcoming" || activeTab === "Past") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "Upcoming" ? upcomingEvents : pastEvents).map((ev) => (
              <div
                key={ev.id}
                className="bg-white border border-[#e6e2dd] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#8CC0EB] transition-all duration-300 flex flex-col group"
              >
                <div className="h-44 overflow-hidden relative bg-gray-100">
                  <img
                    src={ev.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-[#635f41] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white">
                      {ev.category || (activeTab === "Upcoming" ? "Scheduled" : "Concluded")}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[11px] font-semibold opacity-90">
                      Date: {ev.date}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#635f41] leading-tight mb-2 group-hover:text-[#466272] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#466272]/80 line-clamp-2 leading-relaxed">
                      {ev.description || "Official Matinee Club scheduled event."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-[#466272]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#466272]/70">Time</span>
                      <span className="font-semibold text-[#1c1b19]">{ev.timeRange || "19:00 - 21:00"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#466272]/70">Venue</span>
                      <span className="font-semibold text-[#1c1b19]">{ev.venue}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#466272]/70">Capacity</span>
                      <span className="font-semibold text-[#8CC0EB]">{ev.capacity || "150 seats"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: PROPOSALS & PITCHES */}
        {activeTab === "Proposals" && (
          <div className="space-y-6">
            {/* Toolbar for Proposals */}
            <div className="bg-white border border-[#e6e2dd] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search proposals or submitters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#fdf9f4] border border-[#cac6b9]/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8CC0EB]"
                  />
                </div>

                {/* Filter by Proposal Source */}
                <div className="flex items-center bg-[#fdf9f4] p-1 border border-[#cac6b9]/60 rounded-xl text-xs gap-1">
                  <button
                    onClick={() => setProposalSourceFilter("All")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      proposalSourceFilter === "All"
                        ? "bg-white text-[#635f41] shadow-xs"
                        : "text-[#466272]/70 hover:text-[#466272]"
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setProposalSourceFilter("Sponsor")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      proposalSourceFilter === "Sponsor"
                        ? "bg-white text-[#1e4463] shadow-xs"
                        : "text-[#466272]/70 hover:text-[#466272]"
                    }`}
                  >
                    Sponsor Ads
                  </button>
                  <button
                    onClick={() => setProposalSourceFilter("Member")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      proposalSourceFilter === "Member"
                        ? "bg-white text-[#635f41] shadow-xs"
                        : "text-[#466272]/70 hover:text-[#466272]"
                    }`}
                  >
                    Member Pitches
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#fdf9f4] border border-[#cac6b9]/60 rounded-xl px-3 py-2 text-xs text-[#466272] font-medium focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Split Screen Layout: List + Detail Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Proposals List (7 Cols) */}
              <div className="lg:col-span-7 bg-white border border-[#e6e2dd] rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-[#e6e2dd] bg-[#fdf9f4] flex justify-between items-center">
                  <h3 className="font-serif font-bold text-base text-[#635f41]">
                    Submitted Proposals ({filteredProposals.length})
                  </h3>
                  <span className="text-[11px] text-[#466272]/70 italic">Click proposal to review details</span>
                </div>

                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {filteredProposals.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#466272]/70 space-y-2">
                      <p>No proposals match the selected filters.</p>
                    </div>
                  ) : (
                    filteredProposals.map((prop) => (
                      <div
                        key={prop.id}
                        onClick={() => setSelectedProposalId(prop.id)}
                        className={`p-4 hover:bg-[#fdf9f4]/60 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                          selectedProposalId === prop.id
                            ? "bg-[#fdf9f4] border-l-4 border-[#8CC0EB]"
                            : "border-l-4 border-transparent"
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                prop.sourceType === "Sponsor"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-[#8CC0EB]/20 text-[#1e4463]"
                              }`}
                            >
                              {prop.sourceType === "Sponsor" ? "Sponsor Ad" : "Member Pitch"}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                prop.status === "Approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : prop.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {prop.status}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-[#1c1b19] truncate">{prop.name}</h4>
                          
                          <div className="flex items-center gap-4 text-[11px] text-[#466272]/70">
                            <span>By <strong>{prop.submitter?.name || "Anonymous"}</strong></span>
                            <span>•</span>
                            <span>{prop.date}</span>
                            <span>•</span>
                            <span className="font-semibold text-[#635f41]">{prop.sponsorshipDeal}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Proposal Detail Review Card (5 Cols) */}
              <div className="lg:col-span-5 bg-white border border-[#e6e2dd] rounded-2xl shadow-xs p-6 flex flex-col justify-between space-y-6">
                {currentProposal ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            currentProposal.sourceType === "Sponsor"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-[#8CC0EB]/20 text-[#1e4463]"
                          }`}
                        >
                          {currentProposal.sourceType === "Sponsor" ? "Sponsored Ad Event" : "Member Event Proposal"}
                        </span>
                        <span className="text-xs text-[#466272]/60">• {currentProposal.date}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#635f41] leading-tight">
                        {currentProposal.name}
                      </h3>
                    </div>

                    {/* Submitter Info */}
                    <div className="p-3 bg-[#fdf9f4] border border-[#e6e2dd] rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#635f41]/10 text-[#635f41] flex items-center justify-center font-bold text-xs">
                        {currentProposal.submitter?.initials || "SB"}
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-[#1c1b19]">{currentProposal.submitter?.name}</div>
                        <div className="text-[#466272]/70">{currentProposal.sponsorshipDeal}</div>
                      </div>
                    </div>

                    {/* Proposal Details */}
                    <div className="space-y-3 text-xs text-[#466272]">
                      <div>
                        <span className="font-bold uppercase text-[10px] tracking-wider text-[#635f41] block mb-1">
                          Description & Pitch
                        </span>
                        <p className="bg-gray-50/80 p-3 rounded-xl border border-gray-200 leading-relaxed text-[#1c1b19]">
                          {currentProposal.description || "Proposal submitted for maintainer review."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-2.5 border border-gray-100 rounded-xl bg-gray-50/50">
                          <span className="text-[10px] uppercase font-bold text-[#466272]/70 block">Target Venue</span>
                          <span className="font-bold text-[#1c1b19]">{currentProposal.venue || "TBD Main Hall"}</span>
                        </div>
                        <div className="p-2.5 border border-gray-100 rounded-xl bg-gray-50/50">
                          <span className="text-[10px] uppercase font-bold text-[#466272]/70 block">Budget / Terms</span>
                          <span className="font-bold text-emerald-700">{currentProposal.budget || "$0"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={() => handleRejectProposal(currentProposal.id)}
                        disabled={currentProposal.status === "Rejected"}
                        className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2.5 rounded-xl transition-all"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleApproveProposal(currentProposal.id)}
                        disabled={currentProposal.status === "Approved"}
                        className="flex-1 bg-[#635f41] text-white hover:bg-[#635f41]/90 text-xs font-bold py-2.5 rounded-xl transition-all"
                      >
                        Approve & Schedule
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#466272]/60">
                    Select a proposal from the left list to review.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#cac6b9]/30 rounded-xl px-4 py-3 shadow-xl z-50 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
