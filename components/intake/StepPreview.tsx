'use client'

import CardPage from '@/components/card/CardPage'
import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
}

export default function StepPreview({ data }: Props) {
  const previewCard = {
    ...data,
    id: 'preview',
    is_active: true,
    edit_token: null,
    layout: data.layout ?? 'classic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50 text-center">
        This is how your card will look. You can go back to make changes.
      </p>
      <div className="rounded-2xl overflow-hidden border border-white/10 max-w-sm mx-auto">
        <div className="transform scale-[0.85] origin-top" style={{ height: '680px', overflow: 'hidden' }}>
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', width: '117.6%', marginLeft: '-8.8%' }}>
            <CardPage card={previewCard} preview />
          </div>
        </div>
      </div>
    </div>
  )
}
