Secondary Users

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

# USER RESEARCH & PAIN POINT ANALYSIS

*(Based on interviews with Club President, Faculty Coordinator, Existing Members, New Members, and Regulatory Body representatives)*

## 1. Research Objective

To understand the challenges faced in managing memberships, organizing events, maintaining compliance, and improving communication within a university drama club.

---

## 2. Key Observational Insights

### Observation 1: Manual Membership Management

Membership applications are handled through Google Forms, emails, making tracking difficult.

### Observation 2: Scattered Communication

Announcements are shared across multiple platforms (WhatsApp, email, social media), causing members to miss important updates.

### Observation 3: Lack of Centralized Records

Club information such as attendance, membership status, event participation, approvals, and finances is stored in different locations without a unified system.

---

# 3. Stakeholder Pain Points

## 3.1 Regulatory Body

* Receives incomplete or inconsistent event proposals.
* Difficulty verifying whether club activities follow institutional policies.
* Financial reports are submitted manually.
* Approval requests are often delayed due to missing information.
* No centralized record of previously approved events.

**Core Issue:** Compliance monitoring is inefficient because approvals and documentation are handled manually.

---

## 3.2 New Member

* Doesn't know eligibility requirements.
* Membership process is unclear.
* No way to track application status.
* Frequently misses audition or interview announcements.
* Doesn't know whether their application has been accepted or rejected.

**Core Issue:** Lack of transparency and communication during the onboarding process.

---

# 4. Cross-Stakeholder Patterns

Recurring issues across multiple users include:

* Manual paperwork (digital)
* Delayed approvals
* Poor communication
* Lack of application tracking
* Missing documentation
* No centralized member database
* Difficulty maintaining compliance records

---

# 5. Root Causes Identified

* No centralized membership system
* Manual approval workflow
* Lack of automated notifications
* Google sheet/doc-based compliance records
* Poor visibility into application status
* Disconnected communication channels

---

# 6. Overall Conclusion

The drama club functions successfully but faces administrative challenges due to fragmented processes. A centralized digital platform would improve membership management, regulatory compliance, communication, and transparency while reducing administrative workload.

---
## Epic 1: Membership Discovery & Onboarding (New Members)

### Discovery & Application

* **Story 1.1:** As a New Member, I want to browse upcoming public events, available club roles, and eligibility criteria on a public dashboard, so that I can make an informed decision before applying.
* **Specific:** Defines exactly what information will be displayed (events, roles, criteria) on a specific interface (public dashboard).
* **Measurable:** Can be validated by checking if the dashboard successfully loads and displays these three exact data points.
* **Achievable:** Pulling public data from a database to a frontend view is a standard, low-complexity feature.
* **Relevant:** Directly supports the user's goal of making an informed application decision.
* **Time-bound:** Information updates and displays in real-time upon page load.


* **Story 1.2:** As a New Member, I want to submit a standardized online membership application, so that I can apply remotely without needing physical paperwork.
* **Specific:** Replaces physical paperwork with a digital, standardized form.
* **Measurable:** Validated by the successful creation of a new application record in the database.
* **Achievable:** Standard web form implementation with basic data validation.
* **Relevant:** Removes geographical and physical barriers to joining the club.
* **Time-bound:** Form submission is processed instantaneously upon clicking "Submit."


* **Story 1.3:** As a New Member, I want to securely upload media files (e.g., audition videos, portfolio links, or ID documents) during registration, so that my skills can be evaluated efficiently.
* **Specific:** Targets the upload of specific file types (videos, documents) and external links during the registration flow.
* **Measurable:** The system restricts invalid file types/sizes and successfully links accepted files to the user profile.
* **Achievable:** Can be built using standard cloud storage APIs (e.g., AWS S3) and file input validation.
* **Relevant:** Essential for clubs that require skill-based evaluations.
* **Time-bound:** Uploads occur and validate synchronously during the active registration session.


* **Story 1.4:** As a New Member, I want the ability to save my application as a "Draft", so that I can gather necessary documents and complete the submission later.
* **Specific:** Adds a definitive "Save Draft" action to preserve incomplete form state.
* **Measurable:** A user can log out, log back in, and retrieve the exact form data previously entered.
* **Achievable:** Requires a database flag for "draft" status or session storage implementation.
* **Relevant:** Reduces application abandonment rates when users need to pause and find documents.
* **Time-bound:** State is saved immediately upon action, with no loss of data.



### Tracking & Communication

* **Story 1.5:** As a New Member, I want a visual progress tracker on my profile (e.g., Submitted -> Under Review -> Audition -> Decision), so that I have real-time transparency regarding my application status.
* **Specific:** Defines a step-by-step visual UI component mapped to predefined application states.
* **Measurable:** The tracker UI updates precisely when the backend status string changes.
* **Achievable:** Standard frontend state mapping (similar to e-commerce order tracking).
* **Relevant:** Reduces member anxiety and decreases status-inquiry messages to club admins.
* **Time-bound:** The visual tracker reflects status changes immediately as admins process them.


* **Story 1.6:** As a New Member, I want to receive automated email or in-app notifications for interview/audition schedules, so that I can block my calendar and not miss the opportunity.
* **Specific:** Triggers automated alerts through defined channels (email/in-app) when a schedule is created.
* **Measurable:** Verifiable via email delivery logs and in-app read receipts.
* **Achievable:** Integration with standard notification services (e.g., SendGrid, Firebase).
* **Relevant:** Ensures applicants don't miss crucial evaluation steps.
* **Time-bound:** Notifications are dispatched instantly when the admin finalizes the schedule.


* **Story 1.7:** As a New Member, I want the system to allow me to confirm or request a reschedule for my audition slot, so that I can manage academic conflicts without losing my chance to join.
* **Specific:** Provides interactive options (Confirm/Reschedule) attached to a calendar slot.
* **Measurable:** System logs the applicant's response and updates the admin's scheduling dashboard accordingly.
* **Achievable:** Basic two-way interaction logic linked to the scheduling database.
* **Relevant:** Accommodates student life realities (classes, exams) while keeping the club organized.
* **Time-bound:** The user's response is reflected instantly in the club's scheduling queue.



### Decision & Integration

* **Story 1.8:** As a New Member, if my application is rejected, I want to view standardized feedback or reasons (e.g., "Did not meet criteria," "Audition full"), so that I can improve and reapply next semester.
* **Specific:** Delivers predefined rejection reason codes/strings to the user's dashboard.
* **Measurable:** The user interface successfully displays the specific reason selected by the reviewer.
* **Achievable:** Passing a string variable from the admin review panel to the user dashboard.
* **Relevant:** Provides closure and constructive guidance for future attempts.
* **Time-bound:** Feedback becomes visible the exact moment the "Rejected" status is published.


* **Story 1.9:** As a New Member, upon acceptance, I want automatic access to a digital "Onboarding Kit" (club rules, WhatsApp group links, meeting schedules), so that I can seamlessly integrate into the club.
* **Specific:** Automatically unlocks a specific set of digital assets (rules, links, schedules) upon acceptance.
* **Measurable:** Accepted users can access the kit page; pending/rejected users are blocked by a 403 error or hidden UI.
* **Achievable:** Role-Based Access Control (RBAC) updating the user's role from "Applicant" to "Member."
* **Relevant:** Ensures immediate, frictionless integration into club activities.
* **Time-bound:** Access permissions are updated simultaneously with the acceptance decision.



---

## Epic 2: Regulatory Compliance & Governance (Regulatory Body)

### Proposal Review & Approvals

* **Story 2.1:** As a Regulatory Body, I want event proposals to follow a mandatory, standardized digital template, so that I never receive incomplete requests missing key details (venue, budget, safety plan).
* **Specific:** Enforces mandatory fields (venue, budget, safety) on all event submissions.
* **Measurable:** The system actively blocks submission and throws an error if any required field is empty.
* **Achievable:** Standard frontend and backend form validation logic.
* **Relevant:** Eliminates back-and-forth communication over missing basic information.
* **Time-bound:** Validation checks execute instantly during the user's submission attempt.


* **Story 2.2:** As a Regulatory Body, I want the ability to request specific "Revisions" on a proposal rather than just approving/rejecting it, so that the club can easily correct minor errors without restarting the whole process.
* **Specific:** Adds a distinct "Revision Requested" workflow state with an attached comment field.
* **Measurable:** Proposal status updates correctly and the club leader receives the specific revision notes.
* **Achievable:** Adding a tertiary path to the standard binary (Approve/Reject) workflow state machine.
* **Relevant:** Saves significant administrative time for both parties on minor corrections.
* **Time-bound:** The proposal is immediately routed back to the club's active queue upon request.


* **Story 2.3:** As a Regulatory Body, I want to approve or reject event requests with a single click and leave official comments, so that the decision-making process is fully documented and transparent.
* **Specific:** Consolidates the decision action into a one-click UI with an accompanying text area for official remarks.
* **Measurable:** The database logs the action, the timestamp, the user ID of the approver, and the text comment.
* **Achievable:** Standard CRUD operation updating the record status and appending a log entry.
* **Relevant:** Creates a clear, auditable trail of who approved what and why.
* **Time-bound:** Audit logs are generated and stamped instantaneously upon the button click.


* **Story 2.4:** As a Regulatory Body, I want automated alerts (email/dashboard) when an event proposal is nearing its targeted date, so that I can prioritize time-sensitive approvals.
* **Specific:** Triggers alerts based on a date proximity threshold (e.g., 7 days before event date).
* **Measurable:** System successfully generates and dispatches the alert when the chronological condition is met.
* **Achievable:** Can be implemented via a daily scheduled cron job checking date differences.
* **Relevant:** Prevents clubs from having to cancel events due to bureaucratic bottlenecks.
* **Time-bound:** Executed automatically at predefined intervals (e.g., checked daily at midnight).



### Financial & Policy Auditing

* **Story 2.5:** As a Regulatory Body, I want view-only access to the club’s digital financial ledger and uploaded expense receipts, so that I can easily verify that allocated institutional funds are utilized appropriately.
* **Specific:** Grants specific permission level (Read-Only) to specific data structures (ledgers, receipts).
* **Measurable:** Regulatory users can view the data but the UI and backend reject any attempts to edit, delete, or create records.
* **Achievable:** Standard implementation of Role-Based Access Control (RBAC).
* **Relevant:** Ensures financial accountability without risking accidental data corruption by auditors.
* **Time-bound:** Auditors have real-time, 24/7 access to the financial data as it is updated.


* **Story 2.6:** As a Regulatory Body, I want to view a historical log of all past events, budgets, and compliance records, so that I can efficiently generate end-of-year audit reports.
* **Specific:** Consolidates historical data (events, budgets, compliance) into a single queryable interface.
* **Measurable:** User can filter past records by academic year, club, or status, and view the results.
* **Achievable:** Standard database querying and list rendering.
* **Relevant:** Crucial for annual institutional reviews and funding allocations.
* **Time-bound:** Reports and historical views are generated on-demand without delay.


* **Story 2.7:** As a Regulatory Body, I want to upload and pin institutional rulebooks and compliance checklists to the system dashboard, so that club leaders always have access to the most up-to-date guidelines before planning an event.
* **Specific:** Allows admins to upload documents and visually pin them to the top of the user dashboard.
* **Measurable:** Uploaded documents are visibly anchored on the club leader's dashboard and can be successfully downloaded.
* **Achievable:** File upload handling and a boolean "is_pinned" flag in the database.
* **Relevant:** Proactively prevents compliance violations by making rules highly visible.
* **Time-bound:** Documents appear globally to all club leaders immediately upon pinning.



### Disciplinary & Member Governance

* **Story 2.8:** As a Regulatory Body, I want a dedicated, confidential "Grievance Portal" where members can securely submit complaints regarding misconduct, so that I can intervene and enforce disciplinary actions promptly.
* **Specific:** Creates a sequestered form and viewing portal exclusively for misconduct reports.
* **Measurable:** Submissions bypass standard club leaders and are visible solely to Regulatory Body accounts.
* **Achievable:** Distinct database table with strict access control layers.
* **Relevant:** Ensures student safety and provides a fear-free channel for whistleblowing.
* **Time-bound:** Grievances are secured and flagged to regulatory bodies the moment they are submitted.


* **Story 2.9:** As a Regulatory Body, I want the system to flag active members who no longer meet institutional eligibility requirements (e.g., academic probation, graduation), so that I can ensure only valid students are participating.
* **Specific:** Visually marks user accounts that fail predefined institutional criteria.
* **Measurable:** The system accurately places a "flag" icon or restricts access for users whose status changes in the student database.
* **Achievable:** Requires an API integration or routine data sync with the institution's primary student information system (SIS).
* **Relevant:** Enforces institutional policy automatically, removing the burden of manual checking.
* **Time-bound:** Syncs and updates member status based on a defined automated schedule (e.g., nightly batch processing).
