import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File must be under 5 MB' }, { status: 400 })

    const ext      = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const allowed  = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic']
    if (!allowed.includes(ext)) return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const supabase = createServerClient()

    const { error: uploadError } = await supabase.storage
      .from('card-photos')
      .upload(filename, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // If bucket doesn't exist, give a clear message
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('bucket')) {
        return NextResponse.json(
          { error: 'Storage not configured. Please create the "card-photos" bucket in Supabase.' },
          { status: 500 }
        )
      }
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

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
