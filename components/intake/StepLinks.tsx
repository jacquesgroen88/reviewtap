'use client'

import { Globe, Camera, Users, Briefcase, Video, Music2, Star, Plus, Trash2 } from 'lucide-react'
import type { CardFormData, CustomLink } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: <Camera className="w-4 h-4" />, placeholder: 'https://instagram.com/yourhandle' },
  { key: 'facebook', label: 'Facebook', icon: <Users className="w-4 h-4" />, placeholder: 'https://facebook.com/yourpage' },
  { key: 'linkedin', label: 'LinkedIn', icon: <Briefcase className="w-4 h-4" />, placeholder: 'https://linkedin.com/in/yourprofile' },
  { key: 'youtube', label: 'YouTube', icon: <Video className="w-4 h-4" />, placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'tiktok', label: 'TikTok', icon: <Music2 className="w-4 h-4" />, placeholder: 'https://tiktok.com/@yourhandle' },
]

export default function StepLinks({ data, onChange }: Props) {
  function setSocial(platform: string, url: string) {
    const rest = data.social_links.filter(s => s.platform !== platform)
    const updated = url ? [...rest, { platform, url }] : rest
    onChange({ social_links: updated })
  }

  function getSocial(platform: string) {
    return data.social_links.find(s => s.platform === platform)?.url ?? ''
  }

  function addCustomLink() {
    onChange({ custom_links: [...data.custom_links, { label: '', url: '' }] })
  }

  function updateCustomLink(index: number, patch: Partial<CustomLink>) {
    const updated = data.custom_links.map((l, i) => i === index ? { ...l, ...patch } : l)
    onChange({ custom_links: updated })
  }

  function removeCustomLink(index: number) {
    onChange({ custom_links: data.custom_links.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <Field icon={<Globe className="w-4 h-4" />} label="Website">
        <input
          type="url"
          value={data.website ?? ''}
          onChange={e => onChange({ website: e.target.value })}
          placeholder="https://yourwebsite.co.za"
          className="input-field"
        />
      </Field>

      <Field icon={<Star className="w-4 h-4 text-yellow-400" />} label="Google Review Link">
        <input
          type="url"
          value={data.google_review_url ?? ''}
          onChange={e => onChange({ google_review_url: e.target.value })}
          placeholder="https://g.page/r/your-review-link"
          className="input-field"
        />
        <p className="text-xs text-white/40">Paste your Google review URL here</p>
      </Field>

      <div className="space-y-3">
        <p className="flex items-center gap-1.5 text-sm font-medium text-white/70">
          Social Profiles
        </p>
        {SOCIALS.map(s => (
          <div key={s.key} className="flex items-center gap-2">
            <span className="text-white/50 w-5 flex-shrink-0">{s.icon}</span>
            <input
              type="url"
              value={getSocial(s.key)}
              onChange={e => setSocial(s.key, e.target.value)}
              placeholder={s.placeholder}
              className="input-field flex-1 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-white/70">Custom Links</p>
        {data.custom_links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <input
                type="text"
                value={link.label}
                onChange={e => updateCustomLink(i, { label: e.target.value })}
                placeholder="Button label"
                className="input-field text-sm"
              />
              <input
                type="url"
                value={link.url}
                onChange={e => updateCustomLink(i, { url: e.target.value })}
                placeholder="https://..."
                className="input-field text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => removeCustomLink(i)}
              className="self-start mt-0.5 p-2 text-white/30 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {data.custom_links.length < 5 && (
          <button
            type="button"
            onClick={addCustomLink}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add custom link
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-white/70">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}
