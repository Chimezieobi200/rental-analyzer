'use client'

import { useState, useRef } from 'react'
import { Sparkles, ChevronRight, AlertCircle } from 'lucide-react'
import type { PropertyInputs, CalculationResults } from '@/types'
import { cn } from '@/lib/utils'

interface AIAnalystProps {
  inputs: PropertyInputs
  results: CalculationResults
}

type Section = { heading: string; content: string }

function parseSection(text: string): Section[] {
  const sections: Section[] = []
  const lines = text.split('\n')
  let current: Section | null = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current)
      current = { heading: line.replace('## ', '').trim(), content: '' }
    } else if (current) {
      current.content += line + '\n'
    }
  }
  if (current) sections.push(current)
  return sections
}

function renderContent(content: string) {
  return content
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line, i) => {
      const isBullet = line.startsWith('- ') || line.startsWith('• ')
      const text = isBullet ? line.replace(/^[-•]\s*/, '') : line
      return isBullet ? (
        <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/60">
          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-white/20" />
          <span>{text}</span>
        </li>
      ) : (
        <p key={i} className="text-[13.5px] leading-relaxed text-white/60">{text}</p>
      )
    })
}

const SECTION_META: Record<string, { color: string; dot: string }> = {
  Fazit:         { color: 'text-white',       dot: 'bg-white/40' },
  Stärken:       { color: 'text-positive-400', dot: 'bg-positive-500' },
  Risiken:       { color: 'text-red-400',      dot: 'bg-red-500' },
  Empfehlungen:  { color: 'text-brand-400',    dot: 'bg-brand-500' },
}

export function AIAnalyst({ inputs, results }: AIAnalystProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [rawText, setRawText] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const startAnalysis = async () => {
    setStatus('loading')
    setRawText('')
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, results }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setRawText(prev => prev + decoder.decode(value))
      }

      setStatus('done')
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') setStatus('error')
    }
  }

  const sections = parseSection(rawText)

  if (status === 'idle') {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 ring-1 ring-brand-500/20">
              <Sparkles className="h-4 w-4 text-brand-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">KI-Gutachten</p>
              <p className="text-[11px] text-white/30">Professionelle Analyse in Sekunden</p>
            </div>
          </div>
          <button
            onClick={startAnalysis}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white/60 transition-all hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-300"
          >
            KI-Analyse starten
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
        <p className="text-[13px] text-red-400">Analyse fehlgeschlagen. Bitte versuche es erneut.</p>
        <button
          onClick={() => setStatus('idle')}
          className="ml-auto text-[12px] font-medium text-red-400/60 hover:text-red-400 transition-colors"
        >
          Zurück
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
          <Sparkles className="h-4 w-4 text-brand-400" />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-white">KI-Gutachten</p>
          {status === 'loading' && (
            <span className="flex items-center gap-1.5 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Analysiert...
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-white/[0.04]">
        {/* Streaming raw text before sections are parsed */}
        {sections.length === 0 && rawText && (
          <div className="px-6 py-5">
            <p className="text-[13.5px] leading-relaxed text-white/50">{rawText}</p>
          </div>
        )}

        {sections.map((sec) => {
          const meta = SECTION_META[sec.heading] ?? { color: 'text-white/60', dot: 'bg-white/20' }
          const isFazit = sec.heading === 'Fazit'
          return (
            <div key={sec.heading} className={cn('px-6 py-5', isFazit && 'bg-white/[0.015]')}>
              <div className="mb-3 flex items-center gap-2">
                <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', meta.dot)} />
                <span className={cn('text-[11px] font-semibold uppercase tracking-widest', meta.color)}>
                  {sec.heading}
                </span>
              </div>
              <ul className="space-y-1.5">
                {renderContent(sec.content)}
              </ul>
            </div>
          )
        })}

        {/* Loading cursor */}
        {status === 'loading' && (
          <div className="px-6 py-3">
            <span className="inline-block h-4 w-0.5 animate-pulse bg-brand-400/60" />
          </div>
        )}
      </div>
    </div>
  )
}
