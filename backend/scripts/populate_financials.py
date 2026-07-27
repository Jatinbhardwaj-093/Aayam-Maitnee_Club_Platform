import sys
import os
from datetime import datetime
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from models import db, FinancialRecord

def seed_financials_data():
    with app.app_context():
        db.create_all()

        # Clear existing financial records for clean seed
        FinancialRecord.query.delete()
        db.session.commit()

        financial_items = [
            {
                "title": "Red Bull India Mainstage Season Sponsorship",
                "amount": 150000.00,
                "record_type": "Income",
                "category": "Sponsorship",
                "date": "2026-07-05",
                "status": "Completed",
                "notes": "Exclusive Energy Drink & Playbill Banner partner sponsorship for Season 2026."
            },
            {
                "title": "Prithvi Theatre Royal Stage Venue Booking",
                "amount": 45000.00,
                "record_type": "Expense",
                "category": "Venue Rental",
                "date": "2026-07-10",
                "status": "Completed",
                "notes": "Advance booking deposit for 3 mainstage weekend show runs of Tughlaq."
            },
            {
                "title": "FabIndia Heritage Wardrobe & Drama Costumes",
                "amount": 75000.00,
                "record_type": "Income",
                "category": "Sponsorship",
                "date": "2026-07-12",
                "status": "Completed",
                "notes": "In-kind costume sponsorship and cash grant for period drama production."
            },
            {
                "title": "Tughlaq Historical Sets & Stage Architecture Props",
                "amount": 32000.00,
                "record_type": "Expense",
                "category": "Production Props",
                "date": "2026-07-14",
                "status": "Completed",
                "notes": "Stage timber, throne props, silk curtains, and royal crest backdrops."
            },
            {
                "title": "Ticket Presales - 'Tughlaq Opening Night'",
                "amount": 88000.00,
                "record_type": "Income",
                "category": "Ticket Sales",
                "date": "2026-07-16",
                "status": "Completed",
                "notes": "Online ticket presale for 176 general admission seats at ₹500."
            },
            {
                "title": "Stage Acoustic & Sound Mixing Console Upgrade",
                "amount": 28000.00,
                "record_type": "Expense",
                "category": "Equipment",
                "date": "2026-07-18",
                "status": "Completed",
                "notes": "Digital wireless lapel microphone kit and mixer board calibration."
            },
            {
                "title": "Cultural Ministry Arts Development Grant",
                "amount": 100000.00,
                "record_type": "Income",
                "category": "Grant",
                "date": "2026-07-19",
                "status": "Completed",
                "notes": "State theatre development grant for youth drama workshops and mime outreach."
            },
            {
                "title": "Special Effects SFX Makeup & Prosthetic Supplies",
                "amount": 14500.00,
                "record_type": "Expense",
                "category": "Production Props",
                "date": "2026-07-20",
                "status": "Completed",
                "notes": "Stage greasepaint, prosthetic noses, wigs, and scar wax for Macbeth casting."
            }
        ]

        for item in financial_items:
            rec = FinancialRecord(**item)
            db.session.add(rec)

        db.session.commit()
        print(f"Successfully seeded {len(financial_items)} Financial Records!")

if __name__ == "__main__":
    seed_financials_data()
