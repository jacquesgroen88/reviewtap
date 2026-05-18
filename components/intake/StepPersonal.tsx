'use client'

import { useRef, useState } from 'react'
import { User, Briefcase, Building2, FileText, Camera, Upload } from 'lucide-react'
import type { CardFormData } from '@/lib/types'

type Props = {
  data: CardFormData
  onChange: (data: Partial<CardFormData>) => void
}

export default function StepPersonal({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url } = await res.json()
      onChange({ photo_url: url })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Photo upload */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-white/30 bg-white/5 flex items-center justify-center cursor-pointer hover:border-white/60 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {data.photo_url ? (
            <img src={data.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-white/40" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          {data.photo_url ? 'Change photo' : 'Upload profile photo'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      <Field icon={<User className="w-4 h-4" />} label="Full Name *">
        <input
          type="text"
          value={data.name}
          onChange={e => onChange({ name: e.target.value })}
          placeholder="Jane Smith"
          className="input-field"
          required
        />
      </Field>

      <Field icon={<Briefcase className="w-4 h-4" />} label="Job Title">
        <input
          type="text"
          value={data.job_title ?? ''}
          onChange={e => onChange({ job_title: e.target.value })}
          placeholder="Marketing Manager"
          className="input-field"
        />
      </Field>

      <Field icon={<Building2 className="w-4 h-4" />} label="Company">
        <input
          type="text"
          value={data.company ?? ''}
          onChange={e => onChange({ company: e.target.value })}
          placeholder="Acme Co."
          className="input-field"
        />
      </Field>

      <Field icon={<FileText className="w-4 h-4" />} label="Short Bio">
        <textarea
          value={data.bio ?? ''}
          onChange={e => onChange({ bio: e.target.value })}
          placeholder="Tell people a little about yourself..."
          rows={3}
          className="input-field resize-none"
        />
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
