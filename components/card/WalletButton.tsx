'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

type Props = { slug: string }

export default function WalletButton({ slug }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch(`/api/wallet/${slug}`)
      const { url, error } = await res.json()
      if (error || !url) throw new Error(error ?? 'Failed to generate pass')
      window.open(url, '_blank')
    } catch {
      // Silently fail — user can try again
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl transition-all active:scale-[0.98]"
      style={{
        background: '#000',
        color: '#fff',
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: '14px',
        fontWeight: 600,
      }}
      aria-label="Add to Google Wallet"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        /* Official Google Wallet badge icon (simplified) */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="white" fillOpacity="0.15"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white"/>
          <path d="M7 8h3v2H7V8zm0 3h3v2H7v-2zm0 3h3v2H7v-2zm7-6h3v2h-3V8zm0 3h3v2h-3v-2zm0 3h3v2h-3v-2z" fill="white" opacity="0"/>
          <text x="4" y="16" fontSize="10" fontWeight="700" fill="white" fontFamily="sans-serif">G Pay</text>
        </svg>
      )}
      Add to Google Wallet
    </button>
  )
}
