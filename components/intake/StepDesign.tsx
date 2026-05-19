'use client'

import CardPage from '@/components/card/CardPage'
import type { CardFormData, Card } from '@/lib/types'

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

const LAYOUTS: Array<{ key: 'classic' | 'minimal' | 'bold'; label: string }> = [
  { key: 'classic', label: 'Classic' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'bold',    label: 'Bold' },
]

export default function StepDesign({ data, onChange }: Props) {
  const isDark  = data.theme === 'dark'
  const layout  = data.layout ?? 'classic'
  const accent  = data.brand_color

  // Build a preview-safe Card object from form data
  const previewCard: Card = {
    ...data,
    id: 'preview',
    is_active: true,
    edit_token: null,
    layout: layout,
    // Guarantee numeric types for positions
    photo_x: data.photo_x ?? 50,
    photo_y: data.photo_y ?? 50,
    cover_x: data.cover_x ?? 50,
    cover_y: data.cover_y ?? 50,
    created_at: '',
    updated_at: '',
  }

  return (
    <div className="space-y-8">

      {/* ── Layout ── */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>Card Layout</p>
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map(l => (
            <LayoutThumb
              key={l.key}
              layout={l.key}
              label={l.label}
              selected={layout === l.key}
              accent={accent}
              onSelect={() => onChange({ layout: l.key })}
            />
          ))}
        </div>
      </div>

      {/* ── Theme ── */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>Card Theme</p>
        <div className="grid grid-cols-2 gap-3">
          <ThemeCard theme="dark"  selected={data.theme === 'dark'}  onSelect={() => onChange({ theme: 'dark' })}  accent={accent} />
          <ThemeCard theme="light" selected={data.theme === 'light'} onSelect={() => onChange({ theme: 'light' })} accent={accent} />
        </div>
      </div>

      {/* ── Accent colour ── */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>Accent Colour</p>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COLORS.map(c => {
            const sel = data.brand_color.toLowerCase() === c.hex.toLowerCase()
            return (
              <button key={c.hex} type="button" title={c.name} onClick={() => onChange({ brand_color: c.hex })}
                className="w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: c.hex,
                  boxShadow: sel ? `0 0 0 2px #000, 0 0 0 4px ${c.hex}` : '0 0 0 1.5px rgba(255,255,255,0.1)',
                  transform: sel ? 'scale(1.12)' : undefined,
                }}
              />
            )
          })}
          {/* Custom colour picker */}
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

      {/* ── Live preview ── */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>Live Preview</p>
        <div className="rounded-2xl overflow-hidden border max-w-sm mx-auto"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          {/* Scaled container: 65% scale */}
          <div style={{ height: '520px', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              transform: 'scale(0.65)',
              transformOrigin: 'top center',
              width: '153.8%',
              marginLeft: '-26.9%',
              pointerEvents: 'none',
            }}>
              <CardPage card={previewCard} preview />
            </div>
          </div>
        </div>
        <p className="text-xs text-center" style={{ color: 'rgba(235,235,245,0.25)' }}>
          Updates as you change settings above
        </p>
      </div>
    </div>
  )
}

/* ── Layout thumbnail ── */
function LayoutThumb({
  layout, label, selected, accent, onSelect,
}: {
  layout: 'classic' | 'minimal' | 'bold'
  label: string
  selected: boolean
  accent: string
  onSelect: () => void
}) {
  return (
    <button type="button" onClick={onSelect}
      className="relative rounded-2xl overflow-hidden border-2 text-left transition-all active:scale-95 flex flex-col"
      style={{
        borderColor: selected ? accent : 'rgba(255,255,255,0.10)',
        background: '#111',
        height: '120px',
      }}>
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center z-10"
          style={{ background: accent }}>
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Layout mockup */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-hidden p-1.5">
        {layout === 'classic' && <ClassicMockup accent={accent} />}
        {layout === 'minimal' && <MinimalMockup accent={accent} />}
        {layout === 'bold'    && <BoldMockup    accent={accent} />}
      </div>

      {/* Label */}
      <p className="text-center text-[10px] font-semibold pb-1.5"
        style={{ color: selected ? accent : 'rgba(255,255,255,0.50)' }}>
        {label}
      </p>
    </button>
  )
}

function ClassicMockup({ accent }: { accent: string }) {
  return (
    <div className="w-full flex flex-col items-center" style={{ gap: '3px' }}>
      {/* Cover bar */}
      <div className="w-full rounded-md" style={{ height: '22px', background: `${accent}60` }} />
      {/* Avatar overlapping */}
      <div className="w-8 h-8 rounded-full border-2 -mt-4 z-10"
        style={{ background: accent, borderColor: '#111' }} />
      {/* Name lines */}
      <div className="w-14 h-1.5 rounded-full mt-0.5" style={{ background: 'rgba(255,255,255,0.5)' }} />
      <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
      {/* Buttons row */}
      <div className="flex gap-1 mt-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="rounded" style={{ width: '16px', height: '10px', background: accent }} />
        ))}
      </div>
    </div>
  )
}

function MinimalMockup({ accent }: { accent: string }) {
  return (
    <div className="w-full flex flex-col items-center" style={{ gap: '4px', paddingTop: '8px' }}>
      {/* Large avatar */}
      <div className="w-10 h-10 rounded-full border-2" style={{ background: accent, borderColor: accent }} />
      {/* Name lines */}
      <div className="w-14 h-1.5 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.5)' }} />
      <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
      {/* Accent divider */}
      <div className="w-6 h-0.5 rounded-full mt-0.5" style={{ background: accent }} />
      {/* Buttons row */}
      <div className="flex gap-1 mt-1">
        {[0,1,2].map(i => (
          <div key={i} className="rounded" style={{ width: '16px', height: '10px', background: accent }} />
        ))}
      </div>
    </div>
  )
}

function BoldMockup({ accent }: { accent: string }) {
  return (
    <div className="w-full flex flex-col items-center" style={{ gap: '0px' }}>
      {/* Bold color block */}
      <div className="w-full rounded-md flex flex-col items-center justify-end pb-2"
        style={{ height: '54px', background: accent, borderRadius: '6px 6px 10px 10px' }}>
        <div className="w-8 h-8 rounded-full border-2" style={{ background: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.9)' }} />
        <div className="w-12 h-1 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.7)' }} />
      </div>
      {/* Buttons row */}
      <div className="flex gap-1 mt-2">
        {[0,1,2].map(i => (
          <div key={i} className="rounded" style={{ width: '16px', height: '10px', background: accent }} />
        ))}
      </div>
    </div>
  )
}

/* ── Theme thumbnail ── */
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
