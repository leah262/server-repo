import { useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import usePersistentState from '../hooks/usePersistentState'
import useLastPath from '../hooks/useLastPath'
import '../styles/Home.css'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useUser()
  const [showInfo, setShowInfo] = usePersistentState(user?.id ? `ui:layout:${user.id}:showInfo` : null, false)

  const isHomePage = location.pathname.includes('/home')
  useLastPath()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="home-nav">
          <div className="user-avatar" onClick={() => setShowInfo(!showInfo)}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!isHomePage && <button onClick={() => navigate(`/users/${user.id}/home`)}>Home</button>}
          <button onClick={() => navigate(`/users/${user.id}/info`)}>Info</button>
          <button onClick={() => navigate(`/users/${user.id}/todos`)}>Todos</button>
          <button onClick={() => navigate(`/users/${user.id}/posts`)}>Posts</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
        
        {location.pathname.includes('/home') ? <h1>Welcome, {user.name}!</h1> : null}
      </header>

      {showInfo && (
        <div className="info-modal">
          <div className="info-content">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>

            <button onClick={() => setShowInfo(false)}>Close</button>
          </div>
        </div>
      )}

      <main className="home-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout