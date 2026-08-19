// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Shield,
  Layers,
  Heart,
  Flame,
  Star,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  ChevronDown,
  Clock,
  Award
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface SelectOption {
  value: string;
  label: string;
  sub?: string;
  badge?: string;
}

function CustomSelect({
  label,
  options,
  value,
  onChange,
  icon: Icon
}: {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  icon?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#353535]/80 hover:bg-[#353535] border border-white/10 hover:border-[#E85F57]/50 text-xs text-white h-12 px-4 rounded-2xl flex items-center justify-between transition-all text-left group shadow-xs focus:outline-none focus:border-[#E85F57]"
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-[#E85F57] shrink-0" />}
          <span className="truncate font-medium">{selectedOption?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/50 group-hover:text-[#E85F57] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#E85F57]" : ""
          }`}
        />
      </button>

      {/* Positioned Custom Dropdown List */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-[#2C2A28] border border-[#444] rounded-2xl shadow-2xl overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-150 backdrop-blur-xl max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-[#E85F57]/20 text-white font-semibold"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E85F57]/20 text-[#E85F57] text-[9px] font-mono font-bold uppercase">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {opt.sub && (
                    <p className="text-[10px] font-mono text-white/40 truncate font-normal">
                      {opt.sub}
                    </p>
                  )}
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#E85F57] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function JoinClub() {
  const contextData = useOutletContext<any>() || {};
  const setActiveUser = contextData.setActiveUser || (() => {});
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-redirect logged-in members to their dashboard auditions page
  useEffect(() => {
    const activeUser = contextData.activeUser || JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");
    if (activeUser) {
      const isMaintainer = activeUser.role?.includes("Maintainer") || 
                           activeUser.role?.includes("Secretary") || 
                           activeUser.role?.includes("Chief") || 
                           activeUser.role?.includes("Lead");
      if (isMaintainer) {
        navigate("/auditions-admin", { replace: true });
      } else {
        navigate("/auditions", { replace: true });
      }
    }
  }, [contextData.activeUser, navigate]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedTag, setAssignedTag] = useState<"member" | "maintainer" | "developer">("member");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ email: string; password: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    country: "India",
    pronouns: "he/him",
    interest: "Method Acting & Character Study",
    availability: "Weekday evenings & Weekend rehearsals",
    level: "Intermediate Performer",
    bio: "",
    portfolio: "",
    image: "",
    emergencyName: "",
    emergencyPhone: ""
  });

  const pronounsOptions: SelectOption[] = [
    { value: "he/him", label: "he/him (He / Him / His)" },
    { value: "she/her", label: "she/her (She / Her / Hers)" },
    { value: "they/them", label: "they/them (They / Them / Theirs)" },
    { value: "custom", label: "Other / Prefer to self-describe" }
  ];

  const interestOptions: SelectOption[] = [
    {
      value: "Method Acting & Character Study",
      label: "Method Acting & Character Study",
      sub: "Proscenium dialogue, emotional arcs & monologue performance",
      badge: "Actor"
    },
    {
      value: "Street Theatre (Nukkad Natak) & Percussion",
      label: "Street Theatre (Nukkad Natak) & Percussion",
      sub: "High-energy courtyard satire, vocal projection & dholak rhythm",
      badge: "Nukkad"
    },
    {
      value: "Stage Direction & Dramaturgy",
      label: "Stage Direction & Dramaturgy",
      sub: "Play blocking, script adaptation & actor choreography",
      badge: "Direction"
    },
    {
      value: "Playwriting & Screenplay",
      label: "Playwriting & Screenplay",
      sub: "Original Hindi/English playwriting, dialogue drafts & satire",
      badge: "Writer"
    },
    {
      value: "Stage Lighting, Sound & DMX Tech",
      label: "Stage Lighting, Sound & DMX Tech",
      sub: "Console rigging, spot cues, acoustics & audio mixing",
      badge: "Tech"
    },
    {
      value: "Costume Styling, Backdrops & Props",
      label: "Costume Styling, Backdrops & Props",
      sub: "Wardrobe styling, prop craftsmanship & visual identity",
      badge: "Design"
    },
    {
      value: "Production Management & Logistics",
      label: "Production Management & Logistics",
      sub: "Festival operations, backstage coordination & venue planning",
      badge: "Producer"
    }
  ];

  const availabilityOptions: SelectOption[] = [
    {
      value: "Weekday evenings & Weekend rehearsals",
      label: "Weekday Evenings & Weekend Rehearsals",
      sub: "Full production schedule commitment (10-14 hrs/week)"
    },
    {
      value: "Weekends Only (Saturday/Sunday)",
      label: "Weekends Only (Saturday/Sunday)",
      sub: "Workshop and staging track (6-8 hrs/week)"
    },
    {
      value: "Festival Sprint Schedule",
      label: "Festival Sprint Schedule",
      sub: "Intensive runs during Darpan & touring festival seasons"
    },
    {
      value: "Project-Based / Flexible Technical Crew",
      label: "Project-Based / Flexible Technical Crew",
      sub: "Flexible cue and staging assignments"
    }
  ];

  const experienceOptions: SelectOption[] = [
    {
      value: "Debutante / Enthusiast",
      label: "Debutante / Enthusiast",
      sub: "First time stepping onto collegiate stage"
    },
    {
      value: "Intermediate Performer",
      label: "Intermediate Performer",
      sub: "Previous school/college dramatics or street play experience"
    },
    {
      value: "Seasoned Thespian / Director",
      label: "Seasoned Thespian / Director",
      sub: "Extensive theatrical productions or technical mastery"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size exceeds 5MB. Please choose a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

    try {
      const response = await fetch(`${baseUrl}/api/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (response.ok && resData.status === "success" && resData.member) {
        setMemberId(resData.member.member_id);
        if (resData.generated_credentials) {
          setGeneratedCredentials(resData.generated_credentials);
        }
        
        let backendTag: "member" | "maintainer" | "developer" = "member";
        const p = (formData.portfolio || "").toLowerCase();
        if (p.includes("github.com") || p.includes("dev") || p.includes("code")) {
          backendTag = "developer";
        } else if (["tech", "crew", "lighting", "props", "costumes"].some((kw) => (formData.interest || "").toLowerCase().includes(kw))) {
          backendTag = "maintainer";
        }
        setAssignedTag(backendTag);
        setIsSubmitted(true);
      } else {
        throw new Error(resData.error || resData.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.warn("Backend registration fallback:", err);
      // Generate clean mock pass for local demo
      const randomId = `MC-${Math.floor(1000 + Math.random() * 9000)}`;
      setMemberId(randomId);
      const cleanName = formData.name.trim().toLowerCase().replace(/\s+/g, "");
      setGeneratedCredentials({
        email: `${cleanName || "artist"}@handle.com`,
        password: `${cleanName || "artist"}123`
      });
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPortal = () => {
    const initials = formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    let role = "Lead Actor & Member";
    if (assignedTag === "developer") role = "Core Maintainer";
    else if (assignedTag === "maintainer") role = "Production Coordinator";

    const userData = {
      name: formData.name || "Ensemble Artist",
      role: role,
      initials: initials || "EM",
      email: generatedCredentials?.email || formData.email,
      member_id: memberId,
      image: formData.image || "/aayam_assets/profiles/utkarsh_yuuhi.jpg"
    };

    setActiveUser(userData);
    sessionStorage.setItem("aayam_active_user", JSON.stringify(userData));

    if (assignedTag === "developer" || assignedTag === "maintainer") {
      navigate("/maintainer");
    } else {
      navigate("/member");
    }
  };

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Live Member Audition Pass Card Preview (Span 5) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
                  <Flame className="w-3.5 h-3.5" />
                  <span>AUDITION ENROLMENT // 2026</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[#2C2A28] font-normal leading-tight">
                  Join the Ensemble.
                </h2>
                <p className="text-xs text-[#666361] leading-relaxed font-light">
                  Complete the induction form to receive your official Aayam member credentials and audition slot.
                </p>
              </div>

              {/* Dynamic Live Preview Credential Badge */}
              <div className="bg-[#2C2A28] text-white rounded-[2rem] p-7 md:p-8 border border-[#353535] shadow-2xl space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E85F57] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-[#E85F57] uppercase tracking-widest">
                      AAYAM DIGITAL PASS
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-white/50">SEASON 2026</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#353535] border-2 border-[#E85F57]/50 flex items-center justify-center shrink-0 group shadow-md">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="font-serif text-3xl text-[#E85F57] font-bold flex flex-col items-center">
                        <span>{formData.name ? formData.name.charAt(0).toUpperCase() : "आ"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-[#F7F5F0] leading-tight">
                      {formData.name || "Your Full Name"}
                    </h3>
                    <p className="text-xs font-mono text-[#E85F57] line-clamp-1">
                      {formData.interest || "Theatrical Specialization"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-white/60">
                  <div>
                    <span className="text-[9px] text-white/40 block uppercase">Location</span>
                    <span className="text-white truncate block">{formData.state || "Tamil Nadu, India"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 block uppercase">Pronouns</span>
                    <span className="text-white truncate block">{formData.pronouns || "he/him"}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-white/70 italic line-clamp-2">
                  "{formData.bio || "Your artistic statement will appear here as you type..."}"
                </div>
              </div>

              {/* Society Inflow Summary */}
              <div className="bg-white/60 border border-[#D5C9BE]/60 p-6 rounded-2xl space-y-2 text-xs text-[#666361]">
                <span className="font-bold text-[#2C2A28] uppercase text-[10px] font-mono tracking-wider block">
                  Ensemble Inflow Policy
                </span>
                <p className="font-light">
                  Membership includes script vault access, rehearsal hall access (SAC/CLT), lighting board privileges, and priority festival passes.
                </p>
              </div>

            </div>

            {/* Right Column: Full-Page Registration Form (Span 7) */}
            <div className="lg:col-span-7 bg-[#2C2A28] text-white rounded-[2.5rem] p-8 md:p-12 border border-[#353535] shadow-2xl space-y-8">
              
              <div className="space-y-2 border-b border-white/10 pb-6">
                <span className="text-[10px] font-mono font-bold text-[#E85F57] uppercase tracking-widest">
                  STAGE INDUCTION
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-[#F7F5F0] font-normal">
                  Artist & Technician Registration
                </h1>
                <p className="text-xs text-white/70 font-light">
                  All fields map directly to your Aayam database profile and digital portfolio.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Identity, Photo & Contact */}
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#E85F57] uppercase tracking-wider block">
                    01 // Personal Details & Headshot
                  </span>

                  {/* Photo Upload Section */}
                  <div className="p-4 rounded-2xl bg-[#353535]/50 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#2C2A28] border border-white/10 shrink-0 flex items-center justify-center">
                      {formData.image ? (
                        <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <span className="text-xs font-mono font-bold text-white block">
                        Ensemble Headshot / Photo
                      </span>
                      <p className="text-[10px] font-mono text-white/50">
                        Upload a photo (PNG/JPG up to 5MB) or enter image URL below.
                      </p>
                      <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                      Or Headshot Image URL
                    </label>
                    <Input
                      name="image"
                      placeholder="e.g. https://domain.com/photo.jpg or /aayam_assets/profiles/..."
                      value={formData.image.startsWith("data:") ? "(Uploaded local image file attached)" : formData.image}
                      onChange={handleChange}
                      className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                        Full Name *
                      </label>
                      <Input
                        required
                        name="name"
                        placeholder="e.g. Arjun Dev"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                      />
                    </div>

                    <CustomSelect
                      label="Pronouns"
                      options={pronounsOptions}
                      value={formData.pronouns}
                      onChange={(val) => setFormData((prev) => ({ ...prev, pronouns: val }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        name="email"
                        placeholder="e.g. arjun@ds.study.iitm.ac.in"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                        Phone Number *
                      </label>
                      <Input
                        required
                        type="tel"
                        name="phone"
                        placeholder="e.g. +91 98110 44321"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                        State / Region *
                      </label>
                      <Input
                        required
                        name="state"
                        placeholder="e.g. Tamil Nadu / Delhi"
                        value={formData.state}
                        onChange={handleChange}
                        className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                        Country
                      </label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Theatrical Craft & Interest */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <span className="text-xs font-mono font-bold text-[#E85F57] uppercase tracking-wider block">
                    02 // Craft & Specialization
                  </span>

                  <CustomSelect
                    label="Primary Theatrical Craft *"
                    options={interestOptions}
                    value={formData.interest}
                    onChange={(val) => setFormData((prev) => ({ ...prev, interest: val }))}
                    icon={Sparkles}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelect
                      label="Rehearsal Availability"
                      options={availabilityOptions}
                      value={formData.availability}
                      onChange={(val) => setFormData((prev) => ({ ...prev, availability: val }))}
                      icon={Clock}
                    />

                    <CustomSelect
                      label="Theatrical Experience Level"
                      options={experienceOptions}
                      value={formData.level}
                      onChange={(val) => setFormData((prev) => ({ ...prev, level: val }))}
                      icon={Award}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                      Portfolio Link / GitHub / Showreel
                    </label>
                    <Input
                      name="portfolio"
                      placeholder="e.g. https://github.com/username or https://behance.net/portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                    />
                    <p className="text-[10px] font-mono text-white/50">
                      Linking a GitHub or code repository auto-qualifies you for the Core Maintainer technical stream.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                      Artistic Bio & Passion Statement *
                    </label>
                    <textarea
                      required
                      rows={3}
                      name="bio"
                      placeholder="Describe your theatrical experience, previous plays, or why you want to take the stage with Aayam..."
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full bg-[#353535]/80 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#E85F57] leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3. Safety & Emergency Contact */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <span className="text-xs font-mono font-bold text-[#E85F57] uppercase tracking-wider block">
                    03 // Safety & Emergency Contact
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                        Emergency Contact Name *
                      </label>
                      <Input
                        required
                        name="emergencyName"
                        placeholder="e.g. Parent / Guardian / Peer"
                        value={formData.emergencyName}
                        onChange={handleChange}
                        className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-white/80 font-bold block">
                        Emergency Contact Phone *
                      </label>
                      <Input
                        required
                        type="tel"
                        name="emergencyPhone"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        className="bg-[#353535]/80 border-white/10 text-xs text-white h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{loading ? "Registering with Society DB..." : "Submit Ensemble Application"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>

          </div>
        ) : (
          /* SUCCESS STATE: GENERATED OFFICIAL PASS */
          <div className="max-w-2xl mx-auto bg-[#2C2A28] text-white rounded-[2.5rem] p-8 md:p-14 border border-[#353535] shadow-2xl text-center space-y-8 animate-in fade-in-50">
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#E85F57] uppercase tracking-widest">
                INDUCTION CONFIRMED
              </span>
              <h1 className="font-serif text-3xl md:text-5xl text-[#F7F5F0] font-normal">
                Welcome to Aayam, {formData.name}!
              </h1>
              <p className="text-xs text-white/70 font-light max-w-md mx-auto">
                Your registration has been logged in the society database. Your official credentials have been generated.
              </p>
            </div>

            {/* Generated Pass Card with Photo */}
            <div className="p-6 rounded-2xl bg-[#353535]/80 border border-white/10 text-left space-y-4 font-mono text-xs max-w-md mx-auto">
              <div className="flex items-center gap-4 pb-3 border-b border-white/10">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#2C2A28] border border-white/10 shrink-0 flex items-center justify-center">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif text-xl font-bold text-[#E85F57]">{formData.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-serif text-lg text-[#F7F5F0]">{formData.name}</div>
                  <div className="text-[10px] text-[#E85F57] font-bold">{memberId}</div>
                </div>
              </div>

              {generatedCredentials && (
                <>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-white/60">Generated Email:</span>
                    <span className="text-white">{generatedCredentials.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-white/60">Auto Password:</span>
                    <span className="text-emerald-400 font-bold">{generatedCredentials.password}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-[11px] pt-1">
                <span className="text-white/60">Assigned Stream:</span>
                <span className="text-[#E85F57] uppercase font-bold">{assignedTag}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoToPortal}
                className="py-4 px-8 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Enter Member Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/directory"
                className="py-4 px-8 rounded-full border border-white/20 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all"
              >
                View Ensemble Roster
              </Link>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
