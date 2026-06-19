import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/api'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)         // Supabase auth user
  const [profile, setProfile] = useState(null)   // Pradarsh profile from DB
  const [session, setSession] = useState(null)   // Supabase session
  const [loading, setLoading] = useState(true)   // Initial auth check loading

  // Fetch the backend profile once we have a session
  const fetchProfile = async () => {
    try {
      const profileData = await authService.getMyProfile()
      setProfile(profileData)
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    // Get initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile()
      }
      setLoading(false)
    })

    // Listen for auth state changes (login, logout, token refresh, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile()
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile()
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
