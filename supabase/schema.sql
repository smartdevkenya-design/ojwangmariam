-- Ojwang Mariam campaign site — Supabase schema (v2, reconciled)
--
-- WHY THIS FILE REPLACES supbase/schema.sql + supbase/migration_02_full_cms.sql:
-- Those two files created tables (site_content, signups, messages) and a
-- storage bucket (site-images) that the app has since moved on from. The
-- admin panel and website code actually read/write: site_settings,
-- page_content, stories, gallery_images, custom_pages, and a "media"
-- storage bucket. That mismatch is *why* the live site only ever showed
-- fallback text and admin edits never appeared: every query from the app
-- was hitting tables/columns that didn't exist, failing silently, and the
-- app quietly fell back to its built-in defaults.
--
-- Run this ONCE in your Supabase project's SQL Editor (Settings → SQL
-- Editor → New query). It is safe to re-run.

-- ── 0. Clean up the old, unused tables + bucket from the previous schema ──
-- Nothing in the current code reads or writes to these — the "Join Now"
-- and "Contact" forms use mailto: links, not these tables — so they're
-- dead weight left over from an earlier version of the site.
drop table if exists site_content cascade;
drop table if exists signups cascade;
drop table if exists messages cascade;
-- Note: the old "site-images" storage bucket is NOT dropped here — Supabase
-- blocks direct SQL deletes on storage.objects/storage.buckets ("Direct
-- deletion from storage tables is not allowed"). It's harmless to leave in
-- place since the app now uses the "media" bucket created below instead.
-- If you want it gone, delete it manually: Storage → site-images → ⋯ → Delete bucket.

-- ── 1. site_settings — single row: logo, nav, footer, contact, theme ──
create table if not exists site_settings (
  id int primary key default 1,
  site_title text not null default '',
  logo_line1 text not null default '',
  logo_line2 text not null default '',
  logo_image_url text,
  press_banner_text text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  footer_about text not null default '',
  footer_copyright text not null default '',
  footer_tagline text not null default '',
  footer_tags jsonb not null default '[]'::jsonb,
  mpesa_paybill text not null default '',
  mpesa_account text not null default '',
  mpesa_account_name text not null default '',
  nav_links jsonb not null default '[]'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

insert into site_settings (
  id, site_title, logo_line1, logo_line2, logo_image_url, press_banner_text,
  phone, email, address, footer_about, footer_copyright, footer_tagline,
  footer_tags, mpesa_paybill, mpesa_account, mpesa_account_name, nav_links, theme
) values (
  1,
  'Ojwang Mariam | Tuko Kadi — Kahawa West 2027',
  'OJWANG MARIAM',
  '★ ★ ★  TUKO KADI',
  null,
  'Believe Become — the memoir launches campaign-wide youth push',
  '+254 722 731 328',
  'ojwangmariam@gmail.com',
  'Kahawa West, Nairobi',
  'Ojwang Mariam — award-winning multimedia journalist, founder and CEO of Wueeh TV Kenya, and 2027 MCA candidate for Kahawa West Ward. Siasa Safi, Maisha Bora.',
  '© 2026 Ojwang Mariam. Kahawa West 2027.',
  'Siasa Safi, Maisha Bora.',
  '["PWD Rights", "Youth Empowerment", "Kahawa West", "Governance", "Education", "Media", "Community", "DCP"]'::jsonb,
  '247247',
  '731328',
  'Ojwang Mariam Solutions',
  '[
    {"label": "Home", "to": "/"},
    {"label": "About", "to": "/about"},
    {"label": "The Book", "to": "/book"},
    {"label": "Manifesto", "to": "/manifesto"},
    {"label": "Media & News", "to": "/media"},
    {"label": "Gallery", "to": "/gallery"},
    {"label": "Volunteer", "to": "/volunteer"},
    {"label": "Contact", "to": "/contact"}
  ]'::jsonb,
  '{
    "navy": "#0a1e3f", "navy-deep": "#061529", "navy-light": "#13284f",
    "crimson": "#c8102e", "crimson-dark": "#a30d25", "white": "#ffffff",
    "offwhite": "#f7f7f5", "ink": "#1a1a1a", "muted": "#667085", "hairline": "#e5e2dc"
  }'::jsonb
)
on conflict (id) do nothing;

alter table site_settings enable row level security;
create policy "Anyone can read site settings" on site_settings for select using (true);
create policy "Authenticated can update site settings" on site_settings for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── 2. page_content — one JSON row per built-in page ──────────────────
create table if not exists page_content (
  page text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into page_content (page, data) values
('home', '{
  "hero_eyebrow": "Join the Campaign Effort",
  "hero_heading": "We Can Transform Kahawa West Together!",
  "hero_body": "From the slums to a world-class university, breaking barriers as a media pioneer, community leader, and your incoming 2027 MCA for Kahawa West Ward.",
  "hero_image_url": "https://picsum.photos/seed/mariam-hero-city/1600/900",
  "ribbon_items": [
    {"title": "Volunteer", "body": "Get involved with the campaign", "to": "/volunteer"},
    {"title": "Donate Now", "body": "Support via M-Pesa Paybill 247247", "to": "/contact"},
    {"title": "Order the Book", "body": "Get your copy of Believe Become", "to": "/book"}
  ],
  "highlights_eyebrow": "Welcome to the Campaign",
  "highlights_heading": "Latest Campaign Highlights",
  "issues_panel_image_url": "https://picsum.photos/seed/manifesto-panel/900/700",
  "issues": [
    {"title": "Inclusive Leadership", "body": "Equal resources for youth, women & PWDs", "to": "/manifesto"},
    {"title": "Accountable Governance", "body": "Transparent bursaries & development funds", "to": "/manifesto"},
    {"title": "Sustainable Empowerment", "body": "Markets, sanitation & youth tech hubs", "to": "/manifesto"},
    {"title": "About Mariam", "body": "The journey from Kahawa West to Kenyatta University", "to": "/about"},
    {"title": "The Book", "body": "Believe Become — order your copy", "to": "/book"}
  ]
}'::jsonb),
('about', '{
  "eyebrow": "About",
  "heading": "The Journey of Resilience: Meet Ojwang Mariam",
  "intro": "Born Vincent Maina Nyakinyua and widely celebrated across Kenya as Ojwang Mariam (Mtoto Wa Mariam), this is a story of turning profound adversity into a lifelong mission for social justice.",
  "portrait_url": "https://picsum.photos/seed/mariam-portrait/1200/500",
  "cards": [
    {"title": "Overcoming the Odds", "body": "Growing up in the unforgiving urban slums of Nairobi, Mariam faced severe economic hardships, eventually experiencing teenage homelessness — until shelter arrived through a local Children Rescue Centre."},
    {"title": "Defying Limitations", "body": "Navigating the world as an individual with PWD Low Vision, Mariam actively dismantled structural barriers, proving at every stage that Disability is not Inability."},
    {"title": "Academic Excellence", "body": "Driven by an unyielding belief in education, Mariam transitioned from the rescue centers straight to Kenyatta University, graduating with a Bachelor of Education degree."},
    {"title": "The Vision", "body": "Today, Mariam stands as an award-winning multimedia journalist, former KU Radio/KUTV news anchor, CEO of Wueeh TV Kenya, and a relentless voice for the marginalized."}
  ]
}'::jsonb),
('book', '{
  "cover_url": "https://picsum.photos/seed/believe-become-cover/600/800",
  "eyebrow": "Featured Masterpiece",
  "title": "Believe Become",
  "subtitle": "Vision Beyond Sight: From the Slums to a World-Class University",
  "description": "A powerful memoir and motivational blueprint written to inspire global social impact. It delves deep into Mariam''s structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.",
  "launch_note": "Officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre, Nairobi, alongside its accompanying podcast network.",
  "price_standard_label": "Standard Copy",
  "price_standard": "KSH 1,500",
  "price_sponsor_label": "Sponsor a Slum/Rescue Centre Student",
  "price_sponsor": "KSH 1,500",
  "cta_label": "Order Online / Sponsor a Reader"
}'::jsonb),
('manifesto', '{
  "eyebrow": "Kahawa West 2027",
  "heading": "Siasa Safi, Maisha Bora",
  "intro": "Vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner.",
  "quote": "Kuwakumbusha tu Connection ni God na Jamii",
  "quote_note": "A bold reminder that our only alignment is with God and the grassroots community, not political cartels.",
  "banner_url": "https://picsum.photos/seed/manifesto-banner/1200/500",
  "pillars": [
    {"title": "Inclusive Leadership", "body": "Equal county resource allocation for youth, women, and Persons with Disabilities (PWDs).", "image_url": "https://picsum.photos/seed/pillar-inclusive/500/300"},
    {"title": "Accountable Governance", "body": "Full transparency in ward bursary distributions and public development funds.", "image_url": "https://picsum.photos/seed/pillar-governance/500/300"},
    {"title": "Sustainable Empowerment", "body": "Upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.", "image_url": "https://picsum.photos/seed/pillar-empowerment/500/300"}
  ]
}'::jsonb),
('media', '{
  "eyebrow": "Media & Impact",
  "heading": "Impact Beyond Politics",
  "items": [
    {"title": "Wueeh TV Kenya CBO", "body": "As Founder and CEO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.", "image_url": "https://picsum.photos/seed/media-0/500/300"},
    {"title": "SHOFCO Youth Leadership", "body": "Serving as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.", "image_url": "https://picsum.photos/seed/media-1/500/300"},
    {"title": "Community Building", "body": "Executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace.", "image_url": "https://picsum.photos/seed/media-2/500/300"}
  ]
}'::jsonb),
('gallery', '{
  "eyebrow": "Gallery",
  "heading": "Moments From the Ground",
  "intro": "Mock photos below — swap these in once real event and campaign photography is ready."
}'::jsonb),
('volunteer', '{
  "banner_url": "https://picsum.photos/seed/volunteer-banner/1600/700",
  "eyebrow": "Get Involved",
  "heading": "Stand With the Campaign",
  "intro": "Whether it''s your time, your voice, or your support — every contribution moves Kahawa West closer to inclusive, accountable leadership.",
  "items": [
    {"title": "Volunteer", "body": "Join campaign teams on the ground — canvassing, event support, and youth mobilization across Kahawa West.", "cta": "Get Involved", "to": "/contact"},
    {"title": "Donate Now", "body": "Support the campaign directly via M-Pesa Paybill 247247, Account 731328 (Ojwang Mariam Solutions).", "cta": "Donation Details", "to": "/contact"},
    {"title": "Order the Book", "body": "Get your copy of Believe Become, or sponsor a copy for a slum/rescue centre student.", "cta": "Order the Book", "to": "/book"}
  ]
}'::jsonb),
('contact', '{
  "eyebrow": "Get Involved",
  "heading": "Stand With Ojwang Mariam",
  "cta_label": "Join the Movement"
}'::jsonb)
on conflict (page) do nothing;

alter table page_content enable row level security;
create policy "Anyone can read page content" on page_content for select using (true);
create policy "Authenticated can manage page content" on page_content for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── 3. stories — campaign highlight cards ──────────────────────────────
-- Recreated clean: the old version of this table had a required "slug"
-- column the admin panel never sends, which silently blocked every save.
drop table if exists stories cascade;
create table stories (
  id uuid primary key default gen_random_uuid(),
  tag text not null default '',
  title text not null default '',
  date text not null default '',
  summary text not null default '',
  paragraphs jsonb not null default '[]'::jsonb,
  cta_label text not null default 'Get in Touch',
  cta_href text not null default '/contact',
  image_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table stories enable row level security;
create policy "Anyone can read stories" on stories for select using (true);
create policy "Authenticated can manage stories" on stories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into stories (tag, title, date, summary, paragraphs, cta_label, cta_href, image_url, sort_order) values
(
  'Book Launch', 'Believe Become — the memoir', 'Aug 7, 2026',
  'Officially unveiled at the Kenya National Theatre, Nairobi — a memoir and motivational blueprint on resilience, low vision, and rising from a Children Rescue Centre to Kenyatta University.',
  '[
    "Believe Become — subtitled \"Vision Beyond Sight: From the Slums to a World-Class University\" — is a powerful memoir and motivational blueprint written to inspire global social impact.",
    "It delves deep into Mariam''s structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.",
    "This era-defining literary piece, alongside its accompanying podcast network, was officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre in Nairobi.",
    "The book is available as a Standard Copy for KSH 1,500, or you can Sponsor a Slum/Rescue Centre Student Copy, also priced at KSH 1,500, to put a copy directly into the hands of a young person coming up through the same rescue-centre system Mariam once relied on."
  ]'::jsonb,
  'Order Online / Sponsor a Reader', '/contact', '', 1
),
(
  'Manifesto', 'Siasa Safi, Maisha Bora', 'Kahawa West 2027',
  'Three pillars for Kahawa West Ward: inclusive leadership, accountable governance, and sustainable empowerment — running under the Democracy for Citizens Party.',
  '[
    "Mariam is vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner, with the campaign slogan \"Kuwakumbusha tu Connection ni God na Jamii\" — a bold reminder that the only alignment that matters is with God and the grassroots community, not political cartels.",
    "The manifesto rests on three core pillars. Inclusive Leadership calls for equal county resource allocation for youth, women, and Persons with Disabilities (PWDs). Accountable Governance commits to full transparency in ward bursary distributions and public development funds. Sustainable Empowerment focuses on upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West."
  ]'::jsonb,
  'Join the Movement', '/contact', '', 2
),
(
  'Community', 'Wueeh TV Kenya & Grassroots Impact', 'Ongoing',
  'As Founder and CEO, Mariam built a community digital media network spotlighting grassroots talent and structural injustice across Nairobi.',
  '[
    "As Founder and CEO of Wueeh TV Kenya CBO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.",
    "Mariam also serves as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.",
    "Beyond media and SHOFCO, Mariam is an executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace in the community."
  ]'::jsonb,
  'Get in Touch', '/contact', '', 3
);

-- ── 4. gallery_images — Gallery page photos ────────────────────────────
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery_images enable row level security;
create policy "Anyone can read gallery images" on gallery_images for select using (true);
create policy "Authenticated can manage gallery images" on gallery_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── 5. custom_pages — admin-created extra pages (e.g. /events) ────────
create table if not exists custom_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  nav_label text not null default '',
  show_in_nav boolean not null default true,
  sort_order int not null default 0,
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table custom_pages enable row level security;
create policy "Anyone can read custom pages" on custom_pages for select using (true);
create policy "Authenticated can manage custom pages" on custom_pages for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── 6. Storage bucket for the admin's image uploader ───────────────────
-- The app uploads to a bucket literally named "media" (see
-- src/lib/supabase.ts → MEDIA_BUCKET) — not "site-images".
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public read media" on storage.objects for select
  using (bucket_id = 'media');
create policy "Authenticated upload media" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated update media" on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Authenticated delete media" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
