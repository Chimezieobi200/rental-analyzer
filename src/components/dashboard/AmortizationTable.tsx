'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import type { AmortizationEntry } from '@/types'
import { cn } from '@/lib/utils'

interface AmortizationTableProps {
  schedule: AmortizationEntry[]
}

const ROWS_PER_PAGE = 12

export function AmortizationTable({ schedule }: AmortizationTableProps) {
  const [showMonthly, setShowMonthly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const fmtEur = (v: number) =>
    v.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const displayData = showMonthly
    ? schedule
    : schedule.filter((entry) => entry.month % 12 === 0)

  const totalPages = Math.ceil(displayData.length / ROWS_PER_PAGE)
  const paginatedData = displayData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h3 className="text-sm font-semibold text-white">Tilgungsplan</h3>
        <button
          onClick={() => { setShowMonthly(!showMonthly); setCurrentPage(1) }}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.10] px-3 py-1.5 text-xs font-medium text-white/50 transition-all hover:border-white/20 hover:text-white"
        >
          {showMonthly ? (
            <><EyeOff className="h-3.5 w-3.5" />Jahresansicht</>
          ) : (
            <><Eye className="h-3.5 w-3.5" />Monatsdetail</>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.05]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40">
                {showMonthly ? 'Monat' : 'Jahr'}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-white/40">Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-white/40">Zinsen</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-white/40">Tilgung</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-white/40">Restschuld</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {paginatedData.map((entry) => (
              <tr key={entry.month} className="transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3 text-xs font-medium text-white/50">
                  {showMonthly ? `M.${entry.month} (J.${entry.year})` : `Jahr ${entry.year}`}
                </td>
                <td className="px-4 py-3 text-right text-white/60 num">{fmtEur(entry.payment)}</td>
                <td className="px-4 py-3 text-right text-negative-400 num">{fmtEur(entry.interest)}</td>
                <td className="px-4 py-3 text-right text-positive-400 num">{fmtEur(entry.principal)}</td>
                <td className="px-5 py-3 text-right font-semibold text-white num">{fmtEur(entry.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3.5">
          <span className="text-xs text-white/30">
            Seite {currentPage} von {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.10] text-white/30 transition-all disabled:opacity-30 hover:border-white/20 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.10] text-white/30 transition-all disabled:opacity-30 hover:border-white/20 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
