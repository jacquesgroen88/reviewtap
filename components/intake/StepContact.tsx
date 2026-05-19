'use client'

import { Phone, Mail, MessageCircle } from 'lucide-react'
import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(120,120,128,0.18)',
  border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none',
}

export default function StepContact({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: 'rgba(235,235,245,0.30)' }}>
        These appear as action buttons on your card — people tap to call, email, or message you directly.
      </p>

      <Field icon={<Phone className="w-4 h-4" style={{ color: '#30d158' }} />} label="Phone Number">
        <input
          type="tel"
          value={data.phone ?? ''}
          onChange={e => onChange({ phone: e.target.value || null })}
          placeholder="+27 82 123 4567"
          style={inputStyle}
          autoComplete="tel"
        />
      </Field>

      <Field icon={<Mail className="w-4 h-4" style={{ color: '#0a84ff' }} />} label="Email Address">
        <input
          type="email"
          value={data.email ?? ''}
          onChange={e => onChange({ email: e.target.value || null })}
          placeholder="jane@acmeco.co.za"
          style={inputStyle}
          autoComplete="email"
        />
      </Field>

      <Field icon={<MessageCircle className="w-4 h-4" style={{ color: '#30d158' }} />} label="WhatsApp Number">
        <input
          type="tel"
          value={data.whatsapp ?? ''}
          onChange={e => onChange({ whatsapp: e.target.value || null })}
          placeholder="+27 82 123 4567"
          style={inputStyle}
          autoComplete="tel"
        />
        <p className="text-xs mt-1.5" style={{ color: 'rgba(235,235,245,0.30)' }}>
          Include country code, e.g. +27
        </p>
      </Field>
    </div>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(235,235,245,0.60)' }}>
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}
