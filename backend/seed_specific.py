from app import app
from models import db, User, Event, Participation
import random

with app.app_context():
    users = User.query.all()
    events = Event.query.all()
    
    # Clear existing to avoid unique constraint errors
    db.session.query(Participation).delete()
    
    count = 0
    for u in users:
        k = random.randint(2, 4)
        assigned = random.sample(events, min(k, len(events)))
        for i, e in enumerate(assigned):
            # Make the first 1 pending, rest accepted to simulate realistic state
            status = 'Pending' if i == 0 else 'Accepted'
            p = Participation(user_id=u.id, event_id=e.id, status=status)
            db.session.add(p)
            count += 1
            
    db.session.commit()
    print(f"Seeded {count} specific schedule items across {len(users)} users.")
