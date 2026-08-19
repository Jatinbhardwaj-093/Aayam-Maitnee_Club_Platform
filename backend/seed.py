import os
from datetime import datetime, date, time
from werkzeug.security import generate_password_hash
from app import app
from models import db, User, Role, Admin, Event, Play

def seed_database():
    print("Starting database seeding with scraped Aayam (IIT Madras BS) data...")
    
    # 1. Recreate tables
    db.drop_all()
    db.create_all()
    print("Database tables recreated successfully.")
    
    # 2. Add Roles
    roles = {
        'maintainer': Role(name="Core Maintainer"),
        'director': Role(name="Director Coordinator"),
        'sponsor': Role(name="Sponsorship & Outreach Lead"),
        'coordinator': Role(name="Production Coordinator"),
        'actor': Role(name="Lead Actor & Member"),
        'artist': Role(name="Design Head"),
        'member': Role(name="Member")
    }
    
    for r in roles.values():
        db.session.add(r)
    db.session.commit()
    print("Roles seeded.")
    
    # 3. Add Real Aayam IITM Members (Executive Committee & Mentors)
    users_data = [
        ("Abay Nandhiga", "23f2000668", "abay123", "maintainer", "22", "IIT Madras BS Campus", "Chennai", "Tamil Nadu", "India", "+91 98765 23001",
         "Secretary of Aayam - IIT Madras BS Drama Society. Directing society operations, stagecraft productions, and national festival representations.",
         "Directing, Playwriting, Society Leadership", "Nandhiga", "+91 98765 23002",
         "/aayam_assets/profiles/abay_nandhiga.jpg"),
         
        ("Yuuhi", "21f1005042", "utkarsh123", "maintainer", "23", "IIT Madras BS Campus", "Chennai", "Tamil Nadu", "India", "+91 98765 21005",
         "Deputy Secretary of Aayam. Lead performer in Nukkad Natak street plays and stage productions.",
         "Street Play, Acting, Script Supervision", "Yuuhi Family", "+91 98765 21006",
         "/aayam_assets/profiles/abay_nandhiga.jpg"),
         
        ("Samarth Shrivastava", "21f1002840", "samarth123", "coordinator", "22", "Aayam Hub, IITM BS", "Chennai", "Tamil Nadu", "India", "+91 98765 21002",
         "Chief Coordinator of Aayam. Overseeing production logistics, stage design, and inter-collegiate drama fests.",
         "Production Logistics, Stage Lighting, Auditions", "Shrivastava", "+91 98765 21003",
         "/aayam_assets/profiles/samarth_shrivastava.jpg"),

        ("Krishna Subramanian", "23f1000655", "krishna123", "coordinator", "21", "IITM BS Campus", "Chennai", "Tamil Nadu", "India", "+91 98765 23006",
         "Dept. Chief Coordinator. Coordinating technical lighting boards, acoustic soundscapes, and live cue management.",
         "Technical Crew, DMX Lighting, Sound Design", "Subramanian", "+91 98765 23007",
         "/aayam_assets/profiles/krishna_subramanian.jpg"),

        ("Kaushal Raj", "22f3003301", "kaushal123", "sponsor", "23", "Aayam Outreach Cell", "Bengaluru", "Karnataka", "India", "+91 98765 22003",
         "Outreach & Sponsorship Head. Building partnerships with corporate sponsors and patron circles for Aayam plays.",
         "Sponsorship, Corporate Partnerships, Brand Events", "Raj", "+91 98765 22004",
         "/aayam_assets/profiles/sneha_das.jpg"),

        ("Sneha Das", "23f1000100", "sneha123", "artist", "22", "IITM Art Studio", "Kolkata", "West Bengal", "India", "+91 98765 23010",
         "Design Head at Aayam. Painting scenic backdrops, prop design, and visual brand identity for productions.",
         "Scenic Design, Set Painting, Poster Design", "Das", "+91 98765 23011",
         "/aayam_assets/profiles/sylene_bansal.jpg"),

        ("Anshi Jain", "23f1000200", "anshi123", "artist", "21", "Aayam PR Wing", "Jaipur", "Rajasthan", "India", "+91 98765 23020",
         "PR Head. Leading public relations, media engagement, and community audience growth across campuses.",
         "Public Relations, Social Media, Audience Curation", "Jain", "+91 98765 23021",
         "/aayam_assets/profiles/chirag_kumar.jpg"),

        ("Swati Singh", "23f1000300", "swati123", "maintainer", "22", "Aayam Tech Team", "New Delhi", "Delhi", "India", "+91 98765 23030",
         "Web Admin & Tech Lead. Maintaining digital member roster, booking engines, and online portal infrastructure.",
         "Full-Stack Web Dev, Database Management, UI Design", "Singh", "+91 98765 23031",
         "/aayam_assets/profiles/swati_singh.jpg"),

        ("Tanu Kurade", "21f1005637", "tanu123", "director", "24", "Aayam Acting Wing", "Mumbai", "Maharashtra", "India", "+91 98765 21056",
         "Mentor (Acting). Conducting method acting workshops, dialogue modulation, and character breakdown sessions.",
         "Method Acting, Voice Modulation, Character Work", "Kurade", "+91 98765 21057",
         "/aayam_assets/profiles/tanu_kurade.jpg"),

        ("S. Sri Vaishnavi", "21f3001698", "vaishnavi123", "director", "24", "Aayam Direction Cell", "Hyderabad", "Telangana", "India", "+91 98765 21016",
         "Mentor (Directing). Directing multi-act stage plays, script adaptation, and classical blocking design.",
         "Directing, Script Adaptation, Blocking", "Vaishnavi", "+91 98765 21017",
         "/aayam_assets/profiles/vaishnavi_srivastava.jpg"),

        ("Esha Hinde", "esha.hinde", "esha123", "artist", "23", "Aayam Styling & Props", "Pune", "Maharashtra", "India", "+91 98765 21018",
         "Costume & Production Coordinator. Specializing in period costume design, prop curation, and backstage styling.",
         "Costume Design, Props Curation, Stage Styling", "Hinde", "+91 98765 21019",
         "/aayam_assets/profiles/esha_hinde.jpg"),

        ("Kanishk Mishra", "kanishk.mishra", "kanishk123", "director", "24", "Aayam Technical Cell", "Delhi", "Delhi", "India", "+91 98765 21020",
         "Stage & Technical Director. Managing auditorium acoustics, lighting rigs, and acoustic set construction.",
         "Stage Direction, Acoustic Rigs, Technical Cues", "Mishra", "+91 98765 21021",
         "/aayam_assets/profiles/kanishk_mishra.jpg"),

        ("Aditi", "aditi.drama", "aditi123", "actor", "22", "Aayam Acting Wing", "Bengaluru", "Karnataka", "India", "+91 98765 21022",
         "Principal Dramatic Actress. Featured in contemporary stage adaptations and street play ensembles.",
         "Method Acting, Character Portrayal, Monologue Performance", "Aditi", "+91 98765 21023",
         "/aayam_assets/profiles/aditi_drama.jpg")
    ]
    
    created_users = {}
    for i, data in enumerate(users_data):
        name, email_prefix, password_plain, role_key, age, address, city, state, country, phone, bio, interest, emg_name, emg_phone, avatar = data
        email = f"{email_prefix}@ds.study.iitm.ac.in" if email_prefix.startswith("2") else f"{email_prefix}@handle.com"
        password_hashed = generate_password_hash(password_plain)
        
        user = User(
            member_id=f"MC-100{i+1}",
            name=name,
            email=email,
            password=password_hashed,
            age=age,
            address=address,
            city=city,
            state=state,
            country=country,
            phone=phone,
            pronouns="he/him" if i % 2 == 0 else "she/her",
            availability="Weekday evenings & weekend rehearsals",
            bio=bio,
            portfolio="https://sites.google.com/study.iitm.ac.in/aayam/about",
            interest=interest,
            status="Active",
            emergency_name=emg_name,
            emergency_phone=emg_phone,
            level="Ensemble Leader"
        )
        user.roles.append(roles[role_key])
        
        db.session.add(user)
        created_users[email_prefix] = user
        
    db.session.commit()
    print("Users seeded.")
    
    # 4. Add Admins
    admin_abay = Admin(user=created_users['23f2000668'], designation="Secretary Aayam", permissions="All")
    admin_utkarsh = Admin(user=created_users['21f1005042'], designation="Deputy Secretary", permissions="All")
    admin_samarth = Admin(user=created_users['21f1002840'], designation="Chief Coordinator", permissions="Logistics, Stage")
    admin_swati = Admin(user=created_users['23f1000300'], designation="Web Admin & Tech Lead", permissions="Portal, DB")
    
    db.session.add(admin_abay)
    db.session.add(admin_utkarsh)
    db.session.add(admin_samarth)
    db.session.add(admin_swati)
    db.session.commit()
    print("Admins seeded.")
    
    # 5. Seed Real Aayam IITM Plays
    plays_data = [
        {
            "title": "Karn Ki Yachika",
            "status": "SELLING FAST",
            "status_color": "bg-emerald-50 text-emerald-700 border-emerald-200",
            "description": "A monumental classical drama exploring Karn's moral dilemma, honor, and destiny on the battleground of Kurukshetra.",
            "director": "S. Sri Vaishnavi",
            "cast": "Abay Nandhiga, Utkarsh (Yuuhi), Samarth Shrivastava",
            "season": "2026 Production Season",
            "image": "/aayam_assets/kky_user_5.jpg",
            "venue": "Kashiyatra Stage, IIT BHU / OAT IIT Madras",
            "dates": "Aug 12 - Sep 04, 2026",
            "runtime": "75 Mins (No Intermission)",
            "price": "Free Admission"
        },
        {
            "title": "Tamashbin Kathputliya",
            "status": "LIMITED TICKETS",
            "status_color": "bg-amber-50 text-amber-700 border-amber-200",
            "description": "A high-energy street play (Nukkad Natak) combining puppetry motifs, live dholak rhythms, and political satire.",
            "director": "Utkarsh (Yuuhi)",
            "cast": "Samarth Shrivastava, Krishna Subramanian, Swati Singh",
            "season": "2026 Production Season",
            "image": "/aayam_assets/tamashbin_user_1.jpg",
            "venue": "Open Air Theatre (OAT), IIT Madras",
            "dates": "Sep 12 - Sep 25, 2026",
            "runtime": "45 Mins (No Intermission)",
            "price": "Free Open Stage"
        },
        {
            "title": "DDDJ - Stage Production",
            "status": "TICKETS ON SALE",
            "status_color": "bg-purple-50 text-purple-700 border-purple-200",
            "description": "An intense proscenium drama exploring relationship dynamics, ambition, and modern societal pressures.",
            "director": "S. Sri Vaishnavi",
            "cast": "Abay Nandhiga, Krishna Subramanian, Sneha Das",
            "season": "2026 Production Season",
            "image": "/aayam_assets/dddj_user_1.jpg",
            "venue": "CLT Auditorium, IIT Madras",
            "dates": "Sep 28 - Oct 10, 2026",
            "runtime": "85 Mins (With Intermission)",
            "price": "Registration Required"
        },
        {
            "title": "Samatvam",
            "status": "TICKETS ON SALE",
            "status_color": "bg-blue-50 text-blue-700 border-blue-200",
            "description": "An intense ensemble drama exploring inner conflict, balance, and human empathy in modern high-pressure academic society.",
            "director": "Tanu Kurade",
            "cast": "Abay Nandhiga, Sneha Das, Anshi Jain",
            "season": "2026 Production Season",
            "image": "/aayam_assets/samatvam_user_1.jpg",
            "venue": "CLT Auditorium, IIT Madras",
            "dates": "Oct 05 - Oct 20, 2026",
            "runtime": "90 Mins (With Intermission)",
            "price": "Free Entry"
        },
        {
            "title": "Speak Up Tara",
            "status": "SELLING FAST",
            "status_color": "bg-emerald-50 text-emerald-700 border-emerald-200",
            "description": "A powerful social awareness play highlighting gender equality, courage, and standing up against societal silence.",
            "director": "S. Sri Vaishnavi",
            "cast": "Anshi Jain, Sneha Das, Swati Singh",
            "season": "2026 Production Season",
            "image": "/aayam_assets/speak_up_tara_user_1.webp",
            "venue": "Kashiyatra Festival Stage, IIT BHU",
            "dates": "Nov 02 - Nov 15, 2026",
            "runtime": "60 Mins (No Intermission)",
            "price": "Festival Pass Required"
        },
        {
            "title": "SNHJ - Virtual Play",
            "status": "ARCHIVED PLAY",
            "status_color": "bg-purple-50 text-purple-700 border-purple-200",
            "description": "Aayam's groundbreaking virtual play exploring online connections, remote storytelling, and digital human drama.",
            "director": "Abay Nandhiga",
            "cast": "Aayam Core Ensemble",
            "season": "Virtual Series 2024",
            "image": "/aayam_assets/aayam_site_img_6.jpg",
            "venue": "Aayam YouTube Channel & Portal",
            "dates": "Available Online",
            "runtime": "50 Mins",
            "price": "Free Stream"
        }
    ]
    
    for play in plays_data:
        p = Play(
            title=play['title'],
            status=play['status'],
            status_color=play['status_color'],
            description=play['description'],
            director=play['director'],
            cast=play['cast'],
            season=play['season'],
            image=play['image'],
            venue=play['venue'],
            dates=play['dates'],
            runtime=play['runtime'],
            price=play['price']
        )
        db.session.add(p)
    db.session.commit()
    print("Plays seeded.")
    
    # 6. Seed Real Aayam IITM Events
    events_data = [
        {
            "title": "August Orientation & Welcome Meetup",
            "description": "Kick-off orientation meetup for new and returning Aayam ensemble members. Icebreaker games, season roadmap preview, and team induction.",
            "category": "Meetups",
            "venue": "Aayam Hub & SAC Courtyard, IIT Madras",
            "event_date": date(2026, 8, 2),
            "start_time": time(17, 30),
            "end_time": time(19, 30),
            "max_participants": 80,
            "poster": "/aayam_assets/tamashbin_user_3.jpg",
            "status": "Concluded",
            "admin": admin_abay
        },
        {
            "title": "Natyashastra Movement & Body Control Workshop",
            "description": "Physical theatre workshop focusing on Angika Abhinaya (body gestures), spatial dynamics, and rhythmic stage movement.",
            "category": "Workshops",
            "venue": "Rehearsal Hall B, IIT Madras",
            "event_date": date(2026, 8, 5),
            "start_time": time(16, 0),
            "end_time": time(18, 30),
            "max_participants": 40,
            "poster": "/aayam_assets/samatvam_user_4.jpg",
            "status": "Concluded",
            "admin": admin_samarth
        },
        {
            "title": "Sunday Chai & Monologue Jamming Meetup",
            "description": "Relaxed weekend meetup for ensemble actors to perform short 2-minute monologues, receive peer feedback, and share chai.",
            "category": "Meetups",
            "venue": "OAT Amphitheatre Lawns, IIT Madras",
            "event_date": date(2026, 8, 9),
            "start_time": time(16, 30),
            "end_time": time(18, 30),
            "max_participants": 50,
            "poster": "/aayam_assets/kky_user_2.jpg",
            "status": "Concluded",
            "admin": admin_utkarsh
        },
        {
            "title": "Stage Lighting & DMX Rigging Masterclass",
            "description": "Technical crew masterclass covering DMX lighting consoles, spot gels, color temperatures, and cue timing for live plays.",
            "category": "Workshops",
            "venue": "CLT Main Auditorium Tech Booth, IIT Madras",
            "event_date": date(2026, 8, 12),
            "start_time": time(14, 0),
            "end_time": time(17, 0),
            "max_participants": 35,
            "poster": "/aayam_assets/krishna_subramanian.jpg",
            "status": "Concluded",
            "admin": admin_samarth
        },
        {
            "title": "Musimprov (with Akord) - Musical Improv Session",
            "description": "A vibrant joint session with Akord music club blending spontaneous theatrical improv with live vocal rhythms.",
            "category": "Workshops",
            "venue": "Student Activity Centre (SAC), IIT Madras",
            "event_date": date(2026, 8, 15),
            "start_time": time(17, 0),
            "end_time": time(19, 30),
            "max_participants": 60,
            "poster": "/aayam_assets/tamashbin_user_3.jpg",
            "status": "Concluded",
            "admin": admin_abay
        },
        {
            "title": "August Script Reading Circle - Tamashbin & DDDJ",
            "description": "Group table-read session for the upcoming festival scripts. Actors assign roles and analyze dialogue subtext.",
            "category": "Meetups",
            "venue": "Aayam Conference Room 2, IITM Campus",
            "event_date": date(2026, 8, 23),
            "start_time": time(18, 0),
            "end_time": time(20, 30),
            "max_participants": 45,
            "poster": "/aayam_assets/dddj_user_3.jpg",
            "status": "Upcoming",
            "admin": admin_utkarsh
        },
        {
            "title": "Backstage Props & Set Crafting Social",
            "description": "Hands-on set design session. Painting backdrops, crafting stage props, and organizing wardrobe racks for the August showcase.",
            "category": "Meetups",
            "venue": "Aayam Art & Set Studio, IIT Madras",
            "event_date": date(2026, 8, 27),
            "start_time": time(15, 0),
            "end_time": time(18, 0),
            "max_participants": 40,
            "poster": "/aayam_assets/sneha_das.jpg",
            "status": "Upcoming",
            "admin": admin_samarth
        },
        {
            "title": "Aayam Monthly Ensemble Showcase & Open Mic",
            "description": "Monthly showcase performance featuring short plays, original street drama acts, and acoustic musical numbers.",
            "category": "Plays",
            "venue": "Open Air Theatre (OAT), IIT Madras",
            "event_date": date(2026, 8, 30),
            "start_time": time(18, 30),
            "end_time": time(21, 30),
            "max_participants": 200,
            "poster": "/aayam_assets/tamashbin_user_4.jpg",
            "status": "Upcoming",
            "admin": admin_abay
        },
        {
            "title": "Theatre Masterclass with Gyaneshwar Mishra",
            "description": "Exclusive masterclass on voice modulation, spatial awareness, and classical stage blocking.",
            "category": "Workshops",
            "venue": "CLT Seminar Room, IIT Madras",
            "event_date": date(2026, 9, 5),
            "start_time": time(10, 0),
            "end_time": time(14, 0),
            "max_participants": 40,
            "poster": "/aayam_assets/kky_user_2.jpg",
            "status": "Upcoming",
            "admin": admin_samarth
        },
        {
            "title": "Autumn Street Satire & Dholak Sync Lab",
            "description": "Intensive rhythm calibration lab for courtyard street drama percussion and high-projection choral dialogue.",
            "category": "Workshops",
            "venue": "SAC Courtyard, IIT Madras",
            "event_date": date(2026, 9, 12),
            "start_time": time(16, 30),
            "end_time": time(19, 0),
            "max_participants": 50,
            "poster": "/aayam_assets/tamashbin_user_1.jpg",
            "status": "Upcoming",
            "admin": admin_utkarsh
        },
        {
            "title": "Classical Monologue & Navarasa Intensive",
            "description": "Deep-dive session exploring the 9 dramatic rasas through mythological soliloquies and facial control.",
            "category": "Workshops",
            "venue": "Rehearsal Hall B, IIT Madras",
            "event_date": date(2026, 9, 18),
            "start_time": time(15, 0),
            "end_time": time(18, 0),
            "max_participants": 35,
            "poster": "/aayam_assets/kky_user_5.jpg",
            "status": "Upcoming",
            "admin": admin_abay
        },
        {
            "title": "Nukkad Natak Guidance Session with Om Bhope",
            "description": "Hands-on street play rehearsal covering crowd engagement, vocal projection, and formation changes.",
            "category": "Workshops",
            "venue": "OAT Stage Grounds, IIT Madras",
            "event_date": date(2026, 9, 24),
            "start_time": time(16, 0),
            "end_time": time(18, 30),
            "max_participants": 45,
            "poster": "/aayam_assets/tamashbin_user_4.jpg",
            "status": "Upcoming",
            "admin": admin_utkarsh
        },
        {
            "title": "Proscenium Tech Rehearsal & Live Cue Run",
            "description": "Full technical run-through with lighting boards, soundscapes, and backstage prop shifts before festival season.",
            "category": "Plays",
            "venue": "CLT Auditorium, IIT Madras",
            "event_date": date(2026, 9, 29),
            "start_time": time(17, 0),
            "end_time": time(21, 0),
            "max_participants": 100,
            "poster": "/aayam_assets/dddj_user_1.jpg",
            "status": "Upcoming",
            "admin": admin_samarth
        },
        {
            "title": "Darpan 2026 Annual Drama Festival",
            "description": "Aayam's signature annual festival featuring Abhinaya Mono-acting, Envisage Directorial, and ScreenKraft Script Writing competitions.",
            "category": "Plays",
            "venue": "Open Air Theatre & CLT, IIT Madras",
            "event_date": date(2026, 10, 5),
            "start_time": time(0, 0),
            "end_time": time(22, 0),
            "max_participants": 300,
            "poster": "/aayam_assets/dddj_user_3.jpg",
            "status": "Upcoming",
            "admin": admin_abay
        }
    ]
    
    for ev in events_data:
        e = Event(
            title=ev['title'],
            description=ev['description'],
            category=ev['category'],
            venue=ev['venue'],
            event_date=ev['event_date'],
            start_time=ev['start_time'],
            end_time=ev['end_time'],
            max_participants=ev['max_participants'],
            poster=ev['poster'],
            status=ev['status'],
            admin=ev['admin']
        )
        db.session.add(e)
    db.session.commit()
    print("Events seeded.")

    # 7. Seed Gallery Items (60 Authentic High-Res Play Photos matching website)
    from models import GalleryItem
    from scripts.seed_gallery_data import gallery_data

    for gi in gallery_data:
        item = GalleryItem(
            title=gi["title"],
            category=gi["category"],
            image_url=gi["image_url"],
            caption=gi["caption"],
            status=gi["status"],
            uploader_name=gi["uploader_name"]
        )
        db.session.add(item)
    db.session.commit()
    print("60 Gallery items seeded successfully.")

    # 8. Seed Notifications for All Users
    from models import Notification
    all_users = User.query.all()
    sample_notifications = [
        ("rehearsal", "Macbeth Dress Rehearsal Sync", "Technical dress run confirmed for July 07 at 4:00 PM in Rehearsal Hall B. Lighting cues and full costume required.", False),
        ("script", "Tamashbin Director's Script Released", "The updated Hindustani Street Play script with modified courtyard cues is available in the Script Vault.", False),
        ("logistics", "Stage Prop Checked Out", "Logistics lead confirmed checkout of gold banquet goblets and throne props for upcoming showcase.", True),
        ("workshop", "Natya Shastra Masterclass Pass", "Your registration for the upcoming physical theatre masterclass has been confirmed by the executive committee.", True)
    ]
    for u in all_users:
        for n_type, n_title, n_msg, n_read in sample_notifications:
            notif = Notification(recipient_id=u.id, type=n_type, title=n_title, message=n_msg, is_read=n_read)
            db.session.add(notif)
    db.session.commit()
    print("User notifications seeded successfully.")

    # 9. Seed Audition Positions & Applications
    from scripts.populate_auditions import seed_auditions_data
    seed_auditions_data()

    # 10. Seed Financial Records & Ledger
    from scripts.populate_financials import seed_financials_data
    seed_financials_data()

    # 11. Seed Proposals & Sponsor Ads
    from scripts.populate_proposals_and_sponsors import seed_data as seed_proposals
    seed_proposals()

    from scripts.populate_sponsor_ads import seed_sponsor_ads
    seed_sponsor_ads()

    # 12. Seed Schedules for ALL users
    from scripts.populate_schedules import seed_schedules_data
    seed_schedules_data()

    # 13. Seed Script Vault Playbooks
    from scripts.populate_scripts import seed_scripts_data
    seed_scripts_data()

    # 14. Setup Open Positions
    from scripts.setup_positions import run as setup_positions
    setup_positions()

    print("Database seeding with authentic Aayam IITM data, auditions, financials, proposals, schedules, and scripts completed successfully!")

if __name__ == "__main__":
    with app.app_context():
        seed_database()
