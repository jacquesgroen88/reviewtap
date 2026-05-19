'use client'

import dynamic from 'next/dynamic'
import ContactButtons from './ContactButtons'
import SocialRow from './SocialRow'
import LinksList from './LinksList'
import type { Card } from '@/lib/types'

const QRBlock = dynamic(() => import('./QRBlock'), { ssr: false })

type Props = { card: Card; preview?: boolean }

export default function CardPage({ card, preview = false }: Props) {
  const isDark = card.theme === 'dark'

  const bg        = isDark ? '#000000' : '#f2f2f7'
  const cardBg    = isDark ? '#1c1c1e' : '#ffffff'
  const text      = isDark ? '#ffffff' : '#000000'
  const subtext   = isDark ? 'rgba(235,235,245,0.60)' : 'rgba(60,60,67,0.60)'
  const sep       = isDark ? 'rgba(84,84,88,0.55)' : 'rgba(60,60,67,0.12)'

  const cardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/cards/${card.slug}`
    : `/cards/${card.slug}`

  return (
    <div className="min-h-dvh w-full flex flex-col items-center pb-14 fade-up"
      style={{ background: bg, color: text }}>

      {/* Hero area */}
      <div className="w-full max-w-sm px-5 pt-14 flex flex-col items-center gap-4">

        {/* Avatar */}
        {card.photo_url ? (
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg"
            style={{ border: `3px solid ${card.brand_color}` }}>
            <img src={card.photo_url} alt={card.name} draggable={false}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${card.photo_x ?? 50}% ${card.photo_y ?? 50}%` }} />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full shadow-lg flex items-center justify-center text-4xl font-bold text-white"
            style={{ background: card.brand_color }}>
            {card.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name + title */}
        <div className="text-center space-y-1 pb-2">
          <h1 className="text-[28px] font-bold tracking-tight leading-tight">{card.name}</h1>
          {card.job_title && (
            <p className="text-[17px] font-semibold" style={{ color: card.brand_color }}>
              {card.job_title}
            </p>
          )}
          {card.company && (
            <p className="text-[15px]" style={{ color: subtext }}>{card.company}</p>
          )}
          {card.bio && (
            <p className="text-[14px] leading-relaxed mt-2 max-w-xs mx-auto" style={{ color: subtext }}>
              {card.bio}
            </p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="w-full max-w-sm px-5 flex flex-col gap-3 mt-2">

        {/* Contact action buttons */}
        <ContactButtons card={card} isDark={isDark} />

        {/* Social icons */}
        {card.social_links.some(s => s.url) && (
          <div className="py-1">
            <SocialRow card={card} isDark={isDark} />
          </div>
        )}

        {/* Links */}
        <LinksList card={card} isDark={isDark} />

        {/* QR code */}
        {!preview && (
          <div className="mt-4 flex flex-col items-center gap-1 py-4 rounded-2xl"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
            <p className="text-xs mb-2 font-medium" style={{ color: subtext }}>Scan to share this card</p>
            <QRBlock url={cardUrl} isDark={isDark} accentColor={card.brand_color} />
          </div>
        )}

        {/* Branding */}
        <p className="text-center text-xs pb-2" style={{ color: isDark ? 'rgba(235,235,245,0.18)' : 'rgba(60,60,67,0.25)' }}>
          Powered by{' '}
          <a href="https://reviewtap.co.za" style={{ color: card.brand_color }} className="font-medium">
            ReviewTap
          </a>
        </p>
      </div>
    </div>
  )
}
