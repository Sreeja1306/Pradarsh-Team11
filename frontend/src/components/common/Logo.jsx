import { Link } from 'react-router-dom'

/**
 * Shared Pradarsh logo + wordmark component.
 * Used in Navbar, Login, Register, and the intro animation.
 *
 * Props:
 *   size     — 'sm' | 'md' | 'lg'  (default: 'md')
 *   linkTo   — href for the wrapping link (default: '/')
 *   noLink   — if true, renders without a link wrapper
 *   noText   — if true, shows only the icon mark
 */
export default function Logo({ size = 'md', linkTo = '/', noLink = false, noText = false }) {
  const sizes = {
    sm: { img: 28, text: 'text-base',  gap: 'gap-2' },
    md: { img: 36, text: 'text-xl',    gap: 'gap-2.5' },
    lg: { img: 56, text: 'text-3xl',   gap: 'gap-3' },
  }
  const s = sizes[size] || sizes.md

  const inner = (
    <span className={`inline-flex items-center ${s.gap} select-none`}>
      <img
        src="/logo.png"
        alt="Pradarsh logo"
        width={s.img}
        height={s.img}
        style={{ width: s.img, height: s.img }}
        className="rounded-full object-contain flex-shrink-0"
        draggable={false}
      />
      {!noText && (
        <span className={`font-black leading-none tracking-tight text-gradient ${s.text}`}>
          Pradarsh
        </span>
      )}
    </span>
  )

  if (noLink) return inner

  return (
    <Link to={linkTo} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg">
      {inner}
    </Link>
  )
}
