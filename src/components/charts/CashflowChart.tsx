'use client'

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { YearlyProjection } from '@/types'

interface CashflowChartProps {
  data: YearlyProjection[]
}

const fmtEur = (v: number) =>
  v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-2xl border border-ink-200 bg-white px-4 py-3 shadow-overlay">
      <p className="mb-2 text-xs font-semibold text-ink-500">Jahr {label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-6 py-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-ink-500">{entry.name}</span>
          </div>
          <span className="font-semibold text-ink-900 num">{fmtEur(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function CashflowChart({ data }: CashflowChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    Mieteinnahmen: Math.round(d.annualRent),
    Kosten: Math.round(d.annualCosts + d.annualLoanPayment),
    Cashflow: Math.round(d.cashflow),
  }))

  return (
    <div>
      <h3 className="mb-5 text-sm font-semibold text-ink-900">Cashflow-Entwicklung (10 Jahre)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={14}>
          <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `J.${v}`}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()
            }
            width={40}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(15,23,42,0.03)', radius: 6 }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#64748B', paddingTop: '14px', fontFamily: 'Inter' }}
          />
          <ReferenceLine y={0} stroke="#E2E8F0" strokeWidth={1.5} />
          <Bar dataKey="Mieteinnahmen" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Kosten" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Cashflow" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.Cashflow >= 0 ? '#16A34A' : '#DC2626'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
