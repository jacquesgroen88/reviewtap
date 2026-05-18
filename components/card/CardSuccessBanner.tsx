'use client'

import { useState } from 'react'
import { CheckCircle2, Copy, Share2, X } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = { card: Card }

export default function CardSuccessBanner({ card }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  if (dismissed) return null

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/cards/${card.slug}`
    : `/cards/${card.slug}`

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: `${card.name}'s Card`, url })
    } else {
      copy()
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 p-4">
      <div className="max-w-sm mx-auto bg-green-950 border border-green-700 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-100">Your card is live! 🎉</p>
              <p className="text-xs text-green-300 mt-0.5 break-all">{url}</p>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="text-green-600 hover:text-green-400 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={copy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-green-800 text-green-100 text-sm font-medium hover:bg-green-700 transition-colors active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={share}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
