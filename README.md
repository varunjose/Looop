# looop product site

The responsive product-introduction site for **looop.app** — an AI app builder that generates, verifies, repairs, and repeats until real checks pass.

## Run locally

```bash
npm run dev
```

Open `http://localhost:4173`.

## Validate and build

```bash
npm test
```

The production-ready static output is written to `dist/`.

## Publish

Pushing `main` runs the included GitHub Pages workflow. It checks the site, builds the static output, and publishes the `dist/` directory.

## Design direction

- A cinematic dark interface with long pinned scenes, oversized typography, luminous actions, and scroll-synchronised product storytelling.
- An original Looop visual system built around orbit lines, test states, failure fingerprints, constrained slots, and the generate → verify → repair cycle.
- Product UI is drawn natively in HTML, CSS, and inline SVG, with no copied brand assets or external editorial media.
- No external fonts, image pipeline, CMS, UI libraries, or runtime dependencies; the page remains lightweight and fast on GitHub Pages.
- Motion responds to scrolling and pointer position, while `prefers-reduced-motion` receives a complete static experience.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Semantic landing-page structure and product content |
| `styles.css` | Responsive design system, layout, and motion |
| `app.js` | Interactive run demo, navigation, tabs, FAQ, and clipboard actions |
| `scripts/check.mjs` | Dependency-free structural checks |
| `scripts/build.mjs` | Static production build |
| `scripts/serve.mjs` | Local development server |

## Product truth

The site deliberately preserves the current product-state disclosures from the supplied brief: the core engine and oracle are tested, while auth, billing, quotas, abuse protection, project management, and the full production deployment path remain on the roadmap.
