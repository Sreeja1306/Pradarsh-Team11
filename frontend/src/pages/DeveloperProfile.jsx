import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Layers, Eye, Code2, Globe, Plus, Calendar
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Loader from '../components/common/Loader'
import ProjectCard from '../components/apps/ProjectCard'
import authService from '../services/authService'
import projectService from '../services/projectService'
import useAuth from '../hooks/useAuth'
import { getAvatarInitials, stringToColor, formatMonthYear } from '../utils/helpers'

// ── helpers ───────────────────────────────────────────────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const isUUID  = (s) => UUID_RE.test(s ?? '')

function safeDisplayName(full_name, username) {
  if (full_name && full_name.trim() && !isUUID(full_name.trim())) return full_name.trim()
  if (username  && username.trim()  && !isUUID(username.trim()))  return username.trim()
  return 'Developer'
}

function safeHandle(username) {
  if (username && username.trim() && !isUUID(username.trim())) return username.trim()
  return null
}

// ── stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
      </div>
    </div>
  )
}

// ── project skeleton ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function DeveloperProfile() {
  const { username: paramSlug } = useParams()
  const { user: currentUser }   = useAuth()

  const [profile,     setProfile]     = useState(null)
  const [projects,    setProjects]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [projLoading, setProjLoading] = useState(true)
  const [notFound,    setNotFound]    = useState(false)

  // 1 ── fetch profile (by username or UUID)
  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await authService.getPublicProfile(paramSlug)
        setProfile(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [paramSlug])

  // 2 ── fetch projects using profile.id — the only reliable key
  useEffect(() => {
    if (!profile?.id) return
    const run = async () => {
      setProjLoading(true)
      try {
        // Pass profile.id (UUID) directly — never the URL slug
        const data = await projectService.getProjectsByUsername(profile.id)
        setProjects(data || [])
      } catch {
        setProjects([])
      } finally {
        setProjLoading(false)
      }
    }
    run()
  }, [profile?.id])

  // ── loading ────────────────────────────────────────────────────────────────
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

  // ── not found ──────────────────────────────────────────────────────────────
  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Code2 className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Developer not found</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            This profile doesn't exist or may have been removed.
          </p>
          <Link to="/explore" className="btn-primary mt-2">← Back to Explore</Link>
        </div>
        <Footer />
      </div>
    )
  }

  // ── derived data ───────────────────────────────────────────────────────────
  const { full_name, username, avatar_url, bio, created_at } = profile

  const displayName   = safeDisplayName(full_name, username)
  const handle        = safeHandle(username)
  const initials      = getAvatarInitials(displayName)
  const avatarGrad    = stringToColor(displayName)
  const isOwner       = !!(currentUser && profile.id === currentUser.id)
  const totalViews    = projects.reduce((s, p) => s + (p.view_count || 0), 0)
  const uniqueTechs   = new Set(projects.flatMap(p => p.technologies || [])).size
  const publishedCount = projects.length   // already filtered to published on backend

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/60">
      <Navbar />

      <main className="flex-1 w-full">

        {/* ── Cover banner ─────────────────────────────────────────────── */}
        <div className="relative h-48 sm:h-60"
          style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ec4899 100%)' }}>
          {/* dot pattern */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'24px 24px' }} />
          {/* back button */}
          <Link to="/explore"
            className="absolute top-4 left-4 sm:left-8 inline-flex items-center gap-1.5
              px-3 py-1.5 rounded-xl text-xs font-medium bg-white/20 backdrop-blur-sm
              text-white hover:bg-white/30 transition-all">
            <ArrowLeft className="w-3.5 h-3.5" /> Explore
          </Link>
          {/* own-profile actions */}
          {isOwner && (
            <div className="absolute top-4 right-4 sm:right-8 flex gap-2">
              <Link to="/publish"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  text-xs font-semibold bg-white text-primary-600 hover:bg-gray-50
                  transition-all shadow-sm">
                <Plus className="w-3.5 h-3.5" /> New Project
              </Link>
            </div>
          )}
        </div>

        {/* ── Profile card (overlaps cover) ────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-14 sm:-mt-16 bg-white rounded-2xl shadow-sm
            border border-gray-100 p-6 sm:p-8">

            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {avatar_url ? (
                  <img src={avatar_url} alt={displayName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover
                      ring-4 ring-white shadow-lg" />
                ) : (
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl
                    bg-gradient-to-br ${avatarGrad} flex items-center justify-center
                    ring-4 ring-white shadow-lg`}>
                    <span className="text-white font-black text-3xl sm:text-4xl">{initials}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                      {displayName}
                    </h1>
                    {handle && (
                      <p className="text-primary-500 font-medium text-sm mt-0.5">@{handle}</p>
                    )}
                  </div>
                  {isOwner && (
                    <Link to="/dashboard"
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold border
                        border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                      Edit Profile
                    </Link>
                  )}
                </div>

                {bio && (
                  <p className="text-gray-600 text-sm leading-relaxed mt-3 max-w-xl">{bio}</p>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {created_at && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-primary-400" />
                      Member since {formatMonthYear(created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats row ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatCard
              icon={Layers}
              value={projLoading ? '—' : publishedCount}
              label="Projects Published"
              color="bg-gradient-to-br from-primary-500 to-accent-500"
            />
            <StatCard
              icon={Eye}
              value={projLoading ? '—' : totalViews}
              label="Total Views"
              color="bg-gradient-to-br from-violet-500 to-purple-600"
            />
            <StatCard
              icon={Code2}
              value={projLoading ? '—' : uniqueTechs}
              label="Technologies Used"
              color="bg-gradient-to-br from-cyan-500 to-blue-500"
            />
            <StatCard
              icon={Globe}
              value={projLoading ? '—' : (publishedCount > 0 ? publishedCount : 0)}
              label="Live Projects"
              color="bg-gradient-to-br from-emerald-500 to-teal-500"
            />
          </div>

          {/* ── Projects section ─────────────────────────────────────────── */}
          <div className="mt-8 pb-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Published Projects
                {!projLoading && publishedCount > 0 && (
                  <span className="ml-2 text-sm font-semibold text-primary-500">
                    {publishedCount}
                  </span>
                )}
              </h2>
              {isOwner && publishedCount > 0 && (
                <Link to="/publish" className="btn-primary text-sm px-4 py-2">
                  + New Project
                </Link>
              )}
            </div>

            {/* Loading skeletons */}
            {projLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!projLoading && publishedCount === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center
                rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100
                  flex items-center justify-center mb-5 shadow-sm">
                  <Layers className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">
                  0 Projects Published
                </p>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No projects yet</h3>
                <p className="text-sm text-gray-400 max-w-xs mb-6">
                  {isOwner
                    ? "You haven't published any projects yet. Share your work with the community!"
                    : `${displayName} hasn't published any projects yet.`}
                </p>
                {isOwner && (
                  <Link to="/publish" className="btn-primary text-sm px-6 py-2.5">
                    Publish Your First Project
                  </Link>
                )}
              </div>
            )}

            {/* Project grid */}
            {!projLoading && publishedCount > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
