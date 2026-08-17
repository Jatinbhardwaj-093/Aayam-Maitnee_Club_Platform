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
  Check,
  DollarSign,
  Building,
  Tag,
  ExternalLink,
  Award,
  BadgeAlert,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Wand2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Default Fallback Data to prevent any blank page rendering
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "Musimprov (with Akord) - Musical Improv Session",
    category: "Meetups",
    date: "Jul 25, 2026",
    venue: "Main Auditorium - Royal Stage",
    description: "Interactive musical improvisation session blending rhythm, dialogue, and spontaneous theatrical scoring.",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Sahitya Sabha - Chit-Chat & Jamming Session",
    category: "Meetups",
    date: "Jul 28, 2026",
    venue: "Rehearsal Hall B",
    description: "Casual literature gathering, script reading circle, and creative dialogue jamming for members.",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Theatre Masterclass with Gyaneshwar Mishra",
    category: "Masterclass",
    date: "Aug 02, 2026",
    venue: "Aayam Stage 2",
    description: "In-depth masterclass focusing on vocal projection, body language, and dramatic characterization.",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Darpan 2026 Annual Drama Festival",
    category: "Plays",
    date: "Aug 15, 2026",
    venue: "Royal Stage Auditorium",
    description: "Annual multi-play dramatic showcase featuring full-ensemble stage productions.",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1507676184212-d0330a151f15?q=80&w=600&auto=format&fit=crop"
  }
];

const DEFAULT_SPONSOR_ADS = [
  {
    id: 1,
    sponsor_name: "Red Bull India",
    contact_person: "Rohan Sharma (Brand Manager)",
    contact_email: "rohan.sharma@redbull.co.in",
    contact_phone: "+91 98110 44321",
    ad_title: "Energy Lounge & Main Stage Playbill Cover",
    ad_category: "Playbill Banner",
    target_event_name: "Tamashbin Kathputliya Courtyard Staging",
    budget_offered: "₹1,50,000",
    ad_description: "Official Exclusive Energy Drink & Refreshment Partner for Aayam Cultural Season 2026. Deliverables include a dedicated Red Bull Green Room Lounge for cast and crew, prominent front-cover logo placement on 5,000 physical playbills across all mainstage drama shows, pop-up sampling counters during intermission breaks, and 200 complimentary VIP audience passes with branded coupon vouchers.",
    status: "Pending",
    submitted_at: "Jul 21, 2026 • 01:15 PM"
  },
  {
    id: 2,
    sponsor_name: "FabIndia Ethnic Craft",
    contact_person: "Ananya Deshmukh (Sponsorship Head)",
    contact_email: "sponsorships@fabindia.com",
    contact_phone: "+91 98201 88765",
    ad_title: "Traditional Costume & Folk Aesthetic Partner",
    ad_category: "Stage Sidecar",
    target_event_name: "Karn Ki Yachika Verse Play",
    budget_offered: "₹85,000",
    ad_description: "Title Wardrobe Craft & Folk Aesthetic Partner for historical verse plays including 'Karn Ki Yachika' and 'Tamashbin Kathputliya'. FabIndia provides handcrafted silk shawls, authentic handloom drapes, and traditional stage props valued at ₹85,000. Deliverables include dual side-stage banner displays, full-page catalog insertion in physical playbills, and exclusive pre-show foyer exhibition counter.",
    status: "Approved",
    submitted_at: "Jul 20, 2026 • 11:30 AM"
  },
  {
    id: 3,
    sponsor_name: "Zebronics Sound Systems",
    contact_person: "Vikram Rao (Marketing Director)",
    contact_email: "events@zebronics.com",
    contact_phone: "+91 97400 33211",
    ad_title: "Pro Acoustic & Wireless Mic Gear Sponsorship",
    ad_category: "Digital Screen",
    target_event_name: "Annual Aayam Theatre Festival 2026",
    budget_offered: "₹1,20,000",
    ad_description: "Audio Technology & Acoustic Hardware Sponsorship for the Annual Aayam Theatre Festival 2026. Zebronics supplies 12 high-definition wireless lapel microphonic systems, stage monitor speakers, and digital soundboard equipment. Deliverables include digital banner loops displayed across auditorium lobby screens 30 minutes before showtime and brand attribution in all press releases.",
    status: "Pending",
    submitted_at: "Jul 19, 2026 • 04:45 PM"
  }
];

const DEFAULT_PROPOSALS = [
  {
    id: 101,
    name: "Acoustic Folk Jam & Poetry Slam",
    submitter: { name: "Sneha Das", initials: "SD", email: "sneha.das@aayam.org", phone: "+91 98301 77654" },
    contact_email: "sneha.das@aayam.org",
    contact_phone: "+91 98301 77654",
    date: "Jul 29, 2026",
    venue: "Aayam Art Foyer & Courtyard",
    sourceType: "Member",
    proposalType: "Member Pitch",
    sponsorshipDeal: "Club Member Pitch",
    budget: "₹25,000",
    status: "Reviewing",
    description: "An intimate open-mic evening for ensemble members and acoustic artists to perform live poetry, folk music, and experimental verse drama in the courtyard lounge."
  },
  {
    id: 102,
    name: "Physical Movement & Mime Masterclass",
    submitter: { name: "Samarth Shrivastava", initials: "SS", email: "samarth.s@aayam.org", phone: "+91 98712 33445" },
    contact_email: "samarth.s@aayam.org",
    contact_phone: "+91 98712 33445",
    date: "Aug 05, 2026",
    venue: "Rehearsal Hall B - Studio 2",
    sourceType: "Member",
    proposalType: "Member Pitch",
    sponsorshipDeal: "Club Member Pitch",
    budget: "₹35,000",
    status: "Reviewing",
    description: "Intensive 3-hour movement workshop focusing on body language, character silhouette, and non-verbal physical theatre techniques led by senior choreographers."
  },
  {
    id: 103,
    name: "Red Bull Energy Stage & Playbill Showcase",
    submitter: { name: "Rohan Sharma (Red Bull India)", initials: "RS", email: "rohan.sharma@redbull.co.in", phone: "+91 98110 44321" },
    contact_email: "rohan.sharma@redbull.co.in",
    contact_phone: "+91 98110 44321",
    date: "Aug 15, 2026",
    venue: "Main Stage Auditorium",
    sourceType: "Sponsor",
    proposalType: "Sponsor Ad Proposal",
    sponsorshipDeal: "₹1,50,000 Corporate Sponsorship",
    budget: "₹1,50,000",
    status: "Reviewing",
    description: "Red Bull India sponsorship proposal featuring custom stage sidecar banners, energy lounges for crew, and branded playbills for the annual drama festival."
  }
];

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
  }
];

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past" | "Proposals" | "Sponsor Ads">("Upcoming");
  const [proposalSourceFilter, setProposalSourceFilter] = useState<"All" | "Sponsor" | "Member">("All");

  // Creation Studio View Toggle
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Database Events & Proposals State
  const [dbEvents, setDbEvents] = useState<any[]>(DEFAULT_EVENTS);
  const [proposals, setProposals] = useState<any[]>(DEFAULT_PROPOSALS);
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(101);

  // Database Sponsor Ads Requests State
  const [sponsorAds, setSponsorAds] = useState<any[]>(DEFAULT_SPONSOR_ADS);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Keyword Extractor State
  const [extractedKeywords, setExtractedKeywords] = useState<Record<string, string[]>>({});
  const [isExtractingId, setIsExtractingId] = useState<string | number | null>(null);

  const handleToggleAIKeywords = async (keyId: string | number, desc: string) => {
    const key = String(keyId);
    if (extractedKeywords[key]) {
      setExtractedKeywords((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }

    setIsExtractingId(keyId);
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    try {
      const res = await fetch(`${baseUrl}/api/events/extract-keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc })
      });
      const data = await res.json();
      if (res.ok && data.status === "success" && Array.isArray(data.keywords)) {
        setExtractedKeywords((prev) => ({ ...prev, [key]: data.keywords }));
        triggerToast("Keywords extracted via Gemini AI");
      } else {
        triggerToast(data.message || "AI servers are down. Please try again later.");
      }
    } catch (err) {
      console.error("Backend AI keyword extraction error:", err);
      triggerToast("AI servers are down. Please try again later.");
    } finally {
      setIsExtractingId(null);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchTerm(keyword);
    triggerToast(`Filtering event requests by keyword: "${keyword}"`);
  };

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
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbEvents(data);
        }
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  const loadSponsorAdsFromBackend = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/sponsor-ads`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSponsorAds(data);
        }
      })
      .catch((err) => console.error("Error fetching sponsor ads:", err));
  };

  useEffect(() => {
    loadEventsFromBackend();
    loadSponsorAdsFromBackend();

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/proposals`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProposals(data);
          setSelectedProposalId(data[0].id);
        }
      })
      .catch((err) => console.error("Error fetching proposals:", err));
  }, []);

  // Sponsor Ad Action Handlers
  const handleUpdateSponsorAdStatus = (adId: number, status: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/sponsor-ads/${adId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setSponsorAds((prev) =>
            prev.map((ad) => (ad.id === adId ? { ...ad, status } : ad))
          );
          triggerToast(`Sponsor Ad request marked as ${status}!`);
        }
      })
      .catch((err) => console.error("Error updating sponsor status:", err));
  };

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

  // Submit Create Event Form
  const handlePublishEventSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newEventForm.title) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    const payload = {
      name: newEventForm.title,
      description: newEventForm.description,
      category: newEventForm.category,
      venue: newEventForm.venue,
      date: newEventForm.date
    };

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

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
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

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
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
    const filtered = dbEvents.filter((e) => !e.status || e.status.toLowerCase() === "upcoming");
    return filtered.length > 0 ? filtered : dbEvents;
  }, [dbEvents]);

  const pastEvents = useMemo(() => {
    return dbEvents.filter(
      (e) => e.status && (e.status.toLowerCase() === "concluded" || e.status.toLowerCase() === "past")
    );
  }, [dbEvents]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const propName = p.name || p.title || "";
      const submitterName = (p.submitter && p.submitter.name) ? p.submitter.name : "";
      const desc = p.description || "";
      const matchesSearch =
        propName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesSource =
        proposalSourceFilter === "All" || p.sourceType === proposalSourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [proposals, searchTerm, statusFilter, proposalSourceFilter]);

  const filteredSponsorAds = useMemo(() => {
    return sponsorAds.filter((ad) => {
      const title = ad.ad_title || ad.sponsor_name || "";
      const target = ad.target_event_name || "";
      const desc = ad.ad_description || "";
      const contact = ad.contact_email || ad.contact_person || "";
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sponsorAds, searchTerm]);

  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  /* ====================================================================
     FULL PAGE EVENT CREATION STUDIO VIEW
     ==================================================================== */
  if (isCreatingEvent) {
    return (
      <div className="flex-1 bg-[#E7DDD3] text-[#232323] font-sans pb-16 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD8CE]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreatingEvent(false)}
                className="p-2 rounded-xl border border-[#D5C9BE]/60 bg-white text-[#666361] hover:bg-[#EFE8E1] transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#353535] leading-tight">
                  Create Production Event
                </h1>
                <p className="text-xs text-[#666361]">Configure event details and publish to roster.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => triggerToast("Draft saved locally.")}
                className="px-4 py-2 rounded-xl border border-[#D5C9BE] bg-white text-[#666361] hover:bg-[#EFE8E1] text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button
                type="button"
                onClick={() => handlePublishEventSubmit()}
                className="px-5 py-2 rounded-xl bg-[#353535] text-white hover:bg-[#353535]/90 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Publish Event
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#DDD8CE] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-[#353535] uppercase tracking-wider">
                    Select Event Template
                  </span>
                  <span className="text-[10px] text-[#666361]/70 font-semibold">3 Options</span>
                </div>

                <div className="space-y-2">
                  {EVENT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedTemplateId === tmpl.id
                          ? "border-[#353535] bg-[#353535]/10 font-bold"
                          : "border-gray-200 bg-white hover:border-[#D5C9BE] hover:bg-[#E7DDD3]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#232323] truncate">{tmpl.name}</div>
                        <div className="text-[10px] text-[#666361]/70 truncate">{tmpl.category}</div>
                      </div>
                      {selectedTemplateId === tmpl.id && (
                        <span className="w-2 h-2 rounded-full bg-[#353535]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 shadow-xs space-y-5">
                <h3 className="font-serif font-bold text-lg text-[#353535] border-b border-gray-100 pb-3">
                  Event Details Configuration
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-[#666361] block mb-1">Event Title</label>
                    <Input
                      value={newEventForm.title}
                      onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                      placeholder="e.g. Macbeth - Gala Opening Night"
                      className="bg-[#E7DDD3] border-[#D5C9BE]/60 h-10 text-xs rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#666361] block mb-1">Date</label>
                      <Input
                        type="date"
                        value={newEventForm.date}
                        onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                        className="bg-[#E7DDD3] border-[#D5C9BE]/60 h-10 text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#666361] block mb-1">Venue</label>
                      <Input
                        value={newEventForm.venue}
                        onChange={(e) => setNewEventForm({ ...newEventForm, venue: e.target.value })}
                        placeholder="Main Auditorium"
                        className="bg-[#E7DDD3] border-[#D5C9BE]/60 h-10 text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#666361] block mb-1">Event Description</label>
                    <textarea
                      value={newEventForm.description}
                      onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                      rows={4}
                      className="w-full bg-[#E7DDD3] border border-[#D5C9BE]/60 p-3 rounded-xl text-xs text-[#232323] focus:outline-none"
                      placeholder="Provide event details..."
                    />
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
     DEFAULT DASHBOARD VIEW (UPCOMING / PAST / PROPOSALS / SPONSOR ADS)
     ==================================================================== */
  return (
    <div className="flex-1 bg-[#E7DDD3] text-[#232323] font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DDD8CE]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#353535]/10 text-[#353535] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#353535]" /> Maintainer Operations
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#353535] tracking-tight">
              Events & Sponsor Portal
            </h1>
            <p className="text-xs md:text-sm text-[#666361] mt-1 max-w-2xl">
              Manage club productions, review member pitches, and curate corporate sponsor ad requests in the database.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => {
                handleSelectTemplate("template-play");
                setIsCreatingEvent(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#353535] text-white hover:bg-[#353535]/90 text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>

        {/* Maintainer Executive Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666361]">Upcoming Events</span>
              <div className="text-2xl font-serif font-bold text-[#353535] mt-0.5">{upcomingEvents.length}</div>
            </div>
          </div>

          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666361]">Pending Proposals</span>
              <div className="text-2xl font-serif font-bold text-amber-700 mt-0.5">
                {proposals.filter((p) => p.status === "Reviewing").length}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666361]">Sponsor Ads in DB</span>
              <div className="text-2xl font-serif font-bold text-[#1e4463] mt-0.5">
                {sponsorAds.length} Requests
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666361]">Past Productions</span>
              <div className="text-2xl font-serif font-bold text-[#353535] mt-0.5">{pastEvents.length}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#DDD8CE]">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("Upcoming")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === "Upcoming"
                  ? "text-[#353535]"
                  : "text-[#666361]/60 hover:text-[#353535]"
              }`}
            >
              Upcoming Events ({upcomingEvents.length})
              {activeTab === "Upcoming" && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#353535] rounded-t-md" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("Sponsor Ads")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                activeTab === "Sponsor Ads"
                  ? "text-[#353535]"
                  : "text-[#666361]/60 hover:text-[#353535]"
              }`}
            >
              Sponsor Ads Requests
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
                {sponsorAds.filter((a) => a.status === "Pending").length} Pending
              </span>
              {activeTab === "Sponsor Ads" && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#353535] rounded-t-md" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("Proposals")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                activeTab === "Proposals"
                  ? "text-[#353535]"
                  : "text-[#666361]/60 hover:text-[#353535]"
              }`}
            >
              Event Proposals & Pitches
              {activeTab === "Proposals" && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#353535] rounded-t-md" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("Past")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === "Past"
                  ? "text-[#353535]"
                  : "text-[#666361]/60 hover:text-[#353535]"
              }`}
            >
              Past Events ({pastEvents.length})
              {activeTab === "Past" && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#353535] rounded-t-md" />
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: UPCOMING EVENTS */}
        {activeTab === "Upcoming" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white border border-[#DDD8CE] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-40 relative">
                  <img
                    src={evt.image || "https://images.unsplash.com/photo-1507676184212-d0330a151f15?q=80&w=600&auto=format&fit=crop"}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 text-[#353535] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-[#D5C9BE]">
                    {evt.category || "Mainstage"}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-lg text-[#232323]">{evt.title}</h3>
                    <p className="text-xs text-[#666361]/80 line-clamp-2">{evt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#DDD8CE]/70 text-xs text-[#666361] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#353535]" /> {evt.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#353535]" /> {evt.venue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: SPONSOR ADS REQUESTS (DATABASE BACKED) */}
        {activeTab === "Sponsor Ads" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#DDD8CE] p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-serif font-bold text-xl text-[#232323] flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#353535]" /> Corporate Sponsor Ad Requests
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Filter sponsor requests by keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#D5C9BE]/60 bg-[#E7DDD3] text-xs text-[#232323] focus:outline-none focus:border-[#353535] w-64"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#666361] text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {searchTerm && (
                <div className="flex items-center gap-2 text-xs text-[#353535]">
                  <span>Active Keyword Filter:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#353535] text-white font-bold text-[11px] flex items-center gap-1">
                    {searchTerm}
                    <button onClick={() => setSearchTerm("")} className="hover:text-amber-200 ml-1">×</button>
                  </span>
                </div>
              )}
            </div>

            {filteredSponsorAds.length === 0 ? (
              <div className="bg-white border border-[#DDD8CE] p-8 rounded-2xl text-center text-xs text-[#666361]/70 italic">
                No sponsor requests match your keyword filter "{searchTerm}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSponsorAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-white border border-[#DDD8CE] hover:border-[#353535] rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#353535]/10 text-[#353535] border border-[#353535]/20">
                          {ad.ad_category}
                        </span>

                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ad.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : ad.status === "Rejected"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          {ad.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#232323] leading-snug">{ad.ad_title}</h3>
                        <p className="text-xs text-[#353535] font-semibold flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5" /> {ad.sponsor_name}
                        </p>
                      </div>

                      <div className="p-3.5 bg-[#E7DDD3] rounded-xl border border-[#DDD8CE] space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[#666361]">
                          <span>Contact: <strong>{ad.contact_person}</strong></span>
                          <span className="text-emerald-700 font-bold">{ad.budget_offered}</span>
                        </div>
                        <div className="text-[#666361] truncate">
                          Email: <a href={`mailto:${ad.contact_email}`} className="underline text-[#353535]">{ad.contact_email}</a>
                        </div>
                        {ad.contact_phone && (
                          <div className="text-[#666361]">
                            Phone: <strong>{ad.contact_phone}</strong>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-[#DDD8CE] text-[11px] text-[#232323]">
                          Target Event: <strong>{ad.target_event_name}</strong>
                        </div>
                      </div>

                      {ad.ad_description && (
                        <div className="space-y-2.5">
                          <p className="text-xs text-[#666361]/90 leading-relaxed italic bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            "{ad.ad_description}"
                          </p>

                          {/* AI Keyword Extraction Button */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">
                              AI Key Signals
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleAIKeywords(`sponsor_${ad.id}`, ad.ad_description)}
                              className="px-3 py-1 rounded-lg bg-[#E7DDD3] hover:bg-[#DDD8CE] text-[#353535] text-[11px] font-bold transition-all border border-[#D5C9BE]/60"
                            >
                              {extractedKeywords[`sponsor_${ad.id}`] ? "Hide Keywords" : "Extract & Filter Keywords"}
                            </button>
                          </div>

                          {/* Extracted AI Keyword Badges Panel */}
                          {extractedKeywords[`sponsor_${ad.id}`] && (
                            <div className="p-3 bg-[#E7DDD3] rounded-xl border border-[#D5C9BE]/60 space-y-2">
                              <div className="text-[10px] text-[#353535] font-semibold">Click keyword to filter requests:</div>
                              <div className="flex flex-wrap gap-1.5">
                                {extractedKeywords[`sponsor_${ad.id}`].map((kw, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleKeywordClick(kw)}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-[#353535] hover:text-white text-[#232323] border border-[#D5C9BE]/50 shadow-2xs transition-all cursor-pointer"
                                  >
                                    {kw}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#DDD8CE] flex items-center justify-between gap-3 text-xs font-bold">
                      <span className="text-[10px] text-gray-400 font-normal">{ad.submitted_at}</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateSponsorAdStatus(ad.id, "Rejected")}
                          disabled={ad.status === "Rejected"}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs transition-all disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdateSponsorAdStatus(ad.id, "Approved")}
                          disabled={ad.status === "Approved"}
                          className="px-3 py-1.5 rounded-lg bg-[#353535] text-white hover:bg-[#4d4a32] text-xs transition-all disabled:opacity-50"
                        >
                          Approve Ad
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EVENT PROPOSALS & PITCHES */}
        {activeTab === "Proposals" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#DDD8CE] p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-serif font-bold text-xl text-[#232323] flex items-center gap-2">
                  Event Proposals & Member Pitches
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Filter proposals by keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#D5C9BE]/60 bg-[#E7DDD3] text-xs text-[#232323] focus:outline-none focus:border-[#353535] w-64"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#666361] text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {searchTerm && (
                <div className="flex items-center gap-2 text-xs text-[#353535]">
                  <span>Active Keyword Filter:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#353535] text-white font-bold text-[11px] flex items-center gap-1">
                    {searchTerm}
                    <button onClick={() => setSearchTerm("")} className="hover:text-amber-200 ml-1">×</button>
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-[#DDD8CE] rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-[#DDD8CE] bg-[#E7DDD3] flex justify-between items-center">
                  <h3 className="font-serif font-bold text-base text-[#353535]">
                    Submitted Proposals ({filteredProposals.length})
                  </h3>
                </div>

                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {filteredProposals.map((prop) => (
                    <div
                      key={prop.id}
                      onClick={() => setSelectedProposalId(prop.id)}
                      className={`p-4 hover:bg-[#E7DDD3]/60 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        selectedProposalId === prop.id
                          ? "bg-[#E7DDD3] border-l-4 border-[#E85F57]"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#353535]/10 text-[#353535]">
                              {prop.proposalType || prop.sourceType || "Proposal"}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                              {prop.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold">{prop.budget || prop.sponsorshipDeal || "₹50,000"}</span>
                        </div>
                        <h4 className="font-bold text-sm text-[#232323] truncate">{prop.name}</h4>
                        <div className="text-[11px] text-[#666361] flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                          <span>By <strong>{prop.submitter?.name || prop.submitter_name || "Ensemble Member"}</strong></span>
                          <span>•</span>
                          <span>{prop.contact_email || prop.submitter?.email}</span>
                          {prop.contact_phone && (
                            <>
                              <span>•</span>
                              <span>{prop.contact_phone}</span>
                            </>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate mt-0.5">
                          Stage: <strong>{prop.venue}</strong>
                        </div>
                        {prop.description && (
                          <p className="text-[11px] text-[#666361]/85 line-clamp-2 italic mt-1 bg-gray-50/70 p-2 rounded-lg border border-gray-100">
                            "{prop.description}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-[#DDD8CE] rounded-2xl shadow-xs p-6 flex flex-col justify-between space-y-6">
                {currentProposal && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#353535]/10 text-[#353535]">
                        {currentProposal.proposalType || currentProposal.sourceType || "Proposal Pitch"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        {currentProposal.status || "Reviewing"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#232323] leading-snug">{currentProposal.name}</h3>

                    <div className="p-3.5 bg-[#E7DDD3] rounded-xl border border-[#DDD8CE] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[#666361]">
                        <span>Submitter: <strong>{currentProposal.submitter?.name || "Ensemble Member"}</strong></span>
                        <span className="text-emerald-700 font-bold">{currentProposal.budget || currentProposal.sponsorshipDeal || "₹50,000"}</span>
                      </div>
                      <div className="text-[#666361] truncate">
                        Email: <a href={`mailto:${currentProposal.contact_email || currentProposal.submitter?.email}`} className="underline text-[#353535]">{currentProposal.contact_email || currentProposal.submitter?.email || "partner@aayam.org"}</a>
                      </div>
                      {currentProposal.contact_phone && (
                        <div className="text-[#666361]">
                          Phone: <strong>{currentProposal.contact_phone}</strong>
                        </div>
                      )}
                      <div className="pt-1.5 border-t border-[#DDD8CE] text-[11px] text-[#232323]">
                        Target Stage / Venue: <strong>{currentProposal.venue}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#353535] block">Proposal Description & Objectives</span>
                      <p className="text-xs text-[#666361] bg-gray-50 p-3.5 rounded-xl border border-gray-100 leading-relaxed italic">
                        "{currentProposal.description || "No description provided."}"
                      </p>

                      {/* AI Keyword Extraction Button */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">
                          AI Key Signals
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleAIKeywords(`prop_${currentProposal.id}`, currentProposal.description)}
                          className="px-3 py-1 rounded-lg bg-[#E7DDD3] hover:bg-[#DDD8CE] text-[#353535] text-[11px] font-bold transition-all border border-[#D5C9BE]/60"
                        >
                          {extractedKeywords[`prop_${currentProposal.id}`] ? "Hide Keywords" : "Extract & Filter Keywords"}
                        </button>
                      </div>

                      {/* Extracted AI Keyword Badges Panel */}
                      {extractedKeywords[`prop_${currentProposal.id}`] && (
                        <div className="p-3 bg-[#E7DDD3] rounded-xl border border-[#D5C9BE]/60 space-y-2">
                          <div className="text-[10px] text-[#353535] font-semibold">Click keyword to filter requests:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {extractedKeywords[`prop_${currentProposal.id}`].map((kw, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleKeywordClick(kw)}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-[#353535] hover:text-white text-[#232323] border border-[#D5C9BE]/50 shadow-2xs transition-all cursor-pointer"
                              >
                                {kw}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleRejectProposal(currentProposal.id)}
                        className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2.5 rounded-xl transition-all"
                      >
                        Reject Proposal
                      </button>
                      <button
                        onClick={() => handleApproveProposal(currentProposal.id)}
                        className="flex-1 bg-[#353535] text-white hover:bg-[#4d4a32] text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
                      >
                        Approve & Schedule Event
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAST EVENTS */}
        {activeTab === "Past" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((evt) => (
              <div key={evt.id} className="bg-white border border-[#DDD8CE] rounded-2xl p-5 shadow-2xs space-y-2 opacity-80">
                <h3 className="font-serif font-bold text-base text-[#232323]">{evt.title}</h3>
                <p className="text-xs text-[#666361]">{evt.date} • {evt.venue}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#D5C9BE]/30 rounded-xl px-4 py-3 shadow-xl z-50 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
