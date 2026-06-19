import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="relative text-center max-w-md">
          {/* 404 number */}
          <div className="text-8xl font-black text-gradient mb-2 leading-none">404</div>

          {/* Illustration */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100
            flex items-center justify-center mx-auto mb-6 shadow-glow">
            <span className="text-3xl">🔍</span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="btn-primary w-full sm:w-auto justify-center">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link to="/explore" className="btn-outline w-full sm:w-auto justify-center">
              <ArrowLeft className="w-4 h-4" />
              Explore Projects
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
