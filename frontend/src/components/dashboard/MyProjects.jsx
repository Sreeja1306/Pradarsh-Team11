import { Link } from 'react-router-dom'
import { Pencil, Eye, Calendar } from 'lucide-react'
import ProjectActions from './ProjectActions'
import { formatDate, truncateText, getAvatarInitials, stringToColor } from '../../utils/helpers'

function ProjectRow({ project, onDeleted }) {
  const {
    id, title, description, category,
    thumbnail_url, status, view_count, created_at,
  } = project

  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-4
      p-4 bg-white rounded-2xl border border-gray-100 shadow-sm
      hover:shadow-card transition-all duration-200">

      {/* Thumbnail */}
      <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100
            flex items-center justify-center">
            <span className="text-2xl font-black text-gradient opacity-30">
              {title?.[0]?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Link
            to={`/project/${id}`}
            className="font-bold text-gray-900 hover:text-primary-600 transition-colors truncate"
          >
            {title}
          </Link>
          {/* Status badge */}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            status === 'published'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {status}
          </span>
        </div>

        <p className="text-gray-500 text-xs mb-2 line-clamp-2">
          {truncateText(description, 90)}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {view_count || 0} views
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(created_at)}
          </span>
          {category && (
            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-medium">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 self-start sm:self-center">
        <Link
          to={`/edit/${id}`}
          title="Edit project"
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50
            transition-all duration-150"
        >
          <Pencil className="w-4 h-4" />
        </Link>
        <ProjectActions
          projectId={id}
          projectTitle={title}
          onDeleted={onDeleted}
        />
      </div>
    </div>
  )
}

export default function MyProjects({ projects, onDeleted, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
            <div className="w-28 h-20 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚀</span>
        </div>
        <h3 className="text-lg font-bold text-gray-700 mb-1">No projects yet</h3>
        <p className="text-gray-400 text-sm mb-5">Publish your first project to get started.</p>
        <Link to="/publish" className="btn-primary">
          Publish a project
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} onDeleted={onDeleted} />
      ))}
    </div>
  )
}
