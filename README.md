# VibeSyncro Technologies Pvt Ltd — Official Website

Static, responsive multi-page website for VibeSyncro Technologies Pvt Ltd. Built with semantic HTML, Tailwind CSS via CDN, Font Awesome and vanilla JavaScript; no npm or build pipeline is required.

## Design system

Modern Corporate Tech, light-mode default:
- Primary red: `#C8102E`; brand navy: `#0A2540`
- White background: `#FFFFFF`; alternating section background: `#F8FAFC`
- Body text: `#1E293B`; muted text: `#64748B`
- Inter typography, white cards, subtle borders and shadows
- White sticky navbar and brand-navy footer

## Pages and shared structure

- `index.html` — Home, split hero, trust strip, published apps, company preview, SafeMobile update form and privacy approach
- `about.html` — Company story, four-photo grid and Bhumenahalli map
- `products.html` — Three Google Play app cards, Play Badge fallback and screenshot placeholders
- `safemobile.html` — SafeMobile research initiative, clearly labelled In Development
- `research.html` — AI, privacy and security research direction
- `contact.html` — Contact details and contact form
- `privacy.html` and `terms.html` — Legal pages
- `404.html` — Custom not-found page
- `partials/` — Retired; header and footer are now hardcoded into each HTML page
- `css/theme.css` — Shared light theme and accessibility/motion styles
- `js/site.js`, `js/i18n.js`, `locales/` — Mobile navigation, contact/Notify-Me form handling, SafeMobile interactions, locale selector and five current UI dictionaries

## Performance

The site serves precompiled Tailwind utilities from `css/tailwind.generated.css`; do not restore the browser-side Tailwind CDN compiler. The `.github/workflows/tailwind-build.yml` workflow rebuilds this stylesheet when root HTML, shared JavaScript, the Tailwind config or input stylesheet changes, commits the result, and requests a GitHub Pages rebuild. The same build can be run locally with:

```sh
npx --yes tailwindcss@3.4.17 --config tailwind.config.js --input css/tailwind.input.css --output css/tailwind.generated.css --minify
```

The shared stylesheet and Font Awesome are loaded asynchronously. The large non-Latin font bundle is fetched only when a visitor selects a language that needs it. Below-the-fold images lazy-load, and the homepage hero image uses responsive source sizes. On touch/small-screen devices, decorative particle canvases render a smaller static field instead of running a continuous animation.

## Image assets

The website uses the root-level `logo.png` as its only local display image. Hero and team photography is loaded from remote Unsplash image URLs, and the app previews are CSS-only phone mockups. No missing local office-photo or app-screenshot files are referenced.\n\n## Forms

Contact and Notify-Me forms retain Formspree integration. Replace `REPLACE_WITH_FORM_ID` with the real Formspree ID before launch. Until configured, the shared script validates inputs and opens a prepared mailto message to `admin@vibesyncro.com`; the visitor must send it from their email client. Verify the mailbox exists before launch.

## Localization

English, Hindi, Telugu, Tamil and Kannada UI dictionaries are currently shipped. The selector translates shared navigation and the skip link; page-body translations are not complete. Do not advertise full-site or 52-language coverage until reviewed translations are added.

## Navigation and page shell\n\nThe complete header and footer markup is included directly in all eight HTML pages. Each page references `logo.png` from the repository root in both locations; no JavaScript include is required to render the logo. `js/site.js` only handles the responsive hamburger menu, current-page state, form fallbacks and SafeMobile capability interactions.\n\n## Website visitor statistics

The eight public content pages display two Hits.sh SVG badges in the footer: a shared site-wide hit counter and a separate page-view counter for each page. Each badge links to its public statistics page. This integration uses image requests rather than client-side API calls, so it does not need a custom JavaScript counter client or CORS/JSONP support. These are hit/page-view counts, not verified unique visitors; browser caching, extensions, automated traffic and service availability can affect totals. The counters start fresh with this provider and do not automatically import the former CounterAPI totals. See the Privacy Policy for the provider's data-handling disclosure.

## GitHub Pages deployment

Use repository **Settings → Pages → Deploy from a branch → main → /(root)** and verify deployment after GitHub reports a successful Pages build. The code change itself does not verify Pages settings or live deployment.

## Custom domain

When the final domain is ready, configure it in **Settings → Pages → Custom domain**, add the DNS records provided by GitHub, wait for DNS verification and enable HTTPS. Update canonical, sitemap and social preview URLs after changing domains.

## Public product scope

Only the three public Google Play apps supplied by the company and SafeMobile (In Development) are shown. Private ongoing project directories are intentionally excluded.
