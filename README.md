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

- A concise five-part product story: what Looop does, who it is for, the value it provides, why it is different, and what the visitor should do next.
- A bright white and cobalt-blue interface with direct language, glossy product surfaces, generous spacing, and clear calls to action.
- The three-circle Looop identity from the official social profile, paired with an original cool-blue landscape and a responsive verification workbench.
- An original Looop visual system built around test states and the generate → verify → repair cycle, inspired by the clarity and product framing of modern macOS landing pages.
- Product UI is drawn natively in HTML, CSS, and inline SVG; the only brand asset is the supplied Looop mark, and the landscape artwork is original.
- No external fonts, image pipeline, CMS, UI libraries, or runtime dependencies; the page remains lightweight and fast on GitHub Pages.
- Motion is limited to progressive reveals and the verification demo, while `prefers-reduced-motion` receives a complete static experience.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Semantic landing-page structure and product content |
| `styles.css` | Responsive design system, layout, and motion |
| `app.js` | Compact verification demo, navigation, reveals, and clipboard actions |
| `assets/` | Looop logo and optimized original hero artwork |
| `scripts/check.mjs` | Dependency-free structural checks |
| `scripts/build.mjs` | Static production build |
| `scripts/serve.mjs` | Local development server |

## Product truth

The site deliberately preserves the current product-state disclosures from the supplied brief: the core engine and oracle are tested, while auth, billing, quotas, abuse protection, project management, and the full production deployment path remain on the roadmap.
