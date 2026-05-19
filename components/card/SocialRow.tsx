'use client'

import { Globe } from 'lucide-react'
import { BRAND_ICON_MAP, BRAND_COLORS } from '@/components/social/BrandIcons'
import type { Card } from '@/lib/types'

type Props = { card: Card; isDark: boolean }

export default function SocialRow({ card, isDark }: Props) {
  const links = card.social_links.filter(s => s.url)
  if (!links.length) return null

  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {links.map(s => {
        const Icon = BRAND_ICON_MAP[s.platform]
        const brandColor = BRAND_COLORS[s.platform]
        const bg = brandColor
          ? `${brandColor}18`
          : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
        const iconColor = brandColor
          ?? (isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)')

        return (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: bg, color: iconColor }}
          >
            {Icon
              ? <Icon size={22} />
              : <Globe className="w-5 h-5" />
            }
          </a>
        )
      })}
    </div>
  )
}
