'use client'

import { Camera, Users, Briefcase, Video, Music2, Globe, AtSign } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = { card: Card; isDark: boolean }

const ICONS: Record<string, React.ReactNode> = {
  instagram: <Camera className="w-5 h-5" />,
  facebook:  <Users className="w-5 h-5" />,
  linkedin:  <Briefcase className="w-5 h-5" />,
  youtube:   <Video className="w-5 h-5" />,
  tiktok:    <Music2 className="w-5 h-5" />,
  twitter:   <AtSign className="w-5 h-5" />,
  x:         <AtSign className="w-5 h-5" />,
}

export default function SocialRow({ card, isDark }: Props) {
  const links = card.social_links.filter(s => s.url)
  if (!links.length) return null

  const bg   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const text = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)'

  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {links.map(s => (
        <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: bg, color: text }}>
          {ICONS[s.platform] ?? <Globe className="w-5 h-5" />}
        </a>
      ))}
    </div>
  )
}
