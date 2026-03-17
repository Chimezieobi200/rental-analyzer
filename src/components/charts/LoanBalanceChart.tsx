'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { YearlyProjection } from '@/types'

interface LoanBalanceChartProps {
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

export function LoanBalanceChart({ data }: LoanBalanceChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    Immobilienwert: Math.round(d.propertyValue),
    Eigenkapital: Math.round(d.equity),
    Darlehensrestschuld: Math.round(d.loanBalance),
  }))

  const fmtAxis = (v: number) =>
    v >= 1000000
      ? `${(v / 1000000).toFixed(1)}M`
      : v >= 1000
      ? `${(v / 1000).toFixed(0)}k`
      : v.toString()

  return (
    <div>
      <h3 className="mb-5 text-sm font-semibold text-ink-900">Vermögensaufbau & Tilgung</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="equityGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="loanGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DC2626" stopOpacity={0.08} />
              <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={fmtAxis}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#64748B', paddingTop: '14px', fontFamily: 'Inter' }}
          />
          <Area
            type="monotone"
            dataKey="Immobilienwert"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#propGrad)"
          />
          <Area
            type="monotone"
            dataKey="Eigenkapital"
            stroke="#16A34A"
            strokeWidth={2}
            fill="url(#equityGrad2)"
          />
          <Area
            type="monotone"
            dataKey="Darlehensrestschuld"
            stroke="#DC2626"
            strokeWidth={2}
            fill="url(#loanGrad2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
