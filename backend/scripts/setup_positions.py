import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from datetime import date, timedelta
from app import app
from models import db, Play, OpenPosition

def run():
    with app.app_context():
        # create tables
        db.create_all()
        
        # clear existing
        OpenPosition.query.delete()
        
        plays = Play.query.all()
        for p in plays:
            deadlines = [
                date(2026, 7, 15),
                date(2026, 7, 18),
                date(2026, 7, 12),
                date(2026, 7, 16)
            ]
            
            p1 = OpenPosition(
                play_id=p.id,
                title=f"{p.title} - Ensemble/Cast",
                category="Performer",
                description=f"Audition for a casting role in {p.title}. Includes rehearsal attendance, ensemble staging, and backing choruses.",
                requirements="Audition Video Monologue (MP4/MOV) & Acting Resume (PDF)",
                deadline=deadlines[0]
            )
            p2 = OpenPosition(
                play_id=p.id,
                title=f"{p.title} - Backstage/Tech Crew",
                category="Technical Crew",
                description=f"Join the technical crew for {p.title}. Support backstage prop layout, timing checks, and stage clearance checks.",
                requirements="Technical Crew Resume & Production Portfolio (PDF)",
                deadline=deadlines[1]
            )
            p3 = OpenPosition(
                play_id=p.id,
                title=f"{p.title} - Set/Creative Design",
                category="Creative Designer",
                description=f"Help design the artistic vision for {p.title}. Collaborate with the director to construct atmospheric sketches and set designs.",
                requirements="Creative Portfolio Link or Sketches (PDF)",
                deadline=deadlines[2]
            )
            p4 = OpenPosition(
                play_id=p.id,
                title=f"{p.title} - Assistant Director",
                category="Director",
                description=f"Assist the director for {p.title}. Manage rehearsal schedules, actor notes, and blocking.",
                requirements="Directing Resume & Notes (PDF)",
                deadline=deadlines[3]
            )
            db.session.add_all([p1, p2, p3, p4])
        
        db.session.commit()
        print("Successfully created open positions table and populated it with data.")

if __name__ == '__main__':
    run()
