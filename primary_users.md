# Primary Users Identification

Primary users are the people who use this app the most every single day. The platform is built specifically to help them complete their daily tasks, plan events, and run the club smoothly without extra hassle.

### 1. Club Members (Performers, Cast, Crew)
These are regular club members who need the app to check practice times and stay updated on event schedules.
*   **Typical Activities:** Checking their personalized event schedules, seeing if a practice room is free, signing up to help with specific event tasks, and updating their member profiles.

### 2. Core Members & Event Organizers (Secretary, President, Treasurers, Directors)
This is the leadership team that actually runs the club, organizes the performances, and manages everyday club business.
*   **Typical Activities:** Reviewing new member sign-ups, creating event plans for the college, tracking club money, managing master schedules, and updating public event pages.

### 3. Club Administrators & Maintainers (Systems Admin, Technical Leads)
This is the technical team that keeps the app running safely, manages user accounts, and handles data security.
*   **Typical Activities:** Checking who has access to admin tools, changing account controls when a new committee is elected, keeping the system stable, and cleaning up old files to save space.

---

# SMART User Stories

## Epic 1: Membership & Applications

### User Story 1.1: Reviewing New Member Sign-ups
*   **As a** Club Secretary,
*   **I want to** look at a list of new applications, check their profiles, and change their account status to "Active Member" with one click,
*   **So that** accepted applicants automatically get access to the app within 60 seconds without me having to make a new account for them manually.
*   > **SMART Validation:**
    *   **Specific:** Focuses cleanly on approving new members online.
    *   **Measurable:** The new member account updates system-wide within a **60-second window**.
    *   **Achievable:** Uses a basic database status change.
    *   **Relevant:** Saves the secretary from wasting time on manual data entry.
    *   **Time-bound:** Used during the busy recruitment weeks at the start of the semester.

---

## Epic 2: Room Bookings & Schedules

### User Story 2.1: Booking a Practice Room
*   **As a** regular club member,
*   **I want to** pick an open practice room on the app calendar and book a 1-hour slot up to 7 days ahead,
*   **So that** the app automatically blocks anyone else from booking the same room at the same time.
*   > **SMART Validation:**
    *   **Specific:** Focuses on booking a room using a shared digital calendar.
    *   **Measurable:** Limits bookings to exactly **1 hour** and up to **7 days ahead**.
    *   **Achievable:** The app checks for matching times before saving the booking.
    *   **Relevant:** Stops different performance groups from fighting over the same room.
    *   **Time-bound:** The calendar updates and locks the room right away after clicking submit.

### User Story 2.2: Personalized Schedule Feed
*   **As a** regular club member,
*   **I want to** see a simple timeline on my dashboard showing only the event times and practice shifts assigned to me,
*   **So that** I can see my schedule instantly without reading through long, messy group chats.
*   > **SMART Validation:**
    *   **Specific:** A personalized schedule list based only on the user's ID.
    *   **Measurable:** Shows clear dates, times, and room locations.
    *   **Achievable:** The system filters the master calendar automatically for the logged-in user.
    *   **Relevant:** Keeps members from missing their practice times because of chat spam.
    *   **Time-bound:** Updates within 3 minutes when an organizer changes the schedule.

---

## Epic 3: Event Planning & College Compliance

### User Story 3.1: Standardized Event Forms
*   **As an** event organizer,
*   **I want to** fill out a simple event form that requires the location, equipment needs, and budget before I submit it,
*   **So that** the app stops me from sending incomplete forms to the college office.
*   > **SMART Validation:**
    *   **Specific:** A form that checks for missing details before submitting.
    *   **Measurable:** Requires 100% of the main details to be filled out before submission works.
    *   **Achievable:** Uses standard form validation rules on the frontend.
    *   **Relevant:** Stops event plans from getting rejected by college officials due to missing info.
    *   **Time-bound:** Checks the fields instantly before letting the form go through.

---

## Epic 4: System Security & Annual Handover

### User Story 4.1: Changing Committee Account Roles
*   **As a** system maintainer,
*   **I want to** run a quick tool at the end of the college year to change graduating committee members back to regular user accounts,
*   **So that** old leaders lose their admin access within a strict 24-hour window.
*   > **SMART Validation:**
    *   **Specific:** A backend tool to change multiple account levels at the same time.
    *   **Measurable:** Removes all admin privileges safely within **24 hours**.
    *   **Achievable:** Handled via a basic database update command.
    *   **Relevant:** Protects private club data when the club leadership changes hands.
    *   **Time-bound:** Run once a year right after the club elections finish.