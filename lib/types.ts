export type SocialLink = {
  platform: string
  url: string
}

export type CustomLink = {
  label: string
  url: string
}

export type Card = {
  id: string
  slug: string
  name: string
  job_title: string | null
  company: string | null
  bio: string | null
  photo_url: string | null
  photo_x: number | null
  photo_y: number | null
  cover_url: string | null
  cover_x: number | null
  cover_y: number | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  website: string | null
  google_review_url: string | null
  social_links: SocialLink[]
  custom_links: CustomLink[]
  theme: 'light' | 'dark'
  brand_color: string
  is_active: boolean
  order_ref: string | null
  edit_token: string | null
  created_at: string
  updated_at: string
}

export type CardFormData = Omit<Card, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'edit_token'> & {
  photo_x: number
  photo_y: number
  cover_x: number
  cover_y: number
}
