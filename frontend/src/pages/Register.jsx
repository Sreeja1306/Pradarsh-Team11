import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import RegisterForm from '../components/auth/RegisterForm'
import useAuth from '../hooks/useAuth'
import { fadeUpVariants } from '../utils/pageAnimations'

export default function Register() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, loading, navigate])

  if (loading) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-md"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <RegisterForm />
      </motion.div>
    </div>
  )
}
