-- Ojwang Mariam campaign site — Migration 2: full-site CMS
-- Run this in the SAME Supabase project, AFTER schema.sql.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT throughout).

-- ── 1. Add hero + media sections to site_content ──────────────────────
alter table site_content add column if not exists hero jsonb not null default '{}'::jsonb;
alter table site_content add column if not exists media jsonb not null default '{}'::jsonb;

update site_content set hero = jsonb_build_object(
  'eyebrow', 'Join the campaign effort',
  'headline', 'Vision Beyond Sight: Transforming Kahawa West',
  'subhead', 'From the slums to a world-class university, breaking barriers as a media pioneer, community leader, and your incoming 2027 MCA for Kahawa West Ward.',
  'imageUrl', ''
)
where id = 1 and (hero = '{}'::jsonb or hero is null);

update site_content set media = jsonb_build_object(
  'eyebrow', 'Media & Impact',
  'heading', 'Impact Beyond Politics',
  'items', jsonb_build_array(
    jsonb_build_object('title', 'Wueeh TV Kenya CBO', 'body', 'As Founder and CEO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.', 'imageUrl', ''),
    jsonb_build_object('title', 'SHOFCO Youth Leadership', 'body', 'Serving as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.', 'imageUrl', ''),
    jsonb_build_object('title', 'Community Building', 'body', 'Executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace.', 'imageUrl', '')
  )
)
where id = 1 and (media = '{}'::jsonb or media is null);

-- ── 2. Extend bio / book / manifesto with new editable fields ─────────
-- (jsonb, so we just merge in any keys that don't exist yet — safe on repeat runs)
update site_content set bio = bio || jsonb_build_object(
  'eyebrow', 'About',
  'heading', 'The Journey of Resilience: Meet Ojwang Mariam',
  'imageUrl', ''
) where id = 1 and not (bio ? 'heading');

update site_content set book = book || jsonb_build_object(
  'coverImageUrl', ''
) where id = 1 and not (book ? 'coverImageUrl');

update site_content set manifesto = manifesto || jsonb_build_object(
  'eyebrow', 'Kahawa West 2027',
  'heading', 'Siasa Safi, Maisha Bora',
  'subheading', 'Vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner.'
) where id = 1 and not (manifesto ? 'heading');

-- ── 3. Stories table (was hardcoded in src/data/stories.ts) ───────────
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
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

create policy "Anyone can read stories"
  on stories for select
  using (true);

create policy "Only authenticated users can manage stories"
  on stories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into stories (slug, tag, title, date, summary, paragraphs, cta_label, cta_href, sort_order)
values
  (
    'book-launch', 'Book Launch', 'Believe Become — the memoir', 'Aug 7, 2026',
    'Officially unveiled at the Kenya National Theatre, Nairobi — a memoir and motivational blueprint on resilience, low vision, and rising from a Children Rescue Centre to Kenyatta University.',
    jsonb_build_array(
      'Believe Become — subtitled "Vision Beyond Sight: From the Slums to a World-Class University" — is a powerful memoir and motivational blueprint written to inspire global social impact.',
      'It delves deep into Mariam''s structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.',
      'This era-defining literary piece, alongside its accompanying podcast network, was officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre in Nairobi.',
      'The book is available as a Standard Copy for KSH 1,200, or you can Sponsor a Slum/Rescue Centre Student Copy, also priced at KSH 1,200, to put a copy directly into the hands of a young person coming up through the same rescue-centre system Mariam once relied on.'
    ),
    'Order Online / Sponsor a Reader', '/contact', 1
  ),
  (
    'manifesto', 'Manifesto', 'Siasa Safi, Maisha Bora', 'Kahawa West 2027',
    'Three pillars for Kahawa West Ward: inclusive leadership, accountable governance, and sustainable empowerment — running under the Democracy for Citizens Party.',
    jsonb_build_array(
      'Mariam is vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner, with the campaign slogan "Kuwakumbusha tu Connection ni God na Jamii" — a bold reminder that the only alignment that matters is with God and the grassroots community, not political cartels.',
      'The manifesto rests on three core pillars. Inclusive Leadership calls for equal county resource allocation for youth, women, and Persons with Disabilities (PWDs). Accountable Governance commits to full transparency in ward bursary distributions and public development funds. Sustainable Empowerment focuses on upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.'
    ),
    'Join the Movement', '/contact', 2
  ),
  (
    'media-impact', 'Community', 'Wueeh TV Kenya & Grassroots Impact', 'Ongoing',
    'As Founder and CEO, Mariam built a community digital media network spotlighting grassroots talent and structural injustice across Nairobi.',
    jsonb_build_array(
      'As Founder and CEO of Wueeh TV Kenya CBO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.',
      'Mariam also serves as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.',
      'Beyond media and SHOFCO, Mariam is an executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace in the community.'
    ),
    'Get in Touch', '/contact', 3
  )
on conflict (slug) do nothing;

-- ── 4. Image storage bucket for the admin's upload button ─────────────
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "Public read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "Authenticated upload site images"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Authenticated update site images"
  on storage.objects for update
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Authenticated delete site images"
  on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');
