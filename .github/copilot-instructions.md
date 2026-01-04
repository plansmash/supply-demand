# Copilot Instructions for Supply & Demand

> **See also:** [WARP.md](../WARP.md) for detailed architecture documentation and development workflows.

## Project Philosophy
- **Simplicity first:** Prefer clarity over cleverness; avoid unnecessary complexity
- **Minimal JavaScript:** Static-first; client-side JS only where essential
- **Non-technical editors:** Data layer designed for Google Sheets editing by non-developers
- **Low maintenance:** Keep dependencies lean, builds fast, deployment straightforward

## Stack & Build System
- Eleventy 2.0 static site generator with Nunjucks templates
- SCSS compiled via the sass npm package (not the Sass CLI)
- Bootstrap 5 and Font Awesome loaded from CDN (do not bundle or install)
- Data fetched at build time; no client-side data loading
- Images hosted on Google Drive, linked from CSV data
- Package manager: **npm only** (never use yarn/pnpm)

**Key commands:**
```bash
npm start          # Dev server on :8080
npm run build      # Production build
npm run clean      # Remove _site/ and .cache/
```

## Data Source Adapter Pattern (Critical)
All data modules (`beers.js`, `menu.js`, `events.js`) delegate to source-specific adapters in `src/_data/_sources/`:

- **Adapter selection:** `DATA_SOURCE` env var (default: `sheets`)
- **Canonical return shape:** All adapters must return:
  ```javascript
  { items: [], error: null, lastUpdated: "ISO string" }
  ```
- **Error handling:** Never crash builds; always return the shape with `error` populated. Pages rely on this for fallback UI.
- **Active adapter:** `sheets.js` (Google Sheets CSV via `@11ty/eleventy-fetch`, Papa Parse, 1h dev/1d prod cache)
- **Stub adapter:** `squarespace.js` throws "not yet implemented" errors; data modules catch and convert to error shape
- Do NOT implement Squarespace API logic unless explicitly requested.

**Do not rename this structure or add new required fields without updating all adapters and templates.**

## Template & Layout Rules (Critical)
- This project uses **Eleventy front-matter layouts** and `{{ content | safe }}` injection
- **Never introduce `{% block %}` / `{% extends %}` Nunjucks inheritance in page templates**—it conflicts with front-matter layouts
- Example chain: `beer.njk` (front-matter: `layout: base.njk`) → `base.njk` renders `{{ content | safe }}`
- Layouts live in `src/_includes/layouts/`; components in `src/_includes/components/`

## Reliability & Fallback UI (Project-Specific)
- Pages (beer, menu, events) must **never render blank** on data fetch failures
- Check `beers.error`, `menu.error`, `events.error` in templates; show user-friendly fallback UI (see `beer.njk` for pattern)
- Data modules wrap adapter calls in try/catch and return error shape on failure

## Accessibility Requirements
- Keep skip link (`#main-content`), landmarks (`<main id="main-content">`), `.visually-hidden` utility
- Maintain focus indicators (`outline: 2px solid` pattern in `_accessibility.scss`)
- Icons require `aria-hidden="true"` when decorative
- Honor `@media (prefers-reduced-motion: reduce)`

## Environment Variables & Deployment
Required in `.env` (local) and Netlify (production):
- `DATA_SOURCE` (default: `sheets`)
- `SHEET_URL_BEERS`, `SHEET_URL_MENU`, `SHEET_URL_EVENTS` (when `DATA_SOURCE=sheets`)

See `.env.example` for setup; `CONTENT-GUIDE.md` documents column headers.

## Data Contracts & Editing Safety
- **CSV column headers** in Google Sheets map to object keys (lowercased, spaces → underscores via `transformHeader`)
- Templates expect specific keys (e.g., `beer.name`, `beer.style`, `beer.available`)
- **Never rename columns** without updating: adapters (`sheets.js`), data modules, templates, and `CONTENT-GUIDE.md`
- Prefer adding new columns over renaming; backwards compatibility matters for published Sheets

## Commit Discipline
- Commit early and commit often.
- Prefer small, focused commits over large ones.
- One logical change per commit whenever possible.
- Write clear, descriptive commit messages (no emojis).
- Avoid "mega commits" that mix structure, content, and styling.
- **Always test with `npm run build` before committing** to catch build errors.
- If unsure, commit more frequently rather than less.
- Prefer small, focused commits over large ones.
- One logical change per commit whenever possible.
- Write clear, descriptive commit messages (no emojis).
- Avoid “mega commits” that mix structure, content, and styling.
- If unsure, commit more frequently rather than less.
- When in doubt, choose the simpler, clearer solution and commit it separately.

## Dependency Philosophy
- Keep dependencies minimal (currently 5 deps + Eleventy ecosystem)
- Bootstrap/Font Awesome via CDN only
- Avoid adding new npm packages unless essential

## Future Enhancements
See [WARP.md § Future Enhancements](../WARP.md#future-enhancements) for planned features and improvements.
