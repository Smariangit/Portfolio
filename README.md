# Sparsh Verma — Portfolio

Professional portfolio site for client and recruiter audiences.

## Structure

```
index.html               Main site (About, Skills, Experience, Projects, Contact)
portfolio-gallery.html   Architecture deep-dives & code walkthroughs
css/style.css            Design system (single gold accent, executive palette)
js/main.js               Interactions + Google Apps Script contact form handler
assets/Resume.pdf        Résumé (replace with latest version)
Pictures/                Dashboard screenshot
favicon.svg              Site icon
```

## Contact form setup (Google Apps Script)

1. Open [sheets.new](https://sheets.new) — this will be your inbox sheet.
2. **Extensions → Apps Script** — paste the code from the comment block at the bottom of `index.html`.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the deployment URL.
5. In `js/main.js`, replace `YOUR_APPS_SCRIPT_DEPLOYMENT_URL_HERE` with that URL.

Every submission writes a row to the sheet and sends you an email notification.

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

Static HTML/CSS/JS — push to GitHub Pages directly. No build step needed.
