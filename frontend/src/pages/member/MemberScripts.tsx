// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  Lock,
  BookOpen,
  Users,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Plus,
  Edit3,
  Trash2,
  Send,
  Clock,
  ShieldAlert,
  X,
  FilePlus,
  Eye,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ScriptItem {
  id: number;
  title: string;
  playwright: string;
  genre: string;
  language: string;
  acts: string;
  pages: number;
  rolesCount: string;
  rehearsalFocus: string;
  excerpt: string;
  content: string;
  author_email: string;
  author_name: string;
  status: string;
  created_at: string;
}

const fallbackPublicScripts: ScriptItem[] = [
  {
    id: 1,
    title: "Tamashbin Kathputliya",
    playwright: "Aayam Collective & Utkarsh (Yuuhi)",
    genre: "Nukkad Natak / Street Play",
    language: "Hindustani & English",
    acts: "1 Act (2 Scenes)",
    pages: 18,
    rolesCount: "12 Performers",
    rehearsalFocus: "Choral Chants, Dholak Beat Sync & Crowd Projection",
    excerpt: "[SCENE 1: COURTYARD] (All performers enter in a circular formation, clapping rhythmically.) SUTRADHAR: Suno suno hey Bharat ke logo! Aaj hum laye hain Tamashbin Kathputliya...",
    content: "[SCENE 1: COURTYARD]\nSUTRADHAR: Suno suno hey Bharat ke logo! Aaj hum laye hain Tamashbin Kathputliya!",
    author_email: "utkarsh123@ds.study.iitm.ac.in",
    author_name: "Utkarsh (Yuuhi)",
    status: "Public",
    created_at: "Aug 2026"
  },
  {
    id: 2,
    title: "DDDJ - Stage Playbook",
    playwright: "Abay Nandhiga & Aayam Writing Cell",
    genre: "Proscenium Drama",
    language: "Hindi & English",
    acts: "2 Acts",
    pages: 42,
    rolesCount: "8 Roles",
    rehearsalFocus: "Dialogue Intensity, Pauses & Stage Blocking",
    excerpt: "[ACT I, SCENE 2] VIKRAM: Three years of silence. And you expect a standing ovation?",
    content: "[ACT I, SCENE 2]\nVIKRAM: Three years of silence. And you expect a standing ovation?",
    author_email: "abay123@ds.study.iitm.ac.in",
    author_name: "Abay Nandhiga",
    status: "Public",
    created_at: "Aug 2026"
  },
  {
    id: 3,
    title: "Karn Ki Yachika",
    playwright: "Classical Hindi Adaptation",
    genre: "Classical Tragedy",
    language: "Hindi (Sanskritized)",
    acts: "3 Acts",
    pages: 56,
    rolesCount: "14 Roles",
    rehearsalFocus: "Verse Recitation & Emotional Diction",
    excerpt: "[SCENE 4: KURUKSHETRA SUNSET] KARN: Daanveer kehkar tumne mujhe jeeta...",
    content: "[SCENE 4: KURUKSHETRA SUNSET]\nKARN: Daanveer kehkar tumne mujhe jeeta...",
    author_email: "abay123@ds.study.iitm.ac.in",
    author_name: "Abay Nandhiga",
    status: "Public",
    created_at: "Aug 2026"
  }
];

export default function MemberScripts() {
  const navigate = useNavigate();
  const { activeUser } = useOutletContext<any>() || {};
  const isMaintainer = activeUser?.role?.toLowerCase().includes("maintainer") || activeUser?.isAdmin || false;

  const [activeTab, setActiveTab] = useState<"public" | "drafts" | "pending">("public");
  const [publicScripts, setPublicScripts] = useState<ScriptItem[]>(fallbackPublicScripts);
  const [myDrafts, setMyDrafts] = useState<ScriptItem[]>([]);
  const [pendingScripts, setPendingScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    playwright: "",
    genre: "Drama",
    language: "Hindi & English",
    acts: "2 Acts",
    pages: 30,
    rolesCount: "10 Roles",
    rehearsalFocus: "Dialogue & Scene Work",
    excerpt: "",
    content: "",
    isPublic: false
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

  const fetchScripts = async () => {
    setLoading(true);
    try {
      const email = activeUser?.email || "";
      const res = await fetch(`${baseUrl}/api/scripts?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.status === "success") {
        const fetchedPublic = data.public || [];
        setPublicScripts(fetchedPublic.length > 0 ? fetchedPublic : fallbackPublicScripts);
        setMyDrafts(data.drafts || []);
        setPendingScripts(data.pending || []);
      }
    } catch (err) {
      console.error("Failed to fetch scripts:", err);
      setPublicScripts(fallbackPublicScripts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, [activeUser]);

  const resetForm = () => {
    setFormData({
      title: "",
      playwright: activeUser?.name || "",
      genre: "Drama",
      language: "Hindi & English",
      acts: "2 Acts",
      pages: 30,
      rolesCount: "10 Roles",
      rehearsalFocus: "Dialogue & Scene Work",
      excerpt: "",
      content: "",
      isPublic: false
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser?.email) {
      alert("Please log in to create scripts.");
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/scripts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          author_email: activeUser.email,
          author_name: activeUser.name,
          status: formData.isPublic && isMaintainer ? "Public" : "Draft"
        })
      });

      if (res.ok) {
        setCreateOpen(false);
        resetForm();
        fetchScripts();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create script");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating script.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScript) return;

    try {
      const res = await fetch(`${baseUrl}/api/scripts/${selectedScript.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setEditOpen(false);
        setSelectedScript(null);
        fetchScripts();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update script");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this script?")) return;

    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchScripts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestPublish = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}/request-publish`, { method: "POST" });
      if (res.ok) {
        alert("Publish request submitted to Maintainers for review!");
        fetchScripts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePublish = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}/approve-publish`, { method: "POST" });
      if (res.ok) {
        fetchScripts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPublish = async (id: number) => {
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}/reject-publish`, { method: "POST" });
      if (res.ok) {
        fetchScripts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (script: ScriptItem) => {
    navigate(`/script-builder/${script.id}`);
  };

  const openViewModal = (script: ScriptItem) => {
    navigate(`/script-builder/${script.id}?mode=preview`);
  };

  const handleDownload = (title: string) => {
    alert(`Downloading official script playbook: ${title}_Official_Script.pdf`);
  };

  return (
    <div className="space-y-[32px] font-sans text-[#666361]">
      {/* Header Banner */}
      <div className="bg-[#E7DDD3] border border-[#DDD8CE] rounded-[24px] p-[28px] md:p-[36px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] shadow-xs">
        <div className="space-y-[10px] flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#353535]/10 text-[#353535] flex items-center justify-center font-bold shadow-inner">
              <FileText className="w-6 h-6 text-[#353535]" />
            </div>
            <div>
              <h2 className="text-[28px] font-bold font-serif text-[#353535] tracking-tight">Script Vault & Production Texts</h2>
              <p className="text-xs text-[#666361]/80 font-medium">Official Playbooks • Member Drafts • Approval Workflow</p>
            </div>
          </div>
          <p className="text-[13px] text-[#666361] leading-relaxed max-w-3xl font-light pt-1">
            Access verified Aayam production playbooks, write your own original scripts, and request publication to the ensemble vault.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <Button
            onClick={() => navigate("/script-builder")}
            className="bg-[#353535] hover:bg-[#4d4a32] text-white font-bold rounded-xl px-5 py-3 text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create New Script
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#DDD8CE] pb-4 gap-4">
        <div className="flex items-center gap-2 bg-[#f4efe8] p-1.5 rounded-2xl border border-[#D5C9BE]/40">
          <button
            onClick={() => setActiveTab("public")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "public"
              ? "bg-[#353535] text-white shadow-sm"
              : "text-[#666361] hover:text-[#232323] hover:bg-[#DDD8CE]/50"
              }`}
          >
            <BookOpen className="w-4 h-4" /> Public Vault ({publicScripts.length})
          </button>

          <button
            onClick={() => setActiveTab("drafts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "drafts"
              ? "bg-[#353535] text-white shadow-sm"
              : "text-[#666361] hover:text-[#232323] hover:bg-[#DDD8CE]/50"
              }`}
          >
            <FilePlus className="w-4 h-4" /> My Scripts ({myDrafts.length})
          </button>

          {isMaintainer && (
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${activeTab === "pending"
                ? "bg-[#353535] text-white shadow-sm"
                : "text-[#666361] hover:text-[#232323] hover:bg-[#DDD8CE]/50"
                }`}
            >
              <Clock className="w-4 h-4" /> Pending Requests ({pendingScripts.length})
              {pendingScripts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1.5 right-1.5" />
              )}
            </button>
          )}
        </div>

        <span className="text-xs text-[#666361]/70 font-medium">
          {isMaintainer ? "Maintainer Mode: Full Script Management" : "Member Mode: View & Submit Scripts"}
        </span>
      </div>

      {/* Script Grid Content */}
      {loading ? (
        <div className="text-center py-20 text-[#666361]/70 font-semibold italic">Accessing script database...</div>
      ) : (
        <>
          {/* TAB 1: PUBLIC SCRIPTS */}
          {activeTab === "public" && (
            <div>
              {publicScripts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-[#DDD8CE] rounded-2xl text-xs text-[#666361]">
                  No public scripts available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                  {publicScripts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#DDD8CE] rounded-2xl p-6 md:p-8 hover:border-[#353535] hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4 border-b border-[#DDD8CE]/60 pb-4">
                          <div>
                            <span className="text-[10px] font-bold text-[#353535] uppercase tracking-[0.2em] block mb-1">
                              {item.genre} • {item.created_at}
                            </span>
                            <h3 className="text-2xl font-bold font-serif text-[#232323] tracking-tight">{item.title}</h3>
                            <p className="text-xs text-[#666361] font-semibold mt-1">
                              Playwright: <span className="text-[#232323]">{item.playwright}</span>
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <Badge className="bg-[#E85F57]/20 text-[#001e2c] border border-[#E85F57]/40 font-bold text-[10px] uppercase tracking-wider px-3 py-1 flex-shrink-0">
                              {item.language}
                            </Badge>
                            {isMaintainer && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Public Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-3 bg-[#E7DDD3] p-4 rounded-xl border border-[#DDD8CE]/80 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#666361]/70 flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-[#353535]" /> Pages
                            </span>
                            <span className="font-bold text-[#232323] block">{item.pages}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#666361]/70 flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5 text-[#353535]" /> Structure
                            </span>
                            <span className="font-bold text-[#232323] truncate block">{item.acts}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#666361]/70 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-[#353535]" /> Cast
                            </span>
                            <span className="font-bold text-[#232323] truncate block">{item.rolesCount}</span>
                          </div>
                        </div>

                        {/* Excerpt */}
                        {item.excerpt && (
                          <div className="space-y-1.5">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#353535] flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5 text-[#353535]" /> Excerpt
                            </h4>
                            <div className="p-3 bg-[#EFE8E1]/60 border border-[#DDD8CE] rounded-xl font-serif text-xs italic text-[#232323] leading-relaxed">
                              "{item.excerpt}"
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Controls Footer */}
                      <div className="pt-4 border-t border-[#DDD8CE] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => openViewModal(item)}
                            variant="outline"
                            className="text-xs font-semibold h-9 rounded-xl border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1]"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> View Script
                          </Button>
                          <Button
                            onClick={() => handleDownload(item.title)}
                            className="bg-[#353535] hover:bg-[#4d4a32] text-white font-bold h-9 rounded-xl text-xs flex items-center gap-1.5 px-4 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" /> Download PDF
                          </Button>
                        </div>

                        {isMaintainer && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              onClick={() => openEditModal(item)}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-[#D5C9BE] hover:bg-gray-50 text-[#666361]"
                              title="Edit Script"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(item.id)}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                              title="Delete Script"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY SCRIPTS / DRAFTS */}
          {activeTab === "drafts" && (
            <div>
              {myDrafts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-[#DDD8CE] rounded-2xl p-8 space-y-4">
                  <FilePlus className="w-10 h-10 text-[#353535]/40 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-[#353535]">No personal scripts created yet</h3>
                    <p className="text-xs text-[#666361]/70 max-w-sm mx-auto">
                      Click "+ Create New Script" to write original play scripts and submit them for ensemble review.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      resetForm();
                      setCreateOpen(true);
                    }}
                    className="bg-[#353535] hover:bg-[#4d4a32] text-white font-bold text-xs rounded-xl px-5 py-2.5"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Create Your First Script
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                  {myDrafts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#DDD8CE] rounded-2xl p-6 md:p-8 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4 border-b border-[#DDD8CE]/60 pb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {item.status === "Pending" ? (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Pending Approval
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-gray-300">
                                  Private Draft
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold font-serif text-[#232323] tracking-tight">{item.title}</h3>
                            <p className="text-xs text-[#666361] font-semibold mt-1 flex items-center gap-2 flex-wrap">
                              <span>Playwright: <span className="text-[#232323]">{item.playwright}</span></span>
                              {item.created_at && (
                                <span className="text-[10px] text-gray-500 font-normal bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                  {item.created_at}
                                </span>
                              )}
                            </p>
                          </div>
                          <Badge className="bg-gray-100 text-[#666361] border border-gray-200 font-bold text-[10px]">
                            {item.language}
                          </Badge>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-3 gap-3 bg-[#E7DDD3] p-3.5 rounded-xl border border-[#DDD8CE]/80 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#666361]/70 block">Pages</span>
                            <span className="font-bold text-[#232323]">{item.pages}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#666361]/70 block">Acts</span>
                            <span className="font-bold text-[#232323] truncate block">{item.acts}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#666361]/70 block">Cast</span>
                            <span className="font-bold text-[#232323] truncate block">{item.rolesCount}</span>
                          </div>
                        </div>

                        {item.excerpt && (
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl font-serif text-xs italic text-[#232323]">
                            "{item.excerpt}"
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-[#DDD8CE] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => openViewModal(item)}
                            variant="outline"
                            className="text-xs font-semibold h-9 rounded-xl border-[#D5C9BE]"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> View Script
                          </Button>
                          <Button
                            onClick={() => openEditModal(item)}
                            variant="outline"
                            className="text-xs font-semibold h-9 rounded-xl border-[#D5C9BE]"
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === "Draft" && (
                            <Button
                              onClick={() => handleRequestPublish(item.id)}
                              className="bg-[#E85F57] hover:bg-[#68a0cd] text-[#001e2c] font-bold h-9 rounded-xl text-xs flex items-center gap-1 px-3.5"
                            >
                              <Send className="w-3.5 h-3.5" /> Request Publish
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDelete(item.id)}
                            variant="outline"
                            size="sm"
                            className="h-9 text-xs border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PENDING APPROVAL (MAINTAINER ONLY) */}
          {activeTab === "pending" && isMaintainer && (
            <div>
              {pendingScripts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-[#DDD8CE] rounded-2xl text-xs text-[#666361]">
                  No pending script publish requests at this time.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                  {pendingScripts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-amber-50/40 border border-amber-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xs"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4 border-b border-amber-200/80 pb-4">
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                              Submission by: {item.author_name} ({item.author_email})
                            </span>
                            <h3 className="text-2xl font-bold font-serif text-[#232323] tracking-tight">{item.title}</h3>
                            <p className="text-xs text-[#666361] font-semibold mt-1">
                              Playwright: <span className="text-[#232323]">{item.playwright}</span>
                            </p>
                          </div>
                          <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">
                            {item.language}
                          </Badge>
                        </div>

                        <div className="p-3 bg-white border border-amber-200 rounded-xl font-serif text-xs italic text-[#232323]">
                          "{item.excerpt || "No excerpt provided."}"
                        </div>
                      </div>

                      {/* Approval Actions */}
                      <div className="pt-4 border-t border-amber-200 flex items-center justify-between gap-3">
                        <Button
                          onClick={() => openViewModal(item)}
                          variant="outline"
                          className="text-xs font-semibold h-9 rounded-xl border-[#D5C9BE] bg-white"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Review Full Script
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleRejectPublish(item.id)}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold h-9 rounded-xl px-3"
                          >
                            Return to Draft
                          </Button>
                          <Button
                            onClick={() => handleApprovePublish(item.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-9 rounded-xl px-4 shadow-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL 1: CREATE SCRIPT */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-[#E7DDD3] border border-[#D5C9BE] text-[#666361] max-w-xl rounded-3xl p-7 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-[#DDD8CE] pb-4">
            <DialogTitle className="font-serif text-2xl font-bold text-[#353535]">Create New Production Script</DialogTitle>
            <DialogDescription className="text-xs text-[#666361]/80">
              Draft an original script or play playbook. You can save it to your personal drafts or submit it for ensemble publishing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Script Title *</label>
                <Input
                  required
                  placeholder="e.g. Mahabhoj Courtroom Cut"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white border-[#DDD8CE] h-10 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Playwright / Adapter *</label>
                <Input
                  required
                  placeholder="e.g. Mannu Bhandari / Aayam Team"
                  value={formData.playwright}
                  onChange={(e) => setFormData({ ...formData, playwright: e.target.value })}
                  className="bg-white border-[#DDD8CE] h-10 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">Genre</label>
                <Input
                  placeholder="Drama"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="bg-white border-[#DDD8CE] h-9 text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">Language</label>
                <Input
                  placeholder="Hindi / English"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="bg-white border-[#DDD8CE] h-9 text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">Acts Structure</label>
                <Input
                  placeholder="2 Acts"
                  value={formData.acts}
                  onChange={(e) => setFormData({ ...formData, acts: e.target.value })}
                  className="bg-white border-[#DDD8CE] h-9 text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">Pages</label>
                <Input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                  className="bg-white border-[#DDD8CE] h-9 text-xs rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Script Scene Excerpt</label>
              <textarea
                rows={2}
                placeholder="Opening monologue or key scene dialogue excerpt..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-white border border-[#DDD8CE] p-3 text-xs font-serif rounded-xl focus:outline-none focus:ring-2 focus:ring-[#353535]/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Full Script Content / Text</label>
              <textarea
                rows={5}
                placeholder="Paste or type full script text, scene breakdown, and director notes here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-white border border-[#DDD8CE] p-3 text-xs font-serif rounded-xl focus:outline-none focus:ring-2 focus:ring-[#353535]/40"
              />
            </div>

            {isMaintainer && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublicCheck"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-[#353535] rounded border-gray-300"
                />
                <label htmlFor="isPublicCheck" className="text-xs font-bold text-[#353535]">
                  Publish directly to Public Script Vault (Maintainer Override)
                </label>
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-[#DDD8CE] flex gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="border-[#D5C9BE]">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#353535] text-white hover:bg-[#4d4a32] font-bold">
                Save Script
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: EDIT SCRIPT */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#E7DDD3] border border-[#D5C9BE] text-[#666361] max-w-xl rounded-3xl p-7 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-[#DDD8CE] pb-4">
            <DialogTitle className="font-serif text-2xl font-bold text-[#353535]">Edit Production Script</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Script Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white border-[#DDD8CE] h-10 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Playwright / Adapter</label>
                <Input
                  value={formData.playwright}
                  onChange={(e) => setFormData({ ...formData, playwright: e.target.value })}
                  className="bg-white border-[#DDD8CE] h-10 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Script Scene Excerpt</label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-white border border-[#DDD8CE] p-3 text-xs font-serif rounded-xl focus:outline-none focus:ring-2 focus:ring-[#353535]/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Full Script Text</label>
              <textarea
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-white border border-[#DDD8CE] p-3 text-xs font-serif rounded-xl focus:outline-none focus:ring-2 focus:ring-[#353535]/40"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-[#DDD8CE] flex gap-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="border-[#D5C9BE]">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#353535] text-white hover:bg-[#4d4a32] font-bold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: VIEW SCRIPT */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-[#E7DDD3] border border-[#D5C9BE] text-[#666361] max-w-2xl rounded-3xl p-7 max-h-[90vh] overflow-y-auto">
          {selectedScript && (
            <div className="space-y-5 text-left">
              <DialogHeader className="border-b border-[#DDD8CE] pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#353535]">
                  {selectedScript.genre} • {selectedScript.language}
                </span>
                <DialogTitle className="font-serif text-3xl font-bold text-[#232323]">{selectedScript.title}</DialogTitle>
                <DialogDescription className="text-xs text-[#666361]">
                  Playwright: <strong>{selectedScript.playwright}</strong> | Added by: {selectedScript.author_name}
                </DialogDescription>
              </DialogHeader>

              {selectedScript.excerpt && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Scene Excerpt</h4>
                  <blockquote className="p-4 bg-[#EFE8E1] border-l-4 border-[#353535] rounded-r-xl font-serif text-sm italic text-[#232323] leading-relaxed">
                    "{selectedScript.excerpt}"
                  </blockquote>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#353535]">Full Script Playbook</h4>
                <div className="p-5 bg-white border border-[#DDD8CE] rounded-2xl font-serif text-xs leading-relaxed max-h-72 overflow-y-auto space-y-3">
                  {(() => {
                    try {
                      if (selectedScript.content && selectedScript.content.startsWith("{")) {
                        const parsed = JSON.parse(selectedScript.content);
                        if (parsed.lines && parsed.lines.length > 0) {
                          return parsed.lines.map((l: any, idx: number) => (
                            <div key={idx} className="space-y-0.5 text-left">
                              <span className="text-[11px] font-sans font-bold uppercase tracking-wider" style={{ color: l.color || '#353535' }}>
                                {l.characterName}
                              </span>
                              <p className="text-xs text-[#232323] font-serif leading-relaxed pl-3">
                                "{l.text}"
                              </p>
                            </div>
                          ));
                        }
                      }
                    } catch (e) { }
                    return <div className="whitespace-pre-wrap">{selectedScript.content || selectedScript.excerpt || "Full script playbook PDF download available."}</div>;
                  })()}
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-[#DDD8CE] flex justify-between items-center">
                <Button variant="outline" onClick={() => setViewOpen(false)} className="border-[#D5C9BE]">
                  Close
                </Button>
                <Button
                  onClick={() => handleDownload(selectedScript.title)}
                  className="bg-[#353535] text-white hover:bg-[#4d4a32] font-bold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download PDF Playbook
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
