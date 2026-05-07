import { createContext, useContext, useState, useEffect } from 'react'
import { usersApi } from '../services/api'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    
    if (!userStr) {
      setLoading(false)
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
    } catch {
      localStorage.removeItem('user')
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
