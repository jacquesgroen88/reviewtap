'use client'

import dynamic from 'next/dynamic'
import ContactButtons from './ContactButtons'
import SocialRow from './SocialRow'
import LinksList from './LinksList'
import type { Card } from '@/lib/types'

const QRBlock    = dynamic(() => import('./QRBlock'),    { ssr: false })
const ShareButton = dynamic(() => import('./ShareButton'), { ssr: false })

type Props = { card: Card; preview?: boolean }

/** Darken a hex colour by reducing lightness — used for gradient fallback */
function darkenHex(hex: string, amount = 0.35): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  const dr = Math.round(r * (1 - amount))
  const dg = Math.round(g * (1 - amount))
  const db = Math.round(b * (1 - amount))
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`
}

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

  const hasCover = !!card.cover_url
  const coverGradient = `linear-gradient(160deg, ${card.brand_color}70 0%, ${darkenHex(card.brand_color)}55 50%, ${isDark ? '#000' : '#e5e5ea'} 100%)`

  return (
    <div className="min-h-dvh w-full flex flex-col items-center pb-14 fade-up"
      style={{ background: bg, color: text }}>

      {/* ── Cover Banner ── */}
      <div className="w-full relative" style={{ height: '200px' }}>
        {hasCover ? (
          <img
            src={card.cover_url!}
            alt="Cover"
            draggable={false}
            className="w-full h-full object-cover"
            style={{ objectPosition: `${card.cover_x ?? 50}% ${card.cover_y ?? 50}%` }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: coverGradient }} />
        )}
        {/* Subtle bottom gradient to blend into bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: `linear-gradient(to bottom, transparent, ${bg})` }}
        />
      </div>

      {/* ── Profile avatar (overlaps cover) ── */}
      <div className="flex flex-col items-center w-full max-w-sm px-5" style={{ marginTop: '-56px' }}>
        {card.photo_url ? (
          <div
            className="w-28 h-28 rounded-full overflow-hidden shadow-xl"
            style={{
              border: `3px solid ${card.brand_color}`,
              boxShadow: `0 0 0 3px ${bg}, 0 4px 24px rgba(0,0,0,0.3)`,
              zIndex: 1,
            }}
          >
            <img
              src={card.photo_url}
              alt={card.name}
              draggable={false}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${card.photo_x ?? 50}% ${card.photo_y ?? 50}%` }}
            />
          </div>
        ) : (
          <div
            className="w-28 h-28 rounded-full shadow-xl flex items-center justify-center text-4xl font-bold text-white"
            style={{
              background: card.brand_color,
              boxShadow: `0 0 0 3px ${bg}, 0 4px 24px rgba(0,0,0,0.3)`,
              zIndex: 1,
            }}
          >
            {card.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name + title */}
        <div className="text-center space-y-1 pt-4 pb-2 w-full">
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

      {/* ── Card body ── */}
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

      {/* ── Share button (floating) ── */}
      {!preview && (
        <ShareButton name={card.name} url={cardUrl} accent={card.brand_color} />
      )}
    </div>
  )
}
