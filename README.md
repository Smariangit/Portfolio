# Sparsh Verma — Portfolio

Source for [smariangit.github.io](https://smariangit.github.io) — a personal portfolio
covering data engineering, cloud automation, and applied GenAI work.

## Structure

```
index.html               Main site (About, Skills, Experience, Projects, Contact)
portfolio-gallery.html   Architecture deep-dives & code walkthroughs
css/style.css            Design tokens, components, animations
js/main.js                Nav, scroll-spy, reveal-on-scroll, experience calculator
assets/Resume.pdf         Downloadable résumé
Pictures/                 Dashboard screenshot
favicon.svg               Site icon
```

Architecture diagrams on both pages are hand-built inline SVG (no external image
files), so they stay crisp at any size and need no extra network requests.

## Stack

Static HTML/CSS/JS — no build step. Styling via [Tailwind CSS](https://tailwindcss.com)
(Play CDN) plus a small custom stylesheet for the design system, [Lucide](https://lucide.dev)
for icons, and Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## Running locally

No build step required — just serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Hosted on GitHub Pages directly from this repo. Pushing to `main` is enough —
there's nothing to compile.
