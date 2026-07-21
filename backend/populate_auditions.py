import sys
import os
from datetime import datetime
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import app
from models import db, AuditionPosition, AuditionApplication

def seed_auditions_data():
    with app.app_context():
        # Ensure database tables exist
        db.create_all()

        # Check if audition positions already seeded
        if AuditionPosition.query.count() > 0:
            print("Audition positions already populated. Updating sample records...")

        # Clear existing audition positions and applications for fresh seed
        AuditionApplication.query.delete()
        AuditionPosition.query.delete()
        db.session.commit()

        # Seed Open Character & Crew Calling Positions
        positions_data = [
            {
                "production_name": "Tughlaq - Ensemble Production",
                "role_name": "Sultan Muhammad bin Tughlaq (Lead)",
                "role_category": "Character Role",
                "character_description": "Complex, vision-driven 14th-century ruler torn between idealism and ruthlessness. Requires powerful vocal presence, command over classical Hindustani diction, dramatic intensity, and emotional range.",
                "requirements": "Minimum 3 years stage acting experience. Strong voice modulation, soliloquy delivery, and physical stage authority.",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Tughlaq - Ensemble Production",
                "role_name": "Step-Mother / Queen Consort (Antagonist)",
                "role_category": "Character Role",
                "character_description": "Sharp-witted, politically calculating royal matriarch who challenges Tughlaq's court decrees. Requires sharp eye contact, royal posture, and crisp monologue delivery.",
                "requirements": "Strong theatrical background in classical drama or historical plays.",
                "slots_available": 1,
                "status": "Open Calling"
            },
            {
                "production_name": "Macbeth - Mainstage Production",
                "role_name": "Lead Stage Makeup & Special Effects Stylist",
                "role_category": "Makeup & Hair",
                "character_description": "Head makeup artist responsible for period prosthetics, battle scars, dark theatrical contours, and quick backstage transformations for Macbeth, Lady Macbeth, and the Three Witches.",
                "requirements": "Hands-on experience with theatrical SFX makeup, greasepaint, prosthetic application, and rapid multi-cast touchups.",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Tamashbin Kathputliya",
                "role_name": "Soundboard & Acoustic Design Operator",
                "role_category": "Backstage Technical",
                "character_description": "Technical audio operator responsible for live sound mixing, ambient folk instrument amplification, cue playback, and wireless microphone balancing during live mainstage runs.",
                "requirements": "Familiarity with digital audio mixing boards, dynamic mic setups, and live cue software.",
                "slots_available": 1,
                "status": "Open Calling"
            },
            {
                "production_name": "Andha Yug",
                "role_name": "Costume Assistant & Wardrobe Master",
                "role_category": "Costume",
                "character_description": "Backstage wardrobe assistant managing heritage drape costumes, armor fitting, quick-change coordination, and textile maintenance for a 25-person ensemble cast.",
                "requirements": "Keen eye for period costume fitting, garment repair, and fast-paced backstage organization.",
                "slots_available": 3,
                "status": "Open Calling"
            }
        ]

        created_positions = []
        for p in positions_data:
            pos = AuditionPosition(**p)
            db.session.add(pos)
            created_positions.append(pos)

        db.session.commit()
        print(f"Created {len(created_positions)} Audition Positions!")

        # Seed Candidates / Audition Applications per Position
        pos_tughlaq = created_positions[0] # Sultan Tughlaq
        pos_stepmother = created_positions[1] # Step-mother
        pos_makeup = created_positions[2] # Makeup Artist
        pos_sound = created_positions[3] # Sound Operator
        pos_costume = created_positions[4] # Costume Assistant

        applications_data = [
            # Candidate 1 for Sultan Tughlaq
            {
                "position_id": pos_tughlaq.id,
                "role_name": pos_tughlaq.role_name,
                "applicant_name": "Aarav Varma",
                "applicant_email": "aarav.v@aayam.org",
                "applicant_phone": "+91 98110 44321",
                "experience_level": "Ensemble Senior (5+ Years)",
                "portfolio_link": "https://youtube.com/watch?v=aarav_tughlaq_slate",
                "notes": "Performed lead roles in 'Ashadh Ka Ek Din' and 'Court Martial'. Specializing in intense classical monologues and voice modulation.",
                "status": "Shortlisted",
                "audition_date": "Aug 22, 2026 @ 4:30 PM"
            },
            # Candidate 2 for Sultan Tughlaq
            {
                "position_id": pos_tughlaq.id,
                "role_name": pos_tughlaq.role_name,
                "applicant_name": "Vikramaditya Roy",
                "applicant_email": "vikram.roy@aayam.org",
                "applicant_phone": "+91 98230 11988",
                "experience_level": "Intermediate (2 Years)",
                "portfolio_link": "https://drive.google.com/file/d/vikram_audition_reel",
                "notes": "Keen interest in playing tragic historical figures. Dedicated to daily rehearsal schedules and script memorization.",
                "status": "Pending Review",
                "audition_date": "Aug 23, 2026 @ 5:00 PM"
            },
            # Candidate 3 for Sultan Tughlaq
            {
                "position_id": pos_tughlaq.id,
                "role_name": pos_tughlaq.role_name,
                "applicant_name": "Kabir Mehta",
                "applicant_email": "kabir.m@aayam.org",
                "applicant_phone": "+91 98901 88223",
                "experience_level": "Ensemble Senior (4 Years)",
                "portfolio_link": "https://vimeo.com/kabir_dramatic_monologue",
                "notes": "Trained under National School of Drama workshop mentors. Strong physical theatre posture and projection.",
                "status": "Selected",
                "audition_date": "Aug 22, 2026 @ 3:00 PM"
            },
            # Candidate for Step-Mother
            {
                "position_id": pos_stepmother.id,
                "role_name": pos_stepmother.role_name,
                "applicant_name": "Sunita Rao",
                "applicant_email": "sunita.rao@aayam.org",
                "applicant_phone": "+91 98711 66543",
                "experience_level": "Ensemble Senior (6 Years)",
                "portfolio_link": "https://youtube.com/watch?v=sunita_dramatic_slate",
                "notes": "Experienced in antagonist roles. Eager to bring regal gravity and sharp diction to this iconic character.",
                "status": "Shortlisted",
                "audition_date": "Aug 24, 2026 @ 4:00 PM"
            },
            # Candidate 1 for Lead Stage Makeup
            {
                "position_id": pos_makeup.id,
                "role_name": pos_makeup.role_name,
                "applicant_name": "Ananya Sen",
                "applicant_email": "ananya.sen@aayam.org",
                "applicant_phone": "+91 98334 22109",
                "experience_level": "Professional Makeup Stylist (3 Years)",
                "portfolio_link": "https://instagram.com/ananyasen_sfx_makeup",
                "notes": "Certified SFX makeup artist with portfolio in battle scars, prosthetic noses, and historical contours.",
                "status": "Selected",
                "audition_date": "Aug 25, 2026 @ 2:00 PM"
            },
            # Candidate 2 for Lead Stage Makeup
            {
                "position_id": pos_makeup.id,
                "role_name": pos_makeup.role_name,
                "applicant_name": "Pooja Hegde",
                "applicant_email": "pooja.h@aayam.org",
                "applicant_phone": "+91 98450 99881",
                "experience_level": "Intermediate",
                "portfolio_link": "https://drive.google.com/folder/pooja_makeup_portfolio",
                "notes": "Specializing in period wigs, hair styling, and theatrical blush contours.",
                "status": "Pending Review",
                "audition_date": "Aug 25, 2026 @ 3:00 PM"
            },
            # Candidate for Soundboard Operator
            {
                "position_id": pos_sound.id,
                "role_name": pos_sound.role_name,
                "applicant_name": "Devansh Kulkarni",
                "applicant_email": "devansh.k@aayam.org",
                "applicant_phone": "+91 98199 44332",
                "experience_level": "Audio Tech Lead (3 Years)",
                "portfolio_link": "https://soundcloud.com/devansh_stage_soundtracks",
                "notes": "Experienced with Allen & Heath audio consoles, QLab cue triggering, and multi-mic balancing.",
                "status": "Selected",
                "audition_date": "Aug 26, 2026 @ 5:00 PM"
            },
            # Candidate for Costume Assistant
            {
                "position_id": pos_costume.id,
                "role_name": pos_costume.role_name,
                "applicant_name": "Riya Kapoor",
                "applicant_email": "riya.kapoor@aayam.org",
                "applicant_phone": "+91 98221 77889",
                "experience_level": "Textile & Wardrobe Assistant (2 Years)",
                "portfolio_link": "https://drive.google.com/file/d/riya_costume_design_portfolio",
                "notes": "Skilled in quick backstage costume changes, silk draping, and garment fitting for large ensembles.",
                "status": "Shortlisted",
                "audition_date": "Aug 27, 2026 @ 3:30 PM"
            }
        ]

        for app_item in applications_data:
            application = AuditionApplication(**app_item)
            db.session.add(application)

        db.session.commit()
        print(f"Created {len(applications_data)} Audition Applications!")

if __name__ == "__main__":
    seed_auditions_data()
