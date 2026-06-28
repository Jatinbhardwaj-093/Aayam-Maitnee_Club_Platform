# Software Engineering Project Jan-2026
## Milestone 1 Deliverables for IIT BS Drama Society Platform

### Submitted By
* **Team Name:** ServiceSync
* **Team Code:** Team-070
* **Institution:** IITM Online BS Degree Program, Indian Institute of Technology Madras, Chennai, Tamil Nadu, India, 600036

## Project Details

* **Software Name:** Aayam (Cultural Club Operations Platform)
* **Department Context:** IIT BS Cultural & Drama Club Department
* **System Type:** Community Engagement, Resource Allocation & Club Management Platform
* **Date of Submission:** 28-06-2026

## Team Details

| Name | Roll Number | Role |
| :--- | :--- | :--- |
| **Jatin Bhardwaj** | 23f2004867 | Scrum Master / Frontend Dev |
| **Amit Kumar Patra** | 21f1000426 | Frontend Dev / Backend Dev |
| **Shibin Mohammed N P** | 23f2005132 | Product Manager / Code Reviewer |
| **Devi Vrinda A** | 21f1001205 | Product Manager / Code Reviewer |
| **Bhabani Kundu** | 21f3000243 | Backend Dev / Tester |

---

# IDENTIFICATION OF USERS

### 1. Primary Users
These are the core operational users who interact with the system daily. The platform’s workflows, dashboards, and real-time scheduling features are primarily designed around their day-to-day responsibilities in running rehearsals, planning productions, and managing member workflows.

* **Club Members (Performers, Cast, Crew)**  
  Regular members of the drama club who rely on the platform to stay updated on rehearsal timings, book practice spaces, and coordinate event duties.  
  *Responsibilities include:*
  * Checking personalized event schedules and practice shifts.
  * Reserving practice rooms and checking space availability.
  * Signing up for production tasks (costumes, stage management, ticketing).
  * Updating member artistic profiles and skill portfolios.  
  *System Goal:* Reduce communication chaos and ensure members never miss practice slots.

* **Core Members & Event Organizers (Secretary - Siddharth Sahu, President, Treasurers, Directors)**  
  The operational leadership team responsible for organizing productions, managing logistics, and directing club initiatives.  
  *Responsibilities include:*
  * Reviewing and approving new member sign-ups.
  * Sourcing talent and assigning production roles (acting, directing, scriptwriting).
  * Creating event proposals and tracking budget expenditures.
  * Managing master rehearsal schedules and assigning volunteer tasks.  
  *System Goal:* Streamline administrative overhead and eliminate single-node dependency on leadership.

* **Club Administrators & Maintainers (Systems Admin, Technical Leads)**  
  Technical team responsible for keeping the platform safe, managing access controls, and handling annual committee handovers.  
  *Responsibilities include:*
  * Managing user accounts and Role-Based Access Controls (RBAC).
  * Updating system permissions following annual committee elections.
  * Maintaining data security and clearing redundant assets.  
  *System Goal:* Ensure secure, automated user governance and reliable system uptime.

### 2. Secondary Users
These users interact with the system for governance, compliance, auditing, and member onboarding. While not involved in daily artistic rehearsals, they are essential participants for administrative and institutional stability.

* **Regulatory Body (College Student Affairs Office / Faculty Coordinator / Institute Authorities)**  
  Institutional body responsible for ensuring that club operations align with college policies, ethical standards, and safety guidelines.  
  *Responsibilities include:*
  * Reviewing and approving official event proposals.
  * Auditing financial logs and budget utilization reports.
  * Ensuring compliance with institute facilities and safety rules.
  * Managing disciplinary oversight and student eligibility verification.  
  *System Goal:* Provide transparent, auditable reporting dashboards and automated compliance review workflows.

* **New Members / Prospective Students**  
  Students interested in joining the drama society who require a structured entry point.  
  *Responsibilities include:*
  * Browsing club portfolios, interest tracks, and upcoming auditions.
  * Submitting digital membership applications and portfolio samples.
  * Tracking application status and scheduling audition slots.  
  *System Goal:* Eliminate manual registration friction and offer real-time status visibility.

### 3. Tertiary Users
External collaborators, sponsors, advertisers, and partner institutions who interact with the club for mutual growth, promotional outreach, and educational events.

* **Advertisers & Sponsors**  
  Organizations or businesses seeking to fund productions or promote their products through club events.  
  *Responsibilities include:*
  * Browsing sponsorship packages and submitting proposals.
  * Uploading promotional assets, branding banners, and prop guidelines.
  * Tracking proposal approval status and viewing event metrics.  
  *System Goal:* Provide a secure sponsorship portal showcasing verified deliverables and past work analytics.

* **Other Student Clubs & External Organizations**  
  Peer clubs, NGOs, or cultural groups seeking joint performances or collaborative awareness campaigns.  
  *Responsibilities include:*
  * Browsing performance portfolios and submitting joint collaboration requests.
  * Sharing logistical requirements and managing shared schedules.  
  *System Goal:* Offer formal partnership request channels and integrated messaging.

* **Educational Institutions (Schools / Colleges)**  
  External institutions inviting the drama club to conduct theater workshops or guest performances.  
  *Responsibilities include:*
  * Submitting workshop or performance hosting requests.
  * Specifying venue details, audience size, and preferred dates.  
  *System Goal:* Streamline institutional bookings and automated schedule confirmations.

### Users Interviewed During Research
We conducted field research and structured interviews with key representatives across roles:
* **Siddharth Sahu** – Club Secretary (Core Leadership)
* **Performers & Crew Members** – IIT BS Drama Society Active Members
* **Prospective Applicants** – IIT BS Student Community
* **Faculty Representative** – Regulatory Oversight
* **Sponsor / Brand Partner** – External Collaborator

---

# USER RESEARCH & PAIN POINT ANALYSIS
*(Based on interviews and field research with Club Secretary Siddharth Sahu and IIT BS Drama Society members and partners)*

### 1. Research Objective
To identify operational bottlenecks, resource limitations, member onboarding friction, room/equipment scheduling conflicts, and communication gaps within the IIT BS Drama Society through qualitative interviews and workflow evaluation.

### 2. Key Observational Insights

* **Observation 1: Lack of Centralized Student Database and Work Records**  
  There is currently no digital repository to register members, track artistic skills (acting, directing, scriptwriting), or log participation history across productions.
* **Observation 2: Manual Scheduling and Equipment/Space Booking Conflicts**  
  Rehearsal space reservations and stage equipment allocation (microphones, costumes, props) occur informally via chaotic WhatsApp chats, causing frequent double-bookings and scheduling clashes.
* **Observation 3: Severe Financial and Resource Constraints**  
  Budgeting and financial reimbursements rely entirely on manual paper receipt submission, leading to processing delays and poor expense visibility.
* **Observation 4: Friction in Information Flow & Event Discovery**  
  Members lack a central hub to discover local cultural events or share opportunities. All announcements must funnel through core leaders (*Discovering Member -> Core Leader -> Club*), creating communication bottlenecks.
* **Observation 5: Difficulty for Sponsors to Evaluate Deliverables**  
  Sponsors lack a centralized showcase to view past play recordings, media portfolios, or member work, making sponsorship negotiations slow and unverified.
* **Observation 6: Lack of Direct Visibility for College Administration**  
  Institute authorities have no direct portal to check facility usage or verify compliance, requiring manual back-and-forth inquiries with club leaders.

### 3. User & Role-Based Pain Points

#### 3.1. Club Secretary (Siddharth Sahu)
* Heavy administrative burden handling manual sign-up spreadsheets and member queries.
* Difficulty sourcing talent for specific play roles without broadcasting generic messages.
* Frequent scheduling clashes for rehearsal rooms and stage gear.
* Slow reimbursement cycles due to manual paper auditing.  
*Core Issue:* High administrative overload and lack of central management tools.

#### 3.2. General Club Members & Performers
* Critical rehearsal updates get buried under heavy WhatsApp message chatter.
* Inability to self-book practice spaces or view real-time gear availability.
* Lack of a verified digital portfolio to showcase past performance roles and awards.  
*Core Issue:* Fragmented communication and missing digital recognition system.

#### 3.3. New & Prospective Members
* Ambiguous onboarding procedures with zero tracking on application progress.
* Difficulty finding and connecting with specific interest sub-groups (e.g., street plays, scriptwriting).  
*Core Issue:* Lack of transparency in recruitment and missing guided onboarding.

#### 3.4. College Administration & Authorities
* High effort required to trace past event logs, expense records, or safety compliance.
* Lack of real-time monitoring for institute facility usage.  
*Core Issue:* Absence of integrated compliance governance and automated auditing.

#### 3.5. Sponsors & External Collaborators
* Inability to verify audience reach, past production quality, or member skill profiles before funding.
* Delays in coordinating promotional material and sponsorship assets.  
*Core Issue:* Lack of a transparent portfolio showcase and structured proposal portal.

### 4. Cross-Role Patterns & Root Causes
* **Absence of a Centralized Platform:** Information is fragmented across personal drives, chat threads, and physical paper records.
* **Informal Resource Allocation:** Absence of an automated calendar leads to venue overlaps and lost equipment.
* **Manual Paper Workflows:** Expense tracking and application forms rely on physical verification.
* **Single-Node Communication Dependency:** All cross-role information flow hinges on core leadership intervention.

### 5. Overall Conclusion
The IIT BS Drama Society possesses high creative potential, but operational efficiency is severely constrained by manual management. Transitioning from ad-hoc tools (WhatsApp and spreadsheets) to a centralized **Web-Based Club Management Portal** will automate member onboarding, digitize room/gear reservations, streamline reimbursements, and present a professional portfolio to external sponsors.

---

# USER STORIES

## Epic 1: Membership Onboarding & Directory Management

### Story 1.1: Reviewing New Member Sign-ups
* **As a** Club Secretary,
* **I want to** review incoming student applications online and approve them into active member status with one click,
* **So that** approved applicants automatically gain system access within 60 seconds without manual account creation.

### Story 1.2: Discovery & Comprehensive Application
* **As a** New Member,
* **I want to** browse interest tracks, upload media portfolio samples, save application drafts, and submit forms online,
* **So that** I can complete my club application remotely at my own pace.

### Story 1.3: Real-Time Application Tracking & Audition Scheduling
* **As a** New Member,
* **I want to** track my application status on a visual dashboard and pick available audition time slots,
* **So that** I am always informed and can prevent scheduling clashes with my academic timetable.

## Epic 2: Space Booking & Asset Management

### Story 2.1: Booking a Practice Room
* **As a** regular Club Member,
* **I want to** select an open rehearsal space on the digital calendar and reserve a 1-hour slot up to 7 days in advance,
* **So that** the system automatically prevents double-booking and guarantees room availability.

### Story 2.2: Equipment Issue & Accountability Tracking
* **As a** Club Administrator,
* **I want to** digitally log stage equipment (microphones, amplifiers, costumes) issued to and returned by members for each show,
* **So that** item loss is minimized and member accountability is clear.

## Epic 3: Event Planning & Schedule Management

### Story 3.1: Personalized Schedule Feed
* **As a** regular Club Member,
* **I want to** view a timeline on my personal dashboard showing only the rehearsals, call times, and duties assigned to me,
* **So that** I can track my commitments without digging through long chat groups.

### Story 3.2: Standardized Event Proposals & Compliance Review
* **As an** Event Organizer,
* **I want to** submit event proposal forms with mandatory fields for venue, budget, and safety plans,
* **So that** incomplete applications are blocked before reaching institutional authorities.

## Epic 4: Financial Governance & Reimbursement Management

### Story 4.1: Financial Auditing & View-Only Ledgers
* **As a** Regulatory Representative,
* **I want to** access digitized financial ledgers and receipt uploads for all past productions in view-only mode,
* **So that** I can audit club expenditures and verify financial compliance efficiently.

### Story 4.2: Digital Reimbursement Request Tracking
* **As a** Club Member,
* **I want to** upload digital receipt images and track my expense reimbursement status online,
* **So that** I am notified when my payment is processed without submitting physical paper bills.

## Epic 5: Governance, Compliance & System Administration

### Story 5.1: Annual Committee Account Role Handover
* **As a** System Maintainer,
* **I want to** run a batch administrative utility at the end of the academic year to revert graduating leaders to general member status,
* **So that** administrative privileges are revoked within a 24-hour window post-elections.

### Story 5.2: Confidential Misconduct Reporting Portal
* **As a** Regulatory Representative,
* **I want to** provide a secure, sequestered portal where students can submit confidential safety or behavioral grievances,
* **So that** reports bypass club leadership and route directly to institute authorities for review.

## Epic 6: Sponsorship & Advertiser Portal

### Story 6.1: Digital Sponsorship Proposal Submission
* **As an** Advertiser / Sponsor,
* **I want to** review available sponsorship packages and submit partnership proposals online,
* **So that** I can collaborate with the club without relying on manual back-and-forth communication.

### Story 6.2: Promotional Material & Media Asset Upload
* **As an** Advertiser / Sponsor,
* **I want to** upload high-resolution digital logos, banners, and prop integration guidelines into the platform,
* **So that** club organizers can review and utilize verified brand assets for event promotions.

## Epic 7: Collaboration & Workshop Booking

### Story 7.1: External Collaboration Requests
* **As an** External Club / Partner Organization,
* **I want to** submit joint performance proposals online and receive a unique tracking ID,
* **So that** our partnership requests are formally documented and tracked.

### Story 7.2: Institutional Workshop Request & Scheduling
* **As an** Educational Institution,
* **I want to** request drama workshops by specifying preferred dates, target audience size, and venue details,
* **So that** club coordinators can evaluate availability and confirm bookings accurately.

---

# Proof of Interactions

**Link of Interviews and Proofs of Interaction:** [Link](https://drive.google.com/drive/folders/1eKhNcdhy2W9NiOzbzAG2pyAcLiTFZkx6?usp=share_link)
