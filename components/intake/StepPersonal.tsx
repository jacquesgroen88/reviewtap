'use client'

import { useRef, useState, useCallback } from 'react'
import { Camera, Upload, Move } from 'lucide-react'
import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(120,120,128,0.18)',
  border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none',
}

export default function StepPersonal({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Photo must be under 5 MB'); return }
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
      onChange({ photo_url: url, photo_x: 50, photo_y: 50 })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  /* ── Drag-to-reposition ── */
  const startDrag = useCallback((clientX: number, clientY: number) => {
    setDragging(true)
    dragStart.current = { mx: clientX, my: clientY, px: data.photo_x ?? 50, py: data.photo_y ?? 50 }
  }, [data.photo_x, data.photo_y])

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragStart.current) return
    const dx = clientX - dragStart.current.mx
    const dy = clientY - dragStart.current.my
    const speed = 0.3
    const nx = Math.max(0, Math.min(100, dragStart.current.px - dx * speed))
    const ny = Math.max(0, Math.min(100, dragStart.current.py - dy * speed))
    onChange({ photo_x: nx, photo_y: ny })
  }, [onChange])

  const endDrag = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  return (
    <div className="space-y-5">
      {/* Photo upload */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="relative">
          {/* Circle frame */}
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden select-none"
            style={{
              background: data.photo_url ? 'transparent' : 'rgba(120,120,128,0.18)',
              boxShadow: '0 0 0 2.5px rgba(255,255,255,0.12)',
              cursor: data.photo_url ? (dragging ? 'grabbing' : 'grab') : 'pointer',
            }}
            onClick={!data.photo_url ? () => fileRef.current?.click() : undefined}
            onMouseDown={data.photo_url ? e => startDrag(e.clientX, e.clientY) : undefined}
            onMouseMove={data.photo_url ? e => moveDrag(e.clientX, e.clientY) : undefined}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={data.photo_url ? e => startDrag(e.touches[0].clientX, e.touches[0].clientY) : undefined}
            onTouchMove={data.photo_url ? e => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY) } : undefined}
            onTouchEnd={endDrag}
          >
            {data.photo_url ? (
              <img
                src={data.photo_url}
                alt="Profile"
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
                style={{ objectPosition: `${data.photo_x ?? 50}% ${data.photo_y ?? 50}%` }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-9 h-9" style={{ color: 'rgba(235,235,245,0.3)' }} />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Reposition hint badge */}
          {data.photo_url && (
            <div
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#1c1c1e', boxShadow: '0 0 0 2px #000' }}
            >
              <Move className="w-3.5 h-3.5" style={{ color: 'rgba(235,235,245,0.6)' }} />
            </div>
          )}
        </div>

        {data.photo_url ? (
          <div className="flex gap-3 text-sm">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="font-medium"
              style={{ color: '#0a84ff' }}
            >
              Change Photo
            </button>
            <span style={{ color: 'rgba(235,235,245,0.30)' }}>·</span>
            <button
              type="button"
              onClick={() => onChange({ photo_url: null, photo_x: 50, photo_y: 50 })}
              style={{ color: '#ff453a' }}
              className="font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: '#0a84ff' }}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Profile Photo
          </button>
        )}

        {data.photo_url && (
          <p className="text-xs text-center" style={{ color: 'rgba(235,235,245,0.30)' }}>
            Drag the photo to reposition
          </p>
        )}

        {error && <p className="text-sm text-center" style={{ color: '#ff453a' }}>{error}</p>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Fields */}
      <Field label="Full Name *">
        <input
          type="text"
          value={data.name}
          onChange={e => onChange({ name: e.target.value })}
          placeholder="Jane Smith"
          style={inputStyle}
          required
          autoComplete="name"
        />
      </Field>

      <Field label="Job Title">
        <input
          type="text"
          value={data.job_title ?? ''}
          onChange={e => onChange({ job_title: e.target.value || null })}
          placeholder="Marketing Manager"
          style={inputStyle}
        />
      </Field>

      <Field label="Company">
        <input
          type="text"
          value={data.company ?? ''}
          onChange={e => onChange({ company: e.target.value || null })}
          placeholder="Acme Co."
          style={inputStyle}
        />
      </Field>

      <Field label="Short Bio">
        <textarea
          value={data.bio ?? ''}
          onChange={e => onChange({ bio: e.target.value || null })}
          placeholder="Tell people a little about yourself…"
          rows={3}
          style={{ ...inputStyle, resize: 'none' }}
        />
      </Field>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
