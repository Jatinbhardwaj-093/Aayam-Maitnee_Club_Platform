import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import app
from models import db, SponsorAdRequest

def seed_sponsor_ads():
    with app.app_context():
        # Ensure table exists
        db.create_all()

        existing_count = SponsorAdRequest.query.count()
        if existing_count > 0:
            print(f"SponsorAdRequest table already has {existing_count} records.")
            return

        sample_ads = [
            SponsorAdRequest(
                sponsor_name="Red Bull India",
                contact_person="Rohan Sharma (Brand Manager)",
                contact_email="rohan.sharma@redbull.co.in",
                contact_phone="+91 98110 44321",
                company_website="https://www.redbull.com/in-en",
                ad_title="Energy Lounge & Main Stage Playbill Cover",
                ad_category="Playbill Banner",
                target_event_name="Tamashbin Kathputliya Courtyard Staging",
                budget_offered="₹1,50,000",
                banner_image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                ad_description="Exclusive energy drink partner for backstage crew and front-row audience coupons on physical playbills.",
                status="Pending"
            ),
            SponsorAdRequest(
                sponsor_name="FabIndia Ethnic Craft",
                contact_person="Ananya Deshmukh (Sponsorship Head)",
                contact_email="sponsorships@fabindia.com",
                contact_phone="+91 98201 88765",
                company_website="https://www.fabindia.com",
                ad_title="Traditional Costume & Folk Aesthetic Partner",
                ad_category="Stage Sidecar",
                target_event_name="Karn Ki Yachika Verse Play",
                budget_offered="₹85,000",
                banner_image_url="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
                ad_description="Handcrafted silk shawls for stage costumes and prominent side-stage banner placements.",
                status="Approved"
            ),
            SponsorAdRequest(
                sponsor_name="Zebronics Sound Systems",
                contact_person="Vikram Rao (Marketing Director)",
                contact_email="events@zebronics.com",
                contact_phone="+91 97400 33211",
                company_website="https://zebronics.com",
                ad_title="Pro Acoustic & Wireless Mic Gear Sponsorship",
                ad_category="Digital Screen",
                target_event_name="Annual Aayam Theatre Festival 2026",
                budget_offered="₹1,20,000",
                banner_image_url="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
                ad_description="Provision of wireless lapel microphones and digital banner loop on lobby displays before showtime.",
                status="Pending"
            ),
            SponsorAdRequest(
                sponsor_name="IIT Madras Alumni Guild",
                contact_person="Dr. K. Swaminathan (President)",
                contact_email="alumni.patron@iitm.ac.in",
                contact_phone="+91 94440 12890",
                company_website="https://alumni.iitm.ac.in",
                ad_title="Aayam Drama Endowment & Patron Page",
                ad_category="Playbill Banner",
                target_event_name="DDDJ Psychological Drama",
                budget_offered="₹2,00,000",
                banner_image_url="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
                ad_description="Full-page back cover sponsorship supporting student theatre production expenses.",
                status="Approved"
            ),
            SponsorAdRequest(
                sponsor_name="Chaayos Cafe & Tea Lounge",
                contact_person="Priya Malhotra (Regional Lead)",
                contact_email="partnerships@chaayos.com",
                contact_phone="+91 99100 55432",
                company_website="https://www.chaayos.com",
                ad_title="Intermission Kulhad Chai Stall & Ticket Discounts",
                ad_category="Patron Hall Logo",
                target_event_name="Samatvam Physical Theatre",
                budget_offered="₹45,000",
                banner_image_url="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
                ad_description="Pop-up refreshment counter during interval break and ₹50 tea discount voucher on all entry passes.",
                status="Pending"
            )
        ]

        db.session.bulk_save_objects(sample_ads)
        db.session.commit()
        print(f"Successfully seeded {len(sample_ads)} SponsorAdRequests into database.")

if __name__ == "__main__":
    seed_sponsor_ads()
