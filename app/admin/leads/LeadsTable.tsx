'use client'

import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import type { Lead } from './page'

type Props = {
  leads: Lead[]
  cardOptions: Array<{ id: string; name: string }>
}

export default function LeadsTable({ leads, cardOptions }: Props) {
  const [filterCardId, setFilterCardId] = useState<string>('')

  const filtered = useMemo(() =>
    filterCardId ? leads.filter(l => l.card_id === filterCardId) : leads,
    [leads, filterCardId]
  )

  function exportCsv() {
    const rows = [
      ['Card', 'Name', 'Email', 'Phone', 'Message', 'Date'],
      ...filtered.map(l => [
        l.card_name ?? l.card_slug,
        l.name,
        l.email ?? '',
        l.phone ?? '',
        (l.message ?? '').replace(/\n/g, ' '),
        new Date(l.created_at).toLocaleString('en-ZA'),
      ]),
    ]
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filterCardId}
          onChange={e => setFilterCardId(e.target.value)}
          className="text-sm rounded-xl px-3 py-2"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.10)', outline: 'none' }}
        >
          <option value="">All cards</option>
          {cardOptions.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button
          onClick={exportCsv}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>

        <span className="text-xs text-white/30 ml-auto">
          {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-3 pr-4 font-medium text-white/50">Card</th>
              <th className="pb-3 pr-4 font-medium text-white/50">Name</th>
              <th className="pb-3 pr-4 font-medium text-white/50 hidden sm:table-cell">Email</th>
              <th className="pb-3 pr-4 font-medium text-white/50 hidden md:table-cell">Phone</th>
              <th className="pb-3 pr-4 font-medium text-white/50 hidden lg:table-cell">Message</th>
              <th className="pb-3 font-medium text-white/50">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(lead => (
              <tr key={lead.id}>
                <td className="py-3 pr-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.70)' }}>
                    {lead.card_name ?? lead.card_slug}
                  </span>
                </td>
                <td className="py-3 pr-4 font-medium text-white">{lead.name}</td>
                <td className="py-3 pr-4 text-white/60 hidden sm:table-cell">
                  {lead.email
                    ? <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors">{lead.email}</a>
                    : <span className="text-white/20">—</span>
                  }
                </td>
                <td className="py-3 pr-4 text-white/60 hidden md:table-cell">
                  {lead.phone
                    ? <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors">{lead.phone}</a>
                    : <span className="text-white/20">—</span>
                  }
                </td>
                <td className="py-3 pr-4 text-white/40 hidden lg:table-cell" style={{ maxWidth: '200px' }}>
                  {lead.message
                    ? <span className="line-clamp-2 text-xs">{lead.message}</span>
                    : <span className="text-white/20">—</span>
                  }
                </td>
                <td className="py-3 text-white/40 text-xs whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <p className="text-lg">No leads yet</p>
            <p className="text-sm mt-1">Leads appear here when card viewers share their details.</p>
          </div>
        )}
      </div>
    </div>
  )
}
