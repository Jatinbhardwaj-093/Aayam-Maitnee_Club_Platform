import { Link } from "react-router-dom";
import { ArrowRight, Star, Calendar, ShieldCheck, Ticket } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Performance {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Selling Fast" | "Sold Out" | "Opening Soon";
  description: string;
  type: string;
}

const performances: Performance[] = [
  {
    id: "p1",
    title: "Macbeth (Matinee Edition)",
    date: "July 12, 2026",
    time: "2:00 PM",
    location: "Main Auditorium",
    status: "Selling Fast",
    description: "An immersive, high-contrast adaptation of Shakespeare's classic tragedy utilizing modern glassmorphism lighting.",
    type: "Matinee Edition",
  },
  {
    id: "p2",
    title: "A Midsummer Night's Dream",
    date: "August 18, 2026",
    time: "7:30 PM",
    location: "Outdoor Amphitheater",
    status: "Opening Soon",
    description: "A magical outdoor performance set against a woodsy background with ambient lighting and live music.",
    type: "Standard Edition",
  },
];

interface Member {
  name: string;
  role: string;
  avatarLetter: string;
  bio: string;
  avatarUrl: string;
}

const team: Member[] = [
  { name: "Lakshya Hari", role: "Grand Patron & Sponsor", avatarLetter: "L", bio: "Generously funding Matinee performances and providing VIP lounge resources.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Jayesh Dave", role: "Lead Actor (Macbeth)", avatarLetter: "J", bio: "Guiding the creative ensemble and heading theatrical development.", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Siddharth Verma", role: "Production Coordinator", avatarLetter: "S", bio: "Ensuring props, scheduling, and stagecraft runs in perfect harmony.", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80" },
];

export default function Home() {
  return (
    <div className="space-y-[48px] font-sans text-[#666361]">
      {/* Hero Section */}
      <section className="relative rounded-[8px] overflow-hidden bg-[#EFE8E1] border border-[#DDD8CE] p-[32px] md:p-[64px] flex flex-col items-center text-center space-y-[24px]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E85F57]/10 via-transparent to-transparent pointer-events-none" />
        <Badge className="bg-[#353535]/10 text-[#353535] border-[#DDD8CE] hover:bg-[#353535]/20 px-[12px] py-[4px] text-xs font-semibold rounded-[4px]">
          Aayam Creative Network
        </Badge>
        <h1 className="text-[40px] md:text-[56px] font-bold font-serif text-[#353535] leading-[1.1] tracking-tight max-w-3xl mb-[16px]">
          Where Stories <span className="italic text-[#E85F57]">Come Alive</span>
        </h1>
        <p className="text-[16px] md:text-[18px] text-[#666361] max-w-2xl font-normal leading-relaxed">
          Step behind the velvet curtain. Experience high-stakes theatrical elegance, cutting-edge stagecraft, and members-only exclusivity at The Matinee Club.
        </p>
        <div className="flex flex-wrap gap-[16px] justify-center pt-[16px]">
          <Link 
            to="/schedule" 
            className={buttonVariants({ size: "lg", className: "bg-[#E85F57] hover:bg-[#E85F57]/90 text-[#2C2A28] font-semibold rounded-[8px] px-[40px] py-[16px] shadow-md transition-all active:scale-95" })}
          >
            Enter Aayam <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link 
            to="/auditions" 
            className={buttonVariants({ variant: "outline", size: "lg", className: "border-2 border-[#E85F57] text-[#E85F57] hover:bg-[#E85F57]/5 font-semibold rounded-[8px] px-[40px] py-[16px] transition-all active:scale-95" })}
          >
            View Open Castings
          </Link>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        <div className="bg-[#EFE8E1] border border-[#DDD8CE] p-[32px] rounded-[8px] space-y-[16px]">
          <span className="w-[40px] h-[40px] rounded-[4px] bg-[#353535]/10 flex items-center justify-center text-[#353535]">
            <Star className="w-5 h-5 text-[#353535]" />
          </span>
          <h2 className="text-[28px] font-bold font-serif text-[#353535] mb-[8px]">Illuminating the Human Experience</h2>
          <p className="text-[16px] text-[#666361] leading-relaxed">
            Our creative strategy balances editorial flair with technical precision. By bridging traditional stage sets with modern digital interfaces, we build worlds that are immersive, emotional, and unforgettable.
          </p>
        </div>
        <div className="bg-[#EFE8E1] border border-[#DDD8CE] p-[32px] rounded-[8px] space-y-[16px]">
          <span className="w-[40px] h-[40px] rounded-[4px] bg-[#353535]/10 flex items-center justify-center text-[#353535]">
            <ShieldCheck className="w-5 h-5 text-[#353535]" />
          </span>
          <h2 className="text-[28px] font-bold font-serif text-[#353535] mb-[8px]">Behind the Velvet Curtain</h2>
          <p className="text-[16px] text-[#666361] leading-relaxed">
            Whether you are a Lead Actor managing rehearsals, an Administrator logging prop transfers, or a Sponsor reservation lead, Aayam secures and aligns every detail from backstage to spotlight.
          </p>
        </div>
      </div>

      {/* Upcoming Performances */}
      <section className="space-y-[24px]">
        <div className="flex justify-between items-end mb-[32px]">
          <div>
            <h2 className="text-[32px] font-bold font-serif text-[#353535]">Upcoming Performances</h2>
            <p className="text-[14px] text-[#666361]/75">Tickets and reservations available for current season</p>
          </div>
          <Button variant="ghost" className="text-[#E85F57] hover:text-[#E85F57]/80 hover:bg-[#EFE8E1] hidden sm:flex font-semibold">
            View Full Season <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {performances.map((perf) => (
            <div key={perf.id} className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-[8px] overflow-hidden flex flex-col justify-between p-[24px] space-y-[24px] transition-all hover:shadow-md hover:border-[#E85F57]/40">
              <div className="space-y-[16px]">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="border-[#353535]/25 text-[#353535] bg-[#353535]/5 rounded-[4px]">
                    {perf.type}
                  </Badge>
                  <Badge className={`rounded-[4px] ${
                    perf.status === "Selling Fast" ? "bg-amber-600/10 text-amber-700 border-amber-600/20" :
                    perf.status === "Sold Out" ? "bg-red-600/10 text-red-700 border-red-600/20" :
                    "bg-emerald-600/10 text-emerald-700 border-emerald-600/20"
                  }`}>
                    {perf.status}
                  </Badge>
                </div>
                <h3 className="text-[28px] font-bold font-serif text-[#353535]">{perf.title}</h3>
                <p className="text-[14px] text-[#666361]/80 leading-relaxed">{perf.description}</p>
              </div>

              <div className="border-t border-[#DDD8CE] pt-[16px] flex flex-col gap-[8px]">
                <div className="flex items-center gap-[8px] text-[14px] text-[#666361]/70">
                  <Calendar className="w-4 h-4 text-[#E85F57]" />
                  <span>{perf.date} &bull; {perf.time}</span>
                </div>
                <div className="flex items-center gap-[8px] text-[14px] text-[#666361]/70 pb-[8px]">
                  <Ticket className="w-4 h-4 text-[#E85F57]" />
                  <span>Location: {perf.location}</span>
                </div>
                <Button size="sm" className="w-full bg-[#E85F57] text-[#2C2A28] hover:bg-[#E85F57]/90 font-semibold rounded-[8px] py-[10px]">
                  Book Tickets
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Team Section */}
      <section className="space-y-[24px]">
        <div className="text-center mb-[32px]">
          <h2 className="text-[32px] font-bold font-serif text-[#353535]">Meet Our Core Team</h2>
          <p className="text-[14px] text-[#666361]/75 max-w-lg mx-auto">The directors, artists, and patrons bringing the Aayam experience to life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {team.map((member, idx) => (
            <div key={idx} className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-[8px] p-[32px] text-center flex flex-col items-center space-y-[16px]">
              <div className="w-[64px] h-[64px] rounded-full overflow-hidden border border-[#353535]/30 flex-shrink-0 bg-gray-200">
                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#353535]">{member.name}</h3>
                <p className="text-[12px] text-[#666361]/70 font-semibold uppercase tracking-wider">{member.role}</p>
              </div>
              <p className="text-[14px] text-[#666361]/85 leading-relaxed italic">
                "{member.bio}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
