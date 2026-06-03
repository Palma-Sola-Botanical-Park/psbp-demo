# PSBP Website Demo — Setup Instructions
## How to get this live on GitHub Pages in about 15 minutes

---

## WHAT YOU HAVE

A folder called `psbp/` containing:

```
psbp/
├── choose.html          ← START HERE (theme chooser landing page)
├── index.html           ← Theme A: Lush & Natural
├── index-b.html         ← Theme B: Clean & Community
├── index-c.html         ← Theme C: Warm & Handcrafted
├── events.html          ← Full events page
├── nature.html          ← iNaturalist / Plants page
├── visit.html           ← Plan Your Visit
├── volunteer.html       ← Volunteer
├── venue.html           ← Rent the Park
├── members.html         ← Membership tiers
├── donate.html          ← Donate page
├── about.html           ← About Us
├── css/
│   └── shared.css       ← All shared styles
└── js/
    └── psbp.js          ← Events loader + iNaturalist loader
```

---

## STEP 1: Create a GitHub repository

1. Go to **github.com** and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it: `psbp-demo` (or anything you like)
4. Set visibility to **Public** (required for free GitHub Pages)
5. Click **Create repository**
6. Leave the new empty repo page open

---

## STEP 2: Upload the files

**Option A — Upload via browser (easiest):**

1. On your empty repo page, click **"uploading an existing file"**
2. Drag the entire contents of the `psbp/` folder into the upload area
   - You need to upload the files AND the `css/` and `js/` subfolders
   - GitHub's web uploader handles folders — just drag them all in together
3. Scroll down, add a commit message like "Initial site build"
4. Click **Commit changes**

**Option B — If you have Git installed on your computer:**

```bash
cd psbp
git init
git add .
git commit -m "Initial PSBP demo site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/psbp-demo.git
git push -u origin main
```
Replace YOUR-USERNAME with your GitHub username.

---

## STEP 3: Enable GitHub Pages

1. In your repo, click **Settings** (top menu bar)
2. Scroll down to **Pages** in the left sidebar
3. Under **Branch**, select `main` and folder `/root (root)`
4. Click **Save**
5. Wait about 60–90 seconds
6. Refresh the Settings → Pages page
7. You'll see: **"Your site is published at https://YOUR-USERNAME.github.io/psbp-demo/"**

Your demo is now live. Share that URL with Bev.

---

## STEP 4: Share the right link

The chooser/landing page is at:
```
https://YOUR-USERNAME.github.io/psbp-demo/choose.html
```

This shows all three themes with descriptions. She clicks one to explore.

Or link directly to a specific theme:
- Theme A: `.../psbp-demo/index.html`
- Theme B: `.../psbp-demo/index-b.html`
- Theme C: `.../psbp-demo/index-c.html`

---

## STEP 5: Connect a real Google Sheet for events (optional for demo)

Right now, all three homepages and the events page show **sample/demo events**.
To show real events, do this:

### 5a. Create the Google Sheet

1. Go to **sheets.google.com**, create a new sheet
2. Name it: `PSBP Events`
3. In Row 1, add these exact column headers (copy-paste exactly):

```
Date    EndDate    Title    Description    Time    ClosedToPublic    Tag
```

4. Add a sample event in Row 2, for example:
```
2025-03-02    (blank)    Spring Plants Sale    Plants, artisans, food, and fun.    10am–3pm    no    Sale
```

Date format must be: **YYYY-MM-DD** (e.g., 2025-03-02)

ClosedToPublic: type `yes` if the park closes to the public that day, `no` otherwise

Tag options: Sale, Fundraiser, Holiday, Community, Education, Volunteer (or leave blank)

### 5b. Publish the sheet as CSV

1. In Google Sheets: **File → Share → Publish to web**
2. Change the first dropdown from "Entire Document" to **"Sheet1"**
3. Change the second dropdown to **"Comma-separated values (.csv)"**
4. Click **Publish**, confirm
5. Copy the URL it gives you — it looks like:
   `https://docs.google.com/spreadsheets/d/LONG-ID/pub?gid=0&single=true&output=csv`

### 5c. Paste the URL into the site

1. Open `js/psbp.js` in a text editor
2. Find this line near the top:
   ```javascript
   const SHEET_CSV_URL = 'YOUR_GOOGLE_SHEET_CSV_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_SHEET_CSV_URL_HERE` with your CSV URL (keep the quotes)
4. Save and re-upload `js/psbp.js` to GitHub (drag and drop onto the js/ folder in the repo)

That's it. The site will now show real events from the sheet.

### 5d. Bev's workflow going forward

She opens the Google Sheet. Adds a row. Done.
The website checks the sheet every time a visitor loads the events section.
No login. No webmaster. No delay.

---

## WHAT WORKS IN DEMO MODE (without real sheet)

- All three homepage themes
- All content pages (Visit, Volunteer, Venue, Members, About, Donate)
- Sample events list (5 realistic demo events)
- **iNaturalist live data** — this is REAL, not demo. It calls the iNaturalist API and pulls actual recent observations from the park's project. If the project slug is correct, you'll see real photos from the park.

### iNaturalist project slug

In `js/psbp.js`, find:
```javascript
const INAT_PROJECT = 'palma-sola-botanical-park';
```

If the park's actual iNaturalist project URL is different, update this to match.
To find it: go to the park's iNaturalist project page, look at the URL:
`inaturalist.org/projects/SLUG-IS-HERE`

---

## UPDATING CONTENT LATER

**To change text on any page:**
1. Open the `.html` file in any text editor (TextEdit on Mac works fine)
2. Find the text you want to change and edit it
3. Save the file
4. Re-upload to GitHub (drag and drop replaces the old file)

**To add a new event:**
Add a row to the Google Sheet. Instant.

**To change membership prices:**
Edit `members.html` — the prices are plain text, easy to find.

**To change venue pricing:**
Edit `venue.html`.

---

## MAKING IT THE REAL SITE (if Bev says yes)

1. She'd need to point her domain (palmasolabp.org) to GitHub Pages
   - In GitHub Pages settings, add a Custom Domain
   - Change DNS records at her domain registrar (usually GoDaddy or similar)
   - GitHub provides step-by-step instructions for this
2. At that point, WordPress hosting can be cancelled
3. The only thing remaining on the old system would be the shop/membership payment processor — which continues to work as an external link until she's ready to replace it with something simpler like Zeffy

---

## QUESTIONS OR ISSUES

If something doesn't look right when you first load the site, the most common cause is the `css/` and `js/` folders not uploading in the right place. The file structure needs to match exactly what's listed at the top of this document.

---

*Built for PSBP by Randy Tuft, June 2025*
