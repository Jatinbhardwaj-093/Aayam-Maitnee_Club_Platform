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
    if Script.query.count() == 0:
        default_scripts = [
            Script(
                title="Tamashbin Kathputliya",
                playwright="Aayam Collective & Utkarsh (Yuuhi)",
                genre="Street Drama / Satire",
                language="Hindi / Hindustani Folk",
                acts="1 Act (Continuous Courtyard Staging)",
                pages=34,
                roles_count="15 Roles (5 Lead, 10 Chorus)",
                rehearsal_focus="Courtyard Projection & Rhythmic Chants",
                excerpt="Suno suno re bhaiyo, suno tamashbin ka khel! Kathputliya naachegi, bolega sach ka mel...",
                content="Full Annotated Production Script for Tamashbin Kathputliya...",
                author_email="utkarsh@ds.study.iitm.ac.in",
                author_name="Utkarsh (Yuuhi)",
                status="Public"
            ),
            Script(
                title="DDDJ",
                playwright="Abay Nandhiga & Aayam Writing Cell",
                genre="Psychological Drama",
                language="Hindi / Hinglish",
                acts="2 Acts (8 Dramatic Scenes)",
                pages=52,
                roles_count="12 Roles (4 Lead, 8 Ensemble)",
                rehearsal_focus="High-Contrast Monologues & Spotlight Cues",
                excerpt="When the lights fade into crimson, the stage forgets who you were before the curtain rose...",
                content="Full Annotated Director Cut Script for DDDJ...",
                author_email="23f2000668@ds.study.iitm.ac.in",
                author_name="Abay Nandhiga",
                status="Public"
            ),
            Script(
                title="Karn Ki Yachika",
                playwright="Classical Hindi Adaptation",
                genre="Mythological Verse Tragedy",
                language="Shuddha Hindi Verse",
                acts="3 Acts (Classical Sanskritic Form)",
                pages=68,
                roles_count="18 Roles (6 Lead, 12 Chorus)",
                rehearsal_focus="Voice Modulation & Soliloquy Delivery",
                excerpt="Dharm rakshti rakshita! Kaun hai jo destiny ko badal sake jab rath ka chakka dharti me dhas jaaye...",
                content="Full Classical Verse Script for Karn Ki Yachika...",
                author_email="swati123@ds.study.iitm.ac.in",
                author_name="Aayam Dramatics Board",
                status="Public"
            ),
            Script(
                title="Samatvam",
                playwright="Samarth Shrivastava",
                genre="Physical Movement Theatre",
                language="Gestural / Minimal Dialogue",
                acts="1 Act (12 Movement Movements)",
                pages=28,
                roles_count="10 Roles (Synchronized Ensemble)",
                rehearsal_focus="Spatial Rhythm & Synchronized Breathing",
                excerpt="(Movement Cue 4): The ensemble forms a concentric circle. Slow breathing sync on beat 3...",
                content="Full Movement Notation Script for Samatvam...",
                author_email="21f1002840@ds.study.iitm.ac.in",
                author_name="Samarth Shrivastava",
                status="Public"
            ),
            Script(
                title="Speak Up Tara",
                playwright="Swati Singh",
                genre="Contemporary Social Drama",
                language="Hindi & English",
                acts="2 Acts (6 Scenes)",
                pages=44,
                roles_count="10 Roles (3 Lead, 7 Supporting)",
                rehearsal_focus="Emotional Realism & Dialogue Pacing",
                excerpt="Tara: Silence isn't safety. If we don't speak up today, our stories will be written by others...",
                content="Full Social Drama Script for Speak Up Tara...",
                author_email="swati123@ds.study.iitm.ac.in",
                author_name="Swati Singh",
                status="Public"
            ),
            # Member Personal Drafts & Pending Requests
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
                content='{"characters":[{"id":"c1","name":"Abay","traits":"Lead Defense Attorney","color":"#635f41"},{"id":"c2","name":"Prosecutor Devendra","traits":"Rival Prosecutor","color":"#d97706"},{"id":"c3","name":"Inspector Rathore","traits":"Key Witness / Police Officer","color":"#059669"},{"id":"c4","name":"Judge Roy","traits":"Presiding Magistrate","color":"#7c3aed"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Abay","color":"#635f41","text":"In the dim light of this court, truth is treated like a bargaining chip..."},{"id":"l2","characterId":"c2","characterName":"Prosecutor Devendra","color":"#d97706","text":"Objection, Your Honor! Counsel is indulging in poetic melodrama instead of facts."},{"id":"l3","characterId":"c4","characterName":"Judge Roy","color":"#7c3aed","text":"Sustained. Mr. Abay, present your primary evidence or yield the floor."},{"id":"l4","characterId":"c3","characterName":"Inspector Rathore","color":"#059669","text":"[Stepping to witness box] The logbook entries for that midnight shift were altered, Your Honor."},{"id":"l5","characterId":"c1","characterName":"Abay","color":"#635f41","text":"And who had access to the master lock-up key, Inspector? Tell the court!"},{"id":"l6","characterId":"c2","characterName":"Prosecutor Devendra","color":"#d97706","text":"[Standing up abruptly] That question violates official protocol!"},{"id":"l7","characterId":"c1","characterName":"Abay","color":"#635f41","text":"Protocol cannot hide justice!"}],"abstract":"A noir psychological courtroom thriller investigating a high-stakes conspiracy in midnight Mumbai.","labels":"Courtroom, Thriller, Noir","theme":"Justice vs Corruption","settingInfo":"Session Courtroom 4, Midnight"}',
                author_email="23f2000668@ds.study.iitm.ac.in",
                author_name="Abay Nandhiga",
                status="Draft"
            ),
            Script(
                title="The Last Soliloquy",
                playwright="Abay Nandhiga",
                genre="Classic Monologue",
                language="English",
                acts="1 Act",
                pages=18,
                roles_count="4 Characters",
                rehearsal_focus="Soliloquy Delivery",
                excerpt="ABAY: When all the applause fades, only the empty stage remains...",
                content='{"characters":[{"id":"c1","name":"Abay","traits":"Veteran Stage Actor","color":"#635f41"},{"id":"c2","name":"The Ghost of Hamlet","traits":"Apparition / Foil","color":"#8CC0EB"},{"id":"c3","name":"Young Apprentice Kabir","traits":"Stage Protégé","color":"#059669"},{"id":"c4","name":"Understudy Tarun","traits":"Eager Rival","color":"#d97706"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Abay","color":"#635f41","text":"When all the applause fades into dust, only the empty wooden stage remains..."},{"id":"l2","characterId":"c3","characterName":"Young Apprentice Kabir","color":"#059669","text":"Master Abay! The audience is standing. They are chanting your name for an encore!"},{"id":"l3","characterId":"c1","characterName":"Abay","color":"#635f41","text":"Let them chant for the characters, Kabir, not the fragile man behind the mask."},{"id":"l4","characterId":"c2","characterName":"The Ghost of Hamlet","color":"#8CC0EB","text":"[Echoing from upstage darkness] Remember me... remember the words we gave to the night."},{"id":"l5","characterId":"c4","characterName":"Understudy Tarun","color":"#d97706","text":"Are you ready to pass the mantle, Sir?"},{"id":"l6","characterId":"c1","characterName":"Abay","color":"#635f41","text":"The mantle belongs to anyone who speaks with truth!"}],"abstract":"A poignant dramatic soliloquy following a legendary theatre actor facing his final curtain call.","labels":"Classic, Monologue, Drama","theme":"Legacy & Artistic Passion","settingInfo":"Dimly Lit Stage, Post-Show"}',
                author_email="23f2000668@ds.study.iitm.ac.in",
                author_name="Abay Nandhiga",
                status="Pending"
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
                content='{"characters":[{"id":"c1","name":"Aditi","traits":"Village Schoolteacher","color":"#059669"},{"id":"c2","name":"Gram Pradhan","traits":"Village Headman Antagonist","color":"#d97706"},{"id":"c3","name":"Dadi Janki","traits":"Respected Village Matriarch","color":"#7c3aed"},{"id":"c4","name":"Pooja","traits":"Young Student","color":"#8CC0EB"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Aditi","color":"#059669","text":"The roots of this banyan tree run deep, Pradhan Ji, but so does our children\'s right to learn!"},{"id":"l2","characterId":"c2","characterName":"Gram Pradhan","color":"#d97706","text":"Books won\'t till the fields, Aditi. Traditions cannot be broken overnight."},{"id":"l3","characterId":"c4","characterName":"Pooja","color":"#8CC0EB","text":"Pradhan Baba! Look, I wrote my own name in Hindi today!"},{"id":"l4","characterId":"c3","characterName":"Dadi Janki","color":"#7c3aed","text":"[Leaning on cane] Let the girl speak, Pradhan. In my eighty years, I have seen ignorance ruin more families than drought."},{"id": "l5", "characterId": "c1", "characterName": "Aditi", "color": "#059669", "text": "If we educate Pooja today, she will light the lantern for the entire village tomorrow."}],"abstract":"A rural social drama centered on a teacher building a girl\'s school under an ancient village banyan tree.","labels":"Social Realism, Village Life","theme":"Education & Reform","settingInfo":"Under Banyan Tree, Village Square"}',
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
            ),
            Script(
                title="Chai At The Naka",
                playwright="Kanishk Mishra",
                genre="Street Play / Nukkad Natak",
                language="Hindi & Hinglish",
                acts="1 Act",
                pages=20,
                roles_count="6 Characters",
                rehearsal_focus="Rhythmic Chants & Ensemble Energy",
                excerpt="KANISHK: Chai garam, baatein garam! Dekho aao nukkad ka rang...",
                content='{"characters":[{"id":"c1","name":"Kanishk","traits":"Chaiwala / Chorus Leader","color":"#db2777"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Kanishk","color":"#db2777","text":"Chai garam, baatein garam! Dekho aao nukkad ka rang..."}],"abstract":"A lively street play depicting everyday conversations at a city tea stall.","labels":"Street Play, Satire","theme":"Urban Life","settingInfo":"Tea Stall Naka"}',
                author_email="kanishk.mishra@handle.com",
                author_name="Kanishk Mishra",
                status="Draft"
            ),
            Script(
                title="Siren of the Ghats",
                playwright="Kanishk Mishra",
                genre="Atmospheric Mystery",
                language="Hindi",
                acts="2 Acts",
                pages=45,
                roles_count="4 Characters",
                rehearsal_focus="Lighting & Fog Effects",
                excerpt="KANISHK: When river fog rises over the steps, old legends walk among us...",
                content='{"characters":[{"id":"c1","name":"Kanishk","traits":"Boatman","color":"#2563eb"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Kanishk","color":"#2563eb","text":"When river fog rises over the steps, old legends walk among us..."}],"abstract":"An atmospheric thriller set along the ancient river ghats of Varanasi.","labels":"Mystery, Folklore","theme":"Faith & Memory","settingInfo":"Varanasi Riverbank"}',
                author_email="kanishk.mishra@handle.com",
                author_name="Kanishk Mishra",
                status="Pending"
            ),
            Script(
                title="The Stage Manager's Dilemma",
                playwright="Esha Hinde",
                genre="Comedy / Drama",
                language="English",
                acts="2 Acts",
                pages=36,
                roles_count="5 Characters",
                rehearsal_focus="Backstage Timing & Props",
                excerpt="ESHA: Thirty seconds to curtain and the lead actor has lost his costume sword...",
                content='{"characters":[{"id":"c1","name":"Esha","traits":"Stage Manager","color":"#7c3aed"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Esha","color":"#7c3aed","text":"Thirty seconds to curtain and the lead actor has lost his costume sword..."}],"abstract":"A behind-the-scenes comedy following chaos backstage before opening night.","labels":"Comedy, Backstage","theme":"Theatre Life","settingInfo":"Green Room"}',
                author_email="esha.hinde@handle.com",
                author_name="Esha Hinde",
                status="Draft"
            ),
            Script(
                title="Shadow Play of Varanasi",
                playwright="Esha Hinde",
                genre="Puppetry & Verse",
                language="Hindi & Sanskrit",
                acts="1 Act",
                pages=26,
                roles_count="4 Characters",
                rehearsal_focus="Puppetry & Shadow Screen Projection",
                excerpt="ESHA: Behind the white silk screen, paper shadows dance to ancient verses...",
                content='{"characters":[{"id":"c1","name":"Esha","traits":"Shadow Puppeteer","color":"#475569"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Esha","color":"#475569","text":"Behind the white silk screen, paper shadows dance to ancient verses..."}],"abstract":"An experimental shadow puppetry piece exploring folk mythology.","labels":"Experimental, Puppetry","theme":"Art & Illusion","settingInfo":"Shadow Theatre Screen"}',
                author_email="esha.hinde@handle.com",
                author_name="Esha Hinde",
                status="Pending"
            ),
            Script(
                title="Mudras & Movement: Act II",
                playwright="Samarth Shrivastava",
                genre="Physical Theatre",
                language="Minimal Dialogue",
                acts="1 Act",
                pages=30,
                roles_count="8 Characters",
                rehearsal_focus="Movement Coordination",
                excerpt="SAMARTH: (Cue 1): The ensemble creates a wave motion across the stage floor...",
                content='{"characters":[{"id":"c1","name":"Samarth","traits":"Choreographer / Director","color":"#059669"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Samarth","color":"#059669","text":"(Cue 1): The ensemble creates a wave motion across the stage floor..."}],"abstract":"A physical theatre piece exploring rhythm, breath, and collective movement.","labels":"Physical Theatre, Dance","theme":"Harmony & Synchrony","settingInfo":"Open Rehearsal Hall"}',
                author_email="21f1002840@ds.study.iitm.ac.in",
                author_name="Samarth Shrivastava",
                status="Draft"
            ),
            Script(
                title="Sanskrit Staging Notebook",
                playwright="Utkarsh (Yuuhi)",
                genre="Classical Drama",
                language="Hindi & Sanskrit Verse",
                acts="3 Acts",
                pages=60,
                roles_count="12 Characters",
                rehearsal_focus="Verse Chanting & Mudras",
                excerpt="YUUHI: Nandi stotra completes; the Sutradhar steps onto the holy mandala...",
                content='{"characters":[{"id":"c1","name":"Yuuhi","traits":"Sutradhar","color":"#635f41"}],"lines":[{"id":"l1","characterId":"c1","characterName":"Yuuhi","color":"#635f41","text":"Nandi stotra completes; the Sutradhar steps onto the holy mandala..."}],"abstract":"A study in classical Natyashastra stagecraft adapted for modern audiences.","labels":"Classical, Sanskritic","theme":"Dharma & Aesthetics","settingInfo":"Mandapa Stage"}',
                author_email="21f1005042@ds.study.iitm.ac.in",
                author_name="Utkarsh (Yuuhi)",
                status="Draft"
            )
        ]
        db.session.add_all(default_scripts)
        db.session.commit()

# Ensure tables exist
with app.app_context():
    db.create_all()
    ensure_user_columns()
    seed_default_scripts()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5005))
    app.run(host='0.0.0.0', port=port, debug=True)
