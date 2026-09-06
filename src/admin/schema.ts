export type FieldKind = 'text' | 'textarea' | 'image'

export interface SimpleField {
  kind: FieldKind
  key: string
  label: string
}

export interface ArrayField {
  kind: 'array'
  key: string
  label: string
  itemName: string
  itemFields: SimpleField[]
}

export type FieldSchema = SimpleField | ArrayField

export const homeSchema: FieldSchema[] = [
  { kind: 'text', key: 'hero_eyebrow', label: 'Hero eyebrow tag' },
  { kind: 'text', key: 'hero_heading', label: 'Hero heading' },
  { kind: 'textarea', key: 'hero_body', label: 'Hero body text' },
  { kind: 'image', key: 'hero_image_url', label: 'Hero background image' },
  {
    kind: 'array',
    key: 'ribbon_items',
    label: 'Red CTA ribbon (3 items)',
    itemName: 'item',
    itemFields: [
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'text', key: 'body', label: 'Subtext' },
      { kind: 'text', key: 'to', label: 'Link (e.g. /contact)' },
    ],
  },
  { kind: 'text', key: 'highlights_eyebrow', label: 'Highlights section eyebrow' },
  { kind: 'text', key: 'highlights_heading', label: 'Highlights section heading' },
  { kind: 'image', key: 'issues_panel_image_url', label: 'Manifesto panel background image' },
  {
    kind: 'array',
    key: 'issues',
    label: 'Issues / links list (right side panel)',
    itemName: 'issue',
    itemFields: [
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'text', key: 'body', label: 'Subtext' },
      { kind: 'text', key: 'to', label: 'Link' },
    ],
  },
]

export const aboutSchema: FieldSchema[] = [
  { kind: 'text', key: 'eyebrow', label: 'Eyebrow tag' },
  { kind: 'text', key: 'heading', label: 'Heading' },
  { kind: 'textarea', key: 'intro', label: 'Intro paragraph' },
  { kind: 'image', key: 'portrait_url', label: 'Portrait / banner image' },
  {
    kind: 'array',
    key: 'cards',
    label: 'Story cards',
    itemName: 'card',
    itemFields: [
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'body', label: 'Body' },
    ],
  },
]

export const bookSchema: FieldSchema[] = [
  { kind: 'image', key: 'cover_url', label: 'Book cover image' },
  { kind: 'text', key: 'eyebrow', label: 'Eyebrow tag' },
  { kind: 'text', key: 'title', label: 'Book title' },
  { kind: 'text', key: 'subtitle', label: 'Subtitle' },
  { kind: 'textarea', key: 'description', label: 'Description' },
  { kind: 'textarea', key: 'launch_note', label: 'Launch note' },
  { kind: 'text', key: 'price_standard_label', label: 'Standard price label' },
  { kind: 'text', key: 'price_standard', label: 'Standard price' },
  { kind: 'text', key: 'price_sponsor_label', label: 'Sponsor price label' },
  { kind: 'text', key: 'price_sponsor', label: 'Sponsor price' },
  { kind: 'text', key: 'cta_label', label: 'Button label' },
]

export const manifestoSchema: FieldSchema[] = [
  { kind: 'text', key: 'eyebrow', label: 'Eyebrow tag' },
  { kind: 'text', key: 'heading', label: 'Heading' },
  { kind: 'textarea', key: 'intro', label: 'Intro paragraph' },
  { kind: 'text', key: 'quote', label: 'Pull quote' },
  { kind: 'textarea', key: 'quote_note', label: 'Quote note' },
  { kind: 'image', key: 'banner_url', label: 'Banner image' },
  {
    kind: 'array',
    key: 'pillars',
    label: 'Manifesto pillars',
    itemName: 'pillar',
    itemFields: [
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'body', label: 'Body' },
      { kind: 'image', key: 'image_url', label: 'Image' },
    ],
  },
]

export const mediaSchema: FieldSchema[] = [
  { kind: 'text', key: 'eyebrow', label: 'Eyebrow tag' },
  { kind: 'text', key: 'heading', label: 'Heading' },
  { kind: 'text', key: 'live_title', label: 'Live section title (leave blank to hide)' },
  { kind: 'text', key: 'live_youtube_url', label: 'YouTube link (paste any youtube.com or youtu.be URL)' },
  {
    kind: 'array',
    key: 'items',
    label: 'Media / impact items',
    itemName: 'item',
    itemFields: [
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'body', label: 'Body' },
      { kind: 'image', key: 'image_url', label: 'Image' },
    ],
  },
]

export const gallerySchema: FieldSchema[] = [
  { kind: 'text', key: 'eyebrow', label: 'Eyebrow tag' },
  { kind: 'text', key: 'heading', label: 'Heading' },
  { kind: 'textarea', key: 'intro', label: 'Intro text' },
]

export const volunteerSchema: FieldSchema[] = [
  { kind: 'image', key: 'banner_url', label: 'Banner image' },
  { kind: 'text', key: 'eyebrow', label: 'Eyebrow tag' },
  { kind: 'text', key: 'heading', label: 'Heading' },
  { kind: 'textarea', key: 'intro', label: 'Intro text' },
  {
    kind: 'array',
    key: 'items',
    label: 'Cards',
    itemName: 'card',
    itemFields: [
      { kind: 'text', key: 'title', label: 'Title' },
      { kind: 'textarea', key: 'body', label: 'Body' },
      { kind: 'text', key: 'cta', label: 'Button label' },
      { kind: 'text', key: 'to', label: 'Link' },
    ],
  },
]

export const contactSchema: FieldSchema[] = [
  { kind: 'text', key: 'eyebrow', label: 'Eyebrow tag' },
  { kind: 'text', key: 'heading', label: 'Heading' },
  { kind: 'text', key: 'cta_label', label: 'Button label' },
]

export const PAGE_SCHEMAS: Record<string, FieldSchema[]> = {
  home: homeSchema,
  about: aboutSchema,
  book: bookSchema,
  manifesto: manifestoSchema,
  media: mediaSchema,
  gallery: gallerySchema,
  volunteer: volunteerSchema,
  contact: contactSchema,
}

export const PAGE_TITLES: Record<string, string> = {
  home: 'Home Page',
  about: 'About Page',
  book: 'Book Page',
  manifesto: 'Manifesto Page',
  media: 'Media Page',
  gallery: 'Gallery Page (text)',
  volunteer: 'Volunteer Page',
  contact: 'Contact Page',
}
