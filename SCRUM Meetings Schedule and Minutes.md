SCRUM Meetings Schedule and Minutes
Scrum Meetings: Conducted on scheduled dates via Google Meet (9PM - 10PM)

Minutes from June 23, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Conducted initial team setup, reviewed interview questions for drama society management, and interviewed Siddharth Sahu (Secretary of the IIT Drama Club). Analyzed operational challenges including script ideation, lack of costume/venue budget, manual scheduling, and reliance on WhatsApp/Google Drive.
•	Key Decisions: Decided to conduct and record primary user research, edit the recording (trimming pauses and applying a 1.25x speed multiplier), and focus software goals on solving real operational pain points for community drama clubs.
•	Assigned Tasks / Action Items:
o	Shibin Mohammed: Handle video recording of the interview session, apply a 1.25x speed edit, and complete processing prior to the TA review.
o	Jatin Bhardwaj: Record backup audio via Mac native recorder, outline project strategy options (community/civic service), and organize meeting notes.
o	Devi Vrinda A: Update and share the interview question document in Discord, incorporating local event sharing and inventory management inquiries.
o	Amit Kumar Patra: Review ticket sales and inventory questions with the team to finalize the research framework.
o	Bhabani Kundu: Review interview recording logs and prepare to summarize user operational pain points.

Minutes from June 24, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Defined system stakeholder classifications and established milestone submission protocols. Categorized primary users as club members/performers, secondary users as internal core committee maintainers and regulatory bodies, and tertiary users as sponsors/external venues.
•	Key Decisions: Restricted research scope to the current interview data (no additional external interviews needed). Established that all team members must independently submit an Honor Code declaration, draft contributions in Markdown, and submit work via GitHub Pull Requests.
•	Assigned Tasks / Action Items:
o	Shibin Mohammed: Conduct research and draft SMART user stories for primary club members and performers.
o	Amit Kumar Patra: Conduct research and draft SMART user stories for secondary administrative users and regulatory bodies.
o	Devi Vrinda A: Transform the raw interview audio into a structured Q&A transcript and document core user pain points.
o	Jatin Bhardwaj: Prepare the team Honor Code template, draft meeting minutes, and post task summaries to Discord.
o	Bhabani Kundu: Review user story requirements and assist in mapping pain points to system features.

Minutes from June 29, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Transitioned from Milestone 1 to Milestone 2 planning, focusing on application architecture, dashboard separation, and Generative AI feature strategies.
•	Key Decisions: Adopted a multi-page website layout featuring two distinct dashboard views: one for maintainers/secretaries and one for general members. Agreed to implement 6 to 7 AI-driven features (e.g., automated event summaries, role matching, audition quality checks). Designated the "Plays" page as a distinct entity from general "Events" to showcase full scripts, cast lists, and technical details.
•	Assigned Tasks / Action Items:
o	Shibin Mohammed: Draft design prompts and layout requirements for the Audition and Role Application pages.
o	Amit Kumar Patra: Collaborate with Jatin on selecting visual color palettes and explore UI generation tools (Stitch/Tailwind).
o	Devi Vrinda A: Draft design prompts for the About Page and research technical media evaluation tools on Hugging Face.
o	Bhabani Kundu: Draft design prompts for the Dashboard, Events page, and Gallery catalog.
o	Jatin Bhardwaj: Coordinate overall UI architecture, research audio/video quality model feasibility, and investigate sponsorship API options.

Minutes from July 01, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Reviewed homepage wireframe outputs, evaluated design assets, and finalized the core frontend technology stack.
•	Key Decisions: Reached a team consensus to adopt Shadcn UI and Tailwind CSS as the foundational design system to ensure visual uniformity across reusable components. Reaffirmed building frontend components with React and TypeScript (.tsx).
•	Assigned Tasks / Action Items:
o	Shibin Mohammed: Initialize the React/Shadcn development environment and begin coding the frontend event and audition pages.
o	Amit Kumar Patra: Document the design system setup (Shadcn/Tailwind configuration) and draft secondary page components.
o	Jatin Bhardwaj: Construct the master Gantt chart to track Milestone 2 project timelines.
o	Devi Vrinda A: Request updated, high-resolution media assets and photos from the client's Google Drive.
o	Bhabani Kundu: Review frontend design components to align upcoming database field specifications.

Minutes from July 08, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Audited frontend component organization, defined database schema fields, and established strict Role-Based Access Control (RBAC) boundaries.
•	Key Decisions: Organized codebase directory structure by isolating the sidebar component and creating dedicated subfolders under src/pages/ for member and maintainer views. Decided to store script data as Markdown text within SQLite. Removed the separate announcements database in favor of an integrated notification system.
•	Assigned Tasks / Action Items:
o	Shibin Mohammed: Develop member dashboard components (MemberDashboard.tsx), incorporating live rehearsal countdowns, RSVP state toggles, and contextual schedule notes.
o	Amit Kumar Patra: Develop maintainer dashboard components in a separate subfolder and implement database tables for plays, scripts, and locations.
o	Jatin Bhardwaj: Build the public landing page with login access toggles and perform code reviews on open PRs.
o	Devi Vrinda A: Define database schema fields for volunteers vs. participants and post dummy database code to GitHub issue comments.
o	Bhabani Kundu: Refine SQLite database models (member profiles, events, finance) and format field definitions in Markdown.

Minutes from July 11, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Established backend technology selection, authentication mechanisms, and API routing logic.
•	Key Decisions: Formally selected Flask as the backend framework. Adopted JSON Web Tokens (JWT) and secure password hashing for authentication instead of third-party OAuth/Google Login. Implemented automated backend routing to direct users to either member or maintainer dashboards based on authenticated user roles.
•	Assigned Tasks / Action Items:
o	Jatin Bhardwaj: Initialize and upload the baseline Flask backend repository structure and database connection routes.
o	Bhabani Kundu: Implement JWT authentication logic, secure session handling, and backend login endpoints.
o	Devi Vrinda A: Collect real club member data/photos and build database populator scripts.
o	Shibin Mohammed: Align member frontend API calls with Flask backend authentication endpoints.
o	Amit Kumar Patra: Align maintainer frontend API calls and research payment gateway integration for patron circle funding.

Minutes from July 14, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Finalized research responsibilities for the 5 core Generative AI features and defined technical scope boundaries.
•	Key Decisions: Restricted the "Audition Sanity Check" feature strictly to technical audio/video verification (resolution, audio clarity, missing frames) rather than subjective acting performance evaluation. Agreed to prioritize research, documentation, and interface screenshots over full live model training for the upcoming deadline.
•	Assigned Tasks / Action Items:
o	Shibin Mohammed: Lead research on the "Rehearsal Bot / Q Partner & Line Reader" feature (audio streaming, speech-to-text with word-level timestamps).
o	Amit Kumar Patra: Lead research on the "AI Character Generator & Manuscript Assistant" feature.
o	Devi Vrinda A: Lead research on the "Audition Sanity Check" tool using Hugging Face audio/video verification models.
o	Jatin Bhardwaj: Lead research on the "Sponsor Key Point Filter" tool for extracting portfolio highlights.
o	Bhabani Kundu: Lead research on the "Event Detail Summarizer" AI feature.

Minutes from July 21, 2026 SCRUM Meeting:
•	Meeting Focus & Overview: Finalized repository file organization, reviewed AI prototype progress, and assigned final Milestone 2 report packaging tasks.
•	Key Decisions: Established the meeting minutes format as concise, pointwise summaries including dates and task assignments. Standardized the final project submission package to contain separate folders for: (1) Consolidated Deliverable PDF, (2) Clean Frontend Source Code ZIP (excluding node_modules), and (3) Combined Milestone 1 & 2 documentation archives.
•	Assigned Tasks / Action Items:
o	Shibin Mohammed: Compile the official Scrum Meetings Schedule and Minutes Markdown file and submit Pull Request.
o	Bhabani Kundu: Complete the Project Schedule documentation section (referencing pages 8–13) and export finalized Gantt charts.
o	Devi Vrinda A: Generate final system architecture and database entity-relationship (ER) class diagrams.
o	Amit Kumar Patra: Package the clean frontend source code into a ZIP file (removing node_modules) and integrate AI frontend preview components.
o	Jatin Bhardwaj: Conduct final PR code reviews, verify clean TypeScript compilation, and assemble the consolidated Milestone 2 PDF Report.