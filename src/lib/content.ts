import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabase'

export interface BioCard {
  title: string
  body: string
}

export interface Pillar {
  title: string
  body: string
}

export interface GalleryItem {
  caption: string
  url: string
}

export interface MediaItem {
  title: string
  body: string
  imageUrl: string
}

export interface SiteContent {
  hero: {
    eyebrow: string
    headline: string
    subhead: string
    imageUrl: string
  }
  bio: {
    eyebrow: string
    heading: string
    intro: string
    imageUrl: string
    cards: BioCard[]
  }
  book: {
    title: string
    subtitle: string
    description: string
    launchDetails: string
    priceStandard: string
    priceSponsor: string
    coverImageUrl: string
  }
  manifesto: {
    eyebrow: string
    heading: string
    subheading: string
    slogan: string
    sloganNote: string
    pillars: Pillar[]
  }
  media: {
    eyebrow: string
    heading: string
    items: MediaItem[]
  }
  gallery: {
    items: GalleryItem[]
  }
}

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: 'Join the campaign effort',
    headline: 'Vision Beyond Sight: Transforming Kahawa West',
    subhead:
      'From the slums to a world-class university, breaking barriers as a media pioneer, community leader, and your incoming 2027 MCA for Kahawa West Ward.',
    imageUrl: '',
  },
  bio: {
    eyebrow: 'About',
    heading: 'The Journey of Resilience: Meet Ojwang Mariam',
    imageUrl: '',
    intro:
      'Born Vincent Maina Nyakinyua and widely celebrated across Kenya as Ojwang Mariam (Mtoto Wa Mariam), this is a story of turning profound adversity into a lifelong mission for social justice.',
    cards: [
      {
        title: 'Overcoming the Odds',
        body: 'Growing up in the unforgiving urban slums of Nairobi, Mariam faced severe economic hardships, eventually experiencing teenage homelessness — until shelter arrived through a local Children Rescue Centre.',
      },
      {
        title: 'Defying Limitations',
        body: 'Navigating the world as an individual with PWD Low Vision, Mariam actively dismantled structural barriers, proving at every stage that Disability is not Inability.',
      },
      {
        title: 'Academic Excellence',
        body: 'Driven by an unyielding belief in education, Mariam transitioned from the rescue centers straight to Kenyatta University, graduating with a Bachelor of Education degree.',
      },
      {
        title: 'The Vision',
        body: 'Today, Mariam stands as an award-winning multimedia journalist, former KU Radio/KUTV news anchor, CEO of Wueeh TV Kenya, and a relentless voice for the marginalized.',
      },
    ],
  },
  book: {
    title: 'Believe Become',
    subtitle: 'Vision Beyond Sight: From the Slums to a World-Class University',
    description:
      "A powerful memoir and motivational blueprint written to inspire global social impact. It delves deep into Mariam's structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.",
    launchDetails:
      'Officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre, Nairobi, alongside its accompanying podcast network.',
    priceStandard: 'KSH 1,200',
    priceSponsor: 'KSH 1,200',
    coverImageUrl: '',
  },
  manifesto: {
    eyebrow: 'Kahawa West 2027',
    heading: 'Siasa Safi, Maisha Bora',
    subheading:
      'Vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner.',
    slogan: 'Kuwakumbusha tu Connection ni God na Jamii',
    sloganNote:
      'A bold reminder that our only alignment is with God and the grassroots community, not political cartels.',
    pillars: [
      {
        title: 'Inclusive Leadership',
        body: 'Equal county resource allocation for youth, women, and Persons with Disabilities (PWDs).',
      },
      {
        title: 'Accountable Governance',
        body: 'Full transparency in ward bursary distributions and public development funds.',
      },
      {
        title: 'Sustainable Empowerment',
        body: 'Upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.',
      },
    ],
  },
  media: {
    eyebrow: 'Media & Impact',
    heading: 'Impact Beyond Politics',
    items: [
      {
        title: 'Wueeh TV Kenya CBO',
        body: 'As Founder and CEO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.',
        imageUrl: '',
      },
      {
        title: 'SHOFCO Youth Leadership',
        body: 'Serving as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.',
        imageUrl: '',
      },
      {
        title: 'Community Building',
        body: 'Executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace.',
        imageUrl: '',
      },
    ],
  },
  gallery: {
    items: [
      { caption: 'Book launch, Kenya National Theatre', url: '' },
      { caption: 'Community outreach, Kahawa West', url: '' },
      { caption: 'On set at Wueeh TV Kenya', url: '' },
      { caption: 'SHOFCO youth leadership event', url: '' },
      { caption: 'Mr & Miss Roysambu', url: '' },
      { caption: 'Campaign walkabout', url: '' },
    ],
  },
}

/**
 * Deep-merges Supabase's row on top of defaultContent so any field that's
 * missing in the DB (e.g. right after the migration, before it's been
 * re-saved) still renders instead of crashing the page.
 */
function mergeContent(row: Partial<SiteContent>): SiteContent {
  return {
    hero: { ...defaultContent.hero, ...row.hero },
    bio: { ...defaultContent.bio, ...row.bio, cards: row.bio?.cards ?? defaultContent.bio.cards },
    book: { ...defaultContent.book, ...row.book },
    manifesto: {
      ...defaultContent.manifesto,
      ...row.manifesto,
      pillars: row.manifesto?.pillars ?? defaultContent.manifesto.pillars,
    },
    media: {
      ...defaultContent.media,
      ...row.media,
      items: row.media?.items ?? defaultContent.media.items,
    },
    gallery: { items: row.gallery?.items ?? defaultContent.gallery.items },
  }
}

/**
 * Fetches the live site content from Supabase. Falls back to
 * `defaultContent` if Supabase isn't configured yet, the row doesn't
 * exist yet, or the request fails — so the public site never breaks.
 */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false
    supabase
      .from('site_content')
      .select('hero, bio, book, manifesto, media, gallery')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data) {
          setContent(mergeContent(data as Partial<SiteContent>))
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { content, loading }
}

// ── Stories ───────────────────────────────────────────────────────────

export interface Story {
  id: string
  slug: string
  tag: string
  title: string
  date: string
  summary: string
  paragraphs: string[]
  ctaLabel: string
  ctaHref: string
  imageUrl: string
  sortOrder: number
}

export const defaultStories: Story[] = [
  {
    id: 'default-book-launch',
    slug: 'book-launch',
    tag: 'Book Launch',
    title: 'Believe Become — the memoir',
    date: 'Aug 7, 2026',
    summary:
      'Officially unveiled at the Kenya National Theatre, Nairobi — a memoir and motivational blueprint on resilience, low vision, and rising from a Children Rescue Centre to Kenyatta University.',
    paragraphs: [
      'Believe Become — subtitled "Vision Beyond Sight: From the Slums to a World-Class University" — is a powerful memoir and motivational blueprint written to inspire global social impact.',
      "It delves deep into Mariam's structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.",
      'This era-defining literary piece, alongside its accompanying podcast network, was officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre in Nairobi.',
      'The book is available as a Standard Copy for KSH 1,200, or you can Sponsor a Slum/Rescue Centre Student Copy, also priced at KSH 1,200, to put a copy directly into the hands of a young person coming up through the same rescue-centre system Mariam once relied on.',
    ],
    ctaLabel: 'Order Online / Sponsor a Reader',
    ctaHref: '/contact',
    imageUrl: '',
    sortOrder: 1,
  },
  {
    id: 'default-manifesto',
    slug: 'manifesto',
    tag: 'Manifesto',
    title: 'Siasa Safi, Maisha Bora',
    date: 'Kahawa West 2027',
    summary:
      'Three pillars for Kahawa West Ward: inclusive leadership, accountable governance, and sustainable empowerment — running under the Democracy for Citizens Party.',
    paragraphs: [
      'Mariam is vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner, with the campaign slogan "Kuwakumbusha tu Connection ni God na Jamii" — a bold reminder that the only alignment that matters is with God and the grassroots community, not political cartels.',
      'The manifesto rests on three core pillars. Inclusive Leadership calls for equal county resource allocation for youth, women, and Persons with Disabilities (PWDs). Accountable Governance commits to full transparency in ward bursary distributions and public development funds. Sustainable Empowerment focuses on upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.',
    ],
    ctaLabel: 'Join the Movement',
    ctaHref: '/contact',
    imageUrl: '',
    sortOrder: 2,
  },
  {
    id: 'default-media-impact',
    slug: 'media-impact',
    tag: 'Community',
    title: 'Wueeh TV Kenya & Grassroots Impact',
    date: 'Ongoing',
    summary:
      'As Founder and CEO, Mariam built a community digital media network spotlighting grassroots talent and structural injustice across Nairobi.',
    paragraphs: [
      'As Founder and CEO of Wueeh TV Kenya CBO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.',
      'Mariam also serves as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.',
      'Beyond media and SHOFCO, Mariam is an executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace in the community.',
    ],
    ctaLabel: 'Get in Touch',
    ctaHref: '/contact',
    imageUrl: '',
    sortOrder: 3,
  },
]

interface StoryRow {
  id: string
  slug: string
  tag: string
  title: string
  date: string
  summary: string
  paragraphs: string[]
  cta_label: string
  cta_href: string
  image_url: string
  sort_order: number
}

function rowToStory(r: StoryRow): Story {
  return {
    id: r.id,
    slug: r.slug,
    tag: r.tag,
    title: r.title,
    date: r.date,
    summary: r.summary,
    paragraphs: r.paragraphs ?? [],
    ctaLabel: r.cta_label,
    ctaHref: r.cta_href,
    imageUrl: r.image_url,
    sortOrder: r.sort_order,
  }
}

/** Public read hook — used on Home (highlights) and Story (detail) pages. */
export function useStories() {
  const [stories, setStories] = useState<Story[]>(defaultStories)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false
    supabase
      .from('stories')
      .select('id, slug, tag, title, date, summary, paragraphs, cta_label, cta_href, image_url, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data && data.length > 0) {
          setStories((data as StoryRow[]).map(rowToStory))
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { stories, loading }
}

// ── Story admin CRUD ─────────────────────────────────────────────────
// Used by the Admin dashboard's Stories tab. The public `useStories`
// hook above stays read-only; these talk to Supabase directly.

export type StoryInput = Omit<Story, 'id'>

function storyToRow(s: StoryInput) {
  return {
    slug: s.slug,
    tag: s.tag,
    title: s.title,
    date: s.date,
    summary: s.summary,
    paragraphs: s.paragraphs,
    cta_label: s.ctaLabel,
    cta_href: s.ctaHref,
    image_url: s.imageUrl,
    sort_order: s.sortOrder,
  }
}

/** Fetches every story (admin view — same table, just not cached). */
export async function fetchAllStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('id, slug, tag, title, date, summary, paragraphs, cta_label, cta_href, image_url, sort_order')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data as StoryRow[]).map(rowToStory)
}

export async function createStory(input: StoryInput): Promise<Story> {
  const { data, error } = await supabase
    .from('stories')
    .insert(storyToRow(input))
    .select('id, slug, tag, title, date, summary, paragraphs, cta_label, cta_href, image_url, sort_order')
    .single()
  if (error) throw error
  return rowToStory(data as StoryRow)
}

export async function updateStory(id: string, input: StoryInput): Promise<void> {
  const { error } = await supabase.from('stories').update(storyToRow(input)).eq('id', id)
  if (error) throw error
}

export async function deleteStory(id: string): Promise<void> {
  const { error } = await supabase.from('stories').delete().eq('id', id)
  if (error) throw error
}
