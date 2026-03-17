'use client'

import Link from 'next/link'
import { MapPin, TrendingUp, Wallet, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Analysis } from '@/types'

interface PortfolioCardProps {
  analysis: Analysis
  onDelete: (id: string) => void
}

function ScoreRing({ score }: { score: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ
  const color = score >= 80 ? '#0F172A' : score >= 60 ? '#475569' : '#CBD5E1'

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
        <circle
          cx="24" cy="24" r={r}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-ink-900 num">{Math.round(score)}</span>
    </div>
  )
}

export function PortfolioCard({ analysis, onDelete }: PortfolioCardProps) {
  const { results, inputs } = analysis
  const cashflow = results?.monthlyCashflow ?? 0
  const yield_ = results?.netRentalYield ?? 0
  const score = results?.dealScore ?? 0

  const fmtEur = (v: number) =>
    v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div className="group relative rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-semibold text-ink-900">{analysis.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{analysis.location}</span>
          </div>
        </div>
        <ScoreRing score={score} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-ink-50 px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ink-400">
            <Wallet className="h-3 w-3" />
            Cashflow
          </div>
          <span className={cn(
            'text-[13px] font-bold num',
            cashflow >= 0 ? 'text-positive-700' : 'text-negative-600'
          )}>
            {cashflow >= 0 ? '+' : ''}{fmtEur(cashflow)}/Mo.
          </span>
        </div>
        <div className="rounded-xl bg-ink-50 px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ink-400">
            <TrendingUp className="h-3 w-3" />
            Netto-Rendite
          </div>
          <span className="text-[13px] font-bold text-ink-800 num">
            {yield_.toFixed(2).replace('.', ',')} %
          </span>
        </div>
      </div>

      {inputs?.purchasePrice && (
        <p className="mt-3 text-[11px] text-ink-400 num">
          {inputs.purchasePrice.toLocaleString('de-DE')} € · {inputs.propertySizeSqm} m² · {inputs.yearBuilt}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
        <Link
          href={`/analyze`}
          className="text-[11px] font-medium text-brand-600 hover:text-brand-800 transition-colors"
        >
          Erneut analysieren →
        </Link>
        <button
          onClick={() => onDelete(analysis.id)}
          className="rounded-lg p-1.5 text-ink-300 opacity-0 transition-all hover:bg-negative-50 hover:text-negative-600 group-hover:opacity-100"
          title="Löschen"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
