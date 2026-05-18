'use client'

import { Camera, Users, Briefcase, Video, Music2, Globe, AtSign } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = {
  card: Card
  isDark: boolean
}

const ICONS: Record<string, React.ReactNode> = {
  instagram: <Camera className="w-5 h-5" />,
  facebook: <Users className="w-5 h-5" />,
  linkedin: <Briefcase className="w-5 h-5" />,
  youtube: <Video className="w-5 h-5" />,
  tiktok: <Music2 className="w-5 h-5" />,
  twitter: <AtSign className="w-5 h-5" />,
  x: <AtSign className="w-5 h-5" />,
}

export default function SocialRow({ card, isDark }: Props) {
  const links = card.social_links.filter(s => s.url)
  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {links.map(s => (
        <a
          key={s.platform}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-95 hover:opacity-80"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          }}
        >
          {ICONS[s.platform] ?? <Globe className="w-5 h-5" />}
        </a>
      ))}
    </div>
  )
}
