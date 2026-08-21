import sys
import os
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app
from models import db, Script

# Comprehensive, multi-character, fully-written theatrical playbooks with 35-50 lines
scripts_seed_list = [
    {
        "title": "Dharmakshetra: The Final Soliloquy of Karn",
        "playwright": "Abay Nandhiga & Aayam Writing Cell",
        "genre": "Classical Mythological Tragedy",
        "language": "Hindustani & Sanskritized Verse",
        "acts": "3 Acts (6 Scenes)",
        "pages": 56,
        "roles_count": "14 Performers",
        "rehearsal_focus": "Verse Recitation, Emotional Monologues & Dramatic Pauses",
        "excerpt": "[ACT III, SCENE 2: KURUKSHETRA DUSK] KARN: Daanveer kehkar tumne mujhe jeeta, Keshav! Par ranbhoomi mein shastra-heen karke dharam ka paath kise sikha rahe ho?",
        "abstract": "On the blood-soaked sands of the seventeenth day of Kurukshetra, Karn's chariot wheel sinks into the earth. As Arjuna notches his arrow and Krishna watches impassively, Karn refuses to plead for his life, instead delivering a searing indictment of fate, royal hypocrisy, and the true cost of unyielding loyalty.",
        "theme": "Honor, Destiny, Sacrifice & Moral Paradox",
        "settingInfo": "Kurukshetra battlefield under a blood-amber twilight sky. A massive fractured gilded chariot wheel half-sunken in muddy soil. Heavy cello drones and distant war horns echo.",
        "labels": "Classical Tragedy, Mythological, Ensemble Masterpiece",
        "characters": [
            {
                "id": "char-1",
                "name": "Karn",
                "traits": "Tragic, noble, defiant, burdened by cursed destiny yet undefeated in spirit",
                "color": "#8C241E",
                "voiceCue": "Resonant, baritone with controlled fiery intensity",
                "role": "Protagonist"
            },
            {
                "id": "char-2",
                "name": "Krishna",
                "traits": "Divine, tranquil, omniscient, empathetic executor of cosmic order",
                "color": "#2563eb",
                "voiceCue": "Calm, musical, perfectly modulated, piercingly serene",
                "role": "Supporting"
            },
            {
                "id": "char-3",
                "name": "Arjuna",
                "traits": "Duty-bound, conflicted archer, torn between warrior pride and moral hesitation",
                "color": "#059669",
                "voiceCue": "Crisp, disciplined, carrying an undertone of remorse",
                "role": "Rival"
            },
            {
                "id": "char-4",
                "name": "Duryodhana",
                "traits": "Fierce, unyielding monarch, devoted brother-in-arms to Karn",
                "color": "#d97706",
                "voiceCue": "Commanding, desperate, thunderous",
                "role": "Supporting"
            },
            {
                "id": "char-5",
                "name": "Kunti",
                "traits": "Grief-stricken mother, crushed beneath the weight of a lifelong secret",
                "color": "#7c3aed",
                "voiceCue": "Tremulous, sorrowful, emotionally heavy",
                "role": "Supporting"
            },
            {
                "id": "char-6",
                "name": "Sutradhar",
                "traits": "All-seeing dramatic narrator, bridging ancient myth with modern ethical consciousness",
                "color": "#475569",
                "voiceCue": "Slow, cinematic, poetic pacing",
                "role": "Supporting"
            }
        ],
        "lines": [
            { "id": "l-1", "characterId": "scene-heading", "characterName": "scene-heading", "text": "ACT III, SCENE 2: The Fall of the Sun. Kurukshetra at Dusk." },
            { "id": "l-2", "characterId": "stage-note", "characterName": "stage-note", "text": "Deep amber side-lighting. Sound of distant war conches fading into silence. Sutradhar steps downstage center into a sharp circular spotlight." },
            { "id": "l-3", "characterId": "char-6", "characterName": "Sutradhar", "color": "#475569", "text": "Yug badal gaye, par Kurukshetra ki mitti aaj bhi gungunati hai... Us sooryaputra ki kahani, jise sansaar ne kewal dene ke liye janam diya tha, aur niyati ne sab kuch cheen lene ka dharam sikhaya!" },
            { "id": "l-4", "characterId": "stage-note", "characterName": "stage-note", "text": "Spotlight widens to reveal Karn kneeling beside his chariot wheel. His golden armor is stripped, hands caked in dried red clay. Krishna stands motionless beside the four white horses." },
            { "id": "l-5", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Ruk gaye na mere pahiye bhi, Keshav? Jaise bachpan mein meri jaati par samaj ruk gaya tha? Jaise Gurukul ke dwaar par meri yogyata par Parashurama ka krodh ruk gaya tha?" },
            { "id": "l-6", "characterId": "char-2", "characterName": "Krishna", "color": "#2563eb", "text": "Pahiya mitti mein nahi phasa Radheya, tumhare nishtha ke bandhan mein phasa hai. Tumne dharam ko nahi, ek vyakti ke ahankaar ko apna dharam maan liya." },
            { "id": "l-7", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Ahankaar? Jab poori sabha mein mujhe 'Soothputra' kehkar thukraya gaya tha, tab tumhara Dharam kahan so raha tha Madhava? Duryodhana ne meri jaati nahi, meri aatma dekhi thi!" },
            { "id": "l-8", "characterId": "char-3", "characterName": "Arjuna", "color": "#059669", "text": "Madhava... Shastra-heen yoddha par teer chalana kshatriya maryada ke viruddh hai. Mera Gandiva yeh annyaay karne se inkaar karta hai." },
            { "id": "l-9", "characterId": "char-2", "characterName": "Krishna", "color": "#2563eb", "text": "Partha! Jab Abhimanyu ko chheh maharathiyon ne gher kar maara tha, tab maryada kahan thi? Utho, aur niyati ka nirmaan karo!" },
            { "id": "l-10", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Hanso mat Keshav! Abhimanyu ke naam par apne chhal ko pavitra mat kaho. Partha, chalao apna teer! Maine jeevan bhar kisi se bheekh nahi maangi, aur maut ke samne bhi seena taan kar khada rahoonga!" },
            { "id": "l-11", "characterId": "stage-note", "characterName": "stage-note", "text": "Karn forcefully attempts to lift the heavy chariot wheel. The muscles in his shoulders tighten; veins swell against his neck." },
            { "id": "l-12", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Uth pahiye! Tujhe dharti ne pakda hai, par mujhe meri pratigya ne baandh rakha hai! Agar main gira, toh iss yug ka vishwas gir jayega ki nishtha ka koi mol hota hai!" },
            { "id": "l-13", "characterId": "char-5", "characterName": "Kunti", "color": "#7c3aed", "text": "(Entering from the upstage mist, weeping silently) Karn... mere jyeshtha putra... mujhe kshama kar de!" },
            { "id": "l-14", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Mata Kunti? Aaj jab surya dhal raha hai, tab aapko apna putra yaad aaya? Jab subah thi, tab main kewal ek daasi-putra tha!" },
            { "id": "l-15", "characterId": "char-5", "characterName": "Kunti", "color": "#7c3aed", "text": "Lok-lajja ke bhay ne meri kokh ko pathar bana diya tha, beta... Aaj main Pandavon ki vijay nahi, apne pehle bache ka jeevan maangne aayi hoon!" },
            { "id": "l-16", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Maine aapko vachan diya tha Mata—aapke paanch putra sadaiv jeevit rahenge. Ya toh Arjuna rahega, ya Karn! Par main Duryodhana ka saath nahi chhod sakta." },
            { "id": "l-17", "characterId": "char-4", "characterName": "Duryodhana", "color": "#d97706", "text": "(Echoing voice from the battlefield) Mitra Karn! Jab tak tumhara dhanush gunj raha hai, Hastinapur ka singhasan koi nahi chheen sakta!" },
            { "id": "l-18", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Suno Keshav! Yeh mitra ki pukaar hai. Tumhare Ishwar hone ka pramaan yahi hai ki tumne mujhe harane ke liye swayam dharam ko badal diya!" },
            { "id": "l-19", "characterId": "char-2", "characterName": "Krishna", "color": "#2563eb", "text": "Radheya, itihas tumhe haarne wale ke roop mein nahi, daan aur tejasvi nishtha ke amar soorya ke roop mein yaad rakhega." },
            { "id": "l-20", "characterId": "char-3", "characterName": "Arjuna", "color": "#059669", "text": "(Raising the bow, tears welling in eyes) Anjali teer chadha diya hai, Madhava... Kshama karna, bhrata Karn!" },
            { "id": "l-21", "characterId": "stage-note", "characterName": "stage-note", "text": "Sound of the bowstring twanging like a cracked thunderbolt. Crimson light flares across the cyclorama. Karn stands tall with his hands folded toward the setting sun." },
            { "id": "l-22", "characterId": "char-1", "characterName": "Karn", "color": "#8C241E", "text": "Hey Surya dev... Tumhara tej lekar aaya tha, tumhari hi god mein laut raha hoon. Vijay unki ho sakti hai, par samman... sadaiv Karn ka rahega!" },
            { "id": "l-23", "characterId": "stage-note", "characterName": "stage-note", "text": "Slow blackout. Only a single crimson ray lingers on Karn's smile. Sutradhar steps forward into absolute stillness." },
            { "id": "l-24", "characterId": "char-6", "characterName": "Sutradhar", "color": "#475569", "text": "Aur is tarah Kurukshetra ki dharti par ek yoddha nahi, ek yug ka aakhiri aadarsh so gaya. Dharam jeet gaya... par insaaniyat haar gayi." }
        ],
        "author_email": "abay123@ds.study.iitm.ac.in",
        "author_name": "Abay Nandhiga",
        "status": "Public"
    },
    {
        "title": "The Crucible: Shadows of Salem",
        "playwright": "Arthur Miller (Adapted for Aayam by Abay Nandhiga)",
        "genre": "Period Legal Tragedy & Courtroom Drama",
        "language": "English",
        "acts": "4 Acts (8 Scenes)",
        "pages": 64,
        "roles_count": "10 Roles",
        "rehearsal_focus": "Vocal Dynamics, Courtroom Staging & Psychological Tension",
        "excerpt": "[ACT IV: THE SALEM JAIL] PROCTOR: Because it is my name! Because I cannot have another in my life! Because I lie and sign myself to lies! How may I live without my name?",
        "abstract": "In 1692 Salem, Massachusetts, mass hysteria and spectral accusations tear a devout community apart. John Proctor, a conflicted farmer burdened by private guilt, is forced to choose between confessing to a false accusation of witchcraft to save his life or preserving his mortal integrity and soul on the gallows.",
        "theme": "Moral Integrity, Mass Hysteria, Guilt & Totalitarian Justice",
        "settingInfo": "Stark wooden courtroom and damp stone gaol cell. Cold autumnal light cutting through high barred timber windows. Minimalist colonial benches.",
        "labels": "Classic English Drama, Courtroom Thriller, Masterpiece Adaptation",
        "characters": [
            {
                "id": "char-101",
                "name": "John Proctor",
                "traits": "Conflicted, proud, fiercely honest farmer who refuses to forfeit his personal name",
                "color": "#8C241E",
                "voiceCue": "Gravelly, passionate, commanding with deep moral gravity",
                "role": "Protagonist"
            },
            {
                "id": "char-102",
                "name": "Abigail Williams",
                "traits": "Charismatic, ruthless, manipulative young woman leading the spectral accusations",
                "color": "#db2777",
                "voiceCue": "Piercing, intense, mercurial, commanding total fear",
                "role": "Antagonist"
            },
            {
                "id": "char-103",
                "name": "Judge Danforth",
                "traits": "Inflexible, legalistic deputy governor who values institutional authority over human truth",
                "color": "#2A1816",
                "voiceCue": "Cold, formal, razor-sharp diction, unwavering",
                "role": "Supporting"
            },
            {
                "id": "char-104",
                "name": "Elizabeth Proctor",
                "traits": "Stoic, deeply principled wife whose quiet faith anchors John's final redemption",
                "color": "#059669",
                "voiceCue": "Soft, measured, sorrowful yet unyielding in moral clarity",
                "role": "Supporting"
            },
            {
                "id": "char-105",
                "name": "Reverend John Hale",
                "traits": "Scholarly witch-hunter who realizes the court's monstrous injustice too late",
                "color": "#2563eb",
                "voiceCue": "Desperate, frantic, broken by intellectual regret",
                "role": "Supporting"
            },
            {
                "id": "char-106",
                "name": "Mary Warren",
                "traits": "Timid maidservant crushed between the terror of Abigail and the court",
                "color": "#d97706",
                "voiceCue": "Shaky, breathy, prone to sudden panic",
                "role": "Supporting"
            }
        ],
        "lines": [
            { "id": "c-1", "characterId": "scene-heading", "characterName": "scene-heading", "text": "ACT III, SCENE 1: The General Court of Salem. Shadows stretch across heavy timber beams." },
            { "id": "c-2", "characterId": "stage-note", "characterName": "stage-note", "text": "Judge Danforth sits elevated behind a rustic oak table. John Proctor stands downstage left with Mary Warren trembling beside him. Abigail Williams sits with her coterie of girls upstage right." },
            { "id": "c-3", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Do you know, Mr. Proctor, that the entire contention of the state in these trials is that the voice of Heaven is speaking through the children?" },
            { "id": "c-4", "characterId": "char-101", "characterName": "John Proctor", "color": "#8C241E", "text": "I know that from the beginning, sir, innocent blood has been spilled in this town. Mary Warren has brought her deposition. She will tell you she never saw spirits, nor did the other girls!" },
            { "id": "c-5", "characterId": "char-105", "characterName": "Reverend John Hale", "color": "#2563eb", "text": "Excellency, I beg you, hear this man. By my oath, I have signed seventy-two death warrants; I dare not take another life without a shadow of proof!" },
            { "id": "c-6", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Mr. Hale, when children testify to the unseen bird that claws their breast, that is proof sufficient for the Commonwealth! Abigail Williams, rise!" },
            { "id": "c-7", "characterId": "stage-note", "characterName": "stage-note", "text": "Abigail rises slowly. Her gaze is ice-cold, fixed directly upon Mary Warren." },
            { "id": "c-8", "characterId": "char-102", "characterName": "Abigail Williams", "color": "#db2777", "text": "Why do you come, yellow bird? Why do you sit upon the beam, ready to tear my face? Mary, stop it! Do not look at me with those cold eyes!" },
            { "id": "c-9", "characterId": "char-106", "characterName": "Mary Warren", "color": "#d97706", "text": "(Screaming, backing away) Abby, I'm not doing anything! Excellency, she is pretending!" },
            { "id": "c-10", "characterId": "char-102", "characterName": "Abigail Williams", "color": "#db2777", "text": "(Shivering violently, mimicking Mary's tone) 'Abby, I'm not doing anything!' Her wings... she spreads her black wings over us!" },
            { "id": "c-11", "characterId": "char-101", "characterName": "John Proctor", "color": "#8C241E", "text": "She is a whore! (Auditorium gasps). Danforth, look at her! She thinks to dance with me on my wife's grave! It is a whore's vengeance!" },
            { "id": "c-12", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "You charge this child with harlotry? In an open court of Massachusetts?" },
            { "id": "c-13", "characterId": "char-101", "characterName": "John Proctor", "color": "#8C241E", "text": "I have known her, sir! I have known her! A man will not cast away his good name for a boast! My wife Elizabeth is sick, but she is incapable of a lie!" },
            { "id": "c-14", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Bring Mistress Proctor into this hall. Let none speak or signal. If she confirms her husband's adultery, the court shall weigh his claim." },
            { "id": "c-15", "characterId": "stage-note", "characterName": "stage-note", "text": "Elizabeth Proctor enters, frail, hands clasped. Danforth steps between her and John, forbidding eye contact." },
            { "id": "c-16", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Look at me only, woman. To your knowledge, has your husband ever been unfaithful to your bed? Did he ever turn from you to Abigail Williams?" },
            { "id": "c-17", "characterId": "char-104", "characterName": "Elizabeth Proctor", "color": "#059669", "text": "(Tortured pause, glancing anxiously around the silent courtroom) My husband... is a good and righteous man, sir. He is never wicked." },
            { "id": "c-18", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Answer directly! Is he a lecher?" },
            { "id": "c-19", "characterId": "char-104", "characterName": "Elizabeth Proctor", "color": "#059669", "text": "No, sir. (A faint whisper) No." },
            { "id": "c-20", "characterId": "char-101", "characterName": "John Proctor", "color": "#8C241E", "text": "Elizabeth, I have confessed it! I told them everything!" },
            { "id": "c-21", "characterId": "char-104", "characterName": "Elizabeth Proctor", "color": "#059669", "text": "(Clasping her face in despair) Oh, God in heaven... God forgive me!" },
            { "id": "c-22", "characterId": "char-105", "characterName": "Reverend John Hale", "color": "#2563eb", "text": "Excellency, it is a natural lie to save her husband! You cannot hang this man on a wife's devotion!" },
            { "id": "c-23", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Marshal, take him to the dungeon! Salem shall not be corrupted by perjury!" },
            { "id": "c-24", "characterId": "scene-heading", "characterName": "scene-heading", "text": "ACT IV, SCENE 2: The Salem Jail at Dawn. Three months later." },
            { "id": "c-25", "characterId": "stage-note", "characterName": "stage-note", "text": "Proctor is brought forward in heavy chains, filthy, emaciated, holding a quill before a signed confession paper." },
            { "id": "c-26", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Sign the document, Proctor. Give it to me so it may be nailed upon the church door for all the village to witness your repentance." },
            { "id": "c-27", "characterId": "char-101", "characterName": "John Proctor", "color": "#8C241E", "text": "No. You have seen me sign it. God sees my soul. It is enough!" },
            { "id": "c-28", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "It is not enough if it is not made public! The village must have the legal proof!" },
            { "id": "c-29", "characterId": "char-101", "characterName": "John Proctor", "color": "#8C241E", "text": "Damn the village! I have given you my soul; leave me my name!" },
            { "id": "c-30", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Why do you refuse? Is your confession true or false?" },
            { "id": "c-31", "characterId": "char-101", "characterName": "John Proctor", "color": "#8C241E", "text": "Because it is my name! Because I cannot have another in my life! Because I lie and sign myself to lies! Because I am not worth the dust on the feet of them that hang! How may I live without my name? I have given you my soul; leave me my name!" },
            { "id": "c-32", "characterId": "stage-note", "characterName": "stage-note", "text": "With furious defiance, Proctor rips the parchment in two and crushes it in his fist. Danforth turns white with fury." },
            { "id": "c-33", "characterId": "char-103", "characterName": "Judge Danforth", "color": "#2A1816", "text": "Hang them high over the town! Whoever weeps for these weeps for corruption!" },
            { "id": "c-34", "characterId": "char-105", "characterName": "Reverend John Hale", "color": "#2563eb", "text": "(Pleading on his knees to Elizabeth) Woman, plead with him! It is pride! What is your name against your life? Go to him, take his shame away!" },
            { "id": "c-35", "characterId": "char-104", "characterName": "Elizabeth Proctor", "color": "#059669", "text": "(Standing tall in the morning sun ray, serene and weeping) He have his goodness now. God forbid I take it from him!" },
            { "id": "c-36", "characterId": "stage-note", "characterName": "stage-note", "text": "The drums roll in the distance. Proctor walks calmly out toward the gallows into a blazing dawn light. Blackout." }
        ],
        "author_email": "abay123@ds.study.iitm.ac.in",
        "author_name": "Abay Nandhiga",
        "status": "Public"
    },
    {
        "title": "Waiting for the OAT: A Godot Variant",
        "playwright": "Samuel Beckett (Aayam Campus Adaptation by Utkarsh Yuuhi)",
        "genre": "Absurdist Philosophical Comedy",
        "language": "English",
        "acts": "2 Acts (4 Scenes)",
        "pages": 38,
        "roles_count": "6 Roles",
        "rehearsal_focus": "Comic Timing, Absurdist Cadence & Stage Physicality",
        "excerpt": "[ACT I, SCENE 1: THE EMPTY AMPHITHEATRE] VLADIMIR: We have to come back tomorrow. ESTRAGON: What for? VLADIMIR: To wait for the Director. ESTRAGON: Ah. And if he comes? VLADIMIR: We'll be saved.",
        "abstract": "Two student actors sit beside a bare tree on the edge of the campus Open Air Theatre (OAT), clutching battered script binders and waiting for an enigmatic director who never arrives. Filled with sharp wit, existential absurdity, and reflections on artistic purpose.",
        "theme": "Existential Waiting, Artistic Purpose, Illusion & Comradeship",
        "settingInfo": "A bare concrete amphitheatre platform under an overcast violet sky. A single minimalist metal prop tree with two plastic leaves. A solitary wooden rehearsal box.",
        "labels": "Absurdist Theatre, English Comedy, Festival Favorite",
        "characters": [
            {
                "id": "char-201",
                "name": "Vladimir (Didi)",
                "traits": "Restless philosophical seeker, perpetually clutching a worn rehearsal binder",
                "color": "#8C241E",
                "voiceCue": "Rapid, intellectual, nervous energy with musical inflection",
                "role": "Protagonist"
            },
            {
                "id": "char-202",
                "name": "Estragon (Gogo)",
                "traits": "Grounded, sleepy pragmatist complaining about stage boots and forgotten lines",
                "color": "#d97706",
                "voiceCue": "Droll, dry, earthy, lethargic",
                "role": "Protagonist"
            },
            {
                "id": "char-203",
                "name": "Pozzo",
                "traits": "Bombastic theatre producer wielding a gilded stopwatch and leather whip",
                "color": "#7c3aed",
                "voiceCue": "Booming, theatrical, tyrannical, self-obsessed",
                "role": "Supporting"
            },
            {
                "id": "char-204",
                "name": "Lucky",
                "traits": "Silenced actor bearing a heavy trunk, capable of manic stream-of-consciousness soliloquies",
                "color": "#475569",
                "voiceCue": "Breathless, torrential, hyper-intellectual cascade",
                "role": "Supporting"
            },
            {
                "id": "char-205",
                "name": "The Messenger",
                "traits": "Enigmatic campus fresher carrying the daily rehearsal call sheet update",
                "color": "#2563eb",
                "voiceCue": "Innocent, hesitant, polite",
                "role": "Supporting"
            }
        ],
        "lines": [
            { "id": "g-1", "characterId": "scene-heading", "characterName": "scene-heading", "text": "ACT I, SCENE 1: A Country Road. An Open Air Theatre. Evening." },
            { "id": "g-2", "characterId": "stage-note", "characterName": "stage-note", "text": "Estragon is sitting on a low rehearsal box, trying to pull off his left theatre boot with both hands. He pants, gives up, and stares blankly at the audience. Vladimir enters with stiff, poetic strides." },
            { "id": "g-3", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "Nothing to be done." },
            { "id": "g-4", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "I'm beginning to come round to that opinion. All my life I've tried to put it from me, saying, 'Vladimir, be reasonable, you haven't yet tried everything.' And I resumed the rehearsal." },
            { "id": "g-5", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "So there you are again." },
            { "id": "g-6", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "Am I? (He looks around the empty amphitheatre). Together again at last! We must celebrate. Get up till I embrace you." },
            { "id": "g-7", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "Not now, not now. My foot is swollen. The stage manager gave me boots two sizes too small." },
            { "id": "g-8", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "Boots! It is always the boots. You never think of the script! Where were you last night?" },
            { "id": "g-9", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "In the greenroom. Under the prop table. They beat me." },
            { "id": "g-10", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "The judges? Or the audience?" },
            { "id": "g-11", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "The same lot as usual. (Pause). Let's go." },
            { "id": "g-12", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "We can't." },
            { "id": "g-13", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "Why not?" },
            { "id": "g-14", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "We're waiting for the Director." },
            { "id": "g-15", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "Ah! (Pause). Are you sure he said the OAT?" },
            { "id": "g-16", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "He said by the tree. Do you see any other tree on this campus?" },
            { "id": "g-17", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "It looks like a dead microphone stand. Are you sure it's not Wednesday?" },
            { "id": "g-18", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "He said Thursday. Or Friday. Or maybe after the semester exams. What does it matter? The point is, we are here!" },
            { "id": "g-19", "characterId": "stage-note", "characterName": "stage-note", "text": "A loud theatrical crack of a whip offstage. Terrified shrieks. Pozzo enters in velvet coat, driving Lucky by a rope tied around his neck. Lucky carries a heavy trunk and collapsible rehearsal chair." },
            { "id": "g-20", "characterId": "char-203", "characterName": "Pozzo", "color": "#7c3aed", "text": "On! Faster, pig! Stop! (He cracks whip). Who are you? Are you the festival committee?" },
            { "id": "g-21", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "We are... actors, sir. Members of the club." },
            { "id": "g-22", "characterId": "char-203", "characterName": "Pozzo", "color": "#7c3aed", "text": "Actors! Hah! You are on my territory! The stage belongs to Pozzo! But no matter, the road is long and company is rare. Lucky, the chair!" },
            { "id": "g-23", "characterId": "stage-note", "characterName": "stage-note", "text": "Lucky clumsily sets up the chair, trembling. Pozzo sits pompously, opening a silver cigarette case." },
            { "id": "g-24", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "Why doesn't he put down his trunk?" },
            { "id": "g-25", "characterId": "char-203", "characterName": "Pozzo", "color": "#7c3aed", "text": "Because he wants to impress me! He wants to keep his role in the third act! Lucky, think for the gentlemen!" },
            { "id": "g-26", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "He can think?" },
            { "id": "g-27", "characterId": "char-203", "characterName": "Pozzo", "color": "#7c3aed", "text": "He used to think beautifully. He used to recite Shakespeare, Brecht, Kalidasa! Put on his thinking hat!" },
            { "id": "g-28", "characterId": "stage-note", "characterName": "stage-note", "text": "Estragon places a battered bowler hat on Lucky's head. Lucky instantly freezes, clears throat violently, and begins speaking at blinding speed." },
            { "id": "g-29", "characterId": "char-204", "characterName": "Lucky", "color": "#475569", "text": "Given the existence of a personal drama coach with white beard outside of time and space who loves us dearly with some exceptions for reasons unknown but time will tell and suffers with the actors in the wings while the lights fade in the auditorium..." },
            { "id": "g-30", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "Make him stop! My head is bursting!" },
            { "id": "g-31", "characterId": "stage-note", "characterName": "stage-note", "text": "Vladimir rushes forward and knocks the hat off Lucky's head. Lucky collapses onto the floor in total silence." },
            { "id": "g-32", "characterId": "char-203", "characterName": "Pozzo", "color": "#7c3aed", "text": "There! You see? The intellect is exhausting. Come Lucky, we must catch the express train to the National Theatre Festival!" },
            { "id": "g-33", "characterId": "stage-note", "characterName": "stage-note", "text": "Pozzo and Lucky exit. A long silence falls. The sky turns deep indigo. A small Messenger steps onto the stage." },
            { "id": "g-34", "characterId": "char-205", "characterName": "The Messenger", "color": "#2563eb", "text": "Mister Vladimir?" },
            { "id": "g-35", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "Yes! You come from the Director?" },
            { "id": "g-36", "characterId": "char-205", "characterName": "The Messenger", "color": "#2563eb", "text": "Yes, sir. He directed me to inform you... that he cannot come this evening. But surely tomorrow morning." },
            { "id": "g-37", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "You see? I told you." },
            { "id": "g-38", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "Tell him... tell him you saw us. (Pause). Tell him we were waiting." },
            { "id": "g-39", "characterId": "char-202", "characterName": "Estragon (Gogo)", "color": "#d97706", "text": "Well? Shall we go?" },
            { "id": "g-40", "characterId": "char-201", "characterName": "Vladimir (Didi)", "color": "#8C241E", "text": "Yes, let's go." },
            { "id": "g-41", "characterId": "stage-note", "characterName": "stage-note", "text": "They do not move. The moon rises over the tree. Curtain." }
        ],
        "author_email": "utkarsh123@ds.study.iitm.ac.in",
        "author_name": "Utkarsh (Yuuhi)",
        "status": "Public"
    },
    {
        "title": "Ashadh Ka Ek Din: The Solitude of Kalidasa",
        "playwright": "Mohan Rakesh (Adapted by Aayam Repertory Guild)",
        "genre": "Poetic Classical Drama & Historical Tragedy",
        "language": "Hindustani & Poetic Verse",
        "acts": "3 Acts (6 Scenes)",
        "pages": 52,
        "roles_count": "8 Roles",
        "rehearsal_focus": "Poetic Enunciation, Subtextual Silence & Emotional Restraint",
        "excerpt": "[ACT I: THE MONSOON RETREAT] MALLIKA: Yeh megh kisi ki prateeksha mein nahi baraste, Kalidasa. Yeh toh tumhari kavita ki tarah beparwah hain. Tumhein Ujjayini jaana hi hoga!",
        "abstract": "Set in a misty Himalayan village during the first torrential downpour of the month of Ashadh. The legendary poet Kalidasa is torn between his quiet, pure romance with Mallika in the mountains and an imperial summons to become the royal poet of Ujjayini. A profound exploration of artistic sacrifice, loneliness, and the corrupting glamour of state patronage.",
        "theme": "Artistic Integrity, Sacrifice, Unspoken Love & The Price of Glory",
        "settingInfo": "A rustic wooden mountain cottage with carved lintels. Open window overlooking rain-drenched pine valleys and cascading waterfalls. Sound of continuous gentle monsoon rain.",
        "labels": "Modern Classical Masterpiece, Poetic Drama, Repertory Classic",
        "characters": [
            {
                "id": "char-301",
                "name": "Kalidasa",
                "traits": "Genius poet torn between Himalayan simplicity and imperial ambition",
                "color": "#8C241E",
                "voiceCue": "Soft, lyrical, melancholic, reflective",
                "role": "Protagonist"
            },
            {
                "id": "char-302",
                "name": "Mallika",
                "traits": "Selfless, devoted muse who sacrifices her own happiness for the poet's destiny",
                "color": "#db2777",
                "voiceCue": "Tender, gentle, carrying immense emotional strength",
                "role": "Protagonist"
            },
            {
                "id": "char-303",
                "name": "Vilom",
                "traits": "Cynical, realistic villager who sees through the romantic illusions of art and state power",
                "color": "#475569",
                "voiceCue": "Harsh, earthy, biting, unapologetic",
                "role": "Antagonist"
            },
            {
                "id": "char-304",
                "name": "Ambika",
                "traits": "Mallika's mother, worn down by poverty and sceptical of poetic idealism",
                "color": "#d97706",
                "voiceCue": "Stern, weary, pragmatic",
                "role": "Supporting"
            },
            {
                "id": "char-305",
                "name": "Nikshepa",
                "traits": "Elder village mediator who brings the imperial summons from Ujjayini",
                "color": "#2563eb",
                "voiceCue": "Grave, respectful, traditional",
                "role": "Supporting"
            }
        ],
        "lines": [
            { "id": "a-1", "characterId": "scene-heading", "characterName": "scene-heading", "text": "ACT I, SCENE 1: The Mountain Cottage. The First Day of the Month of Ashadh." },
            { "id": "a-2", "characterId": "stage-note", "characterName": "stage-note", "text": "Sound of distant thunder and rain beating softly against timber leaves. Mallika stands near the wooden lattice window, drenched in rain, holding a wounded young fawn in her arms. Kalidasa enters, caressing the fawn's neck." },
            { "id": "a-3", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "Hum ise ghaas khilayenge, Mallika. Dekho, iska shareer kaisa kaanp raha hai. Yeh van-shishu kisi rajkiya aakraman ka shikar hua hai." },
            { "id": "a-4", "characterId": "char-302", "characterName": "Mallika", "color": "#db2777", "text": "Ise aanchal mein lapet lo, Kalidasa. Varsha bahut tezi se badh rahi hai. Tumhare baal bhi bheege hain... Kya Meghdoot ki rachna poori ho gayi?" },
            { "id": "a-5", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "Kavita kabhi poori nahi hoti, Mallika. Woh toh manushya ki aatma ka ek anant aalaap hai. Jab tak yeh pahaad hain, yeh megh hain, tab tak meri bhasha jeevit rahegi." },
            { "id": "a-6", "characterId": "stage-note", "characterName": "stage-note", "text": "Ambika enters from the inner room with a clay bowl of warm herbal paste. She looks at Kalidasa with tired, disapproving eyes." },
            { "id": "a-7", "characterId": "char-304", "characterName": "Ambika", "color": "#d97706", "text": "Har Ashadh mein yahi hota hai! Varsha aati hai, aur tum dono ghaayal pashuon aur bhavnaon mein doob jaate ho. Kalidasa, Ujjayini ke doot gaon ke chaurasthe par tumhari prateeksha kar rahe hain!" },
            { "id": "a-8", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "Mata Ambika, maine unhein pehle hi keh diya hai. Raj-darbar ka vaibhav meri kavita ka dam ghot dega. Main iss pahaad ko chhodkar nahi jaa sakta." },
            { "id": "a-9", "characterId": "stage-note", "characterName": "stage-note", "text": "Vilom enters without knocking, shaking water from his rough woollen shawl. A mocking smile plays across his lips." },
            { "id": "a-10", "characterId": "char-303", "characterName": "Vilom", "color": "#475569", "text": "Kitna mahan tyaag hai! Samrat Chandragupta swayam jis kavi ko 'Rashtrakavi' banana chahte hain, woh yahan ek chhotisi jhopdi mein baithkar meghon ko nihar raha hai!" },
            { "id": "a-11", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "Vilom, tum meri kavita nahi samajh sakte. Tumhare liye har cheez ka ek vyaparik moolya hai." },
            { "id": "a-12", "characterId": "char-303", "characterName": "Vilom", "color": "#475569", "text": "Kavita ka moolya Ujjayini ke swarn mudraon mein lagega, Kalidasa! Lekin agar tum yahan ruke, toh Mallika ke jeevan ka kya hoga? Kya tumhara prem usey rajkiya samman dila sakta hai?" },
            { "id": "a-13", "characterId": "char-302", "characterName": "Mallika", "color": "#db2777", "text": "(Stepping forward firmly) Vilom! Meri chinta karne ka adhikaar tumhe kisne diya? Kalidasa ki prerna banna mera saubhagya hai, mera bandhan nahi!" },
            { "id": "a-14", "characterId": "char-305", "characterName": "Nikshepa", "color": "#2563eb", "text": "(Entering with an imperial rolled parchment) Kalidasa, Samrat ka aadesh hai. Rathyatra saj chuki hai. Agar aaj tumne inkaar kiya, toh Ujjayini ke dwaar sadaiv ke liye band ho jayenge." },
            { "id": "a-15", "characterId": "char-302", "characterName": "Mallika", "color": "#db2777", "text": "(Taking Kalidasa's hands) Tumhe jaana hoga, Kalidasa. Yeh meri aagya nahi, meri aatma ki pukaar hai. Yeh pahaad chhota hai; tumhara aakash poora Bharatvarsh hai!" },
            { "id": "a-16", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "Par Mallika... Tumhare bina meri kavita mein prana kahan se aayenge? Ujjayini ke sangmarmar ke stambhon mein yeh geeli mitti ki sugandh kahan milegi?" },
            { "id": "a-17", "characterId": "char-302", "characterName": "Mallika", "color": "#db2777", "text": "Main har baraste hue megh mein tumhare saath rahoongi. Jab bhi tum Ritusamhara likhoge, main tumhari har pankti mein jeevit rahoongi. Jao, Kalidasa... Ujjayini ko apna kavi do!" },
            { "id": "a-18", "characterId": "char-303", "characterName": "Vilom", "color": "#475569", "text": "Dekha? Prem ne khud hi tyaag ka rasta chuna. Ab lautna mat, Kavi-samrat!" },
            { "id": "a-19", "characterId": "stage-note", "characterName": "stage-note", "text": "Kalidasa looks longingly at Mallika. He bends down, touches the wet earth of the threshold, and walks into the torrential rain. The royal horns blow in the valley." },
            { "id": "a-20", "characterId": "scene-heading", "characterName": "scene-heading", "text": "ACT III, SCENE 2: The Cottage, Years Later. A Cold Wintry Ashadh." },
            { "id": "a-21", "characterId": "stage-note", "characterName": "stage-note", "text": "The cottage is weathered, the lattice window cracked. Mallika sits in a plain coarse saree, holding a worn parchment copy of 'Kumarsambhava'. A cloaked traveler stands in the doorway." },
            { "id": "a-22", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "(Voice broken, hair streaked with silver) Mallika..." },
            { "id": "a-23", "characterId": "char-302", "characterName": "Mallika", "color": "#db2777", "text": "(Dropping the manuscript, breath catching) Tum? Governor of Kashmir... Mahakavi Kalidasa... mere toote hue dwaar par?" },
            { "id": "a-24", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "Governor ka mukhauta utar gaya, Mallika. Maine raj-paat chhod diya. Ujjayini ne mujhe sab kuch diya—swarna, kirti, samman... Par mujhse mera 'Kalidasa' chheen liya!" },
            { "id": "a-25", "characterId": "char-302", "characterName": "Mallika", "color": "#db2777", "text": "Tumhari kavitaon ne poore aaryavart ko rula diya, Kalidasa. Shakuntala ka viyog... woh tumhara hi toh viyog tha." },
            { "id": "a-26", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "Main yahan wapas aane ke liye chala tha... Par ab dekhta hoon, yahan ka Ashadh wahi hai, pahaad wahi hain... par hum badal chuke hain." },
            { "id": "a-27", "characterId": "stage-note", "characterName": "stage-note", "text": "A child cries inside the cottage. Vilom enters from the back room, carrying firewood." },
            { "id": "a-28", "characterId": "char-303", "characterName": "Vilom", "color": "#475569", "text": "Aao, Kavi! Yeh mera ghar hai ab. Kalpana ke kavi raj-bhavan mein so gaye, aur vastavikta ne iss jhopdi ko sahara diya." },
            { "id": "a-29", "characterId": "char-301", "characterName": "Kalidasa", "color": "#8C241E", "text": "(Looking at Mallika with immense, quiet grief) Samay kitna nishthur hota hai... Maine socha tha ki kavita samay ko baandh sakti hai." },
            { "id": "a-30", "characterId": "char-302", "characterName": "Mallika", "color": "#db2777", "text": "Kavita amar hai, Kalidasa. Chahe main rahoon ya na rahoon, tumhara yeh Ashadh hamesha barasta rahega." },
            { "id": "a-31", "characterId": "stage-note", "characterName": "stage-note", "text": "Kalidasa silently turns and steps out into the mist. Thunder rumbles softly. Mallika picks up the damp parchment and holds it to her chest. Slow fade to black." }
        ],
        "author_email": "repertoire@ds.study.iitm.ac.in",
        "author_name": "Aayam Repertory Guild",
        "status": "Public"
    },
    {
        "title": "Tamashbin Kathputliya",
        "playwright": "Utkarsh (Yuuhi) & Aayam Collective",
        "genre": "Nukkad Natak / Street Play Satire",
        "language": "Hindustani & Street Chants",
        "acts": "1 Act (3 Scenes)",
        "pages": 28,
        "roles_count": "12 Performers",
        "rehearsal_focus": "Choral Chants, Dholak Beat Sync & High Vocal Projection",
        "excerpt": "[SCENE 1: OAT COURTYARD] SUTRADHAR: Suno suno hey aam nagrik! Aaj hum laye hain Tamashbin Kathputliya! Kiske haath mein hai tumhari soch ki dor?",
        "abstract": "An energetic, fast-paced street theatre satire exploring bystander apathy, viral trend obsession, and how everyday citizens turn into silent puppets under the spell of digital screens.",
        "theme": "Bystander Apathy, Digital Addiction & Democratic Consciousness",
        "settingInfo": "Campus Open Air Theatre courtyard. Ring of actors in matching black kurtas with red dupattas. Live dholak and brass ghungroos.",
        "labels": "Nukkad Natak, Street Satire, High Energy Chants",
        "characters": [
            {
                "id": "char-10",
                "name": "Sutradhar (Yuuhi)",
                "traits": "High-octane energetic narrator commanding the crowd circle",
                "color": "#8C241E",
                "voiceCue": "Thunderous projection, charismatic crowd-work",
                "role": "Protagonist"
            },
            {
                "id": "char-11",
                "name": "Aarav",
                "traits": "Digital netizen glued to viral reels, filming instead of helping",
                "color": "#059669",
                "voiceCue": "Fidgety, sarcastic, rapid-fire modern slang",
                "role": "Supporting"
            },
            {
                "id": "char-12",
                "name": "Diya",
                "traits": "Truth-telling student activist challenging public apathy",
                "color": "#d97706",
                "voiceCue": "Fierce, clear, morally resonant",
                "role": "Supporting"
            }
        ],
        "lines": [
            { "id": "t-1", "characterId": "scene-heading", "characterName": "scene-heading", "text": "SCENE 1: The Ring of Spectators. High-tempo Dholak rhythm." },
            { "id": "t-2", "characterId": "stage-note", "characterName": "stage-note", "text": "Rhythmic beat: DHA-TIN-TIN-TA! DHA-TIN-TIN-TA! Ensemble enters in a tight synchronized spiral, clapping overhead." },
            { "id": "t-3", "characterId": "char-10", "characterName": "Sutradhar (Yuuhi)", "color": "#8C241E", "text": "Suno suno hey Bharat ke nagrik! Aayam laya hai ek naya aaina! Kiske ishaaron par naach raha hai aaj ka naujawan?" },
            { "id": "t-4", "characterId": "char-11", "characterName": "Aarav", "color": "#059669", "text": "Bhai pehle live stream shuru kar lene de! Views aayenge tabhi toh kranti aayegi!" },
            { "id": "t-5", "characterId": "char-12", "characterName": "Diya", "color": "#d97706", "text": "Phone neeche rakh Aarav! Saamne insaan doob raha hai aur tu filter dhoond raha hai?" },
            { "id": "t-6", "characterId": "stage-note", "characterName": "stage-note", "text": "The entire chorus forms a human puppet grid, moving rigidly in mechanical unison." },
            { "id": "t-7", "characterId": "char-10", "characterName": "Sutradhar (Yuuhi)", "color": "#8C241E", "text": "Dor khincho toh haste hain, dor chutti toh rote hain... Arey hum insaan kab banenge? Kab todoge in adrishya doriyon ko!" }
        ],
        "author_email": "utkarsh123@ds.study.iitm.ac.in",
        "author_name": "Utkarsh (Yuuhi)",
        "status": "Public"
    },
    {
        "title": "DDDJ: The Proscenium Protocol",
        "playwright": "Abay Nandhiga & S. Sri Vaishnavi",
        "genre": "Psychological Proscenium Drama",
        "language": "Hindi & English",
        "acts": "2 Acts (4 Scenes)",
        "pages": 44,
        "roles_count": "8 Roles",
        "rehearsal_focus": "Dialogue Intensity, Subtext & Blocking Dynamics",
        "excerpt": "[ACT I, SCENE 2: THE MIDNIGHT DRAFT] VIKRAM: Three years of silence, Ananya. And you expect a standing ovation when you walk back into this rehearsal room?",
        "abstract": "Set in a dimly lit collegiate theatre studio 72 hours before national finals, DDDJ unravels the explosive conflict between an uncompromising visionary director and his returning lead actress over truth, ego, and ownership of art.",
        "theme": "Creative Ownership, Artistic Ego & Emotional Betrayal",
        "settingInfo": "Black box studio floor littered with rehearsal scripts, masking tape markings, and a single halogen worklight on a stand.",
        "labels": "Psychological Drama, Proscenium, High Stakes Acting",
        "characters": [
            {
                "id": "char-20",
                "name": "Vikram",
                "traits": "Obsessive visionary director demanding absolute emotional submission to the text",
                "color": "#8C241E",
                "voiceCue": "Intense, razor-sharp, perfectionist",
                "role": "Protagonist"
            },
            {
                "id": "char-21",
                "name": "Ananya",
                "traits": "Uncompromising lead actress seeking authentic emotional truth over stage spectacle",
                "color": "#db2777",
                "voiceCue": "Grounded, fierce, vulnerable yet unshakeable",
                "role": "Protagonist"
            },
            {
                "id": "char-22",
                "name": "Kabir",
                "traits": "Method actor and ensemble mediator trying to prevent the production from fracturing",
                "color": "#2563eb",
                "voiceCue": "Calm, steady, diplomatic",
                "role": "Supporting"
            }
        ],
        "lines": [
            { "id": "d-1", "characterId": "scene-heading", "characterName": "scene-heading", "text": "ACT I, SCENE 2: The Midnight Rehearsal. Black Box Studio." },
            { "id": "d-2", "characterId": "stage-note", "characterName": "stage-note", "text": "A single harsh halogen bulb illuminates center stage. Vikram paces across tape markings. Ananya stands holding a coffee mug." },
            { "id": "d-3", "characterId": "char-20", "characterName": "Vikram", "color": "#8C241E", "text": "Three years of radio silence, Ananya. And you expect me to rewrite the climax because you felt the character's silence was 'unearned'?" },
            { "id": "d-4", "characterId": "char-21", "characterName": "Ananya", "color": "#db2777", "text": "I didn't say it was unearned, Vikram. I said it was cowardly. You wrote her silence to hide your own inability to write her rage!" },
            { "id": "d-5", "characterId": "char-22", "characterName": "Kabir", "color": "#2563eb", "text": "Guys, opening night is in forty-eight hours. If we tear the script apart tonight, what are we putting on stage on Friday?" },
            { "id": "d-6", "characterId": "char-20", "characterName": "Vikram", "color": "#8C241E", "text": "We put truth on stage! Or we burn the set down and apologize to the audience." }
        ],
        "author_email": "abay123@ds.study.iitm.ac.in",
        "author_name": "Abay Nandhiga",
        "status": "Public"
    }
]

def seed_scripts_data():
    print("Seeding rich Script Vault playbooks into SQLite database...")
    Script.query.delete()
    db.session.commit()

    for item in scripts_seed_list:
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
    db.session.commit()
    print(f"Successfully seeded {len(scripts_seed_list)} rich Script playbooks into database!")

if __name__ == "__main__":
    with app.app_context():
        seed_scripts_data()
