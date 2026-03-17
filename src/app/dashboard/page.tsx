'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, TrendingUp, Wallet, Building2, Plus, ArrowRight } from 'lucide-react'
import { PortfolioCard } from '@/components/dashboard/PortfolioCard'
import type { Analysis } from '@/types'

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color?: string
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-xs text-ink-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className={`text-2xl font-black num ${color ?? 'text-ink-900'}`}>{value}</div>
      {sub && <p className="mt-1 text-xs text-ink-400">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analyses')
      .then(r => {
        if (r.status === 401) { window.location.href = '/auth/login'; return null }
        return r.json()
      })
      .then(data => {
        if (data) setAnalyses(data.analyses ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Analyse wirklich löschen?')) return
    await fetch('/api/analyses', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setAnalyses(prev => prev.filter(a => a.id !== id))
  }

  const totalCashflow = analyses.reduce((sum, a) => sum + (a.results?.monthlyCashflow ?? 0), 0)
  const avgYield = analyses.length
    ? analyses.reduce((sum, a) => sum + (a.results?.netRentalYield ?? 0), 0) / analyses.length
    : 0
  const avgScore = analyses.length
    ? analyses.reduce((sum, a) => sum + (a.results?.dealScore ?? 0), 0) / analyses.length
    : 0

  const fmtEur = (v: number) =>
    v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div className="min-h-screen bg-ink-50 pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="section-label mb-2">Portfolio</p>
            <h1 className="text-2xl font-black tracking-tight text-ink-900">
              Meine Analysen
            </h1>
          </div>
          <Link
            href="/analyze"
            className="group flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-[13px] font-semibold text-white shadow-btn-dark transition-all hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Neue Analyse
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Summary stats */}
        {analyses.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Building2} label="Objekte" value={String(analyses.length)} sub="gespeicherte Analysen" />
            <StatCard
              icon={Wallet}
              label="Gesamt-Cashflow"
              value={fmtEur(totalCashflow) + '/Mo.'}
              color={totalCashflow >= 0 ? 'text-positive-700' : 'text-negative-600'}
              sub="kombiniert alle Objekte"
            />
            <StatCard
              icon={TrendingUp}
              label="Ø Netto-Rendite"
              value={avgYield.toFixed(2).replace('.', ',') + ' %'}
              sub="Durchschnitt Portfolio"
            />
            <StatCard
              icon={BarChart3}
              label="Ø Deal Score"
              value={Math.round(avgScore) + '/100'}
              sub="Durchschnitt Portfolio"
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && analyses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-white py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100">
              <BarChart3 className="h-7 w-7 text-ink-400" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-ink-800">Noch keine Analysen</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">
              Speichere deine erste Immobilienanalyse, um sie hier zu sehen.
            </p>
            <Link
              href="/analyze"
              className="mt-6 flex items-center gap-2 rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            >
              Erste Analyse starten
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && analyses.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.map(analysis => (
              <PortfolioCard key={analysis.id} analysis={analysis} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
