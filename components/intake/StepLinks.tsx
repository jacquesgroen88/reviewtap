'use client'

import { Globe, Camera, Users, Briefcase, Video, Music2, Star, Plus, Trash2 } from 'lucide-react'
import type { CardFormData, CustomLink } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: <Camera className="w-4 h-4" />, placeholder: 'https://instagram.com/yourhandle' },
  { key: 'facebook',  label: 'Facebook',  icon: <Users className="w-4 h-4" />,   placeholder: 'https://facebook.com/yourpage' },
  { key: 'linkedin',  label: 'LinkedIn',  icon: <Briefcase className="w-4 h-4" />, placeholder: 'https://linkedin.com/in/yourprofile' },
  { key: 'youtube',   label: 'YouTube',   icon: <Video className="w-4 h-4" />,    placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'tiktok',    label: 'TikTok',    icon: <Music2 className="w-4 h-4" />,   placeholder: 'https://tiktok.com/@yourhandle' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(120,120,128,0.18)',
  border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none',
}

const groupStyle: React.CSSProperties = {
  background: 'rgba(120,120,128,0.18)',
  borderRadius: '16px',
  overflow: 'hidden',
}

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '12px 16px',
  borderBottom: '1px solid rgba(84,84,88,0.35)',
}

const rowLastStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '12px 16px',
}

const inlineInputStyle: React.CSSProperties = {
  flex: 1, background: 'transparent', color: '#fff',
  fontSize: '14px', outline: 'none', border: 'none',
  caretColor: '#0a84ff',
}

export default function StepLinks({ data, onChange }: Props) {
  function setSocial(platform: string, url: string) {
    const rest = data.social_links.filter(s => s.platform !== platform)
    onChange({ social_links: url ? [...rest, { platform, url }] : rest })
  }
  function getSocial(p: string) { return data.social_links.find(s => s.platform === p)?.url ?? '' }

  function addCustomLink() { onChange({ custom_links: [...data.custom_links, { label: '', url: '' }] }) }
  function updateLink(i: number, patch: Partial<CustomLink>) {
    onChange({ custom_links: data.custom_links.map((l, idx) => idx === i ? { ...l, ...patch } : l) })
  }
  function removeLink(i: number) { onChange({ custom_links: data.custom_links.filter((_, idx) => idx !== i) }) }

  return (
    <div className="space-y-6">
      <Field icon={<Globe className="w-4 h-4" style={{ color: '#0a84ff' }} />} label="Website">
        <input type="url" value={data.website ?? ''} onChange={e => onChange({ website: e.target.value || null })}
          placeholder="https://yourwebsite.co.za" style={inputStyle} />
      </Field>

      <Field icon={<Star className="w-4 h-4" style={{ color: '#ffd60a' }} />} label="Google Review Link">
        <input type="url" value={data.google_review_url ?? ''} onChange={e => onChange({ google_review_url: e.target.value || null })}
          placeholder="https://g.page/r/your-review-link" style={inputStyle} />
        <p className="text-xs mt-1.5" style={{ color: 'rgba(235,235,245,0.30)' }}>Paste your Google review shortlink</p>
      </Field>

      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>Social Profiles</p>
        <div style={groupStyle}>
          {SOCIALS.map((s, i) => (
            <div key={s.key} style={i < SOCIALS.length - 1 ? rowStyle : rowLastStyle}>
              <span style={{ color: 'rgba(235,235,245,0.30)' }}>{s.icon}</span>
              <span style={{ width: '72px', fontSize: '14px', fontWeight: 500, flexShrink: 0, color: 'rgba(235,235,245,0.60)' }}>{s.label}</span>
              <input type="url" value={getSocial(s.key)} onChange={e => setSocial(s.key, e.target.value)}
                placeholder={s.placeholder} style={inlineInputStyle} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>Custom Links</p>
        {data.custom_links.map((link, i) => (
          <div key={i} style={groupStyle}>
            <div style={rowStyle}>
              <input type="text" value={link.label} onChange={e => updateLink(i, { label: e.target.value })}
                placeholder="Button label" style={{ ...inlineInputStyle, flex: 1 }} />
              <button type="button" onClick={() => removeLink(i)} style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Trash2 className="w-4 h-4" style={{ color: '#ff453a' }} />
              </button>
            </div>
            <div style={rowLastStyle}>
              <input type="url" value={link.url} onChange={e => updateLink(i, { url: e.target.value })}
                placeholder="https://…" style={{ ...inlineInputStyle, color: 'rgba(235,235,245,0.60)' }} />
            </div>
          </div>
        ))}
        {data.custom_links.length < 5 && (
          <button type="button" onClick={addCustomLink}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: '#0a84ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Plus className="w-4 h-4" /> Add Link
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>
        {icon}{label}
      </label>
      {children}
    </div>
  )
}
