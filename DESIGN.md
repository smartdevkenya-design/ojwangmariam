# Ojwang Mariam — Campaign Site Style Reference

A navy/red/white campaign system: deep navy canvas and panels (#0a1e3f),
crimson red for actions and accents (#c8102e), and white/off-white content
sections. PP Neue Montreal carries the type at weights 400–600.

## Colors

| Name | Value | Role |
|------|-------|------|
| Navy | `#0a1e3f` | Nav bar, panels, manifesto cards |
| Navy Deep | `#061529` | Hero background, footer sections |
| Navy Light | `#13284f` | Borders/dividers on navy surfaces |
| Crimson | `#c8102e` | Primary action color — buttons, tags, accents |
| Crimson Dark | `#a30d25` | Hover state for crimson elements |
| White | `#ffffff` | Card surfaces, primary content background |
| Off-White | `#f7f7f5` | Secondary section background |
| Ink | `#1a1a1a` | Body text on light surfaces |
| Muted | `#667085` | Secondary/helper text on light surfaces |
| Hairline | `#e5e2dc` | Borders on white/off-white surfaces |

## Layout

- Sticky navy nav bar with uppercase links and a crimson "Contribute" CTA
- Hero: navy gradient background, headline + subtext + inline signup form
- Red CTA ribbon (Volunteer / Donate / Order the Book)
- White "Campaign Highlights" card grid (3-up)
- Navy "Manifesto" panel — image block + icon list
- Content sections (About, Book, Manifesto detail, Media, Contact) alternate
  white and off-white backgrounds
- Contact/footer sections sit on navy-deep

## Typeface

PP Neue Montreal — same type scale as before (12–81px), weights 400–600.

## Site Architecture (Multi-Page)

As of this update, the site uses real routing (react-router-dom) instead of
a single scrolling page:

- `/` — Home (hero, CTA ribbon, highlights, manifesto teaser)
- `/about` — Biography
- `/book` — Believe Become
- `/manifesto` — Full manifesto detail
- `/media` — Media & achievements
- `/gallery` — Photo gallery
- `/contact` — Contact & donations
- `/stories/:id` — Individual full-story pages (book-launch, manifesto, media-impact)

`src/components/Layout.tsx` holds the shared Nav + Footer, rendered around
every page via React Router's `<Outlet />`. `src/data/stories.ts` is the
single source of truth for highlight/story content, shared by the Home
page, the Footer's "Latest Highlights" list, and the individual story pages.

**GitHub Pages routing note:** GitHub Pages has no server-side rewrites, so
direct navigation to a sub-page (e.g. reloading `/ojwangmariam/about/`)
would normally 404. `public/404.html` + a small decoder script in
`index.html` work around this (the well-known rafgraph/spa-github-pages
technique) by redirecting unknown paths back to `index.html` with the real
path encoded in the query string, then restoring it before React mounts.
