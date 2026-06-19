import { useState } from 'react'
import { X, Search, SlidersHorizontal } from 'lucide-react'
import { POPULAR_TECHNOLOGIES } from '../../utils/constants'

export const OTHER_TECH_SENTINEL = '__other_tech__'

// Sorted A-Z; Other is appended manually as the last row — never sorted into the list
const SORTED_TECHNOLOGIES = [...POPULAR_TECHNOLOGIES].sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' })
)

export default function FilterPanel({ selectedTechs = [], onTechsChange, onClearAll }) {
  const [techSearch, setTechSearch] = useState('')

  const otherActive = selectedTechs.includes(OTHER_TECH_SENTINEL)

  const toggleTech = (tech) => {
    const already = selectedTechs.some((t) => t.toLowerCase() === tech.toLowerCase())
    const updated = already
      ? selectedTechs.filter((t) => t.toLowerCase() !== tech.toLowerCase())
      : [...selectedTechs, tech]
    onTechsChange(updated)
  }

  const toggleOther = () => {
    if (otherActive) {
      onTechsChange(selectedTechs.filter((t) => t !== OTHER_TECH_SENTINEL))
    } else {
      onTechsChange([...selectedTechs, OTHER_TECH_SENTINEL])
    }
  }

  const visibleTechs = techSearch.trim()
    ? SORTED_TECHNOLOGIES.filter((t) =>
        t.toLowerCase().includes(techSearch.trim().toLowerCase())
      )
    : SORTED_TECHNOLOGIES

  // Total count shown in the badge — includes "Other" so badge matches chips above grid
  const activeCount = selectedTechs.length
  const hasAny = activeCount > 0

  return (
    <div className="w-full space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary-500" />
          Technologies
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full
              bg-gradient-to-r from-primary-500 to-accent-500 text-white leading-none ml-0.5">
              {activeCount}
            </span>
          )}
        </span>        {hasAny && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-primary-600 transition-colors underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={techSearch}
          onChange={(e) => setTechSearch(e.target.value)}
          placeholder="Search…"
          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        />
      </div>

      {/* Scrollable list */}
      <div className="space-y-0.5 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {visibleTechs.map((tech) => {
          const isSelected = selectedTechs.some(
            (t) => t.toLowerCase() === tech.toLowerCase()
          )
          return (
            <button
              key={tech}
              onClick={() => toggleTech(tech)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all
                flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 font-medium'
              }`}
            >
              <span>{tech}</span>
              {isSelected && <X className="w-3 h-3 opacity-70 flex-shrink-0" />}
            </button>
          )
        })}

        {/* "Other" — same style as every row, always last, hidden during searches that don't match */}
        {(!techSearch.trim() || 'other'.includes(techSearch.trim().toLowerCase())) && (
          <button
            onClick={toggleOther}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all
              flex items-center justify-between ${
              otherActive
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 font-medium'
            }`}
          >
            <span>Other</span>
            {otherActive && <X className="w-3 h-3 opacity-70 flex-shrink-0" />}
          </button>
        )}

        {visibleTechs.length === 0 &&
          !(!techSearch.trim() || 'other'.includes(techSearch.trim().toLowerCase())) && (
          <p className="text-xs text-gray-400 text-center py-4">No technologies match</p>
        )}
      </div>
    </div>
  )
}
