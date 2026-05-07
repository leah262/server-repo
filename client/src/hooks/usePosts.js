import { useState, useEffect } from 'react'
import { postsApi, usersApi } from '../services/api'
import { useCache } from '../contexts/CacheContext'
import usePersistentState from './usePersistentState'

export const usePosts = (userId) => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [search, setSearch] = usePersistentState(userId ? `ui:posts:${userId}:search` : null, { term: '', type: 'title' })
  const [postForm, setPostForm] = usePersistentState(userId ? `ui:posts:${userId}:form` : null, { title: '', body: '', show: false, editing: null })
  const [currentPage, setCurrentPage] = usePersistentState(userId ? `ui:posts:${userId}:page` : null, 1)
  const [postsPerPage] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])

  const { get, set } = useCache()

  useEffect(() => {
    const cacheKey = `posts:${userId}`
    const cached = userId ? get(cacheKey) : null
    if (cached) {
      setAllPosts(cached)
      const firstPagePosts = cached.slice(0, postsPerPage)
      setPosts(firstPagePosts)
      setHasMore(cached.length > postsPerPage)
    } else {
      loadInitialPosts()
    }
    usersApi.getAll().then(setUsers).catch(console.error)
  }, [userId, get, postsPerPage])

  const loadInitialPosts = async () => {
    setLoading(true)
    try {
      const allPostsData = await postsApi.getAll()
      const sortedPosts = allPostsData.sort((a, b) => b.id - a.id)
      setAllPosts(sortedPosts)
      const firstPagePosts = sortedPosts.slice(0, postsPerPage)
      setPosts(firstPagePosts)
      setHasMore(sortedPosts.length > postsPerPage)
      setCurrentPage(1)
      if (userId) {
        set(`posts:${userId}`, sortedPosts)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!hasMore || loading) return
    
    setLoading(true)
    
    try {
      const nextPage = currentPage + 1
      const startIndex = (nextPage - 1) * postsPerPage
      const endIndex = startIndex + postsPerPage
      const nextPagePosts = allPosts.slice(startIndex, endIndex)
      
      if (nextPagePosts.length === 0) {
        alert('No more posts to display')
        setHasMore(false)
      } else {
        setPosts(prev => [...prev, ...nextPagePosts])
        setCurrentPage(nextPage)
        setHasMore(endIndex < allPosts.length)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchById = async (id) => {
    if (!id.trim()) {
      loadInitialPosts()
      return
    }
    setLoading(true)
    try {
      const post = await postsApi.getById(id)
      setPosts(post ? [post] : [])
      setHasMore(false)
    } catch (error) {
      console.error('Error searching post:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts
    .filter(post => {
      if (!search.term) return true
      if (search.type === 'id') {
        return post.id.toString().includes(search.term)
      }
      return post.title.toLowerCase().includes(search.term.toLowerCase())
    })

  useEffect(() => {
    if (search.type === 'id' && search.term.trim()) {
      searchById(search.term)
    } else if (!search.term) {
      loadInitialPosts()
    }
  }, [search.term, search.type])

  const getUserInitials = (userId) => {
    if (!userId) return 'U'
    const user = users.find(u => u.id == userId)
    return user?.name ? user.name.substring(0, 2).toUpperCase() : 'U' + userId.toString().substring(0, 1)
  }

  const savePost = async (userId) => {
    if (!postForm.title.trim() || !postForm.body.trim()) return
    
    try {
      if (postForm.editing) {
        const updated = await postsApi.update(postForm.editing.id, {
          title: postForm.title,
          body: postForm.body
        })
        setPosts(posts.map(p => p.id === postForm.editing.id ? { ...p, ...updated } : p))
        setAllPosts(allPosts.map(p => p.id === postForm.editing.id ? { ...p, ...updated } : p))
      } else {
        const newPost = await postsApi.create({
          title: postForm.title,
          body: postForm.body
        })
        const updatedPosts = [newPost, ...posts]
        const updatedAllPosts = [newPost, ...allPosts]
        setPosts(updatedPosts)
        setAllPosts(updatedAllPosts)
        if (userId) {
          set(`posts:${userId}`, updatedAllPosts)
        }
      }
      setPostForm({ title: '', body: '', show: false, editing: null })
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const deletePost = async (postId) => {
    try {
      await postsApi.delete(postId)
      const updatedPosts = posts.filter(p => p.id !== postId)
      const updatedAllPosts = allPosts.filter(p => p.id !== postId)
      setPosts(updatedPosts)
      setAllPosts(updatedAllPosts)
      // Update cache
      if (userId) {
        set(`posts:${userId}`, updatedAllPosts)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const editPost = (post) => {
    setPostForm({ title: post.title, body: post.body, show: true, editing: post })
  }

  return {
    posts: filteredPosts,
    search,
    setSearch,
    postForm,
    setPostForm,
    getUserInitials,
    savePost,
    deletePost,
    editPost,
    loadMore,
    hasMore,
    loading
  }
}