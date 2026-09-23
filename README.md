# Renaissance — IETE KJSIT

Website source for the Renaissance 2026 IETE KJSIT event page.

## Structure

- `index.html` — page markup
- `css/style.css` — all page styling and responsive rules
- `js/main.js` — event carousel, filters, event modal, schedule, sponsors, and holographic hero animation
- `assets/` — reserved for images and other static assets

## Run locally

No build step is required.

Open `index.html` directly in a browser, or serve the folder with any static HTTP server.

Example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub

```bash
git init
git add .
git commit -m "Initial Renaissance website"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Notes

The project is intentionally kept framework-free so the current single-page implementation can be deployed as a static website.
