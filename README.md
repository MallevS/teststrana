# EUROING website update

This package contains the existing static website updated in Macedonian and English. Upload the contents of this folder to the website's document root, retaining the `en`, `css`, `js`, image and favicon folders and the `.htaccess` files. No Node.js build is needed.

## What changed

- Replaced the incorrect 1998 founding year with 1991, as stated in both supplied company documents. Used "Since 1991" instead of a changing years-of-experience total.
- Updated the home and about pages with the company's history, mission, vision, construction sectors, team development and international partnerships.
- Replaced unsupported homepage project/client totals with source-backed facts: foundation in 1991, the 30 MW PVE EUROING wind farm, the approximately 80 km South Vardar Valley irrigation pipeline and four construction sectors.
- Added EuroHome's Negorci location and designed capacity of 56 residents. The wording does not claim that the facility is already operating.
- Presented existing certificate scans as an archive. Removed separate issue-year labels; the supplied documents do not establish current certificate validity.
- Removed empty galleries and coming-soon placeholders from sewerage systems, Buchim Mine and dams, retaining descriptions in compact text sections.
- Added matching English versions of all nine HTML pages, including the error page. Header language links work without JavaScript and keep visitors on the corresponding page. Navigation within a language stays in that language.
- Translated page metadata, accessible labels, gallery descriptions and contact responses. Original text embedded in supplied images is unchanged.
- Added a 48 x 48 px back-to-top control, keyboard focus styling, mobile-menu focus handling, slideshow pause controls and reduced-motion support.
- Allowed heroes to grow with translated or enlarged text; retained the existing brand palette and assets.
- Removed internal drafting notes from the apartment page. Fixed the apartment section anchor and missing favicon references.
- Updated the sitemap and language alternate links.

## Missing source files and factual limits

The uploaded ZIP does not contain the four apartment catalogue PDFs. Broken PDF buttons now lead to the contact form to request a catalogue. Unverified apartment counts, floor areas and floor-count specifications have been removed from the sales copy. Existing project and catalogue year labels (2013, 2019, 2020, 2024 and 2025) are retained from the supplied website; the biography does not independently confirm their exact dates.

The missing catalogue paths were:

- `documents/stambeni/euroing-katalog-stanovi-2020.pdf`
- `documents/stambeni/euroing-katalog-2019.pdf`
- `documents/stambeni/euroing-katalog-stanovi-52.pdf`
- `documents/stambeni/euroing-katalog-zgrada-4.pdf`

Restore download links only after supplying and checking the actual PDFs. Current availability, prices, the fifth building's construction status and EuroHome's operating status have not been invented.

## Verification completed

All 18 pages returned HTTP 200 on a local static server. Checks passed for local links and fragments, referenced assets, unique IDs, primary headings, ARIA references, English text coverage, the three removed galleries, JavaScript syntax, JSON and sitemap XML. No failures remained in these checks.

## Before public launch

Visual browser and interaction testing could not run in this environment because a browser was unavailable and its download timed out. Check both languages on desktop and mobile, including narrow screens, 200% zoom, the menu, language links, galleries and back-to-top control. This package is not a certification of WCAG conformance.

The contact handler requires PHP 8.1 or newer and working server-side email delivery through PHP `mail()`. PHP execution and actual email delivery were not tested here. On the hosting server, verify receipt at `contact@euroing.com.mk` in both languages. The sender is `no-reply@euroing.com.mk`; configure it with the hosting provider as needed. The form reports failure unless the server explicitly confirms success.

The domain, contact details and business hours are preserved from the supplied website. Apache `.htaccess` settings are included; on other servers, configure equivalent PHP handling and error pages. Back up the live site before replacing it.
