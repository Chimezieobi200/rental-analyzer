'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealScoreWidgetProps {
  score: number
  label: 'Excellent' | 'Solid' | 'Risky'
  breakdown: {
    yieldScore: number
    cashflowScore: number
    ltvScore: number
    vacancyScore: number
  }
  netYield?: number
  cashflow?: number
  ltv?: number
  vacancyRate?: number
}

const LABEL_DE: Record<string, string> = {
  Excellent: 'Ausgezeichnet',
  Solid: 'Solide',
  Risky: 'Kritisch',
}

const scoreArc = (score: number) => {
  if (score >= 80) return { stroke: '#16A34A', track: '#DCFCE7' }  // green
  if (score >= 60) return { stroke: '#D97706', track: '#FEF3C7' }  // amber
  return { stroke: '#DC2626', track: '#FEE2E2' }                    // red
}

function generateFactors(
  breakdown: DealScoreWidgetProps['breakdown'],
  netYield?: number,
  cashflow?: number,
  ltv?: number,
  vacancyRate?: number,
) {
  const positive: string[] = []
  const negative: string[] = []

  // Yield
  if (breakdown.yieldScore >= 20) {
    positive.push(`Starke Netto-Rendite von ${netYield?.toFixed(2) ?? '—'} %`)
  } else if (breakdown.yieldScore >= 10) {
    positive.push(`Akzeptable Rendite von ${netYield?.toFixed(2) ?? '—'} %`)
  } else {
    negative.push(`Schwache Rendite von ${netYield?.toFixed(2) ?? '—'} % (Ziel: ≥ 4 %)`)
  }

  // Cashflow
  if (breakdown.cashflowScore >= 20) {
    positive.push(`Positiver Cashflow von ${cashflow !== undefined ? cashflow.toLocaleString('de-DE') + ' €/Mo.' : '—'}`)
  } else if (breakdown.cashflowScore >= 10) {
    negative.push(`Leicht negativer Cashflow (${cashflow !== undefined ? cashflow.toLocaleString('de-DE') + ' €/Mo.' : '—'})`)
  } else {
    negative.push(`Hohe monatliche Zuzahlung erforderlich (${cashflow !== undefined ? cashflow.toLocaleString('de-DE') + ' €/Mo.' : '—'})`)
  }

  // LTV
  if (breakdown.ltvScore >= 20) {
    positive.push(`Niedriger Beleihungsauslauf von ${ltv?.toFixed(1) ?? '—'} %`)
  } else if (breakdown.ltvScore >= 10) {
    negative.push(`Mittlerer Beleihungsauslauf von ${ltv?.toFixed(1) ?? '—'} % — Zinsrisiko beachten`)
  } else {
    negative.push(`Hoher Beleihungsauslauf von ${ltv?.toFixed(1) ?? '—'} % erhöht Refinanzierungsrisiko`)
  }

  // Vacancy
  if (breakdown.vacancyScore >= 15) {
    positive.push(`Geringe Leerstandsquote von ${vacancyRate ?? '—'} %`)
  } else if (breakdown.vacancyScore >= 10) {
    // neutral — don't add
  } else {
    negative.push(`Hohe Leerstandsquote von ${vacancyRate ?? '—'} % belastet Rendite`)
  }

  return { positive, negative }
}

export function DealScoreWidget({
  score, label, breakdown, netYield, cashflow, ltv, vacancyRate
}: DealScoreWidgetProps) {
  const [expanded, setExpanded] = useState(false)
  const clamped = Math.max(0, Math.min(100, score))
  const r = 52
  const circ = 2 * Math.PI * r
  const GAUGE = circ * 0.75   // 270° visible arc
  const GAP   = circ - GAUGE  // 90° gap at bottom
  const fill  = (clamped / 100) * GAUGE
  const arc = scoreArc(clamped)

  const categories = [
    { label: 'Nettomietrendite', earned: breakdown.yieldScore, max: 30 },
    { label: 'Monatl. Cashflow', earned: breakdown.cashflowScore, max: 25 },
    { label: 'Beleihungsauslauf', earned: breakdown.ltvScore, max: 25 },
    { label: 'Leerstandsquote', earned: breakdown.vacancyScore, max: 20 },
  ]

  const { positive, negative } = generateFactors(breakdown, netYield, cashflow, ltv, vacancyRate)

  return (
    <div className="flex flex-col rounded-2xl bg-surface shadow-card p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400 mb-5">
        Deal Score
      </p>

      {/* Ring */}
      <div className="flex items-center justify-center">
        <div className="relative w-[136px] h-[136px] flex items-center justify-center">
          <svg width="136" height="136" className="rotate-[135deg]">
            {/* Track – 270° arc */}
            <circle
              cx="68" cy="68" r={r}
              fill="none"
              stroke={arc.track}
              strokeWidth="10"
              strokeDasharray={`${GAUGE} ${GAP}`}
              strokeLinecap="round"
            />
            {/* Fill – score% of 270° */}
            <circle
              cx="68" cy="68" r={r}
              fill="none"
              stroke={arc.stroke}
              strokeWidth="10"
              strokeDasharray={`${fill} ${circ - fill}`}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-4xl font-extrabold num tracking-tight text-ink-900">
              {clamped}
            </span>
            <span className="mt-1 text-[10px] text-ink-300 font-medium tracking-wide">/ 100</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-5 border-t border-ink-100 pt-4 text-center">
        <p className="text-sm font-semibold text-ink-900">{LABEL_DE[label]}</p>
      </div>

      {/* Breakdown bars */}
      <div className="mt-4 divide-y divide-ink-50">
        {categories.map(({ label: cat, earned, max }) => (
          <div key={cat} className="flex items-center justify-between py-2.5">
            <span className="text-[11px] text-ink-500">{cat}</span>
            <div className="flex items-center gap-2.5">
              <div className="w-14 h-px bg-ink-100 relative">
                <div
                  className="absolute top-0 left-0 h-px bg-ink-700 transition-all duration-500"
                  style={{ width: `${(earned / max) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-ink-600 num tabular-nums">
                {earned}<span className="text-ink-300">/{max}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-[11px] font-medium text-ink-500 transition-colors hover:border-ink-200 hover:text-ink-700"
      >
        <span>Faktoren anzeigen</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', expanded && 'rotate-180')} />
      </button>

      {/* Factors */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {positive.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-positive-600">
                Stärken
              </p>
              <ul className="space-y-1.5">
                {positive.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-positive-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {negative.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-negative-600">
                Schwachstellen
              </p>
              <ul className="space-y-1.5">
                {negative.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-negative-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
