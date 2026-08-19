import React, { useState } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function JoinClub() {
  const { setActiveUser } = useOutletContext<any>();
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedTag, setAssignedTag] = useState<"member" | "maintainer" | "developer">("member");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{email: string, password: string} | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    country: "",
    pronouns: "he/him",
    interest: "Acting",
    availability: "Weekends",
    bio: "",
    portfolio: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Compute local tag assignment logic for fallback/convenience
    let tag: "member" | "maintainer" | "developer" = "member";
    const port = formData.portfolio.toLowerCase();
    const mail = formData.email.toLowerCase();
    const intr = formData.interest.toLowerCase();

    if (port.includes("github.com") || port.includes("dev") || port.includes("code") || mail.includes("admin")) {
      tag = "developer";
    } else if (
      intr.includes("tech") ||
      intr.includes("crew") ||
      intr.includes("lighting") ||
      intr.includes("props") ||
      intr.includes("costumes")
    ) {
      tag = "maintainer";
    }

    try {
      const response = await fetch("http://localhost:5005/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to register with backend.");
      }

      const resData = await response.json();
      if (resData.status === "success" && resData.member) {
        setMemberId(resData.member.member_id);
        if (resData.generated_credentials) {
          setGeneratedCredentials(resData.generated_credentials);
        }
        const backendMember = resData.member;
        let backendTag: "member" | "maintainer" | "developer" = "member";
        if (backendMember.portfolio && (backendMember.portfolio.toLowerCase().includes("github.com") || backendMember.portfolio.toLowerCase().includes("dev") || backendMember.portfolio.toLowerCase().includes("code"))) {
          backendTag = "developer";
        } else if (backendMember.interest && ['tech', 'crew', 'lighting', 'props', 'costumes'].some(kw => backendMember.interest.toLowerCase().includes(kw))) {
          backendTag = "maintainer";
        }
        setAssignedTag(backendTag);
        setIsSubmitted(true);
      } else {
        throw new Error("Invalid response schema from backend join API");
      }
    } catch (err: any) {
      console.warn("Backend registration failed, using client-side mock fallback:", err);
      if (err.message && (err.message.includes("registered") || err.message.includes("duplicate") || err.message.includes("Email"))) {
        setErrorMsg(err.message);
      } else {
        // Fallback for offline/local execution
        setAssignedTag(tag);
        setMemberId(`MC-${Math.floor(1000 + Math.random() * 9000)}`);
        setIsSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      state: "",
      country: "",
      pronouns: "he/him",
      interest: "Acting",
      availability: "Weekends",
      bio: "",
      portfolio: "",
      emergencyName: "",
      emergencyPhone: "",
    });
    setErrorMsg(null);
    setIsSubmitted(false);
  };

  const handleGoToPortal = () => {
    const initials = formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    let role = "Lead Actor & Member";
    if (assignedTag === "developer") {
      role = "Core Maintainer";
    } else if (assignedTag === "maintainer") {
      role = "Production Coordinator";
    }
    setActiveUser({
      name: formData.name || "Ensemble Member",
      role: role,
      initials: initials || "EM",
      email: formData.email
    });

    if (assignedTag === "developer" || assignedTag === "maintainer") {
      navigate("/maintainer");
    } else {
      navigate("/member");
    }
  };

  return (
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {!isSubmitted ? (
          <div className="space-y-8 bg-white border border-[#D5C9BE]/30 p-8 md:p-12 rounded-3xl shadow-sm">
            <div className="border-b border-[#DDD8CE]/60 pb-6">
              <span className="inline-block px-3 py-1.5 rounded-full bg-[#F8E8E4] text-[#E85F57] text-xs font-bold uppercase tracking-wider mb-4">
                Ensemble Registration
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-[#353535] font-bold tracking-tight">Join The Matinee Club</h1>
              <p className="text-sm text-[#666361] mt-2 leading-relaxed font-light">
                Apply for membership in the Aayam Creative Network. Standard, Developer, and Maintainer roles are programmatically assigned based on profile fields.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 text-left">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Full Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Julian Devereux"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="julian@example.com"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Contact Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2834"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>

                {/* Pronouns */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Preferred Pronouns</label>
                  <select
                    name="pronouns"
                    value={formData.pronouns}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-[#DDD8CE] bg-white px-3 py-1 text-sm text-[#666361] outline-none focus:ring-3 focus:ring-[#E85F57]/20 focus:border-[#E85F57] transition-all"
                  >
                    <option value="he/him">he/him</option>
                    <option value="she/her">she/her</option>
                    <option value="they/them">they/them</option>
                    <option value="other">other / prefer not to say</option>
                  </select>
                </div>

                {/* Residing State */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Residing State / Province</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="New York"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Country</label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>

                {/* Area of Interest */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Area of Interest</label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-[#DDD8CE] bg-white px-3 py-1 text-sm text-[#666361] outline-none focus:ring-3 focus:ring-[#E85F57]/20 focus:border-[#E85F57] transition-all"
                  >
                    <option value="Acting">Acting / Performing</option>
                    <option value="Stage Crew">Stage Crew / Set Production</option>
                    <option value="Props Design">Props Design & Management</option>
                    <option value="Lighting Design">Lighting & FX Design</option>
                    <option value="Costumes">Costume / Wardrobe Design</option>
                    <option value="Writing / Directing">Writing & Directing</option>
                  </select>
                </div>

                {/* Availability */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-[#DDD8CE] bg-white px-3 py-1 text-sm text-[#666361] outline-none focus:ring-3 focus:ring-[#E85F57]/20 focus:border-[#E85F57] transition-all"
                  >
                    <option value="Full-time">Full-time Ensemble</option>
                    <option value="Weekends">Weekends & Rehearsals</option>
                    <option value="Show-runs only">Show-runs only</option>
                    <option value="Casual volunteer">Casual volunteer</option>
                  </select>
                </div>

                {/* Portfolio / Work URL */}
                <div className="space-y-1 md:col-span-2 lg:col-span-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Portfolio / Work URL</label>
                  <Input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="e.g. https://github.com/username"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1 md:col-span-2 lg:col-span-3">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Bio / Personal Summary</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your theatrical background, passion, or creative journey..."
                    rows={4}
                    className="w-full rounded-xl border border-[#DDD8CE] bg-white px-4 py-3 text-sm text-[#666361] outline-none transition-all focus:border-[#E85F57] focus:ring-3 focus:ring-[#E85F57]/20 resize-y"
                    required
                  />
                  <span className="text-[10px] text-[#666361]/65 italic block mt-1 leading-relaxed">
                    Hint: Portfolios containing 'github.com', 'dev' or 'code' grant the <strong>Developer</strong> tag. Technical areas of interest grant the <strong>Maintainer</strong> tag.
                  </span>
                </div>

                {/* Emergency Contact Name */}
                <div className="space-y-1 sm:col-span-1 lg:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Emergency Contact Name</label>
                  <Input
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Sarah Vance"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div className="space-y-1 sm:col-span-1 lg:col-span-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#353535] font-bold">Emergency Contact Phone</label>
                  <Input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 092-1212"
                    className="border-[#DDD8CE] h-10 bg-white focus-visible:ring-[#E85F57] focus-visible:ring-3 focus-visible:ring-[#E85F57]/20 transition-all text-sm rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#DDD8CE]/60 flex items-center justify-end gap-4">
                <Link
                  to="/"
                  className="border border-[#DDD8CE] text-[#666361] hover:bg-[#EFE8E1] rounded-xl px-8 h-12 flex items-center text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </Link>
                 <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#353535] text-white hover:bg-[#353535]/90 font-bold text-xs uppercase tracking-widest rounded-xl px-8 h-12 shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-8 max-w-lg mx-auto bg-white border border-[#D5C9BE]/30 p-8 md:p-12 rounded-3xl shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-serif font-bold text-[#353535]">Welcome to the Ensemble!</h3>
              <p className="text-sm text-[#666361]/90 leading-relaxed font-light">
                Your membership application has been received and registered. Your digital membership details are below:
              </p>
            </div>

            {/* Frosted Glass Membership Card */}
            <div className="w-full bg-white border-2 border-[#353535]/10 rounded-2xl p-6 shadow-xl relative overflow-hidden text-left space-y-5 transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E85F57]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#353535]/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-start border-b border-[#DDD8CE] pb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#353535]/80 font-bold">Aayam Club Network</span>
                  <h4 className="font-serif font-bold text-[#353535] text-lg leading-tight mt-0.5">The Matinee Club</h4>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                  PENDING
                </Badge>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#666361]/65 font-bold">Ensemble Member</p>
                  <p className="text-base font-bold text-[#353535] mt-0.5">{formData.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#666361]/65 font-bold">Member ID</p>
                    <p className="text-xs font-mono font-bold text-[#353535] mt-0.5">{memberId}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#666361]/65 font-bold">System Tag</p>
                    <div className="mt-0.5">
                      <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border ${
                        assignedTag === "developer" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        assignedTag === "maintainer" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-[#353535]/10 text-[#353535] border-[#DDD8CE]"
                      }`}>
                        {assignedTag}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#666361]/65 font-bold">Interest / Specialty</p>
                    <p className="text-xs font-semibold text-[#666361] mt-0.5">{formData.interest}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#666361]/65 font-bold">Base Location</p>
                    <p className="text-xs font-semibold text-[#666361] mt-0.5">{formData.state}, {formData.country}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#DDD8CE] pt-3 flex justify-between items-center text-[9px] text-[#666361]/50 italic font-medium">
                <span>Aayam Verified Identity</span>
                <span>Card Ref: Matinee-2026</span>
              </div>
            </div>

            {generatedCredentials && (
              <div className="bg-[#fff9d2] border border-[#D5C9BE] rounded-2xl p-6 text-left space-y-3 shadow-sm">
                <p className="text-xs font-bold text-[#353535] uppercase tracking-wider">Access Credentials Generated</p>
                <p className="text-xs text-[#666361] leading-relaxed font-light">
                  An ensemble portal account has been auto-created for you. Use these credentials to sign in:
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs border-b border-[#D5C9BE]/25 pb-1">
                    <span className="font-bold text-[#666361]">ID / Email:</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#D5C9BE]/30 text-[#353535] select-all">{generatedCredentials.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#666361]">Password:</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#D5C9BE]/30 text-[#353535] select-all">{generatedCredentials.password}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleReset} variant="outline" className="border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1] font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-sm transition-all">
                Submit Another
              </Button>
              <Button onClick={handleGoToPortal} className="bg-[#353535] text-white hover:bg-[#353535]/90 font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                Go to Portal <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
