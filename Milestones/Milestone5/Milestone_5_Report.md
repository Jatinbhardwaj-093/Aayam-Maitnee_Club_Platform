# Software Engineering Project May-2026

# Milestone 5 Final Report

## Submitted By

* **Team Name:** ServiceSync
* **Team Code:** Team-070
* **Institution:** IITM Online BS Degree Program, Chennai, Tamil Nadu, 600036

## Project Details

* **Software Name:** Aayam (Cultural Club Operations Platform)
* **Department Context:** IIT BS Cultural \& Drama Club Department
* **System Type:** Community Engagement, Resource Allocation \& Club Management Platform
* **Date of Submission:** 23-08-2026

\---

## 1\. Executive Summary

Aayam is a comprehensive cultural club operations and administration system designed specifically to orchestrate theatrical and event-based workflows. Developed by ServiceSync (Team-070) for the Jan-2026 Software Engineering Project, this platform digitizes end-to-end club management, bridging the gap between fragmented, manual communication methods and a centralized digital ecosystem.

The system integrates Role-Based Access Control (RBAC) across core user groups: Club Members, Event Organizers, Maintainers, Regulatory Authorities, and Sponsors. By leveraging standard modern web technologies (React, Vite, Flask, SQLite) and powerful generative AI frameworks (Gemini for event keyword extraction, Groq Whisper for audition transcription, and Mediapipe for visual evaluation), Aayam significantly optimizes rehearsal scheduling, audition screening, dynamic script generation, and event financial auditing.

This report outlines the complete development lifecycle, covering system design, agile execution, architectural decisions, rigorous testing strategies tracking 152 API operations, and the seamless realization of the advanced user stories identified during the initial research phase.

## 2\. Project Background \& Motivation

The conceptualization for Aayam was driven by extensive user research and interviews conducted with primary stakeholders across the IIT BS Drama Society (including Club Secretaries, Core Performers, and Faculty Representatives). The research exposed a critical reliance on ad-hoc tools that crippled operational efficiency:

* **Lack of Centralized Member Repositories:** No digital infrastructure existed to track member artistic portfolios, production history, or core theatrical skill sets (acting, directing, scriptwriting).
* **Communication Fragmentation \& Bottlenecks:** Rehearsal schedules and critical announcements were constantly buried under chaotic WhatsApp group chatter, strictly funneling through core leadership and stalling lateral communication.
* **Resource \& Space Allocation Conflicts:** Rehearsal room reservations and critical stage equipment issuance (microphones, costumes) were handled informally, leading directly to frequent double-bookings and lost assets.
* **Severe Financial Tracking Constraints:** Budget reimbursements and expenditure logs relied completely on manual paper receipts, causing heavy administrative delays and zero real-time visibility.
* **Ambiguous Sponsorship Negotiations:** External brand sponsors lacked a transparent, verified gallery to browse past production quality, making sponsorship vetting slow and unverified.
* **Administrative Blind Spots:** College regulatory authorities lacked a direct, auditable portal to monitor institute facility usage or handle confidential behavioral grievances seamlessly.

## 3\. Requirement Analysis and User Stories

Extensive research was conducted to categorize the exact end-users interacting with the cultural club ecosystem, isolating them by operational hierarchy:

**Identified User Types:**

* **Primary Users (Daily Operations):**

  * *Club Members (Performers, Cast, Crew):* Handle daily practice schedules, room bookings, and duty sign-ups.
  * *Event Organizers (Directors, Treasurers):* Source talent, organize events, manage production budgets, and approve members.
  * *Maintainers \& Administrators (Systems Admin):* Handle RBAC user governance, permissions turnover, and unified oversight.
* **Secondary Users (Institutional Stability):**

  * *Regulatory Bodies (College Authorities):* Audit financial logs, enforce institute safety compliance, and review confidential grievances.
  * *Prospective Members:* Browse portfolio applications and schedule initial onboarding additions.
* **Tertiary Users (External Collaboration):**

  * *Sponsors \& Advertisers:* Browse verified media galleries to fund proposals.
  * *External Clubs \& Institutions:* Pitch inter-college theater collaborations.

**Structured Agile Epics:**
Synthesizing our initial user research and stakeholder feedback, these pain points and user roles translated precisely into 11 distinct development Epics dictating the platform architecture:

1. Membership Onboarding \& Directory Management
2. Space Booking \& Stage Asset Tracking
3. Event Planning \& Schedule Flow
4. Financial Governance \& Reimbursement Tracking
5. Compliance Oversight \& System Administration
6. Sponsor \& Advertiser Engagement Portals
7. External Collaborative Management
8. AI-Powered Audition Screening \& Evaluation
9. AI Interactive Roleplay Studio (Real-time partner)
10. GenAI Script Builder (Novel-to-Script automation)
11. AI-Powered Maintainer Event Operation Parsing

These epics established the functional ground truth for all testing, design logic, and API validation executed throughout the pipeline.

## 4\. System Design and Architecture

The system follows a normalized, scalable backend architecture ensuring tight decoupling.

* **Class Diagram Structure:** 10 major foundational modules covering Authentication, Membership, Administration, Event Management, Production Planning, Auditions, Scheduling, Media, Community Engagement, and Notifications.
* **Database Design (ER):** Enforces entity relationships across Users, Roles, Events, Plays, Auditions, Bookings, Participants, and Volunteers, paving the way for multi-layered scheduling.

## 5\. Project Schedule, Sprints and Agile Execution

Development followed an iterative Agile lifecycle directly mapped to institutional expectations:

* **Milestone 1 (23/06/2026 - 01/07/2026):** Execution of primary End-User Research via Faculty and Club interviews, distillation of Pain Point Analysis, and formalization of the 11 founding Epics.
* **Milestone 2 (02/07/2026 - 22/07/2026):** Complete System Architecture formulation, designing the overarching Class Diagrams, crafting Database Entity-Relationship (ER) schemas, and rigorous UX/UI layout wireframing.
* **Milestone 3 (23/07/2026 - 03/08/2026):** Implementation of backend Core Logic (`api.py`), SQLite database initialization, and deployment of foundational Frontend Dashboards (Member and Maintainer operational panels).
* **Milestone 4 (04/08/2026 - 12/08/2026):** Expansion into advanced Generative AI Integration (Groq Whisper, Mediapipe Pose, Gemini Vision), Automated Screening pipelines, and executing a comprehensive 152-operation `pytest` validation suite.
* **Milestone 5 (13/08/2026 - 18/08/2026):** Final interface polish, performance logic optimization (SSE streaming \& local state caching), AI Interactive UX refinement, and full Production Deployment readiness.

## 6\. Technologies and Tools Used

* **Frontend Web Suite:** React, Vite, Tailwind CSS, PlateEditor (Script Parsing).
* **Backend \& Core Logic:** Python, Flask, SQLite, Redis.
* **Database Orchestration:** SQLAlchemy ORM.
* **AI \& Multimedia Stack:** Google Gemini API, Groq Whisper API, OpenCV, Mediapipe, LiteLLM, MoviePy, Edge-TTS.
* **Testing \& Tooling:** Pytest, coverage, Git/GitHub, Postman.

## 7\. Implementation Details

The final prototype includes fully functional modules for all core roles with specific workflows implemented:

* **Club Members (Performers, Actors \& Volunteers):** Live dashboard timeline, room \& stage reservations, volunteer shift tracking, AI Interactive Roleplay Studio (live GenAI Voice Partner and real-time script feedback), and digital reimbursement receipt uploads.
* **Event Organizers (Directors \& Scriptwriters):** GenAI Script Builder (auto-extracting characters via PlateEditor \& Server-Sent Events), cast requirement tracking, and event proposal submissions.
* **Club Maintainers \& Administrators:** Comprehensive dashboard handling role management, AI-Powered Event Proposal parsing (Gemini keyword extraction), Audition Screening Evaluator (Mediapipe pose/blur evaluation \& Groq Whisper reporting), and equipment issue/return logs.
* **Regulatory Authorities (College):** Sequestered view-only mode for financial/expense logging and confidential grievance tracking to ensure institutional compliance.
* **Sponsors \& Advertisers:** Digital sponsorship proposal submission portals and dynamic ad request processing directly reviewed by the Maintainer.

The system demonstrates a strong focus on automating creative operations and minimizing administrative friction through deeply integrated AI assistance.

## 8\. Testing, Quality Assurance and User Feedback

* **Automated Validation:** A 152-operation validation tracking suite implemented via `pytest` confirmed maximum test coverage across both standard APIs and AI endpoints.
* **Feedback Integration:** Based on interim reviews, Maintainers received specialized Audition Evaluators, and Directors received real-time production progression metrics in the live UI.

## 9\. Issue Tracking, Code Review and Project Management

* Strict version control natively facilitated via GitHub.
* Extensive mismatch debugging handled 9 specifically mapped validation failures (e.g., event 503 timeouts, get\_schedule 404 routing omissions), which were isolated and patched to restore standard stability.
* Structured Scrum methodology maintained across remote weekly synchronization.

## 10\. Instructions to Run the Application

**Backend:**

1. `cd backend`
2. `python -m venv venv` and activate.
3. `pip install -r requirements.txt` *(Ensure moviepy, groq, mediapipe, google-genai are present).*
4. Setup `.env` securely with `GEMINI\_API\_KEY` and `GROQ\_API\_KEY`.
5. Run `flask run`

**Frontend:**

1. `cd frontend`
2. `npm install`
3. `npm run dev`

The full API catalog is accessible at the initialized localhost port.

## 11\. Challenges Faced and Lessons Learned

* **Complexity in AI Synchronicity:** Balancing the Server-Sent Events (SSE) stream for interactive script analysis against stateless backend paradigms proved challenging but significantly rewarding.
* **Multimedia Processing overhead:** Tuning OpenCV and Mediapipe to evaluate actor pose tracking efficiently without crashing standard memory quotas required robust caching strategies and threaded isolation.
* **Lesson Learned:** Heavy upfront system architecture modeling during Milestone 2 heavily reduced integration friction in Milestone 4.

## 12\. Conclusion and Future Enhancements

Aayam officially succeeds in bridging the technical gap within cultural and dramatical institutional operations. The robust integration of role-based administration heavily mitigates manual WhatsApp orchestration, paving the way for digital excellence.

**Future Enhancements:**

* **AR/VR Stage Design Integration:** Simulating active production elements overlaying digital rehearsal halls.
* **Algorithmic Cast Matching:** Auto-connecting prospective students with director visions natively via historical performance analysis.
* **Blockchain Ticket Portals:** Cryptographically verifying audience ticketing access during showcase nights.

\---

*Final Declaration: All deliverables, technical prototypes, testing suites, and analytical reports have been rigorously consolidated by Team-070 ServiceSync.*

