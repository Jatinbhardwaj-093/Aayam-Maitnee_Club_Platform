---
name: aayam-design-system
description: >-
  Design and implement frontend UI for Aayam — The Matinee Club (IIT Madras BS Drama Society), preserving its archival editorial theatre aesthetic, type hierarchy, warm surfaces, and thin scrollbars.
---

# Aayam Design System

Use this skill for Aayam frontend pages, components, restyling, and UI polish. The visual character is an **archival editorial theatre programme**: warm paper, ink-dark copy, dramatic serif display type, compact production metadata, and sparing coral/crimson moments of stage-light energy.

## Source of truth

- Treat `frontend/src/index.css`, `frontend/tailwind.config.js`, and the local component/page context as the implementation source of truth. Reuse existing tokens and nearby patterns before introducing a new value.
- The public website primarily uses the paper-and-coral palette below. Some authenticated production/admin areas use the deeper `frontend/src/theme/theatricalCrimson.ts` palette; preserve that richer crimson variant where it is already established rather than mixing both systems arbitrarily.
- Do not make a page feel like a generic SaaS dashboard: favour editorial grouping, meaningful whitespace, and production/rehearsal language over dense neutral cards and excessive UI chrome.

## Type hierarchy

- **Display and headings:** `font-serif` — Instrument Serif, with Playfair Display/serif fallback. Use it for page titles, production titles, feature statistics, and short editorial statements. Keep its weight light or normal, letter spacing tight, and allow an italic phrase as a restrained dramatic accent.
- **Body:** `font-sans` — Plus Jakarta Sans, with Source Sans 3/sans-serif fallback. Use comfortable, quiet copy; primary body text is ink-dark and supporting copy is muted rather than low-contrast.
- **Metadata and UI labels:** `font-mono` — use for dates, indices, venue/production details, statuses, badges, and compact controls. Labels are generally uppercase, bold or semibold, and tracked (`tracking-wider` / `tracking-widest`). Do not set paragraphs or prominent headings in mono.
- Do not add a new font family unless it is properly loaded and deliberately adopted across the relevant surface.

## Palette and surfaces

| Role | Preferred value | Use |
| --- | --- | --- |
| Paper canvas | `#E7DDD3` | Main public-page background |
| Ink | `#2C2A28` | Headings and high-emphasis text |
| Muted ink | `#666361` | Body/supporting copy and metadata |
| Coral accent | `#E85F57` | Primary calls to action, active states, highlights |
| Coral hover | `#D94538` | Primary CTA hover |
| Paper border | `#D5C9BE` | Dividers and light outlines |
| Deep stage | `#2C2A28` / `#353535` | Feature cards, image overlays, dark callouts |
| Light surface | `#EFE8E1`, `#E5E1D8`, or `#F7F5F0` | Subtle raised sections and quiet controls |

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
