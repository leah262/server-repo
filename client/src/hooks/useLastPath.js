import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import usePersistentState from './usePersistentState'

export default function useLastPath() {
  const location = useLocation()
  const [lastPath, setLastPath] = usePersistentState('ui:lastPath', '/login')

  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      setLastPath(location.pathname)
    }
  }, [location.pathname, setLastPath])

  return lastPath
}