import sys
import os
import json
from datetime import datetime
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from models import db, AuditionPosition, AuditionApplication, Play, Volunteer, User

def seed_auditions_data():
    with app.app_context():
        # Ensure database tables exist
        db.create_all()

        # Clear existing audition positions, applications, and volunteers for fresh seed
        AuditionApplication.query.delete()
        AuditionPosition.query.delete()
        Volunteer.query.delete()
        db.session.commit()

        # Fetch play references if available
        play_hayavadana = Play.query.filter_by(title="Hayavadana").first()
        play_ashadh = Play.query.filter_by(title="Ashadh Ka Ek Din").first()
        play_charandas = Play.query.filter_by(title="Charandas Chor").first()

        # Seed 9 Audition Calling Positions across the 3 upcoming Indian plays
        positions_data = [
            # --- 3 POSITIONS FOR HAYAVADANA (Girish Karnad) ---
            {
                "production_name": "Hayavadana",
                "role_name": "Lead Protagonists (Devadatta & Kapila)",
                "role_category": "Performer",
                "character_description": "Devadatta (the pure intellect and scholarly mind) and Kapila (the athletic physique and instinctive drive). Requires exceptional physical stamina, psychological range, and ability to portray bodily dissociation following the head transposition.",
                "requirements": "Minimum 2-3 years stage experience. Strong voice modulation, classical Yakshagana movement discipline, and dramatic dialogue control.",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Hayavadana",
                "role_name": "Mask Craft & Prosthetic SFX Stylist",
                "role_category": "Creative Designer",
                "character_description": "Head makeup and mask craft specialist responsible for designing and fitting traditional horse-head masks, divine prosthetics for Goddess Kali, and quick backstage head-swap attachments.",
                "requirements": "Hands-on experience with theatrical prosthetics, fiberglass/latex mask fitting, and rapid stage makeup touchups.",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Hayavadana",
                "role_name": "Proscenium Lighting Master (Light Man & DMX Cues)",
                "role_category": "Technical Crew",
                "character_description": "Lighting console lead managing dynamic warm amber spotlights, mystical Kali shrine strobes, shadow play cutaways, and live proscenium cue execution.",
                "requirements": "Working knowledge of DMX consoles, stage spotlight rigging, and timed cue triggering.",
                "slots_available": 2,
                "status": "Open Calling"
            },

            # --- 3 POSITIONS FOR ASHADH KA EK DIN (Mohan Rakesh) ---
            {
                "production_name": "Ashadh Ka Ek Din",
                "role_name": "Lead Dramatic Performer (Kalidasa & Mallika)",
                "role_category": "Performer",
                "character_description": "Kalidasa (the conflicted poet torn between Himalayan rain and Ujjayini court royalty) and Mallika (the embodiment of selfless artistic devotion). Requires poetic Hindi diction, lyrical vulnerability, and deep emotional stillness.",
                "requirements": "Fluency in classical Hindustani theatrical prose, monologue pacing, and tender character interaction.",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Ashadh Ka Ek Din",
                "role_name": "Assistant Stage Director & Dramaturge",
                "role_category": "Director",
                "character_description": "Collaborate closely with Director Aditi on scene pacing, rain soundscape integration, actor blocking in open-air amphitheatres, and text dramaturgy.",
                "requirements": "Directorial concept note or previous assistant directorial credits in collegiate/regional drama.",
                "slots_available": 1,
                "status": "Open Calling"
            },
            {
                "production_name": "Ashadh Ka Ek Din",
                "role_name": "Period Costume & Kashmiri Wardrobe Stylist",
                "role_category": "Creative Designer",
                "character_description": "Wardrobe lead coordinating 4th-century Gupta-era coarse Himalayan wools, Pashmina drapes, and opulent Ujjayini royal silks for the cast.",
                "requirements": "Textile styling experience, historic drape knowledge, and fast-paced backstage fitting coordination.",
                "slots_available": 2,
                "status": "Open Calling"
            },

            # --- 3 POSITIONS FOR CHARANDAS CHOR (Habib Tanvir) ---
            {
                "production_name": "Charandas Chor",
                "role_name": "Lead Folk Actor & Satirist (Charandas)",
                "role_category": "Performer",
                "character_description": "Charandas, the witty, agile, and fiercely honest thief who cannot tell a lie. Requires comedic timing, folk song improvisation, crowd interaction, and high physical agility.",
                "requirements": "Experience in folk theatre, street drama, comedic character work, and high-energy stage presence.",
                "slots_available": 1,
                "status": "Open Calling"
            },
            {
                "production_name": "Charandas Chor",
                "role_name": "Live Dholak & Folk Percussionist",
                "role_category": "Technical Crew",
                "character_description": "Live acoustic musician providing continuous Chhattisgarhi folk rhythms, dholak/manjira sync, comic punctuation accents, and live choral backing.",
                "requirements": "Proficiency in traditional Indian percussion (Dholak, Tabla, or Duff) and live theatrical accompaniment.",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Charandas Chor",
                "role_name": "Stage Blocking & Props Master",
                "role_category": "Technical Crew",
                "character_description": "Backstage stage manager and props lead managing raw wooden cots, royal treasury chests, temple brass bells, and rapid scene transitions on the CLT stage.",
                "requirements": "Stage management organization, prop maintenance, and cue logistics management.",
                "slots_available": 2,
                "status": "Open Calling"
            }
        ]

        created_positions = []
        for p in positions_data:
            pos = AuditionPosition(**p)
            db.session.add(pos)
            created_positions.append(pos)

        db.session.commit()
        print(f"Created {len(created_positions)} Audition Calling Positions across the 3 Upcoming Plays!")

        # Seed Candidates / Audition Applications per Position with AI Scan Reports
        applications_data = [
            {
                "position_id": created_positions[0].id,
                "role_name": created_positions[0].role_name,
                "applicant_name": "Aarav Varma",
                "applicant_email": "aarav.v@aayam.org",
                "applicant_phone": "+91 98110 44321",
                "experience_level": "Ensemble Senior (4+ Years)",
                "portfolio_link": "https://youtube.com/watch?v=aarav_hayavadana_slate",
                "notes": "Trained in classical movement and psychological character dissociation. Performed in 'Tughlaq' and 'Andha Yug'.",
                "status": "Shortlisted",
                "audition_date": "Sep 22, 2026 @ 4:30 PM",
                "ai_transcript": "Devadatta is not just a brain; he is the burden of intellect separated from flesh.",
                "ai_blur": 12.4,
                "ai_brightness": 78.5,
                "ai_face_detected": True,
                "ai_report": json.dumps({
                    "overall_fit_score": 92,
                    "pros": ["Crisp classical Hindustani diction", "Strong facial control and stillness", "Extensive experience in tragic lead roles"],
                    "considerations": ["Requires partner rehearsal to calibrate physical contrast with Kapila"],
                    "recommendation": "Highly Recommended for Final In-Person Casting Call"
                })
            },
            {
                "position_id": created_positions[0].id,
                "role_name": created_positions[0].role_name,
                "applicant_name": "Vikramaditya Roy",
                "applicant_email": "vikram.roy@aayam.org",
                "applicant_phone": "+91 98230 11988",
                "experience_level": "Intermediate (2 Years)",
                "portfolio_link": "https://drive.google.com/file/d/vikram_audition_reel",
                "notes": "Special interest in physical theatre and masked folk delivery. Available for full technical week.",
                "status": "Pending Review",
                "audition_date": "Sep 23, 2026 @ 5:00 PM",
                "ai_transcript": "When the head forgets the arms that held it, which one is truly the man?",
                "ai_blur": 15.1,
                "ai_brightness": 82.0,
                "ai_face_detected": True,
                "ai_report": json.dumps({
                    "overall_fit_score": 84,
                    "pros": ["Good vocal projection and posture", "High rehearsal availability"],
                    "considerations": ["Voice modulation could be deeper for dramatic soliloquies"],
                    "recommendation": "Consider for Kapila or Ensemble Understudy"
                })
            },
            {
                "position_id": created_positions[1].id,
                "role_name": created_positions[1].role_name,
                "applicant_name": "Ananya Sen",
                "applicant_email": "ananya.sen@aayam.org",
                "applicant_phone": "+91 98334 22109",
                "experience_level": "Professional SFX Makeup Stylist",
                "portfolio_link": "https://instagram.com/ananyasen_theatre_masks",
                "notes": "Certified theatrical makeup artist with 3 years experience building latex masks and divine body paint for classical Indian drama.",
                "status": "Selected",
                "audition_date": "Sep 21, 2026 @ 2:00 PM",
                "ai_transcript": "Portfolio includes 18 custom mythological masks and rapid backstage touchup workflows.",
                "ai_blur": 8.5,
                "ai_brightness": 88.0,
                "ai_face_detected": True,
                "ai_report": json.dumps({
                    "overall_fit_score": 96,
                    "pros": ["Verified portfolio in prosthetic mask fabrication", "Prior mainstage experience with 20+ cast members"],
                    "considerations": ["None - top tier candidate"],
                    "recommendation": "Approve as Head Mask & Makeup Lead immediately"
                })
            },
            {
                "position_id": created_positions[2].id,
                "role_name": created_positions[2].role_name,
                "applicant_name": "Krishna Subramanian",
                "applicant_email": "23f1000655@ds.study.iitm.ac.in",
                "applicant_phone": "+91 98110 55432",
                "experience_level": "Technical Crew Lead (3 Years)",
                "portfolio_link": "https://drive.google.com/file/d/krishna_dmx_console_demo",
                "notes": "Experienced lighting console programmer for CLT Auditorium and open-air theatrical rigs. Specialized in warm incandescent dimming.",
                "status": "Selected",
                "audition_date": "Sep 20, 2026 @ 6:00 PM",
                "ai_transcript": "Programmed 45 cues on ChamSys and ETC consoles with zero misfires.",
                "ai_blur": 9.2,
                "ai_brightness": 85.0,
                "ai_face_detected": True,
                "ai_report": json.dumps({
                    "overall_fit_score": 95,
                    "pros": ["In-house lighting master with verified DMX expertise", "Familiar with CLT electrical layout"],
                    "considerations": ["Coordinate with soundboard for live cue handoffs"],
                    "recommendation": "Assign as Lighting Console Master"
                })
            },
            {
                "position_id": created_positions[3].id,
                "role_name": created_positions[3].role_name,
                "applicant_name": "Pooja Hegde",
                "applicant_email": "pooja.h@aayam.org",
                "applicant_phone": "+91 98450 99881",
                "experience_level": "Senior Dramatic Artist (4 Years)",
                "portfolio_link": "https://youtube.com/watch?v=pooja_ashadh_mallika",
                "notes": "Deep reverence for Mohan Rakesh's prose. Performed Mallika's Act 3 soliloquy in university fest.",
                "status": "Shortlisted",
                "audition_date": "Sep 24, 2026 @ 3:30 PM",
                "ai_transcript": "Maine prem kiya hai... aur prem kisi ke shashan mein bandh kar nahi rehta.",
                "ai_blur": 11.0,
                "ai_brightness": 81.0,
                "ai_face_detected": True,
                "ai_report": json.dumps({
                    "overall_fit_score": 94,
                    "pros": ["Exceptional emotional depth and fragile intensity", "Authentic classical Hindi pronunciation"],
                    "considerations": ["Ensure acoustic projection across OAT open-air spaces"],
                    "recommendation": "Shortlisted for Principal Role of Mallika"
                })
            },
            {
                "position_id": created_positions[6].id,
                "role_name": created_positions[6].role_name,
                "applicant_name": "Devansh Khurana",
                "applicant_email": "devansh.k@aayam.org",
                "applicant_phone": "+91 98223 99812",
                "experience_level": "Folk Performer & Satirist (3 Years)",
                "portfolio_link": "https://vimeo.com/devansh_charandas_audition",
                "notes": "High energy folk clowning, comic timing, and crowd banter skills. Trained in Rajasthani folk theatre.",
                "status": "Shortlisted",
                "audition_date": "Oct 02, 2026 @ 5:30 PM",
                "ai_transcript": "Guru ji, chaar niyam to main nibha lunga... par jhooth na bolne ka niyam mat maango!",
                "ai_blur": 10.5,
                "ai_brightness": 84.0,
                "ai_face_detected": True,
                "ai_report": json.dumps({
                    "overall_fit_score": 91,
                    "pros": ["Natural comedic timing", "Superb physical agility and expressive facial mimicry"],
                    "considerations": ["Maintain rhythm sync with live dholak"],
                    "recommendation": "Recommended for Charandas / Ensemble Comic Lead"
                })
            }
        ]

        for app_item in applications_data:
            application = AuditionApplication(**app_item)
            db.session.add(application)

        # Seed Production Crew Volunteer Applications
        volunteers_data = [
            {
                "play_id": play_hayavadana.id if play_hayavadana else 7,
                "applicant_name": "S. Sri Vaishnavi",
                "applicant_email": "21f3001698@ds.study.iitm.ac.in",
                "applicant_phone": "+91 98110 77665",
                "department": "Stage Management & Blocking",
                "availability": "10+ Hours / Week",
                "notes": "Excited to assist with Yakshagana chorus movement and backstage actor cue callouts.",
                "status": "Approved & Assigned"
            },
            {
                "play_id": play_hayavadana.id if play_hayavadana else 7,
                "applicant_name": "Chirag Kumar",
                "applicant_email": "21f1001111@ds.study.iitm.ac.in",
                "applicant_phone": "+91 98221 33445",
                "department": "Sound & Foley",
                "availability": "6-8 Hours / Week",
                "notes": "Can manage stage microphones, bell chimes, and live acoustic feedback loops.",
                "status": "Approved & Assigned"
            },
            {
                "play_id": play_ashadh.id if play_ashadh else 8,
                "applicant_name": "Swati Singh",
                "applicant_email": "23f1000300@ds.study.iitm.ac.in",
                "applicant_phone": "+91 98332 55667",
                "department": "Costumes & Makeup",
                "availability": "8 Hours / Week",
                "notes": "Handcrafting ancient Himalayan pashmina shawls and royal Ujjayini court attire.",
                "status": "Approved & Assigned"
            },
            {
                "play_id": play_ashadh.id if play_ashadh else 8,
                "applicant_name": "Anshi Jain",
                "applicant_email": "23f1000200@ds.study.iitm.ac.in",
                "applicant_phone": "+91 98443 66778",
                "department": "Props & Set Design",
                "availability": "5-8 Hours / Week",
                "notes": "Creating realistic birch bark manuscripts, clay deer fawns, and wooden writing desks.",
                "status": "Approved & Assigned"
            },
            {
                "play_id": play_charandas.id if play_charandas else 9,
                "applicant_name": "Sneha Das",
                "applicant_email": "23f1000100@ds.study.iitm.ac.in",
                "applicant_phone": "+91 98554 77889",
                "department": "Marketing & Audience Relations",
                "availability": "5 Hours / Week",
                "notes": "Designing Darpan festival posters, social media promos, and ticketing crowd control.",
                "status": "Pending Review"
            },
            {
                "play_id": play_charandas.id if play_charandas else 9,
                "applicant_name": "Kanishk Mishra",
                "applicant_email": "kanishk.mishra@handle.com",
                "applicant_phone": "+91 98665 88990",
                "department": "Lighting & FX (Light Man)",
                "availability": "8-10 Hours / Week",
                "notes": "Assisting Krishna with CLT spotlight tracking and quick stage wash transitions.",
                "status": "Approved & Assigned"
            }
        ]

        for v_item in volunteers_data:
            vol = Volunteer(**v_item)
            db.session.add(vol)

        db.session.commit()
        print(f"Created {len(applications_data)} Audition Applications and {len(volunteers_data)} Production Crew Volunteer Records!")

if __name__ == "__main__":
    seed_auditions_data()

