// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Phone, MapPin, ShieldAlert, Award, FileText, ArrowLeft, ArrowRight, Edit3, Globe, Shield, Tag, Plus, X } from "lucide-react";

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
    <div className="min-h-screen bg-[#EBE3DB] p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="text-[#8C5A54] hover:text-[#8C241E] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Previous View
        </button>

        {/* Main Card */}
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] shadow-xl overflow-hidden relative">
          
          {/* Header Region */}
          <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border-b border-[#DCBAB2] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FDF8F7] shadow-lg shrink-0">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#D5AAA2] flex items-center justify-center text-3xl font-serif text-[#FDF8F7]">
                    {profile.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-3xl font-normal text-[#2A1816] tracking-tight">{profile.name}</h1>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#8C241E] text-[#FDF8F7] text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                    {profile.roles && profile.roles.length > 0 ? profile.roles[0] : "Member"}
                  </span>
                </div>
                <p className="text-sm font-mono text-[#8C5A54] tracking-wide">{profile.email}</p>
                
                {/* Labels row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {profile.labels?.map((label: any) => (
                    <span 
                      key={label.id} 
                      className="group relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider shadow-sm"
                      style={{ backgroundColor: label.color, color: "#fff" }}
                    >
                      <Tag className="w-3 h-3 opacity-70" />
                      {label.name}
                      <button onClick={() => handleRemoveLabel(label.id)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  {/* Add Label Button */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FDF8F7] border border-[#DCBAB2] text-[#8C5A54] hover:text-[#8C241E] hover:border-[#8C5A54] transition-all shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Label
                    </button>
                    {showLabelDropdown && (
                      <div className="absolute top-full mt-2 left-0 w-48 bg-[#FDF8F7] rounded-xl shadow-xl border border-[#DCBAB2] p-2 z-50 flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                        <div className="text-[10px] font-mono font-bold text-[#8C5A54] uppercase tracking-wider px-2 py-1 mb-1 border-b border-[#DCBAB2]/50">Assign Label</div>
                        {allLabels.filter(l => !profile.labels?.find((pl: any) => pl.id === l.id)).map(label => (
                          <button key={label.id} onClick={() => handleAssignLabel(label.id)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#FAF2EE] text-left text-xs font-semibold cursor-pointer" style={{color: label.color}}>
                            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: label.color}}></span>
                            {label.name}
                          </button>
                        ))}
                        {allLabels.filter(l => !profile.labels?.find((pl: any) => pl.id === l.id)).length === 0 && (
                          <div className="text-[10px] font-mono text-gray-400 px-2 py-2 text-center italic">All labels assigned!</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#FDF8F7] border border-[#DCBAB2] px-5 py-3 rounded-2xl shadow-sm text-center">
              <p className="text-[9px] uppercase font-mono font-bold text-[#8C5A54] tracking-wider mb-0.5">Member ID</p>
              <p className="text-sm font-bold font-mono text-[#2A1816]">{profile.member_id || "AAY-PEND"}</p>
            </div>
          </div>

          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="space-y-4">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8C5A54] flex items-center gap-2 border-b border-[#DCBAB2]/60 pb-2">
                  <Phone className="w-4 h-4 text-[#8C241E]" /> Contact Info
                </h2>
                <div className="space-y-3 text-sm text-[#5C3B37]">
                  <div className="flex justify-between items-center bg-[#FDF8F7] p-3 rounded-xl border border-[#DCBAB2]/50">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">Phone</span>
                    <span className="font-medium">{profile.phone || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#FDF8F7] p-3 rounded-xl border border-[#DCBAB2]/50">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">Pronouns</span>
                    <span className="font-medium">{profile.pronouns || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#FDF8F7] p-3 rounded-xl border border-[#DCBAB2]/50">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">Age</span>
                    <span className="font-medium">{profile.age || "Not specified"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8C5A54] flex items-center gap-2 border-b border-[#DCBAB2]/60 pb-2">
                  <MapPin className="w-4 h-4 text-[#8C241E]" /> Address
                </h2>
                <div className="space-y-2 text-sm text-[#5C3B37] bg-[#FDF8F7] p-4 rounded-xl border border-[#DCBAB2]/50">
                  <p><strong className="font-mono text-[10px] uppercase tracking-wider text-[#8C5A54]">Street:</strong> {profile.address || "Not specified"}</p>
                  <p><strong className="font-mono text-[10px] uppercase tracking-wider text-[#8C5A54]">City:</strong> {profile.city || "Not specified"}</p>
                  <p><strong className="font-mono text-[10px] uppercase tracking-wider text-[#8C5A54]">State:</strong> {profile.state || "Not specified"}</p>
                  <p><strong className="font-mono text-[10px] uppercase tracking-wider text-[#8C5A54]">Country:</strong> {profile.country || "India"}</p>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-4 bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DCBAB2] p-5 rounded-2xl shadow-xs">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8C241E] flex items-center gap-2 border-b border-[#DCBAB2] pb-2">
                  <ShieldAlert className="w-4 h-4 text-[#8C241E]" /> Emergency Details
                </h2>
                <div className="space-y-2.5 text-sm text-[#5C3B37]">
                  <p><strong className="font-mono text-[10px] uppercase tracking-wider text-[#8C5A54]">Contact Name:</strong> {profile.emergency_name || "Not specified"}</p>
                  <p><strong className="font-mono text-[10px] uppercase tracking-wider text-[#8C5A54]">Contact Phone:</strong> {profile.emergency_phone || "Not specified"}</p>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-3">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8C5A54] flex items-center gap-2 border-b border-[#DCBAB2]/60 pb-2">
                  <FileText className="w-4 h-4 text-[#8C241E]" /> Artistic Biography
                </h2>
                {profile.bio ? (
                  <blockquote className="border-l-4 border-[#8C241E] pl-5 italic text-[15px] leading-relaxed text-[#5C3B37] py-2">
                    "{profile.bio}"
                  </blockquote>
                ) : (
                  <p className="text-sm text-[#8C5A54] italic">No biography listed. Edit profile to add.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8C5A54] flex items-center gap-2 border-b border-[#DCBAB2]/60 pb-2">
                    <Award className="w-4 h-4 text-[#8C241E]" /> Theatrical Profile
                  </h3>
                  <div className="space-y-3 text-sm text-[#5C3B37]">
                    <div className="bg-[#FDF8F7] p-3.5 rounded-xl border border-[#DCBAB2]/50 flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">Primary Interest</span>
                      <span className="font-medium leading-relaxed">{profile.interest || "Acting"}</span>
                    </div>
                    <div className="bg-[#FDF8F7] p-3.5 rounded-xl border border-[#DCBAB2]/50 flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">Availability</span>
                      <span className="font-medium">{profile.availability || "Weekends"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#8C5A54] flex items-center gap-2 border-b border-[#DCBAB2]/60 pb-2">
                    <Globe className="w-4 h-4 text-[#8C241E]" /> Portfolio
                  </h3>
                  <div className="bg-[#FDF8F7] p-3.5 rounded-xl border border-[#DCBAB2]/50 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">External Link</span>
                    {profile.portfolio ? (
                      <a href={profile.portfolio} target="_blank" rel="noreferrer" className="font-medium text-[#8C241E] hover:underline flex items-center gap-1.5 break-all">
                        {profile.portfolio} <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-[#8C5A54] italic text-sm">None listed</span>
                    )}
                  </div>
                </div>

              </div>

              <div className="bg-[#2A1816] text-[#FDF8F7] border border-[#5C3B37] p-6 rounded-2xl shadow-xl mt-4">
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#D5AAA2] flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-[#FDF8F7]" /> System Privileges
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D5AAA2]">Account Status</span>
                    <p className="text-lg font-serif">{profile.status || "Active"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D5AAA2]">Experience Level</span>
                    <p className="text-lg font-serif">{profile.level || "Intermediate"}</p>
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
