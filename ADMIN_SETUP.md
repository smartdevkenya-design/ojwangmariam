# Admin Setup Guide

The admin dashboard needs a Supabase project to store content and images,
plus a login. Follow these steps once.

## 1. Create (or reuse) a Supabase project

Go to https://supabase.com and create a project (free tier is fine), or
use the one you already created for this site — this should be a
**separate project from your SmartDev ERP one**.

## 2. Run the schema

In your project: **SQL Editor → New query**, paste in the full contents
of `supabase/schema.sql`, and run it. It's a single file and safe to
re-run. It creates:

- `site_settings` — one row holding the logo, nav menu, contact details,
  footer, and M-Pesa info
- `page_content` — one row per built-in page (home, about, book,
  manifesto, media, gallery, volunteer, contact), pre-seeded with the
  current live content
- `stories` — the campaign highlight cards (add/edit/delete from admin)
- `gallery_images` — the Gallery page photos
- `custom_pages` — any extra pages you create from the admin panel
- a public `media` storage bucket for the admin panel's image uploader

All tables have Row Level Security enabled: the public can read
everything above, but only a logged-in admin can edit it.

If you'd previously run the old `schema.sql` / `migration_02_full_cms.sql`
files, this script also removes the `site_content`, `signups`, and
`messages` tables and the `site-images` bucket they created — none of
that is used by the current code, and it was the reason edits weren't
sticking (the admin panel and the live site were reading from tables
that didn't match what those older files created).

## 3. Create your admin login

In Supabase: **Authentication → Users → Add user → Create new user**.
Set your own email and a password. This is the only account that should
exist — there's no public sign-up form, so this is the sole way in.

## 4. Get your API keys

**Settings → API** in Supabase. You need:
- **Project URL**
- **anon public** key (safe to expose in frontend code — RLS policies are
  what actually protect the data, not keeping this key secret)

## 5. Add them to GitHub

In the repo: **Settings → Secrets and variables → Actions → New
repository secret**. Add two secrets:

- `VITE_SUPABASE_URL` → your Project URL
- `VITE_SUPABASE_ANON_KEY` → your anon public key

The deploy workflow reads these and bakes them into the build. **This is
the step that most often gets missed** — without it, the production
build has no way to talk to Supabase at all, so it silently falls back
to the built-in default content on every visit, no matter what you've
saved in the admin panel.

## 6. Push and deploy

Push this update to `main` as usual. Once the workflow finishes, go to
`https://<your-site>/admin/login` and sign in with the account from
step 3.

## How content actually gets from admin → live site

There's no separate "publish" step. When you hit Save in the admin
panel, it writes straight to Supabase. The live site reads straight
from Supabase every time a page loads. So:

- **Content edits** (text, images, stories, gallery, settings, colors) —
  show up on refresh, immediately. No rebuild needed.
- **Code changes** (anything in `src/`) — only go live after you push to
  `main` and the GitHub Actions workflow finishes (~1-2 minutes).

If a content edit isn't showing up after a refresh, it means either (a)
the save itself failed silently — check the browser console for a
Supabase error, or (b) the deployed build still isn't configured with
the secrets from step 5.

## Local development

Copy `.env.example` to `.env` and fill in the same two values, then
`npm run dev`. `.env` is gitignored — never commit real keys.

## What the admin dashboard can do

The dashboard is organized by page, matching the live site — pick a
page, edit it, hit Save.

- **Site Settings & Logo** — logo, nav menu, contact details, footer,
  M-Pesa info.
- **Colors & Theme** — site-wide brand colors, applied instantly.
- **Home / About / Book / Manifesto / Media / Gallery / Volunteer /
  Contact** — each page's text and images.
- **Stories / News** — the campaign highlight cards on the home page.
  Each has its own image, tag, title, summary, full body paragraphs
  (add/remove freely), and button. Add new stories or delete old ones.
- **Gallery Photos** — upload photos with captions directly
  (add/remove freely).
- **Extra / Custom Pages** — create brand-new pages beyond the built-in
  ones, made of heading/text/image/button blocks, live at
  `yoursite.com/your-slug`.

**Images** are uploaded directly from your device — no need to host them
elsewhere first. They're stored in the `media` bucket in your Supabase
project and served publicly from there.

Note: donations/contributions are still handled manually via the M-Pesa
Paybill shown on the Contact page — this build doesn't process real
payments automatically, since that needs a payment gateway integration
(e.g. Daraja API), which is a separate project if you want it. Likewise,
the "Join Now" and Contact forms open an email draft (`mailto:`) rather
than saving to a database — there's no signups/messages list in admin
because nothing currently writes to one.
