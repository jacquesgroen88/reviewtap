'use client'

import { Phone, Mail, MessageCircle, UserPlus } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = { card: Card; isDark: boolean }

export default function ContactButtons({ card, isDark }: Props) {
  const btns = [
    card.phone    && { label: 'Call',      icon: <Phone className="w-6 h-6" />,          href: `tel:${card.phone}` },
    card.email    && { label: 'Email',     icon: <Mail className="w-6 h-6" />,           href: `mailto:${card.email}` },
    card.whatsapp && { label: 'WhatsApp',  icon: <MessageCircle className="w-6 h-6" />, href: `https://wa.me/${card.whatsapp.replace(/\D/g, '')}` },
  ].filter(Boolean) as { label: string; icon: React.ReactNode; href: string }[]

  const bg   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const text = isDark ? '#fff' : '#000'

  return (
    <div className="w-full space-y-3">
      {/* Action tiles row – iPhone contact style */}
      {btns.length > 0 && (
        <div className="flex gap-2.5">
          {btns.map(btn => (
            <a key={btn.label} href={btn.href}
              className="flex-1 flex flex-col items-center gap-1.5 rounded-2xl py-4 transition-all active:scale-95"
              style={{ background: card.brand_color }}>
              <span className="text-white">{btn.icon}</span>
              <span className="text-xs font-semibold text-white">{btn.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Save contact – full-width pill */}
      <a href={`/cards/${card.slug}/vcf`}
        className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-semibold text-[15px] transition-all active:scale-[0.98]"
        style={{ background: bg, color: card.brand_color, border: `1.5px solid ${card.brand_color}40` }}>
        <UserPlus className="w-5 h-5" />
        Save Contact
      </a>
    </div>
  )
}
