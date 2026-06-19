import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getAvatarInitials, truncateText, stringToColor } from '../../utils/helpers'

export default function ProjectCard({ project }) {
  const {
    id,
    title,
    description,
    category,
    technologies = [],
    thumbnail_url,
    author_name,
    author_username,
    author_avatar,
  } = project

  const initials = getAvatarInitials(author_name)
  const avatarGradient = stringToColor(author_name)
  const techsToShow = technologies.slice(0, 3)
  const extraTechs = technologies.length - 3

  return (
    <Link
      to={`/project/${id}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm
        hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <span className="text-4xl font-black text-gradient opacity-30">
              {title?.[0]?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Category badge — top left */}
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold
            bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
            {category}
          </span>
        )}

        {/* Arrow link — top right */}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm
          flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & description */}
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {truncateText(description, 100)}
          </p>
        </div>

        {/* Tech tags */}
        {techsToShow.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techsToShow.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
            {extraTechs > 0 && (
              <span className="tech-tag">+{extraTechs}</span>
            )}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
          {author_avatar ? (
            <img
              src={author_avatar}
              alt={author_name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center`}>
              <span className="text-white text-[9px] font-bold">{initials}</span>
            </div>
          )}
          <span className="text-xs text-gray-500 font-medium truncate">
            {author_name || 'Unknown Developer'}
          </span>
        </div>
      </div>
    </Link>
  )
}
