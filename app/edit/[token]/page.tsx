import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import IntakeForm from '@/components/intake/IntakeForm'
import type { Card, CardFormData } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ token: string }> }

export default async function EditCardPage({ params }: Props) {
  const { token } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('edit_token', token)
    .single()

  if (error || !data) {
    notFound()
  }

  const card = data as Card

  // Map Card → CardFormData (strip read-only fields, ensure numeric defaults)
  const initialData: Partial<CardFormData> = {
    slug:              card.slug,
    name:              card.name,
    job_title:         card.job_title,
    company:           card.company,
    bio:               card.bio,
    photo_url:         card.photo_url,
    photo_x:           card.photo_x ?? 50,
    photo_y:           card.photo_y ?? 50,
    cover_url:         card.cover_url,
    cover_x:           card.cover_x ?? 50,
    cover_y:           card.cover_y ?? 50,
    phone:             card.phone,
    email:             card.email,
    whatsapp:          card.whatsapp,
    website:           card.website,
    google_review_url: card.google_review_url,
    social_links:      card.social_links ?? [],
    custom_links:      card.custom_links ?? [],
    theme:             card.theme,
    brand_color:       card.brand_color,
    order_ref:         card.order_ref,
  }

  return (
    <IntakeForm
      editMode
      initialData={initialData}
      cardId={card.id}
      editToken={token}
    />
  )
}
