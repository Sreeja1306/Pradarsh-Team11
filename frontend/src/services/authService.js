import { supabase } from './api'
import api from './api'

const authService = {
  /**
   * Sign up with email and password.
   * full_name is passed as user metadata so the DB trigger can use it.
   */
  async signUpWithEmail(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) throw error
    return data
  },

  /**
   * Sign in with email and password.
   */
  async signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  /**
   * Sign out the current user.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Get the current active session.
   */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  /**
   * Get the current user from Supabase.
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  /**
   * Get profile from backend API.
   */
  async getMyProfile() {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  /**
   * Update profile via backend API.
   */
  async updateMyProfile(profileData) {
    const response = await api.put('/auth/me', profileData)
    return response.data.data
  },

  /**
   * Get a public developer profile by username.
   */
  async getPublicProfile(username) {
    const response = await api.get(`/auth/profile/${username}`)
    return response.data.data
  },
}

export default authService
