from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    Time,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("user.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("role.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    age = Column(String(20), nullable=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(512), nullable=False)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    level = Column(String(50), nullable=True)
    area_of_interest = Column(Boolean, nullable=False, default=True)
    status = Column(String(20), default="Pending")

    roles = relationship("Role", secondary=user_roles, back_populates="users")
    membership = relationship("Membership", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    volunteer = relationship("Volunteer", back_populates="user", cascade="all, delete-orphan")
    participations = relationship("Participation", back_populates="user", cascade="all, delete-orphan")


class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    users = relationship("User", secondary=user_roles, back_populates="roles")


class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    designation = Column(String(50))
    permissions = Column(Text)

    user = relationship("User")
    events = relationship("Event", back_populates="admin")
    announcements = relationship("Announcement", back_populates="admin")


class Membership(Base):
    __tablename__ = "membership"

    id = Column(Integer, primary_key=True, autoincrement=True)
    membership_type = Column(String(30))
    start_date = Column(Date)
    end_date = Column(Date)
    membership_status = Column(String(20), default="Pending")
    user_id = Column(Integer, ForeignKey("user.id"))

    user = relationship("User", back_populates="membership")


class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    category = Column(String(50))
    venue = Column(String(100))
    event_date = Column(Date)
    start_time = Column(Time)
    end_time = Column(Time)
    max_participants = Column(Integer)
    poster = Column(String(255))
    status = Column(String(20), default="Upcoming")
    admin_id = Column(Integer, ForeignKey("admin.id"))

    admin = relationship("Admin", back_populates="events")
    bookings = relationship("Booking", back_populates="event", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="event", cascade="all, delete-orphan")
    gallery = relationship("Gallery", back_populates="event", cascade="all, delete-orphan")
    volunteers = relationship("Volunteer", back_populates="event", cascade="all, delete-orphan")
    participations = relationship("Participation", back_populates="event", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    booking_date = Column(DateTime, default=datetime.utcnow)
    booking_status = Column(String(20), default="Confirmed")
    user_id = Column(Integer, ForeignKey("user.id"))
    event_id = Column(Integer, ForeignKey("event.id"))

    user = relationship("User", back_populates="bookings")
    event = relationship("Event", back_populates="bookings")
    participation = relationship("Participation", back_populates="booking", uselist=False, cascade="all, delete-orphan")


class Announcement(Base):
    __tablename__ = "announcement"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150))
    content = Column(Text)
    posted_date = Column(DateTime, default=datetime.utcnow)
    admin_id = Column(Integer, ForeignKey("admin.id"))

    admin = relationship("Admin", back_populates="announcements")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, autoincrement=True)
    rating = Column(Integer)
    comments = Column(Text)
    user_id = Column(Integer, ForeignKey("user.id"))
    event_id = Column(Integer, ForeignKey("event.id"))

    user = relationship("User", back_populates="feedbacks")
    event = relationship("Event", back_populates="feedbacks")


class Gallery(Base):
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_url = Column(String(255))
    media_type = Column(String(20))
    upload_date = Column(DateTime, default=datetime.utcnow)
    event_id = Column(Integer, ForeignKey("event.id"))

    event = relationship("Event", back_populates="gallery")


class Notification(Base):
    __tablename__ = "notification"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    user = relationship("User", back_populates="notifications")


class Volunteer(Base):
    __tablename__ = "volunteer"

    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(String(20), default="Pending")
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("event.id"), nullable=False)

    user = relationship("User", back_populates="volunteer")
    event = relationship("Event", back_populates="volunteers")


class Participation(Base):
    __tablename__ = "participation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("event.id"), nullable=False)
    booking_id = Column(Integer, ForeignKey("booking.id"), unique=True)
    registration_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Pending")
    remarks = Column(String(255))

    user = relationship("User", back_populates="participations")
    event = relationship("Event", back_populates="participations")
    booking = relationship("Booking", back_populates="participation")