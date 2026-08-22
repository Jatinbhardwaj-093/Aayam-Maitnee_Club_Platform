from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

user_roles = db.Table(
    "user_roles",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("role_id", db.Integer, db.ForeignKey("role.id"), primary_key=True),
)

user_labels = db.Table(
    "user_labels",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("label_id", db.Integer, db.ForeignKey("label.id"), primary_key=True),
)

class Label(db.Model):
    __tablename__ = "label"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    color = db.Column(db.String(50), nullable=True) # Optional color coding
    
    users = db.relationship("User", secondary=user_labels, back_populates="labels")


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.String(50), unique=True, nullable=True)
    name = db.Column(db.String(150), nullable=False)
    age = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password = db.Column(db.String(512), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    level = db.Column(db.String(50), nullable=True)
    area_of_interest = db.Column(db.Boolean, nullable=False, default=True)
    status = db.Column(db.String(20), default="Pending")

    # signup additions supporting Aayam JoinClubForm
    pronouns = db.Column(db.String(50), nullable=True, default='he/him')
    availability = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    portfolio = db.Column(db.String(200), nullable=True)
    emergency_name = db.Column(db.String(100), nullable=True)
    emergency_phone = db.Column(db.String(20), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    interest = db.Column(db.String(100), nullable=True)
    avatar_url = db.Column(db.Text, nullable=True)

    roles = db.relationship("Role", secondary=user_roles, back_populates="users")
    membership = db.relationship("Membership", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bookings = db.relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    feedbacks = db.relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    notifications = db.relationship("Notification", back_populates="recipient", cascade="all, delete-orphan")
    auditions = db.relationship("Audition", back_populates="user", cascade="all, delete-orphan")
    shared_events = db.relationship("SharedEvent", back_populates="submitter", cascade="all, delete-orphan")
    volunteer = db.relationship("Volunteer", back_populates="user", cascade="all, delete-orphan")
    participations = db.relationship("Participation", back_populates="user", cascade="all, delete-orphan")
    schedule_slots = db.relationship("ScheduleSlot", back_populates="user", cascade="all, delete-orphan")
    labels = db.relationship("Label", secondary=user_labels, back_populates="users")

    def to_dict(self):
        avatar_map = {
            "Abay Nandhiga": "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
            "Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg",
            "Utkarsh / Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg",
            "Utkarsh (Yuuhi)": "/aayam_assets/profiles/abay_nandhiga.jpg",
            "Samarth Shrivastava": "/aayam_assets/profiles/samarth_shrivastava.jpg",
            "Krishna Subramanian": "/aayam_assets/profiles/krishna_subramanian.jpg",
            "Harsh Aryan": "/aayam_assets/profiles/harsh_aryan.jpg",
            "Swati Singh": "/aayam_assets/profiles/swati_singh.jpg",
            "Sneha Das": "/aayam_assets/profiles/sylene_bansal.jpg",
            "Tanu Kurade": "/aayam_assets/profiles/tanu_kurade.jpg",
            "S. Sri Vaishnavi": "/aayam_assets/profiles/vaishnavi_srivastava.jpg",
            "Akanksha Kadam": "/aayam_assets/profiles/akanksha_kadam.jpg",
            "Anshi Jain": "/aayam_assets/profiles/chirag_kumar.jpg",
            "Kaushal Raj": "/aayam_assets/profiles/sneha_das.jpg",
            "Vaishnavi Srivastava": "/aayam_assets/profiles/vaishnavi_srivastava.jpg",
            "Gaurav": "/aayam_assets/profiles/chirag_kumar.jpg",
            "Shrit": "/aayam_assets/profiles/harsh_aryan.jpg",
            "Dipanshu Bist": "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
            "Neelotpala": "/aayam_assets/profiles/tanu_kurade.jpg",
            "Kanishk Mishra": "/aayam_assets/profiles/kanishk_mishra.jpg",
            "Chirag Kumar": "/aayam_assets/profiles/chirag_kumar.jpg",
            "Sylene Bansal": "/aayam_assets/profiles/sylene_bansal.jpg",
            "Esha Hinde": "/aayam_assets/profiles/esha_hinde.jpg",
            "Aditi": "/aayam_assets/profiles/aditi_drama.jpg"
        }
        avatar_url = self.avatar_url or avatar_map.get(self.name, "/aayam_assets/profiles/abay_nandhiga.jpg")

        roles_list = [r.name for r in self.roles]
        primary_role = roles_list[0] if roles_list else "Ensemble Member"

        # Determine tier and statement dynamically
        is_exec = any(k in primary_role.lower() or k in (self.name or "").lower() for k in ["secretary", "coordinator", "maintainer", "lead", "abay", "yuuhi", "samarth", "swati"])
        tier = "Core Directorial Council" if is_exec else ("Principal Dramatic Artist" if "director" in primary_role.lower() or "actor" in primary_role.lower() else "Production & Technical Lead")
        
        # Determine specializations
        specializations = [s.strip().upper() for s in (self.interest or "Stagecraft, Voice Modulation, Blocking, Ensemble Sync").split(",") if s.strip()]
        if not specializations:
            specializations = ["STAGE PERFORMANCE", "SCRIPT ANALYSIS", "CHARACTER WORK", "THEATRE PRODUCTION"]

        # Dynamic portfolio items based on member's role and productions
        portfolio_items = []
        name_l = (self.name or "").lower()
        if "abay" in name_l:
            portfolio_items = [
                {
                    "title": "Tamashbin Kathputliya",
                    "role": "Executive Producer & Ensemble Lead",
                    "year": 2026,
                    "image": "/aayam_assets/tamashbin_user_1.jpg",
                    "description": "Led society tour staging and courtyard audience interaction across IIT campus festival circuit."
                },
                {
                    "title": "DDDJ Stage Production",
                    "role": "Production Director",
                    "year": 2026,
                    "image": "/aayam_assets/dddj_user_1.jpg",
                    "description": "Directed high-contrast stage lighting shifts and dramatic proscenium blocking for CLT auditorium showcase."
                },
                {
                    "title": "Karn Ki Yachika",
                    "role": "Cast Lead (Karn)",
                    "year": 2026,
                    "image": "/aayam_assets/kky_user_5.jpg",
                    "description": "Featured classical dramatic performance at Kashiyatra National Drama Festival."
                }
            ]
        elif "yuuhi" in name_l or "utkarsh" in name_l:
            portfolio_items = [
                {
                    "title": "Tamashbin Kathputliya",
                    "role": "Director & Lead Narrator",
                    "year": 2026,
                    "image": "/aayam_assets/tamashbin_user_2.jpg",
                    "description": "Conceptualized satire dialogues, dholak percussion cues, and live street-play direction."
                },
                {
                    "title": "Karn Ki Yachika",
                    "role": "Principal Dramatic Performer",
                    "year": 2026,
                    "image": "/aayam_assets/kky_user_3.jpg",
                    "description": "Delivered high-intensity tragic monologues in classical Hindi verse adaptation."
                }
            ]
        elif "samarth" in name_l:
            portfolio_items = [
                {
                    "title": "Samatvam Physical Theatre",
                    "role": "Chief Production Coordinator",
                    "year": 2026,
                    "image": "/aayam_assets/samatvam_user_3.jpg",
                    "description": "Coordinated multi-tier stage logistics, acoustic balancing, and rehearsal hall setups."
                },
                {
                    "title": "Tamashbin Street Showcase",
                    "role": "Percussion & Staging Coordinator",
                    "year": 2026,
                    "image": "/aayam_assets/tamashbin_user_3.jpg",
                    "description": "Managed courtyard venue staging and live crowd acoustic projection."
                }
            ]
        elif "krishna" in name_l:
            portfolio_items = [
                {
                    "title": "DDDJ Proscenium Drama",
                    "role": "Lighting & Technical Lead",
                    "year": 2026,
                    "image": "/aayam_assets/dddj_user_4.jpg",
                    "description": "Designed DMX programmable spotlight cues and ambient acoustic transitions."
                },
                {
                    "title": "Samatvam Theatre",
                    "role": "Ensemble Sound Designer",
                    "year": 2026,
                    "image": "/aayam_assets/samatvam_user_4.jpg",
                    "description": "Engineered live microphone acoustics and spatial stage cues for full ensemble."
                }
            ]
        elif "swati" in name_l:
            portfolio_items = [
                {
                    "title": "Speak Up Tara",
                    "role": "Script Editor & Digital Lead",
                    "year": 2026,
                    "image": "/aayam_assets/speak_up_tara_user_1.webp",
                    "description": "Curated the published script version and managed online ticketing infrastructure."
                },
                {
                    "title": "Aayam Digital Archives",
                    "role": "Web Operations & Archival Lead",
                    "year": 2026,
                    "image": "/aayam_assets/speak_up_tara_user_4.jpg",
                    "description": "Engineered digital member roster, audition portal, and gallery database."
                }
            ]
        elif "sneha" in name_l:
            portfolio_items = [
                {
                    "title": "Tamashbin Kathputliya",
                    "role": "Scenic Backdrop & Prop Head",
                    "year": 2026,
                    "image": "/aayam_assets/tamashbin_user_5.jpg",
                    "description": "Painted traditional Rajasthani and contemporary street motifs for outdoor production."
                },
                {
                    "title": "DDDJ Visual Identity",
                    "role": "Costume & Aesthetic Designer",
                    "year": 2026,
                    "image": "/aayam_assets/dddj_user_5.jpg",
                    "description": "Curated proscenium stage visual palette, lighting gels, and character styling."
                }
            ]
        elif "tanu" in name_l:
            portfolio_items = [
                {
                    "title": "Samatvam",
                    "role": "Director & Dramaturge",
                    "year": 2026,
                    "image": "/aayam_assets/samatvam_user_1.jpg",
                    "description": "Directed 90-minute ensemble piece exploring modern inner conflict and collective movement."
                }
            ]
        elif "vaishnavi" in name_l:
            portfolio_items = [
                {
                    "title": "Karn Ki Yachika",
                    "role": "Production Director",
                    "year": 2026,
                    "image": "/aayam_assets/kky_user_2.jpg",
                    "description": "Spearheaded classical blocking, verse modulation, and tragic crescendo staging."
                },
                {
                    "title": "Speak Up Tara",
                    "role": "Director",
                    "year": 2026,
                    "image": "/aayam_assets/speak_up_tara_user_2.jpg",
                    "description": "Directed festival showcase on gender equality and societal voice."
                }
            ]
        else:
            portfolio_items = [
                {
                    "title": "Aayam 2026 Repertoire Showcase",
                    "role": primary_role,
                    "year": 2026,
                    "image": "/aayam_assets/tamashbin_user_1.jpg",
                    "description": f"Active contribution to {self.interest or 'theatrical performance and stagecraft'} during seasonal productions."
                },
                {
                    "title": "Campus Theatre Workshop",
                    "role": "Ensemble Contributor",
                    "year": 2026,
                    "image": "/aayam_assets/samatvam_user_2.jpg",
                    "description": "Participated in method acting drills, vocal modulation, and stage blocking labs."
                }
            ]

        portfolio_data = {
            'activeSince': 2023,
            'tier': tier,
            'statementTitle': "Artistic Vision & Stagecraft",
            'statementBody': self.bio or f"{self.name} is a dedicated theatrical artist and leader at Aayam - IIT Madras BS Drama Society.",
            'statementSecondary': f"Based in {self.city or 'IIT Madras BS'}. Contributing to {self.interest or 'Stagecraft and Theatrical Expression'}.",
            'specializations': specializations,
            'quote': "The stage is not a mirror to reflect reality, but a prism to refract human truth.",
            'portfolio': portfolio_items
        }

        return {
            'id': self.id,
            'member_id': self.member_id,
            'name': self.name,
            'email': self.email,
            'avatarUrl': avatar_url,
            'image': avatar_url,
            'age': self.age,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'phone': self.phone,
            'level': self.level,
            'area_of_interest': self.area_of_interest,
            'status': self.status,
            'pronouns': self.pronouns,
            'availability': self.availability,
            'bio': self.bio,
            'portfolio': self.portfolio,
            'portfolioData': portfolio_data,
            'interest': self.interest,
            'emergency_name': self.emergency_name,
            'emergency_phone': self.emergency_phone,
            'roles': roles_list,
            'labels': [{'id': l.id, 'name': l.name, 'color': l.color} for l in self.labels],
            'productionsCount': len(self.participations) if self.participations else len(portfolio_items)
        }

class Role(db.Model):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    users = db.relationship("User", secondary=user_roles, back_populates="roles")

class Admin(db.Model):
    __tablename__ = "admin"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    designation = db.Column(db.String(50))
    permissions = db.Column(db.Text)

    user = db.relationship("User")
    events = db.relationship("Event", back_populates="admin")
    announcements = db.relationship("Announcement", back_populates="admin")

class Membership(db.Model):
    __tablename__ = "membership"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    membership_type = db.Column(db.String(30))
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    membership_status = db.Column(db.String(20), default="Pending")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    user = db.relationship("User", back_populates="membership")


class StageBooking(db.Model):
    __tablename__ = "stage_booking"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    time = db.Column(db.String(20))
    period = db.Column(db.String(10))
    stage = db.Column(db.String(100))
    details = db.Column(db.String(255))
    is_secondary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RevenueMetric(db.Model):
    __tablename__ = "revenue_metric"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    playbill_sold = db.Column(db.Integer, default=0)
    corporate_patrons = db.Column(db.Integer, default=0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    venue = db.Column(db.String(100))
    event_date = db.Column(db.Date, nullable=True)
    start_time = db.Column(db.Time, nullable=True)
    end_time = db.Column(db.Time, nullable=True)
    max_participants = db.Column(db.Integer)
    poster = db.Column(db.String(255))
    status = db.Column(db.String(20), default="Upcoming")
    admin_id = db.Column(db.Integer, db.ForeignKey("admin.id"))

    admin = db.relationship("Admin", back_populates="events")
    bookings = db.relationship("Booking", back_populates="event", cascade="all, delete-orphan")
    feedbacks = db.relationship("Feedback", back_populates="event", cascade="all, delete-orphan")
    gallery = db.relationship("Gallery", back_populates="event", cascade="all, delete-orphan")
    volunteers = db.relationship("Volunteer", back_populates="event", cascade="all, delete-orphan")
    participations = db.relationship("Participation", back_populates="event", cascade="all, delete-orphan")

class Booking(db.Model):
    __tablename__ = "booking"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    booking_status = db.Column(db.String(20), default="Confirmed")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"))

    user = db.relationship("User", back_populates="bookings")
    event = db.relationship("Event", back_populates="bookings")
    participation = db.relationship("Participation", back_populates="booking", uselist=False, cascade="all, delete-orphan")

class Announcement(db.Model):
    __tablename__ = "announcement"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150))
    content = db.Column(db.Text)
    posted_date = db.Column(db.DateTime, default=datetime.utcnow)
    admin_id = db.Column(db.Integer, db.ForeignKey("admin.id"))

    admin = db.relationship("Admin", back_populates="announcements")

class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rating = db.Column(db.Integer)
    comments = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"))

    user = db.relationship("User", back_populates="feedbacks")
    event = db.relationship("Event", back_populates="feedbacks")

class Gallery(db.Model):
    __tablename__ = "gallery"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    media_url = db.Column(db.String(255))
    media_type = db.Column(db.String(20))
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"))

    event = db.relationship("Event", back_populates="gallery")

class ScheduleSlot(db.Model):
    __tablename__ = "schedule_slot"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    date = db.Column(db.Date, nullable=True)
    day_of_week = db.Column(db.String(15), nullable=True)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    notes = db.Column(db.String(255), nullable=True)

    user = db.relationship("User", back_populates="schedule_slots")

class Audition(db.Model):
    __tablename__ = "audition"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    play_id = db.Column(db.Integer, db.ForeignKey("play.id"))
    audition_date = db.Column(db.DateTime)
    role_applied_for = db.Column(db.String(100))
    experience_notes = db.Column(db.Text)
    status = db.Column(db.String(20), default="pending")
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship("User", back_populates="auditions")

class SharedEvent(db.Model):
    __tablename__ = "shared_event"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submitted_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    submitter_name = db.Column(db.String(150), nullable=True)
    contact_email = db.Column(db.String(255), nullable=True)
    contact_phone = db.Column(db.String(50), nullable=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    event_date = db.Column(db.DateTime, nullable=True)
    location_or_link = db.Column(db.String(255), nullable=True)
    budget = db.Column(db.String(100), nullable=True, default="₹50,000")
    proposal_type = db.Column(db.String(100), nullable=True, default="Member Pitch")
    status = db.Column(db.String(20), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    submitter = db.relationship("User", back_populates="shared_events")

    def to_dict(self):
        s_name = self.submitter_name or (self.submitter.name if self.submitter else "Ensemble Member")
        s_initials = "".join([x[0] for x in s_name.split()]).upper()[:2] if s_name else "EM"
        return {
            'id': self.id,
            'name': self.title,
            'description': self.description or '',
            'date': self.event_date.strftime('%b %d, %Y') if self.event_date else 'Jul 29, 2026',
            'venue': self.location_or_link or 'Studio Lounge',
            'budget': self.budget or '₹50,000',
            'proposalType': self.proposal_type or 'Member Pitch',
            'sourceType': 'Sponsor' if (self.proposal_type and 'Sponsor' in self.proposal_type) else 'Member',
            'sponsorshipDeal': self.budget or 'Club Member Pitch',
            'status': self.status.capitalize() if self.status else 'Reviewing',
            'contact_email': self.contact_email or (self.submitter.email if self.submitter else 'partner@aayam.org'),
            'contact_phone': self.contact_phone or '+91 98110 44321',
            'submitter': {
                'name': s_name,
                'initials': s_initials,
                'email': self.contact_email or (self.submitter.email if self.submitter else ''),
                'phone': self.contact_phone or ''
            }
        }

class Notification(db.Model):
    __tablename__ = "notification"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=True)
    message = db.Column(db.Text, nullable=True)
    reference_id = db.Column(db.Integer, nullable=True)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    recipient = db.relationship("User", back_populates="notifications")

    def to_dict(self):
        return {
            'id': self.id,
            'recipient_id': self.recipient_id,
            'type': self.type,
            'title': self.title or 'Production Notice',
            'message': self.message or 'You have a new backstage notification.',
            'reference_id': self.reference_id,
            'is_read': self.is_read,
            'created_at': self.created_at.strftime('%b %d, %Y • %I:%M %p') if self.created_at else ''
        }

class Volunteer(db.Model):
    __tablename__ = "volunteer"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String(50), default="Pending Review") # Pending Review, Approved & Assigned, Declined
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"), nullable=True)
    play_id = db.Column(db.Integer, db.ForeignKey("play.id"), nullable=True)

    applicant_name = db.Column(db.String(150), nullable=True)
    applicant_email = db.Column(db.String(255), nullable=True)
    applicant_phone = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(100), nullable=True) # Stage Management, Lighting & FX, Sound & Foley, Costumes & Makeup, Props & Set Design, Marketing, General Crew
    availability = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="volunteer")
    event = db.relationship("Event", back_populates="volunteers")
    play = db.relationship("Play", backref=db.backref("volunteers", cascade="all, delete-orphan"))

    def to_dict(self):
        play_name = self.play.title if self.play else (self.event.title if self.event else "Society Production")
        return {
            'id': self.id,
            'status': self.status or 'Pending Review',
            'user_id': self.user_id,
            'play_id': self.play_id,
            'event_id': self.event_id,
            'production_title': play_name,
            'applicant_name': self.applicant_name or (self.user.name if self.user else "Ensemble Member"),
            'applicant_email': self.applicant_email or (self.user.email if self.user else ""),
            'applicant_phone': self.applicant_phone or "+91 98110 44321",
            'department': self.department or "General Backstage Crew",
            'availability': self.availability or "5-8 Hours / Week",
            'notes': self.notes or "",
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else 'Aug 21, 2026'
        }

class Participation(db.Model):
    __tablename__ = "participation"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey("booking.id"), unique=True)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="Pending")
    remarks = db.Column(db.String(255))

    user = db.relationship("User", back_populates="participations")
    event = db.relationship("Event", back_populates="participations")
    booking = db.relationship("Booking", back_populates="participation")


class Play(db.Model):
    __tablename__ = "play"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    playwright = db.Column(db.String(150), nullable=True)
    genre = db.Column(db.String(100), nullable=True)
    language = db.Column(db.String(100), nullable=True, default="Hindi / English")
    status = db.Column(db.String(50)) # e.g. "Upcoming Premiere", "Archived Production"
    status_color = db.Column(db.String(100)) # CSS classes for color tag
    is_past = db.Column(db.Boolean, default=False)
    tagline = db.Column(db.String(255), nullable=True)
    acts = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text)
    director = db.Column(db.String(150))
    cast = db.Column(db.String(255))
    season = db.Column(db.String(100))
    image = db.Column(db.String(255))
    venue = db.Column(db.String(100))
    dates = db.Column(db.String(100))
    runtime = db.Column(db.String(100))
    price = db.Column(db.String(100))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'playwright': self.playwright or "Classical/Ensemble",
            'genre': self.genre or "Theatrical Drama",
            'language': self.language or "Hindi & English",
            'status': self.status or ("Archived Production" if self.is_past else "Upcoming Premiere"),
            'statusColor': self.status_color or ("bg-[#E4D9D2]/80 text-[#6B5550] border-[#CBB3AC]" if self.is_past else "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"),
            'is_past': bool(self.is_past) or bool(
                self.status and any(
                    kw in self.status.lower()
                    for kw in ("archive", "concluded", "past", "completed", "closed", "historical")
                )
            ),
            'tagline': self.tagline or "",
            'acts': self.acts or "Full Length Drama",
            'description': self.description,
            'director': self.director,
            'cast': self.cast,
            'season': self.season,
            'image': self.image,
            'venue': self.venue,
            'dates': self.dates,
            'runtime': self.runtime,
            'price': self.price,
            'volunteer_count': len(self.volunteers) if hasattr(self, 'volunteers') and self.volunteers else 0
        }

class OpenPosition(db.Model):
    __tablename__ = "open_position"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    play_id = db.Column(db.Integer, db.ForeignKey("play.id"), nullable=False)
    title = db.Column(db.String(150))
    category = db.Column(db.String(100))
    description = db.Column(db.Text)
    requirements = db.Column(db.String(255))
    deadline = db.Column(db.Date)
    status = db.Column(db.String(50), default="Open")
    
    play = db.relationship("Play", backref=db.backref("open_positions", cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            'id': f"{self.play_id}_{self.category.replace(' ', '')}_{self.id}",
            'db_id': self.id,
            'play_id': self.play_id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'requirements': self.requirements,
            'deadline': self.deadline.strftime('%b %d, %Y') if self.deadline else 'TBA',
            'status': self.status
        }

class GalleryItem(db.Model):
    __tablename__ = "gallery_item"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False, default="Stage Plays")
    image_url = db.Column(db.Text, nullable=False)
    caption = db.Column(db.Text, nullable=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="approved")
    uploader_name = db.Column(db.String(100), default="Aayam Media Team")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'imageUrl': self.image_url,
            'caption': self.caption or "",
            'uploadedAt': self.uploaded_at.strftime('%b %d, %Y') if self.uploaded_at else "",
            'status': self.status,
            'uploaderName': self.uploader_name or "Aayam Media Team"
        }

class Script(db.Model):
    __tablename__ = "script"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    playwright = db.Column(db.String(255), nullable=True)
    genre = db.Column(db.String(100), nullable=True, default="Drama")
    language = db.Column(db.String(100), nullable=True, default="Hindi / English")
    acts = db.Column(db.String(100), nullable=True, default="1 Act")
    pages = db.Column(db.Integer, nullable=True, default=30)
    roles_count = db.Column(db.String(100), nullable=True, default="Ensemble Roster")
    rehearsal_focus = db.Column(db.String(255), nullable=True, default="Scene & Dialogue Work")
    excerpt = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True)
    author_email = db.Column(db.String(255), nullable=False)
    author_name = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False, default="Draft") # "Public", "Draft", "Pending"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'playwright': self.playwright or self.author_name or 'Aayam Collective',
            'genre': self.genre or 'Drama',
            'language': self.language or 'Hindi & English',
            'acts': self.acts or '1 Act',
            'pages': self.pages or 30,
            'rolesCount': self.roles_count or 'Ensemble Roster',
            'rehearsalFocus': self.rehearsal_focus or 'Scene & Dialogue Work',
            'excerpt': self.excerpt or '',
            'content': self.content or '',
            'author_email': self.author_email,
            'author_name': self.author_name or self.author_email.split('@')[0],
            'status': self.status,
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else ''
        }

class SponsorAdRequest(db.Model):
    __tablename__ = "sponsor_ad_request"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sponsor_name = db.Column(db.String(150), nullable=False)
    contact_person = db.Column(db.String(150), nullable=False)
    contact_email = db.Column(db.String(255), nullable=False)
    contact_phone = db.Column(db.String(30), nullable=True)
    company_website = db.Column(db.String(255), nullable=True)
    ad_title = db.Column(db.String(200), nullable=False)
    ad_category = db.Column(db.String(100), nullable=False, default="Playbill Banner")
    target_event_name = db.Column(db.String(200), nullable=True, default="Annual Cultural Festival")
    budget_offered = db.Column(db.String(100), nullable=False, default="₹50,000")
    banner_image_url = db.Column(db.Text, nullable=True)
    ad_description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default="Pending") # "Pending", "Approved", "Rejected"
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'sponsor_name': self.sponsor_name,
            'contact_person': self.contact_person,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone or '',
            'company_website': self.company_website or '',
            'ad_title': self.ad_title,
            'ad_category': self.ad_category,
            'target_event_name': self.target_event_name or 'All Season Plays',
            'budget_offered': self.budget_offered,
            'banner_image_url': self.banner_image_url or '',
            'ad_description': self.ad_description or '',
            'status': self.status,
            'submitted_at': self.submitted_at.strftime('%b %d, %Y • %I:%M %p') if self.submitted_at else ''
        }

from sqlalchemy import event, text

def create_notification_raw(connection, target_id, n_type):
    try:
        admins = connection.execute(text("SELECT user_id FROM admin")).fetchall()
        for admin in admins:
            if admin[0]:
                connection.execute(text(
                    "INSERT INTO notification (recipient_id, type, reference_id, is_read, created_at) VALUES (:rec_id, :type, :ref_id, 0, CURRENT_TIMESTAMP)"
                ), {"rec_id": admin[0], "type": n_type, "ref_id": target_id})
    except Exception as e:
        pass

def user_after_insert(mapper, connection, target):
    if target.status and target.status.lower() == 'pending':
        create_notification_raw(connection, target.id, 'new_member')

def audition_after_insert(mapper, connection, target):
    create_notification_raw(connection, target.id, 'new_audition')

def sharedevent_after_insert(mapper, connection, target):
    create_notification_raw(connection, target.id, 'new_event_share')

class AuditionPosition(db.Model):
    __tablename__ = "audition_position"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    production_name = db.Column(db.String(150), nullable=False)
    role_name = db.Column(db.String(150), nullable=False)
    role_category = db.Column(db.String(100), default="Character Role") # Character Role, Makeup & Hair, Backstage Technical, Costume, Stage Management
    character_description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    slots_available = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default="Open Calling") # Open Calling, In Review, Casting Closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"), nullable=True)
    skills = db.Column(db.Text, nullable=True)
    application_open_date = db.Column(db.Date, nullable=True)
    application_close_date = db.Column(db.Date, nullable=True)
    require_portfolio = db.Column(db.Boolean, default=False)
    require_video = db.Column(db.Boolean, default=False)
    require_audio = db.Column(db.Boolean, default=False)
    event = db.relationship("Event", backref=db.backref("audition_positions", lazy="dynamic"))

    def to_dict(self):
        title_str = f"{self.production_name} - {self.role_name}" if self.production_name else self.role_name
        return {
            'id': str(self.id),
            'play_id': self.id,
            'title': title_str,
            'production_name': self.production_name,
            'role_name': self.role_name,
            'role_category': self.role_category,
            'category': self.role_category,
            'character_description': self.character_description or '',
            'description': self.character_description or '',
            'requirements': self.requirements or '',
            'slots_available': self.slots_available or 1,
            'event_id': self.event_id,
            'skills': self.skills or '',
            'application_open_date': self.application_open_date.strftime('%b %d, %Y') if self.application_open_date else None,
            'application_close_date': self.application_close_date.strftime('%b %d, %Y') if self.application_close_date else None,
            'require_portfolio': self.require_portfolio,
            'require_video': self.require_video,
            'require_audio': self.require_audio,
            'period_status': self._compute_period_status(),
            'slots_available': self.slots_available or 1,
            'status': self.status or 'Open Calling',
            'deadline': self.application_close_date.strftime('%b %d, %Y') if self.application_close_date else 'Sep 25, 2026',
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else 'Jul 20, 2026'
        }

    def _compute_period_status(self):
        from datetime import date as d
        today = d.today()
        if self.status in ('Casting Closed', 'Concluded'):
            return 'concluded'
        if self.status == 'In Review':
            return 'review'
        if self.application_open_date and self.application_open_date > today:
            return 'upcoming'
        if self.application_close_date and self.application_close_date < today:
            return 'review'
        return 'application' 


class AuditionApplication(db.Model):
    __tablename__ = "audition_application"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    position_id = db.Column(db.Integer, db.ForeignKey("audition_position.id"), nullable=True)
    role_name = db.Column(db.String(150), nullable=False)
    applicant_name = db.Column(db.String(150), nullable=False)
    applicant_email = db.Column(db.String(255), nullable=False)
    applicant_phone = db.Column(db.String(50), nullable=True)
    experience_level = db.Column(db.String(50), default="Ensemble Senior")
    portfolio_link = db.Column(db.String(255), nullable=True)
    notes = db.Column(db.Text)
    status = db.Column(db.String(50), default="Pending Review") # Pending Review, Shortlisted, Selected, Rejected
    audition_date = db.Column(db.String(100), default="Sep 25, 2026 @ 4:00 PM")
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    position = db.relationship("AuditionPosition", backref="applications")

    video_filename = db.Column(db.String(255), nullable=True)

    ai_transcript = db.Column(db.Text, nullable=True)
    ai_blur = db.Column(db.Float, nullable=True)
    ai_brightness = db.Column(db.Float, nullable=True)
    ai_face_detected = db.Column(db.Boolean, nullable=True)
    ai_report = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'portfolio_filename': self.portfolio_filename,
            'position_id': self.position_id,
            'role_name': self.role_name,
            'applicant_name': self.applicant_name,
            'applicant_email': self.applicant_email,
            'applicant_phone': self.applicant_phone or '+91 98110 44321',
            'experience_level': self.experience_level or 'Ensemble Senior',
            'portfolio_link': self.portfolio_link or 'https://youtube.com/watch?v=sample_slate',
            'notes': self.notes or '',
            'status': self.status or 'Pending Review',
            'audition_date': self.audition_date or 'Sep 25, 2026 @ 4:00 PM',
            'submitted_at': self.submitted_at.strftime('%b %d, %Y') if self.submitted_at else 'Jul 21, 2026',
            'video_filename':self.video_filename,
            'ai_transcript': self.ai_transcript,
            'ai_blur': self.ai_blur,
            'ai_brightness': self.ai_brightness,
            'ai_face_detected': self.ai_face_detected,
            'ai_report': self.ai_report,
        }


class FinancialRecord(db.Model):
    __tablename__ = "financial_record"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    record_type = db.Column(db.String(20), nullable=False) # 'Income' or 'Expense'
    category = db.Column(db.String(100), default="Sponsorship") # Sponsorship, Ticket Sales, Venue Rent, Production Props, Grant, Equipment
    date = db.Column(db.String(50), default="2026-07-20")
    status = db.Column(db.String(50), default="Completed") # Completed, Pending, Audited
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'amount': self.amount,
            'record_type': self.record_type,
            'category': self.category,
            'date': self.date,
            'status': self.status,
            'notes': self.notes or '',
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else 'Jul 20, 2026'
        }
class ExtractedCharacter(db.Model):
    __tablename__ = "extracted_character"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    traits = db.Column(db.Text, nullable=True) # JSON list serialized as text
    motivation = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        try:
            parsed_traits = json.loads(self.traits) if self.traits else []
        except Exception:
            parsed_traits = [t.strip() for t in self.traits.split(",")] if self.traits else []
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description or '',
            'traits': parsed_traits,
            'motivation': self.motivation or '',
            'role': self.role or 'Minor',
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else ''
        }


event.listen(User, 'after_insert', user_after_insert)
event.listen(Audition, 'after_insert', audition_after_insert)
event.listen(SharedEvent, 'after_insert', sharedevent_after_insert)
