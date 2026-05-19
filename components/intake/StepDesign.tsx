'use client'

import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

const PRESET_COLORS = [
  { hex: '#0a84ff', name: 'Blue' },
  { hex: '#30d158', name: 'Green' },
  { hex: '#5e5ce6', name: 'Indigo' },
  { hex: '#bf5af2', name: 'Purple' },
  { hex: '#ff375f', name: 'Pink' },
  { hex: '#ff9f0a', name: 'Orange' },
  { hex: '#ffd60a', name: 'Yellow' },
  { hex: '#64d2ff', name: 'Cyan' },
  { hex: '#ffffff', name: 'White' },
  { hex: '#636366', name: 'Gray' },
]

export default function StepDesign({ data, onChange }: Props) {
  const isDark = data.theme === 'dark'

  return (
    <div className="space-y-8">
      {/* Theme */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'var(--label2)' }}>Card Theme</p>
        <div className="grid grid-cols-2 gap-3">
          <ThemeCard theme="dark" selected={data.theme === 'dark'} onSelect={() => onChange({ theme: 'dark' })} accent={data.brand_color} />
          <ThemeCard theme="light" selected={data.theme === 'light'} onSelect={() => onChange({ theme: 'light' })} accent={data.brand_color} />
        </div>
      </div>

      {/* Accent colour */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'var(--label2)' }}>Accent Colour</p>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COLORS.map(c => {
            const sel = data.brand_color.toLowerCase() === c.hex.toLowerCase()
            return (
              <button key={c.hex} type="button" title={c.name} onClick={() => onChange({ brand_color: c.hex })}
                className="w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: c.hex,
                  boxShadow: sel
                    ? `0 0 0 2px var(--bg), 0 0 0 4px ${c.hex}`
                    : '0 0 0 1.5px rgba(255,255,255,0.1)',
                  transform: sel ? 'scale(1.12)' : undefined,
                }}
              />
            )
          })}
          {/* Custom */}
          <label className="relative w-9 h-9 rounded-full overflow-hidden cursor-pointer hover:scale-110 active:scale-95 transition-transform"
            style={{ boxShadow: '0 0 0 1.5px rgba(255,255,255,0.15)', backgroundColor: data.brand_color }}>
            <input type="color" value={data.brand_color} onChange={e => onChange({ brand_color: e.target.value })}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>+</span>
            </div>
          </label>
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: 'var(--label2)' }}>Preview</p>
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: isDark ? '#111' : '#f9f9f9' }}>
          {/* Avatar row */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full" style={{ background: data.brand_color }} />
            <div className="space-y-1.5">
              <div className="h-3 rounded-full w-24" style={{ background: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }} />
              <div className="h-2 rounded-full w-16" style={{ background: data.brand_color, opacity: 0.8 }} />
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            {['Call', 'Email', 'WhatsApp'].map(b => (
              <div key={b} className="flex-1 rounded-xl py-3 flex flex-col items-center gap-1"
                style={{ background: data.brand_color }}>
                <div className="w-4 h-4 rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />
                <span className="text-[10px] font-semibold text-white">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ThemeCard({ theme, selected, onSelect, accent }: {
  theme: 'dark' | 'light'; selected: boolean; onSelect: () => void; accent: string
}) {
  const dark = theme === 'dark'
  return (
    <button type="button" onClick={onSelect}
      className="relative rounded-2xl p-4 border-2 text-left transition-all active:scale-95"
      style={{
        background: dark ? '#111' : '#f5f5f5',
        borderColor: selected ? 'white' : 'transparent',
        boxShadow: selected ? 'none' : '0 0 0 1.5px rgba(255,255,255,0.1)',
      }}>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="space-y-2 mb-3">
        <div className="w-7 h-7 rounded-full" style={{ background: accent }} />
        <div className="h-2 rounded-full w-14" style={{ background: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }} />
        <div className="h-1.5 rounded-full w-9" style={{ background: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }} />
      </div>
      <p className="text-xs font-semibold" style={{ color: dark ? '#fff' : '#111' }}>
        {dark ? '🌑 Dark' : '☀️ Light'}
      </p>
    </button>
  )
}
