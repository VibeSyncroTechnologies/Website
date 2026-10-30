# VibeSyncro Technologies Pvt Ltd — Company Website

A static, multi-page company website built with HTML5, Tailwind CSS (CDN), Font Awesome and vanilla JavaScript. There is no npm install, bundler or build step.

## Deploy with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/ (root)**, then save.
4. GitHub Pages will publish the site at `https://vibesyncrotechnologies.github.io/Website/` after deployment completes.
5. Keep `logo.png` in the repository root. It is the supplied VibeSyncro brand mark used by the shared header and footer.

## Files

- `index.html` — Home
- `about.html` — Company and location
- `products.html` — Public Android apps and SafeMobile status
- `research.html` — AI, privacy and security R&D
- `contact.html` — Company location and front-end contact form demo
- `privacy.html` — General company privacy policy
- `terms.html` — Terms of service
- `404.html` — GitHub Pages not-found page
- `robots.txt` and `sitemap.xml` — Search indexing

## Before launch

- Connect the contact form to Formspree, Google Forms or another backend. It currently validates in the browser only and does not deliver messages.
- Review the privacy policy against the actual SDKs, permissions, advertising and data practices for each Play Store app before submitting it as an app-specific privacy policy.
- Update the sitemap URLs if the GitHub Pages repository URL changes or a custom domain is connected.

## Future custom domain

When a domain is selected, configure it in **Settings → Pages → Custom domain**. Add the DNS records GitHub specifies (typically the four GitHub Pages A records for the apex domain and a CNAME for `www`), add the resulting `CNAME` file at the repository root, allow DNS to propagate, then enable **Enforce HTTPS** when available. Revisit canonical URLs and `sitemap.xml` after the domain change.

## Public portfolio boundary

Only the three published Android apps supplied for this website and the SafeMobile initiative (clearly labelled **In Development**) are presented publicly. No private project directories are part of this website repository.
