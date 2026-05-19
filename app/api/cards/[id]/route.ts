import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import type { CardFormData } from '@/lib/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: CardFormData & { edit_token?: string } = await req.json()
    const supabase = createServerClient()

    // Fetch the card to verify edit_token
    const { data: card, error: fetchError } = await supabase
      .from('cards')
      .select('id, slug, edit_token')
      .eq('id', id)
      .single()

    if (fetchError || !card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    // Authorise: either a valid edit_token OR an admin cookie
    const adminCookie = req.cookies.get('admin_auth')?.value
    const isAdmin = adminCookie === process.env.ADMIN_PASSWORD
    const hasValidToken = body.edit_token && body.edit_token === card.edit_token

    if (!isAdmin && !hasValidToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update the card
    const { data: updated, error: updateError } = await supabase
      .from('cards')
      .update({
        name:               body.name?.trim()       ?? card.slug,
        job_title:          body.job_title           || null,
        company:            body.company             || null,
        bio:                body.bio                 || null,
        photo_url:          body.photo_url           || null,
        photo_x:            body.photo_x             ?? 50,
        photo_y:            body.photo_y             ?? 50,
        cover_url:          body.cover_url           || null,
        cover_x:            body.cover_x             ?? 50,
        cover_y:            body.cover_y             ?? 50,
        phone:              body.phone               || null,
        email:              body.email               || null,
        whatsapp:           body.whatsapp            || null,
        website:            body.website             || null,
        google_review_url:  body.google_review_url   || null,
        social_links:       body.social_links        ?? [],
        custom_links:       body.custom_links        ?? [],
        theme:              body.theme               ?? 'dark',
        brand_color:        body.brand_color         ?? '#0a84ff',
        updated_at:         new Date().toISOString(),
      })
      .eq('id', id)
      .select('slug')
      .single()

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ slug: updated.slug })
  } catch (e: unknown) {
    console.error('Card update error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
