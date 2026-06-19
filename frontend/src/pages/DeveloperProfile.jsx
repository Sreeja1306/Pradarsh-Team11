import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Github, ExternalLink, Linkedin, Calendar, ArrowLeft } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Loader from '../components/common/Loader'
import ProjectGrid from '../components/apps/ProjectGrid'
import authService from '../services/authService'
import projectService from '../services/projectService'
import { getAvatarInitials, stringToColor, formatMonthYear } from '../utils/helpers'

export default function DeveloperProfile() {
  const { username } = useParams()

  const [profile, setProfile]   = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [projLoading, setProjLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await authService.getPublicProfile(username)
        setProfile(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  // Fetch projects once we have the profile
  useEffect(() => {
    if (!profile) return
    const fetchProjects = async () => {
      setProjLoading(true)
      try {
        const data = await projectService.getProjectsByUsername(username)
        setProjects(data || [])
      } catch {
        setProjects([])
      } finally {
        setProjLoading(false)
      }
    }
    fetchProjects()
  }, [profile, username])

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="lg" text="Loading profile…" />
        </div>
        <Footer />
      </div>
    )
  }

  // ── Not found state (matches screenshot) ───────────────────────────────
  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Developer not found</h2>
          <Link
            to="/explore"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            ← Back to Explore
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const {
    full_name, avatar_url, bio,
    github_url, linkedin_url, website_url,
    created_at,
  } = profile

  const initials      = getAvatarInitials(full_name)
  const avatarGradient = stringToColor(full_name)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full">

        {/* ── Hero banner ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Back link */}
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600
                transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Explore
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

              {/* Avatar */}
              {avatar_url ? (
                <img
                  src={avatar_url}
                  alt={full_name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-card flex-shrink-0"
                />
              ) : (
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarGradient}
                  flex items-center justify-center ring-4 ring-white shadow-card flex-shrink-0`}>
                  <span className="text-white font-black text-3xl">{initials}</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                  {full_name || username}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5 mb-3">@{username}</p>

                {bio && (
                  <p className="text-gray-600 text-base leading-relaxed max-w-xl mb-4">{bio}</p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4">
                  {created_at && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-primary-400" />
                      Built since {formatMonthYear(created_at)}
                    </span>
                  )}

                  {/* Social links */}
                  {github_url && (
                    <a
                      href={github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600
                        hover:text-gray-900 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {linkedin_url && (
                    <a
                      href={linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600
                        hover:text-gray-900 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {website_url && (
                    <a
                      href={website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-600
                        hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {/* Project count badge */}
              {!projLoading && (
                <div className="flex-shrink-0 text-center px-5 py-3 rounded-2xl bg-white
                  shadow-card border border-gray-100">
                  <div className="text-2xl font-black text-gradient">{projects.length}</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">
                    {projects.length === 1 ? 'Project' : 'Projects'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Projects section ─────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Projects by{' '}
              <span className="text-gradient">{full_name?.split(' ')[0] || username}</span>
            </h2>
            {projects.length > 0 && (
              <span className="text-sm text-gray-500">{projects.length} published</span>
            )}
          </div>

          <ProjectGrid
            projects={projects}
            loading={projLoading}
            emptyMessage={`${full_name || username} hasn't published any projects yet.`}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
