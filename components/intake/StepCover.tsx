'use client'

import { useRef, useState, useCallback } from 'react'
import { ImageIcon, Upload, Move, X } from 'lucide-react'
import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

export default function StepCover({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ mx: number; my: number; cx: number; cy: number } | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) { setError('Cover photo must be under 8 MB'); return }
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? 'Upload failed')
      }
      const { url } = await res.json()
      onChange({ cover_url: url, cover_x: 50, cover_y: 50 })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  /* ── Drag-to-reposition ── */
  const startDrag = useCallback((clientX: number, clientY: number) => {
    setDragging(true)
    dragStart.current = {
      mx: clientX, my: clientY,
      cx: data.cover_x ?? 50, cy: data.cover_y ?? 50,
    }
  }, [data.cover_x, data.cover_y])

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragStart.current) return
    const dx = clientX - dragStart.current.mx
    const dy = clientY - dragStart.current.my
    const speed = 0.25
    const nx = Math.max(0, Math.min(100, dragStart.current.cx - dx * speed))
    const ny = Math.max(0, Math.min(100, dragStart.current.cy - dy * speed))
    onChange({ cover_x: nx, cover_y: ny })
  }, [onChange])

  const endDrag = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  const hasCover = !!data.cover_url

  // Derive brand gradient for no-cover preview
  const hex = data.brand_color || '#0a84ff'
  const gradient = `linear-gradient(135deg, ${hex}60 0%, ${hex}28 50%, rgba(0,0,0,0.8) 100%)`

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: 'rgba(235,235,245,0.50)' }}>
        A banner photo sits behind your profile picture — like a LinkedIn cover photo.
        This step is optional.
      </p>

      {/* Banner preview */}
      <div className="relative">
        <div
          className="w-full rounded-2xl overflow-hidden select-none"
          style={{
            height: '160px',
            background: hasCover ? 'transparent' : gradient,
            cursor: hasCover ? (dragging ? 'grabbing' : 'grab') : 'pointer',
            boxShadow: '0 0 0 1.5px rgba(255,255,255,0.10)',
          }}
          onClick={!hasCover ? () => fileRef.current?.click() : undefined}
          onMouseDown={hasCover ? e => startDrag(e.clientX, e.clientY) : undefined}
          onMouseMove={hasCover ? e => moveDrag(e.clientX, e.clientY) : undefined}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={hasCover ? e => startDrag(e.touches[0].clientX, e.touches[0].clientY) : undefined}
          onTouchMove={hasCover ? e => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY) } : undefined}
          onTouchEnd={endDrag}
        >
          {hasCover ? (
            <img
              src={data.cover_url!}
              alt="Cover"
              draggable={false}
              className="w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${data.cover_x ?? 50}% ${data.cover_y ?? 50}%` }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-8 h-8" style={{ color: 'rgba(235,235,245,0.25)' }} />
              <p className="text-xs font-medium" style={{ color: 'rgba(235,235,245,0.30)' }}>
                Tap to upload cover photo
              </p>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Reposition hint */}
        {hasCover && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <Move className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.7)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Drag to reposition</span>
          </div>
        )}

        {/* Profile avatar overlay preview */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden"
          style={{
            border: `3px solid ${data.brand_color || '#0a84ff'}`,
            boxShadow: '0 0 0 2px #000',
            background: data.photo_url ? 'transparent' : (data.brand_color || '#0a84ff'),
          }}
        >
          {data.photo_url ? (
            <img
              src={data.photo_url}
              alt=""
              className="w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${data.photo_x ?? 50}% ${data.photo_y ?? 50}%` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {data.name ? data.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
      </div>

      {/* Spacer for overlapping avatar */}
      <div style={{ height: '24px' }} />

      {error && <p className="text-sm text-center" style={{ color: '#ff453a' }}>{error}</p>}

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: '#0a84ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <Upload className="w-3.5 h-3.5" />
          {hasCover ? 'Change Photo' : 'Upload Cover Photo'}
        </button>
        {hasCover && (
          <>
            <span style={{ color: 'rgba(235,235,245,0.25)' }}>·</span>
            <button
              type="button"
              onClick={() => onChange({ cover_url: null, cover_x: 50, cover_y: 50 })}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: '#ff453a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {!hasCover && (
        <p className="text-xs text-center" style={{ color: 'rgba(235,235,245,0.25)' }}>
          Without a cover, your card will show a gradient using your accent colour.
        </p>
      )}
    </div>
  )
}
