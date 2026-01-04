# Supply & Demand Beer and Pizza

Website for Supply & Demand Beer and Pizza - a brewery and pizzeria.

Built with [Eleventy](https://www.11ty.dev/), a fast and flexible static site generator.

## Tech Stack

- **Eleventy 2.0** - Static site generator
- **Nunjucks** - Template engine
- **SCSS** - Styles (compiled to CSS)
- **Bootstrap 5** - CSS framework (via CDN)
- **Font Awesome** - Icons (via CDN)
- **Google Sheets** - Content management (fetched at build time)
- **Google Drive** - Image hosting
- **Netlify** - Hosting and deployment

## Prerequisites

- Node.js 18+ and npm
- Git
- Google account (for Sheets and Drive)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/plansmash/supply-demand.git
cd supply-demand
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Sheets published CSV URLs:

```bash
SHEET_URL_BEERS=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv
SHEET_URL_MENU=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv
SHEET_URL_EVENTS=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv
```

See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for instructions on setting up Google Sheets.

## Development

### Start the Development Server

```bash
npm start
```

This will start a local server at `http://localhost:8080` with hot reload enabled.

### Build for Production

```bash
npm run build
```

The built site will be in the `_site/` directory.

### Clean Build Artifacts

```bash
npm run clean
```

Removes `_site/` and `.cache/` directories.

## Project Structure

```
supply-demand/
├── src/
│   ├── _data/              # Data files and Google Sheets fetchers
│   │   ├── site.js         # Site metadata
│   │   ├── beers.js        # Beer list data
│   │   ├── menu.js         # Menu data
│   │   └── events.js       # Events data
│   ├── _includes/
│   │   ├── layouts/        # Page layouts
│   │   │   ├── base.njk    # Base HTML structure
│   │   │   └── page.njk    # Standard page layout
│   │   └── components/     # Reusable components
│   │       ├── header.njk
│   │       ├── footer.njk
│   │       ├── nav.njk
│   │       └── skip-link.njk
│   ├── assets/
│   │   ├── scss/           # Stylesheets
│   │   │   ├── main.scss
│   │   │   ├── _variables.scss
│   │   │   ├── _accessibility.scss
│   │   │   └── _custom.scss
│   │   ├── js/             # JavaScript (if needed)
│   │   └── images/         # Static images
│   └── pages/              # Page templates
│       ├── index.njk       # Home page
│       ├── beer.njk        # Beer list
│       ├── pizza.njk       # Pizza menu
│       ├── menu.njk        # Full menu
│       ├── events.njk      # Events
│       ├── about.njk       # About page
│       ├── location.njk    # Location & hours
│       └── contact.njk     # Contact page
├── .eleventy.js            # Eleventy configuration
├── package.json            # Dependencies and scripts
├── .env.example            # Example environment variables
├── CONTENT-GUIDE.md        # Guide for content editors
├── WARP.md                 # Developer guide for Warp AI
└── README.md               # This file
```

## Content Management

Content is managed through Google Sheets. See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for detailed instructions on:

- Setting up Google Sheets
- Adding and editing content
- Uploading and linking images from Google Drive
- Triggering site rebuilds

**Quick Summary:**
1. Content editors update Google Sheets (Beer, Menu, Events)
2. Images are uploaded to Google Drive and linked in the sheets
3. The site is rebuilt (manually or automatically) to pull new data
4. Changes appear on the live site

## Deployment

### Netlify Setup

1. **Connect Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `plansmash/supply-demand`

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `_site`
   - Node version: 18 or higher

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add the three `SHEET_URL_*` variables with your published CSV URLs

4. **Deploy**
   - Click "Deploy site"
   - The site will build and deploy automatically

### Continuous Deployment

Pushing to the `main` branch automatically triggers a new deployment on Netlify.

### Manual Deploys

Create a Build Hook in Netlify:
1. Site settings → Build & deploy → Build hooks
2. Click "Add build hook"
3. Give it a name (e.g., "Content Update")
4. Share the URL with content editors

Content editors can trigger a rebuild by visiting the build hook URL.

### Scheduled Builds

To automatically rebuild the site daily (for content updates):
1. Site settings → Build & deploy → Build hooks
2. Use a service like [Zapier](https://zapier.com) or [IFTTT](https://ifttt.com) to call the build hook URL on a schedule
3. Or use Netlify's scheduled functions (requires Pro plan)

## Accessibility

This site is built with WCAG 2.1 AA compliance in mind:

- ✅ Skip to main content link
- ✅ Semantic HTML5 structure
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ ARIA labels where appropriate
- ✅ Sufficient color contrast
- ✅ Focus indicators
- ✅ Touch targets meet minimum size (44x44px)
- ✅ Reduced motion support

Test with:
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation

## Customization

### Site Metadata

Edit `src/_data/site.js` to update:
- Site name and description
- Contact information (phone, email)
- Social media links

### Styling

- **Colors and fonts**: `src/assets/scss/_variables.scss`
- **Custom styles**: `src/assets/scss/_custom.scss`
- **Bootstrap overrides**: Can be added to `_variables.scss`

### Pages

- Static content: Edit the `.njk` files in `src/pages/`
- Dynamic content: Controlled by Google Sheets
- Navigation: Edit `src/_includes/components/nav.njk`

## Troubleshooting

### Build Fails

- Check that all environment variables are set correctly
- Verify Google Sheets are published as CSV
- Check Node.js version (18+ required)
- Try `npm run clean` then `npm install`

### Data Not Showing

- Ensure Google Sheets are published and accessible
- Check `.env` has correct CSV URLs
- Verify sheet column headers match expected names
- Check browser console for errors

### Images Not Loading

- Ensure Google Drive images are set to "Anyone with the link"
- Verify image URLs use the direct format: `https://drive.google.com/uc?export=view&id=FILE_ID`
- Check that FILE_ID is correct

## Contributing

This is a private project for Supply & Demand Beer and Pizza.

When making changes:
1. Create a feature branch
2. Make your changes
3. Test locally with `npm start`
4. Commit with clear messages
5. Push and create a pull request

## License

The code in this repository is licensed under the MIT License. See [LICENSE](LICENSE) for details.

**Note:** Brand assets, images, logos, and written content are © Supply & Demand Beer and Pizza and are not covered by the MIT License unless explicitly stated.

## Support

For technical issues or questions:
- Check [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for content editing help
- Check [WARP.md](WARP.md) for development guidance
- Contact the web developer
