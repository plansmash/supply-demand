# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

> **See also:** [.github/copilot-instructions.md](.github/copilot-instructions.md) for GitHub Copilot-specific project conventions.

## Project Overview

This is the website for Supply & Demand Beer and Pizza, built with Eleventy (11ty) static site generator.

**Tech Stack:**
- Eleventy 2.0 (static site generator)
- Nunjucks templates
- SCSS (compiled to CSS)
- Bootstrap 5 (via CDN)
- Font Awesome (via CDN)
- Google Sheets for content (via @11ty/eleventy-fetch)
- Node.js tooling

## Development Commands

### Initial Setup
```bash
npm install
cp .env.example .env
# Edit .env with your Google Sheets URLs
```

### Development
```bash
npm start                 # Start dev server with hot reload (http://localhost:8080)
npm run build            # Build for production
npm run clean            # Clean build artifacts and cache
```

### Environment Variables
Required in `.env` (locally) and Netlify (production):

**Data Source:**
- `DATA_SOURCE` - Which data source to use (default: `sheets`)
  - Options: `sheets`, `squarespace` (not yet implemented)

**Google Sheets (when DATA_SOURCE=sheets):**
- `SHEET_URL_BEERS` - Published CSV URL for beer list
- `SHEET_URL_MENU` - Published CSV URL for menu
- `SHEET_URL_EVENTS` - Published CSV URL for events

See `.env.example` and `CONTENT-GUIDE.md` for details.

## Architecture

### Project Structure
```
src/
├── _data/              # Data files
│   ├── _sources/       # Data source adapters
│   │   ├── sheets.js   # Google Sheets adapter (active)
│   │   └── squarespace.js  # Squarespace adapter (stub)
│   ├── site.js         # Site metadata
│   ├── beers.js        # Beer data (delegates to adapter)
│   ├── menu.js         # Menu data (delegates to adapter)
│   └── events.js       # Events data (delegates to adapter)
├── _includes/
│   ├── layouts/        # Base layouts (base.njk, page.njk)
│   └── components/     # Reusable components (header, footer, nav, skip-link)
├── assets/
│   ├── scss/           # Styles (main.scss, variables, accessibility, custom)
│   ├── js/             # JavaScript (minimal, if needed)
│   └── images/         # Static images (logo, etc.)
└── pages/              # Page templates (index, beer, pizza, menu, events, about, location, contact)
```

### Data Fetching

**Adapter Pattern:**
The data layer uses an adapter pattern to support multiple data sources:

- Data modules (`beers.js`, `menu.js`, `events.js`) delegate to source-specific adapters
- The active adapter is selected via the `DATA_SOURCE` environment variable
- Adapters are located in `src/_data/_sources/`
- All adapters return data in the same normalized shape (see below)
- **Templates are completely decoupled from the data source**

**Current adapters:**
- `sheets.js` - Google Sheets adapter (active, fully implemented)
- `squarespace.js` - Squarespace adapter (stub, not yet implemented)

**Google Sheets adapter** (when `DATA_SOURCE=sheets`):
- Fetches from published Google Sheets CSVs via `@11ty/eleventy-fetch`
- Cached for 1 hour in development, 1 day in production
- Graceful error handling returns empty arrays with error messages
- CSV parsing via `papaparse`
- Column headers normalized to lowercase with underscores

**Data structure returned** (all adapters must use this shape):
```javascript
{
  items: [],           // Array of data objects
  error: null,         // Error message if fetch fails (or null if successful)
  lastUpdated: "..."   // ISO timestamp
}
```

**Adapter Contract:**
All data source adapters must adhere to this contract:

1. **Return shape**: Every adapter function must return `{ items, error, lastUpdated }`
   - `items`: Array of normalized objects matching template expectations
   - `error`: String error message (or `null` if successful) - must be user-friendly for fallback UI
   - `lastUpdated`: ISO timestamp string

2. **Never throw in production**: Adapters should catch errors internally and return the error shape above
   - This ensures fallback UI displays instead of breaking the build
   - Data modules wrap adapter calls in try/catch as a safety net

3. **Normalize data**: Transform source data to match existing template expectations
   - Column/field names must match what templates use
   - Empty rows must be filtered out
   - Data types should be consistent (strings for text, numbers where appropriate)

**Implementation Details:**
- `dotenv` is initialized once in `.eleventy.js` (loaded before all data modules)
- `DATA_SOURCE` input is normalized (trimmed and lowercased) for case-insensitive matching
- Error messages are user-friendly and suitable for display in fallback UI
- Unknown data sources default to `sheets` adapter with a console warning

**Switching data sources:**
To switch from Google Sheets to another source:
1. Set `DATA_SOURCE` environment variable (e.g., `DATA_SOURCE=squarespace`)
2. Implement the corresponding adapter in `src/_data/_sources/`
3. Ensure adapter returns data in the canonical shape above
4. **No template changes required** - data shape remains consistent

### Template System

**Eleventy Layout Inheritance:**
- Templates use Eleventy's front matter-based layout system, NOT Nunjucks block inheritance
- Content templates specify `layout:` in front matter (e.g., `layout: base.njk`)
- Layouts use `{{ content | safe }}` to inject child template content
- **Do NOT use `{% block content %}` in content templates** - this conflicts with Eleventy's layout system
- Layouts can chain (e.g., `page.njk` extends `base.njk` via front matter)

**Example:**
```njk
---
layout: base.njk
title: My Page
---

<div class="container">
  <h1>Content goes here</h1>
</div>
```

The layout (`base.njk`) uses `{{ content | safe }}` to inject the template content.

### Accessibility

WCAG compliance built-in:
- Skip to main content link
- Semantic HTML5 landmarks
- Proper heading hierarchy
- ARIA labels where appropriate
- Keyboard navigation support
- Focus indicators
- `.visually-hidden` for screen reader text
- Font Awesome icons use `aria-hidden="true"`
- Minimum 44x44px touch targets
- Reduced motion support via `prefers-reduced-motion`

See `src/assets/scss/_accessibility.scss` for implementation.

### Content Management

Content editors use Google Sheets + Google Drive:
- Three Google Sheets (Beer, Menu, Events)
- Images hosted on Google Drive
- Published as CSV and fetched at build time
- No CMS or database required
- See `CONTENT-GUIDE.md` for complete workflow

### Deployment

**Netlify:**
- Build command: `npm run build`
- Publish directory: `_site`
- Environment variables configured in Netlify dashboard
- Automatic or manual deploys via build hooks
- Can schedule daily rebuilds for automatic content updates

## Common Tasks

### Adding a new page
1. Create template in `src/pages/`
2. Add to navigation in `src/_includes/components/nav.njk`
3. Use `layout: layouts/page.njk` for standard pages

### Modifying styles
- Edit `src/assets/scss/_variables.scss` for colors/fonts
- Edit `src/assets/scss/_custom.scss` for custom styles
- Bootstrap 5 is loaded via CDN (can be customized if needed)

### Adding Eleventy filters/shortcodes
Edit `.eleventy.js` - existing filters:
- `formatDate` - Format dates for display
- `formatPrice` - Format prices with currency
- `year` - Current year shortcode

### Updating site metadata
Edit `src/_data/site.js` for site name, description, contact info, social links.

## Data Contracts (Important)

**Do not rename expected Google Sheets column headers** without updating:
- `CONTENT-GUIDE.md` (so content editors know the correct column names)
- The corresponding `src/_data/*.js` module (so data fetching works)
- Any templates that reference those fields (so pages display correctly)

**Prefer adding new columns over renaming existing ones.** This prevents breaking content editors' workflows.

**Expected columns:**
- **Beer List**: `name`, `style`, `abv`, `ibu`, `description`, `available`, `image_url`
- **Menu**: `category`, `item_name`, `description`, `price`, `vegetarian`, `vegan`, `gluten_free`, `image_url`
- **Events**: `title`, `date`, `time`, `description`, `image_url`, `link`

## Reliability Requirement

**Pages must never render blank due to missing or failed data fetches.**

All templates that display Google Sheets data include fallback UI:
- If data fetch fails (`error` is set): Show "Data Unavailable" message with user-friendly explanation
- If no data exists (empty `items` array): Show "Coming soon" or "No items" message
- If data loads successfully: Display the content normally

This ensures the site remains functional even when Google Sheets are unavailable or not yet configured.

See existing templates (`src/pages/beer.njk`, `menu.njk`, etc.) for fallback UI patterns.

## Important Notes

- All commits should include `Co-Authored-By: Warp <agent@warp.dev>` when AI-assisted
- Keep accessibility in mind for all changes
- Test with keyboard navigation and screen readers
- Images must have alt text
- Use `.visually-hidden` (not `.sr-only`) for Bootstrap 5
- Content updates require a rebuild to appear on the live site

## Future Enhancements

### Staging + Production Workflow (Not Yet Implemented)

Once the site is live and stable, consider implementing a two-site deployment strategy:

**Architecture:**
- **Production Site** (`main` branch) - Live site with scheduled daily builds at 12am
- **Staging Site** (`staging` branch) - Preview site that builds on-demand

**Benefits:**
- Content editors can preview changes before they go live
- Reduces risk of mistakes appearing on production
- Allows time for review and corrections

**Workflow:**
1. Editor makes changes to Google Sheets
2. Editor triggers staging build via build hook
3. Editor previews changes at staging URL
4. Changes automatically go live at next scheduled build (12am)
5. Or editor can trigger production build for urgent updates

**Implementation Steps:**
1. Create `staging` branch from `main`
2. In Netlify, enable branch deploys for `staging`
3. Create two build hooks (staging and production)
4. Set up scheduled daily build for production (via Zapier, GitHub Actions, or Netlify Functions)
5. Update README.md with deployment workflow
6. Update CONTENT-GUIDE.md with staging workflow for content editors
7. Share staging URL and build hook with content editors

**Access Guidance (Recommended):**
- Content editors: staging build hook only (to avoid accidental production deploys)
- Site maintainer: both staging and production build hooks

**Notes:**
- The `staging` branch already exists in the repository
- Both sites use the same Google Sheets to avoid data drift and duplicate content management
- Keep staging synced with main periodically: `git checkout staging && git merge main && git push`
- Staging site URL will be similar to: `staging--supply-demand.netlify.app` (exact URL depends on Netlify site name)
