'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import StepPersonal from './StepPersonal'
import StepContact from './StepContact'
import StepLinks from './StepLinks'
import StepDesign from './StepDesign'
import StepPreview from './StepPreview'
import type { CardFormData } from '@/lib/types'
import { generateSlug } from '@/lib/slug'

const STEPS = [
  { title: 'About You', subtitle: 'Your name and personal details' },
  { title: 'Contact', subtitle: 'How people can reach you' },
  { title: 'Links', subtitle: 'Your website and social profiles' },
  { title: 'Design', subtitle: 'Choose your card style' },
  { title: 'Preview', subtitle: 'Review before creating' },
]

const DEFAULT_DATA: CardFormData = {
  slug: '',
  name: '',
  job_title: null,
  company: null,
  bio: null,
  photo_url: null,
  phone: null,
  email: null,
  whatsapp: null,
  website: null,
  google_review_url: null,
  social_links: [],
  custom_links: [],
  theme: 'dark',
  brand_color: '#2563eb',
  order_ref: null,
}

export default function IntakeForm({ orderRef }: { orderRef?: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<CardFormData>({ ...DEFAULT_DATA, order_ref: orderRef ?? null })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(patch: Partial<CardFormData>) {
    setData(prev => ({ ...prev, ...patch }))
  }

  function canAdvance(): boolean {
    if (step === 0) return data.name.trim().length > 0
    return true
  }

  function next() {
    if (!canAdvance()) return
    if (step === 0 && !data.slug) {
      update({ slug: generateSlug(data.name) })
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  function back() {
    setStep(s => Math.max(s - 1, 0))
  }

  async function submit() {
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...data, slug: data.slug || generateSlug(data.name) }
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to create card')
      router.push(`/cards/${json.slug}?new=1`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const isLast = step === STEPS.length - 1
  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-dvh bg-[#080808] text-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-safe-top pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{STEPS[step].title}</h1>
            <p className="text-sm text-white/50">{STEPS[step].subtitle}</p>
          </div>
          <span className="text-sm text-white/40 font-mono">{step + 1}/{STEPS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: data.brand_color }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div
          key={step}
          className="animate-in fade-in slide-in-from-right-4 duration-200"
        >
          {step === 0 && <StepPersonal data={data} onChange={update} />}
          {step === 1 && <StepContact data={data} onChange={update} />}
          {step === 2 && <StepLinks data={data} onChange={update} />}
          {step === 3 && <StepDesign data={data} onChange={update} />}
          {step === 4 && <StepPreview data={data} />}
        </div>
      </div>

      {/* Footer nav */}
      <div className="px-5 pb-safe-bottom pb-6 pt-4 space-y-3 border-t border-white/5">
        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-1.5 px-5 py-3.5 rounded-full border border-white/15 text-white/70 hover:border-white/40 hover:text-white transition-all active:scale-95 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={isLast ? submit : next}
            disabled={!canAdvance() || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: data.brand_color }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating your card…
              </>
            ) : isLast ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Create My Card
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
