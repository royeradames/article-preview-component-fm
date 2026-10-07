# Article preview

An implementation of the [Frontend Mentor article preview component challenge](https://www.frontendmentor.io/challenges/article-preview-component-dYBN_pYFT), using its supplied photo, avatar, icons, copy and design references.

The share button opens the share menu: a popover above the button from 768px up, and a bar over the author row on phones, as in the active-state designs. Facebook, Twitter and Pinterest links open each network's own share page for the current URL in a new tab. Nothing is posted or stored by this page.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests use installed Chrome and own port 4526.

Next 16.3.6, React 19.2.8, TypeScript 5.9.3 and Tailwind 4.2.1 are pinned to the family baseline. The page is a server component; only the share menu is a client component.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. Geometry, colours and type come from the decoded Figma frames (Desktop, Tablet and Mobile, plus their Active variants). Manrope 500/700 is self-hosted at build time through `next/font/google`.

## Design decisions

- The design sets body copy, author, date and the "SHARE" label at 13px. The family 16px floor raises them; the card grows taller than the 280px desktop frame instead of cropping text.
- The share control is a disclosure button (`aria-expanded`, `aria-controls`). Escape closes it and returns focus, clicking outside or tabbing past the last network closes it.
- Between 768 and 1023px the popover is right-aligned to the button so the larger 16px label never pushes it past the viewport; at 1024px and up it is centred over the button like the design.
- The share icon is drawn with a CSS mask of the supplied SVG so it can turn white on hover and while open.
- Search identity: the site name "Article preview" appears in the footer, `og:site_name` and the `WebSite` JSON-LD. The canonical URL is the planned production domain `article-preview-component-fm.royeradames.com`.
