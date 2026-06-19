import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { debounce } from '../../utils/helpers'

export default function SearchBar({ value, onChange, placeholder = 'Search projects, developers, technologies…' }) {
  const [localValue, setLocalValue] = useState(value || '')
  const debouncedOnChange = useRef(debounce(onChange, 350)).current

  // Sync if parent resets value
  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleChange = (e) => {
    const val = e.target.value
    setLocalValue(val)
    debouncedOnChange(val)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200 shadow-sm placeholder:text-gray-400"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full
            text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
