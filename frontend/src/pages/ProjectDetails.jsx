import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Eye, Calendar,
  Tag, ChevronLeft, ChevronRight
} from 'lucide-react'import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Loader from '../components/common/Loader'
import projectService from '../services/projectService'
import useAuth from '../hooks/useAuth'
import { formatDate, getAvatarInitials, stringToColor } from '../utils/helpers'

export default function ProjectDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeScreenshot, setActiveScreenshot] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      try {
        const data = await projectService.getProjectById(id)
        setProject(data)
      } catch (err) {
        setError('Project not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

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

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-500 mb-6">This project may have been removed or doesn't exist.</p>
          <Link to="/explore" className="btn-primary">← Back to Explore</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const {
    title, description, category, technologies = [],
    demo_url, thumbnail_url, screenshots = [],
    view_count, created_at,
    author_name, author_username, author_avatar,
    author_bio,
    user_id,
  } = project

  const isOwner = user && user.id === user_id
  const initials = getAvatarInitials(author_name)
  const avatarGradient = stringToColor(author_name)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        {/* Back link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600
            transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Explore
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left / Main content ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Hero thumbnail */}
            {thumbnail_url && (
              <div className="rounded-2xl overflow-hidden shadow-card aspect-[16/9] bg-gray-100">
                <img
                  src={thumbnail_url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title + meta */}
            <div className="space-y-4">
              {/* Category + owner actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="category-pill text-sm px-3 py-1">
                  <Tag className="w-3 h-3 mr-1 inline" />
                  {category}
                </span>
                {isOwner && (
                  <div className="flex gap-2">
                    <Link
                      to={`/edit/${id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-primary-200
                        text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                {title}
              </h1>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {view_count || 0} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(created_at)}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                {description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {demo_url && (
                  <a
                    href={demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span key={tech} className="tech-tag text-sm px-3 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshot gallery */}
            {screenshots.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Screenshots
                </h3>

                {/* Main screenshot */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[16/9]">
                  <img
                    src={screenshots[activeScreenshot]}
                    alt={`Screenshot ${activeScreenshot + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Navigation arrows */}
                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveScreenshot((i) => Math.max(0, i - 1))}
                        disabled={activeScreenshot === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                          bg-white/80 backdrop-blur-sm flex items-center justify-center
                          shadow-sm disabled:opacity-30 hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveScreenshot((i) => Math.min(screenshots.length - 1, i + 1))}
                        disabled={activeScreenshot === screenshots.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                          bg-white/80 backdrop-blur-sm flex items-center justify-center
                          shadow-sm disabled:opacity-30 hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {screenshots.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {screenshots.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveScreenshot(i)}
                        className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          activeScreenshot === i
                            ? 'border-primary-500 shadow-glow'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right / Sidebar ──────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Developer card */}
            <div className="card p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Built by
              </h3>

              <div className="flex items-start gap-3">
                {author_avatar ? (
                  <img
                    src={author_avatar}
                    alt={author_name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary-100 flex-shrink-0"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradient}
                    flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{initials}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 leading-tight">{author_name || 'Unknown Developer'}</p>
                  {author_username && (
                    <Link
                      to={`/developer/${author_username}`}
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      @{author_username}
                    </Link>
                  )}
                </div>
              </div>

              {author_bio && (
                <p className="text-sm text-gray-500 leading-relaxed">{author_bio}</p>
              )}

              {author_username && (
                <Link
                  to={`/developer/${author_username}`}
                  className="block w-full text-center py-2 rounded-xl text-sm font-semibold
                    border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  View Profile
                </Link>
              )}
            </div>

            {/* Quick info card */}
            <div className="card p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Project Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-700">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Published</span>
                  <span className="font-medium text-gray-700">{formatDate(created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Views</span>
                  <span className="font-medium text-gray-700">{view_count || 0}</span>
                </div>
                {technologies.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stack size</span>
                    <span className="font-medium text-gray-700">{technologies.length} technologies</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
