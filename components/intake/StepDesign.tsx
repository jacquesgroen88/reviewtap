'use client'

import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

const PRESET_COLORS = [
  '#2563eb', // blue
  '#7c3aed', // violet
  '#db2777', // pink
  '#dc2626', // red
  '#ea580c', // orange
  '#16a34a', // green
  '#0891b2', // cyan
  '#475569', // slate
  '#000000', // black
  '#ffffff', // white
]

export default function StepDesign({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      {/* Theme toggle */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-white/70">Card Theme</p>
        <div className="grid grid-cols-2 gap-3">
          <ThemeCard
            theme="dark"
            selected={data.theme === 'dark'}
            onSelect={() => onChange({ theme: 'dark' })}
          />
          <ThemeCard
            theme="light"
            selected={data.theme === 'light'}
            onSelect={() => onChange({ theme: 'light' })}
          />
        </div>
      </div>

      {/* Brand colour */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-white/70">Accent Colour</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => onChange({ brand_color: color })}
              className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 active:scale-95"
              style={{
                backgroundColor: color,
                borderColor: data.brand_color === color ? 'white' : 'transparent',
                outline: data.brand_color === color ? '2px solid rgba(255,255,255,0.4)' : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
          {/* Custom colour */}
          <label className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform">
            <input
              type="color"
              value={data.brand_color}
              onChange={e => onChange({ brand_color: e.target.value })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-full h-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: data.brand_color }}
            >
              <span className="text-white/80 drop-shadow">+</span>
            </div>
          </label>
        </div>
        <p className="text-xs text-white/40">Used for buttons and highlights on your card</p>
      </div>

      {/* Preview swatch */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/70">Preview</p>
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ backgroundColor: data.theme === 'dark' ? '#0f0f0f' : '#ffffff' }}
        >
          <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: data.brand_color }}
          />
          <div className="flex-1 space-y-1">
            <div
              className="h-2.5 rounded-full w-32"
              style={{ backgroundColor: data.theme === 'dark' ? '#ffffff' : '#111111' }}
            />
            <div
              className="h-2 rounded-full w-20 opacity-40"
              style={{ backgroundColor: data.theme === 'dark' ? '#ffffff' : '#111111' }}
            />
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: data.brand_color }}
          >
            Tap
          </div>
        </div>
      </div>
    </div>
  )
}

function ThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: 'dark' | 'light'
  selected: boolean
  onSelect: () => void
}) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative rounded-2xl p-4 border-2 transition-all ${
        selected ? 'border-white scale-[1.02]' : 'border-white/10 hover:border-white/30'
      }`}
      style={{ backgroundColor: isDark ? '#0f0f0f' : '#f8f8f8' }}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className="space-y-2">
        <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: isDark ? '#333' : '#ddd' }} />
        <div className="h-1.5 rounded-full w-3/4 mx-auto" style={{ backgroundColor: isDark ? '#555' : '#bbb' }} />
        <div className="h-1 rounded-full w-1/2 mx-auto" style={{ backgroundColor: isDark ? '#333' : '#ccc' }} />
      </div>
      <p
        className="mt-3 text-xs font-semibold text-center"
        style={{ color: isDark ? '#fff' : '#111' }}
      >
        {isDark ? '🌑 Dark' : '☀️ Light'}
      </p>
    </button>
  )
}
