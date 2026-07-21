from app import app
from models import db, Script

scripts_seed_list = [
    {
        "title": "Tamashbin Kathputliya",
        "playwright": "Aayam Collective & Utkarsh (Yuuhi)",
        "genre": "Nukkad Natak / Street Play",
        "language": "Hindustani & English",
        "acts": "1 Act (2 Scenes)",
        "pages": 18,
        "roles_count": "12 Performers",
        "rehearsal_focus": "Choral Chants, Dholak Beat Sync & Crowd Projection",
        "excerpt": "[SCENE 1: COURTYARD] (All performers enter in a circular formation, clapping rhythmically.) SUTRADHAR: Suno suno hey Bharat ke logo! Aaj hum laye hain Tamashbin Kathputliya...",
        "content": """[SCENE 1: COURTYARD]
(All performers enter in a circular formation, clapping rhythmically with live dholak beats.)

SUTRADHAR:
Suno suno hey Bharat ke logo! Aaj hum laye hain Tamashbin Kathputliya!
(Chorus hums in harmony)

CHORUS:
Hum kathputli hain ya insaan? Kiske haath mein hai hamara dhaar?

PERFORMER 1 (Aarav):
Ye Shehar nahi ye mela hai, har aadmi yahan akela hai!

PERFORMER 2 (Diya):
Pardey ke peeche ki dor kisne pakdi hai? Bolega kaun?

(Freeze frame in staggered diagonal poses)""",
        "author_email": "utkarsh123@ds.study.iitm.ac.in",
        "author_name": "Utkarsh (Yuuhi)",
        "status": "Public"
    },
    {
        "title": "DDDJ - Stage Playbook",
        "playwright": "Abay Nandhiga & Aayam Writing Cell",
        "genre": "Proscenium Drama",
        "language": "Hindi & English",
        "acts": "2 Acts",
        "pages": 42,
        "roles_count": "8 Roles",
        "rehearsal_focus": "Dialogue Intensity, Pauses & Stage Blocking",
        "excerpt": "[ACT I, SCENE 2] (Center Stage: Dim warm spotlight. Vikram sits at the study desk holding a worn leather journal.) VIKRAM: Three years of silence. And you expect a standing ovation?",
        "content": """[ACT I, SCENE 2]
(Center Stage: Dim warm spotlight. Vikram sits at the study desk holding a worn leather journal.)

VIKRAM:
Three years of silence. And you expect a standing ovation when you walk back into this studio?

ANANYA:
(Stepping out from stage left shadow)
I didn't come for an ovation, Vikram. I came for the manuscript.

VIKRAM:
(Slams book down)
The manuscript was burnt the night the curtains fell!""",
        "author_email": "abay123@ds.study.iitm.ac.in",
        "author_name": "Abay Nandhiga",
        "status": "Public"
    },
    {
        "title": "Karn Ki Yachika",
        "playwright": "Classical Hindi Adaptation",
        "genre": "Classical Tragedy",
        "language": "Hindi (Sanskritized)",
        "acts": "3 Acts",
        "pages": 56,
        "roles_count": "14 Roles",
        "rehearsal_focus": "Verse Recitation, Emotional Monologues & Diction",
        "excerpt": "[SCENE 4: KURUKSHETRA SUNSET] KARN: Daanveer kehkar tumne mujhe jeeta, par ranbhoomi mein shastra-heen karke dharam ka paath sikhayege?",
        "content": """[SCENE 4: KURUKSHETRA SUNSET]
(Earthy amber lighting fills the background. Chariot wheel half-buried in the soil.)

KARN:
Daanveer kehkar tumne mujhe jeeta, par ranbhoomi mein shastra-heen karke dharam ka paath sikhayege?

KRISHNA:
(Calm voice over low flute soundscape)
Radheya, dharam kisi shastra par nahi, tumhare vicharo par aadharit hai.

KARN:
Toh suno, Parashurama ke shrap se bhi bada shrap tha mera apna vishwas!""",
        "author_email": "abay123@ds.study.iitm.ac.in",
        "author_name": "Abay Nandhiga",
        "status": "Public"
    },
    {
        "title": "Samatvam",
        "playwright": "Samarth Shrivastava",
        "genre": "Ensemble Drama",
        "language": "Hindi & English",
        "acts": "2 Acts",
        "pages": 35,
        "roles_count": "9 Roles",
        "rehearsal_focus": "Micro-expressions & Group Choric Sync",
        "excerpt": "[ACT II, SCENE 1] (Aayam Studio B. Table lamps glowing.) SAMARTH: Balance is not staying still. It is moving without falling apart.",
        "content": """[ACT II, SCENE 1]
(Aayam Studio B. Table lamps glowing softly.)

SAMARTH:
Balance is not staying still. It is moving without falling apart.

SNEHA:
Easy to write in a script, Samarth. Harder when the stage lights are blinding you!""",
        "author_email": "samarth123@ds.study.iitm.ac.in",
        "author_name": "Samarth Shrivastava",
        "status": "Public"
    },
    {
        "title": "Speak Up Tara",
        "playwright": "Swati Singh",
        "genre": "Social Awareness Play",
        "language": "Hindustani",
        "acts": "1 Act",
        "pages": 24,
        "roles_count": "6 Roles",
        "rehearsal_focus": "Vocal Projection & Audience Monologues",
        "excerpt": "[FINAL MONOLOGUE] TARA: Jab tak tum chup rahoge, tab tak har aawaz dabayi jayegi. Aaj main bolungi!",
        "content": """[FINAL MONOLOGUE]
(Tara steps to downstage center, breaking the fourth wall.)

TARA:
Jab tak tum chup rahoge, tab tak har aawaz dabayi jayegi. Aaj main bolungi! Aur meri aawaz is sabha ke har kone mein gunjegi!""",
        "author_email": "swati123@ds.study.iitm.ac.in",
        "author_name": "Swati Singh",
        "status": "Public"
    },
    {
        "title": "Court of Shadows",
        "playwright": "Abay Nandhiga",
        "genre": "Historical Mystery",
        "language": "English & Hindi",
        "acts": "2 Acts",
        "pages": 28,
        "roles_count": "7 Roles",
        "rehearsal_focus": "Suspense Pacing",
        "excerpt": "[DRAFT WORKSHOP] ABAY: The seal on the royal decree was broken long before midnight...",
        "content": "[DRAFT WORKSHOP] ABAY: The seal on the royal decree was broken long before midnight...",
        "author_email": "abay123@ds.study.iitm.ac.in",
        "author_name": "Abay Nandhiga",
        "status": "Draft"
    },
    {
        "title": "The Last Soliloquy",
        "playwright": "Abay Nandhiga",
        "genre": "Monologue Showcase",
        "language": "English",
        "acts": "1 Act",
        "pages": 12,
        "roles_count": "1 Solo Role",
        "rehearsal_focus": "Solo Stage Presence",
        "excerpt": "[PENDING PUBLISH APPROVAL] Solo performer under blue spotlight...",
        "content": "[PENDING PUBLISH APPROVAL] Solo performer under blue spotlight...",
        "author_email": "abay123@ds.study.iitm.ac.in",
        "author_name": "Abay Nandhiga",
        "status": "Pending"
    }
]

def seed_scripts_data():
    print("Seeding Script Vault playbooks in database...")
    Script.query.delete()
    db.session.commit()

    for item in scripts_seed_list:
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
            content=item["content"],
            author_email=item["author_email"],
            author_name=item["author_name"],
            status=item["status"]
        )
        db.session.add(s)
    db.session.commit()
    print(f"Successfully seeded {len(scripts_seed_list)} Script playbooks into database!")

if __name__ == "__main__":
    with app.app_context():
        seed_scripts_data()
