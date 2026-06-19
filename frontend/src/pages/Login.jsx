import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoginForm from '../components/auth/LoginForm'
import useAuth from '../hooks/useAuth'
import { fadeUpVariants } from '../utils/pageAnimations'

export default function Login() {
  const { isAuthenticated, loading } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // If already logged in, redirect to the intended page or Home
      const to = location.state?.from?.pathname || '/'
      navigate(to, { replace: true })
    }
  }, [isAuthenticated, loading, navigate, location])

  if (loading) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50
      flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-md"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <LoginForm />
      </motion.div>
    </div>
  )
}
