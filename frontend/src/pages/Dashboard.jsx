import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import MyProjects from '../components/dashboard/MyProjects'
import projectService from '../services/projectService'
import useAuth from '../hooks/useAuth'
import { getAvatarInitials, stringToColor } from '../utils/helpers'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchMyProjects = async () => {
      setLoading(true)
      try {
        const data = await projectService.getMyProjects()
        setProjects(data || [])
      } catch {
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchMyProjects()
  }, [])

  const handleDeleted = (deletedId) => {
    setProjects((prev) => prev.filter((p) => p.id !== deletedId))
  }

  const displayName  = profile?.full_name || user?.email?.split('@')[0] || 'Developer'
  const initials     = getAvatarInitials(displayName)
  const avatarGradient = stringToColor(displayName)
  const publishedCount = projects.filter((p) => p.status === 'published').length
  const draftCount     = projects.filter((p) => p.status === 'draft').length

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-100"
              />
            ) : (
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradient}
                flex items-center justify-center ring-2 ring-primary-100`}>
                <span className="text-white font-black text-xl">{initials}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900">My Projects</h1>
              <p className="text-gray-500 text-sm">
                {displayName} ·{' '}
                {publishedCount} published
                {draftCount > 0 && `, ${draftCount} draft`}
              </p>
            </div>
          </div>

          <Link to="/publish" className="btn-primary self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Publish New Project
          </Link>
        </div>

        {/* Stats strip */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total',     value: projects.length,        color: 'text-gray-900' },
              { label: 'Published', value: publishedCount,         color: 'text-green-600' },
              { label: 'Drafts',    value: draftCount,             color: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Project list */}
        <MyProjects
          projects={projects}
          loading={loading}
          onDeleted={handleDeleted}
        />
      </main>

      <Footer />
    </div>
  )
}
