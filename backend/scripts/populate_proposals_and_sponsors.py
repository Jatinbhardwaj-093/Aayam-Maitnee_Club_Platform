import sys
import os
from datetime import datetime, date
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from models import db, SharedEvent, SponsorAdRequest

def seed_data():
    with app.app_context():
        # Ensure table columns exist
        with db.engine.connect() as conn:
            for col, col_type in [
                ('submitter_name', 'VARCHAR(150)'),
                ('contact_email', 'VARCHAR(255)'),
                ('contact_phone', 'VARCHAR(50)'),
                ('budget', 'VARCHAR(100)'),
                ('proposal_type', 'VARCHAR(100)')
            ]:
                try:
                    conn.execute(text(f"ALTER TABLE shared_event ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception:
                    pass

        db.create_all()

        # Seed proposals with rich member pitches (including 2 from Aditi) and authentic sponsor pitches
        proposals_data = [
            # 1. Aditi Pitch 1
            {
                "title": "Navarasa Monologue Intensive & Emotional Subtext Masterclass",
                "description": "A 4-day intensive acting laboratory exploring classical Rasa Abhinaya (Bhayanaka, Shringara, Raudra, Karuna) and vocal resonance control for collegiate actors preparing for Autumn 2026 mainstage productions. Includes personalized monologue coaching and video feedback.",
                "location_or_link": "Aayam Black Box Studio, SAC",
                "submitter_name": "Aditi Sharma",
                "contact_email": "aditi.sharma@study.iitm.ac.in",
                "contact_phone": "+91 98450 12345",
                "budget": "₹20,000",
                "proposal_type": "Member Pitch",
                "status": "pending"
            },
            # 2. Aditi Pitch 2
            {
                "title": "Campus Monologue Competition & Dramatic Open Mic",
                "description": "A pan-campus dramatic monologue competition featuring student-written pieces and classical Hindi/English dramatic adaptations. Evaluated by alumni directors, with audience choice voting and certificate awards.",
                "location_or_link": "OAT Amphitheatre Steps",
                "submitter_name": "Aditi Sharma",
                "contact_email": "aditi.sharma@study.iitm.ac.in",
                "contact_phone": "+91 98450 12345",
                "budget": "₹30,000",
                "proposal_type": "Member Pitch",
                "status": "pending"
            },
            # 3. Sneha Das Pitch
            {
                "title": "Acoustic Folk Jam & Vocal Modulations",
                "description": "An intimate evening blending vocal breathing exercises, Hindustani folk chanting, and acoustic musical cues with Akord music society. Open to all society performers and freshers.",
                "location_or_link": "SAC Acoustic Room, IIT Madras",
                "submitter_name": "Sneha Das",
                "contact_email": "sneha.das@study.iitm.ac.in",
                "contact_phone": "+91 98301 77654",
                "budget": "₹25,000",
                "proposal_type": "Member Pitch",
                "status": "pending"
            },
            # 4. Samarth Shrivastava Pitch
            {
                "title": "Physical Movement & Navarasa Mime Masterclass",
                "description": "A 3-hour movement masterclass focusing on body language, character silhouette, and non-verbal physical theatre techniques led by senior choreographers.",
                "location_or_link": "Rehearsal Hall B - Studio 2",
                "submitter_name": "Samarth Shrivastava",
                "contact_email": "samarth.s@study.iitm.ac.in",
                "contact_phone": "+91 98712 33445",
                "budget": "₹35,000",
                "proposal_type": "Member Pitch",
                "status": "pending"
            },
            # 5. Utkarsh (Yuuhi) Pitch
            {
                "title": "Street Play Rhythms & Dholak Synchronization Masterclass",
                "description": "High-tempo workshop covering traditional dholak percussion patterns, rhythmic slogans, and circular crowd-gathering techniques for Nukkad Natak festivals.",
                "location_or_link": "OAT Courtyard, IIT Madras",
                "submitter_name": "Utkarsh (Yuuhi)",
                "contact_email": "utkarsh123@study.iitm.ac.in",
                "contact_phone": "+91 98102 99887",
                "budget": "₹18,000",
                "proposal_type": "Member Pitch",
                "status": "approved"
            },
            # 6. Sponsor Pitch: Red Bull India
            {
                "title": "Red Bull Campus Drama Lounge & Stage Energy Partner",
                "description": "Exclusive Energy Drink & Artist Hospitality Partner for Autumn 2026. Deliverables include a dedicated Red Bull Green Room lounge for performers, prominent logo placement on 5,000 physical playbills, and pop-up sampling counters during intermission breaks.",
                "location_or_link": "CLT Main Foyer & Green Room",
                "submitter_name": "Rohan Sharma (Red Bull India)",
                "contact_email": "partnerships@redbull.in",
                "contact_phone": "+91 98110 44321",
                "budget": "₹1,50,000",
                "proposal_type": "Sponsor Ad Proposal",
                "status": "pending"
            },
            # 7. Sponsor Pitch: FabIndia
            {
                "title": "FabIndia Ethnic Wardrobe & Stage Handloom Sponsorship",
                "description": "Stage Wardrobe Craft & Handloom Partner for historical productions including 'Karn Ki Yachika' and 'Ashadh Ka Ek Din'. Handcrafted drapes, dupattas, and stage textiles provided in exchange for playbill advertising and foyer banner exhibits.",
                "location_or_link": "CLT Main Stage",
                "submitter_name": "Ananya Deshmukh (FabIndia)",
                "contact_email": "campus@fabindia.net",
                "contact_phone": "+91 98201 88765",
                "budget": "₹85,000",
                "proposal_type": "Sponsor Ad Proposal",
                "status": "approved"
            },
            # 8. Sponsor Pitch: AudioCraft
            {
                "title": "AudioCraft Proscenium Sound & Wireless Consoles",
                "description": "Proscenium Sound & Hardware Partner providing wireless UHF microphones, stage monitors, and digital audio mixing consoles for all major Darpan 2026 festival performances.",
                "location_or_link": "Tech Booth CLT, IIT Madras",
                "submitter_name": "Vikram Malhotra (AudioCraft)",
                "contact_email": "support@audiocraft.in",
                "contact_phone": "+91 98402 77112",
                "budget": "₹1,20,000",
                "proposal_type": "Sponsor Ad Proposal",
                "status": "pending"
            },
            # 9. Sponsor Pitch: Zebronics
            {
                "title": "Zebronics Acoustic Audio Experience Sponsor",
                "description": "Acoustic stage sound monitors and rehearsal room soundbar systems for student production rehearsals in exchange for digital social media co-branding and tickets giveaway.",
                "location_or_link": "SAC Amphitheatre & CLT",
                "submitter_name": "Pooja Hegde (Zebronics)",
                "contact_email": "campus.alliances@zebronics.com",
                "contact_phone": "+91 98901 33221",
                "budget": "₹60,000",
                "proposal_type": "Sponsor Ad Proposal",
                "status": "pending"
            }
        ]

        # Clear and repopulate proposals
        for pdata in proposals_data:
            existing = SharedEvent.query.filter_by(title=pdata['title']).first()
            if not existing:
                p = SharedEvent(
                    title=pdata['title'],
                    description=pdata['description'],
                    location_or_link=pdata['location_or_link'],
                    submitter_name=pdata['submitter_name'],
                    contact_email=pdata['contact_email'],
                    contact_phone=pdata['contact_phone'],
                    budget=pdata['budget'],
                    proposal_type=pdata['proposal_type'],
                    status=pdata['status']
                )
                db.session.add(p)
            else:
                existing.description = pdata['description']
                existing.submitter_name = pdata['submitter_name']
                existing.contact_email = pdata['contact_email']
                existing.contact_phone = pdata['contact_phone']
                existing.budget = pdata['budget']
                existing.proposal_type = pdata['proposal_type']
                existing.status = pdata['status']
                existing.location_or_link = pdata['location_or_link']

        db.session.commit()
        print("Proposals and sponsor pitches successfully seeded.")

if __name__ == "__main__":
    seed_data()
