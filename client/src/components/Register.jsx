import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usersApi } from '../services/api'
import '../styles/forms.css'

function Register() {
  const [step, setStep] = useState(1)
  const [basicData, setBasicData] = useState({})
  const basicFormRef = useRef()
  const detailsFormRef = useRef()
  const navigate = useNavigate()
  const { login } = useUser()

  const handleBasicRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(basicFormRef.current)
    const username = formData.get('username')
    const website = formData.get('website')
    const verifyWebsite = formData.get('verifyWebsite')
    
    if (website !== verifyWebsite) {
      alert('Passwords do not match')
      return
    }

    try {
      const usernameExists = await usersApi.checkUsername(username)
      if (usernameExists) {
        alert('Username already exists')
        return
      }

      setBasicData({ username, website })
      setStep(2)
    } catch (error) {
      alert('Server error')
    }
  }

  const handleCompleteRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(detailsFormRef.current)
    
    const newUser = {
      username: basicData.username,
      name: formData.get('name'),
      email: formData.get('email'),
      website: basicData.website
    }

    try {
      const createdUser = await usersApi.create(newUser)
      const loginUser = await usersApi.login(basicData.username, basicData.website)
      if (loginUser && loginUser.token) {
        login(loginUser)
        alert(`Registration completed successfully! User ID: ${createdUser.id}`)
        navigate(`/users/${createdUser.id}/home`)
      } else {
        alert('Registration successful but login failed. Please login manually.')
        navigate('/login')
      }
    } catch (error) {
      alert('Network error - please try again')
    }
  }

  const goBackToStep1 = () => {
    setStep(1)
    setBasicData({})
  }

  if (step === 1) {
    return (
      <div className="register-page">
        <div className="container">
          <h2>Register - Step 1</h2>
          <p className="step-description">
            Create your account credentials
          </p>
          
          <form ref={basicFormRef} onSubmit={handleBasicRegister}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <input
              type="text"
              name="website"
              placeholder="Website (Password)"
              required
            />
            <input
              type="text"
              name="verifyWebsite"
              placeholder="Confirm Website (Password)"
              required
            />
            <button type="submit">Next Step →</button>
          </form>
          
          <button className="secondary-btn" onClick={() => navigate('/login')}>
            Have an account? Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="user-details-page">
      <div className="container form-container">
        <h2>Register - Step 2</h2>
        <p className="step-description">
          Complete your profile information
        </p>
        
        <div className="user-info">
          <p><strong>Username:</strong> {basicData.username}</p>
        </div>
        
        <form ref={detailsFormRef} onSubmit={handleCompleteRegister}>
          <h3>Personal Information</h3>
          <input 
            name="name" 
            placeholder="Full Name"
            required 
          />
          <input name="email" type="email" placeholder="Email" required />
          
          <button type="submit">Complete Registration</button>
        </form>
        
        <button className="secondary-btn" onClick={goBackToStep1}>
          ← Back to Step 1
        </button>
      </div>
    </div>
  )
}

export default Register