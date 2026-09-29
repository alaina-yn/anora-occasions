# Anora Occasions — Catering & Event Services (Kuala Lumpur)

Static, no-build website. Open `index.html` in a browser — no npm, no framework.
Ready for GitHub Pages / Netlify / Vercel static hosting.

## Pages
- `index.html` — home + live **menu builder** (per-guest / per-table / total estimate)
- `services.html` — packages, menu builder, **headcount/portion calculator**, dietary FAQ
- `gallery.html` — filterable gallery + lightbox
- `about.html` — story, team, reviews
- `contact.html` — booking inquiry form (validates, saves to `localStorage`, opens prefilled email)

## Run locally
Just double-click `index.html`, or serve the folder:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages
1. Create repo `anora-occasions` under `alaina-yn` (or push this folder there).
2. Push all files to branch `main`.
3. Repo → **Settings → Pages** → Deploy from branch → `main` / root.
4. Site goes live at `https://alaina-yn.github.io/anora-occasions/`

```bash
git init
git add .
git commit -m "Launch Anora Occasions catering site"
git branch -M main
git remote add origin https://github.com/alaina-yn/anora-occasions.git
git push -u origin main
```

## Customize
- Phone/email: search `601121071055` and `abdullahalowasi369@gmail.com` across `*.html`.
- Prices: edit `PACKAGES` and `MENU` in `assets/js/main.js`.
- Photos: Unsplash hotlinks in each page — swap `images.unsplash.com/...` URLs for your own in `assets/img/`.
- Colors/fonts: CSS variables at top of `assets/css/style.css`.

## Notes
- Gallery portraits/avatars are CSS initials (no broken headshots).
- Form needs no backend — it composes a `mailto:` to the business email.
- All images load via CDN; site works offline except photos.
