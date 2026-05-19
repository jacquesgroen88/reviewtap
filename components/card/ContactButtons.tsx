'use client'

import { Phone, Mail, MessageCircle, UserPlus } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = { card: Card; isDark: boolean }

function lightenHex(hex: string, amount = 0.2): string {
  const c = hex.replace('#', '')
  const r = Math.round(parseInt(c.slice(0, 2), 16) + (255 - parseInt(c.slice(0, 2), 16)) * amount)
  const g = Math.round(parseInt(c.slice(2, 4), 16) + (255 - parseInt(c.slice(2, 4), 16)) * amount)
  const b = Math.round(parseInt(c.slice(4, 6), 16) + (255 - parseInt(c.slice(4, 6), 16)) * amount)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function darkenHex(hex: string, amount = 0.15): string {
  const c = hex.replace('#', '')
  const r = Math.round(parseInt(c.slice(0, 2), 16) * (1 - amount))
  const g = Math.round(parseInt(c.slice(2, 4), 16) * (1 - amount))
  const b = Math.round(parseInt(c.slice(4, 6), 16) * (1 - amount))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

export default function ContactButtons({ card, isDark }: Props) {
  const btns = [
    card.phone    && { label: 'Call',      icon: <Phone className="w-6 h-6" />,          href: `tel:${card.phone}` },
    card.email    && { label: 'Email',     icon: <Mail className="w-6 h-6" />,           href: `mailto:${card.email}` },
    card.whatsapp && { label: 'WhatsApp',  icon: <MessageCircle className="w-6 h-6" />, href: `https://wa.me/${card.whatsapp.replace(/\D/g, '')}` },
  ].filter(Boolean) as { label: string; icon: React.ReactNode; href: string }[]

  const brand = card.brand_color
  const btnGradient = `linear-gradient(145deg, ${lightenHex(brand, 0.18)} 0%, ${brand} 55%, ${darkenHex(brand, 0.12)} 100%)`
  const btnShadow   = `0 4px 18px ${brand}55, 0 1px 3px rgba(0,0,0,0.2)`

  return (
    <div className="w-full space-y-3">
      {/* Action tiles row */}
      {btns.length > 0 && (
        <div className="flex gap-2.5">
          {btns.map(btn => (
            <a key={btn.label} href={btn.href}
              className="flex-1 flex flex-col items-center gap-1.5 rounded-2xl py-4 transition-all active:scale-95"
              style={{
                background: btnGradient,
                boxShadow: btnShadow,
                border: '1px solid rgba(255,255,255,0.18)',
              }}>
              <span className="text-white">{btn.icon}</span>
              <span className="text-white" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.2px' }}>{btn.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Save contact — glassmorphism */}
      <a href={`/cards/${card.slug}/vcf`}
        className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl transition-all active:scale-[0.98]"
        style={isDark ? {
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255,255,255,0.14)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
          color: brand,
          fontSize: 15,
          fontWeight: 600,
        } : {
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1.5px solid ${brand}35`,
          boxShadow: `0 2px 12px ${brand}18`,
          color: brand,
          fontSize: 15,
          fontWeight: 600,
        }}>
        <UserPlus className="w-5 h-5" />
        Save Contact
      </a>
    </div>
  )
}
