import { useState } from 'react'
import { Trash2, X, AlertTriangle } from 'lucide-react'
import projectService from '../../services/projectService'

export default function ProjectActions({ projectId, projectTitle, onDeleted }) {
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [error, setError]         = useState('')

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      await projectService.deleteProject(projectId)
      setShowModal(false)
      onDeleted(projectId)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to delete project. Please try again.'
      )
      setDeleting(false)
    }
  }

  return (
    <>
      {/* Delete trigger button */}
      <button
        onClick={() => setShowModal(true)}
        title="Delete project"
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50
          transition-all duration-150"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setShowModal(false)}
          />

          {/* Modal card */}
          <div className="relative bg-white rounded-2xl shadow-card-hover w-full max-w-sm p-6 z-10">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              disabled={deleting}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600
                hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete project?</h3>
            <p className="text-sm text-gray-500 mb-1">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-700">"{projectTitle}"</span>?
            </p>
            <p className="text-xs text-gray-400 mb-5">
              This action cannot be undone.
            </p>

            {error && (
              <p className="text-xs text-red-500 mb-4 p-2 bg-red-50 rounded-lg">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200
                  text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                  bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60
                  flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
