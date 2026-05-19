import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { card_slug, name, email, phone, message } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!card_slug?.trim()) {
      return NextResponse.json({ error: 'card_slug is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Look up the card ID from the slug
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('id')
      .eq('slug', card_slug)
      .eq('is_active', true)
      .single()

    if (cardError || !card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    const { error: insertError } = await supabase.from('leads').insert({
      card_id:   card.id,
      card_slug: card_slug.trim(),
      name:      name.trim(),
      email:     email?.trim() || null,
      phone:     phone?.trim() || null,
      message:   message?.trim() || null,
    })

    if (insertError) {
      console.error('Lead insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    console.error('Leads API error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
