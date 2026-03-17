'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { YearlyProjection } from '@/types'

interface WealthGrowthChartProps {
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

export function WealthGrowthChart({ data }: WealthGrowthChartProps) {
  const chartData = data.map((d) => ({
    year: d.year,
    'Nettovermögen': Math.round(d.netWorth),
    'Eigenkapital': Math.round(d.equity),
    'Kum. Cashflow': Math.round(d.cumulativeCashflow),
  }))

  const fmtAxis = (v: number) =>
    v >= 1000000
      ? `${(v / 1000000).toFixed(1)}M`
      : v >= 1000
      ? `${(v / 1000).toFixed(0)}k`
      : v.toString()

  return (
    <div>
      <h3 className="mb-5 text-sm font-semibold text-ink-900">Vermögensentwicklung (10 Jahre)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
          <ReferenceLine y={0} stroke="#E2E8F0" strokeWidth={1.5} />
          <Line
            type="monotone"
            dataKey="Nettovermögen"
            stroke="#0F172A"
            strokeWidth={2.5}
            dot={{ fill: '#0F172A', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="Eigenkapital"
            stroke="#16A34A"
            strokeWidth={2}
            dot={{ fill: '#16A34A', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="Kum. Cashflow"
            stroke="#2563EB"
            strokeWidth={2}
            dot={{ fill: '#2563EB', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            strokeDasharray="5 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
