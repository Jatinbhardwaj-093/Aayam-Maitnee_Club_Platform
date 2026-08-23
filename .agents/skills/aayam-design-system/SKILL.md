---
name: aayam-design-system
description: >-
  Design and implement frontend UI for Aayam — The Matinee Club (IIT Madras BS Drama Society), preserving its archival editorial theatre aesthetic, type hierarchy, warm surfaces, and thin scrollbars.
---

# Aayam Design System

Use this skill for Aayam frontend pages, components, restyling, and UI polish. The visual character is an **archival editorial theatre programme**: warm paper, ink-dark copy, dramatic serif display type, compact production metadata, and sparing coral/crimson moments of stage-light energy.

## Dual Design Architecture

Aayam features two distinct visual domains:

1. **Public Website Landing Pages (`frontend/src/pages/website_landing/*`)**:
   - **Canvas**: Warm paper `#E7DDD3`
   - **Cards & Modals**: Deep Charcoal `#2C2A28` / Elevated `#353535` with terracotta borders
   - **Typography on Cards**: Cream `#F7F5F0` headings, `text-white/70` body
   - **Accent / CTA Buttons**: Terracotta Coral `#E85F57` (hover `#D94538`), Dark Charcoal `#2C2A28` secondary with `border-white/20`
   - **Pills & Steppers**: `bg-[#353535]` / `border-white/10` with emerald and terracotta highlights

2. **Member & Maintainer ERP Portal (`frontend/src/pages/member/*` and `maintainers/*`)**:
   - **Canvas & Containers**: `#E7DDD3` canvas, `#F2E5E0` elevated container
   - **Cards & Dialogs**: Warm oatmeal parchment `#FAF2EE` / `#F5EAE6` with `#DCBAB2` borders
   - **Typography**: Dark Walnut `#2A1816` headings, espresso `#5C3B37` body
   - **Accent / CTA Buttons**: Master Theatrical Crimson `#8C241E` (hover `#731B16`)

## Palette and surfaces by area

### Public Landing Palette
| Role | Preferred value | Use |
| --- | --- | --- |
| Paper canvas | `#E7DDD3` | Main public-page background |
| Stage Card | `#2C2A28` | Event, Play, and Tracker cards |
| Raised Stage Panel | `#353535` / `#1F1E1D` | Steppers, filters, presets |
| Coral accent | `#E85F57` (Hover: `#D94538`) | Primary CTA buttons, badges, highlights |
| Dark button | `#2C2A28` (border: `white/20`) | Secondary public buttons |
| Card text | `#F7F5F0` / `white/70` | Text on dark cards & modals |

### Member ERP Palette
| Role | Preferred value | Use |
| --- | --- | --- |
| Paper canvas | `#E7DDD3` | Workspace canvas |
| Container | `#F2E5E0` | Elevated container frame |
| Inside Card | `#FAF2EE` | Roster, script, audition cards |
| ERP Modal | `#F5EAE6` | Internal dialogs & dossiers |
| Crimson accent | `#8C241E` (Hover: `#731B16`) | Member primary CTA buttons |
| Ink text | `#2A1816` / `#5C3B37` | Headings and body copy |

- Use full-width paper canvas with fine borders and gently elevated, tactile surfaces. Do not introduce cool grey, blue, or glassmorphism as a dominant treatment.
- Pure white is acceptable only as a restrained translucent/light control surface when it matches nearby public UI. Avoid large stark-white cards on the paper canvas; prefer the warm surface tokens.
- Dark cards should feel like a theatre stage: `#2C2A28` base, soft light text, coral accents, a restrained image gradient, and subtle white transparency for dividers.
- In an existing deep-crimson production/admin surface, use its local theme tokens: crimson `#8C241E`, paper pinks, espresso text, and blush borders. Do not replace it merely to match a public page.

## Components and interaction

- **Layout:** Use generous vertical rhythm, `max-w-7xl` editorial containers, breathing room around headers, and responsive grids that collapse deliberately. Use asymmetry only when it strengthens a focal production image or story.
- **Buttons:** Primary actions are coral/crimson, white text, pill-shaped, compact uppercase labels, and a clear hover/active response. Secondary actions are warm/light, bordered, and quieter. Icons should clarify actions, not decorate every line.
- **Cards:** Prefer `rounded-2xl` to `rounded-[2.5rem]` according to emphasis. Feature imagery can use larger radii and dark overlays; ordinary data cards should remain calmer. Use borders and soft shadows sparingly.
- **Inputs and dialogs:** Use warm backgrounds, paper/blush borders, clear ink text, and coral focus rings. Avoid raw browser `<select>` styling for prominent choices; use the existing themed UI primitives or provide equivalent accessible styling.
- **Feedback:** Keep visible keyboard focus, semantic HTML, readable contrast, touch-friendly controls, informative empty/loading/error states, and `prefers-reduced-motion`-friendly motion. Transitions should be short and purposeful (colour, shadow, or a small translate/scale), never theatrical at the cost of usability.

## Scrollbars — mandatory thin treatment

Thin scrollbars are a project convention for the document and **every scrollable region**: modals, sheets, tables, script/code viewers, carousels, tab strips, and overflow panels.

- `frontend/src/index.css` already applies the global standard: Firefox `scrollbar-width: thin`, transparent track, `#D5AAA2` thumb, and 5px WebKit width/height. Preserve it during CSS refactors.
- Do not add browser-default bulky scrollbars or override this with wider component-specific scrollbars. When component styles are isolated or a class is needed for clarity, add `custom-scrollbar`, which follows the same 5px / transparent-track rule.
- Hover thumb: `#8C241E`; keep the thumb rounded. Ensure horizontal scrolling gets the same thin treatment.

## Final design check

Before handing over frontend work, check that the view reads as Aayam: paper and ink foundation, serif story hierarchy, mono production details, a deliberate coral/crimson accent, warm rather than stark surfaces, responsive composition, and thin scrollbars wherever overflow is possible.
