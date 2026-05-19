'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[#080808] flex items-center justify-center px-5">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-white/60" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-sm text-white/40 mt-1">ReviewTap Card Builder</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(120,120,128,0.18)',
              border: '1.5px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none',
            }}
            autoFocus
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={!password || loading}
            className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
