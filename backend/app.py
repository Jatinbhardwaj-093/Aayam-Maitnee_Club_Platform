import os
from flask import Flask
from flask_cors import CORS
from models import db
from api import api_bp

app = Flask(__name__)
CORS(app)

# SQLite Config
DATABASE_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'aayam.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Register Blueprint
app.register_blueprint(api_bp, url_prefix='/api')

from flask import jsonify, request

@app.route('/')
def home_page():
    return jsonify({'status': 'success', 'message': 'Aayam Backend API Active'}), 200

@app.route('/member/calendar')
@app.route('/member/rehearsal')
@app.route('/ai-rehearsal')
@app.route('/script-directory')
@app.route('/member/schedule')
def page_views():
    return jsonify({'status': 'success', 'message': 'Page loaded successfully'}), 200

@app.route('/scripts', methods=['GET', 'POST'])
def scripts_alias():
    from api import get_scripts, create_script
    if request.method == 'POST':
        return create_script()
    return get_scripts()

@app.route('/rehearsal/start', methods=['POST'])
def rehearsal_start_alias():
    from api import start_rehearsal
    return start_rehearsal()

@app.route('/script/pin', methods=['POST'])
def script_pin_alias():
    from api import pin_script
    return pin_script()

def ensure_user_columns():
    with db.engine.begin() as conn:
        existing_columns = {
            row[1] for row in conn.exec_driver_sql('PRAGMA table_info("user")').fetchall()
        }

        if 'state' not in existing_columns:
            conn.exec_driver_sql('ALTER TABLE "user" ADD COLUMN state VARCHAR(100)')
        if 'country' not in existing_columns:
            conn.exec_driver_sql('ALTER TABLE "user" ADD COLUMN country VARCHAR(100)')
        if 'interest' not in existing_columns:
            conn.exec_driver_sql('ALTER TABLE "user" ADD COLUMN interest VARCHAR(100)')

def seed_default_scripts():
    from models import Script
    import json
    try:
        from scripts.populate_scripts import scripts_seed_list
    except Exception as e:
        print("Warning: Could not import scripts_seed_list:", e)
        scripts_seed_list = []

    # 1. Ensure all canonical scripts exist in DB
    existing_titles = {s.title for s in Script.query.all()}

    for item in scripts_seed_list:
        if item["title"] not in existing_titles:
            content_obj = {
                "title": item["title"],
                "playwright": item["playwright"],
                "abstract": item.get("abstract", ""),
                "theme": item.get("theme", ""),
                "settingInfo": item.get("settingInfo", ""),
                "labels": item.get("labels", ""),
                "acts": item["acts"],
                "pages": item["pages"],
                "rolesCount": item["roles_count"],
                "characters": item.get("characters", []),
                "lines": item.get("lines", [])
            }
            s = Script(
                title=item["title"],
                playwright=item["playwright"],
                genre=item["genre"],
                language=item["language"],
                acts=item["acts"],
                pages=item["pages"],
                roles_count=item["roles_count"],
                rehearsal_focus=item["rehearsal_focus"],
                excerpt=item["excerpt"],
                content=json.dumps(content_obj, ensure_ascii=False, indent=2),
                author_email=item["author_email"],
                author_name=item["author_name"],
                status=item["status"]
            )
            db.session.add(s)
            existing_titles.add(item["title"])

    # 2. Also ensure draft scripts exist for testing
    sample_drafts = [
        Script(
            title="Court of Shadows",
            playwright="Abay Nandhiga",
            genre="Psychological Thriller",
            language="Hindi & English",
            acts="2 Acts",
            pages=42,
            roles_count="4 Characters",
            rehearsal_focus="Pacing & Tension Building",
            excerpt="ABAY: In the dim light of the court, truth is treated like a bargaining chip...",
            content='{"characters":[{"id":"c1","name":"Abay","traits":"Lead Defense Attorney","color":"#635f41"},{"id":"c2","name":"Prosecutor Devendra","traits":"Rival Prosecutor","color":"#d97706"},{"id":"c3","name":"Inspector Rathore","traits":"Key Witness / Police Officer","color":"#059669"},{"id":"c4","name":"Judge Roy","traits":"Presiding Magistrate","color":"#7c3aed"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Abay","color":"#635f41","text":"In the dim light of this court, truth is treated like a bargaining chip..."},{"id":"l2","characterId":"c2","characterName":"Prosecutor Devendra","color":"#d97706","text":"Objection, Your Honor! Counsel is indulging in poetic melodrama instead of facts."},{"id":"l3","characterId":"c4","characterName":"Judge Roy","color":"#7c3aed","text":"Sustained. Mr. Abay, present your primary evidence or yield the floor."},{"id":"l4","characterId":"c3","characterName":"Inspector Rathore","color":"#059669","text":"[Stepping to witness box] The logbook entries for that midnight shift were altered, Your Honor."},{"id":"l5","characterId":"c1","characterName":"Abay","color":"#635f41","text":"And who had access to the master lock-up key, Inspector? Tell the court!"}],"abstract":"A noir psychological courtroom thriller investigating a high-stakes conspiracy.","labels":"Courtroom, Thriller, Noir","theme":"Justice vs Corruption","settingInfo":"Session Courtroom 4, Midnight"}',
            author_email="23f2000668@ds.study.iitm.ac.in",
            author_name="Abay Nandhiga",
            status="Draft"
        ),
        Script(
            title="Whispers of the Banyan Tree",
            playwright="Aditi",
            genre="Social Realism",
            language="Hindi",
            acts="2 Acts",
            pages=38,
            roles_count="4 Characters",
            rehearsal_focus="Dialect & Naturalism",
            excerpt="ADITI: The roots of this village run deeper than any modern road...",
            content='{"characters":[{"id":"c1","name":"Aditi","traits":"Village Schoolteacher","color":"#059669"},{"id":"c2","name":"Gram Pradhan","traits":"Village Headman Antagonist","color":"#d97706"},{"id":"c3","name":"Dadi Janki","traits":"Respected Village Matriarch","color":"#7c3aed"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Aditi","color":"#059669","text":"The roots of this banyan tree run deep, Pradhan Ji, but so does our children\'s right to learn!"},{"id":"l2","characterId":"c2","characterName":"Gram Pradhan","color":"#d97706","text":"Books won\'t till the fields, Aditi. Traditions cannot be broken overnight."}],"abstract":"A rural social drama centered on a teacher building a girl\'s school under an ancient village banyan tree.","labels":"Social Realism, Village Life","theme":"Education & Reform","settingInfo":"Under Banyan Tree, Village Square"}',
            author_email="aditi.drama@handle.com",
            author_name="Aditi",
            status="Draft"
        ),
        Script(
            title="Ek Nayi Subah",
            playwright="Aditi",
            genre="Inspirational Drama",
            language="Hindi",
            acts="1 Act",
            pages=24,
            roles_count="3 Characters",
            rehearsal_focus="Voice Projection",
            excerpt="ADITI: Morning comes not when the sun rises, but when we choose to wake up...",
            content='{"characters":[{"id":"c1","name":"Aditi","traits":"Protagonist","color":"#8CC0EB"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Aditi","color":"#8CC0EB","text":"Morning comes not when the sun rises, but when we choose to wake up..."}],"abstract":"A story of youth empowerment and community action.","labels":"Youth, Social","theme":"Hope & Action","settingInfo":"College Campus"}',
            author_email="aditi.drama@handle.com",
            author_name="Aditi",
            status="Pending"
        )
    ]

    for d in sample_drafts:
        if d.title not in existing_titles:
            db.session.add(d)
            existing_titles.add(d.title)

    db.session.commit()

def auto_seed_if_empty():
    from models import User
    if User.query.count() == 0:
        print("Empty database detected on startup. Auto-seeding initial dataset...")
        from seed import seed_database
        seed_database()

# Ensure tables exist and seed default scripts
with app.app_context():
    db.create_all()
    ensure_user_columns()
    seed_default_scripts()

if __name__ == '__main__':
    with app.app_context():
        auto_seed_if_empty()
    port = int(os.environ.get('PORT', 5005))
    app.run(host='0.0.0.0', port=port, debug=True)
