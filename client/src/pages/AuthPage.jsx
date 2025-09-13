import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import './AuthPage.css';
// import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

function AuthPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');
  const { googleLogin } = useAuth(); 

  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { login, register, isAuthenticated, error: authError, clearError } = useAuth();

  // Redirect if already authenticated
 useEffect(() => {
   if (isAuthenticated) {
     navigate('/gallery');
   }
 }, [isAuthenticated, navigate]);

  // Clear auth errors when component mounts or mode changes
  useEffect(() => {
    clearError();
    setErrors({});
  }, [isLogin, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!isLogin && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    clearError();

    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(
          formData.username,
          formData.email,
          formData.password,
          formData.confirmPassword
        );
      }

      if (result.success) {
        navigate('/gallery');
      } else {
        // Error will be handled by the auth context and displayed via authError
        console.error('Authentication failed:', result.message);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Replace the existing handleGoogleSignIn with this:
  
  

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    clearError();
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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

          {/* Global Error Display */}
          {authError && (
            <div className="error-message">
              {authError}
            </div>
          )}

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
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required
                    autoComplete="email"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                  <div className="input-glow"></div>
                </div>
                
                <div className="form-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword.password ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      required
                      autoComplete="current-password"
                    />
                    {formData.password && (
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('password')}
                      >
                        {showPassword.password ? '🙈' : '👁️'}
                      </button>
                    )}
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                  <div className="input-glow"></div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  <span className="btn-text">
                    {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
                  </span>
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
                    className={`form-input ${errors.username ? 'error' : ''}`}
                    required={!isLogin}
                    autoComplete="username"
                  />
                  {errors.username && <span className="field-error">{errors.username}</span>}
                  <div className="input-glow"></div>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required={!isLogin}
                    autoComplete="email"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                  <div className="input-glow"></div>
                </div>
                
                <div className="form-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword.password ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      required={!isLogin}
                      autoComplete="new-password"
                    />
                    {formData.password && (
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('password')}
                      >
                        {showPassword.password ? '🙈' : '👁️'}
                      </button>
                    )}
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                  <div className="input-glow"></div>
                </div>

                <div className="form-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      required={!isLogin}
                      autoComplete="new-password"
                    />
                    {formData.confirmPassword && (
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                      >
                        {showPassword.confirmPassword ? '🙈' : '👁️'}
                      </button>
                    )}
                  </div>
                  {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                  <div className="input-glow"></div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  <span className="btn-text">
                    {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
                  </span>
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
          <div style={{ marginTop: "1rem" }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const idToken = credentialResponse.credential;
                  if (!idToken) {
                    console.error("❌ No ID token received from Google");
                    return;
                  }

                  // Call AuthContext → which calls authService.googleLogin
                  const result = await googleLogin(idToken);

                  if (result.success) {
                    navigate('/gallery');
                  } else {
                    console.error('❌ Failed to complete Google login');
                  }
                } catch (err) {
                  console.error("❌ Error handling Google login:", err);
                }
              }}
              onError={() => {
                console.error("❌ Google Login Failed");
              }}
            />
          </div>

          {/* Toggle Mode */}
          <div className="toggle-mode">
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button onClick={toggleMode} className="toggle-btn" disabled={isSubmitting}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
