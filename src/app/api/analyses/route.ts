import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: list user's saved analyses
export async function GET() {
  try {
    const supabase = createClient()
    if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('analyses')
      .select('id, name, location, inputs, results, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ analyses: data }, { status: 200 })
  } catch (error) {
    console.error('GET analyses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: remove a saved analysis
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient()
    if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE analyses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: save a new analysis
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check free plan limit (3 saved analyses)
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, analyses_count')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status !== 'pro') {
      const { count } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .then((r) => ({ count: r.count ?? 0 }))

      if ((count as number) >= 3) {
        return NextResponse.json(
          { error: 'Free plan limit reached. Upgrade to Pro for unlimited analyses.' },
          { status: 403 }
        )
      }
    }

    const { name, location, inputs, results } = await req.json()

    if (!inputs || !results) {
      return NextResponse.json({ error: 'Missing inputs or results' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        name: name || 'Unbenannte Analyse',
        location: location || inputs.location || '',
        inputs,
        results,
      })
      .select('id, name, created_at')
      .single()

    if (error) throw error

    return NextResponse.json({ analysis: data }, { status: 201 })
  } catch (error) {
    console.error('POST analyses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
