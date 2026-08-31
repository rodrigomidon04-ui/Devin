import { useCallback, useEffect, useState } from 'react'
import { demoStore } from './demoStore'
import { supabase } from './supabase'

export interface AuthState {
  email: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const DEMO_EMAIL = 'demo@local'

export function useAuth(): AuthState {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setEmail(demoStore.isDemoSessionActive() ? DEMO_EMAIL : null)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setEmail(session?.user.email ?? null),
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (userEmail: string, password: string) => {
    if (!supabase) {
      if (!userEmail) throw new Error('Escribí un correo para entrar al modo demo')
      demoStore.startSession()
      setEmail(DEMO_EMAIL)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password,
    })
    if (error) throw new Error(error.message)
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) {
      demoStore.endSession()
      setEmail(null)
      return
    }
    await supabase.auth.signOut()
    setEmail(null)
  }, [])

  return { email, loading, signIn, signOut }
}
