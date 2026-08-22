import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { ShieldAlert, FileText, ArrowLeft, Edit3, Globe, Shield } from "lucide-react";

export default function ViewProfile() {
  const navigate = useNavigate();
  const context = useOutletContext<{ activeUser: any }>();
  const activeUser = context?.activeUser;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const avatarFallbackMap: Record<string, string> = {
    "Aditi": "/aayam_assets/profiles/aditi_drama.jpg",
    "Samarth Shrivastava": "/aayam_assets/profiles/samarth_shrivastava.jpg",
    "Krishna Subramanian": "/aayam_assets/profiles/krishna_subramanian.jpg",
    "Harsh Aryan": "/aayam_assets/profiles/harsh_aryan.jpg",
    "Swati Singh": "/aayam_assets/profiles/swati_singh.jpg",
    "Sneha Das": "/aayam_assets/profiles/sylene_bansal.jpg",
    "Tanu Kurade": "/aayam_assets/profiles/tanu_kurade.jpg",
    "Akanksha Kadam": "/aayam_assets/profiles/akanksha_kadam.jpg",
    "Chirag Kumar": "/aayam_assets/profiles/chirag_kumar.jpg",
    "Sylene Bansal": "/aayam_assets/profiles/sylene_bansal.jpg",
    "Esha Hinde": "/aayam_assets/profiles/esha_hinde.jpg",
    "Aarav Varma": "/aayam_assets/profiles/kanishk_mishra.jpg",
    "Abay Nandhiga": "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
    "Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg",
    "Utkarsh / Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg",
  };

  useEffect(() => {
    if (!activeUser) {
      navigate("/");
      return;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/profile/get?email=${encodeURIComponent(activeUser.email)}`)
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
      <div className="flex-1 flex items-center justify-center bg-[#E7DDD3] min-h-[70vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E85F57] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-mono uppercase tracking-widest text-[#666361]/80">Accessing Profile</p>
        </div>
      </div>
    );
  }

  const resolvedAvatar = profile?.image || profile?.avatarUrl || avatarFallbackMap[profile.name] || avatarFallbackMap[activeUser?.name] || null;

  return (
    <div className="flex-1 bg-[#E7DDD3] text-[#2C2A28] font-sans py-8 px-6 lg:px-12 xl:px-24 min-h-[90vh]">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Controls */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(activeUser?.role?.toLowerCase().includes("maintainer") || activeUser?.isAdmin ? "/schedule-admin" : "/schedule")}
            className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#353535] hover:text-[#E85F57] transition-all"
          >
            <div className="w-8 h-8 rounded-full border border-[#D5C9BE] flex items-center justify-center group-hover:border-[#E85F57] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Desk
          </button>

          <Link
            to="/profile/edit"
            className="bg-[#2C2A28] text-[#F7F5F0] hover:bg-[#E85F57] rounded-full px-6 py-2.5 text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-2 shadow-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Modify Profile
          </Link>
        </div>

        {/* Profile Dossier Hero */}
        <div className="bg-[#2C2A28] rounded-[2.5rem] shadow-xl overflow-hidden mb-8 relative border border-[#353535]">
          {/* Decorative abstract elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E85F57]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="p-10 md:p-14 flex flex-col md:flex-row items-center md:items-end gap-10 relative z-10">
            {/* Avatar block */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-[#353535] bg-[#353535] flex items-center justify-center text-[#F7F5F0] font-serif font-bold text-5xl overflow-hidden shadow-2xl shrink-0">
                {resolvedAvatar ? (
                  <img src={resolvedAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.initials || activeUser?.initials || "A"
                )}
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#E85F57] rounded-full border-4 border-[#2C2A28] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#FAF2EE] rounded-full"></div>
              </div>
            </div>
            
            {/* Name and Tags */}
            <div className="text-center md:text-left flex-1">
              <span className="block text-[#E85F57] font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2">
                Member Dossier
              </span>
              <h1 className="font-serif text-5xl md:text-6xl text-[#F7F5F0] leading-tight mb-4 tracking-tight">
                {profile.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-[#353535]/80 text-white/90 font-mono px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {profile.roles && profile.roles.length > 0 ? profile.roles[0] : "Cast Member"}
                </span>
                
                {/* ID Tag */}
                <span className="bg-[#FAF2EE]/10 text-white/60 font-mono px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/5 flex items-center gap-2">
                  <Shield className="w-3 h-3 text-[#E85F57]" /> ID: {profile.member_id || "AAY-PEND"}
                </span>

                {profile.labels?.map((label: any) => (
                  <span 
                    key={label.id} 
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${label.color}15`, 
                      border: `1px solid ${label.color}40`,
                      color: label.color
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: label.color}}></span>
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Contact Card */}
            <div className="bg-[#FAF2EE]/60 rounded-[2.5rem] p-8 md:p-10 border border-[#D5C9BE]/60 shadow-sm backdrop-blur-sm">
              <h2 className="text-[#2C2A28] font-serif text-2xl font-bold mb-6 border-b border-[#D5C9BE] pb-4">Demographics</h2>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#E85F57] uppercase font-mono tracking-widest font-bold mb-1">Email Address</span>
                  <span className="text-sm text-[#353535] font-semibold">{profile.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-1">Phone Line</span>
                  <span className="text-sm text-[#353535]">{profile.phone || "Not specified"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-1">Pronouns & Age</span>
                  <span className="text-sm text-[#353535]">{profile.pronouns ? profile.pronouns + " • " : ""}{profile.age ? profile.age + " years old" : "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-[#FAF2EE]/60 rounded-[2.5rem] p-8 md:p-10 border border-[#D5C9BE]/60 shadow-sm backdrop-blur-sm">
              <h2 className="text-[#2C2A28] font-serif text-2xl font-bold mb-6 border-b border-[#D5C9BE] pb-4">Location</h2>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#E85F57] uppercase font-mono tracking-widest font-bold mb-1">Street Address</span>
                  <span className="text-sm text-[#353535]">{profile.address || "Not specified"}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-1">City</span>
                    <span className="text-sm text-[#353535]">{profile.city || "Not specified"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-1">State / Country</span>
                    <span className="text-sm text-[#353535]">{profile.state || "Not specified"}<br/>{profile.country || "India"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-[#F8E8E4] rounded-[2.5rem] p-8 md:p-10 border border-[#E85F57]/30 shadow-sm">
              <h2 className="text-[#2C2A28] font-serif text-2xl font-bold mb-6 border-b border-[#E85F57]/20 pb-4 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E85F57]" /> Emergency Contact
              </h2>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#E85F57] uppercase font-mono tracking-widest font-bold mb-1">Contact Name</span>
                  <span className="text-sm font-bold text-[#353535]">{profile.emergency_contact_name || "Not specified"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-1">Emergency Phone</span>
                  <span className="text-sm text-[#353535] font-mono bg-[#FAF2EE]/50 px-3 py-1.5 rounded-lg inline-block w-fit mt-1">{profile.emergency_contact_phone || "Not specified"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bio Card */}
            <div className="bg-[#FAF2EE]/60 rounded-[2.5rem] p-8 md:p-10 border border-[#D5C9BE]/60 shadow-sm backdrop-blur-sm h-full">
              <h2 className="text-[#2C2A28] font-serif text-3xl font-bold mb-6 border-b border-[#D5C9BE] pb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#E85F57]" /> Biography & Background
              </h2>
              <div className="space-y-8">
                
                {/* Bio text */}
                <div>
                  <span className="block text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-3">Artist Bio</span>
                  <div className="prose prose-sm prose-stone">
                    {profile.bio ? (
                      <p className="text-[#353535] leading-relaxed text-sm whitespace-pre-line">{profile.bio}</p>
                    ) : (
                      <p className="text-[#666361]/60 italic text-sm">No biography submitted yet.</p>
                    )}
                  </div>
                </div>

                {/* Skills array */}
                <div className="pt-6 border-t border-[#D5C9BE]/50">
                  <span className="block text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-4">Core Skills & Talents</span>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: string, index: number) => (
                        <span key={index} className="px-4 py-2 bg-[#F7F5F0] border border-[#D5C9BE] rounded-xl text-xs font-semibold text-[#353535] shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#666361]/60 italic text-sm">No skills added.</p>
                  )}
                </div>

                {/* Social links */}
                <div className="pt-6 border-t border-[#D5C9BE]/50">
                  <span className="block text-[10px] text-[#666361] uppercase font-mono tracking-widest font-bold mb-4">Web Presence</span>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-[#E7DDD3] flex items-center justify-center text-[#E85F57]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-[#666361] font-bold w-16">Insta:</span>
                      {profile.social_links?.instagram ? (
                        <a href={`https://instagram.com/${profile.social_links.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[#E85F57] hover:underline font-medium">
                          {profile.social_links.instagram}
                        </a>
                      ) : (
                        <span className="text-[#666361]/50 italic">None</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-[#E7DDD3] flex items-center justify-center text-[#E85F57]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-[#666361] font-bold w-16">Twitter:</span>
                      {profile.social_links?.twitter ? (
                        <a href={`https://twitter.com/${profile.social_links.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[#E85F57] hover:underline font-medium">
                          {profile.social_links.twitter}
                        </a>
                      ) : (
                        <span className="text-[#666361]/50 italic">None</span>
                      )}
                    </div>
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
