import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { generateWalletPassUrl } from '@/lib/wallet'
import type { Card } from '@/lib/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!process.env.GOOGLE_WALLET_ISSUER_ID || !process.env.GOOGLE_WALLET_KEY_JSON) {
      return NextResponse.json({ error: 'Google Wallet not configured' }, { status: 503 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    const url = await generateWalletPassUrl(data as Card)
    return NextResponse.json({ url })
  } catch (e: unknown) {
    console.error('Wallet pass error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
