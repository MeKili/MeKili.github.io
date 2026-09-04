# mekili.github.io

My personal website → **https://mekili.github.io**

A fast, responsive, single-page portfolio built from scratch with plain HTML, CSS and
vanilla JavaScript — no framework, no build step. Hosted on GitHub Pages.

## Features
- Light / dark theme with system-preference detection and a manual toggle
- Responsive layout down to mobile, with an accessible mobile menu
- Scroll-reveal animations, animated hero, and a role typewriter (all respect `prefers-reduced-motion`)
- Filterable project grid and a live public-repo count from the GitHub API
- Semantic HTML, skip link, focus styles, and Open Graph / Twitter cards for link previews

## Structure
```
index.html      # markup and content
styles.css      # design system + light/dark themes + responsive rules
main.js         # theme, menu, reveal, typewriter, filters, GitHub stats
assets/         # profile photo and CV
favicon.svg
```

## Local preview
Just open `index.html` in a browser, or serve the folder:
```bash
python -m http.server 8000
```

## Updating the CV
Replace `assets/cv.pdf` with the latest export and push — the “Download CV” button always serves that file.
