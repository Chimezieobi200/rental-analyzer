'use client'

import { useState } from 'react'
import { PropertyInputForm } from '@/components/forms/PropertyInputForm'
import { AnalysisDashboard } from '@/components/dashboard/AnalysisDashboard'
import type { PropertyInputs, CalculationResults } from '@/types'
import { calculateInvestment } from '@/lib/calculations'
import { TrendingUp } from 'lucide-react'

export default function AnalyzePage() {
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [inputs, setInputs] = useState<PropertyInputs | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleCalculate = async (formInputs: PropertyInputs) => {
    setIsCalculating(true)
    try {
      const calculationResults = calculateInvestment(formInputs)
      setInputs(formInputs)
      setResults(calculationResults)
    } catch (error) {
      console.error('Calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 pt-[60px]">

      {/* Page Header */}
      <div className="border-b border-white/[0.06] bg-ink-950/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15 ring-1 ring-brand-500/25">
              <TrendingUp className="h-4 w-4 text-brand-400" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-white">
                Immobilien-Analyse
              </h1>
              <p className="text-[12px] text-white/30">
                Gib die Objektdaten ein und erhalte eine vollständige Investitionsanalyse.
              </p>
            </div>
          </div>
          {results && (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-positive-500/20 bg-positive-500/10 px-3 py-1 text-[12px] font-medium text-positive-400">
              <span className="h-1.5 w-1.5 rounded-full bg-positive-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
              Analyse berechnet
            </div>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">

          {/* Input Form — Sticky */}
          <div className="lg:sticky lg:top-[76px] lg:h-fit">
            <PropertyInputForm
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
            />
          </div>

          {/* Dashboard */}
          <div className="min-w-0">
            <AnalysisDashboard
              results={results}
              inputs={inputs}
              isLoading={isCalculating}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
