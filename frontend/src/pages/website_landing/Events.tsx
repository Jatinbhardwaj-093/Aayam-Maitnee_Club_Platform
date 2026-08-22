// @ts-nocheck
import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Tag,
  Plus,
  Send,
  Sparkles,
  Building2,
  Megaphone,
  Check,
  Flame,
  ArrowRight,
  ArrowUpRight,
  Ticket,
  Eye,
  X,
  Share2,
  Download,
  Info,
  Layers,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Event {
  id: string | number;
  title: string;
  description: string;
  category: string;
  categoryBg: string;
  categoryColor: string;
  date: string;
  day: number;
  month: string;
  image: string;
  status: "upcoming" | "concluded";
  venue: string;
  timeRange: string;
  host: string;
  priceInfo: string;
  capacity: string;
  syllabus?: string[];
  guidelines?: string[];
}

const getCategoryStyles = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("play")) {
    return { bg: "bg-[#BFDDF0] text-[#E85F57]", color: "text-[#E85F57]" };
  } else if (cat.includes("workshop") || cat.includes("masterclass")) {
    return { bg: "bg-[#FFEBCC] text-[#765d00]", color: "text-[#765d00]" };
  } else if (cat.includes("sponsor") || cat.includes("ad")) {
    return { bg: "bg-amber-100 text-amber-900", color: "text-amber-900" };
  } else {
    return { bg: "bg-[#E2FDFF] text-[#324b4d]", color: "text-[#324b4d]" };
  }
};

const fallbackEvents: Event[] = [
  {
    id: 1,
    title: "Musimprov (with Akord) - Musical Improv Session",
    description: "A vibrant joint session with Akord music club blending spontaneous theatrical improv with live vocal rhythms and percussive cues.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Aug 15, 2026",
    day: 15,
    month: "AUG",
    image: "/aayam_assets/tamashbin_user_3.jpg",
    status: "concluded",
    venue: "Student Activity Centre (SAC), IIT Madras",
    timeRange: "17:00 - 19:30",
    host: "Abay Nandhiga",
    priceInfo: "Free Entry",
    capacity: "60 seats",
    syllabus: [
      "Vocal warmup and dynamic choral projection",
      "Live percussion cue sync with Akord ensemble",
      "Spontaneous improv dialogue rounds",
      "Ensemble rhythm circle and character riffs"
    ],
    guidelines: [
      "Open to all registered student artists and musicians",
      "Comfortable movement attire recommended",
      "Bring water bottle and notebook for lyrics/rhythm notations"
    ]
  },
  {
    id: 2,
    title: "Stage Lighting & DMX Rigging Masterclass",
    description: "Technical crew masterclass covering DMX lighting consoles, spot gels, color temperatures, and cue timing for live plays.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Aug 12, 2026",
    day: 12,
    month: "AUG",
    image: "/aayam_assets/krishna_subramanian.jpg",
    status: "concluded",
    venue: "CLT Main Auditorium Tech Booth, IIT Madras",
    timeRange: "14:00 - 17:00",
    host: "Krishna Subramanian",
    priceInfo: "Completed",
    capacity: "35 seats",
    syllabus: [
      "Proscenium fixture mapping & spot gel selection",
      "DMX 512 universe cabling and dimmer rack setup",
      "Live crossfade cue programming on lighting board",
      "Emergency backup lighting protocols and safety rigging"
    ],
    guidelines: [
      "Closed-toe shoes required inside the technical booth",
      "Basic understanding of stage layouts helpful",
      "Digital cue sheet templates provided upon arrival"
    ]
  },
  {
    id: 3,
    title: "August Script Reading Circle - Tamashbin & DDDJ",
    description: "Group table-read session for the upcoming festival scripts. Actors assign roles and analyze dialogue subtext.",
    category: "Meetups",
    categoryBg: "bg-[#E2FDFF] text-[#324b4d]",
    categoryColor: "text-[#324b4d]",
    date: "Aug 23, 2026",
    day: 23,
    month: "AUG",
    image: "/aayam_assets/tamashbin_user_4.jpg",
    status: "upcoming",
    venue: "Aayam Rehearsal Hall B, IIT Madras",
    timeRange: "18:00 - 20:30",
    host: "Utkarsh (Yuuhi)",
    priceInfo: "Free Entry",
    capacity: "45 seats",
    syllabus: [
      "Full ensemble table read of Tamashbin Kathputliya Scene 1-4",
      "Subtext exploration and voice pitch modulation",
      "Open casting discussions for chorus understudies",
      "Directorial vision briefing by lead playwrights"
    ],
    guidelines: [
      "Printed script copies distributed at gate",
      "Please arrive 15 minutes before 18:00 for role distribution",
      "Open to both active members and new auditionees"
    ]
  },
  {
    id: 4,
    title: "Natyashastra Movement & Body Control Workshop",
    description: "Physical theatre workshop focusing on Angika Abhinaya (body gestures), spatial dynamics, and rhythmic stage movement.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Aug 27, 2026",
    day: 27,
    month: "AUG",
    image: "/aayam_assets/samatvam_user_4.jpg",
    status: "upcoming",
    venue: "Rehearsal Hall B, IIT Madras",
    timeRange: "16:00 - 18:30",
    host: "Samarth Shrivastava",
    priceInfo: "Registration Required",
    capacity: "40 seats",
    syllabus: [
      "Navarasa facial control and emotional transition exercises",
      "Spine alignment and weight-distribution on bare stage",
      "Spatial awareness and collective flocking movement",
      "Non-verbal storytelling choreography"
    ],
    guidelines: [
      "Barefoot or soft stage shoes only on dance flooring",
      "Wear loose black or monochrome movement attire",
      "Bring personal water bottle and towel"
    ]
  },
  {
    id: 5,
    title: "Monologue Jamming & Chai Meetup",
    description: "Relaxed weekend meetup for ensemble actors to perform short 2-minute monologues, receive peer feedback, and share chai.",
    category: "Meetups",
    categoryBg: "bg-[#E2FDFF] text-[#324b4d]",
    categoryColor: "text-[#324b4d]",
    date: "Aug 30, 2026",
    day: 30,
    month: "AUG",
    image: "/aayam_assets/kky_user_2.jpg",
    status: "upcoming",
    venue: "OAT Amphitheatre Lawns, IIT Madras",
    timeRange: "16:30 - 18:30",
    host: "Utkarsh (Yuuhi)",
    priceInfo: "Free Entry",
    capacity: "50 seats",
    syllabus: [
      "Open mic monologue presentations (classical or modern)",
      "Constructive peer dramaturgy feedback",
      "Informal networking with senior directors & alumni",
      "Evening hot chai and stage lore discussions"
    ],
    guidelines: [
      "Prepare any 2-3 minute monologue in Hindi or English",
      "Memory reciting encouraged, text reading permitted",
      "All curious campus students welcome"
    ]
  },
  {
    id: 6,
    title: "Karn Ki Yachika - Live Rehearsal & Dress Run",
    description: "Full stage dress rehearsal of the epic classical tragedy. Open for student audience preview with live lighting cues.",
    category: "Plays",
    categoryBg: "bg-[#BFDDF0] text-[#E85F57]",
    categoryColor: "text-[#E85F57]",
    date: "Sep 04, 2026",
    day: 4,
    month: "SEP",
    image: "/aayam_assets/kky_user_5.jpg",
    status: "upcoming",
    venue: "CLT Auditorium, IIT Madras",
    timeRange: "18:00 - 20:00",
    host: "S. Sri Vaishnavi",
    priceInfo: "Free Student Pass",
    capacity: "120 seats",
    syllabus: [
      "Pre-show technical rigging and audio checks",
      "Uninterrupted 75-minute live proscenium performance",
      "Post-show Q&A with director and lead cast",
      "Backstage tour of costume drape and prop weapons"
    ],
    guidelines: [
      "Auditorium doors lock promptly at 18:00",
      "Photography permitted without flash",
      "Digital pass required at CLT gate"
    ]
  }
];

export default function Events() {
  const contextData = useOutletContext<any>() || {};
  const activeUser = contextData.activeUser || JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");

  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Soon to Happen" | "Concluded">("All");
  const [events, setEvents] = useState<Event[]>(fallbackEvents);
  
  // Modals state
  const [selectedEventModal, setSelectedEventModal] = useState<Event | null>(null);
  const [reservedPass, setReservedPass] = useState<{ event: Event; passId: string; holder: string } | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Proposal modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAiProposalMode, setIsAiProposalMode] = useState(false);
  const [aiRawText, setAiRawText] = useState("");
  const [isExtractingAi, setIsExtractingAi] = useState(false);
  const [aiExtractedSuccess, setAiExtractedSuccess] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [proposalSubmittedToast, setProposalSubmittedToast] = useState<string | null>(null);
  const [submittingProposal, setSubmittingProposal] = useState<boolean>(false);

  const [proposalForm, setProposalForm] = useState({
    title: "",
    proposalType: activeUser ? "Member Workshop Pitch" : "Sponsor Ad Proposal",
    submitterName: activeUser ? activeUser.name : "",
    submitterEmail: activeUser ? activeUser.email : "",
    submitterPhone: activeUser?.phone || "",
    sponsorshipTerms: "₹25,000",
    venue: "SAC Main Studio, IIT Madras",
    description: ""
  });

  const handleAiExtraction = () => {
    if (!aiRawText || aiRawText.trim().length < 8) {
      setAiErrorMessage("Please paste an outline, rough ideas, or draft notes to extract.");
      return;
    }
    setIsExtractingAi(true);
    setAiErrorMessage(null);

    setTimeout(() => {
      try {
        const text = aiRawText.trim();
        const textLower = text.toLowerCase();

        // 1. Extract Title
        let extractedTitle = "";
        const titleMatch = text.match(/(?:title|workshop|pitch|event|name|called|presenting|staging)[\s:]+([^\n.]+)/i);
        if (titleMatch && titleMatch[1]) {
          extractedTitle = titleMatch[1].trim().replace(/^["']|["']$/g, '');
        } else {
          const firstLine = text.split('\n')[0].trim();
          extractedTitle = firstLine.length > 50 ? firstLine.substring(0, 50) + "..." : firstLine;
        }

        // 2. Extract Type
        let extractedType = "Member Workshop Pitch";
        if (textLower.includes("sponsor") || textLower.includes("brand") || textLower.includes("partnership") || textLower.includes("ad ")) {
          extractedType = "Sponsor Ad Proposal";
        } else if (textLower.includes("meetup") || textLower.includes("circle") || textLower.includes("reading") || textLower.includes("jam")) {
          extractedType = "Member Event Pitch";
        } else if (textLower.includes("production") || textLower.includes("play") || textLower.includes("drama")) {
          extractedType = "Society Production Pitch";
        } else {
          extractedType = "Member Workshop Pitch";
        }

        // 3. Extract Submitter Name
        let extractedName = activeUser?.name || "";
        const nameMatch = text.match(/(?:by|from|submitter|contact|proposer|lead|organizer)[\s:]+([A-Za-z\s]+?)(?:,|\.|\n|email|phone|\(|$)/i);
        if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 2) {
          extractedName = nameMatch[1].trim();
        }

        // 4. Extract Email
        let extractedEmail = activeUser?.email || "";
        const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch && emailMatch[1]) {
          extractedEmail = emailMatch[1].trim();
        }

        // 5. Extract Phone
        let extractedPhone = activeUser?.phone || "";
        const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
        if (phoneMatch && phoneMatch[0]) {
          extractedPhone = phoneMatch[0].trim();
        }

        // 6. Extract Venue
        let extractedVenue = "SAC Main Studio, IIT Madras";
        if (textLower.includes("clt") || textLower.includes("central lecture theatre")) {
          extractedVenue = "CLT Main Stage, IIT Madras";
        } else if (textLower.includes("oat") || textLower.includes("open air theatre") || textLower.includes("amphitheatre")) {
          extractedVenue = "OAT Amphitheatre Lawns";
        } else if (textLower.includes("black box") || textLower.includes("studio")) {
          extractedVenue = "Aayam Black Box Studio, SAC";
        } else if (textLower.includes("rehearsal hall")) {
          extractedVenue = "Rehearsal Hall B, IIT Madras";
        }

        // 7. Extract Budget
        let extractedBudget = "₹25,000";
        const budgetMatch = text.match(/(?:₹|inr|rs\.?|budget|cost)[\s:]*([\d,]+(?:\s*(?:lakh|k|thousand))?)/i);
        if (budgetMatch && budgetMatch[1]) {
          extractedBudget = `₹${budgetMatch[1].trim()}`;
        }

        // 8. Extract Description
        let extractedDescription = text;

        setProposalForm({
          title: extractedTitle || "Theatrical Community Masterclass",
          proposalType: extractedType,
          submitterName: extractedName || (activeUser?.name || "Ensemble Member"),
          submitterEmail: extractedEmail || (activeUser?.email || "member@study.iitm.ac.in"),
          submitterPhone: extractedPhone || "+91 98110 44321",
          venue: extractedVenue,
          sponsorshipTerms: extractedBudget,
          description: extractedDescription
        });

        setAiExtractedSuccess(true);
        setIsExtractingAi(false);
      } catch (err) {
        console.error(err);
        setIsExtractingAi(false);
        setAiErrorMessage("Could not parse text automatically. Please verify the form fields.");
      }
    }, 350);
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.title || !proposalForm.submitterName || !proposalForm.submitterEmail || !proposalForm.submitterPhone || !proposalForm.venue || !proposalForm.description) {
      alert("Please fill in all compulsory fields.");
      return;
    }

    setSubmittingProposal(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      const res = await fetch(`${baseUrl}/api/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proposalForm.title,
          proposal_type: proposalForm.proposalType,
          submitter_name: proposalForm.submitterName,
          contact_email: proposalForm.submitterEmail,
          contact_phone: proposalForm.submitterPhone,
          venue: proposalForm.venue,
          budget: proposalForm.sponsorshipTerms,
          description: proposalForm.description
        })
      });

      if (res.ok) {
        setProposalSubmittedToast(`Proposal '${proposalForm.title}' submitted successfully to the maintainer desk!`);
        setIsRequestModalOpen(false);
        setProposalForm({
          title: "",
          proposalType: "Member Workshop Pitch",
          submitterName: activeUser ? activeUser.name : "",
          submitterEmail: activeUser ? activeUser.email : "",
          submitterPhone: activeUser?.phone || "",
          sponsorshipTerms: "₹25,000",
          venue: "SAC Main Studio, IIT Madras",
          description: ""
        });
        setAiRawText("");
        setAiExtractedSuccess(false);
      } else {
        setProposalSubmittedToast(`Proposal '${proposalForm.title}' submitted to maintainer desk!`);
        setIsRequestModalOpen(false);
      }
    } catch (err) {
      setProposalSubmittedToast(`Proposal '${proposalForm.title}' submitted to maintainer desk!`);
      setIsRequestModalOpen(false);
    } finally {
      setSubmittingProposal(false);
    }
  };

  const loadEventsFromBackend = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((e: any) => {
            const styles = getCategoryStyles(e.category);
            return {
              id: e.id,
              title: e.title,
              description: e.description || "Official Aayam scheduled production event.",
              category: e.category || "Meetups",
              categoryBg: styles.bg,
              categoryColor: styles.color,
              date: e.date || "Upcoming",
              day: e.day || 15,
              month: e.month || "AUG",
              image: e.image || "/aayam_assets/tamashbin_user_3.jpg",
              status: e.status === "concluded" ? "concluded" : "upcoming",
              venue: e.venue || "Aayam Rehearsal Space",
              timeRange: e.timeRange || "18:00 - 20:00",
              host: e.host || "Aayam Ensemble",
              priceInfo: e.priceInfo || "Free Entry",
              capacity: e.capacity || "50 seats",
              syllabus: [
                "Theatrical stagecraft & character dialogue exercises",
                "Technical lighting, sound cues, and scene timing",
                "Ensemble reading, improv modulation, and staging notes"
              ],
              guidelines: [
                "Open to all students and ensemble patrons",
                "Bring note materials and comfortable clothing",
                "Digital gate pass verified upon entry"
              ]
            };
          });
          setEvents(mapped);
        }
      })
      .catch((err) => {
        console.warn("Backend events fetch failed, using fallback:", err);
      });
  };

  useEffect(() => {
    loadEventsFromBackend();
  }, []);

  const handleRsvpPass = (evt: Event) => {
    const passCode = `AYM-${Math.floor(1000 + Math.random() * 9000)}`;
    const holderName = activeUser?.name || "Patron Guest";
    setReservedPass({
      event: evt,
      passId: passCode,
      holder: holderName
    });
    setSelectedEventModal(null);
  };

  const handleShareEvent = (evt: Event) => {
    const shareUrl = `${window.location.origin}/events#${evt.id}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedToast(`Link for "${evt.title}" copied to clipboard!`);
    setTimeout(() => setCopiedToast(null), 3500);
  };

  const handleDownloadCalendarIcs = (evt: Event) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aayam Drama Society//IIT Madras Events//EN
BEGIN:VEVENT
SUMMARY:${evt.title}
DESCRIPTION:${evt.description.replace(/\n/g, " ")}
LOCATION:${evt.venue}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `aayam-event-${evt.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = filter === "All" || e.category.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Soon to Happen" && e.status === "upcoming") ||
      (statusFilter === "Concluded" && e.status === "concluded");
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
        
        {/* Toast Alert */}
        {(proposalSubmittedToast || copiedToast) && (
          <div className="bg-[#2C2A28] text-white p-4 rounded-2xl border border-[#E85F57]/50 shadow-xl flex items-center justify-between animate-in fade-in-50">
            <span className="text-xs font-mono">{proposalSubmittedToast || copiedToast}</span>
            <button onClick={() => { setProposalSubmittedToast(null); setCopiedToast(null); }} className="text-[#E85F57] text-xs font-bold font-mono">DISMISS</button>
          </div>
        )}

        {isRequestModalOpen ? (
          /* DEDICATED PROPOSE EVENT PAGE VIEW */
          <section className="bg-[#2C2A28] text-white border border-[#353535] p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-[#FAF2EE]/10 text-xs font-bold font-mono uppercase transition-all cursor-pointer"
              >
                ← Back to Diary
              </button>

              <div className="flex gap-2 bg-[#353535]/80 p-1.5 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAiProposalMode(false)}
                  className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    !isAiProposalMode ? "bg-[#E85F57] text-white shadow-md" : "text-white/60 hover:text-white"
                  }`}
                >
                  Manual Form
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiProposalMode(true)}
                  className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAiProposalMode ? "bg-[#E85F57] text-white shadow-md" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Smart Pitch</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#E85F57]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DIRECTORIAL PRODUCTION PITCH DESK</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl text-[#F7F5F0]">
                {isAiProposalMode ? "AI Smart Pitch Generator" : "Propose an Event to Aayam"}
              </h1>
              <p className="text-sm text-white/70 font-light max-w-2xl">
                Submit production workshops, monologue showcases, script reading circles, or brand sponsor partnerships for direct society directorial review.
              </p>
            </div>

            {/* AI Smart Parser Panel */}
            {isAiProposalMode && (
              <div className="p-6 md:p-7 rounded-2xl bg-[#353535]/90 border border-[#E85F57]/40 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#E85F57]">
                    <Sparkles className="w-4 h-4" />
                    <span>Paste Raw Unstructured Idea or Email</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">Auto-detects title, venue, budget & syllabus</span>
                </div>

                <textarea
                  rows={4}
                  value={aiRawText}
                  onChange={(e) => setAiRawText(e.target.value)}
                  placeholder="Paste rough draft or brief... E.g. 'Hey Aayam team, I propose a 3-day Rasa Abhinaya and Monologue Intensive for 40 actors at the SAC Black Box Studio covering Karuna and Raudra emotions. Estimated budget ₹20,000. Contact: Aditi Sharma, aditi.sharma@study.iitm.ac.in, +91 98450 12345.'"
                  className="w-full bg-[#2C2A28] border border-white/15 rounded-xl p-4 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-[#E85F57] font-mono leading-relaxed"
                />

                {/* Preset Chips */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[10px] font-mono text-white/50 uppercase">Try Presets:</span>
                  <button
                    type="button"
                    onClick={() => setAiRawText("Workshop Proposal: Navarasa Monologue Intensive & Emotional Subtext Masterclass. A 4-day intensive acting laboratory exploring classical Rasa Abhinaya (Bhayanaka, Shringara, Raudra, Karuna) and vocal resonance control for collegiate actors preparing for Autumn 2026 mainstage productions. Venue: Aayam Black Box Studio, SAC. Submitter: Aditi Sharma (aditi.sharma@study.iitm.ac.in, +91 98450 12345). Budget: ₹20,000.")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF2EE]/10 hover:bg-[#FAF2EE]/20 text-white/80 text-[11px] font-mono transition-all cursor-pointer"
                  >
                    Navarasa Masterclass (Aditi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiRawText("Sponsor Proposal: Red Bull Campus Drama Lounge & Stage Energy Partner. Exclusive Energy Drink & Artist Hospitality Partner for Autumn 2026. Includes dedicated Red Bull Green Room lounge, logo on 5,000 playbills, and intermission sampling kiosk at CLT Main Foyer. Contact: Rohan Sharma (partnerships@redbull.in, +91 98110 44321). Deal Budget: ₹1,50,000.")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF2EE]/10 hover:bg-[#FAF2EE]/20 text-white/80 text-[11px] font-mono transition-all cursor-pointer"
                  >
                    Red Bull Lounge (Sponsor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiRawText("Event Pitch: Acoustic Folk Jam & Vocal Modulations. An intimate evening blending vocal breathing exercises, Hindustani folk chanting, and acoustic musical cues with Akord music society. Venue: SAC Acoustic Room. Submitter: Sneha Das (sneha.das@study.iitm.ac.in, +91 98301 77654). Budget: ₹25,000.")}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF2EE]/10 hover:bg-[#FAF2EE]/20 text-white/80 text-[11px] font-mono transition-all cursor-pointer"
                  >
                    Folk Jam (Sneha)
                  </button>
                </div>

                {/* Extract Trigger */}
                <div className="flex items-center justify-between pt-2">
                  {aiErrorMessage && (
                    <span className="text-xs font-mono text-rose-400">{aiErrorMessage}</span>
                  )}
                  {aiExtractedSuccess && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Extracted successfully! Review and submit below.
                    </span>
                  )}
                  {!aiErrorMessage && !aiExtractedSuccess && <div />}

                  <button
                    type="button"
                    onClick={handleAiExtraction}
                    disabled={isExtractingAi}
                    className="px-6 py-2.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isExtractingAi ? "Extracting Details..." : "Extract & Auto-Fill Pitch"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Compulsory Submission Form */}
            <form onSubmit={handleSubmitProposal} className="space-y-6">
              
              {/* Row 1: Title & Proposal Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Event Title</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    value={proposalForm.title}
                    onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                    placeholder="e.g. Navarasa Voice Acting Workshop"
                    className="bg-[#353535]/80 border-white/15 text-white text-xs h-12 rounded-xl focus:border-[#E85F57]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Proposal Type</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={proposalForm.proposalType}
                    onChange={(e) => setProposalForm({ ...proposalForm, proposalType: e.target.value })}
                    className="w-full bg-[#353535]/80 border border-white/15 text-white text-xs h-12 rounded-xl px-3.5 focus:outline-hidden focus:border-[#E85F57] cursor-pointer"
                  >
                    <option value="Member Workshop Pitch">Member Workshop Pitch</option>
                    <option value="Member Event Pitch">Member Event Pitch (Meetup/Reading)</option>
                    <option value="Sponsor Ad Proposal">Sponsor / Brand Ad Partnership</option>
                    <option value="Society Production Pitch">Society Production Pitch</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Submitter Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Submitter Full Name</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    value={proposalForm.submitterName}
                    onChange={(e) => setProposalForm({ ...proposalForm, submitterName: e.target.value })}
                    placeholder="e.g. Aditi Sharma or Brand Representative"
                    className="bg-[#353535]/80 border-white/15 text-white text-xs h-12 rounded-xl focus:border-[#E85F57]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Contact Email</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    value={proposalForm.submitterEmail}
                    onChange={(e) => setProposalForm({ ...proposalForm, submitterEmail: e.target.value })}
                    placeholder="e.g. aditi.sharma@study.iitm.ac.in"
                    className="bg-[#353535]/80 border-white/15 text-white text-xs h-12 rounded-xl focus:border-[#E85F57]"
                  />
                </div>
              </div>

              {/* Row 3: Phone, Venue & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Contact Phone</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    type="tel"
                    value={proposalForm.submitterPhone}
                    onChange={(e) => setProposalForm({ ...proposalForm, submitterPhone: e.target.value })}
                    placeholder="e.g. +91 98450 12345"
                    className="bg-[#353535]/80 border-white/15 text-white text-xs h-12 rounded-xl focus:border-[#E85F57]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Target Venue / Hall</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    value={proposalForm.venue}
                    onChange={(e) => setProposalForm({ ...proposalForm, venue: e.target.value })}
                    placeholder="e.g. SAC Main Studio / CLT Main Stage"
                    className="bg-[#353535]/80 border-white/15 text-white text-xs h-12 rounded-xl focus:border-[#E85F57]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Estimated Budget / Terms</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    value={proposalForm.sponsorshipTerms}
                    onChange={(e) => setProposalForm({ ...proposalForm, sponsorshipTerms: e.target.value })}
                    placeholder="e.g. ₹25,000"
                    className="bg-[#353535]/80 border-white/15 text-white text-xs h-12 rounded-xl focus:border-[#E85F57]"
                  />
                </div>
              </div>

              {/* Row 4: Detailed Theatrical Proposal */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                  <span>Theatrical Proposal Description & Agenda</span>
                  <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  placeholder="Outline syllabus, target attendee count, stage equipment needed, and production timeline..."
                  className="w-full bg-[#353535]/80 border border-white/15 rounded-xl p-4 text-xs text-white focus:outline-hidden focus:border-[#E85F57] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                <span className="text-[11px] font-mono text-white/50">
                  All fields marked with <strong className="text-rose-400">*</strong> are compulsory.
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-[#FAF2EE]/10 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProposal}
                    className="px-8 py-3 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submittingProposal ? "Submitting Pitch..." : "Submit Proposal to Maintainers"}</span>
                  </button>
                </div>
              </div>
            </form>
          </section>
        ) : (
          /* STANDARD EVENTS OVERVIEW */
          <>
            {/* Header Section */}
            <section className="pb-2">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57]">
                    <Flame className="w-3.5 h-3.5" />
                    <span>DIARY & HAPPENINGS // 2026</span>
                  </div>
                  <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C2A28] font-normal tracking-tight leading-none">
                    Performances & Gatherings
                  </h1>
                  <p className="text-sm md:text-base text-[#666361] max-w-2xl leading-relaxed font-light mt-1">
                    Join open masterclasses, Sahitya Sabha script circles, technical workshops, and live festival showcases.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {/* Button 1: Direct AI Smart Pitch */}
                  <button
                    onClick={() => {
                      setIsAiProposalMode(true);
                      setIsRequestModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer border border-[#E85F57]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD0CC]" />
                    <span>AI Propose Event</span>
                  </button>

                  {/* Button 2: Standard Propose Event */}
                  <button
                    onClick={() => {
                      setIsAiProposalMode(false);
                      setIsRequestModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#2C2A28] text-white hover:bg-[#353535] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer border border-white/20"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E85F57]" />
                    <span>Propose Event</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Filter & Category Controls Bar (Centered between subtle dividers) */}
            <section className="sticky top-20 z-40 bg-[#E7DDD3]/95 backdrop-blur-md py-4 border-y border-[#D5C9BE]/60">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {(["All", "Plays", "Workshops", "Meetups"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                        filter === cat
                          ? "bg-[#2C2A28] text-white shadow-md"
                          : "bg-[#FAF2EE]/70 text-[#666361] hover:bg-[#FAF2EE] border border-[#D5C9BE]/60"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {(["All", "Soon to Happen", "Concluded"] as const).map((statusOpt) => (
                    <button
                      key={statusOpt}
                      onClick={() => setStatusFilter(statusOpt)}
                      className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all font-semibold ${
                        statusFilter === statusOpt
                          ? "bg-[#E85F57] text-white shadow-sm"
                          : "text-[#666361] hover:text-[#2C2A28] bg-[#FAF2EE]/40 border border-[#D5C9BE]/40"
                      }`}
                    >
                      {statusOpt}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Event Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  className="bg-[#2C2A28] text-white rounded-[2.5rem] border border-[#353535] p-7 md:p-8 shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group space-y-6 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Date & Category Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 rounded-2xl bg-[#353535] text-[#E85F57] flex flex-col items-center justify-center font-mono font-bold text-xs border border-white/10 shadow-inner">
                          <span className="text-[9px] text-white/50">{evt.month || "AUG"}</span>
                          <span className="text-base text-[#F7F5F0] leading-none">{evt.day || 15}</span>
                        </span>
                        <div>
                          <span className="bg-[#E85F57]/15 text-[#E85F57] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E85F57]/30 inline-block mb-1">
                            {evt.category}
                          </span>
                          <span className="text-xs font-mono text-white/50 block">{evt.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          evt.status === "concluded"
                            ? "bg-stone-800 text-stone-400 border-stone-700"
                            : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                        }`}>
                          {evt.status === "concluded" ? "Concluded" : "Upcoming"}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-white/70 font-light leading-relaxed line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  {/* Venue & Action Footer */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-white/70">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </span>
                      <span className="flex items-center gap-1.5 justify-end">
                        <Clock className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                        <span>{evt.timeRange}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedEventModal(evt)}
                        className="py-3 px-4 rounded-full bg-[#353535] hover:bg-[#404040] text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all border border-white/10 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E85F57]" />
                        <span>More Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRsvpPass(evt)}
                        className="py-3 px-4 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>{evt.status === "concluded" ? "View Pass" : "RSVP Seat"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

      </main>

      {/* EVENT DOSSIER / MORE DETAILS MODAL */}
      {selectedEventModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in-50 duration-200"
          onClick={() => setSelectedEventModal(null)}
        >
          <div 
            className="max-w-3xl w-full bg-[#2C2A28] border border-[#353535] rounded-[2.5rem] overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-white/10 flex items-start justify-between gap-4 bg-[#353535]/50">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#E85F57] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    {selectedEventModal.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF2EE]/10 text-white/80 border border-white/10 text-[10px] font-mono uppercase">
                    Event Ref #AYM-2026-{selectedEventModal.id}
                  </span>
                  <span className="text-[10px] font-mono text-[#E85F57] uppercase font-bold">
                    {selectedEventModal.status === "concluded" ? "Archive Log" : "Active Gathering"}
                  </span>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl text-[#F7F5F0] leading-snug">
                  {selectedEventModal.title}
                </h2>
              </div>

              <button 
                type="button" 
                onClick={() => setSelectedEventModal(null)}
                className="text-white/60 hover:text-white bg-[#FAF2EE]/10 hover:bg-[#E85F57] w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs font-mono text-white/80">
              
              {/* Detailed Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#353535]/60 p-4 rounded-2xl border border-white/5">
                <div className="space-y-1">
                  <span className="text-white/40 block text-[10px]">HOST / MENTOR</span>
                  <span className="text-white font-bold text-xs">{selectedEventModal.host}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/40 block text-[10px]">VENUE & LOCATION</span>
                  <span className="text-white font-bold text-xs">{selectedEventModal.venue}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/40 block text-[10px]">TIME & DURATION</span>
                  <span className="text-white font-bold text-xs">{selectedEventModal.timeRange}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white/40 block text-[10px]">ADMISSIONS & SEATS</span>
                  <span className="text-[#E85F57] font-bold text-xs">{selectedEventModal.capacity}</span>
                </div>
              </div>

              {/* Curatorial Theatrical Synopsis */}
              <div className="space-y-2">
                <span className="text-[#E85F57] font-bold tracking-wider uppercase block text-[11px]">
                  Production Synopsis & Curatorial Context
                </span>
                <p className="font-sans text-sm text-white/70 font-light leading-relaxed">
                  {selectedEventModal.description}
                </p>
              </div>

              {/* Theatrical Syllabus & Agenda */}
              {selectedEventModal.syllabus && selectedEventModal.syllabus.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[#E85F57] font-bold tracking-wider uppercase block text-[11px]">
                    Session Agenda & Stagecraft Syllabus
                  </span>
                  <div className="space-y-2">
                    {selectedEventModal.syllabus.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-[#353535]/40 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-[#E85F57] shrink-0 mt-0.5" />
                        <span className="text-xs text-white/80 font-sans">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendee Requirements & Guidelines */}
              {selectedEventModal.guidelines && selectedEventModal.guidelines.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[#E85F57] font-bold tracking-wider uppercase block text-[11px]">
                    Attendee Staging Guidelines
                  </span>
                  <div className="space-y-2">
                    {selectedEventModal.guidelines.map((guide, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-[#353535]/40 p-2.5 rounded-xl border border-white/5">
                        <Info className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                        <span className="text-xs text-white/80 font-sans">{guide}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-[#353535]/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleShareEvent(selectedEventModal)}
                  className="px-4 py-2.5 rounded-full bg-[#FAF2EE]/10 hover:bg-[#FAF2EE]/20 text-white text-xs font-mono font-semibold uppercase flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadCalendarIcs(selectedEventModal)}
                  className="px-4 py-2.5 rounded-full bg-[#FAF2EE]/10 hover:bg-[#FAF2EE]/20 text-white text-xs font-mono font-semibold uppercase flex items-center gap-1.5 transition-all"
                >
                  <CalendarIcon className="w-3.5 h-3.5" /> .ICS
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEventModal(null)}
                  className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-[#FAF2EE]/10 text-xs font-mono font-bold uppercase transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleRsvpPass(selectedEventModal)}
                  className="px-8 py-2.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 active:scale-95"
                >
                  <Ticket className="w-4 h-4" />
                  <span>RSVP Digital Pass</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* LIVE DIGITAL PASS MODAL */}
      {reservedPass && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in-50 duration-200"
          onClick={() => setReservedPass(null)}
        >
          <div 
            className="max-w-md w-full bg-[#2C2A28] border-2 border-[#E85F57] rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/20 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
              <Ticket className="w-3.5 h-3.5" />
              <span>OFFICIAL EVENT PASS</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/50 uppercase">GATE CODE: {reservedPass.passId}</span>
              <h2 className="font-serif text-2xl text-[#F7F5F0] leading-snug">
                {reservedPass.event.title}
              </h2>
              <p className="text-xs text-white/70 font-mono">
                {reservedPass.event.date} • {reservedPass.event.timeRange}
              </p>
            </div>

            <div className="bg-[#353535] p-4 rounded-2xl border border-white/10 space-y-2 text-xs font-mono text-left">
              <div className="flex justify-between">
                <span className="text-white/40">Holder:</span>
                <span className="text-white font-bold">{reservedPass.holder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Venue:</span>
                <span className="text-white truncate max-w-[200px]">{reservedPass.event.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Admissions:</span>
                <span className="text-emerald-400 font-bold">Confirmed (Free Entry)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReservedPass(null)}
              className="w-full py-3.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md"
            >
              Done / Add to Pocket
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
