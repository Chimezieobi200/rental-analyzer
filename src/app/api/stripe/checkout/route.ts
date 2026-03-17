import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

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

    // Get user profile for stripe customer id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, subscription_status')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status === 'pro') {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

    const session = await createCheckoutSession(
      profile?.stripe_customer_id || null,
      priceId,
      `${appUrl}/analyze?success=true`,
      `${appUrl}/analyze?canceled=true`,
      user.id,
      user.email || ''
    )

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
