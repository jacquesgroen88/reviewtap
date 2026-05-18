'use client'

import { ExternalLink, Star } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = {
  card: Card
  isDark: boolean
}

export default function LinksList({ card, isDark }: Props) {
  const allLinks = [
    card.website && { label: 'Visit Website', url: card.website, isWebsite: true },
    card.google_review_url && { label: '⭐ Leave a Google Review', url: card.google_review_url, isReview: true },
    ...card.custom_links.filter(l => l.label && l.url),
  ].filter(Boolean) as { label: string; url: string; isWebsite?: boolean; isReview?: boolean }[]

  if (allLinks.length === 0) return null

  return (
    <div className="w-full space-y-2.5">
      {allLinks.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-5 py-3.5 rounded-full border font-medium text-sm transition-all active:scale-95 hover:opacity-80"
          style={{
            borderColor: link.isReview
              ? '#facc15'
              : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            color: link.isReview
              ? isDark ? '#fef08a' : '#a16207'
              : isDark ? '#fff' : '#111',
          }}
        >
          <span>{link.label}</span>
          <ExternalLink className="w-4 h-4 opacity-50 flex-shrink-0" />
        </a>
      ))}
    </div>
  )
}
