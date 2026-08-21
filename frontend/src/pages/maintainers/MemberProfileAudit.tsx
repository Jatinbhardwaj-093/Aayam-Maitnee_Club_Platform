// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Phone, MapPin, ShieldAlert, Award, FileText, ArrowLeft, Edit3, Globe, Shield, Tag, Plus, X } from "lucide-react";

export default function MemberProfileAudit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetEmail = searchParams.get("email");

  // Profile data from database
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [allLabels, setAllLabels] = useState<any[]>([]);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);

  useEffect(() => {
    if (!targetEmail) {
      navigate("/directory");
      return;
    }

    // Fetch user details from database
    fetch(`http://localhost:5005/api/profile/get?email=${encodeURIComponent(targetEmail)}`)
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
        setLoading(false);
      });
      
    // Fetch all available labels
    fetch("http://localhost:5005/api/labels")
      .then(res => res.json())
      .then(data => setAllLabels(data))
      .catch(err => console.error(err));
  }, [targetEmail, navigate]);
  
  const handleAssignLabel = async (labelId: number) => {
    if (!profile) return;
    try {
      await fetch(`http://localhost:5005/api/users/${profile.id}/labels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label_id: labelId })
      });
      // Refresh profile
      const res = await fetch(`http://localhost:5005/api/profile/get?email=${encodeURIComponent(targetEmail!)}`);
      const data = await res.json();
      setProfile(data);
      setShowLabelDropdown(false);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleRemoveLabel = async (labelId: number) => {
    if (!profile) return;
    try {
      await fetch(`http://localhost:5005/api/users/${profile.id}/labels/${labelId}`, {
        method: 'DELETE'
      });
      // Refresh profile
      const res = await fetch(`http://localhost:5005/api/profile/get?email=${encodeURIComponent(targetEmail!)}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#E7DDD3] min-h-[70vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E85F57] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#666361]/80">Loading database profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#E7DDD3] text-[#2C2A28] font-sans py-2 md:py-4 selection:bg-[#F8E8E4]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Back header */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/directory-admin")}
            className="flex items-center gap-2 text-xs font-semibold text-[#2C2A28] hover:text-[#2C2A28]/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Members Directory
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-[#F7F5F0] border border-[#D5C9BE]/30 rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="bg-[#353535]/10 border-b border-[#D5C9BE]/70/60 p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-visible">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[#353535]/20 border-2 border-white flex items-center justify-center text-[#2C2A28] font-bold text-2xl shadow-sm flex-shrink-0">
              {profile.avatarUrl || profile.image ? (
                <img
                  src={profile.avatarUrl || profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
              )}
            </div>
            
            <div className="text-center md:text-left flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="font-serif text-3xl font-bold text-[#2C2A28] tracking-tight">{profile.name}</h1>
                <span className="inline-block px-3 py-1 rounded-full bg-[#E85F57]/20 text-[#E85F57] text-[10px] font-bold uppercase tracking-wider">
                  {profile.roles && profile.roles.length > 0 ? profile.roles[0] : "Member"}
                </span>
                
                {/* Discord-style Labels */}
                {profile.labels?.map((label: any) => (
                  <span 
                    key={label.id} 
                    className="group relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    style={{
                      backgroundColor: `${label.color}15`, 
                      border: `1px solid ${label.color}40`,
                      color: label.color
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: label.color}}></span>
                    {label.name}
                    <button 
                      onClick={() => handleRemoveLabel(label.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {/* Add Label Button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F7F5F0] border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                  
                  {showLabelDropdown && (
                    <div className="absolute top-full mt-2 left-0 w-48 bg-[#F7F5F0] rounded-xl shadow-lg border border-gray-100 p-2 z-50 flex flex-col gap-1 max-h-48 overflow-y-auto">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mb-1 border-b border-gray-100">Assign Label</div>
                      {allLabels.filter(l => !profile.labels?.find((pl: any) => pl.id === l.id)).map(label => (
                        <button
                          key={label.id}
                          onClick={() => handleAssignLabel(label.id)}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-left text-xs font-semibold"
                          style={{color: label.color}}
                        >
                          <span className="w-2 h-2 rounded-full" style={{backgroundColor: label.color}}></span>
                          {label.name}
                        </button>
                      ))}
                      {allLabels.filter(l => !profile.labels?.find((pl: any) => pl.id === l.id)).length === 0 && (
                        <div className="text-xs text-gray-400 px-2 py-2">All labels assigned!</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#666361]">{profile.email}</p>
            </div>

            <div className="flex gap-4 items-center bg-[#F7F5F0]/60 backdrop-blur-xs border border-[#D5C9BE]/70/80 px-4 py-3 rounded-2xl">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#2C2A28]/75 tracking-wider">Member ID</p>
                <p className="text-xs font-bold text-[#666361]">{profile.member_id || "AAY-PEND"}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column: Personal info & contacts */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#2C2A28] flex items-center gap-2 border-b border-[#D5C9BE]/70/60 pb-2">
                  <Phone className="w-4 h-4 text-[#E85F57]" /> Contact Information
                </h2>
                <div className="space-y-3 text-sm text-[#666361]/95">
                  <p><strong>Phone:</strong> {profile.phone || "Not specified"}</p>
                  <p><strong>Pronouns:</strong> {profile.pronouns || "Not specified"}</p>
                  <p><strong>Age:</strong> {profile.age || "Not specified"}</p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#2C2A28] flex items-center gap-2 border-b border-[#D5C9BE]/70/60 pb-2">
                  <MapPin className="w-4 h-4 text-[#E85F57]" /> Address & Location
                </h2>
                <div className="space-y-2 text-sm text-[#666361]/95">
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
                <div className="space-y-2.5 text-sm text-[#666361]/95">
                  <p><strong>Contact Name:</strong> {profile.emergency_name || "Not specified"}</p>
                  <p><strong>Contact Phone:</strong> {profile.emergency_phone || "Not specified"}</p>
                </div>
              </div>

            </div>

            {/* Right Column: Bio & Skills */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Bio block */}
              <div className="space-y-3 text-left">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#2C2A28] flex items-center gap-2 border-b border-[#D5C9BE]/70/60 pb-2">
                  <FileText className="w-4 h-4 text-[#E85F57]" /> Artistic Biography
                </h2>
                {profile.bio ? (
                  <blockquote className="border-l-4 border-[#E85F57] pl-4 italic text-sm leading-relaxed text-[#666361]/90 my-4 bg-gray-50 py-3 pr-3 rounded-r-xl">
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
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C2A28] flex items-center gap-2 border-b border-[#D5C9BE]/70/40 pb-1.5">
                    <Award className="w-4 h-4 text-[#E85F57]" /> Theatrical Profile
                  </h3>
                  <div className="space-y-2 text-sm text-[#666361]/95">
                    <p><strong>Primary Interest:</strong> {profile.interest || "Acting"}</p>
                    <p><strong>Availability:</strong> {profile.availability || "Weekends"}</p>
                  </div>
                </div>

                {/* Portfolio */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C2A28] flex items-center gap-2 border-b border-[#D5C9BE]/70/40 pb-1.5">
                    <Globe className="w-4 h-4 text-[#E85F57]" /> Portfolio Details
                  </h3>
                  <div className="space-y-2 text-sm text-[#666361]/95">
                    <p><strong>Link:</strong> {profile.portfolio ? (
                      <a href={profile.portfolio} target="_blank" rel="noreferrer" className="text-[#E85F57] hover:underline font-medium break-all">{profile.portfolio}</a>
                    ) : (
                      <span className="text-gray-400 italic">None listed</span>
                    )}</p>
                  </div>
                </div>

              </div>

              {/* System Account Stats */}
              <div className="bg-[#E7DDD3]/60 border border-[#D5C9BE]/40 p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C2A28] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#E85F57]" /> System Privileges
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Account status:</span>
                    <p className="font-bold text-[#2C2A28]">{profile.status || "Active"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience level:</span>
                    <p className="font-bold text-[#2C2A28]">{profile.level || "Intermediate"}</p>
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
