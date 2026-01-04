# Content Editing Guide for Supply & Demand Website

This guide explains how to update the website content using Google Sheets and Google Drive. No coding knowledge required!

## Table of Contents

1. [Overview](#overview)
2. [Setting Up Google Sheets](#setting-up-google-sheets)
3. [Updating Content](#updating-content)
4. [Adding Images](#adding-images)
5. [Triggering a Site Rebuild](#triggering-a-site-rebuild)
6. [Troubleshooting](#troubleshooting)

## Overview

The website pulls content from three Google Sheets:
- **Beer List** - All beers on tap
- **Menu** - Food menu items (pizza, appetizers, etc.)
- **Events** - Upcoming events

Images are hosted on Google Drive and linked from the sheets.

## Setting Up Google Sheets

### Step 1: Create Your Google Sheets

Create three separate Google Sheets with the following column headers:

#### Beer List Sheet
Required columns:
- `name` - Beer name (e.g., "Hazy IPA")
- `style` - Beer style (e.g., "IPA", "Stout")
- `abv` - Alcohol by volume (e.g., "6.5")
- `ibu` - International Bitterness Units (e.g., "45")
- `description` - Brief description
- `available` - Type "yes" if available, "no" if coming soon
- `image_url` - Link to beer image (see Adding Images section)

#### Menu Sheet
Required columns:
- `category` - Menu category (e.g., "pizza", "appetizers", "desserts")
- `item_name` - Name of the dish
- `description` - Brief description
- `price` - Price (e.g., "12.99")
- `vegetarian` - Type "yes" or "no"
- `vegan` - Type "yes" or "no"
- `gluten_free` - Type "yes" or "no"
- `image_url` - Link to food image (see Adding Images section)

#### Events Sheet
Required columns:
- `title` - Event name
- `date` - Event date (e.g., "2026-03-15" or "March 15, 2026")
- `time` - Event time (e.g., "7:00 PM")
- `description` - Event description
- `image_url` - Link to event image (see Adding Images section)
- `link` - Optional link for more info (e.g., ticket sales)

### Step 2: Publish Each Sheet as CSV

For **each** of your three Google Sheets:

1. Open the Google Sheet
2. Click **File** → **Share** → **Publish to web**
3. In the "Link" tab:
   - Under "Entire Document" dropdown, select the **specific sheet tab** you want to publish
   - Under "Web page" dropdown, select **Comma-separated values (.csv)**
4. Click **Publish**
5. Click **OK** on the confirmation dialog
6. **Copy the published URL** - it will look like:
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1v...long-id.../pub?output=csv
   ```
7. Send these three URLs to your web developer to add to Netlify

**Important Notes:**
- The sheet must remain published for the website to access it
- Any changes you make to the sheet will automatically appear on the website after the next build
- You can unpublish at any time using the same File → Share → Publish to web menu

## Updating Content

### Updating the Beer List

1. Open your Beer List Google Sheet
2. Add a new row for a new beer, or edit an existing row
3. Fill in all required columns
4. Set `available` to "yes" to show it on the site, or "no" for "coming soon"
5. Save (Google Sheets auto-saves)
6. Trigger a rebuild (see section below)

**Example Row:**
| name | style | abv | ibu | description | available | image_url |
|------|-------|-----|-----|-------------|-----------|-----------|
| Hazy IPA | New England IPA | 6.8 | 50 | Juicy and tropical with notes of mango | yes | https://drive.google.com/uc?export=view&id=ABC123 |

### Updating the Menu

1. Open your Menu Google Sheet
2. Add a new row for a new item, or edit an existing row
3. Use consistent category names (e.g., always "pizza" not "Pizza" or "Pizzas")
4. Use "yes" or "no" for dietary restrictions
5. Save
6. Trigger a rebuild

**Example Row:**
| category | item_name | description | price | vegetarian | vegan | gluten_free | image_url |
|----------|-----------|-------------|-------|------------|-------|-------------|-----------|
| pizza | Margherita | Fresh mozzarella, basil, tomato sauce | 14.99 | yes | no | no | https://drive.google.com/uc?export=view&id=XYZ789 |

### Updating Events

1. Open your Events Google Sheet
2. Add a new row for each event
3. Use a consistent date format (recommended: YYYY-MM-DD like "2026-03-15")
4. Save
5. Trigger a rebuild

**Example Row:**
| title | date | time | description | image_url | link |
|-------|------|------|-------------|-----------|------|
| Trivia Night | 2026-03-15 | 7:00 PM | Weekly trivia with prizes | https://drive.google.com/uc?export=view&id=DEF456 | |

## Adding Images

Images need to be uploaded to Google Drive and then linked in your sheets.

### Step 1: Upload Image to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Create a folder called "Supply & Demand Images" (if you haven't already)
3. Click **New** → **File upload**
4. Select your image file
5. Wait for upload to complete

**Image Tips:**
- Use JPG or PNG format
- Resize large images before uploading (recommended: max 1200px wide)
- Use descriptive filenames (e.g., "margherita-pizza.jpg")

### Step 2: Get the Shareable Link

1. Right-click on the uploaded image in Google Drive
2. Click **Get link**
3. In the dialog, change **Restricted** to **Anyone with the link**
4. Click **Copy link**
5. The link will look like this:
   ```
   https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view?usp=sharing
   ```

### Step 3: Convert to Direct Image URL

The link you copied won't work directly on the website. You need to convert it:

1. From your copied link, find the **FILE ID** (the part between `/d/` and `/view`)
   - Example: In `https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view?usp=sharing`
   - The FILE ID is: `1a2B3c4D5e6F7g8H9i0J`

2. Create a new URL in this format:
   ```
   https://drive.google.com/uc?export=view&id=FILE_ID
   ```

3. Replace `FILE_ID` with your actual file ID:
   ```
   https://drive.google.com/uc?export=view&id=1a2B3c4D5e6F7g8H9i0J
   ```

4. **This is the URL** you paste into the `image_url` column in your Google Sheet

### Quick Reference: Converting Image Links

**Original link from Google Drive:**
```
https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view?usp=sharing
```

**Extract the ID part:**
```
1a2B3c4D5e6F7g8H9i0J
```

**Create the direct image URL:**
```
https://drive.google.com/uc?export=view&id=1a2B3c4D5e6F7g8H9i0J
```

**Paste this into your sheet!**

## Triggering a Site Rebuild

After you make changes to your Google Sheets, the website needs to rebuild to show the updates.

### Option 1: Automatic Rebuilds (Recommended)

Your developer can set up automatic daily rebuilds in Netlify. This means your changes will appear within 24 hours without any action needed from you.

### Option 2: Manual Rebuild

Your developer will provide you with a "Build Hook URL" - a special link that triggers a rebuild.

To rebuild the site:
1. Click the Build Hook link (or paste it in your browser)
2. Wait 2-5 minutes for the build to complete
3. Check the website to see your updates

### Option 3: Through Netlify Dashboard

If you have access to the Netlify dashboard:
1. Log in to [Netlify](https://netlify.com)
2. Click on the "supply-demand" site
3. Click **Deploys** at the top
4. Click **Trigger deploy** → **Deploy site**
5. Wait for the build to complete

## Troubleshooting

### My changes aren't showing up

1. **Did you trigger a rebuild?** Changes won't appear until the site rebuilds
2. **Is your sheet published?** Check File → Share → Publish to web
3. **Check your browser cache**: Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Wait a few minutes**: Builds take 2-5 minutes to complete

### Images aren't displaying

1. **Is the image shareable?** Make sure it's set to "Anyone with the link"
2. **Did you convert the URL correctly?** It should start with `https://drive.google.com/uc?export=view&id=`
3. **Is the file ID correct?** Double-check you copied the full ID

### I see "Data Unavailable" on the website

This means the site can't fetch data from your Google Sheet.

1. **Is the sheet published?** Check File → Share → Publish to web
2. **Did you publish as CSV?** Make sure you selected "Comma-separated values (.csv)"
3. **Did you give the URL to your developer?** They need to add it to Netlify

### Formatting looks wrong

1. **Check your column names**: They must match exactly (lowercase, with underscores)
2. **Check for typos**: especially in category names, "yes/no" values
3. **Remove empty rows**: Delete completely blank rows in your sheet

### Getting build errors

Contact your web developer and let them know:
- Which sheet you were editing (Beer, Menu, or Events)
- What changes you made
- Any error messages you see

## Best Practices

### Do's

- ✅ Use consistent category names (always "pizza", not sometimes "Pizza")
- ✅ Use "yes" or "no" for boolean fields (vegetarian, vegan, etc.)
- ✅ Keep descriptions concise and clear
- ✅ Test image links in your browser before adding to sheet
- ✅ Delete old events after they've passed
- ✅ Mark beers as available="no" when they're off tap

### Don'ts

- ❌ Don't rename column headers
- ❌ Don't unpublish your sheets (the site needs them)
- ❌ Don't leave sensitive information in published sheets
- ❌ Don't use special characters in file names or IDs
- ❌ Don't delete all rows (keep at least the header row)

## Need Help?

Contact your web developer if:
- You can't access the Google Sheets
- Images aren't working after following all steps
- You see error messages
- The site isn't rebuilding
- You want to add new types of content

## Quick Reference Card

**Add a new beer:**
1. Open Beer List sheet
2. Add row with: name, style, abv, ibu, description, available, image_url
3. Trigger rebuild

**Add a new menu item:**
1. Open Menu sheet
2. Add row with: category, item_name, description, price, vegetarian, vegan, gluten_free, image_url
3. Trigger rebuild

**Add an event:**
1. Open Events sheet
2. Add row with: title, date, time, description, image_url, link
3. Trigger rebuild

**Add an image:**
1. Upload to Google Drive folder
2. Get link → Set to "Anyone with link"
3. Convert: `https://drive.google.com/uc?export=view&id=FILE_ID`
4. Paste in `image_url` column
