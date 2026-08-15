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

export interface SiteContent {
  bio: {
    intro: string
    cards: BioCard[]
  }
  book: {
    title: string
    subtitle: string
    description: string
    launchDetails: string
    priceStandard: string
    priceSponsor: string
  }
  manifesto: {
    slogan: string
    sloganNote: string
    pillars: Pillar[]
  }
  gallery: {
    items: GalleryItem[]
  }
}

export const defaultContent: SiteContent = {
  bio: {
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
  },
  manifesto: {
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
      .select('bio, book, manifesto, gallery')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data) {
          setContent(data as SiteContent)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { content, loading }
}
