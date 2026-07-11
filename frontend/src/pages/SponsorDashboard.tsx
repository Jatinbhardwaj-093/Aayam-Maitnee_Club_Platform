import { useState } from "react";
import { Coffee, Gift, GlassWater, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Booking {
  showTitle: string;
  date: string;
  seats: string;
  loungeService: string;
}

const initialBookings: Booking[] = [
  { showTitle: "Macbeth (Opening Night Gala)", date: "July 12, 2026", seats: "Table 4, Seats A-D", loungeService: "Premium Bar Catering" },
  { showTitle: "Macbeth (Matinee Weekend)", date: "July 19, 2026", seats: "Table 2, Seats A-B", loungeService: "Soft Drinks & Hors d'oeuvres" },
];

export default function SponsorDashboard() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Form states
  const [showTitle, setShowTitle] = useState("Macbeth (Matinee Weekend)");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("");
  const [service, setService] = useState("Premium Bar Catering");

  const handleBookLounge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !seats) return;
    const newBooking: Booking = {
      showTitle,
      date,
      seats,
      loungeService: service,
    };
    setBookings([...bookings, newBooking]);
    setDate("");
    setSeats("");
    setBookingOpen(false);
  };

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Patron Level Info */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] md:mb-[48px]">
        <div className="space-y-[8px]">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#635f41]" />
            <span className="text-xs uppercase tracking-widest text-[#466272]/70 font-semibold">PATRON LEVEL</span>
          </div>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Grand Patron VIP Portal</h2>
          <p className="text-[14px] text-[#466272]">
            Thank you for supporting our Macbeth production. Below are your VIP lounge perks and ticket reservations.
          </p>
        </div>
        <Badge className="bg-[#635f41]/10 text-[#635f41] border-[#635f41]/30 rounded-[4px] px-3 py-1.5 font-bold text-xs uppercase tracking-wider">
          Gold Supporter
        </Badge>
      </div>

      {/* Bookings & Reservations */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] p-[24px] space-y-[24px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e6e2dd]/80 pb-4">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif">My Lounge &amp; Ticket Bookings</h3>
            <p className="text-xs text-[#466272]/70">Current active table and seat reservations</p>
          </div>

          <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
            <DialogTrigger render={<Button size="sm" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] py-[10px] px-[20px] transition-all active:scale-95" />}>
              Book VIP Lounge Seats
            </DialogTrigger>
            <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272]">
              <form onSubmit={handleBookLounge}>
                <DialogHeader className="space-y-2">
                  <DialogTitle className="font-serif text-[#635f41]">Book VIP Lounge Seats</DialogTitle>
                  <DialogDescription className="text-[#466272]/85 text-xs">
                    Reserve seating inside the exclusive Matinee Club lounge for upcoming shows.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Performance / Show</label>
                    <Input
                      placeholder="e.g., Macbeth (Matinee Weekend)"
                      value={showTitle}
                      onChange={(e) => setShowTitle(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Reservation Date</label>
                    <Input
                      type="text"
                      placeholder="e.g., July 19, 2026"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Seats / Table Configuration</label>
                    <Input
                      placeholder="e.g., Table 3, Seats A-C"
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Lounge Service Level</label>
                    <Input
                      placeholder="e.g., Premium Bar Catering"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setBookingOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px]">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                    Book Reservation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {bookings.map((booking, idx) => (
            <div key={idx} className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-6 space-y-4">
              <div className="space-y-1">
                <Badge variant="outline" className="border-[#635f41]/25 text-[#635f41] bg-[#635f41]/5 rounded-[4px]">
                  VIP Lounge Seating
                </Badge>
                <h4 className="font-bold text-[18px] text-[#635f41] font-serif">{booking.showTitle}</h4>
                <p className="text-xs text-[#466272]/70 font-semibold">{booking.date}</p>
              </div>
              <div className="border-t border-[#e6e2dd]/80 pt-3 space-y-1.5 text-xs text-[#466272]/85">
                <p><span className="font-semibold text-[#635f41]">Seats:</span> {booking.seats}</p>
                <p><span className="font-semibold text-[#635f41]">Service:</span> {booking.loungeService}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Lounge Perks */}
      <section className="space-y-[16px]">
        <h3 className="font-bold text-[20px] text-[#635f41] font-serif mb-[16px]">Your Patron Perks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px]">
          <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-6 text-center space-y-3">
            <span className="w-12 h-12 rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41] mx-auto">
              <GlassWater className="w-5 h-5 text-[#635f41]" />
            </span>
            <h4 className="font-bold text-[#635f41]">VIP Wine Bar</h4>
            <p className="text-xs text-[#466272]/80 leading-relaxed">
              Complimentary house wine and select premium liquors during all Macbeth dress runs and performances.
            </p>
          </div>

          <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-6 text-center space-y-3">
            <span className="w-12 h-12 rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41] mx-auto">
              <Coffee className="w-5 h-5 text-[#635f41]" />
            </span>
            <h4 className="font-bold text-[#635f41]">Lounge Access</h4>
            <p className="text-xs text-[#466272]/80 leading-relaxed">
              Skip lines with our private backstage lobby lounge entry, open 90 minutes before opening night.
            </p>
          </div>

          <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-6 text-center space-y-3">
            <span className="w-12 h-12 rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41] mx-auto">
              <Gift className="w-5 h-5 text-[#635f41]" />
            </span>
            <h4 className="font-bold text-[#635f41]">Ensemble Invites</h4>
            <p className="text-xs text-[#466272]/80 leading-relaxed">
              Exclusive invitations to pre-performance script readings, cast meetups, and coordinate galas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
