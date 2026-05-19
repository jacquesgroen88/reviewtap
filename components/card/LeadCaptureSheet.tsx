'use client'

import { useState } from 'react'
import { X, Loader2, Check, UserPlus } from 'lucide-react'

type Props = {
  cardSlug: string
  cardName: string
  accent: string
  isDark: boolean
}

const inputStyle = (isDark: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '13px 16px',
  background: isDark ? 'rgba(120,120,128,0.20)' : 'rgba(0,0,0,0.06)',
  border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
  borderRadius: '12px',
  color: isDark ? '#fff' : '#000',
  fontSize: '15px',
  outline: 'none',
})

export default function LeadCaptureSheet({ cardSlug, cardName, accent, isDark }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_slug: cardSlug, name: name.trim(), email: email || null, phone: phone || null, message: message || null }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? 'Failed to send')
      }
      setDone(true)
      setTimeout(() => { setOpen(false); setDone(false); setName(''); setEmail(''); setPhone(''); setMessage('') }, 2200)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const firstName = cardName.split(' ')[0]
  const labelColor = isDark ? 'rgba(235,235,245,0.60)' : 'rgba(60,60,67,0.60)'
  const sheetBg = isDark ? '#1c1c1e' : '#ffffff'
  const textColor = isDark ? '#ffffff' : '#000000'

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-[15px] transition-all active:scale-[0.98]"
        style={{
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
          color: textColor,
          border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        <UserPlus className="w-4 h-4" style={{ color: accent }} />
        Share your details with {firstName}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl transition-transform duration-300"
        style={{
          background: sheetBg,
          transform: open ? 'translateY(0)' : 'translateY(110%)',
          maxHeight: '85dvh',
          overflowY: 'auto',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
        </div>

        <div className="px-5 pb-10 pt-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold" style={{ color: textColor }}>Leave your details</h2>
              <p className="text-sm mt-0.5" style={{ color: labelColor }}>{firstName} will get back to you</p>
            </div>
            <button type="button" onClick={() => setOpen(false)}
              className="p-2 rounded-full"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              <X className="w-4 h-4" style={{ color: labelColor }} />
            </button>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: `${accent}20`, border: `2px solid ${accent}` }}>
                <Check className="w-7 h-7" style={{ color: accent }} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg" style={{ color: textColor }}>Details sent!</p>
                <p className="text-sm mt-1" style={{ color: labelColor }}>{firstName} will be in touch soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: labelColor }}>Your Name *</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith" required autoComplete="name"
                  style={inputStyle(isDark)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: labelColor }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="jane@example.com" autoComplete="email"
                  style={inputStyle(isDark)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: labelColor }}>Phone</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+27 82 000 0000" autoComplete="tel"
                  style={inputStyle(isDark)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: labelColor }}>Message</label>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="What would you like to discuss?"
                  rows={3} style={{ ...inputStyle(isDark), resize: 'none' }}
                />
              </div>

              {error && (
                <p className="text-sm text-center font-medium" style={{ color: '#ff453a' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={!name.trim() || submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-[15px] text-white transition-all active:scale-[0.98]"
                style={{
                  background: name.trim() && !submitting ? accent : 'rgba(120,120,128,0.25)',
                  opacity: name.trim() && !submitting ? 1 : 0.5,
                  cursor: name.trim() && !submitting ? 'pointer' : 'not-allowed',
                  border: 'none',
                  marginTop: '8px',
                }}
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Details'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
