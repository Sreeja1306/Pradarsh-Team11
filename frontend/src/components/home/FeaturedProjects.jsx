import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProjectCard from '../apps/ProjectCard'
import projectService from '../../services/projectService'

// Skeleton card matching ProjectCard dimensions
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-100 rounded-full w-14" />
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
          <div className="w-6 h-6 rounded-full bg-gray-100" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    projectService.getProjects(1, 6)
      .then((res) => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  // Don't render the section at all if there are no projects and we're done loading
  if (!loading && projects.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
                Latest work
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900">
              Recent{' '}
              <span className="text-gradient">projects</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fresh from the community — see what developers are building.
            </p>
          </div>

          <Link
            to="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl
              text-sm font-semibold border border-gray-200 text-gray-700
              hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex-shrink-0"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Mobile "View all" — below grid on small screens */}
        {!loading && projects.length > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                text-sm font-semibold bg-gradient-to-r from-primary-500 to-accent-500
                text-white shadow-glow hover:from-primary-600 hover:to-accent-600
                transition-all duration-200"
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Desktop "Explore all" CTA row below grid */}
        {!loading && projects.length > 0 && (
          <div className="mt-10 hidden sm:flex items-center justify-center">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl
                text-sm font-semibold bg-gradient-to-r from-primary-500 to-accent-500
                text-white shadow-glow hover:from-primary-600 hover:to-accent-600
                transition-all duration-200"
            >
              Explore all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
