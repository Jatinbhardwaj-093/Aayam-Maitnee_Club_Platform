from app import app
from models import db, User, ScheduleSlot, Audition, SharedEvent, Notification
import datetime

with app.app_context():
    # Create new tables
    db.create_all()
    
    # Check if ScheduleSlot is empty
    if ScheduleSlot.query.count() == 0:
        users = User.query.all()
        for u in users:
            s = ScheduleSlot(
                user_id=u.id, 
                day_of_week='Monday', 
                start_time=datetime.time(18, 0), 
                end_time=datetime.time(20, 0), 
                notes='Default rehearsal slot'
            )
            db.session.add(s)
        db.session.commit()
        print(f"Created default schedules for {len(users)} users.")
    else:
        print("Schedules already exist.")
