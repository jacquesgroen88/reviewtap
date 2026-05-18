import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { generateUniqueSlug } from '@/lib/slug'
import type { CardFormData } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: CardFormData = await req.json()
    const supabase = createServerClient()

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Find a unique slug
    let slug = body.slug || generateUniqueSlug(body.name)
    let attempt = 0
    while (true) {
      const { data: existing } = await supabase
        .from('cards')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (!existing) break
      attempt++
      slug = generateUniqueSlug(body.name, attempt)
    }

    const { data, error } = await supabase
      .from('cards')
      .insert({
        slug,
        name: body.name.trim(),
        job_title: body.job_title || null,
        company: body.company || null,
        bio: body.bio || null,
        photo_url: body.photo_url || null,
        phone: body.phone || null,
        email: body.email || null,
        whatsapp: body.whatsapp || null,
        website: body.website || null,
        google_review_url: body.google_review_url || null,
        social_links: body.social_links ?? [],
        custom_links: body.custom_links ?? [],
        theme: body.theme ?? 'dark',
        brand_color: body.brand_color ?? '#2563eb',
        order_ref: body.order_ref || null,
      })
      .select('slug')
      .single()

    if (error) throw error
    return NextResponse.json({ slug: data.slug })
  } catch (e: unknown) {
    console.error('Card creation error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
