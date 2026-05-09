const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getToken = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    const user = JSON.parse(userStr)
    return user.token
  } catch {
    return null
  }
}

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  }
  const response = await fetch(`${API_BASE}${endpoint}`, options)
  if (options.method === 'DELETE') return response

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`)
  }

  return data
}

export const postsApi = {
  getAll: (page = 1, limit = 10) => apiRequest(`/posts`),
  getById: (id) => apiRequest(`/posts/${id}`),
  create: (post) => apiRequest('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  }),
  update: (id, post) => apiRequest(`/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  }),
  delete: (id) => apiRequest(`/posts/${id}`, { method: 'DELETE' })
}

export const commentsApi = {
  getByPostId: (postId) => apiRequest(`/comments/post/${postId}`),
  create: (comment) => apiRequest('/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: comment.postId, body: comment.body })
  }),
  update: (id, comment) => apiRequest(`/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  }),
  delete: (id) => apiRequest(`/comments/${id}`, { method: 'DELETE' })
}

export const usersApi = {
  getAll: () => apiRequest('/users'),
  login: async (username, password) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (response.token && response.user) {
        return { ...response.user, token: response.token }
      }
      return null
    } catch {
      return null
    }
  },
  checkUsername: async (username) => {
    try {
      const response = await apiRequest('/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      return response.exists || false
    } catch {
      return false
    }
  },
  create: (user) => apiRequest('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password
    })
  }),
  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }),
  changePassword: (id, passwordData) => myChangep(id, passwordData)
}
function myChangep(id, passwordData) {
  return apiRequest(`/users/${id}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passwordData)
  })
}
export const todosApi = {
  getByUserId: (userId) => apiRequest(`/todos/my`),
  create: (todo) => apiRequest('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  }),
  update: (id, updates) => apiRequest(`/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  }),
  delete: (id) => apiRequest(`/todos/${id}`, { method: 'DELETE' })
}
