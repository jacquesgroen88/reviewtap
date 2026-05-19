'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

type Props = {
  name: string
  url: string
  accent: string
}

export default function ShareButton({ name, url, accent }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${name}'s Digital Card`,
          text: `Check out ${name}'s digital business card`,
          url,
        })
        return
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Ignore
    }
  }

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-5 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all active:scale-95"
      style={{
        background: accent,
        color: '#fff',
        fontSize: '14px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        boxShadow: `0 4px 20px ${accent}55`,
        zIndex: 50,
      }}
      aria-label="Share card"
    >
      {copied
        ? <><Check className="w-4 h-4" /> Copied!</>
        : <><Share2 className="w-4 h-4" /> Share</>
      }
    </button>
  )
}
