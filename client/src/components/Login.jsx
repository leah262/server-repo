import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usersApi } from '../services/api'
import '../styles/forms.css'

function Login() {
  const formRef = useRef()
  const navigate = useNavigate()
  const { login } = useUser()

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const user = await usersApi.login(username, password)
      if (user && user.token) {
        login(user)
        navigate(`/users/${user.id}/home`)
      } else {
        alert('Username or password incorrect')
      }
    } catch (error) {
      alert('Username or password incorrect')
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <h2>Login</h2>
        <form ref={formRef} onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>

        <button className="secondary-btn" onClick={() => navigate('/register')}>
          Don't have an account? Register
        </button>
      </div>
    </div>
  )
}

export default Login