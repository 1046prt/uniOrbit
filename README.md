# UniOrbit

**A performant, statically generated student portal for institutions, engineered with Astro.**

UniOrbit consolidates the core academic workflow into a single cohesive interface: programme catalogues, subject listings, fee structures, an academic calendar, and a four-stage course registration pipeline. It ships with a token-driven design system that renders consistently across light and dark themes.

---

## Overview

- **19 statically pre-rendered routes**, deployable to any static host with zero server infrastructure
- **Multi-stage registration flow** with cascading year, semester and subject resolution
- **Six programmes**, each with a dedicated course page and detailed subject taxonomy
- **Dual-theme architecture**, resolved before first paint to eliminate flash of incorrect theme
- **Accessibility-first construction**: skip navigation, persistent focus indicators, reduced-motion compliance, and ARIA live regions
- **Minimal dependency footprint**: Astro is the sole runtime dependency, with no UI framework and no CSS framework

---

## Quick Start

```bash
npm install
npm run dev       # development server with HMR at http://localhost:4321
npm run build     # emit optimised static output to dist/
npm run preview   # serve the production build locally
```

A successful build reports `19 page(s) built`.

---

## Technology Stack

| Layer | Implementation |
|---|---|
| Framework | Astro 5, static output with `build.format: "directory"` |
| Scripting | Astro templating with vanilla ES2020 JavaScript |
| Styling | A single hand-authored stylesheet, no preprocessor |
| Typography | Plus Jakarta Sans and Inter, served via Google Fonts |
| Iconography | Font Awesome 6.5.1 (free tier) |

---

## Repository Layout

```
.
├── astro.config.mjs
├── package.json
├── public/
│   ├── logo.svg, favicon*
│   └── scripts/            # page-scoped vanilla JavaScript
│       ├── login.js
│       ├── register.js
│       ├── registration.js
│       └── contact.js
└── src/
    ├── layouts/Base.astro  # the canonical layout wrapping every page
    ├── components/         # Nav, Footer, Logo
    ├── pages/              # file-system routing
    │   ├── courses/
    │   ├── subjects/
    │   └── fees/
    ├── scripts/ui.js       # cross-page behaviour: theming, toasts, validation
    └── styles/global.css   # the complete design system
```

---

## Route Map

| Domain | Routes |
|---|---|
| Core | `/`, `/login`, `/register`, `/course-registration`, `/academic-calendar`, `/contact`, `/404` |
| Courses | `/courses/cse`, `/courses/dsai`, `/courses/civil`, `/courses/mechanical`, `/courses/electrical`, `/courses/electronics` |
| Subjects | `/subjects/cse`, `/subjects/ds-ai`, `/subjects/civil`, `/subjects/mechanical`, `/subjects/electrical` |
| Fees | `/fees/fee-structure` |

> The Data Science and AI slug resolves as `dsai` under courses and `ds-ai` under subjects. Both are referenced in `Nav.astro` and the page-hero actions, so any change must be applied to both in lockstep.

---

## Architecture

### Layout composition

Every page is composed through `Base.astro`:

```astro
<Base title="Login" scripts={["/scripts/login.js"]}>
  <section class="page-hero" slot="hero"> ... </section>
  <main class="page-main" id="main"> ... </main>
</Base>
```

The layout renders, in order: skip link, loading overlay, navigation, hero slot, primary content, footer, the shared script, and any page-scoped scripts. The dedicated `hero` slot positions the hero outside `<main>` so it can span the full viewport width while the two regions read as one continuous surface.

### Dual script pipeline

| | `src/scripts/ui.js` | `public/scripts/*.js` |
|---|---|---|
| Delivery | Imported by `Base.astro` | Registered through the `scripts` prop |
| Processing | Bundled by Astro as an ES module | Emitted verbatim as a classic script |
| Execution | Deferred until the DOM is parsed | Immediate, at its position at the end of `<body>` |
| Scope | All 19 pages | A single page |

`ui.js` must remain a bundled module. Adding `is:inline` would convert it into a synchronous classic script and invalidate its top-level DOM queries.

### Shared utilities exposed by `ui.js`

| Global | Responsibility |
|---|---|
| `showToast(message, type?)` | Renders a transient notification in a lazily instantiated stack |
| `validateEmail(email)` | Performs a format check on an email address |
| `showValidationError(input, msg)` | Flags a field as invalid and injects contextual feedback |
| `clearValidationErrors(form)` | Resets all validation state within a form |

### Form lifecycle

Login, registration, contact and course enrolment share a single lifecycle: intercept the submit event, clear prior validation state, validate input, present the loading overlay, confirm through a notification, reset the form, then redirect. Submission is currently resolved client-side, which keeps the portal fully self-contained for demonstration. Integrating a real API requires replacing only the post-validation steps; the validation layer is fully reusable.

---

## DOM Contract

The page scripts bind to elements by class and identifier. The stylesheet may be reworked freely, but **the names below are load-bearing** and must be preserved.

**Course registration (`registration.js`)**

| Hook | Role |
|---|---|
| `.form-slide`, `#step-1` to `#step-4` | The four step panels |
| `.progress-step`, `.progress-label`, `#progress-fill` | Progress indicator, one of each per step |
| `#registration-form`, `#loading` | Form wrapper and loading overlay |
| `#next-step-1..3`, `#prev-step-2..4`, `#submit-form` | Step navigation controls |
| `#student-name`, `#enrollment-number`, `#email` | Step 1 inputs |
| `#course`, `#year`, `#sem`, `#subject`, `#specialization` | Selects that drive the cascading option sets |
| `.form-group` | Field wrapper that receives validation feedback |

**Authentication and contact**

`#login-form`, `#register-form`, `#contact-form`, the `.form-group` > `.input-icon` > `input` nesting, `.pw-toggle`, `.pw-meter`, `#notification`, `#loading`. Registration additionally reads `#password` and `#confirm-password`.

**Operational notes**

- Step panels toggle through both the `hidden` attribute and the `.active` class; the two must change together.
- The curriculum backing the registration cascade is the `subjects` object in `registration.js`. Adding a course means extending that object and adding a matching `<option>` in the page markup.
- `.progress-step` markup should remain icon-free; the script populates it with a step number or a completion mark.
- Step count is governed by `--steps` in CSS and `totalSteps` in JavaScript, and the two must be updated together.

---


---

## Contribution Guidelines

**Markup**
- Give every page's `<main>` the identifier `main` so the skip link resolves
- Keep `.page-hero` in the `hero` slot and primary content in `<main>`
- Express repeating content as a `const` array in frontmatter rendered with `.map()`, following `academic-calendar.astro`, `fee-structure.astro` and `contact.astro`

**Styling**
- Avoid inline `style` attributes
- Avoid one-off hex values; reuse or introduce a token
- Honour the card inset model before adding padding

**JavaScript**
- Place page behaviour in `public/scripts/`, one file per page, registered through the `scripts` prop
- Place cross-page behaviour in `src/scripts/ui.js`
- Guard every top-level DOM query with optional chaining or a null check
- Leave the DOM contract identifiers untouched

---

## Accessibility

- Skip link targeting `#main`, revealed on focus
- Theme resolved by a blocking inline script before first paint
- Persistent `:focus-visible` indicators throughout
- Full `prefers-reduced-motion` support
- Toasts announced through `role="status"` and `aria-live="polite"`; errors through `role="alert"`
- Decorative icons marked `aria-hidden`
- Dropdowns expose `aria-haspopup` and `aria-expanded`, and dismiss on `Escape` or outside click
- Dropdown triggers are genuine links, preserving navigation without JavaScript

---

## Verification

```bash
npm run build      # expect "19 page(s) built"
npm run preview
```

A minimal smoke test after modifying global CSS or the layout. Each of these should resolve:

```
/  /login  /register  /course-registration  /academic-calendar  /contact
/fees/fee-structure  /courses/cse  /subjects/cse  /404
```

For registration, traverse all four steps forward and backward. Step 3 populates `#sem` from `#year`, and step 4 populates `#subject` from `#course` and `#sem`.

---
