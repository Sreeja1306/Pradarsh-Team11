import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import ScrollToTop from '../components/common/ScrollToTop'

// Pages
import Home from '../pages/Home'
import Projects from '../pages/Projects'
import Publish from '../pages/Publish'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import ProjectDetails from '../pages/ProjectDetails'
import EditProject from '../pages/EditProject'
import DeveloperProfile from '../pages/DeveloperProfile'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public routes */}
      <Route path="/"                  element={<Home />} />
      <Route path="/explore"           element={<Projects />} />
      <Route path="/project/:id"       element={<ProjectDetails />} />
      <Route path="/developer/:username" element={<DeveloperProfile />} />
      <Route path="/login"             element={<Login />} />
      <Route path="/register"          element={<Register />} />

      {/* Protected routes */}
      <Route path="/publish" element={
        <ProtectedRoute>
          <Publish />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/edit/:id" element={
        <ProtectedRoute>
          <EditProject />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
