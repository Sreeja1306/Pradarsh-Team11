import { supabase } from './api'

const uploadService = {
  async uploadThumbnail(file) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `${user.id}/${fileName}`

    const { error } = await supabase.storage
      .from('project-thumbnails')
      .upload(filePath, file, { cacheControl: '3600', upsert: true, contentType: file.type })

    if (error) throw new Error(error.message)

    const { data: { publicUrl } } = supabase.storage
      .from('project-thumbnails')
      .getPublicUrl(filePath)

    return { url: publicUrl, path: filePath, filename: fileName }
  },

  async uploadScreenshots(files) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const urls = [], paths = []

    for (const file of files) {
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `${user.id}/${fileName}`

      const { error } = await supabase.storage
        .from('project-screenshots')
        .upload(filePath, file, { cacheControl: '3600', upsert: true, contentType: file.type })

      if (error) throw new Error(error.message)

      const { data: { publicUrl } } = supabase.storage
        .from('project-screenshots')
        .getPublicUrl(filePath)

      urls.push(publicUrl)
      paths.push(filePath)
    }

    return { urls, paths, count: urls.length }
  },
}

export default uploadService
