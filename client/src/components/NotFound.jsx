import { useNavigate } from 'react-router-dom'
import '../styles/NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist</p>
        <button 
          className="home-btn" 
          onClick={() => navigate('/login')}
        >
          🏠 Back to Log-In
        </button>
      </div>
    </div>
  )
}

export default NotFound