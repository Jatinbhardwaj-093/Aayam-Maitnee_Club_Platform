# Secondary Users

These users interact with the system for governance, membership, and compliance purposes. They are important stakeholders but are not involved in the club's day-to-day event organization or management.

### Regulatory Body (e.g., College Student Affairs Office / UHC / Faculty Coordinator)

Responsible for ensuring that the drama club follows institutional rules and policies.

**Responsibilities include:**

* Reviewing and approving club annual reports.
* Verifying that club activities comply with college regulations.
* Monitoring financial transparency and fund utilization.
* Ensuring safety, disciplinary, and ethical guidelines are followed.

**The system must provide** approval workflows, access to club reports, financial summaries, and event documentation to simplify compliance monitoring.

---

### New Member (Prospective Student)

A student interested in joining the drama club but who is not yet an active member.

**Responsibilities include:**

* Browsing club information and upcoming events.
* Submitting membership applications.
* Uploading required documents or audition details.
* Tracking application status.
* Receiving notifications regarding interviews, auditions, or acceptance.

**The system must provide** an easy registration process, transparent application tracking, and timely communication to improve the onboarding experience.

---

## Epic 1: Membership Discovery & Onboarding (New Members)

**Story 1: Discovery & Comprehensive Application**
As a New Member, I want a unified digital application hub where I can browse club requirements, upload media portfolios, save my progress as a draft, and submit a standardized form, so that I can complete the entire application process remotely at my own pace.

  * **Specific:** Combines discovery (browsing roles), media uploads, draft saving, and final submission into a single user workflow.
  * **Measurable:** Validated when a user successfully views club details, uploads a file, saves a draft, and the database receives the final, complete submission.
  * **Achievable:** Standard multi-step web form implementation utilizing cloud storage for media and database sessions for draft saving.
  * **Relevant:** Removes all physical barriers to entry and accommodates users who need time to gather materials.
  * **Time-bound:** Drafts are saved instantly, and final submission is processed synchronously upon clicking "Submit."

**Story 2: Real-Time Tracking & Interview Scheduling**
As a New Member, I want a dynamic progress dashboard that visually tracks my application status, sends automated notifications, and allows me to manage/reschedule my audition slots, so that I am always informed and can balance club requirements with my academic schedule.

  * **Specific:** Consolidates visual state tracking, automated email/in-app alerts, and two-way calendar management.
  * **Measurable:** Validated when UI visually updates on status change, a notification is successfully dispatched, and calendar slot changes log accurately in the database.
  * **Achievable:** Integration of standard frontend state mapping, a notification API (like SendGrid), and basic calendar CRUD operations.
  * **Relevant:** Drastically reduces administrative overhead and applicant anxiety by automating status updates and scheduling conflicts.
  * **Time-bound:** Status changes reflect instantly on the dashboard, and notifications trigger immediately upon a schedule update.

**Story 3: Decision Resolution & Seamless Integration**
As a New Member, I want to receive a clear final decision that either provides standardized feedback for rejection or unlocks a digital "Onboarding Kit" (rules, links, schedules) upon acceptance, so that I have immediate closure or a seamless transition into the club.

  * **Specific:** Defines the two ultimate outcomes of the journey: displaying rejection reason codes or granting role-based access to onboarding materials.
  * **Measurable:** Accepted users successfully view the onboarding assets, while rejected users are blocked from those assets and see their specific feedback text instead.
  * **Achievable:** Implementation of Role-Based Access Control (RBAC) tied to the application's final status flag.
  * **Relevant:** Ensures rejected students know how to improve, while accepted students can immediately participate in club activities.
  * **Time-bound:** Access permissions and feedback visibility update the exact moment the regulatory admin finalizes the decision.

---

## Epic 2: Regulatory Compliance & Governance (Regulatory Body)

**Story 4: Standardized Proposal Workflow & Approvals**
As a Regulatory Body, I want an automated event review system that enforces standardized templates, alerts me to upcoming deadlines, and allows me to approve, reject, or request specific revisions with one click, so that I can efficiently manage proposals without missing crucial details.

  * **Specific:** Merges mandatory form templates, deadline-based alerts, and a multi-path decision matrix (Approve/Reject/Revise) with commenting.
  * **Measurable:** System blocks incomplete submissions, fires proximity alerts, and successfully logs the admin's decision and comments to the proposal record.
  * **Achievable:** Standard form validation, chron-job scheduling for alerts, and updating a record's state machine via a UI dashboard.
  * **Relevant:** Eliminates back-and-forth emails over missing details and creates a clear, auditable trail of decisions.
  * **Time-bound:** Deadlines trigger scheduled alerts daily, and decisions/revisions route back to the club instantly upon clicking the action button.

**Story 5: Financial Auditing & Policy Distribution**
As a Regulatory Body, I want an auditing dashboard that provides view-only access to club financial ledgers, historical event logs, and the ability to pin institutional rulebooks, so that I can easily verify expenditures and proactively enforce current compliance guidelines.

  * **Specific:** Consolidates historical data querying, read-only financial tracking, and global document pinning into one compliance hub.
  * **Measurable:** Admin can successfully filter historical records, read (but not edit) expense receipts, and pin a PDF that becomes globally visible to all club leaders.
  * **Achievable:** Simple RBAC applied to financial tables, standard database query filters, and document upload capabilities.
  * **Relevant:** Crucial for annual institutional reviews, preventing fraud, and ensuring clubs have no excuse for policy violations.
  * **Time-bound:** Read-only data reflects club inputs in real-time, and pinned documents appear globally immediately upon upload.

**Story 6: Disciplinary Governance & Member Eligibility**
As a Regulatory Body, I want a secure governance module that automatically flags members failing institutional eligibility and provides a confidential portal for misconduct grievances, so that I can ensure student safety and enforce strict participation rules.

  * **Specific:** Integrates automated user-eligibility flagging (e.g., academic probation) with a sequestered, confidential reporting tool for grievances.
  * **Measurable:** The system successfully places restriction flags on targeted user accounts and routes confidential submissions directly to regulatory admins, bypassing club-level leaders.
  * **Achievable:** Requires data syncing with the main Student Information System (SIS) and a distinct, permission-locked database table for grievances.
  * **Relevant:** Protects the institution from liability by automating eligibility enforcement and providing a safe whistleblowing channel.
  * **Time-bound:** Grievances lock and route instantly upon submission; eligibility flags sync based on a predefined schedule (e.g., nightly batch runs).
