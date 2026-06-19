import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ProjectForm from '../components/publish/ProjectForm'
import Loader from '../components/common/Loader'
import projectService from '../services/projectService'
import useAuth from '../hooks/useAuth'
import { parseTechArray } from '../utils/helpers'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [project, setProject]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [notOwner, setNotOwner] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      try {
        const data = await projectService.getProjectById(id)
        if (!data) {
          setError('Project not found.')
          return
        }
        // Ownership check on frontend (backend enforces it too)
        if (user && data.user_id !== user.id) {
          setNotOwner(true)
          return
        }
        // Normalize technologies to array
        setProject({
          ...data,
          technologies: Array.isArray(data.technologies)
            ? data.technologies
            : parseTechArray(data.technologies),
          screenshots: data.screenshots || [],
        })
      } catch {
        setError('Failed to load project.')
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchProject()
  }, [id, user])

  const handleSubmit = async (formData) => {
    setSaving(true)
    setError('')
    try {
      await projectService.updateProject(id, formData)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to save changes. Please try again.'
      )
      setSaving(false)
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" text="Loading project…" />
        </div>
        <Footer />
      </div>
    )
  }

  // ── Not owner ────────────────────────────────────────────────────────
  if (notOwner) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h2>
          <p className="text-gray-500 mb-6">You don't have permission to edit this project.</p>
          <Link to="/dashboard" className="btn-primary">← Back to Dashboard</Link>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (error && !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary">← Back to Dashboard</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">

        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500
            hover:text-primary-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Edit Project
          </p>
          <h1 className="text-3xl font-black text-gray-900">
            Update your project
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
          {project && (
            <ProjectForm
              initialData={project}
              onSubmit={handleSubmit}
              loading={saving}
              submitLabel="Save changes"
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
