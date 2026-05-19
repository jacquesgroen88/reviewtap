'use client'

import { ExternalLink } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = { card: Card; isDark: boolean }

export default function LinksList({ card, isDark }: Props) {
  const links = [
    card.website            && { label: 'Website',                 url: card.website,            star: false },
    card.google_review_url  && { label: '⭐ Leave a Google Review', url: card.google_review_url,  star: true  },
    ...card.custom_links.filter(l => l.label && l.url).map(l => ({ label: l.label, url: l.url, star: false })),
  ].filter(Boolean) as { label: string; url: string; star: boolean }[]

  if (!links.length) return null

  const brand = card.brand_color

  const containerStyle: React.CSSProperties = isDark ? {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
    borderRadius: 16,
    overflow: 'hidden',
  } : {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    borderRadius: 16,
    overflow: 'hidden',
  }

  const text = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.80)'
  const sep  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'

  return (
    <div className="w-full" style={containerStyle}>
      {links.map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between transition-opacity active:opacity-60"
          style={{
            padding: '14px 16px',
            borderBottom: i < links.length - 1 ? `1px solid ${sep}` : 'none',
            color: l.star ? '#f59e0b' : text,
            gap: 12,
          }}>
          {/* Left accent bar */}
          <div style={{
            width: 3,
            height: 20,
            borderRadius: 99,
            background: l.star ? '#f59e0b' : brand,
            flexShrink: 0,
            opacity: 0.85,
          }} />
          <span style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{l.label}</span>
          <ExternalLink className="w-4 h-4 shrink-0" style={{ opacity: 0.35 }} />
        </a>
      ))}
    </div>
  )
}
