# VibeSyncro Technologies Pvt Ltd — Official Website

Static multi-page company website using semantic HTML5, Tailwind CSS CDN, Font Awesome and vanilla JavaScript. No npm, bundler or build step is required.

## Shared layout architecture

This project uses **Option A: shared HTML partials**. Every page provides `#site-header` and `#site-footer` mount points; `js/include.js` fetches `partials/header.html` and `partials/footer.html` at runtime. GitHub Pages serves these same-origin static files normally. The mobile menu, forms, motion, particle hero, Privacy Journey, product quiz and SafeMobile capability diagram are initialised by the shared script.

## REQUIRED ASSETS — UPLOAD BEFORE LAUNCH

| File | Dimensions | Purpose | Where it is referenced |
|---|---|---|---|
| `logo.png` | ≥256×256, square, transparent background | Header logo, favicon, JSON-LD logo, brand mark | Shared header/footer partials; every HTML page favicon; homepage hero |
| `og-banner.png` | 1200×630 | Social share preview (WhatsApp, LinkedIn, Twitter) | `og:image` and `twitter:image` on every page |
| `play-badge-en.png` | Official Google Play badge, ≥28px tall in render | Download CTA on app cards and homepage | `products.html`, `index.html` |
| `app-pdf-shot.png` | 1080×1920 (9:16 portrait), JPEG or 24-bit PNG | VibeSync PDF Suite preview | `products.html` card overlay |
| `app-devoptions-shot.png` | 1080×1920 | Developer Options Shortcut preview | `products.html` card overlay |
| `app-kids-shot.png` | 1080×1920 | Kids Drawing preview | `products.html` card overlay |

Official Google Play badge: download from https://play.google.com/intl/en_us/badges/ and save as `play-badge-en.png` in the repository root. App screenshots: download directly from each Play Console listing (Store presence → Main store listing → Graphics). Do not use screenshots from private project folders.

The existing `logo.png` is retained in the repository. Missing badge and screenshot images have styled fallbacks so the layout remains usable before those assets are uploaded. Add an approved `og-banner.png` for social previews; it is referenced but not fabricated here.

## Configure forms

Contact and SafeMobile beta forms use the Formspree endpoint placeholder `REPLACE_WITH_FORM_ID`. Create a form at https://formspree.io/ and replace the placeholder in `contact.html`, `index.html`, `products.html` and `safemobile.html`. Until configured, JavaScript validates the form and opens a prepared email to `hello@vibesyncro.com`. The visitor must send that email from their mail app.

## Multilingual interface

The JSON-driven language selector and i18n loader are in `js/i18n.js`; locale files currently supplied are English, Hindi, Telugu, Tamil and Kannada in `locales/`. The architecture is extensible, but the other languages from the requested 52-language target are not yet translated or shipped. Do not advertise 52-language coverage until those translations have been reviewed and added.

## Deploy with GitHub Pages

1. Repository **Settings → Pages**.
2. Select **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then save.
4. Wait for the Pages deployment to complete.
5. Test https://vibesyncrotechnologies.github.io/Website/ and verify mobile navigation at 320px.

## Future custom domain

Set the domain under **Settings → Pages → Custom domain**, configure the DNS records shown by GitHub (apex A records and a `www` CNAME when applicable), commit the generated `CNAME` file, wait for DNS verification and enable **Enforce HTTPS**. Update canonical URLs, sitemap entries, Open Graph metadata and Organization schema after switching domains.

## Public portfolio boundary

Only the three supplied public Google Play apps and SafeMobile, clearly labelled **In Development**, are shown. Ongoing private project directories are intentionally excluded from this repository.
