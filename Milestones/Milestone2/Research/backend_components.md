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
- Identify and extract all character roles from a provided script
- Generate dynamic character suggestions tailored to user prompts
- Evaluate the quality of uploaded audition footage
- Assess an actor's compatibility for a specific character based on their audition
