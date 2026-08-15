-- Ojwang Mariam campaign site — Supabase schema
-- Run this once in your Supabase project's SQL Editor.

-- 1. Site content: a single editable row holding everything the admin
--    dashboard can change (bio, book, manifesto, gallery).
create table if not exists site_content (
  id int primary key default 1,
  bio jsonb not null,
  book jsonb not null,
  manifesto jsonb not null,
  gallery jsonb not null,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_content (id, bio, book, manifesto, gallery)
values (
  1,
  '{
    "intro": "Born Vincent Maina Nyakinyua and widely celebrated across Kenya as Ojwang Mariam (Mtoto Wa Mariam), this is a story of turning profound adversity into a lifelong mission for social justice.",
    "cards": [
      {"title": "Overcoming the Odds", "body": "Growing up in the unforgiving urban slums of Nairobi, Mariam faced severe economic hardships, eventually experiencing teenage homelessness — until shelter arrived through a local Children Rescue Centre."},
      {"title": "Defying Limitations", "body": "Navigating the world as an individual with PWD Low Vision, Mariam actively dismantled structural barriers, proving at every stage that Disability is not Inability."},
      {"title": "Academic Excellence", "body": "Driven by an unyielding belief in education, Mariam transitioned from the rescue centers straight to Kenyatta University, graduating with a Bachelor of Education degree."},
      {"title": "The Vision", "body": "Today, Mariam stands as an award-winning multimedia journalist, former KU Radio/KUTV news anchor, CEO of Wueeh TV Kenya, and a relentless voice for the marginalized."}
    ]
  }'::jsonb,
  '{
    "title": "Believe Become",
    "subtitle": "Vision Beyond Sight: From the Slums to a World-Class University",
    "description": "A powerful memoir and motivational blueprint written to inspire global social impact. It delves deep into Mariam''s structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.",
    "launchDetails": "Officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre, Nairobi, alongside its accompanying podcast network.",
    "priceStandard": "KSH 1,200",
    "priceSponsor": "KSH 1,200"
  }'::jsonb,
  '{
    "slogan": "Kuwakumbusha tu Connection ni God na Jamii",
    "sloganNote": "A bold reminder that our only alignment is with God and the grassroots community, not political cartels.",
    "pillars": [
      {"title": "Inclusive Leadership", "body": "Equal county resource allocation for youth, women, and Persons with Disabilities (PWDs)."},
      {"title": "Accountable Governance", "body": "Full transparency in ward bursary distributions and public development funds."},
      {"title": "Sustainable Empowerment", "body": "Upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West."}
    ]
  }'::jsonb,
  '{
    "items": [
      {"caption": "Book launch, Kenya National Theatre", "url": ""},
      {"caption": "Community outreach, Kahawa West", "url": ""},
      {"caption": "On set at Wueeh TV Kenya", "url": ""},
      {"caption": "SHOFCO youth leadership event", "url": ""},
      {"caption": "Mr & Miss Roysambu", "url": ""},
      {"caption": "Campaign walkabout", "url": ""}
    ]
  }'::jsonb
)
on conflict (id) do nothing;

alter table site_content enable row level security;

create policy "Anyone can read site content"
  on site_content for select
  using (true);

create policy "Only authenticated users can update site content"
  on site_content for update
  using (auth.role() = 'authenticated');

-- 2. Signups: from the "Join Now" hero form. Public can submit, only the
--    logged-in admin can read the list.
create table if not exists signups (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  created_at timestamptz not null default now()
);

alter table signups enable row level security;

create policy "Anyone can sign up"
  on signups for insert
  with check (true);

create policy "Only authenticated users can view signups"
  on signups for select
  using (auth.role() = 'authenticated');

-- 3. Messages: from the Contact page form. Same pattern as signups.
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

create policy "Anyone can send a message"
  on messages for insert
  with check (true);

create policy "Only authenticated users can view messages"
  on messages for select
  using (auth.role() = 'authenticated');
