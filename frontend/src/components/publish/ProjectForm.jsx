import { useState, useRef } from 'react'
import { X, Upload, Loader2, Plus, Search } from 'lucide-react'
import ThumbnailUpload from './ThumbnailUpload'
import uploadService from '../../services/uploadService'
import { CATEGORIES, POPULAR_TECHNOLOGIES } from '../../utils/constants'
import { isValidUrl } from '../../utils/helpers'

// A-Z sorted techs for the datalist / dropdown suggestions
const SORTED_TECHNOLOGIES = [...POPULAR_TECHNOLOGIES].sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' })
)

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  technologies: [],
  demo_url: '',
  thumbnail_url: '',
  screenshots: [],
  status: 'published',
}

export default function ProjectForm({
  initialData = {},
  onSubmit,
  submitLabel = 'Publish project',
  loading = false,
}) {
  const [form, setForm]     = useState({ ...EMPTY_FORM, ...initialData })
  const [errors, setErrors] = useState({})

  // Category "Other" state
  const [customCatInput, setCustomCatInput] = useState('')
  const [showOtherCat, setShowOtherCat]     = useState(false)

  // Technology search/add state
  const [techSearch, setTechSearch] = useState('')
  const [customTechInput, setCustomTechInput] = useState('')

  const [screenshotUploading, setScreenshotUploading] = useState(false)
  const screenshotRef = useRef(null)

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((er) => ({ ...er, [name]: '' }))
  }

  // Is the current category a custom (non-predefined) value?
  const hasCustomCategory = form.category && !CATEGORIES.includes(form.category)

  const applyCustomCat = () => {
    const v = customCatInput.trim()
    if (!v) return
    setForm((f) => ({ ...f, category: v }))
    setErrors((er) => ({ ...er, category: '' }))
    setCustomCatInput('')
    setShowOtherCat(false)
  }

  // ── Technology multi-select ───────────────────────────────────────────────
  // Filter suggestions: predefined techs matching search, not already added
  const techSuggestions = SORTED_TECHNOLOGIES.filter(
    (t) =>
      techSearch.trim() &&
      t.toLowerCase().includes(techSearch.trim().toLowerCase()) &&
      !(form.technologies || []).some((x) => x.toLowerCase() === t.toLowerCase())
  )

  const addTech = (tech) => {
    const trimmed = tech.trim()
    if (!trimmed) return
    const current = form.technologies || []
    if (current.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return
    // Use canonical spelling if it matches
    const canonical = POPULAR_TECHNOLOGIES.find(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    )
    setForm((f) => ({ ...f, technologies: [...f.technologies, canonical || trimmed] }))
    setTechSearch('')
  }

  const addCustomTech = () => {
    addTech(customTechInput)
    setCustomTechInput('')
  }

  const removeTech = (tech) => {
    setForm((f) => ({
      ...f,
      technologies: f.technologies.filter((t) => t !== tech),
    }))
  }

  const handleTechSearchKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (techSuggestions.length > 0) {
        addTech(techSuggestions[0])
      } else if (techSearch.trim()) {
        addTech(techSearch)
      }
    }
  }

  // ── Screenshots ───────────────────────────────────────────────────────────
  const handleScreenshots = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const remaining = 10 - form.screenshots.length
    if (remaining <= 0) {
      setErrors((er) => ({ ...er, screenshots: 'Maximum 10 screenshots allowed.' }))
      return
    }
    setScreenshotUploading(true)
    setErrors((er) => ({ ...er, screenshots: '' }))
    try {
      const result = await uploadService.uploadScreenshots(files.slice(0, remaining))
      setForm((f) => ({ ...f, screenshots: [...f.screenshots, ...result.urls] }))
    } catch (err) {
      setErrors((er) => ({
        ...er,
        screenshots: err.response?.data?.detail || 'Screenshot upload failed.',
      }))
    } finally {
      setScreenshotUploading(false)
      if (screenshotRef.current) screenshotRef.current.value = ''
    }
  }

  const removeScreenshot = (idx) => {
    setForm((f) => ({
      ...f,
      screenshots: f.screenshots.filter((_, i) => i !== idx),
    }))
  }

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'Project title is required.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (!form.category)           e.category    = 'Please select a category.'
    if (!form.thumbnail_url)      e.thumbnail_url = 'Thumbnail is required.'
    if (!form.demo_url.trim())    e.demo_url    = 'Live demo URL is required.'
    else if (!isValidUrl(form.demo_url))
      e.demo_url = 'Enter a valid URL (e.g. https://your-app.com).'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Project title <span className="text-red-400">*</span>
        </label>
        <input
          type="text" name="title" value={form.title} onChange={handleChange}
          placeholder="Nebula Analytics"
          className={`input-base ${errors.title ? 'border-red-300 focus:ring-red-400' : ''}`}
        />
        {errors.title && <p className="field-error text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description" value={form.description} onChange={handleChange}
          placeholder="One or two sentences that hook the reader."
          rows={4}
          className={`input-base resize-none ${errors.description ? 'border-red-300 focus:ring-red-400' : ''}`}
        />
        {errors.description && <p className="field-error text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* ── Category — native select + custom Other input ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Category <span className="text-red-400">*</span>
        </label>

        <select
          name="category"
          value={CATEGORIES.includes(form.category) ? form.category : (hasCustomCategory ? '__custom__' : '')}
          onChange={(e) => {
            if (e.target.value === '__custom__') {
              setShowOtherCat(true)
              return
            }
            setShowOtherCat(false)
            setCustomCatInput('')
            setForm((f) => ({ ...f, category: e.target.value }))
            setErrors((er) => ({ ...er, category: '' }))
          }}
          className={`input-base ${errors.category ? 'border-red-300 focus:ring-red-400' : ''}`}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="__custom__">Other — type below</option>
        </select>

        {/* Custom category text input — only when Other is chosen or custom value exists */}
        {(showOtherCat || hasCustomCategory) && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customCatInput || (hasCustomCategory && !customCatInput ? form.category : customCatInput)}
              onChange={(e) => setCustomCatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCustomCat() } }}
              placeholder="e.g. DevOps, Blockchain…"
              className="flex-1 input-base text-sm"
            />
            <button
              type="button"
              onClick={applyCustomCat}
              disabled={!customCatInput.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold
                bg-gradient-to-r from-primary-500 to-accent-500 text-white
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Set
            </button>
          </div>
        )}

        {hasCustomCategory && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-500">Custom category:</span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-100 text-accent-700">
              {form.category}
              <button
                type="button"
                onClick={() => { setForm((f) => ({ ...f, category: '' })); setCustomCatInput('') }}
                className="hover:text-accent-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}

        {errors.category && <p className="field-error text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* ── Technologies — searchable type-to-filter + tag chips + Other ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Technologies
          <span className="text-gray-400 font-normal ml-1">(add all that apply)</span>
        </label>

        {/* Search / type-to-add input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={techSearch}
            onChange={(e) => setTechSearch(e.target.value)}
            onKeyDown={handleTechSearchKey}
            placeholder="Search or type a technology and press Enter…"
            className="input-base pl-10"
            autoComplete="off"
          />
        </div>

        {/* Dropdown suggestions */}
        {techSuggestions.length > 0 && (
          <div className="mt-1 border border-gray-200 rounded-xl bg-white shadow-card overflow-hidden">
            {techSuggestions.slice(0, 6).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addTech(t)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50
                  hover:text-primary-700 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-1">
          Type to search predefined techs, or press Enter to add a custom one.
        </p>

        {/* Selected tag chips */}
        {(form.technologies || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(form.technologies || []).map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                  bg-primary-100 text-primary-700"
              >
                {tech}
                <button type="button" onClick={() => removeTech(tech)} className="hover:text-primary-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Other: free-text for technologies not in the predefined list */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1.5">Not in the list? Add a custom technology:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTechInput}
              onChange={(e) => setCustomTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addCustomTech() }
              }}
              placeholder="e.g. Elixir, SolidJS…"
              className="flex-1 input-base text-sm"
            />
            <button
              type="button"
              onClick={addCustomTech}
              disabled={!customTechInput.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold
                bg-gradient-to-r from-primary-500 to-accent-500 text-white
                disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Live demo URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Live demo URL <span className="text-red-400">*</span>
        </label>
        <input
          type="url" name="demo_url" value={form.demo_url} onChange={handleChange}
          placeholder="https://your-app.com"
          className={`input-base ${errors.demo_url ? 'border-red-300 focus:ring-red-400' : ''}`}
        />
        {errors.demo_url && <p className="field-error text-xs text-red-500 mt-1">{errors.demo_url}</p>}
      </div>

      {/* Thumbnail */}
      <div>
        <ThumbnailUpload
          value={form.thumbnail_url}
          onChange={(url) => {
            setForm((f) => ({ ...f, thumbnail_url: url }))
            setErrors((er) => ({ ...er, thumbnail_url: '' }))
          }}
        />
        {errors.thumbnail_url && (
          <p className="field-error text-xs text-red-500 mt-1">{errors.thumbnail_url}</p>
        )}
      </div>

      {/* Screenshots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Screenshot gallery
          <span className="text-gray-400 font-normal ml-1">(optional, max 10)</span>
        </label>
        {form.screenshots.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {form.screenshots.map((url, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 group">
                <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => removeScreenshot(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white
                    flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {form.screenshots.length < 10 && (
          <div
            onClick={() => screenshotRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2
              border-dashed border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/30
              cursor-pointer transition-all duration-200 py-8"
          >
            {screenshotUploading
              ? <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
              : <Upload className="w-5 h-5 text-gray-400" />
            }
            <p className="text-xs text-gray-500">
              {screenshotUploading ? 'Uploading…' : 'Click to add screenshots'}
            </p>
          </div>
        )}
        <input ref={screenshotRef} type="file" accept="image/*" multiple onChange={handleScreenshots} className="hidden" />
        {errors.screenshots && <p className="field-error text-xs text-red-500 mt-1">{errors.screenshots}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
        <div className="flex gap-3">
          {['published', 'draft'].map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="status" value={s}
                checked={form.status === s} onChange={handleChange}
                className="accent-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || screenshotUploading}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-base
          bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600
          disabled:opacity-60 disabled:cursor-not-allowed shadow-glow hover:shadow-glow-pink
          transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Publishing…' : submitLabel}
      </button>
    </form>
  )
}
