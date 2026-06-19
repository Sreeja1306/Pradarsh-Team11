import api from './api'

const projectService = {
  async getProjects(page = 1, limit = 12) {
    const response = await api.get('/projects', { params: { page, limit } })
    return response.data
  },

  async getProjectById(id) {
    const response = await api.get(`/projects/${id}`)
    return response.data.data
  },

  async createProject(projectData) {
    const response = await api.post('/projects', projectData)
    return response.data.data
  },

  async updateProject(id, projectData) {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data.data
  },

  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },

  async getMyProjects() {
    const response = await api.get('/projects/my')
    return response.data.data
  },

  async getProjectsByUsername(username) {
    const response = await api.get(`/projects/user/${username}`)
    return response.data.data
  },

  async getStats() {
    const response = await api.get('/projects/stats')
    return response.data.data
  },

  /**
   * Search and filter projects.
   *
   * CRITICAL FIX: Axios default serialises arrays as `technologies[]=React`
   * but FastAPI List[str] requires repeated keys: `technologies=React&technologies=Python`.
   * We build the query string with URLSearchParams to guarantee correct format.
   */
  async searchProjects(params = {}) {
    const qs = new URLSearchParams()

    if (params.q)        qs.append('q',        params.q)
    if (params.category) qs.append('category', params.category)
    if (params.page)     qs.append('page',     String(params.page))
    if (params.limit)    qs.append('limit',    String(params.limit))

    const techs = params.technologies
    if (Array.isArray(techs)) {
      techs.forEach((t) => qs.append('technologies', t))
    } else if (techs) {
      qs.append('technologies', String(techs))
    }

    const response = await api.get(`/search?${qs.toString()}`)
    return response.data
  },
}

export default projectService
