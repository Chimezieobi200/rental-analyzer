'use client'

import { useState } from 'react'
import {
  BarChart3,
  Download,
  Building2,
  TrendingUp,
  Wallet,
  Clock,
  Save,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react'
import type { CalculationResults, PropertyInputs } from '@/types'
import { DealScoreWidget } from './DealScoreWidget'
import { KPICard } from './KPICard'
import { AIAnalyst } from './AIAnalyst'
import { CashflowChart } from '@/components/charts/CashflowChart'
import { LoanBalanceChart } from '@/components/charts/LoanBalanceChart'
import { WealthGrowthChart } from '@/components/charts/WealthGrowthChart'
import { ScenarioSimulator } from './ScenarioSimulator'
import { AmortizationTable } from './AmortizationTable'
import { cn } from '@/lib/utils'

interface AnalysisDashboardProps {
  results: CalculationResults | null
  inputs: PropertyInputs | null
  isLoading: boolean
}

/* ── Skeleton block ──────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

function SkeletonDashboard() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top row */}
      <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      {/* Monthly breakdown */}
      <Skeleton className="h-64 rounded-2xl" />
      {/* Charts */}
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}

export function AnalysisDashboard({ results, inputs, isLoading }: AnalysisDashboardProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveAnalysis = async () => {
    if (!results || !inputs) return
    setSaveLoading(true)
    try {
      const res = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${inputs.location} – ${new Date().toLocaleDateString('de-DE')}`,
          location: inputs.location,
          inputs,
          results,
        }),
      })
      if (res.status === 401) { window.location.href = '/auth/login'; return }
      if (res.status === 403) { alert('Free-Plan Limit erreicht (3 Analysen). Bitte auf Pro upgraden.'); return }
      if (!res.ok) throw new Error('Save failed')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      alert('Analyse konnte nicht gespeichert werden.')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!results || !inputs) return
    setPdfLoading(true)
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, results }),
      })
      if (response.status === 403) { alert('PDF-Export ist ein Pro-Feature. Bitte upgraden.'); return }
      if (!response.ok) throw new Error('PDF generation failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `immobilien-analyse-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF download error:', error)
    } finally {
      setPdfLoading(false)
    }
  }

  const fmtEur = (v: number) =>
    v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  const fmtPct = (v: number) => `${v.toFixed(2).replace('.', ',')} %`

  /* Loading skeleton */
  if (isLoading) return <SkeletonDashboard />

  /* Empty state */
  if (!results || !inputs) {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-surface">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100">
          <BarChart3 className="h-7 w-7 text-ink-400" />
        </div>
        <h3 className="mt-5 text-base font-semibold text-ink-800">Noch keine Analyse</h3>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-ink-500">
          Fülle das Formular links aus und klicke auf{' '}
          <span className="font-medium text-ink-700">„Analyse berechnen"</span> um die
          Auswertung zu sehen.
        </p>
        <div className="mt-8 flex gap-6 text-center">
          {['Rendite', 'Cashflow', 'Deal Score'].map((item) => (
            <div key={item} className="flex flex-col items-center gap-1.5">
              <div className="skeleton h-8 w-16 rounded-lg" />
              <span className="text-xs text-ink-400">{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Top toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <span className="flex h-2 w-2 rounded-full bg-positive-500" />
          Analyse für <span className="font-medium text-ink-800">{inputs.location}</span>
        </div>
        <button
          onClick={handleSaveAnalysis}
          disabled={saveLoading || saveSuccess}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all',
            saveSuccess
              ? 'border-positive-200 bg-positive-50 text-positive-700'
              : 'border-ink-200 bg-surface text-ink-600 hover:border-ink-400 hover:text-ink-900 shadow-card'
          )}
        >
          {saveSuccess ? (
            <><CheckCircle2 className="h-4 w-4" />Gespeichert</>
          ) : saveLoading ? (
            <><div className="h-4 w-4 animate-spin rounded-full border-2 border-ink-200 border-t-ink-600" />Speichern...</>
          ) : (
            <><Save className="h-4 w-4" />Analyse speichern</>
          )}
        </button>
      </div>

      {/* ── Deal Score + KPIs ───────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[220px_1fr]">
        <DealScoreWidget
          score={results.dealScore}
          label={results.dealScoreLabel}
          breakdown={results.dealScoreBreakdown}
          netYield={results.netRentalYield}
          cashflow={results.monthlyCashflow}
          ltv={results.loanToValue}
          vacancyRate={inputs.vacancyRate}
        />
        <div className="grid grid-cols-2 gap-3">
          <KPICard
            title="Brutto-Mietrendite"
            value={fmtPct(results.grossRentalYield)}
            tooltip="Jahresmiete / Kaufpreis × 100"
            trend={results.grossRentalYield >= 4 ? 'up' : 'down'}
            trendValue={results.grossRentalYield >= 4 ? 'Akzeptabel' : 'Unter 4%'}
          />
          <KPICard
            title="Netto-Mietrendite"
            value={fmtPct(results.netRentalYield)}
            tooltip="Jahresmiete nach Kosten / Kaufpreis × 100"
            highlight={results.netRentalYield >= 5}
            trend={results.netRentalYield >= 5 ? 'up' : results.netRentalYield >= 3 ? 'neutral' : 'down'}
            trendValue={results.netRentalYield >= 5 ? '≥ 5 % – gut' : results.netRentalYield >= 3 ? '3–5 %' : '< 3 %'}
          />
          <KPICard
            title="Monatlicher Cashflow"
            value={fmtEur(results.monthlyCashflow)}
            tooltip="Effektivmiete – Darlehensrate – alle Kosten"
            valueColor={results.monthlyCashflow >= 0 ? 'positive' : 'negative'}
            trend={results.monthlyCashflow >= 0 ? 'up' : 'down'}
            trendValue={results.monthlyCashflow >= 0 ? 'Positiver Cashflow' : 'Zuzahlung nötig'}
          />
          <KPICard
            title="Eigenkapitalrendite"
            value={fmtPct(results.equityReturn)}
            tooltip="Netto-Jahreseinkommen / Eigenkapital × 100"
            trend={results.equityReturn >= 5 ? 'up' : 'neutral'}
            trendValue={`auf ${fmtEur(inputs.equity)} EK`}
          />
        </div>
      </div>

      {/* ── AI Deal Analyst ─────────────────────────────────────── */}
      <AIAnalyst inputs={inputs} results={results} />

      {/* ── Financial Summary Cards ──────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Building2,
            label: 'Gesamtinvestition',
            value: fmtEur(results.totalInvestment),
            sub: `inkl. ${fmtEur(results.totalBuyingCosts)} Nebenkosten`,
          },
          {
            icon: Wallet,
            label: 'Darlehen',
            value: fmtEur(results.loanAmount),
            sub: `Beleihung: ${results.loanToValue.toFixed(1).replace('.', ',')} %`,
          },
          {
            icon: TrendingUp,
            label: 'Monatliche Rate',
            value: fmtEur(results.monthlyLoanRepayment),
            sub: `${fmtEur(results.monthlyInterest)} Zinsen + ${fmtEur(results.monthlyPrincipal)} Tilg.`,
          },
          {
            icon: Clock,
            label: 'Break-Even',
            value: results.breakEvenYears > 50 ? 'N/A' : `${results.breakEvenYears} Jahre`,
            sub: 'bis Nebenkosten gedeckt',
          },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl bg-surface p-4 shadow-card">
            <div className="mb-2.5 flex items-center gap-2 text-xs text-ink-500">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
            <div className="text-lg font-bold text-ink-900 num">{value}</div>
            <div className="mt-1 text-xs text-ink-400 leading-snug">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Monthly Breakdown ────────────────────────────────────── */}
      <div className="rounded-2xl bg-surface p-5 shadow-card">
        <h3 className="mb-4 text-sm font-semibold text-ink-900">Monatliche Übersicht</h3>
        <div className="grid gap-4 sm:grid-cols-2">

          {/* Income */}
          <div className="space-y-2">
            <p className="section-label">Einnahmen</p>
            {[
              { label: 'Kaltmiete (brutto)', value: fmtEur(results.monthlyGrossRent), color: '' },
              { label: 'Effektivmiete (nach Leerstand)', value: fmtEur(results.monthlyEffectiveRent), color: 'text-positive-700' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-2.5">
                <span className="text-sm text-ink-600">{label}</span>
                <span className={cn('text-sm font-semibold num', color || 'text-ink-800')}>{value}</span>
              </div>
            ))}
          </div>

          {/* Expenses */}
          <div className="space-y-2">
            <p className="section-label">Ausgaben</p>
            {[
              { label: 'Darlehensrate', value: fmtEur(results.monthlyLoanRepayment) },
              { label: 'Instandhaltung', value: fmtEur(results.monthlyMaintenance) },
              { label: 'Verwaltung', value: fmtEur(results.monthlyManagement) },
              { label: 'Sonstiges', value: fmtEur(results.monthlyOtherCosts) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-2.5">
                <span className="text-sm text-ink-600">{label}</span>
                <span className="text-sm font-semibold text-negative-600 num">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Net cashflow */}
        <div
          className={cn(
            'mt-4 flex items-center justify-between rounded-2xl px-5 py-4',
            results.monthlyCashflow >= 0
              ? 'bg-positive-50 border border-positive-100'
              : 'bg-negative-50 border border-negative-100'
          )}
        >
          <div>
            <p className="text-sm font-semibold text-ink-800">Monatlicher Cashflow</p>
            <p className="text-xs text-ink-500 mt-0.5">nach allen Kosten</p>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowUpRight
              className={cn(
                'h-5 w-5',
                results.monthlyCashflow >= 0 ? 'text-positive-600' : 'text-negative-600 rotate-90'
              )}
            />
            <span
              className={cn(
                'text-2xl font-extrabold num tracking-tight',
                results.monthlyCashflow >= 0 ? 'text-positive-700' : 'text-negative-600'
              )}
            >
              {results.monthlyCashflow >= 0 ? '+' : ''}{fmtEur(results.monthlyCashflow)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Charts ──────────────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-1">
        {[
          { component: <CashflowChart data={results.tenYearProjection} />, label: 'Cashflow-Entwicklung' },
          { component: <LoanBalanceChart data={results.tenYearProjection} />, label: 'Darlehensstand' },
          { component: <WealthGrowthChart data={results.tenYearProjection} />, label: 'Vermögensentwicklung' },
        ].map(({ component, label }) => (
          <div key={label} className="rounded-2xl bg-surface p-5 shadow-card">
            {component}
          </div>
        ))}
      </div>

      {/* ── 10-Year Table ────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
        <div className="border-b border-ink-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-ink-900">10-Jahres-Projektion</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50">
                {['Jahr', 'Miete', 'Cashflow', 'Kum. CF', 'Obj.-Wert', 'Eigenkapital'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-500 first:text-left [&:not(:first-child)]:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {results.tenYearProjection.map((row) => (
                <tr key={row.year} className="transition-colors hover:bg-ink-50/60">
                  <td className="px-4 py-3 text-xs font-semibold text-ink-500">J.{row.year}</td>
                  <td className="px-4 py-3 text-right text-ink-700 num">{fmtEur(row.annualRent)}</td>
                  <td className={cn(
                    'px-4 py-3 text-right font-semibold num',
                    row.cashflow >= 0 ? 'text-positive-700' : 'text-negative-600'
                  )}>
                    {row.cashflow >= 0 ? '+' : ''}{fmtEur(row.cashflow)}
                  </td>
                  <td className={cn(
                    'px-4 py-3 text-right num',
                    row.cumulativeCashflow >= 0 ? 'text-positive-600' : 'text-negative-500'
                  )}>
                    {fmtEur(row.cumulativeCashflow)}
                  </td>
                  <td className="px-4 py-3 text-right text-brand-700 font-medium num">
                    {fmtEur(row.propertyValue)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ink-900 num">
                    {fmtEur(row.equity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Scenario Simulator ──────────────────────────────────── */}
      <ScenarioSimulator baseInputs={inputs} baseResults={results} />

      {/* ── Amortization Table ──────────────────────────────────── */}
      <AmortizationTable schedule={results.amortizationSchedule} />

      {/* ── PDF / Pro CTA ───────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl bg-ink-950 shadow-btn-dark">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1.5">
              Export
            </p>
            <h3 className="text-base font-semibold text-white">Analyse als PDF exportieren</h3>
            <p className="mt-1 text-sm text-white/40 max-w-sm leading-relaxed">
              Geeignet für Bankgespräche, Steuerberater und eigene Unterlagen.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/15 hover:text-white disabled:opacity-40"
            >
              {pdfLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              PDF herunterladen
            </button>
            <a
              href="/#pricing"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-all hover:shadow-btn-brand"
            >
              <ArrowUpRight className="h-4 w-4" />
              Pro-Zugang
            </a>
          </div>
        </div>
        <div className="border-t border-white/[0.06] px-6 py-3 flex items-center gap-5">
          {['Vollständige Analyse', 'Charts & Tabellen', 'Professionelles Layout'].map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
              <span className="text-[11px] text-white/25">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] leading-relaxed text-ink-400">
        * Alle Berechnungen sind unverbindlich und dienen nur zur Orientierung. Keine Anlage- oder
        Steuerberatung. Prüfe alle Kennzahlen mit einem Fachberater vor einer Investitionsentscheidung.
      </p>
    </div>
  )
}
