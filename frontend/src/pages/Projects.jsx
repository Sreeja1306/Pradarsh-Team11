import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import SearchBar from '../components/apps/SearchBar'
import FilterPanel, { OTHER_TECH_SENTINEL } from '../components/apps/FilterPanel'
import ProjectGrid from '../components/apps/ProjectGrid'
import projectService from '../services/projectService'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { ITEMS_PER_PAGE, CATEGORIES } from '../utils/constants'
import { pageVariants, fadeUpVariants } from '../utils/pageAnimations'
import WordReveal from '../components/common/WordReveal'

const OTHER_CAT_SENTINEL = '__other__'

// Categories sorted A-Z, used for the horizontal chip row
const SORTED_CATEGORIES = [...CATEGORIES].sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' })
)

// Human-readable label for a tech value (hides sentinel)
function techLabel(t) {
  return t === OTHER_TECH_SENTINEL ? 'Other' : t
}

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query,    setQuery]    = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [techs,    setTechs]    = useState(searchParams.getAll('technologies') || [])
  const [page,     setPage]     = useState(Number(searchParams.get('page')) || 1)

  const [projects, setProjects] = useState([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const hasFilters = !!(query || category || techs.length > 0)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: ITEMS_PER_PAGE }
      if (query)        params.q            = query
      // Pass sentinel values straight through — backend handles them
      if (category)     params.category     = category
      if (techs.length) params.technologies = techs
      const result = await projectService.searchProjects(params)
      setProjects(result.data || [])
      setTotal(result.pagination?.total || 0)
    } catch {
      setProjects([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [query, category, techs, page])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  // Sync state → URL (skip sentinels from URL to keep it clean)
  useEffect(() => {
    const params = {}
    if (query)    params.q        = query
    if (category && category !== OTHER_CAT_SENTINEL) params.category = category
    if (category === OTHER_CAT_SENTINEL) params.category = OTHER_CAT_SENTINEL
    techs.forEach((t) => {
      params.technologies = params.technologies ? [...params.technologies, t] : [t]
    })
    if (page > 1) params.page = page
    setSearchParams(params, { replace: true })
  }, [query, category, techs, page]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleQueryChange    = (v) => { setQuery(v);    setPage(1) }
  const handleCategoryChange = (v) => { setCategory(v); setPage(1) }
  const handleTechsChange    = (v) => { setTechs(v);    setPage(1) }
  const handleClearAll       = ()  => { setQuery(''); setCategory(''); setTechs([]); setPage(1) }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <motion.main
        className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Heading */}
        <div className="mb-6">
          <WordReveal
            segments={[
              { text: 'Explore' },
              { text: 'developer projects', gradient: true },
            ]}
            className="text-4xl font-black leading-tight"
          />
          <p className="text-gray-500 mt-2 text-base">
            Search across projects, developers and technologies.
            {!loading && total > 0 && (
              <span className="font-medium text-gray-700 ml-1">
                {hasFilters
                  ? `${total} ${total === 1 ? 'match' : 'matches'}.`
                  : `${total} projects and counting.`
                }
              </span>
            )}
          </p>
        </div>

        {/* Search + mobile filter button */}
        <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-5">
          <SearchBar value={query} onChange={handleQueryChange} />
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border
              border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50
              transition-colors flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-500 ml-0.5" />}
          </button>
        </motion.div>

        {/* Category chips — horizontal row, sorted A-Z, Other last */}
        <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
              !category
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            All
          </button>

          {SORTED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(category === cat ? '' : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                category === cat
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Other — plain toggle, sentinel value, always last */}
          <button
            onClick={() => handleCategoryChange(
              category === OTHER_CAT_SENTINEL ? '' : OTHER_CAT_SENTINEL
            )}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
              category === OTHER_CAT_SENTINEL
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            Other
          </button>
        </motion.div>

        {/* Active tech filter chips — AND logic: project must have ALL selected techs */}
        {techs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {techs.length > 1 && (
              <span className="text-xs text-gray-400 font-medium mr-1">
                must include all:
              </span>
            )}
            {techs.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                  bg-primary-100 text-primary-700"
              >
                {techLabel(t)}
                <button
                  onClick={() => handleTechsChange(techs.filter((x) => x !== t))}
                  className="hover:text-primary-900 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main layout: sidebar + grid */}
        <div className="flex gap-8 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <FilterPanel
                selectedTechs={techs}
                onTechsChange={handleTechsChange}
                onClearAll={handleClearAll}
              />
            </div>
          </aside>

          {/* Mobile drawer */}
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl overflow-y-auto p-5 lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-800">Technologies</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <FilterPanel
                  selectedTechs={techs}
                  onTechsChange={handleTechsChange}
                  onClearAll={() => { handleClearAll(); setSidebarOpen(false) }}
                />
              </div>
            </>
          )}

          {/* Project grid */}
          <div className="flex-1 min-w-0">
            <ProjectGrid
              projects={projects}
              loading={loading}
              hasActiveFilters={hasFilters}
              onClearFilters={handleClearAll}
              emptyMessage={
                hasFilters
                  ? 'No projects match your filters. Try a different combination.'
                  : 'No projects published yet. Be the first!'
              }
            />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const n = i + 1
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                        page === n
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {n}
                    </button>
                  )
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  )
}
