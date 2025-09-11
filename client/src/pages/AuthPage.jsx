import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthPage.css'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would normally handle authentication
    console.log('Form submitted:', formData)
    // For now, just navigate to gallery
    navigate('/gallery')
  }

  const handleGoogleSignIn = () => {
    // Handle Google Sign-In
    console.log('Google Sign-In clicked')
    navigate('/gallery')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="auth-page">
      {/* Animated Grid Background */}
      <div className="grid-background">
        <div className="grid-lines"></div>
      </div>

      {/* Main Auth Container */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title font-orbitron">
              {isLogin ? 'WELCOME BACK' : 'JOIN THE VAULT'}
            </h1>
            <p className="auth-subtitle">
              {isLogin ? 'Access your digital memories' : 'Start your journey in the cyber world'}
            </p>
          </div>

          {/* Form Slider Container */}
          <div className="form-slider-container">
            <div className={`form-slider ${isLogin ? 'login-active' : 'signup-active'}`}>
              
              {/* Login Form */}
              <form className="auth-form login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                  <div className="input-glow"></div>
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                  <div className="input-glow"></div>
                </div>

                <button type="submit" className="submit-btn">
                  <span className="btn-text">LOGIN</span>
                  <div className="btn-glow"></div>
                </button>
              </form>

              {/* Signup Form */}
              <form className="auth-form signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                    required={!isLogin}
                  />
                  <div className="input-glow"></div>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required={!isLogin}
                  />
                  <div className="input-glow"></div>
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    required={!isLogin}
                  />
                  <div className="input-glow"></div>
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    required={!isLogin}
                  />
                  <div className="input-glow"></div>
                </div>

                <button type="submit" className="submit-btn">
                  <span className="btn-text">SIGN UP</span>
                  <div className="btn-glow"></div>
                </button>
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">OR</span>
          </div>

          {/* Google Sign In */}
          <button onClick={handleGoogleSignIn} className="google-btn">
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Toggle Mode */}
          <div className="toggle-mode">
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button onClick={toggleMode} className="toggle-btn">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage