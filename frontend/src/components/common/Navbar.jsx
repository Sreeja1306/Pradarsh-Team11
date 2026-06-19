import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import Logo from './Logo'

export default function Navbar() {
  const { isAuthenticated, profile, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
    navigate('/')
  }

  // Avatar initials fallback
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url

  const navLinkClass = ({ isActive }) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Logo size="md" />

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
            <NavLink to="/publish" className={navLinkClass}>Publish</NavLink>
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              /* Avatar dropdown */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{getInitials(displayName)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1 z-20">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary-500" />
                        Dashboard
                      </Link>
                      {profile?.username && (
                        <Link
                          to={`/developer/${profile.username}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-primary-500" />
                          My Profile
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-glow transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/explore" className={navLinkClass} onClick={() => setMobileOpen(false)}>Explore</NavLink>
          <NavLink to="/publish" className={navLinkClass} onClick={() => setMobileOpen(false)}>Publish</NavLink>

          <div className="border-t border-gray-100 pt-3 mt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
