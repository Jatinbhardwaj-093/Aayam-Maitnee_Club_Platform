import os
from datetime import datetime, date, time
from werkzeug.security import generate_password_hash
from app import app
from models import db, User, Role, Admin, Event, Play

def seed_database():
    print("Starting database seeding...")
    
    # 1. Recreate tables
    db.drop_all()
    db.create_all()
    print("Database tables recreated successfully.")
    
    # 2. Add Roles
    roles = {
        'maintainer': Role(name="Core Maintainer"),
        'director': Role(name="Director Coordinator"),
        'sponsor': Role(name="Grand Patron & Sponsor"),
        'coordinator': Role(name="Production Coordinator"),
        'actor': Role(name="Lead Actor & Member"),
        'artist': Role(name="Scenic Artist"),
        'choreographer': Role(name="Choreographer"),
        'member': Role(name="Member")
    }
    
    for r in roles.values():
        db.session.add(r)
    db.session.commit()
    print("Roles seeded.")
    
    # 3. Add Users
    # Structure: (name, email_prefix, password_prefix, role_key, age, address, city, state, country, phone, bio, interest, emergency_name, emergency_phone)
    users_data = [
        ("Sneha Vyas", "sneha", "sneha123", "director", "34", "Flat 402, Sea Breeze, Juhu", "Mumbai", "Maharashtra", "India", "+91 98765 33333", 
         "Award-winning director from Mumbai with 15+ years of experience directing modern adaptions of Sanskrit classics.", 
         "Directing, Playwriting, Art Direction", "Vijay Vyas", "+91 98765 33334"),
         
        ("Kabir Mehta", "kabir", "kabir123", "maintainer", "29", "House 12, Block C, Vasant Kunj", "New Delhi", "Delhi", "India", "+91 98765 88888", 
         "Lead developer and technical coordinator, crafting immersive interactive stages and platform experiences.", 
         "Tech, lighting, web design, soundscapes", "Sanjay Mehta", "+91 98765 88889"),
         
        ("Lakshya Hari", "lakshya", "lakshya123", "sponsor", "45", "102 Villa, Indiranagar", "Bengaluru", "Karnataka", "India", "+91 98765 99999", 
         "Philanthropist and art lover based in Bangalore supporting classical drama and community art hubs.", 
         "Sponsorship, Patron Circle, Theatre Space Funding", "Meera Hari", "+91 98765 99998"),
         
        ("Siddharth Verma", "siddharth", "siddharth123", "coordinator", "27", "Row House 3, Baner Road", "Pune", "Maharashtra", "India", "+91 98765 77777", 
         "Ensuring backstage precision, from custom prop design to flawless lighting choreography.", 
         "Production coordination, Props, Lighting Crew", "Asha Verma", "+91 98765 77776"),
         
        ("Jayesh Dave", "jayesh", "jayesh123", "actor", "26", "A-305, Shanti Nagar", "Ahmedabad", "Gujarat", "India", "+91 98765 43210", 
         "Method actor specializing in intense protagonist roles. Acted in over 20 stage plays.", 
         "Acting, Voice Resonance, Script Reading", "Kiran Dave", "+91 98765 43211"),
         
        ("Amit Sharma", "amit", "amit123", "actor", "25", "21/5, Gomti Nagar", "Lucknow", "Uttar Pradesh", "India", "+91 98765 22222", 
         "Theatre enthusiast and classical vocalist. Bringing music and expression together on stage.", 
         "Acting, Classical Vocal Performance, Music Direction", "Ramesh Sharma", "+91 98765 22221"),
         
        ("Pooja Patel", "pooja", "pooja123", "artist", "28", "C-12, Vaishali Nagar", "Jaipur", "Rajasthan", "India", "+91 98765 11111", 
         "Creating magnificent, detailed set backdrops inspired by Indian heritage and mythology.", 
         "Scenic painting, Set Design, Costume Styling", "Rajesh Patel", "+91 98765 11112"),
         
        ("Rohan Sen", "rohan", "rohan123", "choreographer", "30", "4B, Southern Avenue", "Kolkata", "West Bengal", "India", "+91 98765 00000", 
         "Blending traditional mudras with modern physical theatre to tell stories through movement.", 
         "Choreography, Physical Theatre, Kathak Integration", "Debasish Sen", "+91 98765 00001"),
         
        ("Priya Nair", "priya", "priya123", "member", "24", "Flat 101, Palms Heights, Kochi", "Kochi", "Kerala", "India", "+91 98765 55555", 
         "Ensemble performer and expression artist focusing on classical dance and dramatic delivery.", 
         "Performer, Classical Dance, Modern Plays", "Unni Nair", "+91 98765 5554"),
         
        ("Arjun Kapoor", "arjun", "arjun123", "member", "28", "Sector 15, Vashi", "Navi Mumbai", "Maharashtra", "India", "+91 98765 66666", 
         "Stagewriter and dialogue writer with a strong focus on narrative pacing and local regional folklore.", 
         "Writing, Screenplay, Dramaturgy", "Deepika Kapoor", "+91 98765 66667")
    ]
    
    created_users = {}
    for i, data in enumerate(users_data):
        name, email_prefix, password_plain, role_key, age, address, city, state, country, phone, bio, interest, emg_name, emg_phone = data
        email = f"{email_prefix}@handle.com"
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
            availability="Weekday evenings & weekends",
            bio=bio,
            portfolio="https://portfolio.matinee.club/" + email_prefix,
            interest=interest,
            status="Active",
            emergency_name=emg_name,
            emergency_phone=emg_phone,
            level="Ensemble"
        )
        # Associate Role
        user.roles.append(roles[role_key])
        
        db.session.add(user)
        created_users[email_prefix] = user
        
    db.session.commit()
    print("Users and role associations seeded.")
    
    # 4. Add Admins
    admin_sneha = Admin(user=created_users['sneha'], designation="Director Coordinator", permissions="All")
    admin_kabir = Admin(user=created_users['kabir'], designation="Core Maintainer", permissions="All")
    admin_siddharth = Admin(user=created_users['siddharth'], designation="Production Coordinator", permissions="Backstage, Lights, Props")
    admin_amit = Admin(user=created_users['amit'], designation="Lead Actor & Casting Director", permissions="Casting, Auditions")
    admin_rohan = Admin(user=created_users['rohan'], designation="Choreographer & Stage Manager", permissions="Backstage, Choreography")
    admin_pooja = Admin(user=created_users['pooja'], designation="Scenic Art Lead", permissions="Props, Design")
    
    db.session.add(admin_sneha)
    db.session.add(admin_kabir)
    db.session.add(admin_siddharth)
    db.session.add(admin_amit)
    db.session.add(admin_rohan)
    db.session.add(admin_pooja)
    db.session.commit()
    print("Admins seeded.")
    
    # 5. Seed Plays (incorporating regional, stylistic, and genre diversity)
    plays_data = [
        {
            "title": "Tughlaq",
            "status": "SELLING FAST",
            "status_color": "bg-emerald-50 text-emerald-700 border-emerald-200",
            "description": "Girish Karnad's classic play exploring the visionary but chaotic reign of Muhammad bin Tughlaq. A timeless political allegory that resonates with modern times.",
            "director": "Sneha Vyas",
            "cast": "Jayesh Dave, Amit Sharma, Pooja Patel",
            "season": "Monsoon 2026 Season",
            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCAzuMBaCOUMEUXFsi58uX4Sk0JbT72vPkeMf7KwisCYFvuX3Bk8gP1e__uZ8B3G4bYBmYBQjlPftJgABVJuuHuLNh_AIDoUgyAwaSJBouCjuqcQ7quRshTI9hepIQebEmL3pvhyyO6hPnGW2vUGYrayYRqt1rRMyl1OCAIad0kKVUn46ZjCsSI_nQCNnUrcxx_B1Rvmvml5deoCtkUqY61szLjR8uoRvQhIHhNvsCHkKUY4niHP9cI",
            "venue": "Prithvi Theatre, Mumbai",
            "dates": "Aug 12 - Sep 04, 2026",
            "runtime": "120 Mins (With Intermission)",
            "price": "Tickets from ₹300"
        },
        {
            "title": "Andha Yug",
            "status": "LIMITED TICKETS",
            "status_color": "bg-amber-50 text-amber-700 border-amber-200",
            "description": "Dharamvir Bharati's epic anti-war play set on the final day of the Mahabharata war. It delves into the dark psychology of greed, vengeance, and moral collapse.",
            "director": "Sneha Vyas",
            "cast": "Amit Sharma, Rohan Sen, Jayesh Dave",
            "season": "Monsoon 2026 Season",
            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
            "venue": "Kamani Auditorium, Delhi",
            "dates": "Sep 15 - Oct 02, 2026",
            "runtime": "110 Mins (No Intermission)",
            "price": "Tickets from ₹250"
        },
        {
            "title": "Hayavadana",
            "status": "TICKETS ON SALE",
            "status_color": "bg-blue-50 text-blue-700 border-blue-200",
            "description": "A brilliant play by Girish Karnad exploring identity, completeness, and love through a mythical story of swapped heads. Combines Yakshagana folk performance with modern theatrical dialogue.",
            "director": "Kabir Mehta",
            "cast": "Priya Nair, Arjun Kapoor, Jayesh Dave",
            "season": "Monsoon 2026 Season",
            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
            "venue": "Ranga Shankara, Bengaluru",
            "dates": "Oct 10 - Oct 28, 2026",
            "runtime": "100 Mins (With Intermission)",
            "price": "Tickets from ₹350"
        },
        {
            "title": "Charandas Chor",
            "status": "SELLING FAST",
            "status_color": "bg-emerald-50 text-emerald-700 border-emerald-200",
            "description": "Habib Tanvir's masterpiece, a delightful folk comedy and satire adapted from a Rajasthani folktale about a thief with a strict vow of truth.",
            "director": "Rohan Sen",
            "cast": "Jayesh Dave, Priya Nair, Arjun Kapoor",
            "season": "Monsoon 2026 Season",
            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBtdENLvD3N-a9btMoGsPtbSbUQtSPaSBrEeP2Jgfyd3VportsleV-2pAckg6xgekm8mK9FSwhNkL_KQ8p3CMlW6We0Bai8RJB_wXYdN_uTzrFLc7KGbqCrUe53sL52qCIuiqWjHze9pJNKgNETpCUBMn9ceMimt2eXX6zjbAWVKTquXwKQYOAO2CwRSECu9qu2z0c_dqG32E2SNvcfhz2Jsq4-7G-3aPJUBUnLeNoEGkqT7zP5-WJb",
            "venue": "Shree Ram Centre, New Delhi",
            "dates": "Oct 05 - Oct 18, 2026",
            "runtime": "115 Mins (With Intermission)",
            "price": "Tickets from ₹200"
        },
        {
            "title": "Ebong Indrajit",
            "status": "LIMITED TICKETS",
            "status_color": "bg-amber-50 text-amber-700 border-amber-200",
            "description": "Badal Sircar's landmark absurdist play that redefined Indian theatre, capturing the existential angst, dreams, and conformity of post-independence urban youth.",
            "director": "Kabir Mehta",
            "cast": "Arjun Kapoor, Priya Nair, Amit Sharma",
            "season": "Winter 2026 Season",
            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
            "venue": "Academy of Fine Arts, Kolkata",
            "dates": "Nov 10 - Nov 25, 2026",
            "runtime": "90 Mins (No Intermission)",
            "price": "Tickets from ₹150"
        },
        {
            "title": "Sakharam Binder",
            "status": "TICKETS ON SALE",
            "status_color": "bg-blue-50 text-blue-700 border-blue-200",
            "description": "Vijay Tendulkar's raw and powerful Marathi classic exposing domestic power dynamics, gender roles, and hypocrisy in middle-class society.",
            "director": "Sneha Vyas",
            "cast": "Jayesh Dave, Priya Nair, Rohan Sen",
            "season": "Winter 2026 Season",
            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
            "venue": "Bal Gandharva Rang Mandir, Pune",
            "dates": "Dec 01 - Dec 15, 2026",
            "runtime": "130 Mins (With Intermission)",
            "price": "Tickets from ₹250"
        },
        {
            "title": "Karnabhari",
            "status": "SELLING FAST",
            "status_color": "bg-emerald-50 text-emerald-700 border-emerald-200",
            "description": "A highly stylized Sopanam-style physical theatre adaptation of Bhasa's classic Sanskrit play, exploring the tragic nobility, loyalty, and ultimate sacrifice of Karna.",
            "director": "Siddharth Verma",
            "cast": "Amit Sharma, Rohan Sen, Jayesh Dave",
            "season": "Winter 2026 Season",
            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuATbMC775hHvfLLb9F3mVPtw4K2dw6bGMuAuAuNqBovs8EsF9N3G3_w8RYPIzK24kl4nL3A2DRk0sT2WMSGIR67XDJ7SOl5T5_KuNWq0NeIzlmTVsTRR4TC3aqN2-IxIimwn6aModCBNDR65E1xTAZoR_gM5_7rOL2lpXligIvYygov1cKDqNOK9M9K-IxYwoxrN-btwTvrc9pE9DM1hl-jltrWvaKlcKIkUQJ3C3BLPAG1rjHfjMRy",
            "venue": "Fine Arts Hall, Kochi",
            "dates": "Dec 20 - Dec 30, 2026",
            "runtime": "80 Mins (No Intermission)",
            "price": "Tickets from ₹300"
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
    
    # 6. Seed Events (Plays, Workshops, Meetups)
    events_data = [
        {
            "title": "Tughlaq Premiere",
            "description": "The opening night of Tughlaq by Girish Karnad, showcasing under dramatic lighting.",
            "category": "Plays",
            "venue": "Prithvi Theatre, Mumbai",
            "event_date": date(2026, 8, 12),
            "start_time": time(19, 30),
            "end_time": time(21, 30),
            "max_participants": 200,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuBtdENLvD3N-a9btMoGsPtbSbUQtSPaSBrEeP2Jgfyd3VportsleV-2pAckg6xgekm8mK9FSwhNkL_KQ8p3CMlW6We0Bai8RJB_wXYdN_uTzrFLc7KGbqCrUe53sL52qCIuiqWjHze9pJNKgNETpCUBMn9ceMimt2eXX6zjbAWVKTquXwKQYOAO2CwRSECu9qu2z0c_dqG32E2SNvcfhz2Jsq4-7G-3aPJUBUnLeNoEGkqT7zP5-WJb",
            "status": "Upcoming",
            "admin": admin_sneha
        },
        {
            "title": "Natya Shastra Acting Workshop",
            "description": "Unlock standard acting methodologies, resonance, and mudras with veteran coordinator Sneha Vyas.",
            "category": "Workshops",
            "venue": "Studio Workshop Room, Mumbai",
            "event_date": date(2026, 8, 19),
            "start_time": time(10, 0),
            "end_time": time(13, 0),
            "max_participants": 20,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuAdWUP6RopdqRMW48GJ5lkG-OGGRusLe0GexKuJ9TiXT4XGPICqz7v2KG9L_mG1id42B-WgZLewLqL7Dd63Qz7tWK4ALX14zX6kuV392i6mruLaV7UVbRoBFHmPjcO24On54aXGBZgoS5KdsDqIBgE1kuL0NmuS6yzjrQNN6U9X3XdZ56zuBNTC77mDLHrSAon1yryXGD-erDERjIt19ILq-FKRUNicV1D1-ptPjvnGMEe1mMewddO7",
            "status": "Upcoming",
            "admin": admin_sneha
        },
        {
            "title": "Chai & Playwriting Meetup",
            "description": "An informal session to read new scripts, enjoy hot masala chai, and connect with regional performers.",
            "category": "Meetups",
            "venue": "Ensemble Lounge, Ahmedabad",
            "event_date": date(2026, 8, 30),
            "start_time": time(16, 0),
            "end_time": time(18, 0),
            "max_participants": 50,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuBuk8WjtWLoR2TuUYyoLkZfAiEHid8OpAJtGE5o8KgkUUP9SoIVxVCzYPUxOcxUARV5rNNTqimtr-yH4S_al391d2kCLDjx_Q_n58n2hhlaJmVXFjOZ7lPJPF52PuaoLWDCKRIog2WrCYyWULP4S5hLFZtbOb2sSpYvNwaZfeItTA9n7q8k1j2nPyROKOvHzUR0DteXxwfD2g2DY1J_53sJ4wUh7yLnB-RYHHZ9imWiLFOmgvka5l0M",
            "status": "Upcoming",
            "admin": admin_kabir
        },
        {
            "title": "Andha Yug Rehearsal Showcase",
            "description": "An open technical rehearsal enabling members to witness spotlight settings and block configurations.",
            "category": "Plays",
            "venue": "Kamani Auditorium, Delhi",
            "event_date": date(2026, 7, 1),
            "start_time": time(17, 0),
            "end_time": time(19, 30),
            "max_participants": 150,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuA3z6pEqHIVmyQdEqbmlRRMXVyiRc1z_kpgOpO51LwjrU9EWYzx-oqIgaPkBOEJZuInPLFJLKXs7KFPD49MQ3XJ6-NRrVAQUleAVxdoFJloZXowNrgindYj7j9ELtSb3VHuC283O1dvae53zV3CtaAgSVnmKY_F5_nzOGdgCM_LYCN8ctkh2VxR-fdPCb7Gdo70zZIxXYQZMTgrZ-xJ92cxlpNUTlbYdTf3_eW9PtjeFHTyEEULqWBk",
            "status": "Concluded",
            "admin": admin_sneha
        },
        {
            "title": "Sufi Music & Movement Masterclass",
            "description": "Integrate Sufi movements and rhythms into modern physical drama with Rohan Sen.",
            "category": "Workshops",
            "venue": "Ranga Shankara Studio, Bengaluru",
            "event_date": date(2026, 9, 5),
            "start_time": time(14, 0),
            "end_time": time(17, 0),
            "max_participants": 25,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuATbMC775hHvfLLb9F3mVPtw4K2dw6bGMuAuAuNqBovs8EsF9N3G3_w8RYPIzK24kl4nL3A2DRk0sT2WMSGIR67XDJ7SOl5T5_KuNWq0NeIzlmTVsTRR4TC3aqN2-IxIimwn6aModCBNDR65E1xTAZoR_gM5_7rOL2lpXligIvYygov1cKDqNOK9M9K-IxYwoxrN-btwTvrc9pE9DM1hl-jltrWvaKlcKIkUQJ3C3BLPAG1rjHfjMRy",
            "status": "Upcoming",
            "admin": admin_siddharth
        },
        {
            "title": "Yakshagana Physical Theatre Intensive",
            "description": "Learn the traditional footwork, dramatic expressions, and costume rhythms of Yakshagana with Kabir Mehta.",
            "category": "Workshops",
            "venue": "Ranga Shankara Studio, Bengaluru",
            "event_date": date(2026, 10, 15),
            "start_time": time(9, 0),
            "end_time": time(12, 0),
            "max_participants": 30,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
            "status": "Upcoming",
            "admin": admin_kabir
        },
        {
            "title": "Habib Tanvir Folk Satire Discussion",
            "description": "A panel discussion exploring the integration of rural Chhattisgarhi folk traditions into urban political satire.",
            "category": "Meetups",
            "venue": "Shree Ram Centre, New Delhi",
            "event_date": date(2026, 10, 8),
            "start_time": time(17, 30),
            "end_time": time(19, 30),
            "max_participants": 80,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuBtdENLvD3N-a9btMoGsPtbSbUQtSPaSBrEeP2Jgfyd3VportsleV-2pAckg6xgekm8mK9FSwhNkL_KQ8p3CMlW6We0Bai8RJB_wXYdN_uTzrFLc7KGbqCrUe53sL52qCIuiqWjHze9pJNKgNETpCUBMn9ceMimt2eXX6zjbAWVKTquXwKQYOAO2CwRSECu9qu2z0c_dqG32E2SNvcfhz2Jsq4-7G-3aPJUBUnLeNoEGkqT7zP5-WJb",
            "status": "Upcoming",
            "admin": admin_siddharth
        },
        {
            "title": "Badal Sircar Third Theatre Workshop",
            "description": "Understand Sircar's philosophy of Third Theatre: breaking the stage boundary and using open spaces.",
            "category": "Workshops",
            "venue": "Academy of Fine Arts, Kolkata",
            "event_date": date(2026, 11, 14),
            "start_time": time(14, 0),
            "end_time": time(17, 0),
            "max_participants": 40,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuCkdj8dZKXd7KCPEfHwJx7d8dv8AVc16bLqx_Fa77OIQmhTqukcXd2WDgJayuivLhn9h2pKeVblOrBnzeH4iZNV2Hc7Ai6WzKPJfD3Kj-Fj9C0R-atVf6NKYU5KIKzH_H_z0B7SCUzFkxoaDIoNvxVUOdezFBpsRK1ok9gn2liDaNoNmK1K2dPMrk5mQIpcFjwBK0DT20azXknFaYzsgretzQcXDgjzpeD_Oa1FDZ_Dmb_ywKKmRkz1",
            "status": "Upcoming",
            "admin": admin_kabir
        },
        {
            "title": "Marathi Realistic Drama Panel",
            "description": "Deconstructing Vijay Tendulkar's realistic masterpieces and their societal impact with Sneha Vyas.",
            "category": "Meetups",
            "venue": "Bal Gandharva Rang Mandir, Pune",
            "event_date": date(2026, 12, 5),
            "start_time": time(18, 0),
            "end_time": time(20, 0),
            "max_participants": 100,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuCFhh56JyFyLF08wchxPKsyhHqSdltIyUQmbvnM36afMwPrX-viKot2UF8WixHwwsB6_yr3DY4I7A1H2Zni9qGuPWojUJfSMHi-9ha_m7DCp2zmqpEOOJ2_EuFdjOI2bTlG-i2En3DPM6Q63oDPSTnQ76-vSPlw0GM8brJPhxU_AmlY6YM2w_8eTXnoW6PYDyXhq2RpqzGw48vFSVE6mF-XFPyFl6NPLNchnK-U-RX8YvaKmUEnhcKr",
            "status": "Upcoming",
            "admin": admin_sneha
        },
        {
            "title": "Sanskrit Drama Reading Session",
            "description": "An evening dedicated to reciting and analyzing classical Sanskrit theatrical scripts with our literary committee.",
            "category": "Meetups",
            "venue": "Ensemble Lounge, Ahmedabad",
            "event_date": date(2026, 8, 18),
            "start_time": time(18, 0),
            "end_time": time(20, 30),
            "max_participants": 30,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuBuk8WjtWLoR2TuUYyoLkZfAiEHid8OpAJtGE5o8KgkUUP9SoIVxVCzYPUxOcxUARV5rNNTqimtr-yH4S_al391d2kCLDjx_Q_n58n2hhlaJmVXFjOZ7lPJPF52PuaoLWDCKRIog2WrCYyWULP4S5hLFZtbOb2sSpYvNwaZfeItTA9n7q8k1j2nPyROKOvHzUR0DteXxwfD2g2DY1J_53sJ4wUh7yLnB-RYHHZ9imWiLFOmgvka5l0M",
            "status": "Upcoming",
            "admin": admin_kabir
        },
        {
            "title": "Modern Lighting Synchronization Workshop",
            "description": "A technical hands-on masterclass detailing contemporary DMX controls, spotlights, and software configuration.",
            "category": "Workshops",
            "venue": "Studio Workshop Room, Mumbai",
            "event_date": date(2026, 9, 10),
            "start_time": time(11, 0),
            "end_time": time(15, 0),
            "max_participants": 15,
            "poster": "https://lh3.googleusercontent.com/aida-public/AB6AXuAdWUP6RopdqRMW48GJ5lkG-OGGRusLe0GexKuJ9TiXT4XGPICqz7v2KG9L_mG1id42B-WgZLewLqL7Dd63Qz7tWK4ALX14zX6kuV392i6mruLaV7UVbRoBFHmPjcO24On54aXGBZgoS5KdsDqIBgE1kuL0NmuS6yzjrQNN6U9X3XdZ56zuBNTC77mDLHrSAon1yryXGD-erDERjIt19ILq-FKRUNicV1D1-ptPjvnGMEe1mMewddO7",
            "status": "Upcoming",
            "admin": admin_siddharth
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

    # Seed Shared Events (Proposals)
    from models import SharedEvent
    from datetime import datetime
    shared_events_data = [
        {
            "title": "Summer Gala Exhibition",
            "description": "An exclusive evening showcasing contemporary minimalist sculptures. The event aims to bring together local patrons and emerging artists.",
            "event_date": datetime(2026, 8, 15, 14, 0),
            "location_or_link": "Main Atrium, West Wing",
            "status": "pending",
            "submitter": created_users['priya']
        },
        {
            "title": "Abstract Art Symposium",
            "description": "A panel discussion exploring the roots and future of abstract art. Local and regional art critics discuss modern movements.",
            "event_date": datetime(2026, 9, 2, 10, 0),
            "location_or_link": "Workshop Flat 3B",
            "status": "approved",
            "submitter": created_users['jayesh']
        },
        {
            "title": "Local Sculptors Meetup",
            "description": "Informal gather for local sculptors to share methods, materials, and updates on community public art spaces.",
            "event_date": datetime(2026, 10, 10, 18, 30),
            "location_or_link": "Sculpture Studio",
            "status": "pending",
            "submitter": created_users['amit']
        }
    ]
    for se in shared_events_data:
        s = SharedEvent(
            title=se["title"],
            description=se["description"],
            event_date=se["event_date"],
            location_or_link=se["location_or_link"],
            status=se["status"],
            submitter=se["submitter"]
        )
        db.session.add(s)
    db.session.commit()
    print("Shared events seeded.")
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    with app.app_context():
        seed_database()
