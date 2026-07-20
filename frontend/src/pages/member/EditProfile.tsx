import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { User, Phone, ShieldAlert, Award, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProfile() {
  const navigate = useNavigate();
  const context = useOutletContext<{ activeUser: any; setActiveUser: (u: any) => void }>();
  const activeUser = context?.activeUser;
  const setActiveUser = context?.setActiveUser;

  // Form states mapping directly to database fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [pronouns, setPronouns] = useState("he/him");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [interest, setInterest] = useState("Acting");
  const [availability, setAvailability] = useState("Weekends");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if logged out
  useEffect(() => {
    if (!activeUser) {
      navigate("/");
      return;
    }

    // Fetch user details from database
    fetch(`http://localhost:5001/api/profile/get?email=${encodeURIComponent(activeUser.email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to retrieve profile");
        return res.json();
      })
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAge(data.age || "");
        setPronouns(data.pronouns || "he/him");
        setAddress(data.address || "");
        setCity(data.city || "");
        setState(data.state || "");
        setCountry(data.country || "India");
        setBio(data.bio || "");
        setPortfolio(data.portfolio || "");
        setInterest(data.interest || "Acting");
        setAvailability(data.availability || "Weekends");
        setEmergencyName(data.emergency_name || "");
        setEmergencyPhone(data.emergency_phone || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        // Fallback to activeUser state in case backend is unreachable
        setName(activeUser.name || "");
        setEmail(activeUser.email || "");
        setLoading(false);
      });
  }, [activeUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccess(false);

    const payload = {
      email, // Key to identify user
      name,
      phone,
      age,
      pronouns,
      address,
      city,
      state,
      country,
      bio,
      portfolio,
      interest,
      availability,
      emergencyName,
      emergencyPhone
    };

    try {
      const res = await fetch("http://localhost:5001/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update profile");
      }

      const resData = await res.json();
      if (resData.status === "success" && setActiveUser) {
        // Sync layout state
        setActiveUser({
          name: name,
          email: email,
          role: activeUser.role, // Keep existing role
          initials: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        });
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fdf9f4] min-h-[70vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8CC0EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#466272]/80">Loading database profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fdf9f4] text-[#1c1b19] font-sans py-12 md:py-16 selection:bg-[#c6e4f7]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Back header */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(activeUser?.role.toLowerCase().includes("maintainer") ? "/maintainer" : "/member")}
            className="flex items-center gap-2 text-xs font-semibold text-[#635f41] hover:text-[#635f41]/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-[#cac6b9]/30 p-8 md:p-12 rounded-3xl shadow-sm">
          
          {/* Form Header */}
          <div className="border-b border-[#e6e2dd]/60 pb-6 flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="inline-block px-3 py-1.5 rounded-full bg-[#c6e4f7] text-[#2e4a5a] text-xs font-bold uppercase tracking-wider mb-3">
                Member Profile Editor
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#635f41] font-bold tracking-tight">Edit Your Account</h1>
              <p className="text-xs text-[#49473d] mt-1 leading-relaxed">
                Updating these fields writes changes directly to the SQLite backend.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-[#f7f3ee] border border-[#e6e2dd] p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41] font-bold text-md">
                {activeUser?.initials}
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs font-bold text-[#635f41] truncate max-w-[120px]">{name}</p>
                <p className="text-[10px] text-[#466272]/70 truncate max-w-[120px]">{activeUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Feedback alerts */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-xs font-medium flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Profile details saved successfully in database.</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs font-medium flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Personal Info */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/40 pb-2">
              <User className="w-4 h-4 text-[#8CC0EB]" /> 1. Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Display Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Pronouns</label>
                <Select value={pronouns} onValueChange={(val) => setPronouns(val ?? "he/him")}>
                  <SelectTrigger className="w-full border-[#e6e2dd] bg-white text-[#466272] hover:bg-gray-50 focus:ring-[#8CC0EB] text-sm h-10 px-3 flex items-center justify-between rounded-lg">
                    <SelectValue placeholder="Pronouns" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#e6e2dd] text-[#466272] rounded-lg shadow-md mt-1 z-50">
                    <SelectGroup>
                      <SelectItem value="he/him" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">he/him</SelectItem>
                      <SelectItem value="she/her" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">she/her</SelectItem>
                      <SelectItem value="they/them" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">they/them</SelectItem>
                      <SelectItem value="Other" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Age</label>
                <Input
                  value={age}
                  placeholder="e.g. 26"
                  onChange={(e) => setAge(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Location */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/40 pb-2">
              <Phone className="w-4 h-4 text-[#8CC0EB]" /> 2. Contact Details & Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  title="Used as unique account ID. Cannot be modified."
                  className="border-[#e6e2dd] text-sm h-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Phone Number</label>
                <Input
                  value={phone}
                  placeholder="+91 98765 00000"
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Street Address</label>
                <Input
                  value={address}
                  placeholder="e.g. 102 Juhu Scheme"
                  onChange={(e) => setAddress(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">City</label>
                <Input
                  value={city}
                  placeholder="e.g. Mumbai"
                  onChange={(e) => setCity(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">State / UT</label>
                <Input
                  value={state}
                  placeholder="e.g. Maharashtra"
                  onChange={(e) => setState(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Theatrical Details */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/40 pb-2">
              <Award className="w-4 h-4 text-[#8CC0EB]" /> 3. Theatrical Profile & Skillsets
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Primary Interest</label>
                <Select value={interest} onValueChange={(val) => setInterest(val ?? "Acting")}>
                  <SelectTrigger className="w-full border-[#e6e2dd] bg-white text-[#466272] hover:bg-gray-50 focus:ring-[#8CC0EB] text-sm h-10 px-3 flex items-center justify-between rounded-lg">
                    <SelectValue placeholder="Interest" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#e6e2dd] text-[#466272] rounded-lg shadow-md mt-1 z-50">
                    <SelectGroup>
                      <SelectItem value="Acting" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Acting</SelectItem>
                      <SelectItem value="Direction" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Direction</SelectItem>
                      <SelectItem value="Playwriting" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Playwriting</SelectItem>
                      <SelectItem value="Lighting Design" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Lighting Design</SelectItem>
                      <SelectItem value="Scenic Art" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Scenic Art</SelectItem>
                      <SelectItem value="Choreography" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Choreography</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Rehearsal Availability</label>
                <Select value={availability} onValueChange={(val) => setAvailability(val ?? "Weekends")}>
                  <SelectTrigger className="w-full border-[#e6e2dd] bg-white text-[#466272] hover:bg-gray-50 focus:ring-[#8CC0EB] text-sm h-10 px-3 flex items-center justify-between rounded-lg">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#e6e2dd] text-[#466272] rounded-lg shadow-md mt-1 z-50">
                    <SelectGroup>
                      <SelectItem value="Weekends" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Weekends Only</SelectItem>
                      <SelectItem value="Weekdays" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Weekdays Only</SelectItem>
                      <SelectItem value="Flexible" className="hover:bg-[#8CC0EB]/10 rounded-md py-1.5 px-3 cursor-pointer">Flexible (Anytime)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Portfolio / Github Link</label>
                <Input
                  value={portfolio}
                  placeholder="https://github.com/profile"
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-[#635f41]">Short Biography</label>
              <textarea
                value={bio}
                rows={4}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your experience, previous productions, and training..."
                className="w-full border border-[#e6e2dd] focus:outline-none focus:ring-1 focus:ring-[#8CC0EB] text-sm rounded-lg p-3 bg-white text-[#466272]"
              />
            </div>
          </div>

          {/* Section 4: Emergency Contacts */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/40 pb-2">
              <ShieldAlert className="w-4 h-4 text-[#8CC0EB]" /> 4. Emergency Contacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Contact Name</label>
                <Input
                  value={emergencyName}
                  placeholder="e.g. Spouse / Parent name"
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-[#635f41]">Contact Phone</label>
                <Input
                  value={emergencyPhone}
                  placeholder="+91 98765 00000"
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-sm h-10 bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t border-[#e6e2dd] flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(activeUser?.role.toLowerCase().includes("maintainer") ? "/maintainer" : "/member")}
              className="border-2 border-[#e6e2dd] text-[#466272] hover:bg-[#f7f3ee] rounded-xl flex-1 py-4 font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/95 disabled:bg-[#8CC0EB]/50 rounded-xl flex-1 py-4 font-semibold text-center"
            >
              {saving ? "Saving Changes..." : "Save Profile Changes"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
