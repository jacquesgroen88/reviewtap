import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase = createServerClient()
    const { error } = await supabase.storage
      .from('card-photos')
      .upload(filename, file, { contentType: file.type, upsert: false })

    if (error) throw error

    const { data } = supabase.storage.from('card-photos').getPublicUrl(filename)
    return NextResponse.json({ url: data.publicUrl })
  } catch (e: unknown) {
    console.error('Upload error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
