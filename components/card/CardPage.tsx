'use client'

import dynamic from 'next/dynamic'
import ContactButtons from './ContactButtons'
import SocialRow from './SocialRow'
import LinksList from './LinksList'
import type { Card } from '@/lib/types'

const QRBlock = dynamic(() => import('./QRBlock'), { ssr: false })

type Props = {
  card: Card
  preview?: boolean
}

export default function CardPage({ card, preview = false }: Props) {
  const isDark = card.theme === 'dark'
  const bg = isDark ? '#0f0f0f' : '#f5f5f5'
  const textPrimary = isDark ? '#ffffff' : '#111111'
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'
  const divider = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  const cardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/cards/${card.slug}`
    : `/cards/${card.slug}`

  return (
    <div
      className="min-h-dvh w-full flex flex-col items-center pb-12"
      style={{ backgroundColor: bg, color: textPrimary }}
    >
      {/* Top accent bar */}
      <div className="w-full h-1" style={{ backgroundColor: card.brand_color }} />

      <div className="w-full max-w-sm px-5 flex flex-col items-center gap-6 pt-10">
        {/* Profile photo */}
        {card.photo_url ? (
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-4"
            style={{ borderColor: card.brand_color }}
          >
            <img src={card.photo_url} alt={card.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: card.brand_color }}
          >
            {card.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Identity */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{card.name}</h1>
          {card.job_title && (
            <p className="text-sm font-medium" style={{ color: card.brand_color }}>
              {card.job_title}
            </p>
          )}
          {card.company && (
            <p className="text-sm" style={{ color: textMuted }}>
              {card.company}
            </p>
          )}
          {card.bio && (
            <p className="text-sm mt-2 leading-relaxed" style={{ color: textMuted }}>
              {card.bio}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ backgroundColor: divider }} />

        {/* Contact buttons + save contact */}
        <ContactButtons card={card} isDark={isDark} />

        {/* Social links */}
        <SocialRow card={card} isDark={isDark} />

        {/* Links */}
        <LinksList card={card} isDark={isDark} />

        {/* QR code */}
        {!preview && (
          <>
            <div className="w-full h-px" style={{ backgroundColor: divider }} />
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs mb-1" style={{ color: textMuted }}>Scan to share</p>
              <QRBlock url={cardUrl} isDark={isDark} accentColor={card.brand_color} />
            </div>
          </>
        )}

        {/* Footer */}
        <p className="text-xs mt-4" style={{ color: textMuted }}>
          Powered by{' '}
          <a
            href="https://reviewtap.co.za"
            className="underline hover:opacity-80"
            style={{ color: card.brand_color }}
          >
            ReviewTap
          </a>
        </p>
      </div>
    </div>
  )
}
