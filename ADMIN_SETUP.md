# Admin Setup Guide

The admin dashboard needs a Supabase project to store content, signups, and
messages, plus a login. Follow these steps once.

## 1. Create a Supabase project

Go to https://supabase.com, create a new project (free tier is fine). This
should be a **new, separate project** from your SmartDev ERP one — this is
a different app.

## 2. Run the schema

In your new project: **SQL Editor → New query**, paste the entire contents
of `supabase/schema.sql` from this repo, and run it. This creates:

- `site_content` — one editable row holding the bio, book, manifesto, and
  gallery content, pre-seeded with the current real content
- `signups` — from the homepage "Join Now" form
- `messages` — from the Contact page form

All three have Row Level Security enabled: the public can read site
content and submit signups/messages, but only a logged-in admin can view
signups/messages or edit site content.

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

- **Site Content** — edit the biography intro/cards, book details and
  pricing, and manifesto slogan/pillars. Changes save to Supabase and the
  public pages (`/about`, `/book`, `/manifesto`) reflect them immediately
  on next load.
- **Gallery** — add/remove photos by pasting image URLs (e.g. from
  Cloudinary, Imgur, or any hosted image) with captions. Leave a URL blank
  to keep the placeholder box.
- **Signups** — view everyone who submitted the homepage "Join Now" form.
- **Messages** — view everything submitted through the Contact page form.

Note: donations/contributions are still handled manually via the M-Pesa
Paybill shown on the Contact page — this build doesn't process real
payments automatically, since that needs a payment gateway integration
(e.g. Daraja API), which is a separate project if you want it.
