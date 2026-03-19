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
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2 text-xs text-white/40">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className={`text-2xl font-black num ${color ?? 'text-white'}`}>{value}</div>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
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
    <div className="relative min-h-screen bg-ink-950 pt-20 pb-16 text-white selection:bg-brand-500/30">

      {/* Layered background — same as landing page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.15),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Portfolio</p>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Meine Analysen
            </h1>
          </div>
          <Link
            href="/analyze"
            className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]"
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
              color={totalCashflow >= 0 ? 'text-positive-400' : 'text-negative-400'}
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
              <div key={i} className="h-52 rounded-2xl bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && analyses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.03] py-20 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.06]">
              <BarChart3 className="h-7 w-7 text-white/40" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-white">Noch keine Analysen</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Speichere deine erste Immobilienanalyse, um sie hier zu sehen.
            </p>
            <Link
              href="/analyze"
              className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]"
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
