# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

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
- `SHEET_URL_BEERS` - Published CSV URL for beer list
- `SHEET_URL_MENU` - Published CSV URL for menu
- `SHEET_URL_EVENTS` - Published CSV URL for events

See `.env.example` and `CONTENT-GUIDE.md` for details.

## Architecture

### Project Structure
```
src/
├── _data/              # Data files (site.js, beers.js, menu.js, events.js)
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

**All data is fetched at build time** from Google Sheets using `@11ty/eleventy-fetch`:
- Cached for 1 hour in development, 1 day in production
- Graceful error handling returns empty arrays with error messages
- CSV parsing via `papaparse`
- Column headers are normalized to lowercase with underscores

**Data structure returned:**
```javascript
{
  items: [],           // Array of data objects
  error: null,         // Error message if fetch fails
  lastUpdated: "..."   // ISO timestamp
}
```

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
