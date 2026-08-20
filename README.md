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

- Editorial scale and atmospheric gradients inspired by IRIS Venture Builder.
- Compact floating navigation, product-led storytelling, and bento-style feature presentation inspired by Supaste.
- A Looop-native visual system built around orbit lines, check states, fingerprints, constrained slots, and the generate → verify → repair cycle.
- No external fonts, images, UI libraries, or runtime dependencies; the page remains lightweight and fast.

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
