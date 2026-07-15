from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

user_roles = db.Table(
    "user_roles",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("role_id", db.Integer, db.ForeignKey("role.id"), primary_key=True),
)

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

    def to_dict(self):
        return {
            'id': self.id,
            'member_id': self.member_id,
            'name': self.name,
            'email': self.email,
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
            'interest': self.interest,
            'emergency_name': self.emergency_name,
            'emergency_phone': self.emergency_phone,
            'roles': [r.name for r in self.roles]
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
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    event_date = db.Column(db.DateTime)
    location_or_link = db.Column(db.String(255))
    status = db.Column(db.String(20), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    submitter = db.relationship("User", back_populates="shared_events")

class Notification(db.Model):
    __tablename__ = "notification"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    reference_id = db.Column(db.Integer, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    recipient = db.relationship("User", back_populates="notifications")

class Volunteer(db.Model):
    __tablename__ = "volunteer"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String(20), default="Pending")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"), nullable=False)

    user = db.relationship("User", back_populates="volunteer")
    event = db.relationship("Event", back_populates="volunteers")

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
    status = db.Column(db.String(50)) # e.g. "SELLING FAST", "LIMITED TICKETS"
    status_color = db.Column(db.String(100)) # CSS classes for color tag
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
            'status': self.status,
            'statusColor': self.status_color,
            'description': self.description,
            'director': self.director,
            'cast': self.cast,
            'season': self.season,
            'image': self.image,
            'venue': self.venue,
            'dates': self.dates,
            'runtime': self.runtime,
            'price': self.price
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

event.listen(User, 'after_insert', user_after_insert)
event.listen(Audition, 'after_insert', audition_after_insert)
event.listen(SharedEvent, 'after_insert', sharedevent_after_insert)
