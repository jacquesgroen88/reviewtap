'use client'

import { Phone, Mail, MessageCircle } from 'lucide-react'
import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

export default function StepContact({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-white/50">
        These will appear as tap-to-action buttons on your card.
      </p>

      <Field icon={<Phone className="w-4 h-4" />} label="Phone Number">
        <input
          type="tel"
          value={data.phone ?? ''}
          onChange={e => onChange({ phone: e.target.value })}
          placeholder="+27 82 123 4567"
          className="input-field"
        />
      </Field>

      <Field icon={<Mail className="w-4 h-4" />} label="Email Address">
        <input
          type="email"
          value={data.email ?? ''}
          onChange={e => onChange({ email: e.target.value })}
          placeholder="jane@acmeco.co.za"
          className="input-field"
        />
      </Field>

      <Field icon={<MessageCircle className="w-4 h-4" />} label="WhatsApp Number">
        <input
          type="tel"
          value={data.whatsapp ?? ''}
          onChange={e => onChange({ whatsapp: e.target.value })}
          placeholder="+27 82 123 4567"
          className="input-field"
        />
        <p className="text-xs text-white/40">Include country code, e.g. +27</p>
      </Field>
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
