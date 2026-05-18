import { createServerClient } from '@/lib/supabase-server'
import CardTable from '@/components/admin/CardTable'
import { Plus } from 'lucide-react'
import type { Card } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin | ReviewTap Cards' }

export default async function AdminPage() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false })

  const cards = (data ?? []) as Card[]

  return (
    <div className="min-h-dvh bg-[#080808] text-white">
      <div className="max-w-5xl mx-auto px-5 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cards</h1>
            <p className="text-sm text-white/40 mt-0.5">{cards.length} total</p>
          </div>
          <a
            href="/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Card
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total Cards" value={cards.length} />
          <StatCard label="Active" value={cards.filter(c => c.is_active).length} />
          <StatCard label="This Month" value={cards.filter(c => {
            const d = new Date(c.created_at)
            const now = new Date()
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          }).length} />
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5">
          <CardTable cards={cards} />
        </div>

        {/* Quick-share link */}
        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
          <p className="text-sm text-white/50 font-medium mb-1">Client intake link</p>
          <p className="font-mono text-sm text-blue-400">
            {process.env.NEXT_PUBLIC_APP_URL ?? ''}/new
          </p>
          <p className="text-xs text-white/30 mt-1">
            Share this link with clients to let them fill in their own card.
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </div>
  )
}
