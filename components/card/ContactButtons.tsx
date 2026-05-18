'use client'

import { Phone, Mail, MessageCircle, UserPlus } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = {
  card: Card
  isDark: boolean
}

export default function ContactButtons({ card, isDark }: Props) {
  const buttons = [
    card.phone && {
      label: 'Call',
      icon: <Phone className="w-5 h-5" />,
      href: `tel:${card.phone}`,
    },
    card.email && {
      label: 'Email',
      icon: <Mail className="w-5 h-5" />,
      href: `mailto:${card.email}`,
    },
    card.whatsapp && {
      label: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      href: `https://wa.me/${card.whatsapp.replace(/\D/g, '')}`,
    },
  ].filter(Boolean) as { label: string; icon: React.ReactNode; href: string }[]

  if (buttons.length === 0) return null

  return (
    <div className="w-full space-y-3">
      {/* Row of icon+label buttons */}
      <div className="flex gap-3 justify-center">
        {buttons.map(btn => (
          <a
            key={btn.label}
            href={btn.href}
            className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl font-medium text-sm transition-all active:scale-95 hover:opacity-90"
            style={{ backgroundColor: card.brand_color, color: '#fff' }}
          >
            {btn.icon}
            <span className="text-xs font-semibold">{btn.label}</span>
          </a>
        ))}
      </div>

      {/* Save contact — full width */}
      <a
        href={`/cards/${card.slug}/vcf`}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-base border-2 transition-all active:scale-95 hover:opacity-80"
        style={{
          borderColor: card.brand_color,
          color: isDark ? '#fff' : '#111',
        }}
      >
        <UserPlus className="w-5 h-5" style={{ color: card.brand_color }} />
        Save Contact
      </a>
    </div>
  )
}
