import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ProjectForm from '../components/publish/ProjectForm'
import projectService from '../services/projectService'
import useAuth from '../hooks/useAuth'

export default function Publish() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const project = await projectService.createProject(formData)
      navigate(`/project/${project.id}`)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to publish project. Please try again.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">

        {!isAuthenticated ? (
          /* ── Sign-in gate (matches screenshot) ───────────────────── */
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center bg-white rounded-2xl shadow-card p-10 w-full max-w-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to publish</h2>
              <p className="text-gray-500 text-sm mb-6">
                Create your account first — it takes a minute.
              </p>
              <Link to="/register" className="btn-primary w-full justify-center">
                Create account
              </Link>
              <p className="mt-4 text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        ) : (
          /* ── Publish form ─────────────────────────────────────────── */
          <div>
            {/* Page header */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
                Publish
              </p>
              <h1 className="text-3xl font-black text-gray-900">
                Show the world what you built.
              </h1>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
              <ProjectForm
                onSubmit={handleSubmit}
                loading={loading}
                submitLabel="Publish project"
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
