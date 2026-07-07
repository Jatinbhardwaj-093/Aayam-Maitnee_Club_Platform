import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function JoinClubForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedTag, setAssignedTag] = useState<"member" | "maintainer" | "developer">("member");
  const [memberId, setMemberId] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Programmatic Tag Assignment Logic:
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

    setAssignedTag(tag);
    setMemberId(`MC-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsSubmitted(true);
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
    setIsSubmitted(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button size="lg" className="bg-[#8CC0EB] hover:bg-[#8CC0EB]/90 text-[#1c1b19] font-semibold rounded-[8px] px-[40px] py-[24px] shadow-md transition-all active:scale-95" />}>
        Join the Club
      </DialogTrigger>
      <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[92vh] overflow-y-auto p-6 md:p-10 rounded-2xl shadow-2xl">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <DialogHeader className="border-b border-[#e6e2dd]/60 pb-4">
              <DialogTitle className="font-serif text-[28px] text-[#635f41] leading-tight">Join The Matinee Club</DialogTitle>
              <DialogDescription className="text-xs text-[#466272]/85 mt-1">
                Apply for membership in the Aayam Creative Network. Standard, Developer, and Maintainer roles are programmatically assigned based on profile fields.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 py-2">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Julian Devereux"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="julian@example.com"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Contact Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>

              {/* Pronouns */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Preferred Pronouns</label>
                <select
                  name="pronouns"
                  value={formData.pronouns}
                  onChange={handleChange}
                  className="w-full h-9 rounded-lg border border-[#e6e2dd] bg-white px-2.5 py-1 text-sm text-[#466272] outline-none focus:ring-3 focus:ring-[#8CC0EB]/20 focus:border-[#8CC0EB] transition-all"
                >
                  <option value="he/him">he/him</option>
                  <option value="she/her">she/her</option>
                  <option value="they/them">they/them</option>
                  <option value="other">other / prefer not to say</option>
                </select>
              </div>

              {/* Residing State */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Residing State / Province</label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="New York"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Country</label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>

              {/* Area of Interest */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Area of Interest</label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full h-9 rounded-lg border border-[#e6e2dd] bg-white px-2.5 py-1 text-sm text-[#466272] outline-none focus:ring-3 focus:ring-[#8CC0EB]/20 focus:border-[#8CC0EB] transition-all"
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
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full h-9 rounded-lg border border-[#e6e2dd] bg-white px-2.5 py-1 text-sm text-[#466272] outline-none focus:ring-3 focus:ring-[#8CC0EB]/20 focus:border-[#8CC0EB] transition-all"
                >
                  <option value="Full-time">Full-time Ensemble</option>
                  <option value="Weekends">Weekends & Rehearsals</option>
                  <option value="Show-runs only">Show-runs only</option>
                  <option value="Casual volunteer">Casual volunteer</option>
                </select>
              </div>

              {/* Portfolio / Work URL */}
              <div className="space-y-1 md:col-span-2 lg:col-span-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Portfolio / Work URL</label>
                <Input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="e.g. https://github.com/username"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Bio / Personal Summary</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your theatrical background, passion, or creative journey..."
                  rows={3}
                  className="w-full rounded-lg border border-[#e6e2dd] bg-white px-3 py-2 text-sm text-[#466272] outline-none transition-all focus:border-[#8CC0EB] focus:ring-3 focus:ring-[#8CC0EB]/20 resize-y"
                  required
                />
                <span className="text-[10px] text-[#466272]/60 italic block mt-1">
                  Hint: Portfolios containing 'github.com', 'dev' or 'code' grant the <strong>Developer</strong> tag. Technical areas of interest grant the <strong>Maintainer</strong> tag.
                </span>
              </div>

              {/* Emergency Contact Name */}
              <div className="space-y-1 sm:col-span-1 lg:col-span-2">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Emergency Contact Name</label>
                <Input
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="Sarah Vance"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="space-y-1 sm:col-span-1 lg:col-span-1">
                <label className="text-[11px] uppercase tracking-wider text-[#635f41] font-bold">Emergency Contact Phone</label>
                <Input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 092-1212"
                  className="border-[#e6e2dd] h-9 bg-white focus-visible:ring-[#8CC0EB] focus-visible:ring-3 focus-visible:ring-[#8CC0EB]/20 transition-all"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-[#e6e2dd]/60 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-[#e6e2dd] text-[#466272] hover:bg-[#f7f3ee] rounded-[8px] px-6 h-9"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] px-6 h-9 shadow-sm transition-all active:scale-[0.98]">
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center py-4 space-y-6 max-w-md mx-auto">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-[#635f41]">Welcome to the Ensemble!</h3>
              <p className="text-xs text-[#466272]/90">
                Your membership application has been received and registered. Your digital membership details are below:
              </p>
            </div>

            {/* Frosted Glass Membership Card */}
            <div className="w-full bg-white/90 border-2 border-[#635f41]/10 rounded-2xl p-6 shadow-xl relative overflow-hidden text-left space-y-5 transition-transform hover:scale-[1.02] duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8CC0EB]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#635f41]/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-start border-b border-[#e6e2dd] pb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#635f41]/80 font-bold">Aayam Club Network</span>
                  <h4 className="font-serif font-bold text-[#635f41] text-lg leading-tight mt-0.5">The Matinee Club</h4>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                  PENDING
                </Badge>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#466272]/65 font-bold">Ensemble Member</p>
                  <p className="text-base font-bold text-[#635f41] mt-0.5">{formData.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#466272]/65 font-bold">Member ID</p>
                    <p className="text-xs font-mono font-bold text-[#635f41] mt-0.5">{memberId}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#466272]/65 font-bold">System Tag</p>
                    <div className="mt-0.5">
                      <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border ${
                        assignedTag === "developer" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        assignedTag === "maintainer" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-[#635f41]/10 text-[#635f41] border-[#e6e2dd]"
                      }`}>
                        {assignedTag}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#466272]/65 font-bold">Interest / Specialty</p>
                    <p className="text-xs font-semibold text-[#466272] mt-0.5">{formData.interest}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#466272]/65 font-bold">Base Location</p>
                    <p className="text-xs font-semibold text-[#466272] mt-0.5">{formData.state}, {formData.country}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e6e2dd] pt-3 flex justify-between items-center text-[9px] text-[#466272]/50 italic font-medium">
                <span>Aayam Verified Identity</span>
                <span>Card Ref: Matinee-2026</span>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleReset} className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] px-8 py-2 shadow-md hover:shadow-lg transition-all">
                Close Window
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
