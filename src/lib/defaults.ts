import type {
  AboutContent,
  BookContent,
  ContactContent,
  GalleryContent,
  HomeContent,
  ManifestoContent,
  MediaContent,
  SiteSettings,
  VolunteerContent,
} from './types'

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  site_title: 'Ojwang Mariam | Tuko Kadi — Kahawa West 2027',
  logo_line1: 'OJWANG MARIAM',
  logo_line2: '★ ★ ★  TUKO KADI',
  logo_image_url: null,
  press_banner_text: 'Believe Become — the memoir launches campaign-wide youth push',
  phone: '+254 722 731 328',
  email: 'ojwangmariam@gmail.com',
  address: 'Kahawa West, Nairobi',
  footer_about:
    'Ojwang Mariam — award-winning multimedia journalist, founder and CEO of Wueeh TV Kenya, and 2027 MCA candidate for Kahawa West Ward. Siasa Safi, Maisha Bora.',
  footer_copyright: '© 2026 Ojwang Mariam. Kahawa West 2027.',
  footer_tagline: 'Siasa Safi, Maisha Bora.',
  footer_tags: ['PWD Rights', 'Youth Empowerment', 'Kahawa West', 'Governance', 'Education', 'Media', 'Community', 'DCP'],
  mpesa_paybill: '247247',
  mpesa_account: '731328',
  mpesa_account_name: 'Ojwang Mariam Solutions',
  nav_links: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'The Book', to: '/book' },
    { label: 'Manifesto', to: '/manifesto' },
    { label: 'Media & News', to: '/media' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Volunteer', to: '/volunteer' },
    { label: 'Contact', to: '/contact' },
  ],
  theme: {
    navy: '#0a1e3f',
    'navy-deep': '#061529',
    'navy-light': '#13284f',
    crimson: '#c8102e',
    'crimson-dark': '#a30d25',
    white: '#ffffff',
    offwhite: '#f7f7f5',
    ink: '#1a1a1a',
    muted: '#667085',
    hairline: '#e5e2dc',
  },
}

export const defaultHomeContent: HomeContent = {
  hero_eyebrow: 'Join the Campaign Effort',
  hero_heading: 'We Can Transform Kahawa West Together!',
  hero_body:
    'From the slums to a world-class university, breaking barriers as a media pioneer, community leader, and your incoming 2027 MCA for Kahawa West Ward.',
  hero_image_url: 'https://picsum.photos/seed/mariam-hero-city/1600/900',
  ribbon_items: [
    { title: 'Volunteer', body: 'Get involved with the campaign', to: '/volunteer' },
    { title: 'Donate Now', body: 'Support via M-Pesa Paybill 247247', to: '/contact' },
    { title: 'Order the Book', body: 'Get your copy of Believe Become', to: '/book' },
  ],
  highlights_eyebrow: 'Welcome to the Campaign',
  highlights_heading: 'Latest Campaign Highlights',
  issues_panel_image_url: 'https://picsum.photos/seed/manifesto-panel/900/700',
  issues: [
    { title: 'Inclusive Leadership', body: 'Equal resources for youth, women & PWDs', to: '/manifesto' },
    { title: 'Accountable Governance', body: 'Transparent bursaries & development funds', to: '/manifesto' },
    { title: 'Sustainable Empowerment', body: 'Markets, sanitation & youth tech hubs', to: '/manifesto' },
    { title: 'About Mariam', body: 'The journey from Kahawa West to Kenyatta University', to: '/about' },
    { title: 'The Book', body: 'Believe Become — order your copy', to: '/book' },
  ],
}

export const defaultAboutContent: AboutContent = {
  eyebrow: 'About',
  heading: 'The Journey of Resilience: Meet Ojwang Mariam',
  intro:
    'Born Vincent Maina Nyakinyua and widely celebrated across Kenya as Ojwang Mariam (Mtoto Wa Mariam), this is a story of turning profound adversity into a lifelong mission for social justice.',
  portrait_url: 'https://picsum.photos/seed/mariam-portrait/1200/500',
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
}

export const defaultBookContent: BookContent = {
  cover_url: 'https://picsum.photos/seed/believe-become-cover/600/800',
  eyebrow: 'Featured Masterpiece',
  title: 'Believe Become',
  subtitle: 'Vision Beyond Sight: From the Slums to a World-Class University',
  description:
    "A powerful memoir and motivational blueprint written to inspire global social impact. It delves deep into Mariam's structural survival, mental resilience, and the strategies used to traverse intense physical and economic challenges — a roadmap for any youth looking to find their voice and change their community.",
  launch_note:
    'Officially unveiled at a grand launch on Friday, 7th August 2026 at the Kenya National Theatre, Nairobi, alongside its accompanying podcast network.',
  price_standard_label: 'Standard Copy',
  price_standard: 'KSH 1,500',
  price_sponsor_label: 'Sponsor a Slum/Rescue Centre Student',
  price_sponsor: 'KSH 1,500',
  cta_label: 'Order Online / Sponsor a Reader',
}

export const defaultManifestoContent: ManifestoContent = {
  eyebrow: 'Kahawa West 2027',
  heading: 'Siasa Safi, Maisha Bora',
  intro:
    'Vying for Member of County Assembly (MCA) for Kahawa West Ward under the Democracy for Citizens Party (DCP) banner.',
  quote: 'Kuwakumbusha tu Connection ni God na Jamii',
  quote_note: 'A bold reminder that our only alignment is with God and the grassroots community, not political cartels.',
  banner_url: 'https://picsum.photos/seed/manifesto-banner/1200/500',
  pillars: [
    {
      title: 'Inclusive Leadership',
      body: 'Equal county resource allocation for youth, women, and Persons with Disabilities (PWDs).',
      image_url: 'https://picsum.photos/seed/pillar-inclusive/500/300',
    },
    {
      title: 'Accountable Governance',
      body: 'Full transparency in ward bursary distributions and public development funds.',
      image_url: 'https://picsum.photos/seed/pillar-governance/500/300',
    },
    {
      title: 'Sustainable Empowerment',
      body: 'Upgrading local market infrastructure, sanitation, and creating sustainable youth tech hubs in Kahawa West.',
      image_url: 'https://picsum.photos/seed/pillar-empowerment/500/300',
    },
  ],
}

export const defaultMediaContent: MediaContent = {
  eyebrow: 'Media & Impact',
  heading: 'Impact Beyond Politics',
  items: [
    {
      title: 'Wueeh TV Kenya CBO',
      body: 'As Founder and CEO, Mariam has built a premier community digital media network that shines a light on grassroots talent and structural injustices.',
      image_url: 'https://picsum.photos/seed/media-0/500/300',
    },
    {
      title: 'SHOFCO Youth Leadership',
      body: 'Serving as a high-profile youth leader within SHOFCO (Shining Hope for Communities), driving health, water, and economic safety nets in informal settlements.',
      image_url: 'https://picsum.photos/seed/media-1/500/300',
    },
    {
      title: 'Community Building',
      body: 'Executive coordinator for major youth engagement and empowerment initiatives, including local platforms like Mr & Miss Roysambu, fostering self-reliance and peace.',
      image_url: 'https://picsum.photos/seed/media-2/500/300',
    },
  ],
}

export const defaultGalleryContent: GalleryContent = {
  eyebrow: 'Gallery',
  heading: 'Moments From the Ground',
  intro: 'Mock photos below — swap these in once real event and campaign photography is ready.',
}

export const defaultVolunteerContent: VolunteerContent = {
  banner_url: 'https://picsum.photos/seed/volunteer-banner/1600/700',
  eyebrow: 'Get Involved',
  heading: 'Stand With the Campaign',
  intro:
    "Whether it's your time, your voice, or your support — every contribution moves Kahawa West closer to inclusive, accountable leadership.",
  items: [
    {
      title: 'Volunteer',
      body: 'Join campaign teams on the ground — canvassing, event support, and youth mobilization across Kahawa West.',
      cta: 'Get Involved',
      to: '/contact',
    },
    {
      title: 'Donate Now',
      body: 'Support the campaign directly via M-Pesa Paybill 247247, Account 731328 (Ojwang Mariam Solutions).',
      cta: 'Donation Details',
      to: '/contact',
    },
    {
      title: 'Order the Book',
      body: 'Get your copy of Believe Become, or sponsor a copy for a slum/rescue centre student.',
      cta: 'Order the Book',
      to: '/book',
    },
  ],
}

export const defaultContactContent: ContactContent = {
  eyebrow: 'Get Involved',
  heading: 'Stand With Ojwang Mariam',
  cta_label: 'Join the Movement',
}
