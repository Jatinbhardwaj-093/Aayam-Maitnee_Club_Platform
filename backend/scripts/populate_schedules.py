import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import datetime
from app import app
from models import db, User, Event, Participation, ScheduleSlot, Notification

def seed_schedules_data():
    print("Seeding comprehensive August & September 2026 schedule and participation records for all users...")
    
    users = User.query.all()
    events = Event.query.order_by(Event.event_date.asc(), Event.start_time.asc()).all()

    if not users or not events:
        print("Users or Events missing, skipping schedule seed.")
        return

    # Delete existing participations and schedule_slots to start fresh
    Participation.query.delete()
    ScheduleSlot.query.delete()
    db.session.commit()

    participation_count = 0
    slot_count = 0

    # User lookup
    user_map = {u.name: u for u in users}
    abay_user = next((u for u in users if 'abay' in u.name.lower() or '23f2000668' in u.email), None)
    aditi_user = next((u for u in users if 'aditi' in u.name.lower() or 'aditi' in u.email), None)
    yuuhi_user = next((u for u in users if 'yuuhi' in u.name.lower() or 'utkarsh' in u.name.lower()), None)
    samarth_user = next((u for u in users if 'samarth' in u.name.lower()), None)

    # 1. Seed Participations linking ALL users to Events
    statuses_pattern = ["Accepted", "Accepted", "Accepted", "Pending", "Accepted", "Declined", "Accepted"]

    for u_idx, user in enumerate(users):
        is_key_user = (user == abay_user or user == aditi_user)
        for e_idx, ev in enumerate(events):
            # Key scripts / events logic
            ev_title = ev.title.lower()
            if "midnight archives" in ev_title:
                if user == abay_user or user == aditi_user:
                    p_status = "Accepted"
                else:
                    p_status = "Accepted" if (u_idx % 2 == 0) else "Pending"
            elif "dhoop ki chhanv" in ev_title:
                if user == aditi_user or user == abay_user or user == yuuhi_user:
                    p_status = "Accepted"
                else:
                    p_status = "Accepted" if (u_idx % 3 == 0) else "Pending"
            elif "showcase" in ev_title or "darpan" in ev_title or "proscenium tech" in ev_title:
                p_status = "Accepted"
            elif "teardown" in ev_title or "debrief" in ev_title:
                p_status = "Accepted" if is_key_user else statuses_pattern[(u_idx + e_idx) % len(statuses_pattern)]
            else:
                p_status = statuses_pattern[(u_idx + e_idx) % len(statuses_pattern)]

            p = Participation(
                user_id=user.id,
                event_id=ev.id,
                status=p_status,
                remarks=f"Called as {user.roles[0].name if user.roles else 'Ensemble Performer'} for {ev.title}."
            )
            db.session.add(p)
            participation_count += 1

    # 2. Seed Structured August & September ScheduleSlots for EVERY user
    monthly_slots = [
        # August 2026 Slots
        {"date": datetime.date(2026, 8, 2), "day": "Sunday", "start": datetime.time(17, 30), "end": datetime.time(19, 30), "notes": "August Orientation & Ensemble Welcome Meetup"},
        {"date": datetime.date(2026, 8, 5), "day": "Wednesday", "start": datetime.time(16, 0), "end": datetime.time(18, 30), "notes": "Natyashastra Movement & Body Control Rehearsal"},
        {"date": datetime.date(2026, 8, 9), "day": "Sunday", "start": datetime.time(16, 30), "end": datetime.time(18, 30), "notes": "Sunday Monologue Jamming & Vocal Projection Meetup"},
        {"date": datetime.date(2026, 8, 12), "day": "Wednesday", "start": datetime.time(14, 0), "end": datetime.time(17, 0), "notes": "Stage Lighting & DMX Rigging Masterclass"},
        {"date": datetime.date(2026, 8, 15), "day": "Saturday", "start": datetime.time(17, 0), "end": datetime.time(19, 30), "notes": "Musimprov (with Akord) Musical Improv Session"},
        {"date": datetime.date(2026, 8, 23), "day": "Sunday", "start": datetime.time(18, 0), "end": datetime.time(20, 30), "notes": "August Table-Read Circle: Tamashbin & DDDJ Scripts"},
        {"date": datetime.date(2026, 8, 27), "day": "Thursday", "start": datetime.time(15, 0), "end": datetime.time(18, 0), "notes": "Backstage Props & Costume Set Crafting Session"},
        {"date": datetime.date(2026, 8, 30), "day": "Sunday", "start": datetime.time(18, 30), "end": datetime.time(21, 30), "notes": "Aayam Monthly Ensemble Showcase & Open Mic (OAT)"},
        {"date": datetime.date(2026, 8, 31), "day": "Monday", "start": datetime.time(18, 0), "end": datetime.time(20, 30), "notes": "Tech Teardown & Ensemble Debrief Dinner (SAC)"},

        # September 2026 Slots
        {"date": datetime.date(2026, 9, 3), "day": "Thursday", "start": datetime.time(17, 30), "end": datetime.time(20, 0), "notes": "Autumn Production Kickoff & Script Walkthrough"},
        {"date": datetime.date(2026, 9, 5), "day": "Saturday", "start": datetime.time(10, 0), "end": datetime.time(14, 0), "notes": "Theatre Masterclass with Gyaneshwar Mishra"},
        {"date": datetime.date(2026, 9, 8), "day": "Tuesday", "start": datetime.time(17, 0), "end": datetime.time(20, 0), "notes": "The Midnight Archives: Table-Read & Blocking Session (Abay & Aditi)"},
        {"date": datetime.date(2026, 9, 12), "day": "Saturday", "start": datetime.time(16, 30), "end": datetime.time(19, 0), "notes": "Autumn Street Satire & Dholak Sync Lab"},
        {"date": datetime.date(2026, 9, 15), "day": "Tuesday", "start": datetime.time(16, 0), "end": datetime.time(19, 0), "notes": "Dhoop Ki Chhanv: Open-Air Staging & Vocal Lab (Aditi & Abay)"},
        {"date": datetime.date(2026, 9, 18), "day": "Friday", "start": datetime.time(15, 0), "end": datetime.time(18, 0), "notes": "Classical Monologue & Navarasa Intensive"},
        {"date": datetime.date(2026, 9, 21), "day": "Monday", "start": datetime.time(18, 0), "end": datetime.time(21, 0), "notes": "Society Production Call: Mid-Season Blocking & Run-Through"},
        {"date": datetime.date(2026, 9, 24), "day": "Thursday", "start": datetime.time(16, 0), "end": datetime.time(18, 30), "notes": "Nukkad Natak Guidance Session with Om Bhope"},
        {"date": datetime.date(2026, 9, 27), "day": "Sunday", "start": datetime.time(15, 0), "end": datetime.time(18, 30), "notes": "Costume Fitting & Soundscape Dress Rehearsal"},
        {"date": datetime.date(2026, 9, 29), "day": "Tuesday", "start": datetime.time(17, 0), "end": datetime.time(21, 0), "notes": "Proscenium Tech Rehearsal & Live Cue Run"},
        {"date": datetime.date(2026, 9, 30), "day": "Wednesday", "start": datetime.time(17, 30), "end": datetime.time(21, 30), "notes": "Pre-Darpan Festival Final Technical Cue-to-Cue Run"}
    ]

    for u_idx, user in enumerate(users):
        for s in monthly_slots:
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
    print(f"Successfully seeded {participation_count} Participation records and {slot_count} August & September Schedule Slots for ALL {len(users)} users!")

if __name__ == "__main__":
    with app.app_context():
        seed_schedules_data()

