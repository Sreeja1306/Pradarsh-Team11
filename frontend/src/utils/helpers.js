/**
 * Format a date string to a human-readable format.
 * e.g. "January 2024"
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date to month + year only.
 * e.g. "Jan 2024"
 */
export function formatMonthYear(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

/**
 * Truncate text to a given max length, appending "…"
 */
export function truncateText(text, maxLength = 120) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Get avatar initials from a full name.
 * e.g. "Aarav Mehta" → "AM"
 */
export function getAvatarInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Parse a comma-separated technologies string into an array.
 * e.g. "React, Node.js, Supabase" → ["React", "Node.js", "Supabase"]
 */
export function parseTechArray(techString) {
  if (!techString) return []
  if (Array.isArray(techString)) return techString
  return techString
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

/**
 * Format a technologies array to a comma-separated string.
 */
export function formatTechArray(techArray) {
  if (!techArray) return ''
  if (typeof techArray === 'string') return techArray
  return techArray.join(', ')
}

/**
 * Format a number with k suffix.
 * e.g. 1200 → "1.2k"
 */
export function formatNumber(n) {
  if (!n) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

/**
 * Check if a URL is valid.
 */
export function isValidUrl(url) {
  if (!url) return true // empty is allowed
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Build a random pastel background color from a string (for avatars).
 */
export function stringToColor(str) {
  const colors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-green-400 to-teal-400',
    'from-orange-400 to-red-400',
    'from-indigo-400 to-purple-400',
  ]
  let hash = 0
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Debounce a function call.
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
