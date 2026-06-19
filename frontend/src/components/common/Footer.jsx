import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="font-bold text-primary-600 text-base">Pradarsh</span>
            </Link>
            <p className="text-xs text-gray-400 mt-1">Where developers showcase what they build.</p>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Home
            </Link>
            <Link to="/explore" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Explore
            </Link>
            <Link to="/publish" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Publish
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Pradarsh. Built for builders.
          </p>
        </div>
      </div>
    </footer>
  )
}
