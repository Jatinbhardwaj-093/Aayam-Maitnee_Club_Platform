# **PROJECT SCHEDULE**

### **Overall Project Schedule**

| Date | Phase / Focus | Main Agenda Points (key items only) | Expected Outcome / What's Mostly Done |
| :---- | :---- | :---- | :---- |
| Jun 23, 2026 | Milestone 1 \- Interview Prep & Insights | a. Formulate drama society interview questions b. Set recording protocols (OBS/Mac recorder) c. Interview Siddharth Sahu (Drama Secretary) d. Define initial project focus (Community/Civic) | Interview completed and recorded, key pain points and workflow defined |
| Jun 24, 2026 | User Personas & Milestone Strategy | a. Define user tiers (Primary, Secondary, Regulatory) b. Establish research scope limits c. Allocate analysis responsibilities d. Plan Honor Code submission | User groups categorized, tasks allocated for user analysis |
| Jun 25, 2026 | Document Standards & User Stories | a. Set Markdown format for master report consolidation b. Define user stories for primary/secondary/tertiary tiers c. Discuss misconduct and support routing rules d. Draft manual transcript template | User story guidelines established, initial transcript drafted |
| Jun 27, 2026 | Milestone 1 Closure & Git Strategy | a. Finalize Honor Code and video processing updates b. Condense and format user stories to standard structure c. Define Git branching/deletion rules to avoid clutter | Milestone 1 completed and verified for submission |
| Jun 30, 2026 | Milestone 2 Kickoff & UI Strategy | a. Submit collective team setup forms b. Establish generic platform architecture strategy c. Design prompt workflows for UI uniformity (Stitch/Tailwind) d. Set role-based financial visibility rules | Milestone 2 kicked off, UI design rules and templates locked |
| Jul 03, 2026 | DB Schema & Architecture Alignment | a. Evaluate TypeScript/React component framework b. Plan database schema for scalability (single club with club\_id) c. Differentiate member vs. admin dashboard flows d. Finalize design documentation structure | Initial database schema mapped, UI branching protocol live |
| Jul 07, 2026 | Workflow Tracking & DB Refinement | a. Standardize central tracking on GitHub Kanban board b. Detail fields and relationships for database tables c. Reconcile daily sync schedule to 9:00 PM | Kanban tracking live, database fields defined professionally |
| Jul 08, 2026 | Code Reorganization & Script Engine | a. Isolate reusable sidebar and role sub-folders under pages b. Integrate plays/scripts schema with Markdown storage in SQLite c. Map workflow for volunteering vs. event participation | UI codebase reorganized by roles, script tables integrated |
| Jul 10, 2026 | TA Review Prep & GenAI Scaffolding | a. Complete basic landing page and dashboard routes b. Clean repository master branch (model1.py removal) c. Outline 5 core GenAI features for future implementation | Codebase cleaned, core dashboards ready for TA progress review |
| Jul 15, 2026 | GenAI Architecture & M2 Completion | a. Establish light LLM infrastructure (Free-tier API optimizations) b. Design real-time roleplay audio loop (WebRTC/WebSockets) c. Map Swagger API documentation guidelines d. Consolidate final design artifacts for report | Milestone 2 design finalized, GenAI logic architected |
| Aug 02, 2026 | Milestone 3 (Sprint 1\) Review | a. Deploy SQLite core schema tables and indices b. Build out CRUD backend APIs for membership, events, and scripts c. Implement free-tier LLM gateway and key-rotation filters | Core APIs and database backend fully operational |
| Aug 12, 2026 | Milestone 4 (Sprint 2\) Review | a. Integrate React frontend views with developed REST backend APIs b. Configure global state routing for distinct roles c. Conduct full integrated E2E system flow testing | Complete integrated system application operational |
| Aug 23, 2026 | Milestone 5 (Final Submission) | a. Final verification and comprehensive system sanity check b. Conduct dry-run presentation and record video demo c. Compile master engineering report and finalize code zip | Project fully verified and submitted to drive |

### ---

**Milestone 1 Plan (User Requirements & Research)**

**Duration:** Jun 22 – Jun 28, 2026

> **Focus:** Identify stakeholders, execute primary field research, extract core pain points, and define unified user stories.

> * **Weekly Goals:**

  * Complete domain interviews with club stakeholders, synthesize user analysis tiers, establish repository infrastructure, and submit individual Honor Code files.

> * **Major Activities:**

  * Conduct structural interview with Drama Society Secretary Siddharth Sahu to trace operational blockages.

  * Classify primary users (members, actors), secondary users (committee administrators), and tertiary/regulatory users (university admin, external sponsors).

  * Format data inputs into clean Markdown files (.md) to establish a single source of truth for downstream reports.

> * **Deliverables:**

  * Processed interview audio recording trimmed and optimized to 1.25x playback speed.

  * Comprehensive Q\&A text transcript alongside categorized user pain points.

  * Standardized user story log matching the "As a... I want to... so that..." formula.

  * Signed individual student Honor Code verification documents.

> * **Expected Outcomes:**

  * Milestone 1 finalized, checked for alignment, and uploaded directly to the drive portal by the fixed Jun 28 deadline.

### ---

**Milestone 2 Plan (System Design & Architecture)**

**Duration:** Jun 29 – Jul 23, 2026

**Focus:** Define relational database structures, map role-specific visual components, and architect generative intelligence pipelines.

| Week | Dates | Main Goals / Key Tasks | Focus Meeting Outcome / What's Mostly Done |
| :---- | :---- | :---- | :---- |
| 1 | Jun 29 \- Jul 05 | \- Kick off Milestone 2 planning parameters. \- Define application scope around generic single-club architecture with future-proofed tables (club\_id). \- Separate component views for regular member and system maintainer roles. | **Jul 03 Meeting:** Component framework chosen (TypeScript/React), SaaS scalability schema finalized, and layout folders mapped. |
| 2 | Jul 06 \- Jul 12 | \- Map complete database relational fields. \- Reorganize directory structure into dedicated subfolders under pages for optimal isolation. \- Outline functional requirements for 5 core AI tools. | **Jul 07 & Jul 08 Meetings:** GitHub Kanban board setup live; schema upgraded to support plays/scripts Markdown files in SQLite. |
| 3 | Jul 13 \- Jul 19 | \- Architect light LLM integration architecture. \- Standardize free-tier API request management configurations. \- Design low-latency interactive scripts loop blueprints. | **Jul 10 & Jul 15 Meetings:** Main branch code scrubbed, landing page complete, and GenAI threshold architecture locked. |
| 4 | Jul 20 \- Jul 23 | \- Execute rigorous technical verification across all design artifacts. \- Synthesize complete E-R diagram charts. \- Assemble Milestone 2 PDF documentation. | **Jul 23 Target:** Complete structural blueprints, component screenshots, and architecture schemas validated for submission. |

### ---

**Sprint 1 (Milestone 3: Core Backend & API Development)**

**Duration:** Jul 24 – Aug 02, 2026

> **Focus:** Implement relational SQLite data models, build out core backend business endpoints, and establish generative gateways.

> 

> * **Backend Implementation:**

  * Construct core SQLite relational tables mapping the internal fields defined during design (Members, core roles, plays, and schedule timelines).

  * Incorporate index bindings for rapid lookup within active membership clusters and event logs.

> * **API Development:**

  * Develop full CRUD REST routes managing membership states, application processes, and event logistics.

  * Document all operational routes explicitly matching Swagger/YAML visualization specifications discussed during technical sync.

> * **Integration Tasks:**

  * Build out a proxy gateway managing requests toward Generative AI endpoints (Gemini/ChatGPT free tiers).

  * Embed request rate-limit filters to restrict processing strictly within the 15–30 requests per minute ceiling.

> * **Testing:**

  * Write and run localized backend automated test suites to validate script handling stability and basic data input persistence.

> * **Sprint Review & Deliverables:**

  * Backend service package containing clean database schemas and a documented Swagger file mapping operational API pathways.

### ---

**Sprint 2 (Milestone 4: Frontend Integration & System Validation)**

**Duration:** Aug 03 – Aug 12, 2026

> **Focus:** Connect user dashboards to live APIs, enforce access control, and eliminate functional bugs.

> * 

> * **Frontend Integration:**

  * Connect the React frontend views with operational backend endpoints via standard routing wrappers.

  * Isolate user layouts dynamically, ensuring high-security separation between member dashboards and administrative panels.

> * **System Testing:**

  * Execute full End-to-End flow routines tracking user operations from registration form inputs up to core AI feature workflows.

> * **Bug Fixing:**

  * Identify and correct routing exceptions, data handling latency spikes, or cross-origin request anomalies.

> * **User Testing & Feedback:**

  * Conduct iterative evaluation routines using mock data loops to ensure UI elements match the defined visual flows perfectly.

> * **Documentation Updates:**

  * Track and detail system anomalies, performance adjustments, and error resolution files directly inside the repository logs.

> * **Sprint Review & Deliverables:**

  * Fully linked, responsive software application displaying operational cross-page navigation and dynamic data binding.

### ---

**Milestone 5 Plan (Final Submission Delivery)**

**Duration:** Aug 13 – Aug 23, 2026

> **Focus:** Polish edge-case functionalities, record demonstration materials, and compile final engineering portfolio.

> * **Final Testing:** Execute exhaustive pre-flight verification tests across all integrated modules to guarantee operational safety.

> * **Final Documentation:** Polish the unified engineering report file, including step-by-step installation recipes for Windows, Mac, and Ubuntu environments.

> * **Presentation & Demo:** Prepare high-impact slide presentations mapping the core lifecycle stages, engineering trade-offs, and GenAI features.

> * **Video Recording:** Produce a high-resolution 5-10 minute presentation video walking through real user story validations and application workflow highlights.

> 