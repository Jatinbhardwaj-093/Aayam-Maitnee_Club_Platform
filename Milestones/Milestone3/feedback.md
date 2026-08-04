# User Feedback and Planned Improvement

## 1. User Feedback

**Primary Users:** Users who directly interact with the Aayam Drama Society Management Platform software are considered primary users. The primary user roles present in our system are:

- Core Maintainer / Web Admin
- Production Coordinator & Director
- Ensemble Actor & Script Writer

---

### 1. Core Maintainer / Web Admin

#### Feedback Summary:
The Web Admin is highly satisfied with the society management software's architecture, database seeding, API stability, and automated test coverage. However, due to the high volume of incoming audition submissions during production casting calls, the Admin requested an **AI-Assisted Audition Screener & Portfolio Evaluator**:
- **Automated Batch Screening:** Handle high volumes of audition applications efficiently without manual spreadsheet overhead.
- **Portfolio & Skill Match Percentage:** AI analysis comparing applicant profiles, past drama experience, and interests directly against open character role requirements.
- **Audio & Video Quality Analysis:** AI checks for audio clarity, vocal projection quality, and submission completeness to quickly highlight top candidates for shortlist.

---

### 2. Production Coordinator & Director

#### Feedback Summary:
The Production Coordinator reviewed the system thoroughly and provided positive feedback, along with a key usability suggestion for the Script Vault and AI Rehearsal Studio modules. Currently, viewing annotated script cues during live stage rehearsals requires switching between script pages and stage position views.

To improve efficiency, the Coordinator suggested expanding the live rehearsal interface data to include:
- **Character Mudras & Dialogue Prompts:** Instant overlay of vocal modulation and spatial movement cues alongside script lines.
- **Production Cue Metrics:** Real-time tracking of total scene duration, completed acts vs. pending acts, and character line counts.
- **Stage & Logistics Status:** Live prop checklist status, DMX lighting cue triggers, and transport/arrival status for inter-collegiate festival representations (e.g., Kashiyatra at IIT BHU).

---

### 3. Ensemble Actor & Script Writer

#### Feedback Summary:
The Ensemble Actor & Script Writer appreciated the system's clean user interface, character line breakdowns, and intuitive script draft submission workflow. To enhance creative script building and solo practice, they requested two major AI-driven capabilities:
1. **AI Automated Rehearsal Partner:** An interactive AI voice/text partner that reads opposing character lines in real-time, allowing actors to rehearse dialogues seamlessly even when practice partners are unavailable.
2. **AI Novel-to-Script Auto Converter:** An AI-assisted converter where users can input raw novel paragraphs or famous story text. The AI automatically parses narrative prose into proper stage script format—identifying characters, separating lines, converting descriptive text into natural conversation style, and ensuring every actor has correctly formatted dialogues.
3. **Backstage Session Usability:** Simplified pin/token login and extended session timeouts to prevent re-authentication interruptions while reviewing lines on mobile devices backstage.

*(Note: We discussed these workflow suggestions with the Production Coordinator, who agreed they are necessary for stage efficiency. The Coordinator will escalate the session policy request to the Web Admin for approval, as the Admin handles system portal security).*
**Conclusion:** These feedback points and suggestions from our primary users will be implemented in the Milestone 4 deliverables, scheduled for completion in the next production sprint.

---

## 2. Planned Improvements for Next Sprint (Based on User Feedback)

Based on the feedback gathered from our Primary Users during Sprint 1 / Milestone 3, we have added the following feature improvements to our project backlog for implementation in the upcoming sprint (Milestone 4):
- **For the Core Maintainer / Web Admin:** Build an AI-Assisted Audition Evaluator that analyzes large applicant volumes, computes candidate portfolio match percentages, and assesses audio/video submission quality.
- **For the Production Coordinator & Director:** Enhance the AI Rehearsal Studio. Extend the live rehearsal HUD to display character line cues, scene progress bars, and synchronized lighting/sound cue triggers on a unified screen.
- **For the Ensemble Actor & Script Writer:** Develop the Interactive AI Voice Rehearsal Partner for solo practice, implement the AI Novel-to-Script Conversion Engine (parsing prose into structured dialogue scripts), and optimize mobile session timeouts for backstage use.
