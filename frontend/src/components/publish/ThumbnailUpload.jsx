import { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'
import uploadService from '../../services/uploadService'

export default function ThumbnailUpload({ value, onChange, label = 'Thumbnail' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(value || null)
  const [error, setError]         = useState('')
  const [dragOver, setDragOver]   = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP, GIF).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    setError('')
    setUploading(true)

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    try {
      const result = await uploadService.uploadThumbnail(file)
      setPreview(result.url)
      onChange(result.url)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
      setPreview(null)
      onChange('')
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label} *</label>

      {preview ? (
        /* Preview state */
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
          <img src={preview} alt="Thumbnail preview" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white
                flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        /* Upload dropzone */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2
            border-dashed cursor-pointer transition-all duration-200 py-12
            ${dragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/30'
            }`}
        >
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            {uploading
              ? <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              : <Upload className="w-5 h-5 text-primary-500" />
            }
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {uploading ? 'Uploading…' : 'Upload thumbnail'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Drag & drop or click — JPEG, PNG, WebP (max 5MB)
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
