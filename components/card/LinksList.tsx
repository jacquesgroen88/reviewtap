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

  const bg    = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const text  = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)'
  const sep   = isDark ? 'rgba(84,84,88,0.4)' : 'rgba(60,60,67,0.12)'

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: bg }}>
      {links.map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-4 transition-opacity active:opacity-60"
          style={{
            borderBottom: i < links.length - 1 ? `1px solid ${sep}` : 'none',
            color: l.star ? '#ffd60a' : text,
          }}>
          <span className="text-[15px] font-medium">{l.label}</span>
          <ExternalLink className="w-4 h-4 opacity-40 shrink-0 ml-3" />
        </a>
      ))}
    </div>
  )
}
