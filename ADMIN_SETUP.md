# Admin Setup Guide

The admin dashboard needs a Supabase project to store content, signups, and
messages, plus a login. Follow these steps once.

## 1. Create a Supabase project

Go to https://supabase.com, create a new project (free tier is fine). This
should be a **new, separate project** from your SmartDev ERP one — this is
a different app.

## 2. Run the schema

In your new project: **SQL Editor → New query**. Run these two files
**in order**, each as its own query:

1. `supabase/schema.sql` — creates:
   - `site_content` — one editable row holding the bio, book, manifesto,
     and gallery content, pre-seeded with the current real content
   - `signups` — from the homepage "Join Now" form
   - `messages` — from the Contact page form
2. `supabase/migration_02_full_cms.sql` — adds:
   - `hero` and `media` sections to `site_content`, plus extra fields
     (headings/eyebrows/images) on the existing sections
   - a `stories` table (the campaign highlight cards) so you can add,
     edit, and delete stories from the admin panel instead of them being
     hardcoded
   - a public `site-images` storage bucket so the admin panel's image
     uploader has somewhere to put photos

All tables have Row Level Security enabled: the public can read site
content and submit signups/messages, but only a logged-in admin can view
signups/messages, edit site content, manage stories, or upload images.

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

In the `ojwangmariam` repo: **Settings → Secrets and variables → Actions →
New repository secret**. Add two secrets:

- `VITE_SUPABASE_URL` → your Project URL
- `VITE_SUPABASE_ANON_KEY` → your anon public key

The deploy workflow already reads these and bakes them into the build.

## 6. Push and deploy

Push this update to `main` as usual. Once the workflow finishes, go to
`https://smartdevkenya-design.github.io/ojwangmariam/admin/login` and sign
in with the account from step 3.

## Local development

Copy `.env.example` to `.env` and fill in the same two values, then
`npm run dev`. `.env` is gitignored — never commit real keys.

## What the admin dashboard can do

The dashboard is organized by page, matching the live site — pick a page,
edit it, hit Save.

- **Home** — hero eyebrow, headline, subhead, and background image.
- **About** — page heading, intro, photo, and the four biography cards
  (add/remove cards freely).
- **Book** — cover image, title, subtitle, pricing, description, launch
  details.
- **Manifesto** — heading, slogan, and the pillars (add/remove freely).
- **Media** — page heading and each media/impact item, each with its own
  photo (add/remove items freely).
- **Gallery** — upload photos with captions directly (add/remove freely).
- **Stories** — the campaign highlight cards on the home page. Each story
  has its own image, tag, title, summary, full body paragraphs
  (add/remove paragraphs), and button. Add new stories or delete old ones
  — each saves independently with its own Save/Delete buttons.
- **Signups** — view everyone who submitted the homepage "Join Now" form.
- **Messages** — view everything submitted through the Contact page form.

**Images** are uploaded directly from your device — no need to host them
elsewhere first. They're stored in the `site-images` bucket in your
Supabase project and served publicly from there.

Note: donations/contributions are still handled manually via the M-Pesa
Paybill shown on the Contact page — this build doesn't process real
payments automatically, since that needs a payment gateway integration
(e.g. Daraja API), which is a separate project if you want it.
