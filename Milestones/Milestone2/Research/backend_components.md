# Backend Components

## 1. Authentication & Access Management Component
- Handle user registration with email, password, and member ID validation
- Authenticate users using JWT access tokens with secure login and logout (Redis blacklisting fallback)
- Fetch and update user profiles, including personal details, interests, and profile pictures
- Differentiate privileges using a role-based access control (Admin, Member, etc.)

## 2. Label & User Grouping Component
- Create and manage dynamic labels/tags (e.g., skillset, interest group, VIP) and metadata
- Assign and remove labels from specific users for targeted filtering
- Fetch list of users based on their assigned custom labels (for dashboards)

## 3. Events, Plays & Auditions Component
- Fetch available plays, ongoing events, and open casting/crew positions
- Submit audition requests or participation registrations for specific open roles
- Create and update backend events and manage associated schedules

## 4. Stage & Venue Booking Component
- View real-time availability of the stage/venue across various time slots (morning, afternoon, evening)
- Submit primary or secondary stage booking requests with details
- Ensure isolated handling of stage requests internally for admins

## 5. Operations & Core Dashboard Component
- Generate personalized dashboard views for users based on their permissions and activity
- Aggregate active bookings, upcoming events, and user notifications in one place
- Support fetch and update of personal daily/weekly schedules (`get_my_schedule`)

## 6. Revenue & Metrics Tracking Component
- Maintain and update real-time revenue metrics like playbills sold and expected income
- Provide up-to-date business KPIs and insights for dashboard visualizations
- Distinguish corporate patrons from individual metrics for analytical reporting

## 7. Media & Gallery Component
- Aggregate event-specific media files (images, videos, etc.) uploaded by users or admins
- Facilitate media item creation, approval status updates, and soft/hard deletions
- Attach gallery content to events for historical documentation and discovery

## 8. Proposals Component
- Receive and track user-submitted proposals (e.g. for new plays or initiatives)
- Approve, reject, or update the status and notes of submitted proposals
- Centralize pending requests for admin review before final confirmation

## 9. Real-time Notifications & Outreach Component
- Send and aggregate role-specific user notifications and alerts
- Track notification read/unread states and allow batch marking them as read
- Support automated fetching and status updates of user notifications without reloading pages

## 10. AI Intelligence Component

### 10.1 Event Summarizer
- **Overview:** Parses raw unstructured text (e.g. event details, notes, announcements) to automatically extract key metadata and autofill the event request form.
- **Input:** Raw unstructured event text, notes, or plain text details.
- **Output:** Autofilled event request form fields (Title, Date, Time, Venue, Description, Category, Summary Highlights, Tags).
- **Target Users:** Event Organizers, Club Admins, Production Maintainers.
- **Key Benefits:** Eliminates manual data entry when creating events; speeds up event request submissions.

### 10.2 Key Point Filter (Event & Play Requests & Portfolio)
- **Overview:** Scans and extracts essential key points from event/play requests submitted by sponsors or organizers (allowing admins to quickly grasp what they want and how they want it) as well as member portfolios and requests.
- **Input:** Event/play request descriptions, sponsor proposal notes, member portfolio documents, raw request text.
- **Output:** Extracted key points summary, structured requirement highlights (what they want, deliverables, timeline/budget needs), matched skill and experience tags.
- **Target Users:** Club Admins, Production Managers, Review Committees, Sponsors, Casting Directors.
- **Key Benefits:** Accelerates request and proposal review; provides instant clarity on sponsor/event expectations and candidate qualifications without reading lengthy descriptions.

### 10.3 Cue Partner & Line Reader
- **Overview:** Interactive rehearsal assistant that fetches scripts directly from the platform's Script Vault, speaks prompt lines for co-characters, and acts as a virtual cue partner for actors practicing solo.
- **Input:** Selected script from site Script Vault, target character role, actor's spoken response (audio microphone input).
- **Output:** Synthesized audio line delivery (cue lines), active line highlight in script UI, line accuracy feedback.
- **Target Users:** Actors, Cast Members, Rehearsal Participants.
- **Key Benefits:** Allows solo rehearsals anywhere using platform scripts; improves line memorization and prompt timing.

### 10.4 Character Suggester for Plays (Discussion)
- **Overview:** Uses the complete play script as context to extract and generate key personality traits and characteristics for requested roles (e.g. hero's rival, mentor), while suggesting matching actors and facilitating director casting discussions.
- **Input:** Complete play script text context, requested character query/prompt (e.g. "Rival of the hero"), member directory profiles.
- **Output:** Generated character trait breakdown (personality traits, relationship dynamics, narrative role), ranked actor recommendations, collaborative casting discussion thread.
- **Target Users:** Play Directors, Casting Committee, Production Admins.
- **Key Benefits:** Automated script analysis for character profiling; data-driven casting decisions and centralized director feedback.

### 10.5 Audition Sanity Checker
- **Overview:** Automated verification system that performs two core checks for audition submissions: (1) portfolio matching and scoring against applied role requirements, and (2) technical quality auditing of the provided audition video/audio.
- **Input:** Uploaded audition video/audio file, applicant member portfolio, target role criteria.
- **Output:** Dual audit report:
  1. **Portfolio Match Score:** Role compatibility score based on portfolio skills, past experience, and character criteria.
  2. **Audio/Video Quality Check:** Technical audit report (resolution, audio clarity/volume, lighting score, format/duration pass-fail status).
- **Target Users:** Auditioning Members, Performers, Casting Directors, Admins.
- **Key Benefits:** Guarantees applicant compatibility for applied roles; prevents poor-quality audio/video submissions.
