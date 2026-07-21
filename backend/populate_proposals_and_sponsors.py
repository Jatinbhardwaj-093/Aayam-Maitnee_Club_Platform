import sys
import os
from datetime import datetime
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import app
from models import db, SharedEvent, SponsorAdRequest

def seed_data():
    with app.app_context():
        # Add missing columns to shared_event table if needed
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
                    print(f"Added column {col} to shared_event")
                except Exception as e:
                    pass

        db.create_all()

        # Seed proposals with rich, detailed descriptions
        proposals_data = [
            {
                "title": "Acoustic Folk Jam & Poetry Slam Night",
                "description": "An intimate open-mic evening for ensemble members and acoustic artists to perform live poetry, folk music, and experimental verse drama in the courtyard lounge. Deliverables include live acoustic sound amplification, floor seating cushions for 60 attendees, open-mic registration for club members, and digital stream recording for the club archive.",
                "location_or_link": "Aayam Art Foyer & Courtyard",
                "submitter_name": "Sneha Das",
                "contact_email": "sneha.das@aayam.org",
                "contact_phone": "+91 98301 77654",
                "budget": "₹25,000",
                "proposal_type": "Member Pitch",
                "status": "pending"
            },
            {
                "title": "Physical Movement & Classical Mime Workshop",
                "description": "A 3-hour immersive movement masterclass focusing on body language, character silhouette, and non-verbal physical theatre techniques led by senior choreographers. Designed for 30 participating ensemble actors, covering stage presence, breath control, spatial geometry, and expressive gesture design.",
                "location_or_link": "Rehearsal Hall B - Studio 2",
                "submitter_name": "Samarth Shrivastava",
                "contact_email": "samarth.s@aayam.org",
                "contact_phone": "+91 98712 33445",
                "budget": "₹35,000",
                "proposal_type": "Member Pitch",
                "status": "pending"
            },
            {
                "title": "Red Bull Energy Stage & Playbill Showcase",
                "description": "Official Exclusive Energy Drink & Refreshment Partner for Aayam Cultural Season 2026. Deliverables include a dedicated Red Bull Green Room Lounge for cast and crew, prominent front-cover logo placement on 5,000 physical playbills across all mainstage drama shows, pop-up sampling counters during intermission breaks, and 200 complimentary VIP audience passes with branded coupon vouchers.",
                "location_or_link": "Main Stage Auditorium",
                "submitter_name": "Rohan Sharma (Red Bull India)",
                "contact_email": "rohan.sharma@redbull.co.in",
                "contact_phone": "+91 98110 44321",
                "budget": "₹1,50,000",
                "proposal_type": "Sponsor Ad Proposal",
                "status": "pending"
            },
            {
                "title": "FabIndia Traditional Costume & Folk Aesthetic Showcase",
                "description": "Title Wardrobe Craft & Folk Aesthetic Partner for historical verse plays including 'Karn Ki Yachika' and 'Tamashbin Kathputliya'. FabIndia provides handcrafted silk shawls, authentic handloom drapes, and traditional stage props valued at ₹85,000. Deliverables include dual side-stage banner displays, full-page catalog insertion in physical playbills, and exclusive pre-show foyer exhibition counter.",
                "location_or_link": "Royal Stage Foyer",
                "submitter_name": "Ananya Deshmukh (FabIndia)",
                "contact_email": "sponsorships@fabindia.com",
                "contact_phone": "+91 98201 88765",
                "budget": "₹85,000",
                "proposal_type": "Sponsor Ad Proposal",
                "status": "approved"
            }
        ]

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

        db.session.commit()

        # Seed sponsor ads with detailed descriptions
        sample_ads = [
            {
                "sponsor_name": "Red Bull India",
                "contact_person": "Rohan Sharma (Brand Manager)",
                "contact_email": "rohan.sharma@redbull.co.in",
                "contact_phone": "+91 98110 44321",
                "company_website": "https://www.redbull.com/in-en",
                "ad_title": "Energy Lounge & Main Stage Playbill Cover",
                "ad_category": "Playbill Banner",
                "target_event_name": "Tamashbin Kathputliya Courtyard Staging",
                "budget_offered": "₹1,50,000",
                "banner_image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                "ad_description": "Official Exclusive Energy Drink & Refreshment Partner for Aayam Cultural Season 2026. Deliverables include a dedicated Red Bull Green Room Lounge for cast and crew, prominent front-cover logo placement on 5,000 physical playbills across all mainstage drama shows, pop-up sampling counters during intermission breaks, and 200 complimentary VIP audience passes with branded coupon vouchers.",
                "status": "Pending"
            },
            {
                "sponsor_name": "FabIndia Ethnic Craft",
                "contact_person": "Ananya Deshmukh (Sponsorship Head)",
                "contact_email": "sponsorships@fabindia.com",
                "contact_phone": "+91 98201 88765",
                "company_website": "https://www.fabindia.com",
                "ad_title": "Traditional Costume & Folk Aesthetic Partner",
                "ad_category": "Stage Sidecar",
                "target_event_name": "Karn Ki Yachika Verse Play",
                "budget_offered": "₹85,000",
                "banner_image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
                "ad_description": "Title Wardrobe Craft & Folk Aesthetic Partner for historical verse plays including 'Karn Ki Yachika' and 'Tamashbin Kathputliya'. FabIndia provides handcrafted silk shawls, authentic handloom drapes, and traditional stage props valued at ₹85,000. Deliverables include dual side-stage banner displays, full-page catalog insertion in physical playbills, and exclusive pre-show foyer exhibition counter.",
                "status": "Approved"
            },
            {
                "sponsor_name": "Zebronics Sound Systems",
                "contact_person": "Vikram Rao (Marketing Director)",
                "contact_email": "events@zebronics.com",
                "contact_phone": "+91 97400 33211",
                "company_website": "https://zebronics.com",
                "ad_title": "Pro Acoustic & Wireless Mic Gear Sponsorship",
                "ad_category": "Digital Screen",
                "target_event_name": "Annual Aayam Theatre Festival 2026",
                "budget_offered": "₹1,20,000",
                "banner_image_url": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
                "ad_description": "Audio Technology & Acoustic Hardware Sponsorship for the Annual Aayam Theatre Festival 2026. Zebronics supplies 12 high-definition wireless lapel microphonic systems, stage monitor speakers, and digital soundboard equipment. Deliverables include digital banner loops displayed across auditorium lobby screens 30 minutes before showtime and brand attribution in all press releases.",
                "status": "Pending"
            },
            {
                "sponsor_name": "Chaayos Cafe & Tea Lounge",
                "contact_person": "Priya Malhotra (Regional Lead)",
                "contact_email": "partnerships@chaayos.com",
                "contact_phone": "+91 99100 55432",
                "company_website": "https://www.chaayos.com",
                "ad_title": "Intermission Kulhad Chai Stall & Ticket Discounts",
                "ad_category": "Patron Hall Logo",
                "target_event_name": "Samatvam Physical Theatre",
                "budget_offered": "₹45,000",
                "banner_image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
                "ad_description": "Hospitality & Intermission Refreshment Sponsorship for 'Samatvam Physical Theatre' season runs. Chaayos sets up an artisanal kulhad chai and snack bar in the theater foyer during 15-minute intermissions, plus offers ₹50 digital tea discount vouchers printed on all online entry passes.",
                "status": "Pending"
            }
        ]

        for sdata in sample_ads:
            existing = SponsorAdRequest.query.filter_by(ad_title=sdata['ad_title']).first()
            if not existing:
                s = SponsorAdRequest(
                    sponsor_name=sdata['sponsor_name'],
                    contact_person=sdata['contact_person'],
                    contact_email=sdata['contact_email'],
                    contact_phone=sdata['contact_phone'],
                    company_website=sdata['company_website'],
                    ad_title=sdata['ad_title'],
                    ad_category=sdata['ad_category'],
                    target_event_name=sdata['target_event_name'],
                    budget_offered=sdata['budget_offered'],
                    banner_image_url=sdata['banner_image_url'],
                    ad_description=sdata['ad_description'],
                    status=sdata['status']
                )
                db.session.add(s)
            else:
                existing.ad_description = sdata['ad_description']
                existing.contact_phone = sdata['contact_phone']
                existing.contact_email = sdata['contact_email']

        db.session.commit()
        print("Successfully updated detailed descriptions in database.")

if __name__ == "__main__":
    seed_data()
