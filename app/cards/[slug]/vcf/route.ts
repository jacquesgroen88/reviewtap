import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { generateVcf } from '@/lib/vcf'
import type { Card } from '@/lib/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) {
    return new NextResponse('Not found', { status: 404 })
  }

  const vcf = generateVcf(data as Card)
  const filename = `${data.name.replace(/\s+/g, '_')}.vcf`

  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
