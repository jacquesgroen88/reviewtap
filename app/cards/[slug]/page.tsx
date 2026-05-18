export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import CardPage from '@/components/card/CardPage'
import CardSuccessBanner from '@/components/card/CardSuccessBanner'
import type { Card } from '@/lib/types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createServerClient()
  const { data } = await supabase
    .from('cards')
    .select('name, company, bio, photo_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!data) return { title: 'Card Not Found' }

  return {
    title: `${data.name}${data.company ? ` | ${data.company}` : ''} | ReviewTap`,
    description: data.bio ?? `${data.name}'s digital business card`,
    openGraph: {
      images: data.photo_url ? [data.photo_url] : [],
    },
  }
}

export default async function CardSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ new?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) notFound()

  const card = data as Card
  const isNew = sp.new === '1'

  return (
    <>
      {isNew && <CardSuccessBanner card={card} />}
      <CardPage card={card} />
    </>
  )
}
