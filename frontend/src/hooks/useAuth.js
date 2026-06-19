import { useAuthContext } from '../context/AuthContext'

/**
 * Convenience hook to access the auth context.
 * Returns: { user, profile, session, loading, signOut, refreshProfile, isAuthenticated }
 */
const useAuth = () => {
  return useAuthContext()
}

export default useAuth
