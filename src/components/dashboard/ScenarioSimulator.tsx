'use client'

import { useState, useMemo } from 'react'
import { Sliders, RotateCcw, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { calculateInvestment } from '@/lib/calculations'
import { applyScenario, SCENARIO_PRESETS } from '@/lib/scenarios'
import type { PropertyInputs, CalculationResults, ScenarioInputs } from '@/types'
import { cn } from '@/lib/utils'

interface ScenarioSimulatorProps {
  baseInputs: PropertyInputs
  baseResults: CalculationResults
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  formatValue: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-ink-600">{label}</label>
        <span className={cn(
          'text-xs font-semibold rounded-md px-1.5 py-0.5 num',
          value > 0 ? 'bg-negative-50 text-negative-700' : value < 0 ? 'bg-positive-50 text-positive-700' : 'bg-ink-100 text-ink-500'
        )}>
          {formatValue(value)}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, #2563EB ${pct}%, #E2E8F0 0%)`,
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-ink-400">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  )
}

function KPICompare({
  label,
  base,
  scenario,
  format,
}: {
  label: string
  base: number
  scenario: number
  format: (v: number) => string
}) {
  const diff = scenario - base
  const isPositive = diff > 0.005
  const isNegative = diff < -0.005

  const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-3.5 shadow-sm">
      <p className="mb-2.5 text-xs text-ink-500">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] text-ink-400 mb-0.5">Basis</p>
          <p className="text-sm font-semibold text-ink-700 num">{format(base)}</p>
        </div>
        <div className={cn(
          'flex items-center gap-1 rounded-lg px-2 py-1',
          isPositive ? 'bg-positive-50' : isNegative ? 'bg-negative-50' : 'bg-ink-50'
        )}>
          <Icon className={cn(
            'h-3.5 w-3.5',
            isPositive ? 'text-positive-600' : isNegative ? 'text-negative-600' : 'text-ink-400'
          )} />
          <span className={cn(
            'text-sm font-bold num',
            isPositive ? 'text-positive-700' : isNegative ? 'text-negative-600' : 'text-ink-500'
          )}>
            {format(scenario)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ScenarioSimulator({ baseInputs, baseResults }: ScenarioSimulatorProps) {
  const [scenario, setScenario] = useState<ScenarioInputs>({
    interestRateChange: 0,
    rentChange: 0,
    vacancyMonths: 0,
    sellAfterYears: null,
  })

  const scenarioResults = useMemo<CalculationResults>(() => {
    const modifiedInputs = applyScenario(baseInputs, scenario)
    return calculateInvestment(modifiedInputs)
  }, [baseInputs, scenario])

  const resetScenario = () => {
    setScenario({ interestRateChange: 0, rentChange: 0, vacancyMonths: 0, sellAfterYears: null })
  }

  const fmtEur = (v: number) =>
    v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  const fmtPct = (v: number) => `${v.toFixed(2).replace('.', ',')} %`

  const hasChanges =
    scenario.interestRateChange !== 0 ||
    scenario.rentChange !== 0 ||
    scenario.vacancyMonths !== 0

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
            <Sliders className="h-4 w-4 text-brand-600" />
          </div>
          <h3 className="text-sm font-semibold text-ink-900">Szenario-Simulator</h3>
        </div>
        {hasChanges && (
          <button
            onClick={resetScenario}
            className="flex items-center gap-1.5 rounded-xl border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-500 transition-all hover:border-ink-400 hover:text-ink-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Zurücksetzen
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Preset buttons */}
        <div className="mb-5">
          <p className="section-label mb-2.5">Schnell-Szenarien</p>
          <div className="flex flex-wrap gap-2">
            {SCENARIO_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setScenario(preset.scenario)}
                title={preset.description}
                className="rounded-xl border border-ink-200 bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="mb-6 space-y-5">
          <SliderField
            label="Zinssatz-Veränderung"
            value={scenario.interestRateChange}
            min={-2}
            max={3}
            step={0.1}
            onChange={(v) => setScenario({ ...scenario, interestRateChange: v })}
            formatValue={(v) => (v >= 0 ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%`)}
          />
          <SliderField
            label="Mietveränderung"
            value={scenario.rentChange}
            min={-20}
            max={30}
            step={1}
            onChange={(v) => setScenario({ ...scenario, rentChange: v })}
            formatValue={(v) => (v >= 0 ? `+${v}%` : `${v}%`)}
          />
          <SliderField
            label="Zusätzliche Leerstands-Monate"
            value={scenario.vacancyMonths}
            min={0}
            max={6}
            step={1}
            onChange={(v) => setScenario({ ...scenario, vacancyMonths: v })}
            formatValue={(v) => `${v} Mo.`}
          />
        </div>

        {/* KPI Comparison */}
        <div>
          <p className="section-label mb-3">Basis vs. Szenario</p>
          <div className="grid grid-cols-2 gap-2.5">
            <KPICompare label="Monatl. Cashflow" base={baseResults.monthlyCashflow} scenario={scenarioResults.monthlyCashflow} format={fmtEur} />
            <KPICompare label="Nettomietrendite" base={baseResults.netRentalYield} scenario={scenarioResults.netRentalYield} format={fmtPct} />
            <KPICompare label="Jahres-Cashflow" base={baseResults.annualCashflow} scenario={scenarioResults.annualCashflow} format={fmtEur} />
            <KPICompare label="Deal Score" base={baseResults.dealScore} scenario={scenarioResults.dealScore} format={(v) => `${Math.round(v)}/100`} />
          </div>
        </div>

        {/* Active scenario badge */}
        {hasChanges && (
          <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-3.5">
            <p className="text-xs font-semibold text-brand-700 mb-1.5">Aktives Szenario</p>
            <div className="space-y-0.5 text-xs text-brand-600">
              {scenario.interestRateChange !== 0 && (
                <div>Zinsen: {scenario.interestRateChange > 0 ? '+' : ''}{scenario.interestRateChange.toFixed(1)}%</div>
              )}
              {scenario.rentChange !== 0 && (
                <div>Miete: {scenario.rentChange > 0 ? '+' : ''}{scenario.rentChange}%</div>
              )}
              {scenario.vacancyMonths > 0 && (
                <div>Leerstand: +{scenario.vacancyMonths} Monat(e)</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
