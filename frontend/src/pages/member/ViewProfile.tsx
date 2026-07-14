import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { Phone, MapPin, ShieldAlert, Award, FileText, ArrowLeft, Edit3, Globe, Shield } from "lucide-react";

export default function ViewProfile() {
  const navigate = useNavigate();
  const context = useOutletContext<{ activeUser: any }>();
  const activeUser = context?.activeUser;

  // Profile data from database
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        // Fallback to activeUser state in case backend is unreachable
        setProfile({
          name: activeUser.name,
          email: activeUser.email,
          roles: [activeUser.role],
          initials: activeUser.initials
        });
        setLoading(false);
      });
  }, [activeUser, navigate]);

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
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Back header */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(activeUser?.role.toLowerCase().includes("maintainer") ? "/maintainer" : "/member")}
            className="flex items-center gap-2 text-xs font-semibold text-[#635f41] hover:text-[#635f41]/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <Link
            to="/profile/edit"
            className="bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white border border-[#cac6b9]/30 rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="bg-[#635f41]/10 border-b border-[#e6e2dd]/60 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#635f41]/20 border-2 border-white flex items-center justify-center text-[#635f41] font-bold text-2xl shadow-sm">
              {activeUser?.initials}
            </div>
            
            <div className="text-center md:text-left flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="font-serif text-3xl font-bold text-[#635f41] tracking-tight">{profile.name}</h1>
                <span className="inline-block px-3 py-1 rounded-full bg-[#8CC0EB]/20 text-[#2e4a5a] text-[10px] font-bold uppercase tracking-wider">
                  {profile.roles && profile.roles.length > 0 ? profile.roles[0] : "Member"}
                </span>
              </div>
              <p className="text-sm text-[#466272]">{profile.email}</p>
            </div>

            <div className="flex gap-4 items-center bg-white/60 backdrop-blur-xs border border-[#e6e2dd]/80 px-4 py-3 rounded-2xl">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#635f41]/75 tracking-wider">Member ID</p>
                <p className="text-xs font-bold text-[#466272]">{profile.member_id || "AAY-PEND"}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column: Personal info & contacts */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/60 pb-2">
                  <Phone className="w-4 h-4 text-[#8CC0EB]" /> Contact Information
                </h2>
                <div className="space-y-3 text-sm text-[#466272]/95">
                  <p><strong>Phone:</strong> {profile.phone || "Not specified"}</p>
                  <p><strong>Pronouns:</strong> {profile.pronouns || "Not specified"}</p>
                  <p><strong>Age:</strong> {profile.age || "Not specified"}</p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/60 pb-2">
                  <MapPin className="w-4 h-4 text-[#8CC0EB]" /> Address & Location
                </h2>
                <div className="space-y-2 text-sm text-[#466272]/95">
                  <p><strong>Street:</strong> {profile.address || "Not specified"}</p>
                  <p><strong>City:</strong> {profile.city || "Not specified"}</p>
                  <p><strong>State:</strong> {profile.state || "Not specified"}</p>
                  <p><strong>Country:</strong> {profile.country || "India"}</p>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-4 bg-red-50/30 border border-red-100 p-5 rounded-2xl">
                <h2 className="text-xs font-bold uppercase tracking-widest text-red-800 flex items-center gap-2 border-b border-red-100 pb-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" /> Emergency Details
                </h2>
                <div className="space-y-2.5 text-sm text-[#466272]/95">
                  <p><strong>Contact Name:</strong> {profile.emergency_name || "Not specified"}</p>
                  <p><strong>Contact Phone:</strong> {profile.emergency_phone || "Not specified"}</p>
                </div>
              </div>

            </div>

            {/* Right Column: Bio & Skills */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Bio block */}
              <div className="space-y-3 text-left">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/60 pb-2">
                  <FileText className="w-4 h-4 text-[#8CC0EB]" /> Artistic Biography
                </h2>
                {profile.bio ? (
                  <blockquote className="border-l-4 border-[#8CC0EB] pl-4 italic text-sm leading-relaxed text-[#466272]/90 my-4 bg-gray-50 py-3 pr-3 rounded-r-xl">
                    "{profile.bio}"
                  </blockquote>
                ) : (
                  <p className="text-xs text-gray-400 italic">No biography listed. Edit profile to add.</p>
                )}
              </div>

              {/* Theatrical Profile details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Interest & Avail */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/40 pb-1.5">
                    <Award className="w-4 h-4 text-[#8CC0EB]" /> Theatrical Profile
                  </h3>
                  <div className="space-y-2 text-sm text-[#466272]/95">
                    <p><strong>Primary Interest:</strong> {profile.interest || "Acting"}</p>
                    <p><strong>Availability:</strong> {profile.availability || "Weekends"}</p>
                  </div>
                </div>

                {/* Portfolio */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2 border-b border-[#e6e2dd]/40 pb-1.5">
                    <Globe className="w-4 h-4 text-[#8CC0EB]" /> Portfolio Details
                  </h3>
                  <div className="space-y-2 text-sm text-[#466272]/95">
                    <p><strong>Link:</strong> {profile.portfolio ? (
                      <a href={profile.portfolio} target="_blank" rel="noreferrer" className="text-[#8CC0EB] hover:underline font-medium break-all">{profile.portfolio}</a>
                    ) : (
                      <span className="text-gray-400 italic">None listed</span>
                    )}</p>
                  </div>
                </div>

              </div>

              {/* System Account Stats */}
              <div className="bg-[#f7f3ee]/60 border border-[#cac6b9]/40 p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#635f41] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#8CC0EB]" /> System Privileges
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Account status:</span>
                    <p className="font-bold text-[#635f41]">{profile.status || "Active"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience level:</span>
                    <p className="font-bold text-[#635f41]">{profile.level || "Intermediate"}</p>
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
