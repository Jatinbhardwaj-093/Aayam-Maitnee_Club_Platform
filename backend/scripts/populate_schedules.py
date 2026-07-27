import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import datetime
from app import app
from models import db, User, Event, Participation, ScheduleSlot

def seed_schedules_data():
    print("Seeding comprehensive August 2026 schedule and participation records for all users...")
    
    users = User.query.all()
    events = Event.query.all()

    if not users or not events:
        print("Users or Events missing, skipping schedule seed.")
        return

    # Delete existing participations and schedule_slots to start fresh
    Participation.query.delete()
    ScheduleSlot.query.delete()
    db.session.commit()

    statuses = ["Accepted", "Accepted", "Accepted", "Pending", "Accepted"]

    # 1. Seed Participations linking EVERY user to August & September events
    participation_count = 0
    for u_idx, user in enumerate(users):
        # Assign 6 to 8 events per user (diverse across meetups, workshops, plays)
        assigned_events = events[:8] if len(events) >= 8 else events
        for e_idx, ev in enumerate(assigned_events):
            p_status = statuses[(u_idx + e_idx) % len(statuses)]
            p = Participation(
                user_id=user.id,
                event_id=ev.id,
                status=p_status
            )
            db.session.add(p)
            participation_count += 1

    # 2. Seed Structured August 2026 ScheduleSlots for EVERY user
    august_slots = [
        {"date": datetime.date(2026, 8, 2), "day": "Sunday", "start": datetime.time(17, 30), "end": datetime.time(19, 30), "notes": "August Orientation & Ensemble Welcome Meetup"},
        {"date": datetime.date(2026, 8, 5), "day": "Wednesday", "start": datetime.time(16, 0), "end": datetime.time(18, 30), "notes": "Natyashastra Movement & Body Control Rehearsal"},
        {"date": datetime.date(2026, 8, 9), "day": "Sunday", "start": datetime.time(16, 30), "end": datetime.time(18, 30), "notes": "Sunday Monologue Jamming & Vocal Projection Meetup"},
        {"date": datetime.date(2026, 8, 12), "day": "Wednesday", "start": datetime.time(14, 0), "end": datetime.time(17, 0), "notes": "Stage Lighting & DMX Rigging Masterclass"},
        {"date": datetime.date(2026, 8, 15), "day": "Saturday", "start": datetime.time(17, 0), "end": datetime.time(19, 30), "notes": "Musimprov (with Akord) Musical Improv Session"},
        {"date": datetime.date(2026, 8, 18), "day": "Tuesday", "start": datetime.time(18, 0), "end": datetime.time(20, 30), "notes": "August Table-Read Circle: Tamashbin & DDDJ Scripts"},
        {"date": datetime.date(2026, 8, 22), "day": "Saturday", "start": datetime.time(18, 0), "end": datetime.time(20, 0), "notes": "Sahitya Sabha Poetry & Script Jam over Chai"},
        {"date": datetime.date(2026, 8, 25), "day": "Tuesday", "start": datetime.time(15, 0), "end": datetime.time(18, 0), "notes": "Backstage Props & Costume Set Crafting Session"},
        {"date": datetime.date(2026, 8, 29), "day": "Saturday", "start": datetime.time(18, 30), "end": datetime.time(21, 30), "notes": "Aayam Monthly Ensemble Showcase & Open Mic"}
    ]

    slot_count = 0
    for u_idx, user in enumerate(users):
        # Assign 5 to 6 distinct August slots per user, offset by user index
        user_slot_selection = [august_slots[(u_idx + i) % len(august_slots)] for i in range(6)]
        for s in user_slot_selection:
            slot = ScheduleSlot(
                user_id=user.id,
                date=s["date"],
                day_of_week=s["day"],
                start_time=s["start"],
                end_time=s["end"],
                notes=s["notes"]
            )
            db.session.add(slot)
            slot_count += 1

    db.session.commit()
    print(f"Successfully seeded {participation_count} Participation records and {slot_count} August Schedule Slots for ALL users!")

if __name__ == "__main__":
    with app.app_context():
        seed_schedules_data()
