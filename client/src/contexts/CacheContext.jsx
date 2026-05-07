import React, { createContext, useContext, useRef, useCallback } from 'react'

const DEFAULT_TTL = 1000 * 60 * 20

const CacheContext = createContext(null)

export function CacheProvider({ children }) {
  const cacheRef = useRef(new Map())

  const get = useCallback((key) => {
    const entry = cacheRef.current.get(key)
    if (!entry) return null
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      cacheRef.current.delete(key)
      return null
    }
    return entry.value
  }, [])

  const set = useCallback((key, value, ttl = DEFAULT_TTL) => {
    const expiresAt = ttl ? Date.now() + ttl : null
    cacheRef.current.set(key, { value, expiresAt })
  }, [])

  const invalidate = useCallback((key) => {
    cacheRef.current.delete(key)
  }, [])

  const clear = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  return (
    <CacheContext.Provider value={{ get, set, invalidate, clear }}>
      {children}
    </CacheContext.Provider>
  )
}

export function useCache() {
  const ctx = useContext(CacheContext)
  if (!ctx) throw new Error('useCache must be used within CacheProvider')
  return ctx
}

export default CacheProvider
