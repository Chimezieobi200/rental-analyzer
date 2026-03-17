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
      cls: 'text-positive-600 bg-positive-50',
    },
    down: {
      icon: ArrowDownRight,
      cls: 'text-negative-600 bg-negative-50',
    },
    neutral: {
      icon: Minus,
      cls: 'text-ink-400 bg-ink-100',
    },
  }

  const valueColorCls = {
    positive: 'text-positive-700',
    negative: 'text-negative-600',
    neutral: 'text-ink-900',
    brand: 'text-brand-700',
  }

  const TrendIcon = trend ? trendConfig[trend].icon : null

  return (
    <div
      className={cn(
        'relative rounded-2xl p-5 transition-all duration-200',
        highlight
          ? 'bg-ink-950 shadow-btn-dark'
          : 'bg-surface shadow-card hover:shadow-card-hover hover:-translate-y-0.5'
      )}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className={cn(
          'text-xs font-medium leading-snug',
          highlight ? 'text-white/60' : 'text-ink-500'
        )}>
          {title}
        </span>

        {tooltip && (
          <div className="relative shrink-0">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={cn(
                'transition-colors',
                highlight ? 'text-white/30 hover:text-white/60' : 'text-ink-300 hover:text-ink-500'
              )}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 z-20 w-52 rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-ink-600 shadow-overlay">
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
              : 'text-ink-900'
          )}
        >
          {value}
        </span>
        {unit && (
          <span className={cn(
            'text-xs font-medium',
            highlight ? 'text-white/40' : 'text-ink-400'
          )}>
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
