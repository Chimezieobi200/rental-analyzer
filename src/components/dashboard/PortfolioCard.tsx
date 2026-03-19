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
  const color = score >= 80 ? '#60A5FA' : score >= 60 ? '#FBBF24' : '#F87171'

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
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
      <span className="absolute text-[11px] font-black text-white num">{Math.round(score)}</span>
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
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:-translate-y-0.5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-semibold text-white">{analysis.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/40">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{analysis.location}</span>
          </div>
        </div>
        <ScoreRing score={score} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] text-white/40">
            <Wallet className="h-3 w-3" />
            Cashflow
          </div>
          <span className={cn(
            'text-[13px] font-bold num',
            cashflow >= 0 ? 'text-positive-400' : 'text-negative-400'
          )}>
            {cashflow >= 0 ? '+' : ''}{fmtEur(cashflow)}/Mo.
          </span>
        </div>
        <div className="rounded-xl bg-white/[0.05] border border-white/[0.06] px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] text-white/40">
            <TrendingUp className="h-3 w-3" />
            Netto-Rendite
          </div>
          <span className="text-[13px] font-bold text-white num">
            {yield_.toFixed(2).replace('.', ',')} %
          </span>
        </div>
      </div>

      {inputs?.purchasePrice && (
        <p className="mt-3 text-[11px] text-white/30 num">
          {inputs.purchasePrice.toLocaleString('de-DE')} € · {inputs.propertySizeSqm} m² · {inputs.yearBuilt}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
        <Link
          href={`/analyze`}
          className="text-[11px] font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          Erneut analysieren →
        </Link>
        <button
          onClick={() => onDelete(analysis.id)}
          className="rounded-lg p-1.5 text-white/20 opacity-0 transition-all hover:bg-white/[0.06] hover:text-negative-400 group-hover:opacity-100"
          title="Löschen"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
