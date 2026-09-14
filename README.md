# EUROING website update

This package contains the existing static website updated in Macedonian and English. Upload the contents of this folder to the website's document root, retaining the `en`, `css`, `js`, image and favicon folders and the `.htaccess` files. No Node.js build is needed.

## What changed

- Contact pages now use a styled email card and native `mailto:contact@euroing.com.mk` links in Macedonian and English. The address stays visible for copying, and a short note explains that the button opens the visitor's email app. The map includes a location header and a direct Google Maps link. There are no contact form fields or submission requests.
- Updated the existing `css/site.css` and removed the unused form submission code from `js/site.js`. Both assets use version `2.2.4` to avoid stale cached styles/scripts. The former `contact.php` endpoint only redirects to the contact page and does not send email.
- Corrected four existing accessibility labels on the infrastructure pages: their referenced headings were commented out in the supplied ZIP. The sections now have direct labels using those same titles.
- Replaced the incorrect 1998 founding year with 1991, as stated in both supplied company documents. Used "Since 1991" instead of a changing years-of-experience total.
- Updated the home and about pages with the company's history, mission, vision, construction sectors, team development and international partnerships.
- Replaced unsupported homepage project/client totals with source-backed facts: foundation in 1991, the 30 MW PVE EUROING wind farm, the 70 km Southern Vardar Valley pipeline and four construction sectors.
- Added EuroHome's Negorci location and designed capacity of 56 residents. The wording does not claim that the facility is already operating.
- Presented existing certificate scans as an archive. Removed separate issue-year labels; the supplied documents do not establish current certificate validity.
- Added verified archive photos to the sewerage and wastewater-treatment galleries. Buchim Mine and dams remain compact text-only listings until project photos are supplied.
- Added matching English versions of all site pages, including the error page. Header language links work without JavaScript and keep visitors on the corresponding page. Navigation within a language stays in that language.
- Translated page metadata, accessible labels and gallery descriptions. Original text embedded in supplied images is unchanged.
- Added a 48 x 48 px back-to-top control, keyboard focus styling, mobile-menu focus handling, slideshow pause controls and reduced-motion support.
- Allowed heroes to grow with translated or enlarged text; retained the existing brand palette and assets.
- Removed internal drafting notes from the apartment page. Fixed the apartment section anchor and missing favicon references.
- Updated the sitemap and language alternate links.

## Source limits

The four existing apartment catalogue PDFs are retained under `documents/stambeni/` and linked from the residential page. Unverified apartment counts, floor areas and floor-count specifications have been removed from the sales copy. Existing project and catalogue year labels (2013, 2019, 2020, 2024 and 2025) are retained from the supplied website; the biography does not independently confirm their exact dates. Current availability, prices, the fifth building's construction status and EuroHome's operating status have not been invented.

## Verification completed

All 20 pages passed local checks for links and fragments, referenced assets, unique IDs, ARIA references, JavaScript syntax, JSON and sitemap XML. The project pages contain verified archive-backed galleries for infrastructure and hydraulic works; no broken local asset references remain.

For this contact update, checked all 1,258 local HTML references, removed-form references, preserved email recipients, the new SVG accessible labels, CSS delimiters and JavaScript syntax. New contact-section text colors have calculated contrast ratios of at least 6.44:1 against their base backgrounds. The native email link uses no JavaScript and makes no website form submission request.

## Before public launch

Visual browser and interaction testing could not run in this environment because a browser was unavailable and its download timed out. Check both languages on desktop and mobile, including narrow screens, 200% zoom, the menu, language links, galleries and back-to-top control. This package is not a certification of WCAG conformance.

Contact links open the visitor's configured email app. No PHP mail configuration or server-side sending service is needed for the contact pages. The compatibility redirect in `contact.php` is only for old URLs or cached pages; upload this replacement too when updating an existing deployment. Opening a `mailto:` link prepares a message; the visitor sends it from their email app.

The domain, contact details and business hours are preserved from the supplied website. Apache `.htaccess` settings are included; on other servers, configure equivalent PHP handling and error pages. Back up the live site before replacing it.
