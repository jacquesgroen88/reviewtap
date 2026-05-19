import { createServerClient } from '@/lib/supabase-server'
import LeadsTable from './LeadsTable'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Leads | ReviewTap Cards' }

export type Lead = {
  id: string
  card_id: string
  card_slug: string
  name: string
  email: string | null
  phone: string | null
  message: string | null
  created_at: string
  card_name?: string
}

export default async function LeadsPage() {
  const supabase = createServerClient()

  // Fetch leads with card name via foreign key
  const { data: leads } = await supabase
    .from('leads')
    .select('*, cards(name)')
    .order('created_at', { ascending: false })

  const { data: cards } = await supabase
    .from('cards')
    .select('id, name')

  const cardNameMap: Record<string, string> = {}
  cards?.forEach(c => { cardNameMap[c.id] = c.name })

  const enrichedLeads: Lead[] = (leads ?? []).map((l: Lead & { cards?: { name: string } }) => ({
    ...l,
    card_name: l.cards?.name ?? cardNameMap[l.card_id] ?? l.card_slug,
  }))

  const cardOptions = cards?.map(c => ({ id: c.id, name: c.name })) ?? []

  return (
    <div className="min-h-dvh bg-[#080808] text-white">
      <div className="max-w-5xl mx-auto px-5 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-sm text-white/40 mt-0.5">{enrichedLeads.length} total</p>
          </div>
          <a href="/admin" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all">
            ← Cards
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total Leads" value={enrichedLeads.length} />
          <StatCard label="This Week" value={enrichedLeads.filter(l => {
            const d = new Date(l.created_at)
            const week = new Date(); week.setDate(week.getDate() - 7)
            return d >= week
          }).length} />
          <StatCard label="With Email" value={enrichedLeads.filter(l => l.email).length} />
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5">
          <LeadsTable leads={enrichedLeads} cardOptions={cardOptions} />
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
