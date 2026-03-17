import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { InvestmentReport } from '@/components/pdf/InvestmentReport'
import type { PropertyInputs, CalculationResults } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is Pro
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status !== 'pro') {
      return NextResponse.json(
        { error: 'PDF export is a Pro feature. Please upgrade your account.' },
        { status: 403 }
      )
    }

    const { inputs, results }: { inputs: PropertyInputs; results: CalculationResults } =
      await req.json()

    const pdfBuffer = await renderToBuffer(
      /* eslint-disable-next-line */
      // @ts-expect-error react-pdf type mismatch
      createElement(InvestmentReport, { inputs, results })
    )

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="immobilien-analyse-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
