# VibeSyncro Technologies Pvt Ltd — Official Website

A multi-page corporate website built with semantic HTML5, Tailwind CSS through its CDN, Font Awesome and vanilla JavaScript. It is static and deploys to GitHub Pages without npm, a bundler or a build step.

## Pages

- `index.html` — Home, company overview and SafeMobile beta interest
- `about.html` — Company profile, values, facts and embedded map
- `products.html` — Three published Android apps and SafeMobile showcase
- `research.html` — AI, privacy and security research direction
- `contact.html` — Company details, map and Formspree/email contact form
- `privacy.html` — General company privacy policy and app-specific policy links
- `terms.html` — Terms of service
- `404.html` — Custom GitHub Pages not-found page
- `robots.txt` and `sitemap.xml` — Search engine crawl guidance

## Publish with GitHub Pages

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then save.
4. Wait for the Pages workflow to finish and test the published URL: https://vibesyncrotechnologies.github.io/Website/

## Asset upload checklist

- Upload `logo.png` (square, 256×256 recommended) and `og-banner.png` (1200×630) to the repo root before linking from Play Store.
- Upload `play-badge.png` (Google's official asset, download from https://play.google.com/intl/en_us/badges/) to the repo root. The current website uses accessible styled Google Play badges so it works before this optional image is added.
- Upload `app-shot-1.png`, `app-shot-2.png` and `app-shot-3.png` if you want to replace the screenshot placeholder panels on Products & Apps with real app screenshots.
- The supplied `logo.png` is already present in the repository root. Replace it only with the approved square brand artwork if a new export is needed.
- `og-banner.png` is referenced by Open Graph and Twitter metadata but is not included. Add your approved 1200×630 social sharing artwork to make social preview images resolve.

## Configure the forms

The Contact and SafeMobile Notify Me forms use a Formspree placeholder endpoint. To enable direct website submissions:

1. Create a Formspree form and copy its endpoint ID.
2. Replace every occurrence of `REPLACE_WITH_FORM_ID` in `contact.html`, `index.html`, `products.html` and `research.html` with that ID.
3. Test each form with an address you control and confirm that Formspree receives it.

Until the endpoint is configured, JavaScript opens a pre-filled email to `hello@vibesyncro.com`. This requires a mail application to be configured on the visitor's device. You can also use the direct mail link shown on the Contact page.

## Privacy and Google Play

The published app descriptions and Data safety declarations must match each app's actual permissions, SDKs, advertising integrations, collection, sharing, retention and deletion practices. Review the general company policy and prepare the linked app-specific policies before submitting or updating Google Play listings. The website currently lists Google AdMob as an advertising partner where enabled, based on the supplied app advertising disclosure.

## Future custom domain

When a domain is selected, set it under **Settings → Pages → Custom domain** and configure the DNS records GitHub Pages provides. For a typical apex domain this includes GitHub Pages A records; a `www` subdomain generally uses a CNAME pointing to the GitHub Pages hostname. Add the resulting `CNAME` file to the repository root, wait for DNS verification, then enable **Enforce HTTPS**. Update canonical URLs, Open Graph URLs, the sitemap and the Organization schema to the new domain.

## Public portfolio boundary

Only the three public Google Play apps supplied for this website and the SafeMobile initiative, clearly labelled **In Development**, are presented publicly. Private ongoing project directories are intentionally excluded from this repository and website.
