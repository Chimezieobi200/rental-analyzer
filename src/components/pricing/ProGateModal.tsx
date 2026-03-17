'use client'

import { useEffect } from 'react'
import { X, FileText, Sparkles, Share2, ArrowRight } from 'lucide-react'
import { track } from '@/lib/track'

interface ProGateModalProps {
  feature: 'pdf' | 'ai'
  onClose: () => void
}

const FEATURE_COPY = {
  pdf: {
    title: 'PDF-Export ist ein Pro-Feature',
    description: 'Erstelle professionell formatierte Berichte für Bankgespräche, Steuerberater und deine eigenen Unterlagen.',
    benefits: [
      { icon: FileText, text: 'Vollständige Analyse als PDF-Bericht' },
      { icon: Sparkles, text: 'Saubere, professionelle Formatierung' },
      { icon: Share2, text: 'Einfach teilen oder ausdrucken' },
    ],
  },
  ai: {
    title: 'KI-Gutachten ist ein Pro-Feature',
    description: 'Erhalte eine KI-gestützte Investitionsanalyse mit konkreten Handlungsempfehlungen.',
    benefits: [
      { icon: Sparkles, text: 'Stärken & Risiken automatisch erkennen' },
      { icon: FileText, text: 'Professionelles Gutachten in Sekunden' },
      { icon: Share2, text: 'Als PDF exportieren' },
    ],
  },
}

export function ProGateModal({ feature, onClose }: ProGateModalProps) {
  const copy = FEATURE_COPY[feature]

  useEffect(() => {
    track('upgrade_modal_opened', { feature })
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [feature, onClose])

  const handleLearnMore = () => {
    track('upgrade_clicked', { feature, source: 'modal_learn_more' })
    window.location.href = '/#pricing'
  }

  const handleDismiss = () => {
    track('upgrade_modal_dismissed', { feature })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900 shadow-overlay animate-scale-in">

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/10 hover:text-white/70"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-500/25">
            <FileText className="h-5 w-5 text-brand-400" />
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold text-white">{copy.title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-white/50">{copy.description}</p>

          {/* Benefits */}
          <ul className="mt-5 space-y-3">
            {copy.benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className="h-3.5 w-3.5 text-white/50" />
                </div>
                <span className="text-[13px] text-white/60">{text}</span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleLearnMore}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-btn-brand"
            >
              Mehr erfahren
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleDismiss}
              className="w-full rounded-xl py-2.5 text-sm font-medium text-white/30 transition-colors hover:text-white/60"
            >
              Später
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
