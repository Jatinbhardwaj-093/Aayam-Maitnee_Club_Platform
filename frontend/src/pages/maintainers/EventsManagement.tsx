// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Search, Plus, MapPin, Clock, Users, Shield, FileText, ArrowRight,
  CheckCircle2, DollarSign, Building, Tag, ExternalLink, Activity, PlayCircle,
  Sparkles, X, HeartHandshake, ClipboardList, Check, AlertCircle, Video, Star,
  SlidersHorizontal, ChevronRight, RefreshCw, UserCheck, UserX, MessageSquare,
  BookOpen, Edit3, Send, CheckSquare, XCircle, ArrowUpRight, Info, Heart, Coins,
  Lock, Unlock, Flame
} from "lucide-react";
import ScriptPreviewModal from "@/components/ScriptPreviewModal";
import ProductionDetailModal from "@/components/ProductionDetailModal";
import type { ProductionDetailData } from "@/components/ProductionDetailModal";
import ProductionEditModal from "@/components/ProductionEditModal";
import { getPlaybookForTitle } from "@/data/playbooksData";
import type { Playbook } from "@/data/playbooksData";

interface EventItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  venue: string;
  timeRange?: string;
  status: string;
  is_past?: boolean;
  description?: string;
  play_id?: number;
  playwright?: string;
  director?: string;
  image?: string;
  cast?: string;
  genre?: string;
  language?: string;
  tagline?: string;
  acts?: string;
  price?: string;
  is_sponsored?: boolean;
  sponsor_name?: string;
  sponsor_amount?: string;
  patronage_open?: boolean;
  donations_collected?: string;
  target_budget?: string;
  auditionCount?: number;
  applicantCount?: number;
  volunteerCount?: number;
}

interface ProposalItem {
  id: number;
  name: string;
  title?: string;
  description: string;
  date: string;
  event_date?: string;
  venue: string;
  location_or_link?: string;
  budget: string;
  proposalType: string;
  sourceType: "Member" | "Sponsor";
  status: string;
  contact_email: string;
  contact_phone: string;
  submitter: {
    name: string;
    initials: string;
    email: string;
    phone: string;
  };
}

// Rich Fallback Upcoming Events (Only upcoming productions, workshops, meetups)
const fallbackUpcomingEvents: EventItem[] = [
  {
    id: "play-1",
    play_id: 1,
    title: "Hayavadana",
    category: "Plays",
    date: "Sep 18 - 20, 2026",
    venue: "CLT Main Stage, IIT Madras",
    timeRange: "18:00 - 20:30",
    status: "Upcoming Premiere",
    is_past: false,
    is_sponsored: true,
    sponsor_name: "Red Bull India",
    sponsor_amount: "₹1,50,000",
    patronage_open: false,
    donations_collected: "₹0",
    description: "Girish Karnad's legendary mythic drama on identity and desire, presented in dual-language Hindi/English translation with live percussion.",
    playwright: "Girish Karnad",
    director: "Utkarsh (Yuuhi)",
    cast: "Devadatta (Lead Actor), Kapila (Lead Actor), Padmini (Lead Actress), Hayavadana (Chorus Lead)",
    genre: "Classical Dramatic Verse",
    language: "Hindi & English",
    tagline: "The search for completeness of mind, body, and human intellect.",
    acts: "2 Acts • Full Length",
    price: "Free Student Pass",
    image: "/aayam_assets/tamashbin_user_1.jpg",
    auditionCount: 4,
    applicantCount: 8,
    volunteerCount: 5
  },
  {
    id: "play-2",
    play_id: 2,
    title: "Ashadh Ka Ek Din",
    category: "Plays",
    date: "Oct 09 - 11, 2026",
    venue: "CLT Main Stage, IIT Madras",
    timeRange: "18:30 - 21:00",
    status: "Upcoming Premiere",
    is_past: false,
    is_sponsored: true,
    sponsor_name: "FabIndia Handlooms",
    sponsor_amount: "₹85,000",
    patronage_open: false,
    donations_collected: "₹0",
    description: "Mohan Rakesh's poetic masterpiece portraying Kalidasa's emotional dilemmas in the misty Himalayan valley of Ujjayini.",
    playwright: "Mohan Rakesh",
    director: "Abay Nandhiga",
    cast: "Kalidasa (Lead Performer), Mallika (Principal Actress), Ambika (Mother), Vilom (Antagonist)",
    genre: "Modern Classical Hindi Drama",
    language: "Pure Literary Hindi",
    tagline: "The eternal conflict between artistic purity and royal patronage.",
    acts: "3 Acts • 120 Mins",
    price: "Free Student Pass",
    image: "/aayam_assets/kky_user_5.jpg",
    auditionCount: 3,
    applicantCount: 6,
    volunteerCount: 4
  },
  {
    id: "play-3",
    play_id: 3,
    title: "Charandas Chor",
    category: "Plays",
    date: "Oct 24 - 25, 2026",
    venue: "OAT Amphitheatre, IIT Madras",
    timeRange: "17:30 - 19:45",
    status: "Upcoming Premiere",
    is_past: false,
    is_sponsored: false,
    patronage_open: true,
    donations_collected: "₹18,500",
    target_budget: "₹35,000",
    description: "Habib Tanvir's folk satire about an honest thief caught between four vows, staged in open-air Nacha folk theatre style with dholak and singing choruses.",
    playwright: "Habib Tanvir",
    director: "Samarth Shrivastava",
    cast: "Charandas (Principal Lead), Queen (Principal Antagonist), Havaldar (Folk Chorus), Priest",
    genre: "Chhattisgarhi Folk Satire",
    language: "Hindi & Folk Dialect",
    tagline: "Truth in thievery, and deception on royal thrones.",
    acts: "2 Acts • Folk Musical",
    price: "Free Student Pass",
    image: "/aayam_assets/dddj_user_1.jpg",
    auditionCount: 3,
    applicantCount: 5,
    volunteerCount: 6
  },
  {
    id: "evt-1",
    title: "Navarasa Monologue Intensive & Emotional Subtext Masterclass",
    category: "Workshops",
    date: "Sep 15, 2026",
    venue: "Aayam Black Box Studio, SAC",
    timeRange: "17:00 - 20:00",
    status: "Scheduled",
    is_past: false,
    is_sponsored: false,
    patronage_open: true,
    donations_collected: "₹12,000",
    target_budget: "₹20,000",
    description: "A 4-day intensive acting laboratory exploring classical Rasa Abhinaya (Bhayanaka, Shringara, Raudra, Karuna) and vocal resonance control led by Aditi Sharma.",
    playwright: "Aditi Sharma (Directorial Pitch)",
    director: "Aditi Sharma",
    genre: "Acting Masterclass",
    language: "Hindi / English",
    acts: "4 Practical Sessions",
    price: "Free Entry / Registered",
    image: "/aayam_assets/samatvam_user_4.jpg",
    auditionCount: 0,
    applicantCount: 0,
    volunteerCount: 3
  },
  {
    id: "evt-2",
    title: "Stage Lighting & DMX Rigging Masterclass",
    category: "Workshops",
    date: "Aug 27, 2026",
    venue: "CLT Tech Booth, IIT Madras",
    timeRange: "16:00 - 18:30",
    status: "Scheduled",
    is_past: false,
    is_sponsored: true,
    sponsor_name: "AudioCraft Proscenium",
    sponsor_amount: "₹1,20,000",
    patronage_open: false,
    donations_collected: "₹0",
    description: "Hands-on technical crew training on digital lighting consoles, dimmer packs, spotlights, and cue sync for live theatrical proscenium productions.",
    playwright: "Aayam Technical Crew",
    director: "Harsh Aryan",
    genre: "Technical Stagecraft",
    language: "English / Hindi",
    acts: "1 Masterclass",
    price: "Free Entry",
    image: "/aayam_assets/dddj_user_2.jpg",
    auditionCount: 0,
    applicantCount: 0,
    volunteerCount: 2
  },
  {
    id: "evt-3",
    title: "Physical Movement & Navarasa Mime Workshop",
    category: "Workshops",
    date: "Sep 05, 2026",
    venue: "Rehearsal Hall B - Studio 2",
    timeRange: "17:30 - 20:00",
    status: "Scheduled",
    is_past: false,
    is_sponsored: false,
    patronage_open: true,
    donations_collected: "₹15,000",
    target_budget: "₹35,000",
    description: "Physical theatre workshop focusing on Angika Abhinaya (body gestures), spine alignment, and spatial geometry on bare proscenium stages.",
    playwright: "Samarth Shrivastava",
    director: "Samarth Shrivastava",
    genre: "Movement & Mime",
    language: "Non-verbal & Hindi",
    acts: "1 Intensive",
    price: "Free Entry",
    image: "/aayam_assets/tamashbin_user_2.jpg",
    auditionCount: 0,
    applicantCount: 0,
    volunteerCount: 3
  },
  {
    id: "evt-4",
    title: "Monologue Jamming & Chai Meetup",
    category: "Meetups",
    date: "Aug 30, 2026",
    venue: "OAT Amphitheatre Lawns, IIT Madras",
    timeRange: "16:30 - 18:30",
    status: "Scheduled",
    is_past: false,
    is_sponsored: false,
    patronage_open: true,
    donations_collected: "₹5,000",
    target_budget: "₹10,000",
    description: "Relaxed weekend meetup for ensemble actors to perform short 2-minute monologues, receive dramaturgy feedback, and network over evening chai.",
    playwright: "Aayam Ensemble",
    director: "Utkarsh (Yuuhi)",
    genre: "Community Reading Circle",
    language: "Hindi & English",
    acts: "Open Mic Format",
    price: "Free Entry",
    image: "/aayam_assets/kky_user_2.jpg",
    auditionCount: 0,
    applicantCount: 0,
    volunteerCount: 2
  }
];

// Rich Fallback Pitches
const fallbackPitches: ProposalItem[] = [
  {
    id: 1,
    name: "Navarasa Monologue Intensive & Emotional Subtext Masterclass",
    description: "A 4-day intensive acting laboratory exploring classical Rasa Abhinaya (Bhayanaka, Shringara, Raudra, Karuna) and vocal resonance control for collegiate actors preparing for Autumn 2026 mainstage productions.",
    date: "Sep 15, 2026",
    venue: "Aayam Black Box Studio, SAC",
    budget: "₹20,000",
    proposalType: "Member Workshop Pitch",
    sourceType: "Member",
    status: "Pending",
    contact_email: "aditi.sharma@study.iitm.ac.in",
    contact_phone: "+91 98450 12345",
    submitter: {
      name: "Aditi Sharma",
      initials: "AS",
      email: "aditi.sharma@study.iitm.ac.in",
      phone: "+91 98450 12345"
    }
  },
  {
    id: 2,
    name: "Campus Monologue Competition & Dramatic Open Mic",
    description: "A pan-campus dramatic monologue competition featuring student-written pieces and classical Hindi/English dramatic adaptations evaluated by alumni directors.",
    date: "Sep 22, 2026",
    venue: "OAT Amphitheatre Steps",
    budget: "₹30,000",
    proposalType: "Member Event Pitch",
    sourceType: "Member",
    status: "Pending",
    contact_email: "aditi.sharma@study.iitm.ac.in",
    contact_phone: "+91 98450 12345",
    submitter: {
      name: "Aditi Sharma",
      initials: "AS",
      email: "aditi.sharma@study.iitm.ac.in",
      phone: "+91 98450 12345"
    }
  },
  {
    id: 3,
    name: "Acoustic Folk Jam & Vocal Modulations",
    description: "An intimate evening blending vocal breathing exercises, Hindustani folk chanting, and acoustic musical cues with Akord music society.",
    date: "Sep 10, 2026",
    venue: "SAC Acoustic Room, IIT Madras",
    budget: "₹25,000",
    proposalType: "Member Workshop Pitch",
    sourceType: "Member",
    status: "Pending",
    contact_email: "sneha.das@study.iitm.ac.in",
    contact_phone: "+91 98301 77654",
    submitter: {
      name: "Sneha Das",
      initials: "SD",
      email: "sneha.das@study.iitm.ac.in",
      phone: "+91 98301 77654"
    }
  },
  {
    id: 4,
    name: "Physical Movement & Navarasa Mime Masterclass",
    description: "A 3-hour movement masterclass focusing on body language, character silhouette, and non-verbal physical theatre techniques led by senior choreographers.",
    date: "Sep 05, 2026",
    venue: "Rehearsal Hall B - Studio 2",
    budget: "₹35,000",
    proposalType: "Member Workshop Pitch",
    sourceType: "Member",
    status: "Pending",
    contact_email: "samarth.s@study.iitm.ac.in",
    contact_phone: "+91 98712 33445",
    submitter: {
      name: "Samarth Shrivastava",
      initials: "SS",
      email: "samarth.s@study.iitm.ac.in",
      phone: "+91 98712 33445"
    }
  },
  {
    id: 5,
    name: "Street Play Rhythms & Dholak Synchronization Masterclass",
    description: "High-tempo workshop covering traditional dholak percussion patterns, rhythmic slogans, and circular crowd-gathering techniques for Nukkad Natak festivals.",
    date: "Sep 12, 2026",
    venue: "OAT Courtyard, IIT Madras",
    budget: "₹18,000",
    proposalType: "Member Workshop Pitch",
    sourceType: "Member",
    status: "Approved",
    contact_email: "utkarsh123@study.iitm.ac.in",
    contact_phone: "+91 98102 99887",
    submitter: {
      name: "Utkarsh (Yuuhi)",
      initials: "UY",
      email: "utkarsh123@study.iitm.ac.in",
      phone: "+91 98102 99887"
    }
  },
  {
    id: 6,
    name: "Red Bull Campus Drama Lounge & Stage Energy Partner",
    description: "Exclusive Energy Drink & Artist Hospitality Partner for Autumn 2026 providing branded green rooms, foyer sampling kiosks, and playbill back-cover ad placement across all Autumn 2026 productions.",
    date: "Sep 18, 2026",
    venue: "CLT Main Foyer & Green Room",
    budget: "₹1,50,000",
    proposalType: "Sponsor Ad Proposal",
    sourceType: "Sponsor",
    status: "Pending",
    contact_email: "partnerships@redbull.in",
    contact_phone: "+91 98110 44321",
    submitter: {
      name: "Rohan Sharma (Red Bull India)",
      initials: "RB",
      email: "partnerships@redbull.in",
      phone: "+91 98110 44321"
    }
  },
  {
    id: 7,
    name: "FabIndia Ethnic Wardrobe & Stage Handloom Sponsorship",
    description: "Stage Wardrobe Craft & Handloom Partner providing authentic handloom drapes and period costumes for classical productions in exchange for playbill inserts and foyer exhibits.",
    date: "Sep 25, 2026",
    venue: "CLT Main Stage",
    budget: "₹85,000",
    proposalType: "Sponsor Ad Proposal",
    sourceType: "Sponsor",
    status: "Approved",
    contact_email: "campus@fabindia.net",
    contact_phone: "+91 98201 88765",
    submitter: {
      name: "Ananya Deshmukh (FabIndia)",
      initials: "FD",
      email: "campus@fabindia.net",
      phone: "+91 98201 88765"
    }
  },
  {
    id: 8,
    name: "AudioCraft Proscenium Sound & Wireless Consoles",
    description: "Proscenium Sound & Hardware Partner providing wireless UHF microphones, stage monitors, and digital audio mixing consoles for all major Darpan 2026 festival performances.",
    date: "Oct 02, 2026",
    venue: "Tech Booth CLT, IIT Madras",
    budget: "₹1,20,000",
    proposalType: "Sponsor Ad Proposal",
    sourceType: "Sponsor",
    status: "Pending",
    contact_email: "support@audiocraft.in",
    contact_phone: "+91 98402 77112",
    submitter: {
      name: "Vikram Malhotra (AudioCraft)",
      initials: "AC",
      email: "support@audiocraft.in",
      phone: "+91 98402 77112"
    }
  },
  {
    id: 9,
    name: "Zebronics Acoustic Audio Experience Sponsor",
    description: "Acoustic stage sound monitors and rehearsal room soundbar systems for student production rehearsals in exchange for digital social media co-branding and tickets giveaway.",
    date: "Oct 15, 2026",
    venue: "SAC Amphitheatre & CLT",
    budget: "₹60,000",
    proposalType: "Sponsor Ad Proposal",
    sourceType: "Sponsor",
    status: "Pending",
    contact_email: "campus.alliances@zebronics.com",
    contact_phone: "+91 98901 33221",
    submitter: {
      name: "Pooja Hegde (Zebronics)",
      initials: "ZB",
      email: "campus.alliances@zebronics.com",
      phone: "+91 98901 33221"
    }
  }
];

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState<"calendar" | "pitches">("calendar");
  const [eventsList, setEventsList] = useState<EventItem[]>(fallbackUpcomingEvents);
  const [proposalsList, setProposalsList] = useState<ProposalItem[]>(fallbackPitches);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Pitches Tab Filter
  const [pitchSourceFilter, setPitchSourceFilter] = useState<"all" | "member" | "sponsor">("all");
  const [pitchStatusFilter, setPitchStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Auditions & Volunteer Data
  const [allPositions, setAllPositions] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [allVolunteers, setAllVolunteers] = useState<any[]>([]);

  // Modals
  const [selectedEventForAuditions, setSelectedEventForAuditions] = useState<EventItem | null>(null);
  const [selectedEventForVolunteers, setSelectedEventForVolunteers] = useState<EventItem | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Script Preview Modal
  const [previewScript, setPreviewScript] = useState<Playbook | null>(null);
  const [scriptModalOpen, setScriptModalOpen] = useState<boolean>(false);

  // Production Detail & Edit Modals
  const [selectedDetailProd, setSelectedDetailProd] = useState<ProductionDetailData | null>(null);
  const [selectedEditProd, setSelectedEditProd] = useState<ProductionDetailData | null>(null);

  // Patronage / Donation Modal
  const [selectedEventForDonation, setSelectedEventForDonation] = useState<EventItem | null>(null);
  const [donorPledgeAmount, setDonorPledgeAmount] = useState<string>("₹2,000");
  const [donorName, setDonorName] = useState<string>("Society Patron / Alum");

  // Review & Edit Pitch Modal (Before Approving to Events)
  const [editingPitch, setEditingPitch] = useState<ProposalItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Workshops",
    venue: "",
    event_date: "2026-09-15",
    description: "",
    budget: "",
    is_sponsored: false,
    sponsor_name: "",
    max_participants: 60
  });
  const [submittingDecision, setSubmittingDecision] = useState<boolean>(false);

  const handleOpenScriptPreview = (eventItem: EventItem) => {
    const playbook = getPlaybookForTitle(eventItem.title);
    setPreviewScript(playbook);
    setScriptModalOpen(true);
  };

  const handleOpenDetails = (ev: EventItem) => {
    setSelectedDetailProd({
      id: ev.id,
      title: ev.title,
      category: ev.category,
      venue: ev.venue,
      dates: ev.date,
      runtime: ev.timeRange,
      status: ev.status,
      is_past: false,
      description: ev.description,
      playwright: ev.playwright || "Aayam Repertory",
      director: ev.director || "Aayam Directorial Council",
      image: ev.image || "/aayam_assets/tamashbin_user_1.jpg",
      cast: ev.cast || "",
      genre: ev.genre,
      language: ev.language,
      tagline: ev.tagline,
      acts: ev.acts,
      price: ev.price || "Free Society Pass"
    });
  };

  const handleOpenEdit = (ev: EventItem) => {
    setSelectedEditProd({
      id: ev.id,
      title: ev.title,
      category: ev.category,
      venue: ev.venue,
      dates: ev.date,
      runtime: ev.timeRange,
      status: ev.status,
      is_past: false,
      description: ev.description,
      playwright: ev.playwright || "Aayam Repertory",
      director: ev.director || "Aayam Directorial Council",
      image: ev.image || "/aayam_assets/tamashbin_user_1.jpg",
      cast: ev.cast || "",
      genre: ev.genre,
      language: ev.language,
      tagline: ev.tagline,
      acts: ev.acts,
      season: "Autumn 2026",
      price: ev.price || "Free Society Pass"
    });
  };

  const handleProductionEditSuccess = (updated: ProductionDetailData) => {
    setEventsList(prev => prev.map(item => {
      if (item.id === updated.id || String(item.id).endsWith(String(updated.id))) {
        return {
          ...item,
          title: updated.title,
          description: updated.description,
          venue: updated.venue,
          date: updated.dates || item.date,
          timeRange: updated.runtime || item.timeRange,
          image: updated.image || item.image,
          status: updated.status || item.status,
          playwright: updated.playwright || item.playwright,
          director: updated.director || item.director,
          cast: updated.cast || item.cast,
          genre: updated.genre || item.genre,
          language: updated.language || item.language,
          tagline: updated.tagline || item.tagline,
          acts: updated.acts || item.acts,
          price: updated.price || item.price
        };
      }
      return item;
    }));
    setActionSuccessMsg(`Production '${updated.title}' updated successfully.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Load backend data with robust baseUrl and fallback fallback
  const fetchData = async () => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

    try {
      const [playsRes, eventsRes, posRes, appsRes, volsRes, propsRes] = await Promise.all([
        fetch(`${baseUrl}/api/plays`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/events`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/audition-positions`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/audition-applications`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/volunteers`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${baseUrl}/api/proposals`).then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      if (Array.isArray(posRes)) setAllPositions(posRes);
      if (Array.isArray(appsRes)) setAllApplications(appsRes);
      if (Array.isArray(volsRes)) setAllVolunteers(volsRes);

      const unifiedEvents: EventItem[] = [];

      // Add ONLY UPCOMING Plays (going to happen)
      if (Array.isArray(playsRes) && playsRes.length > 0) {
        playsRes
          .filter((p: any) => !p.is_past && !(p.status || "").toLowerCase().includes("archive"))
          .forEach((p: any) => {
            const playPositions = (posRes || []).filter((pos: any) => 
              (pos.production_name || "").toLowerCase().includes(p.title.toLowerCase()) ||
              p.title.toLowerCase().includes((pos.production_name || "").toLowerCase())
            );
            const playApps = (appsRes || []).filter((app: any) => 
              (app.production_name || "").toLowerCase().includes(p.title.toLowerCase()) ||
              p.title.toLowerCase().includes((app.production_name || "").toLowerCase())
            );
            const playVols = (volsRes || []).filter((v: any) => 
              String(v.play_id) === String(p.id) ||
              (v.play_title || "").toLowerCase().includes(p.title.toLowerCase()) ||
              p.title.toLowerCase().includes((v.play_title || "").toLowerCase())
            );

            const isSponsored = Boolean(p.title.toLowerCase().includes("hayavadana") || p.title.toLowerCase().includes("ashadh"));

            unifiedEvents.push({
              id: `play-${p.id}`,
              play_id: p.id,
              title: p.title,
              category: "Plays",
              date: p.dates || "Autumn Season 2026",
              venue: p.venue || "CLT Main Stage",
              timeRange: p.runtime || "110 Mins",
              status: "Upcoming Premiere",
              is_past: false,
              description: p.description || p.tagline,
              playwright: p.playwright,
              director: p.director,
              genre: p.genre,
              language: p.language,
              tagline: p.tagline,
              acts: p.acts,
              cast: p.cast,
              image: p.image || "/aayam_assets/tamashbin_user_1.jpg",
              price: p.price || "Free Student Pass",
              is_sponsored: isSponsored,
              sponsor_name: p.title.toLowerCase().includes("hayavadana") ? "Red Bull India" : (p.title.toLowerCase().includes("ashadh") ? "FabIndia Handlooms" : ""),
              sponsor_amount: p.title.toLowerCase().includes("hayavadana") ? "₹1,50,000" : (p.title.toLowerCase().includes("ashadh") ? "₹85,000" : ""),
              patronage_open: !isSponsored,
              donations_collected: !isSponsored ? "₹18,500" : "₹0",
              target_budget: "₹35,000",
              auditionCount: playPositions.length,
              applicantCount: playApps.length,
              volunteerCount: playVols.length
            });
          });
      }

      // Add Upcoming Events (Workshops, Meetups, Masterclasses)
      if (Array.isArray(eventsRes) && eventsRes.length > 0) {
        eventsRes
          .filter((ev: any) => ev.status !== "concluded")
          .forEach((ev: any) => {
            if (!unifiedEvents.some(e => e.title.toLowerCase() === ev.title.toLowerCase())) {
              const evPositions = (posRes || []).filter((pos: any) => 
                (pos.production_name || "").toLowerCase().includes(ev.title.toLowerCase()) ||
                ev.title.toLowerCase().includes((pos.production_name || "").toLowerCase())
              );
              const evApps = (appsRes || []).filter((app: any) => 
                (app.production_name || "").toLowerCase().includes(ev.title.toLowerCase()) ||
                ev.title.toLowerCase().includes((app.production_name || "").toLowerCase())
              );
              const evVols = (volsRes || []).filter((v: any) => 
                (v.play_title || "").toLowerCase().includes(ev.title.toLowerCase()) ||
                ev.title.toLowerCase().includes((v.play_title || "").toLowerCase())
              );

              const isEvtSponsored = Boolean(ev.title.toLowerCase().includes("lighting") || ev.title.toLowerCase().includes("dmx"));

              unifiedEvents.push({
                id: `evt-${ev.id}`,
                title: ev.title,
                category: ev.category || "Workshops",
                date: ev.date || "Scheduled 2026",
                venue: ev.venue || "SAC Main Hall",
                timeRange: ev.timeRange || "17:30 - 20:00",
                status: "Scheduled",
                is_past: false,
                description: ev.description,
                image: ev.image || "/aayam_assets/samatvam_user_4.jpg",
                is_sponsored: isEvtSponsored,
                sponsor_name: isEvtSponsored ? "AudioCraft Proscenium" : "",
                sponsor_amount: isEvtSponsored ? "₹1,20,000" : "",
                patronage_open: !isEvtSponsored,
                donations_collected: "₹12,000",
                target_budget: "₹25,000",
                auditionCount: evPositions.length,
                applicantCount: evApps.length,
                volunteerCount: evVols.length
              });
            }
          });
      }

      // If backend returned events, update; otherwise keep robust fallback
      if (unifiedEvents.length > 0) {
        setEventsList(unifiedEvents);
      } else {
        setEventsList(fallbackUpcomingEvents);
      }

      // Proposals & Pitches
      if (Array.isArray(propsRes) && propsRes.length > 0) {
        setProposalsList(propsRes);
      } else {
        setProposalsList(fallbackPitches);
      }
    } catch (err) {
      console.warn("Backend fetch failed, using fallback data:", err);
      setEventsList(fallbackUpcomingEvents);
      setProposalsList(fallbackPitches);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update volunteer status
  const handleUpdateVolunteerStatus = async (volId: number, newStatus: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      const res = await fetch(`${baseUrl}/api/volunteer/${volId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAllVolunteers(prev => prev.map(v => v.id === volId ? { ...v, status: newStatus } : v));
        setActionSuccessMsg(`Volunteer request marked as '${newStatus}'.`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error("Error updating volunteer status:", err);
    }
  };

  // Update audition candidate status
  const handleUpdateAppStatus = async (appId: number, newStatus: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      const res = await fetch(`${baseUrl}/api/audition-application/${appId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAllApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
        setActionSuccessMsg(`Audition candidate marked as '${newStatus}'.`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  // Open Edit & Review modal for a pitch
  const handleOpenEditPitch = (pitch: ProposalItem) => {
    const isSponsor = (pitch.proposalType || "").toLowerCase().includes("sponsor") || pitch.sourceType === "Sponsor";
    setEditingPitch(pitch);
    setEditFormData({
      title: pitch.name || pitch.title || "",
      category: (pitch.proposalType || "").toLowerCase().includes("workshop") ? "Workshops" : (isSponsor ? "Plays" : "Meetups"),
      venue: pitch.venue || pitch.location_or_link || "SAC Main Studio, IIT Madras",
      event_date: "2026-09-20",
      description: pitch.description || "",
      budget: pitch.budget || "₹25,000",
      is_sponsored: isSponsor,
      sponsor_name: isSponsor ? pitch.submitter?.name || "Corporate Brand Sponsor" : "",
      max_participants: 60
    });
  };

  // Approve Pitch & Convert into Public Event
  const handleApproveAndPublishPitch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPitch) return;
    setSubmittingDecision(true);

    try {
      const payload = {
        title: editFormData.title,
        category: editFormData.category,
        venue: editFormData.venue,
        event_date: editFormData.event_date,
        description: editFormData.description,
        budget: editFormData.budget,
        is_sponsored: editFormData.is_sponsored,
        sponsor_name: editFormData.sponsor_name,
        max_participants: editFormData.max_participants
      };

      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      await fetch(`${baseUrl}/api/proposals/${editingPitch.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => null);

      // Update proposal list locally
      setProposalsList(prev => prev.map(p => p.id === editingPitch.id ? { ...p, status: "Approved", ...payload, name: payload.title } : p));
      
      // Append newly created event to Upcoming Events list
      const newEvt: EventItem = {
        id: `evt-appr-${editingPitch.id}`,
        title: payload.title,
        category: payload.category,
        date: payload.event_date,
        venue: payload.venue,
        timeRange: "17:30 - 20:00",
        status: "Scheduled",
        is_past: false,
        description: payload.description,
        is_sponsored: editFormData.is_sponsored,
        sponsor_name: editFormData.is_sponsored ? editFormData.sponsor_name : "",
        sponsor_amount: editFormData.is_sponsored ? editFormData.budget : "",
        patronage_open: !editFormData.is_sponsored,
        donations_collected: "₹0",
        target_budget: editFormData.budget || "₹25,000",
        auditionCount: 0,
        applicantCount: 0,
        volunteerCount: 0
      };
      setEventsList(prev => [newEvt, ...prev]);

      setActionSuccessMsg(`Pitch approved! Published '${payload.title}' to the Upcoming Events roster.`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
      setEditingPitch(null);
    } catch (err) {
      console.error("Error approving proposal:", err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Quick Approve Pitch without opening modal
  const handleQuickApprove = async (pitch: ProposalItem) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      const isSponsor = (pitch.proposalType || "").toLowerCase().includes("sponsor") || pitch.sourceType === "Sponsor";

      await fetch(`${baseUrl}/api/proposals/${pitch.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pitch.name,
          description: pitch.description,
          venue: pitch.venue,
          budget: pitch.budget
        })
      }).catch(() => null);

      setProposalsList(prev => prev.map(p => p.id === pitch.id ? { ...p, status: "Approved" } : p));
      
      const newEvt: EventItem = {
        id: `evt-appr-${pitch.id}`,
        title: pitch.name,
        category: pitch.proposalType.includes("Workshop") ? "Workshops" : (isSponsor ? "Plays" : "Meetups"),
        date: "Autumn 2026",
        venue: pitch.venue,
        timeRange: "17:30 - 20:00",
        status: "Scheduled",
        is_past: false,
        description: pitch.description,
        is_sponsored: isSponsor,
        sponsor_name: isSponsor ? pitch.submitter?.name : "",
        sponsor_amount: isSponsor ? pitch.budget : "",
        patronage_open: !isSponsor,
        donations_collected: "₹0",
        target_budget: pitch.budget || "₹25,000",
        auditionCount: 0,
        applicantCount: 0,
        volunteerCount: 0
      };
      setEventsList(prev => [newEvt, ...prev]);
      setActionSuccessMsg(`Pitch '${pitch.name}' approved and scheduled to Upcoming Events.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Error quick approving pitch:", err);
    }
  };

  // Reject / Decline Pitch
  const handleRejectPitch = async (pitchId: number) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      await fetch(`${baseUrl}/api/proposals/${pitchId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }).catch(() => null);

      setProposalsList(prev => prev.map(p => p.id === pitchId ? { ...p, status: "Rejected" } : p));
      setActionSuccessMsg("Proposal request declined.");
      setTimeout(() => setActionSuccessMsg(null), 4000);
      if (editingPitch && editingPitch.id === pitchId) {
        setEditingPitch(null);
      }
    } catch (err) {
      console.error("Error rejecting pitch:", err);
    }
  };

  // Handle Patron Donation Pledge
  const handlePledgeDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForDonation) return;

    const numericPledge = parseInt(donorPledgeAmount.replace(/[^0-9]/g, "") || "0", 10);
    const currentCollected = parseInt((selectedEventForDonation.donations_collected || "0").replace(/[^0-9]/g, "") || "0", 10);
    const newTotal = `₹${(currentCollected + numericPledge).toLocaleString("en-IN")}`;

    setEventsList(prev => prev.map(ev => ev.id === selectedEventForDonation.id ? { ...ev, donations_collected: newTotal } : ev));
    setActionSuccessMsg(`Pledge of ${donorPledgeAmount} from ${donorName} logged for '${selectedEventForDonation.title}'.`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
    setSelectedEventForDonation(null);
  };

  // Filtering Events
  const filteredEvents = eventsList.filter(ev => {
    const matchesSearch = (ev.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ev.venue || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || ev.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Filtering Pitches
  const filteredPitches = proposalsList.filter(p => {
    const pTitle = (p.name || p.title || "").toLowerCase();
    const pSubmitter = (p.submitter?.name || "").toLowerCase();
    const pDesc = (p.description || "").toLowerCase();
    const matchesSearch = pTitle.includes(searchQuery.toLowerCase()) || 
                          pSubmitter.includes(searchQuery.toLowerCase()) ||
                          pDesc.includes(searchQuery.toLowerCase());

    const isMember = (p.proposalType || "").toLowerCase().includes("member") || p.sourceType === "Member";
    const isSponsor = (p.proposalType || "").toLowerCase().includes("sponsor") || (p.proposalType || "").toLowerCase().includes("ad") || p.sourceType === "Sponsor";

    const matchesSource = 
      pitchSourceFilter === "all" ? true :
      pitchSourceFilter === "member" ? isMember :
      isSponsor;

    const pStatus = (p.status || "pending").toLowerCase();
    const matchesStatus = 
      pitchStatusFilter === "all" ? true :
      pitchStatusFilter === "pending" ? (pStatus === "pending" || pStatus === "reviewing") :
      pitchStatusFilter === "approved" ? (pStatus === "approved") :
      (pStatus === "rejected" || pStatus === "declined");

    return matchesSearch && matchesSource && matchesStatus;
  });

  const memberPitchesCount = proposalsList.filter(p => (p.proposalType || "").toLowerCase().includes("member") || p.sourceType === "Member").length;
  const sponsorPitchesCount = proposalsList.filter(p => (p.proposalType || "").toLowerCase().includes("sponsor") || (p.proposalType || "").toLowerCase().includes("ad") || p.sourceType === "Sponsor").length;

  const getEventPositions = (eventTitle: string) => {
    return allPositions.filter(p => 
      (p.production_name || "").toLowerCase().includes(eventTitle.toLowerCase()) ||
      eventTitle.toLowerCase().includes((p.production_name || "").toLowerCase())
    );
  };

  const getEventApplications = (eventTitle: string) => {
    return allApplications.filter(a => 
      (a.production_name || "").toLowerCase().includes(eventTitle.toLowerCase()) ||
      eventTitle.toLowerCase().includes((a.production_name || "").toLowerCase())
    );
  };

  const getEventVolunteers = (eventTitle: string, playId?: number) => {
    return allVolunteers.filter(v => 
      (playId && String(v.play_id) === String(playId)) ||
      (v.play_title || "").toLowerCase().includes(eventTitle.toLowerCase()) ||
      eventTitle.toLowerCase().includes((v.play_title || "").toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 md:px-8 font-sans text-[#5C3B37] selection:bg-[#8C241E]/20">
      
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FAF2EE] text-[#2A1816] px-5 py-3.5 rounded-2xl border border-emerald-700/30 shadow-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
          <span className="text-xs font-mono font-bold">{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-[#8C5A54] hover:text-[#2A1816] cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editorial Header */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
              <Calendar className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>SOCIETY REPERTOIRE & OPERATIONAL DESK</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Events & Season Management
            </h1>
            <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-serif italic">
              Oversee upcoming productions, manage member event pitches and funded sponsor partnerships, assign budgets, and open society donation patronage.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#FAF2EE] p-1.5 rounded-full border border-[#DCBAB2] shadow-xs shrink-0 self-start md:self-auto">
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calendar' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Upcoming Events ({eventsList.length})
            </button>
            <button 
              onClick={() => setActiveTab("pitches")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'pitches' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Pitches & Proposals ({proposalsList.length})
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: UPCOMING EVENT ROSTER */}
      {activeTab === "calendar" && (
        <section className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#DCBAB2]/60 pb-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8C5A54] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search upcoming plays, workshops, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl text-xs text-[#2A1816] placeholder-[#8C5A54] focus:outline-hidden focus:border-[#8C241E]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
              {["All", "Plays", "Workshops", "Meetups"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    categoryFilter === cat
                      ? "bg-[#8C241E] text-[#FDF8F7] border border-[#A6352F] shadow-xs"
                      : "bg-[#FAF2EE] text-[#5C3B37] hover:bg-[#EEDBD5] border border-[#DCBAB2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
              
              <button
                onClick={fetchData}
                className="p-2 rounded-full border border-[#DCBAB2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] transition-all cursor-pointer shrink-0"
                title="Refresh upcoming events"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Events Grid (Clean & Structured with No Overflow or Emojis) */}
          {loading ? (
            <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm">
              Loading society productions, auditions, and volunteer calls...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm space-y-3">
              <p>No upcoming events match your search criteria.</p>
              <button
                onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}
                className="text-xs font-mono text-[#8C241E] font-bold uppercase tracking-wider underline cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map(ev => {
                const eventPositions = getEventPositions(ev.title);
                const eventApps = getEventApplications(ev.title);
                const eventVols = getEventVolunteers(ev.title, ev.play_id);

                return (
                  <div 
                    key={ev.id} 
                    className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-3xl p-6 sm:p-7 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between group space-y-5 shadow-xs"
                  >
                    <div className="space-y-3.5">
                      {/* Top Category & Status Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-[#DCBAB2]/50 pb-3">
                        <span className="text-[11px] font-mono text-[#8C5A54] uppercase tracking-wider font-semibold truncate">
                          {ev.category} • {ev.date}
                        </span>

                        {ev.is_sponsored ? (
                          <span className="inline-block px-2.5 py-0.5 bg-amber-700/15 text-amber-950 border border-amber-700/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                            Sponsored: {ev.sponsor_name || "Partner"}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-700/15 text-emerald-950 border border-emerald-700/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                            Society Run
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h3 className="font-serif text-2xl text-[#2A1816] leading-snug font-normal group-hover:text-[#8C241E] transition-colors break-words">
                        {ev.title}
                      </h3>

                      {/* Description */}
                      {ev.description && (
                        <p className="text-xs text-[#5C3B37] font-light leading-relaxed line-clamp-2">
                          {ev.description}
                        </p>
                      )}

                      {/* Unified Calm Editorial Specifications Panel */}
                      <div className="bg-[#F5EAE6] p-3.5 rounded-2xl border border-[#DEBEB7] space-y-2 text-xs font-mono text-[#5C3B37]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[#8C5A54] text-[10px] uppercase font-bold">Venue</span>
                          <span className="text-[#2A1816] font-medium truncate">{ev.venue}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#DCBAB2]/40">
                          <span className="text-[#8C5A54] text-[10px] uppercase font-bold">
                            {ev.is_sponsored ? "Sponsorship" : "Patronage"}
                          </span>
                          {ev.is_sponsored ? (
                            <span className="font-bold text-amber-950">{ev.sponsor_amount || "Fully Funded"}</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-950">{ev.donations_collected || "₹0"} / {ev.target_budget || "₹25,000"}</span>
                              <button
                                onClick={() => setSelectedEventForDonation(ev)}
                                className="text-[10px] font-bold text-[#8C241E] underline hover:text-[#731B16] cursor-pointer"
                              >
                                Donate
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#DCBAB2]/40 text-[11px]">
                          <span className="text-[#8C5A54] text-[10px] uppercase font-bold">Roster</span>
                          <span className="text-[#2A1816]">
                            {eventPositions.length} Roles ({eventApps.length} Applicants) • {eventVols.length} Crew
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS - ALL IN ONE CLEAN SINGLE LINE WITH NO ICONS */}
                    <div className="pt-3.5 border-t border-[#DCBAB2]/60 flex items-center gap-1.5 w-full flex-nowrap">
                      <button
                        onClick={() => setSelectedEventForAuditions(ev)}
                        className="flex-1 py-2 px-1 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs border border-[#A6352F] truncate"
                        title="View open auditions & candidate reels"
                      >
                        Auditions ({eventApps.length})
                      </button>

                      <button
                        onClick={() => setSelectedEventForVolunteers(ev)}
                        className="flex-1 py-2 px-1 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                        title="View backstage crew applications"
                      >
                        Crew ({eventVols.length})
                      </button>

                      <button
                        onClick={() => handleOpenScriptPreview(ev)}
                        className="flex-1 py-2 px-1 rounded-full border border-[#D5AAA2] bg-[#F5EAE6] hover:bg-[#EEDBD5] text-[#8C241E] text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                        title="Preview Society Playbook Script"
                      >
                        Script
                      </button>

                      <button
                        onClick={() => handleOpenDetails(ev)}
                        className="flex-1 py-2 px-1 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                        title="View detailed production dossier"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleOpenEdit(ev)}
                        className="flex-1 py-2 px-1 rounded-full border border-[#D5AAA2] bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#2A1816] hover:text-[#8C241E] text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                        title="Edit upcoming production metadata & details"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PITCHES & PROPOSALS (Editorial Cards for Member & Sponsor Requests) */}
      {activeTab === "pitches" && (
        <section className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCBAB2]/60 pb-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8C5A54] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pitches by title, submitter, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl text-xs text-[#2A1816] placeholder-[#8C5A54] focus:outline-hidden focus:border-[#8C241E]"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Source Tabs */}
              <div className="flex items-center gap-1 bg-[#FAF2EE] p-1 rounded-full border border-[#DCBAB2] shadow-xs">
                <button
                  onClick={() => setPitchSourceFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    pitchSourceFilter === "all"
                      ? "bg-[#8C241E] text-[#FDF8F7]"
                      : "text-[#5C3B37] hover:bg-[#EEDBD5]"
                  }`}
                >
                  All ({proposalsList.length})
                </button>
                <button
                  onClick={() => setPitchSourceFilter("member")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    pitchSourceFilter === "member"
                      ? "bg-[#8C241E] text-[#FDF8F7]"
                      : "text-[#5C3B37] hover:bg-[#EEDBD5]"
                  }`}
                >
                  Member Pitches ({memberPitchesCount})
                </button>
                <button
                  onClick={() => setPitchSourceFilter("sponsor")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    pitchSourceFilter === "sponsor"
                      ? "bg-[#8C241E] text-[#FDF8F7]"
                      : "text-[#5C3B37] hover:bg-[#EEDBD5]"
                  }`}
                >
                  Sponsor Ads ({sponsorPitchesCount})
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={pitchStatusFilter}
                onChange={(e) => setPitchStatusFilter(e.target.value as any)}
                className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-full px-3.5 py-1.5 text-xs font-mono text-[#2A1816] font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Declined</option>
              </select>
            </div>
          </div>

          {/* Pitches Cards Grid */}
          {filteredPitches.length === 0 ? (
            <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm space-y-2">
              <p>No proposals match your current filter settings.</p>
              <button
                onClick={() => { setSearchQuery(""); setPitchSourceFilter("all"); setPitchStatusFilter("all"); }}
                className="text-xs font-mono text-[#8C241E] font-bold uppercase underline cursor-pointer"
              >
                Reset Pitch Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPitches.map(pitch => {
                const isMember = (pitch.proposalType || "").toLowerCase().includes("member") || pitch.sourceType === "Member";
                const isApproved = (pitch.status || "").toLowerCase() === "approved";
                const isRejected = (pitch.status || "").toLowerCase() === "rejected" || (pitch.status || "").toLowerCase() === "declined";

                return (
                  <div
                    key={pitch.id}
                    className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-3xl p-6 sm:p-7 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-5 shadow-xs group"
                  >
                    <div className="space-y-3.5">
                      {/* Top Header: Submitter & Type Tag */}
                      <div className="flex items-center justify-between gap-3 border-b border-[#DCBAB2]/50 pb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] text-[#8C241E] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {pitch.submitter?.initials || (isMember ? "M" : "SP")}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm text-[#2A1816] font-normal truncate">
                              {pitch.submitter?.name || "Ensemble Member"}
                            </h4>
                            <p className="text-[10px] font-mono text-[#8C5A54] truncate">
                              {pitch.contact_email || pitch.submitter?.email || ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isMember 
                              ? "bg-[#EEDBD5] text-[#8C241E] border-[#D5AAA2]"
                              : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                          }`}>
                            {isMember ? "Member Pitch" : "Sponsor Pitch"}
                          </span>

                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isApproved
                              ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                              : isRejected
                              ? "bg-stone-200 text-stone-600 border-stone-300"
                              : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                          }`}>
                            {pitch.status || "Pending"}
                          </span>
                        </div>
                      </div>

                      {/* Pitch Title */}
                      <h3 className="font-serif text-2xl text-[#2A1816] leading-snug font-normal group-hover:text-[#8C241E] transition-colors">
                        {pitch.name || pitch.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#5C3B37] font-light leading-relaxed line-clamp-2">
                        {pitch.description}
                      </p>

                      {/* Specifications Panel */}
                      <div className="bg-[#F5EAE6] p-3.5 rounded-2xl border border-[#DEBEB7] space-y-2 text-xs font-mono text-[#5C3B37]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[#8C5A54] text-[10px] uppercase font-bold">Venue</span>
                          <span className="text-[#2A1816] font-medium truncate">{pitch.venue || pitch.location_or_link || "SAC Rehearsal Studio"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#DCBAB2]/40">
                          <span className="text-[#8C5A54] text-[10px] uppercase font-bold">Budget & Terms</span>
                          <span className="text-[#2A1816] font-bold text-emerald-950">{pitch.budget || "₹25,000"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls in Single Line */}
                    <div className="pt-3.5 border-t border-[#DCBAB2]/60 flex items-center gap-2 w-full flex-nowrap">
                      <button
                        onClick={() => handleOpenEditPitch(pitch)}
                        className="flex-1 py-2 px-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                        title="Review pitch details, adjust date/venue/budget, and approve to upcoming events"
                      >
                        Review & Edit
                      </button>

                      {!isApproved && (
                        <button
                          onClick={() => handleQuickApprove(pitch)}
                          className="flex-1 py-2 px-2 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs border border-[#A6352F] truncate"
                          title="Quick approve and schedule to upcoming events"
                        >
                          Approve
                        </button>
                      )}

                      {!isApproved && !isRejected && (
                        <button
                          onClick={() => handleRejectPitch(pitch.id)}
                          className="py-2 px-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                          title="Decline proposal"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* MODAL: REVIEW & EDIT PITCH BEFORE PASSING TO UPCOMING EVENTS */}
      {editingPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEditingPitch(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8 border-b border-[#DCBAB2]/70 pb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                Directorial Proposal Review & Adjustment
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                Review & Edit Pitch Details
              </h2>
              <p className="text-xs text-[#5C3B37]">
                Submitted by <strong className="text-[#2A1816]">{editingPitch.submitter?.name || "Ensemble Member"}</strong> ({editingPitch.contact_email}). You can adjust the scheduled date, venue, sponsorship status, and description before publishing to the Upcoming Events roster.
              </p>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleApproveAndPublishPitch} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Event Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] cursor-pointer"
                  >
                    <option value="Workshops">Workshops & Masterclasses</option>
                    <option value="Meetups">Meetups & Script Readings</option>
                    <option value="Plays">Stage Production Preview</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.event_date}
                    onChange={(e) => setEditFormData({ ...editFormData, event_date: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Assigned Venue</label>
                  <input
                    type="text"
                    required
                    value={editFormData.venue}
                    onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Budget / Terms</label>
                  <input
                    type="text"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                  />
                </div>
              </div>

              {/* Sponsorship / Donation Mode Toggle */}
              <div className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8C5A54] uppercase tracking-wider block">Funding & Sponsorship Mode</span>
                  <span className="text-[10px] text-[#8C5A54]">Governs public card badge & donation option</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    !editFormData.is_sponsored 
                      ? "bg-[#EEDBD5] border-[#8C241E] text-[#2A1816]" 
                      : "bg-[#F5EAE6] border-[#DCBAB2] text-[#5C3B37]"
                  }`}>
                    <input
                      type="radio"
                      name="is_sponsored"
                      checked={!editFormData.is_sponsored}
                      onChange={() => setEditFormData({ ...editFormData, is_sponsored: false })}
                      className="accent-[#8C241E]"
                    />
                    <div>
                      <span className="font-bold block">Member / Society Event</span>
                      <span className="text-[10px] text-[#8C5A54]">Unfunded • Enables society donation button</span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    editFormData.is_sponsored 
                      ? "bg-[#EEDBD5] border-[#8C241E] text-[#2A1816]" 
                      : "bg-[#F5EAE6] border-[#DCBAB2] text-[#5C3B37]"
                  }`}>
                    <input
                      type="radio"
                      name="is_sponsored"
                      checked={editFormData.is_sponsored}
                      onChange={() => setEditFormData({ ...editFormData, is_sponsored: true })}
                      className="accent-[#8C241E]"
                    />
                    <div>
                      <span className="font-bold block">Sponsor Funded Event</span>
                      <span className="text-[10px] text-[#8C5A54]">Funded by corporate or brand partner</span>
                    </div>
                  </label>
                </div>

                {editFormData.is_sponsored && (
                  <div className="pt-2">
                    <label className="font-bold text-[#8C5A54] uppercase tracking-wider block pb-1">Sponsor Brand Name</label>
                    <input
                      type="text"
                      value={editFormData.sponsor_name}
                      onChange={(e) => setEditFormData({ ...editFormData, sponsor_name: e.target.value })}
                      placeholder="e.g. Red Bull India / FabIndia"
                      className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Description & Agenda</label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl p-3 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] leading-relaxed font-sans font-normal"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#DCBAB2]/70 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleRejectPitch(editingPitch.id)}
                  className="px-4 py-2.5 rounded-full border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Decline Pitch
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPitch(null)}
                    className="px-4 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingDecision}
                    className="px-6 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#A6352F] disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-[#FFD0CC]" />
                    <span>{submittingDecision ? "Publishing..." : "Approve & Publish to Upcoming Events"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PATRONAGE & SOCIETY DONATION DESK */}
      {selectedEventForDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEventForDonation(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Header */}
            <div className="space-y-1 pr-8 border-b border-[#DCBAB2]/70 pb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                Society Patronage & Production Funding
              </span>
              <h2 className="text-2xl font-serif text-[#2A1816] tracking-tight font-normal">
                {selectedEventForDonation.title}
              </h2>
              <p className="text-xs text-[#5C3B37]">
                Support collegiate theatre production expenses, props crafting, and hall rental through alumni and member patronage.
              </p>
            </div>

            {/* Donation Stats */}
            <div className="p-4 bg-[#FAF2EE] rounded-2xl border border-[#DCBAB2] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#8C5A54] uppercase font-bold">Collected So Far:</span>
                <span className="text-emerald-950 font-bold text-base">{selectedEventForDonation.donations_collected || "₹0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8C5A54] uppercase font-bold">Estimated Production Target:</span>
                <span className="text-[#2A1816] font-bold">{selectedEventForDonation.target_budget || "₹25,000"}</span>
              </div>
            </div>

            {/* Pledge Form */}
            <form onSubmit={handlePledgeDonation} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Pledge / Patron Name</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Pledge Donation Amount</label>
                <input
                  type="text"
                  required
                  value={donorPledgeAmount}
                  onChange={(e) => setDonorPledgeAmount(e.target.value)}
                  className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEventForDonation(null)}
                  className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#A6352F]"
                >
                  <Heart className="w-4 h-4 text-[#FFD0CC]" />
                  <span>Log Patron Pledge</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDITIONS & CANDIDATES MODAL */}
      {selectedEventForAuditions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEventForAuditions(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8 border-b border-[#DCBAB2]/70 pb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                Audition & Casting Calls
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                {selectedEventForAuditions.title}
              </h2>
              <p className="text-xs text-[#5C3B37]">
                Review open role quotas and evaluate submitted actor/crew audition reels.
              </p>
            </div>

            {/* Sub-section 1: Open Calling Roles */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>Open Audition Roles ({getEventPositions(selectedEventForAuditions.title).length})</span>
              </h3>

              {getEventPositions(selectedEventForAuditions.title).length === 0 ? (
                <div className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-xs font-serif italic text-[#8C5A54]">
                  No specific calling positions logged for this event. You can create roles in the Auditions Management portal.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getEventPositions(selectedEventForAuditions.title).map(pos => (
                    <div key={pos.id} className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-mono uppercase font-bold text-[#8C241E] block">
                            {pos.role_category}
                          </span>
                          <h4 className="font-serif text-base text-[#2A1816] font-normal leading-tight">
                            {pos.role_name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-[#EEDBD5] px-2 py-0.5 rounded-full text-[#8C241E] shrink-0">
                          {pos.slots_available} Slots
                        </span>
                      </div>
                      {pos.requirements && (
                        <p className="text-[11px] text-[#6E4742] line-clamp-2">
                          <strong>Req:</strong> {pos.requirements}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-section 2: Candidate Applications */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Submitted Candidate Applications ({getEventApplications(selectedEventForAuditions.title).length})</span>
                </h3>
                <Link
                  to="/maintainer-auditions"
                  className="text-xs font-mono font-bold text-[#8C241E] hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>Open Full Casting Desk</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {getEventApplications(selectedEventForAuditions.title).length === 0 ? (
                <div className="p-6 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-center text-xs font-serif italic text-[#8C5A54]">
                  No audition reels submitted yet for this production.
                </div>
              ) : (
                <div className="space-y-3">
                  {getEventApplications(selectedEventForAuditions.title).map(app => (
                    <div key={app.id} className="p-4 sm:p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCBAB2]/40 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg text-[#2A1816] font-normal">{app.candidate_name}</span>
                            <span className="text-[10px] font-mono text-[#8C5A54]">({app.applicant_email || app.roll_number})</span>
                          </div>
                          <span className="text-xs font-mono text-[#8C241E] font-semibold">Applying for: {app.role_name}</span>
                        </div>

                        {/* Status update controls */}
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status || "Under Review"}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            className="bg-[#F5EAE6] border border-[#D5AAA2] rounded-xl px-3 py-1.5 text-xs font-mono text-[#2A1816] font-semibold focus:outline-hidden focus:border-[#8C241E] cursor-pointer"
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="Audition Scheduled">Audition Scheduled</option>
                            <option value="Selected">Selected</option>
                            <option value="Waitlisted">Waitlisted</option>
                            <option value="Declined">Declined</option>
                          </select>
                        </div>
                      </div>

                      {/* Statement / Video */}
                      <div className="space-y-1 text-xs text-[#5C3B37]">
                        {app.audition_statement && (
                          <p className="font-light italic text-[#6E4742]">"{app.audition_statement}"</p>
                        )}
                        {app.video_url && (
                          <p className="flex items-center gap-1.5 text-[#8C241E] font-mono text-[11px] pt-1">
                            <Video className="w-3.5 h-3.5" />
                            <a href={app.video_url} target="_blank" rel="noreferrer" className="underline font-bold">
                              View Audition Reel / Slate
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VOLUNTEER REQUESTS MODAL */}
      {selectedEventForVolunteers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEventForVolunteers(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8 border-b border-[#DCBAB2]/70 pb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                Production Crew Volunteers
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                Volunteer Calls for {selectedEventForVolunteers.title}
              </h2>
              <p className="text-xs text-[#5C3B37]">
                Review student crew applications for backstage lighting, stagehands, makeup, and front-of-house management.
              </p>
            </div>

            {/* Volunteer List */}
            {getEventVolunteers(selectedEventForVolunteers.title, selectedEventForVolunteers.play_id).length === 0 ? (
              <div className="p-8 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-center text-xs font-serif italic text-[#8C5A54] space-y-2">
                <p>No volunteer applications submitted yet for this event.</p>
                <p className="text-[11px] font-mono text-[#8C5A54]">Member applications through the portal will appear here immediately.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {getEventVolunteers(selectedEventForVolunteers.title, selectedEventForVolunteers.play_id).map(vol => (
                  <div 
                    key={vol.id}
                    className="p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-3 hover:border-[#B32D25]/40 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCBAB2]/40 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg text-[#2A1816] font-normal">{vol.applicant_name}</h4>
                          <span className="text-[10px] font-mono text-[#8C5A54]">({vol.applicant_email})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono pt-0.5">
                          <span className="text-[#8C241E] font-bold uppercase">{vol.department}</span>
                          <span className="text-[#8C5A54]">•</span>
                          <span className="text-[#5C3B37]">{vol.phone || "No phone provided"}</span>
                        </div>
                      </div>

                      {/* Status pill & quick decision buttons */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          vol.status === "Approved"
                            ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                            : vol.status === "Declined"
                            ? "bg-stone-200 text-stone-600 border-stone-300"
                            : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                        }`}>
                          {vol.status || "Pending Review"}
                        </span>

                        {vol.status !== "Approved" && (
                          <button
                            onClick={() => handleUpdateVolunteerStatus(vol.id, "Approved")}
                            className="px-3 py-1 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border border-[#A6352F]"
                            title="Approve volunteer for this crew department"
                          >
                            <UserCheck className="w-3 h-3 text-[#FFD0CC]" />
                            <span>Approve</span>
                          </button>
                        )}

                        {vol.status !== "Declined" && (
                          <button
                            onClick={() => handleUpdateVolunteerStatus(vol.id, "Declined")}
                            className="px-3 py-1 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#6E4742] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            title="Decline volunteer application"
                          >
                            <UserX className="w-3 h-3 text-[#8C241E]" />
                            <span>Decline</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Statement & Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {vol.availability && (
                        <div className="bg-[#F5EAE6] p-2.5 rounded-xl border border-[#DEBEB7]">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#8C5A54] block">Availability</span>
                          <span className="text-[#5C3B37]">{vol.availability}</span>
                        </div>
                      )}
                      {vol.experience && (
                        <div className="bg-[#F5EAE6] p-2.5 rounded-xl border border-[#DEBEB7]">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#8C5A54] block">Past Experience</span>
                          <span className="text-[#5C3B37]">{vol.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCRIPT PREVIEW MODAL */}
      <ScriptPreviewModal
        open={scriptModalOpen}
        onClose={() => setScriptModalOpen(false)}
        script={previewScript}
      />

      {/* PRODUCTION FULL DOSSIER DETAIL MODAL */}
      <ProductionDetailModal
        open={Boolean(selectedDetailProd)}
        onClose={() => setSelectedDetailProd(null)}
        production={selectedDetailProd}
        onOpenScript={(title) => {
          const pb = getPlaybookForTitle(title);
          setPreviewScript(pb);
          setScriptModalOpen(true);
        }}
      />

      {/* PRODUCTION MAINTAINER EDIT MODAL */}
      <ProductionEditModal
        open={Boolean(selectedEditProd)}
        onClose={() => setSelectedEditProd(null)}
        production={selectedEditProd}
        onSuccess={handleProductionEditSuccess}
      />
    </div>
  );
}
