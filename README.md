# VibeSyncro Technologies Pvt Ltd — Official Website

Static multi-page company website using semantic HTML5, Tailwind CSS via CDN, Font Awesome and vanilla JavaScript. No npm, bundler or build step is required.

## Shared layout architecture

This project uses **Option A: shared HTML partials**. Every page mounts `#site-header` and `#site-footer`; `js/include.js` loads `partials/header.html` and `partials/footer.html` at runtime. GitHub Pages serves these same-origin files as static HTML. Shared JavaScript initialises the mobile menu, forms, reduced-motion-aware animation, homepage particle field, Privacy Journey, product quiz and SafeMobile capability diagram.

## Pages and support files

- `index.html` — Home, particle hero, product links, Privacy Journey and beta interest form
- `about.html` — Company profile, values, facts and embedded location map
- `products.html` — Published Android apps, screenshots, official-badge slot and app quiz
- `safemobile.html` — SafeMobile research concept, interactive capability diagram, roadmap, beta interest and FAQ
- `research.html` — AI, privacy and security research direction
- `contact.html` — Company details, map and contact form
- `privacy.html` — Company privacy policy and future app-specific policy slots
- `terms.html` — Terms of service
- `404.html` — Custom GitHub Pages not-found page
- `partials/` — Shared header and footer
- `js/include.js` — Shared layout, page interactions and form fallback
- `js/i18n.js`, `locales/` — JSON locale loader and current UI translations
- `robots.txt`, `sitemap.xml` — Search-engine crawler configuration

## REQUIRED ASSETS — UPLOAD BEFORE LAUNCH

| File | Dimensions | Purpose | Where it is referenced |
|---|---|---|---|
| `logo.png` | ≥256×256, square, transparent background | Header logo, favicon, JSON-LD logo, brand mark | Shared header/footer partials; every HTML page favicon; homepage hero |
| `og-banner.png` | 1200×630 | Social share preview (WhatsApp, LinkedIn, Twitter) | `og:image` and `twitter:image` on every page |
| `play-badge-en.png` | Official Google Play badge, ≥28px tall in render | Download CTA on app cards and homepage | `products.html`, `index.html` |
| `app-pdf-shot.png` | 1080×1920 (9:16 portrait), JPEG or 24-bit PNG | VibeSync PDF Suite preview | `products.html` card overlay |
| `app-devoptions-shot.png` | 1080×1920 | Developer Options Shortcut preview | `products.html` card overlay |
| `app-kids-shot.png` | 1080×1920 | Kids Drawing preview | `products.html` card overlay |

The repository already contains the current `logo.png`; retain or replace it with the approved square high-resolution export if needed. Missing badge and screenshot images use styled fallbacks. Upload the remaining assets above before the final public launch. `og-banner.png` is referenced by social metadata and must be uploaded for share previews to render.

Official Google Play badge: download from https://play.google.com/intl/en_us/badges/ and save as `play-badge-en.png` in the repository root. App screenshots: download directly from each Play Console listing (Store presence → Main store listing → Graphics). Do not use screenshots from private project folders.

## Configure forms

Contact and SafeMobile beta forms use the Formspree placeholder endpoint `REPLACE_WITH_FORM_ID`. Create a form at https://formspree.io/ and replace every placeholder in `contact.html`, `index.html`, `products.html` and `safemobile.html` with the actual endpoint ID. Until that is done, JavaScript validates the form and opens a prepared email to `hello@vibesyncro.com`; the visitor must send it from their email app. Confirm that this mailbox exists before launch.

## Multilingual interface

The JSON locale loader and language selector are in `js/i18n.js`. Five locale files are currently supplied: English, Hindi, Telugu, Tamil and Kannada. At this stage, the translated strings cover shared navigation and the skip link; the page body content remains English. The requested 52-language target is not yet complete: the other locale files and reviewed translations must be added before claiming 52-language support. The existing loader is designed to be extended with additional JSON dictionaries.

## Deploy with GitHub Pages

1. Open repository **Settings → Pages**.
2. Under Build and deployment, select **Deploy from a branch**.
3. Choose branch `main` and folder `/(root)`, then save.
4. Wait for GitHub Pages to finish deploying.
5. Verify https://vibesyncrotechnologies.github.io/Website/ and test the pages, forms and mobile navigation at 320px.

The repository connector does not expose the GitHub Pages settings API, so activation and live deployment status must be confirmed in the repository Settings page.

## Future custom domain

Set the domain under **Settings → Pages → Custom domain**, configure the DNS records shown by GitHub (apex A records and a `www` CNAME when applicable), add the generated `CNAME` file to the repository root, wait for DNS verification and enable **Enforce HTTPS**. Update canonical URLs, sitemap entries, Open Graph URLs and Organization schema after the domain switch.

## Public portfolio boundary

Only the three supplied public Google Play apps and SafeMobile, clearly labelled **In Development**, are presented. Ongoing private project directories are intentionally excluded from the repository.
