'use client'

import { useState } from 'react'
import { ExternalLink, Edit2, Copy, ToggleLeft, ToggleRight, Trash2, Check, Link2 } from 'lucide-react'
import type { Card } from '@/lib/types'

type Props = {
  cards: Card[]
  leadCounts?: Record<string, number>
}

export default function CardTable({ cards: initial, leadCounts = {} }: Props) {
  const [cards, setCards] = useState(initial)
  const [copied, setCopied] = useState<string | null>(null)
  const [copiedEdit, setCopiedEdit] = useState<string | null>(null)

  async function copy(slug: string) {
    const url = `${window.location.origin}/cards/${slug}`
    await navigator.clipboard.writeText(url)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }

  async function copyEditLink(id: string, editToken: string | null) {
    if (!editToken) return
    const url = `${window.location.origin}/edit/${editToken}`
    await navigator.clipboard.writeText(url)
    setCopiedEdit(id)
    setTimeout(() => setCopiedEdit(null), 2000)
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    })
    setCards(c => c.map(card => card.id === id ? { ...card, is_active: !current } : card))
  }

  async function deleteCard(id: string) {
    if (!confirm('Delete this card? This cannot be undone.')) return
    await fetch(`/api/admin/cards/${id}`, { method: 'DELETE' })
    setCards(c => c.filter(card => card.id !== id))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="pb-3 pr-4 font-medium text-white/50 w-8">#</th>
            <th className="pb-3 pr-4 font-medium text-white/50">Name</th>
            <th className="pb-3 pr-4 font-medium text-white/50 hidden sm:table-cell">Company</th>
            <th className="pb-3 pr-4 font-medium text-white/50 hidden md:table-cell">Theme</th>
            <th className="pb-3 pr-4 font-medium text-white/50 hidden lg:table-cell">Created</th>
            <th className="pb-3 font-medium text-white/50">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {cards.map((card, i) => (
            <tr key={card.id} className={!card.is_active ? 'opacity-40' : ''}>
              <td className="py-3 pr-4 text-white/30">{i + 1}</td>
              <td className="py-3 pr-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{card.name}</p>
                    {(leadCounts[card.id] ?? 0) > 0 && (
                      <a href="/admin/leads"
                        className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(10,132,255,0.20)', color: '#0a84ff' }}>
                        {leadCounts[card.id]} lead{leadCounts[card.id] !== 1 ? 's' : ''}
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-white/40">/cards/{card.slug}</p>
                </div>
              </td>
              <td className="py-3 pr-4 text-white/60 hidden sm:table-cell">{card.company ?? '—'}</td>
              <td className="py-3 pr-4 hidden md:table-cell">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: card.theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
                    color: card.theme === 'dark' ? '#fff' : '#111',
                    border: '1px solid',
                    borderColor: card.theme === 'dark' ? '#333' : '#ddd',
                  }}
                >
                  {card.theme}
                </span>
              </td>
              <td className="py-3 pr-4 text-white/40 hidden lg:table-cell text-xs">
                {new Date(card.created_at).toLocaleDateString('en-ZA')}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <a
                    href={`/cards/${card.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title="View card"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => copy(card.slug)}
                    className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title="Copy link"
                  >
                    {copied === card.slug ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyEditLink(card.id, card.edit_token)}
                    className="p-2 text-white/40 hover:text-blue-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Copy client edit link"
                  >
                    {copiedEdit === card.id ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4" />}
                  </button>
                  <a
                    href={card.edit_token ? `/edit/${card.edit_token}` : '#'}
                    className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title="Edit card"
                  >
                    <Edit2 className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => toggleActive(card.id, card.is_active)}
                    className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title={card.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {card.is_active
                      ? <ToggleRight className="w-4 h-4 text-green-400" />
                      : <ToggleLeft className="w-4 h-4" />
                    }
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cards.length === 0 && (
        <div className="text-center py-16 text-white/30">
          <p className="text-lg">No cards yet</p>
          <p className="text-sm mt-1">Share the <code className="text-white/50">/new</code> link with your first client.</p>
        </div>
      )}
    </div>
  )
}
