'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2, Sparkles, Check } from 'lucide-react'
import StepPersonal from './StepPersonal'
import StepCover from './StepCover'
import StepContact from './StepContact'
import StepLinks from './StepLinks'
import StepDesign from './StepDesign'
import StepPreview from './StepPreview'
import type { CardFormData } from '@/lib/types'
import { generateSlug } from '@/lib/slug'

const STEPS = [
  { title: 'About You',   subtitle: 'Name & personal details' },
  { title: 'Cover Photo', subtitle: 'Optional banner image' },
  { title: 'Contact',     subtitle: 'How people reach you' },
  { title: 'Links',       subtitle: 'Website & social profiles' },
  { title: 'Design',      subtitle: 'Style your card' },
  { title: 'Preview',     subtitle: "Looks good? Let's go." },
]

const DEFAULT_DATA: CardFormData = {
  slug: '', name: '', job_title: null, company: null, bio: null,
  photo_url: null, photo_x: 50, photo_y: 50,
  cover_url: null, cover_x: 50, cover_y: 50,
  phone: null, email: null, whatsapp: null,
  website: null, google_review_url: null,
  social_links: [], custom_links: [],
  theme: 'dark', brand_color: '#0a84ff', order_ref: null,
}

type Props = {
  orderRef?: string
  // Edit mode
  editMode?: boolean
  initialData?: Partial<CardFormData>
  cardId?: string
  editToken?: string
}

export default function IntakeForm({ orderRef, editMode, initialData, cardId, editToken }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<CardFormData>({
    ...DEFAULT_DATA,
    order_ref: orderRef ?? null,
    ...(initialData ?? {}),
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function update(patch: Partial<CardFormData>) { setData(prev => ({ ...prev, ...patch })) }

  function canAdvance() { return step === 0 ? data.name.trim().length > 0 : true }

  function next() {
    if (!canAdvance()) return
    if (step === 0 && !data.slug) update({ slug: generateSlug(data.name) })
    setStep(s => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo(0, 0)
  }
  function back() { setStep(s => Math.max(s - 1, 0)); window.scrollTo(0, 0) }

  async function submit() {
    setSubmitting(true)
    setError(null)
    try {
      if (editMode && cardId) {
        // PATCH existing card
        const res = await fetch(`/api/cards/${cardId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, edit_token: editToken }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to update card')
        setSuccess(true)
        setTimeout(() => router.push(`/cards/${json.slug}`), 1800)
      } else {
        // POST new card
        const payload = { ...data, slug: data.slug || generateSlug(data.name) }
        const res = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to create card')
        router.push(`/cards/${json.slug}?new=1`)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const isLast = step === STEPS.length - 1
  const accent = data.brand_color

  if (success) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5 gap-6"
        style={{ background: '#000' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: `${accent}20`, border: `2px solid ${accent}` }}>
          <Check className="w-8 h-8" style={{ color: accent }} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Card Updated!</h1>
          <p className="text-sm" style={{ color: 'rgba(235,235,245,0.50)' }}>
            Redirecting you to your card…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Status bar spacer + header ── */}
      <div className="pt-safe px-5 pt-6 pb-3 space-y-4 sticky top-0 z-10"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        {/* Step text */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: accent, opacity: 0.85 }}>
              {editMode ? 'Editing' : 'Step'} {step + 1} of {STEPS.length}
            </p>
            <h1 className="text-2xl font-bold tracking-tight">{STEPS[step].title}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--label3)' }}>{STEPS[step].subtitle}</p>
          </div>
        </div>

        {/* Segmented progress */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-400"
              style={{ background: i <= step ? accent : 'rgba(255,255,255,0.12)' }} />
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10">
        <div key={step} className="step-enter">
          {step === 0 && <StepPersonal data={data} onChange={update} />}
          {step === 1 && <StepCover    data={data} onChange={update} />}
          {step === 2 && <StepContact  data={data} onChange={update} />}
          {step === 3 && <StepLinks    data={data} onChange={update} />}
          {step === 4 && <StepDesign   data={data} onChange={update} />}
          {step === 5 && <StepPreview  data={data} />}
        </div>
      </div>

      {/* ── Footer nav ── */}
      <div className="px-5 pb-safe pt-4 border-t pb-8 space-y-3"
        style={{ borderColor: 'var(--sep)', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        {error && (
          <div className="text-sm text-center font-medium px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,69,58,0.15)', color: '#ff453a' }}>
            {error}
          </div>
        )}
        <div className="flex gap-3">
          {step > 0 && (
            <button type="button" onClick={back}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '16px 20px', borderRadius: '9999px',
                background: 'rgba(120,120,128,0.18)', color: '#fff',
                fontSize: '15px', fontWeight: 500, border: 'none', cursor: 'pointer',
              }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button
            type="button"
            onClick={isLast ? submit : next}
            disabled={!canAdvance() || submitting}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              flex: 1, padding: '16px 24px', borderRadius: '9999px',
              background: (canAdvance() && !submitting) ? accent : 'rgba(120,120,128,0.25)',
              color: '#fff', fontSize: '15px', fontWeight: 600,
              border: 'none', cursor: (canAdvance() && !submitting) ? 'pointer' : 'not-allowed',
              opacity: (canAdvance() && !submitting) ? 1 : 0.5,
            }}
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {editMode ? 'Saving changes…' : 'Creating your card…'}</>
            ) : isLast ? (
              editMode
                ? <><Check className="w-4 h-4" /> Save Changes</>
                : <><Sparkles className="w-4 h-4" /> Create My Card</>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
