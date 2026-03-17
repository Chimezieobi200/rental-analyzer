'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SubscriptionState {
  isPro: boolean
  isLoggedIn: boolean
  loading: boolean
}

export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    isLoggedIn: false,
    loading: true,
  })

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      if (!supabase) {
        setState({ isPro: false, isLoggedIn: false, loading: false })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setState({ isPro: false, isLoggedIn: false, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      setState({
        isPro: profile?.subscription_status === 'pro',
        isLoggedIn: true,
        loading: false,
      })
    }

    check()
  }, [])

  return state
}
