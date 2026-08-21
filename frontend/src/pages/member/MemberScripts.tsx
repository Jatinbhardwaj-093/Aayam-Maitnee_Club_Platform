// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Download,
  FileText,
  Lock,
  BookOpen,
  Users,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Plus,
  Edit3,
  Trash2,
  Send,
  Clock,
  ShieldAlert,
  X,
  FilePlus,
  Eye,
  Bot,
  Sparkles,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { exportScriptToPdf } from "@/utils/scriptPdfExport";

interface ScriptItem {
  id: number;
  title: string;
  playwright: string;
  genre: string;
  language: string;
  acts: string;
  pages: number;
  rolesCount: string;
  rehearsalFocus: string;
  excerpt: string;
  content: string;
  author_email: string;
  author_name: string;
  status: string;
  created_at: string;
}

const fallbackPublicScripts: ScriptItem[] = [
  {
    id: 1,
    title: "Dharmakshetra: The Final Soliloquy of Karn",
    playwright: "Abay Nandhiga & Aayam Writing Cell",
    genre: "Classical Mythological Tragedy",
    language: "Hindustani & Sanskritized Verse",
    acts: "3 Acts (6 Scenes)",
    pages: 56,
    rolesCount: "14 Performers",
    rehearsalFocus: "Verse Recitation, Emotional Monologues & Dramatic Pauses",
    excerpt: "[ACT III, SCENE 2: KURUKSHETRA DUSK] KARN: Daanveer kehkar tumne mujhe jeeta, Keshav! Par ranbhoomi mein shastra-heen karke dharam ka paath kise sikha rahe ho?",
    content: JSON.stringify({
      title: "Dharmakshetra: The Final Soliloquy of Karn",
      playwright: "Abay Nandhiga & Aayam Writing Cell",
      abstract: "On the blood-soaked sands of the seventeenth day of Kurukshetra, Karn's chariot wheel sinks into the earth. As Arjuna notches his arrow and Krishna watches impassively, Karn refuses to plead for his life, instead delivering a searing indictment of fate, royal hypocrisy, and the true cost of unyielding loyalty.",
      theme: "Honor, Destiny, Sacrifice & Moral Paradox",
      settingInfo: "Kurukshetra battlefield under a blood-amber twilight sky. A massive fractured gilded chariot wheel half-sunken in muddy soil.",
      characters: [
        { id: "c1", name: "Karn", traits: "Tragic noble warrior, undefeated in spirit", color: "#8C241E", role: "Protagonist" },
        { id: "c2", name: "Krishna", traits: "Divine, tranquil, omniscient", color: "#2563eb", role: "Supporting" },
        { id: "c3", name: "Arjuna", traits: "Conflicted archer, torn between duty and honor", color: "#059669", role: "Rival" },
        { id: "c4", name: "Kunti", traits: "Grief-stricken mother", color: "#7c3aed", role: "Supporting" },
        { id: "c5", name: "Sutradhar", traits: "Dramatic choric narrator", color: "#475569", role: "Narrator" }
      ],
      lines: [
        { id: "l1", characterName: "scene-heading", text: "ACT III, SCENE 2: The Fall of the Sun. Kurukshetra at Dusk." },
        { id: "l2", characterName: "stage-note", text: "Amber side-lighting. Sound of distant war conches fading into silence." },
        { id: "l3", characterName: "Sutradhar", color: "#475569", text: "Yug badal gaye, par Kurukshetra ki mitti aaj bhi gungunati hai... Us sooryaputra ki kahani, jise sansaar ne kewal dene ke liye janam diya tha, aur niyati ne sab kuch cheen lene ka dharam sikhaya!" },
        { id: "l4", characterName: "Karn", color: "#8C241E", text: "Ruk gaye na mere pahiye bhi, Keshav? Jaise bachpan mein meri jaati par samaj ruk gaya tha? Jaise Gurukul ke dwaar par meri yogyata par Parashurama ka krodh ruk gaya tha?" },
        { id: "l5", characterName: "Krishna", color: "#2563eb", text: "Pahiya mitti mein nahi phasa Radheya, tumhare nishtha ke bandhan mein phasa hai. Tumne dharam ko nahi, ek vyakti ke ahankaar ko apna dharam maan liya." },
        { id: "l6", characterName: "Karn", color: "#8C241E", text: "Ahankaar? Jab poori sabha mein mujhe 'Soothputra' kehkar thukraya gaya tha, tab tumhara Dharam kahan so raha tha Madhava? Duryodhana ne meri jaati nahi, meri aatma dekhi thi!" },
        { id: "l7", characterName: "Arjuna", color: "#059669", text: "Madhava... Shastra-heen yoddha par teer chalana kshatriya maryada ke viruddh hai." },
        { id: "l8", characterName: "Krishna", color: "#2563eb", text: "Partha! Jab Abhimanyu ko chheh maharathiyon ne gher kar maara tha, tab maryada kahan thi? Utho, aur niyati ka nirmaan karo!" },
        { id: "l9", characterName: "Karn", color: "#8C241E", text: "Teer chalao, Arjuna! Maine jeevan bhar yachika nahi ki, aur maut ke samne bhi seena taan kar khada rahoonga!" },
        { id: "l10", characterName: "stage-note", text: "Karn forcefully attempts to lift the heavy chariot wheel. The muscles in his shoulders tighten." },
        { id: "l11", characterName: "Kunti", color: "#7c3aed", text: "(Entering from the mist) Karn... mere jyeshtha putra... mujhe kshama kar de!" },
        { id: "l12", characterName: "Karn", color: "#8C241E", text: "Mata Kunti? Aaj jab surya dhal raha hai, tab aapko apna putra yaad aaya? Maine aapko vachan diya tha—aapke paanch putra sadaiv jeevit rahenge!" },
        { id: "l13", characterName: "Krishna", color: "#2563eb", text: "Radheya, itihas tumhe haarne wale ke roop mein nahi, daan aur tejasvi nishtha ke amar soorya ke roop mein yaad rakhega." },
        { id: "l14", characterName: "Karn", color: "#8C241E", text: "Hey Surya dev... Tumhara tej lekar aaya tha, tumhari hi god mein laut raha hoon. Vijay unki ho sakti hai, par samman... sadaiv Karn ka rahega!" },
        { id: "l15", characterName: "stage-note", text: "Slow blackout. Only a single crimson ray lingers on Karn's smile." }
      ]
    }),
    author_email: "abay123@ds.study.iitm.ac.in",
    author_name: "Abay Nandhiga",
    status: "Public",
    created_at: "Aug 2026"
  },
  {
    id: 2,
    title: "The Crucible: Shadows of Salem",
    playwright: "Arthur Miller (Adapted by Abay Nandhiga)",
    genre: "Period Legal Tragedy & Courtroom Drama",
    language: "English",
    acts: "4 Acts (8 Scenes)",
    pages: 64,
    rolesCount: "10 Roles",
    rehearsalFocus: "Vocal Dynamics, Courtroom Staging & Psychological Tension",
    excerpt: "[ACT IV: THE SALEM JAIL] PROCTOR: Because it is my name! Because I cannot have another in my life! Because I lie and sign myself to lies! How may I live without my name?",
    content: JSON.stringify({
      title: "The Crucible: Shadows of Salem",
      playwright: "Arthur Miller (Adapted by Abay Nandhiga)",
      abstract: "In 1692 Salem, mass hysteria and spectral accusations tear a devout community apart. John Proctor, a conflicted farmer burdened by private guilt, must choose between signing a false confession to save his mortal life or preserving his name and integrity on the gallows.",
      theme: "Moral Integrity, Mass Hysteria, Guilt & Totalitarian Justice",
      settingInfo: "Stark wooden courtroom and damp stone gaol cell. Cold autumnal light cutting through high barred timber windows.",
      characters: [
        { id: "c101", name: "John Proctor", traits: "Conflicted, proud, fiercely honest farmer", color: "#8C241E", role: "Protagonist" },
        { id: "c102", name: "Abigail Williams", traits: "Charismatic, ruthless, manipulative young accuser", color: "#db2777", role: "Antagonist" },
        { id: "c103", name: "Judge Danforth", traits: "Inflexible, authoritarian deputy governor", color: "#2A1816", role: "Supporting" },
        { id: "c104", name: "Elizabeth Proctor", traits: "Stoic, deeply principled wife", color: "#059669", role: "Supporting" },
        { id: "c105", name: "Reverend John Hale", traits: "Scholarly witch-hunter filled with remorse", color: "#2563eb", role: "Supporting" },
        { id: "c106", name: "Mary Warren", traits: "Timid maidservant crushed between two fires", color: "#d97706", role: "Supporting" }
      ],
      lines: [
        { id: "cl1", characterName: "scene-heading", text: "ACT III, SCENE 1: The General Court of Salem. Autumn 1692." },
        { id: "cl2", characterName: "stage-note", text: "Judge Danforth sits elevated behind a rustic oak table. John Proctor stands with Mary Warren trembling beside him." },
        { id: "cl3", characterName: "Judge Danforth", color: "#2A1816", text: "Do you know, Mr. Proctor, that the entire contention of the state in these trials is that the voice of Heaven is speaking through the children?" },
        { id: "cl4", characterName: "John Proctor", color: "#8C241E", text: "I know that from the beginning, sir, innocent blood has been spilled in this town. Mary Warren has brought her deposition. She will tell you she never saw spirits!" },
        { id: "cl5", characterName: "Reverend John Hale", color: "#2563eb", text: "Excellency, I beg you, hear this man. By my oath, I dare not take another life without a shadow of proof!" },
        { id: "cl6", characterName: "Judge Danforth", color: "#2A1816", text: "Mr. Hale, when children testify to the unseen bird that claws their breast, that is proof sufficient for the Commonwealth! Abigail Williams, rise!" },
        { id: "cl7", characterName: "Abigail Williams", color: "#db2777", text: "Why do you come, yellow bird? Why do you sit upon the beam, ready to tear my face? Mary, stop it! Do not look at me with those cold eyes!" },
        { id: "cl8", characterName: "Mary Warren", color: "#d97706", text: "(Screaming, backing away) Abby, I'm not doing anything! Excellency, she is pretending!" },
        { id: "cl9", characterName: "John Proctor", color: "#8C241E", text: "She is a whore! (Auditorium gasps). Danforth, look at her! She thinks to dance with me on my wife's grave! It is a whore's vengeance!" },
        { id: "cl10", characterName: "Judge Danforth", color: "#2A1816", text: "Bring Mistress Proctor into this hall. Let none speak or signal. If she confirms her husband's adultery, the court shall weigh his claim." },
        { id: "cl11", characterName: "Judge Danforth", color: "#2A1816", text: "Look at me only, woman. To your knowledge, has your husband ever been unfaithful to your bed?" },
        { id: "cl12", characterName: "Elizabeth Proctor", color: "#059669", text: "(Tortured pause, glancing anxiously around the courtroom) My husband... is a good and righteous man, sir. No, sir. No." },
        { id: "cl13", characterName: "John Proctor", color: "#8C241E", text: "Elizabeth, I have confessed it! I told them everything!" },
        { id: "cl14", characterName: "Elizabeth Proctor", color: "#059669", text: "(Clasping her face in despair) Oh, God in heaven... God forgive me!" },
        { id: "cl15", characterName: "scene-heading", text: "ACT IV, SCENE 2: The Salem Jail at Dawn. Three months later." },
        { id: "cl16", characterName: "Judge Danforth", color: "#2A1816", text: "Sign the document, Proctor. Give it to me so it may be nailed upon the church door for all the village to witness your repentance." },
        { id: "cl17", characterName: "John Proctor", color: "#8C241E", text: "No. You have seen me sign it. God sees my soul. It is enough!" },
        { id: "cl18", characterName: "Judge Danforth", color: "#2A1816", text: "Why do you refuse? Is your confession true or false?" },
        { id: "cl19", characterName: "John Proctor", color: "#8C241E", text: "Because it is my name! Because I cannot have another in my life! Because I lie and sign myself to lies! How may I live without my name? I have given you my soul; leave me my name!" },
        { id: "cl20", characterName: "stage-note", text: "With furious defiance, Proctor rips the parchment in two and crushes it in his fist." },
        { id: "cl21", characterName: "Judge Danforth", color: "#2A1816", text: "Hang them high over the town! Whoever weeps for these weeps for corruption!" },
        { id: "cl22", characterName: "Elizabeth Proctor", color: "#059669", text: "(Standing tall in the morning sun ray, serene and weeping) He have his goodness now. God forbid I take it from him!" }
      ]
    }),
    author_email: "abay123@ds.study.iitm.ac.in",
    author_name: "Abay Nandhiga",
    status: "Public",
    created_at: "Aug 2026"
  },
  {
    id: 3,
    title: "Waiting for the OAT: A Godot Variant",
    playwright: "Samuel Beckett (Adapted by Utkarsh Yuuhi)",
    genre: "Absurdist Philosophical Comedy",
    language: "English",
    acts: "2 Acts (4 Scenes)",
    pages: 38,
    rolesCount: "6 Roles",
    rehearsalFocus: "Comic Timing, Absurdist Cadence & Stage Physicality",
    excerpt: "[ACT I: THE EMPTY AMPHITHEATRE] VLADIMIR: We have to come back tomorrow. ESTRAGON: What for? VLADIMIR: To wait for the Director. ESTRAGON: Ah. And if he comes? VLADIMIR: We'll be saved.",
    content: JSON.stringify({
      title: "Waiting for the OAT: A Godot Variant",
      playwright: "Samuel Beckett (Adapted by Utkarsh Yuuhi)",
      abstract: "Two collegiate actors sit beside a bare tree on the edge of the campus Open Air Theatre, clutching battered script binders and waiting for an enigmatic director who never arrives.",
      theme: "Existential Waiting, Artistic Purpose, Illusion & Comradeship",
      settingInfo: "A bare concrete amphitheatre platform under an overcast violet sky. A single minimalist metal prop tree with two plastic leaves.",
      characters: [
        { id: "c201", name: "Vladimir (Didi)", traits: "Restless philosophical seeker with script binder", color: "#8C241E", role: "Protagonist" },
        { id: "c202", name: "Estragon (Gogo)", traits: "Sleepy pragmatist complaining about boots", color: "#d97706", role: "Protagonist" },
        { id: "c203", name: "Pozzo", traits: "Bombastic theatre producer with whip", color: "#7c3aed", role: "Supporting" },
        { id: "c204", name: "Lucky", traits: "Silenced actor bearing heavy props trunk", color: "#475569", role: "Supporting" },
        { id: "c205", name: "The Messenger", traits: "Enigmatic campus fresher with call sheet", color: "#2563eb", role: "Supporting" }
      ],
      lines: [
        { id: "gl1", characterName: "scene-heading", text: "ACT I, SCENE 1: An Open Air Theatre. Evening." },
        { id: "gl2", characterName: "stage-note", text: "Estragon is sitting on a low rehearsal box, struggling with his left theatre boot. Vladimir enters with poetic strides." },
        { id: "gl3", characterName: "Estragon (Gogo)", color: "#d97706", text: "Nothing to be done." },
        { id: "gl4", characterName: "Vladimir (Didi)", color: "#8C241E", text: "I'm beginning to come round to that opinion. Together again at last! We must celebrate." },
        { id: "gl5", characterName: "Estragon (Gogo)", color: "#d97706", text: "Not now. My foot is swollen. The stage manager gave me boots two sizes too small. Let's go." },
        { id: "gl6", characterName: "Vladimir (Didi)", color: "#8C241E", text: "We can't." },
        { id: "gl7", characterName: "Estragon (Gogo)", color: "#d97706", text: "Why not?" },
        { id: "gl8", characterName: "Vladimir (Didi)", color: "#8C241E", text: "We're waiting for the Director." },
        { id: "gl9", characterName: "Estragon (Gogo)", color: "#d97706", text: "Ah! (Pause). Are you sure he said the OAT?" },
        { id: "gl10", characterName: "Vladimir (Didi)", color: "#8C241E", text: "He said by the tree. Do you see any other tree on this campus?" },
        { id: "gl11", characterName: "stage-note", text: "Pozzo enters driving Lucky by a rope. Lucky carries a heavy trunk and rehearsal chair." },
        { id: "gl12", characterName: "Pozzo", color: "#7c3aed", text: "On! Faster, pig! Stop! (He cracks whip). The stage belongs to Pozzo! Lucky, think for the gentlemen!" },
        { id: "gl13", characterName: "stage-note", text: "Estragon places a bowler hat on Lucky's head. Lucky instantly starts speaking rapidly." },
        { id: "gl14", characterName: "Lucky", color: "#475569", text: "Given the existence of a personal drama coach outside of time and space who loves us dearly with some exceptions while the lights fade in the auditorium..." },
        { id: "gl15", characterName: "Estragon (Gogo)", color: "#d97706", text: "Make him stop! My head is bursting!" },
        { id: "gl16", characterName: "stage-note", text: "Vladimir knocks the hat off Lucky's head. Lucky collapses into silence. Pozzo exits driving Lucky." },
        { id: "gl17", characterName: "The Messenger", color: "#2563eb", text: "Mister Vladimir? The Director cannot come this evening. But surely tomorrow morning." },
        { id: "gl18", characterName: "Vladimir (Didi)", color: "#8C241E", text: "Tell him... tell him you saw us. Tell him we were waiting." },
        { id: "gl19", characterName: "Estragon (Gogo)", color: "#d97706", text: "Well? Shall we go?" },
        { id: "gl20", characterName: "Vladimir (Didi)", color: "#8C241E", text: "Yes, let's go." },
        { id: "gl21", characterName: "stage-note", text: "They do not move. The moon rises over the tree. Curtain." }
      ]
    }),
    author_email: "utkarsh123@ds.study.iitm.ac.in",
    author_name: "Utkarsh (Yuuhi)",
    status: "Public",
    created_at: "Aug 2026"
  },
  {
    id: 4,
    title: "Ashadh Ka Ek Din: The Solitude of Kalidasa",
    playwright: "Mohan Rakesh (Adapted by Aayam Guild)",
    genre: "Poetic Classical Drama & Historical Tragedy",
    language: "Hindustani & Poetic Verse",
    acts: "3 Acts (6 Scenes)",
    pages: 52,
    rolesCount: "8 Roles",
    rehearsalFocus: "Poetic Enunciation, Subtextual Silence & Emotional Restraint",
    excerpt: "[ACT I: THE MONSOON RETREAT] MALLIKA: Yeh megh kisi ki prateeksha mein nahi baraste, Kalidasa. Yeh toh tumhari kavita ki tarah beparwah hain. Tumhein Ujjayini jaana hi hoga!",
    content: JSON.stringify({
      title: "Ashadh Ka Ek Din: The Solitude of Kalidasa",
      playwright: "Mohan Rakesh (Adapted by Aayam Guild)",
      abstract: "Set in a misty Himalayan village during the first downpour of Ashadh. The poet Kalidasa is torn between his pure love with Mallika in the mountains and an imperial summons to become royal poet of Ujjayini.",
      theme: "Artistic Integrity, Sacrifice, Unspoken Love & The Price of Glory",
      settingInfo: "A rustic wooden mountain cottage overlooking rain-drenched pine valleys. Sound of continuous gentle monsoon rain.",
      characters: [
        { id: "c301", name: "Kalidasa", traits: "Genius poet torn between nature and empire", color: "#8C241E", role: "Protagonist" },
        { id: "c302", name: "Mallika", traits: "Selfless muse who sacrifices for art", color: "#db2777", role: "Protagonist" },
        { id: "c303", name: "Vilom", traits: "Cynical realist villager", color: "#475569", role: "Antagonist" },
        { id: "c304", name: "Ambika", traits: "Mallika's weary mother", color: "#d97706", role: "Supporting" }
      ],
      lines: [
        { id: "al1", characterName: "scene-heading", text: "ACT I, SCENE 1: The Mountain Cottage. The First Day of Ashadh." },
        { id: "al2", characterName: "stage-note", text: "Sound of gentle thunder. Mallika stands near the wooden window holding a wounded fawn in her arms. Kalidasa enters." },
        { id: "al3", characterName: "Kalidasa", color: "#8C241E", text: "Hum ise ghaas khilayenge, Mallika. Dekho, iska shareer kaisa kaanp raha hai." },
        { id: "al4", characterName: "Mallika", color: "#db2777", text: "Ise aanchal mein lapet lo, Kalidasa. Kya Meghdoot ki rachna poori ho gayi?" },
        { id: "al5", characterName: "Kalidasa", color: "#8C241E", text: "Kavita kabhi poori nahi hoti, Mallika. Woh toh manushya ki aatma ka ek anant aalaap hai." },
        { id: "al6", characterName: "Vilom", color: "#475569", text: "(Entering with mocking smile) Kitna mahan tyaag hai! Samrat Chandragupta swayam jis kavi ko Rashtrakavi banana chahte hain, woh yahan baithkar meghon ko nihar raha hai!" },
        { id: "al7", characterName: "Mallika", color: "#db2777", text: "(Stepping forward firmly) Tumhe jaana hoga, Kalidasa. Yeh pahaad chhota hai; tumhara aakash poora Bharatvarsh hai!" },
        { id: "al8", characterName: "Kalidasa", color: "#8C241E", text: "Par Mallika... Tumhare bina meri kavita mein prana kahan se aayenge?" },
        { id: "al9", characterName: "Mallika", color: "#db2777", text: "Main har baraste hue megh mein tumhare saath rahoongi. Jao, Kalidasa... Ujjayini ko apna kavi do!" },
        { id: "al10", characterName: "scene-heading", text: "ACT III, SCENE 2: The Cottage, Years Later. A Cold Wintry Ashadh." },
        { id: "al11", characterName: "Kalidasa", color: "#8C241E", text: "(Voice broken, hair streaked with silver) Maine raj-paat chhod diya, Mallika. Ujjayini ne mujhe sab kuch diya... Par mujhse mera Kalidasa chheen liya!" },
        { id: "al12", characterName: "Mallika", color: "#db2777", text: "Kavita amar hai, Kalidasa. Chahe main rahoon ya na rahoon, tumhara yeh Ashadh hamesha barasta rahega." }
      ]
    }),
    author_email: "repertoire@ds.study.iitm.ac.in",
    author_name: "Aayam Guild",
    status: "Public",
    created_at: "Aug 2026"
  },
  {
    id: 5,
    title: "Tamashbin Kathputliya",
    playwright: "Utkarsh (Yuuhi) & Aayam Collective",
    genre: "Nukkad Natak / Street Play Satire",
    language: "Hindustani & Street Chants",
    acts: "1 Act (3 Scenes)",
    pages: 28,
    rolesCount: "12 Performers",
    rehearsalFocus: "Choral Chants, Dholak Beat Sync & High Vocal Projection",
    excerpt: "[SCENE 1: OAT COURTYARD] SUTRADHAR: Suno suno hey aam nagrik! Aaj hum laye hain Tamashbin Kathputliya! Kiske haath mein hai tumhari soch ki dor?",
    content: JSON.stringify({
      title: "Tamashbin Kathputliya",
      playwright: "Utkarsh (Yuuhi) & Aayam Collective",
      abstract: "An energetic street theatre showcase exploring how modern digital screens turn everyday citizens into mindless puppets and silent spectators.",
      theme: "Bystander Apathy, Digital Addiction & Democratic Voice",
      characters: [
        { id: "c10", name: "Sutradhar (Yuuhi)", traits: "High-octane narrator", color: "#8C241E", role: "Protagonist" },
        { id: "c11", name: "Aarav", traits: "Digital netizen, obsessed with reels", color: "#059669", role: "Supporting" },
        { id: "c12", name: "Diya", traits: "Truth-telling student activist", color: "#d97706", role: "Supporting" }
      ],
      lines: [
        { id: "tl1", characterName: "scene-heading", text: "SCENE 1: The Ring of Spectators. High-tempo Dholak rhythm." },
        { id: "tl2", characterName: "stage-note", text: "Rhythmic beat: DHA-TIN-TIN-TA! Ensemble enters in a tight synchronized spiral." },
        { id: "tl3", characterName: "Sutradhar (Yuuhi)", color: "#8C241E", text: "Suno suno hey Bharat ke logo! Aaj Aayam laya hai ek aisi daastan jo aapki aankhein khol degi!" },
        { id: "tl4", characterName: "Diya", color: "#d97706", text: "Phone neeche rakh Aarav! Saamne insaan doob raha hai aur tu filter dhoond raha hai?" },
        { id: "tl5", characterName: "Sutradhar (Yuuhi)", color: "#8C241E", text: "Kab todoge in doro ko? Kab banoge asli insaan?" }
      ]
    }),
    author_email: "utkarsh123@ds.study.iitm.ac.in",
    author_name: "Utkarsh (Yuuhi)",
    status: "Public",
    created_at: "Aug 2026"
  },
  {
    id: 6,
    title: "DDDJ: The Proscenium Protocol",
    playwright: "Abay Nandhiga & S. Sri Vaishnavi",
    genre: "Psychological Proscenium Drama",
    language: "Hindi & English",
    acts: "2 Acts (4 Scenes)",
    pages: 44,
    rolesCount: "8 Roles",
    rehearsalFocus: "Dialogue Intensity, Subtext & Blocking Dynamics",
    excerpt: "[ACT I, SCENE 2: THE MIDNIGHT DRAFT] VIKRAM: Three years of silence, Ananya. And you expect a standing ovation when you walk back into this rehearsal room?",
    content: JSON.stringify({
      title: "DDDJ: The Proscenium Protocol",
      playwright: "Abay Nandhiga & S. Sri Vaishnavi",
      abstract: "Set in a dimly lit collegiate theatre studio 72 hours before the national finals, DDDJ unravels the explosive conflict between a perfectionist director and his returning lead actress.",
      theme: "Artistic Obsession, Creative Ownership & Trust",
      characters: [
        { id: "c20", name: "Vikram", traits: "Obsessive visionary director", color: "#8C241E", role: "Protagonist" },
        { id: "c21", name: "Ananya", traits: "Uncompromising lead actress", color: "#db2777", role: "Protagonist" },
        { id: "c22", name: "Kabir", traits: "Grounded method actor", color: "#2563eb", role: "Supporting" }
      ],
      lines: [
        { id: "dl1", characterName: "scene-heading", text: "ACT I, SCENE 2: The Midnight Rehearsal. Black Box Studio." },
        { id: "dl2", characterName: "stage-note", text: "A single harsh halogen bulb illuminates center stage." },
        { id: "dl3", characterName: "Vikram", color: "#8C241E", text: "Three years of total radio silence, Ananya. And you expect me to rewrite the third act just because you felt the motivation was ambiguous?" },
        { id: "dl4", characterName: "Ananya", color: "#db2777", text: "I didn't say it was ambiguous, Vikram. I said it was a lie. You wrote a monologue that flatters your own guilt, not her truth!" },
        { id: "dl5", characterName: "Kabir", color: "#2563eb", text: "Guys, festival judges arrive Friday. If we keep tearing up the script every midnight, we won't even have a second act to perform." }
      ]
    }),
    author_email: "abay123@ds.study.iitm.ac.in",
    author_name: "Abay Nandhiga",
    status: "Public",
    created_at: "Aug 2026"
  }
];

export default function MemberScripts() {
  const navigate = useNavigate();
  const { activeUser } = useOutletContext<any>() || {};
  const isMaintainer = activeUser?.role?.toLowerCase().includes("maintainer") || activeUser?.isAdmin || false;

  const [activeTab, setActiveTab] = useState<"public" | "drafts" | "pending">("public");
  const [publicScripts, setPublicScripts] = useState<ScriptItem[]>(fallbackPublicScripts);
  const [myDrafts, setMyDrafts] = useState<ScriptItem[]>([]);
  const [pendingScripts, setPendingScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    playwright: "",
    genre: "Drama",
    language: "Hindi / English",
    acts: "2 Acts",
    pages: 20,
    rolesCount: "8 Roles",
    rehearsalFocus: "Dialogue & Blocking",
    excerpt: "",
    content: "",
    isPublic: false
  });

  const fetchScripts = async () => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const email = activeUser?.email || "member@matinee.club";
      const res = await fetch(`${baseUrl}/api/scripts?user_email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.public_scripts && data.public_scripts.length > 0) {
          setPublicScripts(data.public_scripts);
        } else {
          setPublicScripts(fallbackPublicScripts);
        }
        setMyDrafts(data.my_drafts || []);
        setPendingScripts(data.pending_scripts || []);
      } else {
        setPublicScripts(fallbackPublicScripts);
      }
    } catch (e) {
      console.warn("Using offline fallback scripts:", e);
      setPublicScripts(fallbackPublicScripts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, [activeUser]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const payload = {
      title: formData.title,
      playwright: formData.playwright || activeUser?.name || "Aayam Member",
      genre: formData.genre,
      language: formData.language,
      acts: formData.acts,
      pages: formData.pages,
      rolesCount: formData.rolesCount,
      rehearsalFocus: formData.rehearsalFocus,
      excerpt: formData.excerpt,
      content: formData.content,
      author_email: activeUser?.email || "member@matinee.club",
      author_name: activeUser?.name || "Aayam Performer",
      is_public: isMaintainer ? formData.isPublic : false
    };

    try {
      const res = await fetch(`${baseUrl}/api/scripts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchScripts();
        setCreateOpen(false);
        resetForm();
      } else {
        const mockNew: ScriptItem = {
          id: Date.now(),
          ...payload,
          status: payload.is_public ? "Public" : "Draft",
          created_at: "Just now"
        };
        if (payload.is_public) {
          setPublicScripts((prev) => [mockNew, ...prev]);
        } else {
          setMyDrafts((prev) => [mockNew, ...prev]);
        }
        setCreateOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setCreateOpen(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchScripts();
        setEditOpen(false);
        resetForm();
      } else {
        setMyDrafts((prev) => prev.map((s) => (s.id === formData.id ? { ...s, ...formData } : s)));
        setPublicScripts((prev) => prev.map((s) => (s.id === formData.id ? { ...s, ...formData } : s)));
        setEditOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setEditOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this script permanently?")) return;
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchScripts();
      } else {
        setMyDrafts((prev) => prev.filter((s) => s.id !== id));
        setPublicScripts((prev) => prev.filter((s) => s.id !== id));
        setPendingScripts((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestPublish = async (id: number) => {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}/publish`, { method: "POST" });
      if (res.ok) {
        await fetchScripts();
        alert("Script publication request sent to Maintainers!");
      } else {
        setMyDrafts((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Pending Approval" } : s)));
        alert("Script publication request sent to Maintainers!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePublish = async (id: number) => {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}/approve`, { method: "POST" });
      if (res.ok) {
        await fetchScripts();
        alert("Script approved and published to Public Vault!");
      } else {
        const approvedItem = pendingScripts.find((s) => s.id === id);
        if (approvedItem) {
          setPendingScripts((prev) => prev.filter((s) => s.id !== id));
          setPublicScripts((prev) => [{ ...approvedItem, status: "Public" }, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPublish = async (id: number) => {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await fetch(`${baseUrl}/api/scripts/${id}/reject`, { method: "POST" });
      if (res.ok) {
        await fetchScripts();
      } else {
        setPendingScripts((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      title: "",
      playwright: "",
      genre: "Drama",
      language: "Hindi / English",
      acts: "2 Acts",
      pages: 20,
      rolesCount: "8 Roles",
      rehearsalFocus: "Dialogue & Blocking",
      excerpt: "",
      content: "",
      isPublic: false
    });
  };

  const openEditModal = (script: ScriptItem) => {
    setFormData({
      id: script.id,
      title: script.title,
      playwright: script.playwright,
      genre: script.genre,
      language: script.language,
      acts: script.acts,
      pages: script.pages,
      rolesCount: script.rolesCount,
      rehearsalFocus: script.rehearsalFocus,
      excerpt: script.excerpt,
      content: script.content,
      isPublic: script.status === "Public"
    });
    setEditOpen(true);
  };

  const openViewModal = (script: ScriptItem) => {
    setSelectedScript(script);
    setViewOpen(true);
  };

  const handleDownload = (script: ScriptItem) => {
    exportScriptToPdf(script);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 md:px-8 font-sans text-[#2C2A28] pb-24">
      
      {/* Editorial Header Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8B4AE]/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] bg-[#E85F57]/15 px-3 py-1 rounded-full border border-[#E85F57]/30">
            <FileText className="w-3.5 h-3.5 text-[#B32D25]" />
            <span>PLAYWRITING & PRODUCTION TEXTS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
            Script Vault & Production Texts
          </h1>
          <p className="text-sm text-[#5C3B37] max-w-2xl font-light">
            Verified Aayam production playbooks, confidential scene dialogues, and interactive character lines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/script-builder")}
            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F]"
          >
            <Plus className="w-4 h-4 text-[#FFD0CC]" />
            <span>Create Script</span>
          </button>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center bg-[#E5D2CB] p-1 rounded-full border border-[#D2A59D] overflow-x-auto">
          <button
            onClick={() => setActiveTab("public")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "public"
                ? "bg-[#8C241E] text-[#FDF8F7] shadow-md shadow-[#8C241E]/20"
                : "text-[#6E4742] hover:text-[#2A1816]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Public Vault ({publicScripts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("drafts")}
            className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "drafts"
                ? "bg-[#8C241E] text-[#FDF8F7] shadow-md shadow-[#8C241E]/20"
                : "text-[#6E4742] hover:text-[#2A1816]"
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>My Scripts ({myDrafts.length})</span>
          </button>

          {isMaintainer && (
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === "pending"
                  ? "bg-[#8C241E] text-[#FDF8F7] shadow-md shadow-[#8C241E]/20"
                  : "text-[#6E4742] hover:text-[#2A1816]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Requests ({pendingScripts.length})</span>
              {pendingScripts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#8C241E] animate-ping absolute top-1.5 right-1.5" />
              )}
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-[#6E4742]">
          {isMaintainer ? "Maintainer Authority: Full Playbook Access" : "Member Roster Mode"}
        </div>
      </section>

      {/* Script Grid Content */}
      {loading ? (
        <div className="text-center py-20 text-[#6E4742] font-mono text-xs">Accessing script archives...</div>
      ) : (
        <>
          {/* TAB 1: PUBLIC SCRIPTS */}
          {activeTab === "public" && (
            <div>
              {publicScripts.length === 0 ? (
                <div className="text-center py-16 bg-[#FAF2EE] border border-dashed border-[#DCBAB2] rounded-2xl text-xs text-[#6E4742] font-mono">
                  No public scripts available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {publicScripts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF2EE] border border-[#DCBAB2] hover:border-[#8C241E]/60 rounded-[2.2rem] p-7 md:p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xs group relative overflow-hidden text-left"
                    >
                      {/* Theatrical subtle accent edge */}
                      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#8C241E]/30 to-transparent group-hover:via-[#8C241E] transition-all" />

                      <div className="space-y-4">
                        {/* Editorial Header Ribbon */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#EEDBD5] text-[#8C241E] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D5AAA2] flex items-center gap-1.5 shadow-2xs">
                              <BookOpen className="w-3 h-3 text-[#8C241E]" />
                              <span>{item.genre || "Drama"}</span>
                            </span>
                            {item.language && (
                              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8C5A54] bg-[#F5EAE6] px-2.5 py-1 rounded-full border border-[#DCBAB2]">
                                {item.language}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono font-bold text-[#8C5A54] bg-[#F5EAE6] px-3 py-1 rounded-full border border-[#DCBAB2]">
                              {item.created_at || "2026"}
                            </span>
                            {isMaintainer && (
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-[#FAF2EE] shrink-0" title="Verified Repertoire Script" />
                            )}
                          </div>
                        </div>

                        {/* Title & Playwright */}
                        <div className="space-y-1">
                          <h3 className="text-2xl md:text-[1.65rem] font-serif text-[#2A1816] tracking-tight group-hover:text-[#8C241E] transition-colors leading-snug font-normal">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#6E4742] font-serif italic">
                            by {item.playwright}
                          </p>
                        </div>

                        {/* Manuscript Specification Pills with Icons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1.5 bg-[#F5EAE6] border border-[#DCBAB2] px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-[#2A1816]">
                            <FileText className="w-3 h-3 text-[#8C241E]" />
                            <span>{item.pages} Pages</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-[#F5EAE6] border border-[#DCBAB2] px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium text-[#5C3B37]">
                            <Layers className="w-3 h-3 text-[#8C241E]" />
                            <span>{item.acts}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-[#F5EAE6] border border-[#DCBAB2] px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium text-[#5C3B37]">
                            <Users className="w-3 h-3 text-[#8C241E]" />
                            <span>{item.rolesCount}</span>
                          </span>
                        </div>

                        {/* Theatrical Excerpt / Premise Box */}
                        {item.excerpt && (
                          <blockquote className="text-xs text-[#5C3B37] font-serif italic line-clamp-2 leading-relaxed bg-[#F5EAE6]/90 border border-[#DCBAB2]/80 border-l-[3px] border-l-[#8C241E] p-3.5 rounded-2xl">
                            "{item.excerpt}"
                          </blockquote>
                        )}
                      </div>

                      {/* Clean Action Footer */}
                      <div className="pt-4 border-t border-[#DCBAB2]/70 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => openViewModal(item)}
                            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-[#8C241E]/20 border border-[#A6352F]"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#FFD0CC]" />
                            <span>Read Script</span>
                          </button>

                          <button
                            onClick={() => handleDownload(item)}
                            className="px-3.5 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Direct Download PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-[#8C241E]" />
                            <span>PDF</span>
                          </button>

                          <button
                            onClick={() => navigate(`/script-builder/${item.id}`)}
                            className="px-3.5 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#8C241E] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Open in Script Studio"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8C241E]" />
                            <span>Studio</span>
                          </button>
                        </div>

                        {isMaintainer && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="w-8 h-8 rounded-full text-[#6E4742] hover:text-[#8C241E] hover:bg-[#EEDBD5] border border-[#DCBAB2] flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="w-8 h-8 rounded-full text-[#8C5A54] hover:text-rose-700 hover:bg-rose-50 border border-[#DCBAB2] flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Script"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY SCRIPTS / DRAFTS */}
          {activeTab === "drafts" && (
            <div>
              {myDrafts.length === 0 ? (
                <div className="text-center py-16 bg-[#FAF2EE] border border-dashed border-[#DCBAB2] rounded-2xl p-8 space-y-4">
                  <FilePlus className="w-10 h-10 text-[#8C5A54]/60 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-bold text-[#2A1816]">No personal scripts authored yet</h4>
                    <p className="text-xs text-[#6E4742] max-w-sm mx-auto font-light">
                      Draft your own original one-acts, scene dialogues, or adaptations for Aayam production consideration.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/script-builder")}
                    className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 border border-[#A6352F] cursor-pointer shadow-md shadow-[#8C241E]/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Launch Script Studio
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myDrafts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF2EE] border border-[#DCBAB2] hover:border-[#8C241E]/60 rounded-[2.2rem] p-7 md:p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xs group relative overflow-hidden text-left"
                    >
                      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#8C241E]/30 to-transparent group-hover:via-[#8C241E] transition-all" />

                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#EEDBD5] text-[#8C241E] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D5AAA2] flex items-center gap-1.5 shadow-2xs">
                              <BookOpen className="w-3 h-3 text-[#8C241E]" />
                              <span>{item.genre || "Draft"}</span>
                            </span>
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8C5A54] bg-[#F5EAE6] px-2.5 py-1 rounded-full border border-[#DCBAB2]">
                              {item.created_at || "2026"}
                            </span>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase border shrink-0 ${
                            item.status === "Pending Approval"
                              ? "bg-amber-100 text-amber-950 border-amber-300"
                              : "bg-[#EEDBD5] text-[#8C241E] border-[#D5AAA2]"
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-2xl md:text-[1.65rem] font-serif text-[#2A1816] tracking-tight group-hover:text-[#8C241E] transition-colors leading-snug font-normal">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#6E4742] font-serif italic">
                            by {item.playwright}
                          </p>
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1.5 bg-[#F5EAE6] border border-[#DCBAB2] px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-[#2A1816]">
                            <FileText className="w-3 h-3 text-[#8C241E]" />
                            <span>{item.pages} Pages</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-[#F5EAE6] border border-[#DCBAB2] px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium text-[#5C3B37]">
                            <Layers className="w-3 h-3 text-[#8C241E]" />
                            <span>{item.acts}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-[#F5EAE6] border border-[#DCBAB2] px-2.5 py-1 rounded-xl text-[11px] font-mono font-medium text-[#5C3B37]">
                            <Users className="w-3 h-3 text-[#8C241E]" />
                            <span>{item.rolesCount}</span>
                          </span>
                        </div>

                        {item.excerpt && (
                          <blockquote className="text-xs text-[#5C3B37] font-serif italic line-clamp-2 leading-relaxed bg-[#F5EAE6]/90 border border-[#DCBAB2]/80 border-l-[3px] border-l-[#8C241E] p-3.5 rounded-2xl">
                            "{item.excerpt}"
                          </blockquote>
                        )}
                      </div>

                      {/* Controls Footer */}
                      <div className="pt-4 border-t border-[#DCBAB2]/70 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => openViewModal(item)}
                            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-[#8C241E]/20 border border-[#A6352F]"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#FFD0CC]" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => handleDownload(item)}
                            className="px-3.5 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Direct Download PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-[#8C241E]" />
                            <span>PDF</span>
                          </button>

                          <button
                            onClick={() => navigate(`/script-builder/${item.id}`)}
                            className="px-3.5 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#8C241E] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8C241E]" />
                            <span>Studio</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status !== "Pending Approval" && (
                            <button
                              onClick={() => handleRequestPublish(item.id)}
                              className="px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-[#FDF8F7] text-xs font-mono font-bold uppercase flex items-center gap-1.5 border border-emerald-900 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5 text-[#FFD0CC]" /> Submit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-8 h-8 rounded-full text-[#8C5A54] hover:text-rose-700 hover:bg-rose-50 border border-[#DCBAB2] flex items-center justify-center cursor-pointer transition-all"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PENDING APPROVALS (Maintainer View) */}
          {activeTab === "pending" && isMaintainer && (
            <div>
              {pendingScripts.length === 0 ? (
                <div className="text-center py-16 bg-[#FAF2EE] border border-dashed border-[#DCBAB2] rounded-2xl p-8 space-y-2">
                  <ShieldCheck className="w-10 h-10 text-emerald-800 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-[#2A1816]">No pending script publications</h4>
                  <p className="text-xs text-[#6E4742] font-light">All submitted scripts have been moderated and reviewed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingScripts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF2EE] border border-amber-300 hover:border-amber-400 rounded-[2.2rem] p-7 md:p-8 shadow-xs space-y-5 text-left"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono font-bold text-amber-950 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-900" /> Publication Request
                          </span>
                          <h3 className="text-2xl font-serif text-[#2A1816] tracking-tight font-normal">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#5C3B37] font-medium font-serif">
                            Submitted by <strong>{item.author_name}</strong> ({item.author_email}) • {item.genre || "Drama"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => openViewModal(item)}
                            className="px-4 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase cursor-pointer shadow-xs"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleDownload(item)}
                            className="px-3.5 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#8C241E] text-xs font-mono font-bold uppercase cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </button>
                          <button
                            onClick={() => handleRejectPublish(item.id)}
                            className="px-4 py-2 rounded-full border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase cursor-pointer shadow-xs"
                          >
                            Return
                          </button>
                          <button
                            onClick={() => handleApprovePublish(item.id)}
                            className="px-5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-[#FDF8F7] text-xs font-mono font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-sm border border-emerald-900"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD0CC]" /> Approve & Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL 1: VIEW SCRIPT - Spacious Theatrical Playbook Reader */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent showCloseButton={false} className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] w-full max-w-4xl lg:max-w-5xl rounded-[2.5rem] p-0 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
          
          <button
            type="button"
            onClick={() => setViewOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
            title="Close viewer"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {selectedScript && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-10 space-y-6 text-left">
              <DialogHeader className="border-b border-[#DCBAB2]/70 pb-4 pr-12 text-left space-y-2">
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                  <span className="bg-[#EEDBD5] text-[#8C241E] px-2.5 py-0.5 rounded-full border border-[#D5AAA2]">
                    {selectedScript.genre}
                  </span>
                  {selectedScript.language && (
                    <span className="text-[#6E4742] font-medium">
                      • {selectedScript.language}
                    </span>
                  )}
                  <span className="text-[#D5AAA2]">•</span>
                  <span className="text-[#8C5A54]">{selectedScript.pages || "50+"} Pages</span>
                  <span className="text-[#D5AAA2]">•</span>
                  <span className="text-[#8C5A54]">{selectedScript.acts || "3 Acts"}</span>
                </div>
                <DialogTitle className="font-serif text-3xl sm:text-4xl text-[#2A1816] font-normal tracking-tight leading-tight">
                  {selectedScript.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#6E4742] font-serif">
                  Playwright: <strong className="text-[#2A1816] font-medium">{selectedScript.playwright}</strong>
                  {selectedScript.author_name && <span> | Contributed by: {selectedScript.author_name}</span>}
                </DialogDescription>
              </DialogHeader>

              {(() => {
                let parsed: any = {};
                try {
                  if (selectedScript.content && selectedScript.content.startsWith("{")) {
                    parsed = JSON.parse(selectedScript.content);
                  }
                } catch (e) {}

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 text-left">
                    {/* Left Column: Synopsis & Character Roster (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Synopsis Card */}
                      <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-5 rounded-2xl space-y-2 shadow-xs">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E]">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Story Synopsis & Premise</span>
                        </div>
                        <p className="text-xs text-[#5C3B37] font-serif leading-relaxed italic">
                          "{parsed.abstract || selectedScript.excerpt}"
                        </p>
                      </div>

                      {/* Characters Roster */}
                      <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-5 rounded-2xl space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E]">
                            <Users className="w-3.5 h-3.5" />
                            <span>Dramatis Personae ({parsed.characters?.length || 0})</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                          {parsed.characters && parsed.characters.length > 0 ? (
                            parsed.characters.map((c: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5EAE6] border border-[#DCBAB2]/70">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color || '#8C241E' }} />
                                  <span className="font-serif text-xs font-bold text-[#2A1816] truncate">{c.name}</span>
                                </div>
                                {c.traits && (
                                  <span className="text-[9px] font-mono uppercase text-[#8C5A54] bg-[#FAF2EE] px-2 py-0.5 rounded-full border border-[#DCBAB2] shrink-0">
                                    {Array.isArray(c.traits) ? c.traits[0] : typeof c.traits === "string" ? c.traits.split(",")[0] : ""}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs font-serif italic text-[#8C5A54]">Ensemble cast roles defined in playbook.</p>
                          )}
                        </div>
                      </div>

                      {/* Setting Details */}
                      {parsed.settingInfo && (
                        <div className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-xs font-serif text-[#6E4742] space-y-1">
                          <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] block">Stage Setting & Ambience</span>
                          <p className="leading-relaxed">{parsed.settingInfo}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Playbook Dialogue & Stage Directions (7 cols) */}
                    <div className="lg:col-span-7 space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E]">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Playbook Dialogue & Stage Directions</span>
                        </div>
                        <span className="text-[9px] font-mono text-[#8C5A54] uppercase">Theatrical Script Canvas</span>
                      </div>

                      <div className="p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl max-h-[460px] overflow-y-auto custom-scrollbar space-y-3.5 shadow-xs">
                        {parsed.lines && parsed.lines.length > 0 ? (
                          parsed.lines.map((l: any, idx: number) => {
                            if (l.characterName === "stage-note" || l.characterId === "stage-note" || l.text.startsWith("[ACT") || l.text.startsWith("[SCENE")) {
                              return (
                                <div key={idx} className="p-3 rounded-xl bg-[#F5EAE6] text-xs font-mono text-[#6E4742] italic border-l-3 border-[#8C241E] leading-relaxed">
                                  {l.text}
                                </div>
                              );
                            }
                            return (
                              <div key={idx} className="space-y-1 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color || '#8C241E' }} />
                                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: l.color || '#8C241E' }}>
                                    {l.characterName}:
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#2A1816] font-serif leading-relaxed pl-4 border-l border-[#DCBAB2]/50">
                                  "{l.text}"
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <div className="whitespace-pre-wrap font-serif text-xs text-[#2A1816] leading-relaxed">
                            {selectedScript.content || selectedScript.excerpt || "Full script playbook PDF download available."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <DialogFooter className="pt-5 border-t border-[#DCBAB2]/70 flex flex-wrap justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Close Playbook
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setViewOpen(false);
                      navigate(`/script-builder/${selectedScript.id}`);
                    }}
                    className="px-4 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#8C241E] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#8C241E]" />
                    <span>Open in Script Studio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedScript)}
                    className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border border-[#A6352F] shadow-lg shadow-[#8C241E]/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#FFD0CC]" />
                    <span>Download Playbook PDF</span>
                  </button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
