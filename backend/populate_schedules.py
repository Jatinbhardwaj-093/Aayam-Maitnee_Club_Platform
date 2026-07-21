import datetime
from app import app
from models import db, User, Event, Participation, ScheduleSlot

def seed_schedules_data():
    print("Seeding schedule and participation records for all users...")
    
    users = User.query.all()
    events = Event.query.all()

    if not users or not events:
        print("Users or Events missing, skipping schedule seed.")
        return

    # Delete existing participations and schedule_slots to start fresh
    Participation.query.delete()
    ScheduleSlot.query.delete()
    db.session.commit()

    statuses = ["Accepted", "Accepted", "Pending", "Accepted"]
    days = ["Monday", "Wednesday", "Friday", "Saturday"]

    # 1. Seed Participations linking every user to events/rehearsals
    participation_count = 0
    for u_idx, user in enumerate(users):
        # Assign 3 to 4 events per user
        user_events = events[:4] if len(events) >= 4 else events
        for e_idx, ev in enumerate(user_events):
            p_status = statuses[(u_idx + e_idx) % len(statuses)]
            p = Participation(
                user_id=user.id,
                event_id=ev.id,
                status=p_status
            )
            db.session.add(p)
            participation_count += 1

    # 2. Seed Weekly ScheduleSlots for every user
    slot_count = 0
    for u_idx, user in enumerate(users):
        slot_day = days[u_idx % len(days)]
        slot = ScheduleSlot(
            user_id=user.id,
            date=datetime.date(2026, 8, 10 + (u_idx % 14)),
            day_of_week=slot_day,
            start_time=datetime.time(17, 0),
            end_time=datetime.time(19, 30),
            notes=f"Weekly Stage Rehearsal & Vocal Warmup - Slot {slot_day}"
        )
        db.session.add(slot)
        slot_count += 1

    db.session.commit()
    print(f"Successfully seeded {participation_count} Participation records and {slot_count} Schedule Slots for ALL users!")

if __name__ == "__main__":
    with app.app_context():
        seed_schedules_data()
