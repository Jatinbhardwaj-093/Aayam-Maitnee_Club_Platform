# Aayam Theatre Design System Guidelines

This document specifies the official design rules for **Aayam - The Matinee Club (IIT Madras BS Drama Society)** frontend application. Every UI change, new feature, page redesign, and component must strictly adhere to these rules.

---

## 1. Core Aesthetic & Philosophy

* **Artistic Direction**: Editorial dramatic theatre with cinematic warmth, tactile cream paper surfaces, sophisticated serif typography, and rich theatrical crimson accents.
* **No Stark White Rule**: NEVER use pure white (`bg-white`, `#FFFFFF`, or bright `#F7F5F0`) for cards, dialogs, toolbars, or table surfaces against the page background. Pure white clashes harshly with the warm oatmeal cream aesthetic.
* **Calm Editorial Layouts**: Avoid "pill overload" and punchy high-contrast boxes in every corner of content cards. Information hierarchy should rely on elegant typography, subtle metadata strings, and clean whitespace.

---

## 2. Master Color Palette

| Token / Usage | Hex / Tailwind | Purpose |
| :--- | :--- | :--- |
| **Page Canvas Background** | `#E7DDD3` | App-wide canvas & background |
| **Main Section Container** | `#F2E5E0` | Elevated container frame (border: `#DCBAB2`) |
| **Inside Cards & Panels** | `#FAF2EE` | Rehearsal call sheets, script cards, member cards (border: `#DCBAB2`) |
| **Metric Gradient Cards** | `from-[#F5EAE6] to-[#EEDBD5]` | Summary statistic cards (border: `#DEBEB7`) |
| **Modal / Dialog Windows** | `#F5EAE6` | Dialog surfaces (border: `#DEBEB7`) |
| **Primary Theatrical Crimson**| `#8C241E` (Hover: `#731B16`) | Primary CTA buttons, active pills, badges (border: `#A6352F`) |
| **Crimson Accent / Links** | `#B32D25` | Icons, dates, highlights, key actions |
| **Crimson Tint / Soft Badges**| `#EEDBD5` or `#E85F57`/15 | Secondary badge backgrounds (border: `#D5AAA2` / `#E85F57`/30) |
| **Headings & High-Contrast Text**| `#2A1816` | Main titles, script names, member names |
| **Body & Supporting Text** | `#5C3B37` / `#6E4742` | Subtitles, descriptions, captions |
| **Muted Meta / Timestamps** | `#8C5A54` | Labels, notes, email subtext |
| **Success / Verified** | Emerald (`text-emerald-900`, `bg-emerald-700/15`, `border-emerald-700/30`) | Confirmed attendance, verified scripts |
| **Pending Reply** | Amber (`text-amber-950`, `bg-amber-700/15`, `border-amber-700/30`) | Unconfirmed callouts, pending approval |

---

## 3. Typography Rules

* **Headings & Production Titles**:
  * Use `font-serif text-[#2A1816]` with `font-bold` or `font-normal` tracking-tight.
  * Example: `h1` ➔ `font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight`
* **Metadata, Dates, Badges & Numbers**:
  * Use `font-mono text-xs uppercase font-bold tracking-wider`.
* **Body Copy & Descriptions**:
  * Use `font-sans text-xs sm:text-sm text-[#5C3B37] leading-relaxed font-light` or `font-medium`.

---

## 4. Mandatory Component Rules

### A. Thin Theatrical Scrollbar Rule
* **Mandatory**: Any scrollable container (modals, rosters, tables, code/script viewers, horizontal category tabs) MUST use a custom thin scrollbar. Never allow default bulky browser scrollbars.
* Use `custom-scrollbar` or the standard thin utility:
```css
/* Thin Scrollbar Style */
scrollbar-width: thin;
scrollbar-color: #D5AAA2 transparent;

/* Webkit */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #D5AAA2;
  border-radius: 9999px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
```

### B. Custom Themed Dropdown Menus
* **Mandatory**: Never use raw, unstyled default browser `<select>` boxes for prominent dropdowns.
* Always use a custom theatrical popover/dropdown matching the site theme:
  * Trigger: `bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] font-semibold flex items-center justify-between`
  * Popover Surface: `bg-[#F5EAE6] border border-[#DEBEB7] rounded-2xl p-2 shadow-2xl z-50`
  * Menu Items: `hover:bg-[#EEDBD5] text-[#2A1816] rounded-xl p-2.5 text-xs font-mono font-medium flex items-center gap-2`
  * Active Option: `bg-[#8C241E] text-[#FDF8F7] font-bold shadow-xs`

### C. Calm Editorial Card Pattern (Scripts & Books)
```tsx
<div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-7 md:p-8 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-6 shadow-xs group">
  <div className="space-y-3.5">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="text-[11px] font-mono text-[#8C5A54] uppercase tracking-wider font-semibold">
          Genre • Language
        </div>
        <h3 className="text-2xl font-serif text-[#2A1816] tracking-tight font-normal">
          Title
        </h3>
        <p className="text-xs text-[#6E4742] font-serif italic">
          by Playwright
        </p>
      </div>
      <span className="text-[10px] font-mono text-[#8C5A54]">Date</span>
    </div>
    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#6E4742]">
      <span>Pages</span> • <span>Acts</span> • <span>Cast</span>
    </div>
  </div>
</div>
```

### D. Primary Action Button
```tsx
<button className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F]">
  <Plus className="w-4 h-4 text-[#FFD0CC]" />
  <span>Action Label</span>
</button>
```

### E. Secondary / Outline Button
```tsx
<button className="px-5 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs">
  <Icon className="w-4 h-4 text-[#8C241E]" />
  <span>Action Label</span>
</button>
```

### F. Dialogs & Modals
* Container: `bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-8 shadow-2xl relative`.
* Close button: Top-right `top-6 right-6` circular icon button:
```tsx
<button
  type="button"
  onClick={() => setOpen(false)}
  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
>
  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
</button>
```

### G. Director Notes & Annotation Lines
* Keep director notes understated and editorial:
```tsx
<p className="text-xs text-[#6E4742] pt-1 leading-relaxed">
  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] mr-1.5">Note:</span>
  {noteText}
</p>
```
