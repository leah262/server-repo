import { useState, useEffect } from 'react'
import { todosApi } from '../services/api'
import { useCache } from '../contexts/CacheContext'
import usePersistentState from './usePersistentState'

export const useTodos = (userId) => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = usePersistentState(userId ? `ui:todos:${userId}:search` : null, { term: '', by: 'title' })
  const [sortBy, setSortBy] = usePersistentState(userId ? `ui:todos:${userId}:sortBy` : null, 'id')
  const [todoForm, setTodoForm] = usePersistentState(userId ? `ui:todos:${userId}:form` : null, { title: '', editing: null })

  const { get, set } = useCache()

  useEffect(() => {
    const cacheKey = `todos:${userId}`
    const cached = userId ? get(cacheKey) : null
    if (cached) {
      setTodos(cached)
      return
    }

    if (userId) {
      setLoading(true)
      todosApi.getByUserId(userId)
        .then(data => {
          if (Array.isArray(data)) {
            setTodos(data)
            set(cacheKey, data)
          } else {
            console.error('Invalid todos response:', data)
            setTodos([])
          }
        })
        .catch(err => {
          console.error('Error fetching todos:', err)
          setTodos([])
        })
        .finally(() => setLoading(false))
    }
  }, [userId, get, set])

  const filteredTodos = todos.filter(todo => {
    if (!search.term) return true
    switch (search.by) {
      case 'id':
        return todo.id.toString().includes(search.term)
      case 'title':
        return todo.title.toLowerCase().includes(search.term.toLowerCase())
      case 'completed':
        const searchValue = search.term.toLowerCase()
        if (searchValue === 'true' || searchValue === 'completed' || searchValue === 'done') {
          return todo.completed === true
        } else if (searchValue === 'false' || searchValue === 'pending' || searchValue === 'incomplete') {
          return todo.completed === false
        }
        return false
      default:
        return true
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return parseInt(a.id) - parseInt(b.id)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'completed':
        if (a.completed === b.completed) {
          return parseInt(a.id) - parseInt(b.id)
        }
        return a.completed ? -1 : 1
      default:
        return 0
    }
  })

  const addTodo = async () => {
    if (!todoForm.title.trim()) return

    setLoading(true)
    try {
      const newTodo = await todosApi.create({
        title: todoForm.title
      })
      const updated = [...todos, newTodo]
      setTodos(updated)
      if (userId) {
        set(`todos:${userId}`, updated)
      }
      setTodoForm({ title: '', editing: null })
    } catch (error) {
      console.error('Error adding todo:', error)
      alert('Failed to add todo')
    } finally {
      setLoading(false)
    }
  }

  const updateTodo = async (id, updates) => {
    const previousTodos = [...todos]
    const optimisticTodos = todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    )
    setTodos(optimisticTodos)

    setLoading(true)
    try {
      const updated = await todosApi.update(id, updates)
      const updatedTodos = optimisticTodos.map(todo => todo.id === id ? updated : todo)
      setTodos(updatedTodos)
      if (userId) {
        set(`todos:${userId}`, updatedTodos)
      }
      if (todoForm.editing === id) {
        setTodoForm({ title: '', editing: null })
      }
    } catch (error) {
      console.error('Error updating todo:', error)
      setTodos(previousTodos)
      alert('Failed to update todo')
    } finally {
      setLoading(false)
    }
  }

  const deleteTodo = async (id) => {
    const previousTodos = [...todos]
    const optimisticTodos = todos.filter(todo => todo.id !== id)
    setTodos(optimisticTodos)

    setLoading(true)
    try {
      await todosApi.delete(id)
      if (userId) {
        set(`todos:${userId}`, optimisticTodos)
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      setTodos(previousTodos)
      alert('Failed to delete todo')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (id, title) => {
    setTodoForm({ title, editing: id })
  }

  const saveEdit = () => {
    if (todoForm.title.trim()) {
      updateTodo(todoForm.editing, { title: todoForm.title })
    } else {
      alert('Title cannot be empty')
    }
  }

  return {
    todos: filteredTodos,
    search,
    setSearch,
    sortBy,
    setSortBy,
    todoForm,
    setTodoForm,
    addTodo,
    updateTodo,
    deleteTodo,
    startEdit,
    saveEdit,
    loading
  }
}