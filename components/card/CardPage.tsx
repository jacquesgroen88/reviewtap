'use client'

import dynamic from 'next/dynamic'
import ContactButtons from './ContactButtons'
import SocialRow from './SocialRow'
import LinksList from './LinksList'
import LeadCaptureSheet from './LeadCaptureSheet'
import type { Card } from '@/lib/types'

const QRBlock      = dynamic(() => import('./QRBlock'),      { ssr: false })
const ShareButton  = dynamic(() => import('./ShareButton'),  { ssr: false })
const WalletButton = dynamic(() => import('./WalletButton'), { ssr: false })

type Props = { card: Card; preview?: boolean }

/* ─── colour helpers ─── */
function darkenHex(hex: string, amount = 0.35): string {
  const c = hex.replace('#', '')
  const r = Math.round(parseInt(c.slice(0, 2), 16) * (1 - amount))
  const g = Math.round(parseInt(c.slice(2, 4), 16) * (1 - amount))
  const b = Math.round(parseInt(c.slice(4, 6), 16) * (1 - amount))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function lightenHex(hex: string, amount = 0.35): string {
  const c = hex.replace('#', '')
  const r = Math.round(parseInt(c.slice(0, 2), 16) + (255 - parseInt(c.slice(0, 2), 16)) * amount)
  const g = Math.round(parseInt(c.slice(2, 4), 16) + (255 - parseInt(c.slice(2, 4), 16)) * amount)
  const b = Math.round(parseInt(c.slice(4, 6), 16) + (255 - parseInt(c.slice(4, 6), 16)) * amount)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

export default function CardPage({ card, preview = false }: Props) {
  const isDark  = card.theme === 'dark'
  const layout  = card.layout ?? 'classic'

  const bg      = isDark ? '#090909' : '#f5f5f7'
  const text    = isDark ? '#ffffff' : '#000000'
  const subtext = isDark ? 'rgba(235,235,245,0.60)' : 'rgba(60,60,67,0.60)'
  const brand   = card.brand_color

  const cardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/cards/${card.slug}`
    : `/cards/${card.slug}`

  const walletEnabled = process.env.NEXT_PUBLIC_GOOGLE_WALLET_ENABLED === 'true'

  /* ─────────────────────── Shared lower section ─────────────────────── */
  const lowerSection = (
    <div className="w-full max-w-sm px-5 flex flex-col gap-3">
      <ContactButtons card={card} isDark={isDark} />

      {card.social_links.some(s => s.url) && (
        <div className="py-1"><SocialRow card={card} isDark={isDark} /></div>
      )}

      <LinksList card={card} isDark={isDark} />

      {!preview && (
        <div className="mt-1">
          <LeadCaptureSheet
            cardSlug={card.slug}
            cardName={card.name}
            accent={brand}
            isDark={isDark}
          />
        </div>
      )}

      {!preview && walletEnabled && <WalletButton slug={card.slug} />}

      {!preview && (
        <div className="mt-4 flex flex-col items-center gap-1 py-5 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
          }}>
          <p className="text-xs mb-2 font-medium" style={{ color: subtext }}>Scan to share this card</p>
          <QRBlock url={cardUrl} isDark={isDark} accentColor={brand} />
        </div>
      )}

      <p className="text-center text-xs pb-2" style={{ color: isDark ? 'rgba(235,235,245,0.18)' : 'rgba(60,60,67,0.25)' }}>
        Powered by{' '}
        <a href="https://reviewtap.co.za" style={{ color: brand }} className="font-medium">
          ReviewTap
        </a>
      </p>
    </div>
  )

  /* ═══════════════════════ CLASSIC LAYOUT ═══════════════════════ */
  if (layout === 'classic') {
    const coverGradient = card.cover_url
      ? undefined
      : `radial-gradient(ellipse at 30% 40%, ${brand}95 0%, ${darkenHex(brand, 0.25)}80 45%, ${isDark ? '#090909' : '#e8e8ed'} 100%)`

    return (
      <div className="min-h-dvh w-full flex flex-col items-center pb-14 fade-up" style={{ background: bg, color: text }}>
        {/* Cover Banner */}
        <div className="w-full relative" style={{ height: '240px' }}>
          {card.cover_url ? (
            <img src={card.cover_url} alt="Cover" draggable={false}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${card.cover_x ?? 50}% ${card.cover_y ?? 50}%` }} />
          ) : (
            <div className="w-full h-full" style={{ background: coverGradient }} />
          )}
          {/* Noise texture overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
            mixBlendMode: 'overlay',
          }} />
          {/* Gradient fade to bg */}
          <div className="absolute bottom-0 left-0 right-0 h-20"
            style={{ background: `linear-gradient(to bottom, transparent, ${bg})` }} />
        </div>

        {/* Avatar overlapping cover */}
        <div className="flex flex-col items-center w-full max-w-sm px-5" style={{ marginTop: '-60px' }}>
          {card.photo_url ? (
            <div className="rounded-full overflow-hidden"
              style={{
                width: 128, height: 128,
                border: `3px solid ${bg}`,
                boxShadow: `0 0 0 3px ${brand}, 0 8px 32px ${brand}55, 0 2px 12px rgba(0,0,0,0.4)`,
                zIndex: 1,
              }}>
              <img src={card.photo_url} alt={card.name} draggable={false}
                className="w-full h-full object-cover"
                style={{ objectPosition: `${card.photo_x ?? 50}% ${card.photo_y ?? 50}%` }} />
            </div>
          ) : (
            <div className="rounded-full flex items-center justify-center font-bold text-white"
              style={{
                width: 128, height: 128, fontSize: 44,
                background: `linear-gradient(145deg, ${lightenHex(brand, 0.2)}, ${brand})`,
                border: `3px solid ${bg}`,
                boxShadow: `0 0 0 3px ${brand}, 0 8px 32px ${brand}55, 0 2px 12px rgba(0,0,0,0.4)`,
                zIndex: 1,
              }}>
              {card.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-center space-y-1 pt-5 pb-2 w-full">
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.15 }}>{card.name}</h1>
            {card.job_title && (
              <p style={{ fontSize: 17, fontWeight: 600, color: brand }}>{card.job_title}</p>
            )}
            {card.company && (
              <p style={{ fontSize: 15, color: subtext }}>{card.company}</p>
            )}
            {card.bio && (
              <p style={{ fontSize: 14, lineHeight: 1.6, color: subtext, marginTop: 10, maxWidth: 300, margin: '10px auto 0' }}>
                {card.bio}
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center mt-2">{lowerSection}</div>
        {!preview && <ShareButton name={card.name} url={cardUrl} accent={brand} />}
      </div>
    )
  }

  /* ═══════════════════════ MINIMAL LAYOUT ═══════════════════════ */
  if (layout === 'minimal') {
    const minimalBg = isDark
      ? `radial-gradient(ellipse at 50% 0%, ${brand}22 0%, #090909 55%)`
      : `radial-gradient(ellipse at 50% -10%, ${brand}18 0%, #f5f5f7 55%)`

    return (
      <div className="min-h-dvh w-full flex flex-col items-center pb-14 fade-up" style={{ background: minimalBg, color: text }}>
        <div className="w-full max-w-sm px-5 flex flex-col items-center pt-16 pb-2">
          {/* Large avatar, no cover */}
          {card.photo_url ? (
            <div className="rounded-full overflow-hidden mb-6"
              style={{
                width: 160, height: 160,
                boxShadow: `0 0 0 4px ${isDark ? '#090909' : '#ffffff'}, 0 0 0 6px ${brand}70, 0 16px 48px ${brand}30`,
              }}>
              <img src={card.photo_url} alt={card.name} draggable={false}
                className="w-full h-full object-cover"
                style={{ objectPosition: `${card.photo_x ?? 50}% ${card.photo_y ?? 50}%` }} />
            </div>
          ) : (
            <div className="rounded-full flex items-center justify-center font-bold text-white mb-6"
              style={{
                width: 160, height: 160, fontSize: 56,
                background: `linear-gradient(145deg, ${lightenHex(brand, 0.2)}, ${brand})`,
                boxShadow: `0 0 0 4px ${isDark ? '#090909' : '#ffffff'}, 0 0 0 6px ${brand}70, 0 16px 48px ${brand}30`,
              }}>
              {card.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-center w-full">
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.15 }}>{card.name}</h1>
            {card.job_title && (
              <p style={{ fontSize: 17, fontWeight: 600, color: brand, marginTop: 6 }}>{card.job_title}</p>
            )}
            {card.company && (
              <p style={{ fontSize: 15, color: subtext, marginTop: 3 }}>{card.company}</p>
            )}
            {card.bio && (
              <p style={{ fontSize: 14, lineHeight: 1.65, color: subtext, marginTop: 14, maxWidth: 300, margin: '14px auto 0' }}>
                {card.bio}
              </p>
            )}
          </div>

          {/* Gradient accent pill divider */}
          <div style={{
            width: 48, height: 3, borderRadius: 99,
            background: `linear-gradient(90deg, ${brand}, ${lightenHex(brand, 0.3)})`,
            marginTop: 24, marginBottom: 8,
          }} />
        </div>

        <div className="w-full flex flex-col items-center">{lowerSection}</div>
        {!preview && <ShareButton name={card.name} url={cardUrl} accent={brand} />}
      </div>
    )
  }

  /* ═══════════════════════ BOLD LAYOUT ═══════════════════════ */
  return (
    <div className="min-h-dvh w-full flex flex-col items-center pb-14 fade-up" style={{ background: isDark ? '#090909' : '#f5f5f7', color: text }}>
      {/* Bold gradient header block */}
      <div className="w-full relative flex flex-col items-center justify-end pb-10"
        style={{
          background: `linear-gradient(135deg, ${lightenHex(brand, 0.22)} 0%, ${brand} 50%, ${darkenHex(brand, 0.22)} 100%)`,
          minHeight: '270px',
          borderRadius: '0 0 40px 40px',
        }}>
        {/* Radial highlight — top */}
        <div className="absolute inset-0 rounded-b-[40px]" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.28) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Noise texture */}
        <div className="absolute inset-0 rounded-b-[40px]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
          mixBlendMode: 'overlay',
        }} />

        <div className="relative z-10 flex flex-col items-center gap-4 px-5 pt-14">
          {card.photo_url ? (
            <div className="rounded-full overflow-hidden"
              style={{
                width: 132, height: 132,
                border: '3px solid rgba(255,255,255,0.85)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.20)',
              }}>
              <img src={card.photo_url} alt={card.name} draggable={false}
                className="w-full h-full object-cover"
                style={{ objectPosition: `${card.photo_x ?? 50}% ${card.photo_y ?? 50}%` }} />
            </div>
          ) : (
            <div className="rounded-full flex items-center justify-center font-bold"
              style={{
                width: 132, height: 132, fontSize: 46,
                background: 'rgba(255,255,255,0.20)',
                border: '3px solid rgba(255,255,255,0.85)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
                color: '#ffffff',
              }}>
              {card.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-center">
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.2, color: '#ffffff' }}>
              {card.name}
            </h1>
            {card.job_title && (
              <p style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.82)', marginTop: 4 }}>{card.job_title}</p>
            )}
            {card.company && (
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', marginTop: 3 }}>{card.company}</p>
            )}
          </div>
        </div>
      </div>

      {card.bio && (
        <div className="w-full max-w-sm px-5 pt-5 pb-1 text-center">
          <p style={{ fontSize: 14, lineHeight: 1.65, color: subtext }}>{card.bio}</p>
        </div>
      )}

      <div className="w-full flex flex-col items-center mt-4">{lowerSection}</div>
      {!preview && <ShareButton name={card.name} url={cardUrl} accent={brand} />}
    </div>
  )
}
