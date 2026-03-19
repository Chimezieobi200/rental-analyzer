'use client'

import { useState } from 'react'
import { Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  tooltip?: string
  highlight?: boolean
  valueColor?: 'positive' | 'negative' | 'neutral' | 'brand'
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  tooltip,
  highlight = false,
  valueColor,
}: KPICardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const trendConfig = {
    up: {
      icon: ArrowUpRight,
      cls: 'text-positive-400 bg-positive-500/10',
    },
    down: {
      icon: ArrowDownRight,
      cls: 'text-negative-400 bg-negative-500/10',
    },
    neutral: {
      icon: Minus,
      cls: 'text-white/40 bg-white/[0.08]',
    },
  }

  const valueColorCls = {
    positive: 'text-positive-400',
    negative: 'text-negative-400',
    neutral: 'text-white',
    brand: 'text-brand-400',
  }

  const TrendIcon = trend ? trendConfig[trend].icon : null

  return (
    <div
      className={cn(
        'relative rounded-2xl p-5 transition-all duration-200',
        highlight
          ? 'border border-brand-500/30 bg-brand-500/10'
          : 'border border-white/[0.07] bg-white/[0.04] hover:-translate-y-0.5'
      )}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-xs font-medium leading-snug text-white/50">
          {title}
        </span>

        {tooltip && (
          <div className="relative shrink-0">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 z-20 w-52 rounded-xl border border-white/[0.12] bg-ink-900 px-3 py-2.5 text-xs leading-relaxed text-white/70 shadow-overlay">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            'text-2xl font-bold num tracking-tight leading-none',
            highlight
              ? 'text-white'
              : valueColor
              ? valueColorCls[valueColor]
              : 'text-white'
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-white/40">
            {unit}
          </span>
        )}
      </div>

      {/* Trend */}
      {trend && trendValue && TrendIcon && (
        <div className="mt-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              highlight ? 'bg-white/10 text-white/70' : trendConfig[trend].cls
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
