import ProjectCard from './ProjectCard'
import { Frown } from 'lucide-react'

// Skeleton card for loading state
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

export default function ProjectGrid({
  projects,
  loading,
  emptyMessage = 'No projects found.',
  hasActiveFilters = false,
  onClearFilters,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    // Tech-filter empty state — special message + clear button
    if (hasActiveFilters) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Frown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No matches found</h3>
          <p className="text-gray-400 text-sm max-w-xs mb-5">
            No projects found for these technologies — try a different filter.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-5 py-2 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-primary-500 to-accent-500 text-white
                shadow-glow hover:from-primary-600 hover:to-accent-600 transition-all"
            >
              Clear filters
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Frown className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Nothing here yet</h3>
        <p className="text-gray-400 text-sm max-w-xs">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
