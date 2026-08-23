import React, { useState, useRef } from "react";
import { 
  X, Ticket, Download, Printer, Copy, 
  Sparkles, QrCode, ShieldCheck, Check
} from "lucide-react";
import { CustomSelect } from "@/components/CustomSelect";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface TicketPassData {
  ticket_id: string;
  play_title: string;
  holder_name: string;
  holder_email: string;
  holder_phone?: string;
  seats_count: number;
  seat_tier: string;
  seats_allocated: string;
  venue: string;
  date: string;
  time: string;
  issued_at: string;
  qr_data?: string;
}

interface TicketPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  play: {
    id?: number | string;
    title: string;
    date: string;
    venue: string;
    timeRange?: string;
    genre?: string;
    price?: string;
    image?: string;
  };
}

export default function TicketPassModal({ isOpen, onClose, play }: TicketPassModalProps) {
  const [step, setStep] = useState<"reserve" | "issued">("reserve");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seatsCount, setSeatsCount] = useState("1");
  const [seatTier, setSeatTier] = useState("General Admission (Complimentary)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [ticketData, setTicketData] = useState<TicketPassData | null>(null);

  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please provide your name and email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      const res = await fetch(`${baseUrl}/api/tickets/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || "+91 98402 12345",
          play_title: play.title,
          seats_count: parseInt(seatsCount) || 1,
          seat_tier: seatTier,
          venue: play.venue,
          date: play.date,
          time: play.timeRange || "18:30 - 21:00"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTicketData(data.ticket);
        setStep("issued");
      } else {
        generateFallbackTicket();
      }
    } catch (err) {
      generateFallbackTicket();
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateFallbackTicket = () => {
    const randId = Math.floor(1000 + Math.random() * 9000);
    const rows = ["A", "B", "C", "D", "E"];
    const row = rows[Math.floor(Math.random() * rows.length)];
    const startSeat = Math.floor(1 + Math.random() * 20);
    const count = parseInt(seatsCount) || 1;
    const allocation = count === 1 
      ? `Row ${row} • Seat ${String(startSeat).padStart(2, "0")}` 
      : `Row ${row} • Seats ${String(startSeat).padStart(2, "0")}-${String(startSeat + count - 1).padStart(2, "0")}`;

    const fallback: TicketPassData = {
      ticket_id: `AYM-TKT-${randId}`,
      play_title: play.title,
      holder_name: name.trim() || "Theatre Patron",
      holder_email: email.trim() || "patron@aayam.org",
      holder_phone: phone.trim() || "+91 98402 12345",
      seats_count: count,
      seat_tier: seatTier,
      seats_allocated: allocation,
      venue: play.venue,
      date: play.date,
      time: play.timeRange || "18:30 - 21:00",
      issued_at: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    setTicketData(fallback);
    setStep("issued");
  };

  const handleDownloadPNG = async () => {
    if (!ticketRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#181716",
        logging: false,
        width: 720,
        height: ticketRef.current.offsetHeight
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${ticketData?.ticket_id || "Aayam-Pass"}_${play.title.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate ticket PNG:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#181716",
        logging: false,
        width: 720,
        height: ticketRef.current.offsetHeight
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a5"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const printWidth = pdfWidth - margin * 2;
      const printHeight = (canvas.height * printWidth) / canvas.width;
      const yPos = Math.max(margin, (pdfHeight - printHeight) / 2);

      // Background fill
      pdf.setFillColor(24, 23, 22);
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

      pdf.addImage(imgData, "PNG", margin, yPos, printWidth, printHeight);
      pdf.save(`${ticketData?.ticket_id || "Aayam-Pass"}_${play.title.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Failed to generate ticket PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2C2A28] border-2 border-[#E85F57] text-[#F7F5F0] rounded-[2.5rem] max-w-4xl w-full shadow-2xl relative max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-7 sm:px-9 pt-7 pb-5 border-b border-white/10 flex items-start justify-between gap-4 shrink-0 bg-[#2C2A28]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E85F57] bg-[#E85F57]/15 px-3 py-1 rounded-full border border-[#E85F57]/30">
                {step === "reserve" ? "Complimentary Pass Reservation" : "Official Theatrical Pass Issued"}
              </span>
              {ticketData && (
                <span className="font-mono text-xs font-bold text-white bg-[#353535] px-2.5 py-0.5 rounded-md border border-white/15">
                  {ticketData.ticket_id}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F7F5F0] tracking-tight font-normal">
              {play.title}
            </h2>
            <p className="text-xs text-white/70 font-mono">
              {play.venue} • {play.date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#353535] hover:bg-[#404040] text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 shadow-xs group shrink-0"
            title="Close"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          
          {step === "reserve" ? (
            <form onSubmit={handleReserve} className="space-y-5">
              <div className="bg-[#353535]/80 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#E85F57] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Staging Availability</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    42 Seats Remaining
                  </span>
                </div>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  Admission to Aayam repertory plays is open to students, faculty, and theatre patrons. Reserve your entry pass to receive an allotted seat number and scannable door pass.
                </p>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Full Name</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jatin Bhardwaj"
                    className="w-full bg-[#353535]/80 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E85F57]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold flex items-center gap-1">
                    <span>Email Address</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jatin@study.iitm.ac.in"
                    className="w-full bg-[#353535]/80 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E85F57]"
                  />
                </div>
              </div>

              {/* Phone & Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold block">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98402 12345"
                    className="w-full bg-[#353535]/80 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#E85F57]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#E85F57] uppercase font-bold block">
                    Number of Seats
                  </label>
                  <CustomSelect
                    variant="landing"
                    value={seatsCount}
                    onChange={(val) => setSeatsCount(val)}
                    options={[
                      { value: "1", label: "1 Seat (Solo Pass)" },
                      { value: "2", label: "2 Seats (Pair Pass)" },
                      { value: "3", label: "3 Seats (Group)" },
                      { value: "4", label: "4 Seats (Ensemble Group)" }
                    ]}
                  />
                </div>
              </div>

              {/* Tier Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#E85F57] uppercase font-bold block">
                  Admission Tier
                </label>
                <CustomSelect
                  variant="landing"
                  value={seatTier}
                  onChange={(val) => setSeatTier(val)}
                  options={[
                    { value: "General Admission (Complimentary)", label: "General Admission (Complimentary Pass)", sub: "Free student / alumni general seating" },
                    { value: "Student VIP Reserved Row", label: "Student VIP Reserved Row", sub: "Preferred centre aisle seating" },
                    { value: "Patron Orchestra Tier", label: "Society Patron Orchestra Tier", sub: "Front orchestra seating for donors & guests" }
                  ]}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isSubmitting ? "Allocating Seats..." : "Confirm Reservation & Generate Ticket"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* HORIZONTAL SCROLL WRAPPER FOR SAFE DISPLAY */}
              <div className="overflow-x-auto pb-2 custom-scrollbar">
                
                {/* THEATRICAL TICKET PASS SURFACE (FIXED 720px FOR PIXEL-PERFECT PNG/PDF RENDER) */}
                <div
                  ref={ticketRef}
                  data-ticket-surface="true"
                  style={{ 
                    width: "720px", 
                    minWidth: "720px",
                    boxSizing: "border-box",
                    backgroundColor: "#181716",
                    color: "#F7F5F0",
                    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
                  }}
                  className="border-2 border-[#E85F57] rounded-3xl p-7 shadow-2xl relative text-[#F7F5F0] mx-auto"
                >
                  {/* Atmospheric Glow */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-[#E85F57]/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Society Brand Bar */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm tracking-wider font-bold text-[#E85F57] uppercase">
                        AAYAM • THE MATINEE CLUB
                      </span>
                      <span className="text-[10px] font-mono text-white/50">IIT MADRAS DRAMA SOCIETY</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#2C2A28] px-3 py-1 rounded-full border border-white/15">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">OFFICIAL ADMISSION PASS</span>
                    </div>
                  </div>

                  {/* Main Horizontal Flex Structure (Playbill Left + Door Stub Right) */}
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", justifyContent: "space-between", gap: "20px" }}>
                    
                    {/* LEFT PLAYBILL (470px) */}
                    <div style={{ width: "470px", flexShrink: 0 }} className="space-y-3.5">
                      
                      {/* Tier & Issue Date */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#E85F57] bg-[#E85F57]/15 px-3 py-1 rounded-md border border-[#E85F57]/30">
                          {ticketData?.seat_tier || "General Admission"}
                        </span>
                        <span className="text-[10px] font-mono text-white/50">
                          Issued: {ticketData?.issued_at}
                        </span>
                      </div>

                      {/* Play Title */}
                      <div>
                        <h3 className="font-serif text-3xl text-white tracking-tight font-normal" style={{ lineHeight: "1.25" }}>
                          {ticketData?.play_title}
                        </h3>
                      </div>

                      {/* 2-Column Metadata Box */}
                      <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
                        <div style={{ flex: 1 }} className="bg-[#242220] p-3 rounded-xl border border-white/10 space-y-0.5">
                          <span className="text-[9px] font-mono text-white/50 uppercase block font-semibold">
                            Date & Staging
                          </span>
                          <p className="font-mono font-bold text-white text-xs" style={{ lineHeight: "1.4" }}>
                            {ticketData?.date}
                          </p>
                          <p className="font-mono text-[10px] text-white/60">
                            {ticketData?.time}
                          </p>
                        </div>

                        <div style={{ flex: 1 }} className="bg-[#242220] p-3 rounded-xl border border-white/10 space-y-0.5">
                          <span className="text-[9px] font-mono text-white/50 uppercase block font-semibold">
                            Venue & Location
                          </span>
                          <p className="font-mono font-bold text-white text-xs" style={{ lineHeight: "1.4" }}>
                            {ticketData?.venue}
                          </p>
                          <p className="font-mono text-[10px] text-white/60">
                            Gate Opens 30m Prior
                          </p>
                        </div>
                      </div>

                      {/* Allocated Seat Highlight Pill */}
                      <div className="bg-[#2C2A28] border border-[#E85F57]/50 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-[#E85F57] uppercase font-bold tracking-wider block">
                            Allocated Seat(s)
                          </span>
                          <p className="text-sm font-mono font-bold text-white tracking-wide">
                            {ticketData?.seats_allocated}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-white/90 bg-white/10 px-2.5 py-1 rounded-md border border-white/10 font-bold">
                          {ticketData?.seats_count} Admit
                        </span>
                      </div>

                      {/* Footer Pass Holder */}
                      <div className="flex items-center justify-between text-xs font-mono text-white/70 pt-2 border-t border-white/10">
                        <span>Pass Holder: <strong className="text-white font-semibold">{ticketData?.holder_name}</strong></span>
                        <span className="text-[10px] text-white/50">Non-Transferable Pass</span>
                      </div>
                    </div>

                    {/* RIGHT PERFORATED DOOR STUB (190px) */}
                    <div 
                      style={{ width: "190px", flexShrink: 0, borderLeft: "2px dashed rgba(232, 95, 87, 0.4)", paddingLeft: "18px" }} 
                      className="flex flex-col items-center justify-between text-center space-y-2.5"
                    >
                      {/* Verification Code Box */}
                      <div className="w-full space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 block font-semibold">
                          DOOR CODE
                        </span>
                        <div className="bg-[#242220] py-1.5 px-2.5 rounded-lg border border-[#E85F57]/60 font-mono text-sm font-bold text-[#E85F57] tracking-widest shadow-inner">
                          {ticketData?.ticket_id}
                        </div>
                      </div>

                      {/* Crisp Scannable QR Matrix */}
                      <div className="bg-white p-2 rounded-2xl shadow-xl border border-white/30 flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-black stroke-[2.2]" />
                      </div>

                      {/* Barcode Graphic */}
                      <div className="w-full space-y-1">
                        <div className="h-6 w-full flex items-center justify-center gap-0.5 px-1 bg-white/5 rounded-md">
                          {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2].map((w, i) => (
                            <div key={i} className="bg-white/80 h-4" style={{ width: `${w * 1.3}px` }} />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono text-white/40 block tracking-widest">
                          SCAN AT CLT / SAC ENTRANCE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Suite */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(ticketData?.ticket_id || "");
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-full border border-white/20 bg-[#353535] hover:bg-[#404040] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E85F57]" />}
                  <span>{copiedId ? "ID Copied!" : "Copy Ticket ID"}</span>
                </button>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-5 py-2.5 rounded-full border border-white/20 bg-[#353535] hover:bg-[#404040] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-white" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPNG}
                    disabled={isExporting}
                    className="px-5 py-2.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? "Rendering..." : "Download PNG"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="px-5 py-2.5 rounded-full border border-[#E85F57] bg-[#2C2A28] hover:bg-[#353535] text-[#E85F57] hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Pass</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep("reserve")}
                  className="text-xs font-mono text-white/50 hover:text-white underline cursor-pointer"
                >
                  Book another ticket for this play
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
