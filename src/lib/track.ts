'use client'

type TrackEvent =
  | 'pdf_export_clicked_free_user'
  | 'pdf_export_clicked_pro_user'
  | 'upgrade_modal_opened'
  | 'upgrade_clicked'
  | 'upgrade_modal_dismissed'
  | 'ai_analysis_started'
  | 'ai_analysis_pro_hint_shown'

export function track(event: TrackEvent, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[track]', event, properties ?? '')
  }
  // Extend here with PostHog, Plausible, or Segment when ready:
  // e.g. window.posthog?.capture(event, properties)
}
