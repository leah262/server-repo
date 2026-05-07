import { useState, useEffect } from 'react'
import { useCache } from '../contexts/CacheContext'

export default function usePersistentState(key, initialValue) {
  const { get, set } = useCache()

  const [state, setState] = useState(() => {
    if (!key) return initialValue
    try {
      const cached = get(key)
      return cached !== null && typeof cached !== 'undefined' ? cached : initialValue
    } catch (e) {
      console.error('usePersistentState get failed', e)
      return initialValue
    }
  })

  useEffect(() => {
    if (!key) return
    try {
      set(key, state, null)
    } catch (e) {
      console.error('usePersistentState set failed', e)
    }
  }, [key, state, set])

  return [state, setState]
}
