# Monika Anandan — Portfolio

A single-page portfolio site covering IT & Technology, Digital Marketing,
Finance & Business Development, Media Production, EdTech, HR & Staffing
and Supply Chain — with clickable sector cards, business articles, an
experience timeline, a gallery, and every one of your social links.

## How to view it
Just open `index.html` in any web browser (double-click it, or right-click →
Open with → your browser). No installation, server, or build step needed.

## How to publish it online (optional)
Any static hosting works since this is plain HTML/CSS/JS:
- **Netlify / Vercel:** drag-and-drop this whole folder into their dashboard.
- **GitHub Pages:** push this folder to a GitHub repo and enable Pages.

## How to edit the content
Almost everything you'll want to change lives in **`js/data.js`** — services,
articles, "open for" cards, experience timeline, gallery file list, and all
social links. Open it in any text editor; each section is clearly labeled.

- To edit colors, fonts or spacing → `css/style.css`
- To change the page structure/sections → `index.html`
- To add your own photos → see `images/README.md`

## Folder structure
```
portfolio/
├── index.html          → the page itself
├── css/style.css        → all styling
├── js/data.js            → all editable content (services, articles, links…)
├── js/script.js         → renders the content + powers the popups
├── images/
│   ├── profile/          → your hero photo goes here (profile.jpg)
│   ├── gallery/          → gallery photos go here
│   ├── logos/             → reserved for partner/platform logos
│   └── README.md         → exact file names to use
└── README.md              → this file
```

## Notes
- All social links are wired in exactly as provided and open in a new tab.
- Every sector card and article card opens a popup with full details —
  edit or add to these anytime in `js/data.js`.
- The site is fully responsive (desktop, tablet, mobile).
