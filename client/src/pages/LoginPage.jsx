import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setError('');
  
  if (!email || !password) {
    setError('Please enter both email and password');
    return;
  }

  setLoading(true);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Login successful:', result);
      // TODO: Store token in localStorage and redirect
      // localStorage.setItem('token', result.token);
      // localStorage.setItem('user', JSON.stringify(result));
    } else {
      setError(result.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleGoogleLogin = () => {
  if (window.google) {
    window.google.accounts.id.prompt(); // Shows Google sign-in popup
  } else {
    alert('Google Sign-In not loaded. Please refresh and try again.');
  }
};

  // Style constants
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      margin: 0,
      color: '#111',
      lineHeight: 1.6,
    },
    loginCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '2.5rem',
      width: '100%',
      maxWidth: '400px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    },
    titleSection: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#333',
      margin: '0 0 0.5rem 0',
      background: 'linear-gradient(135deg, #333 0%, #00bcd4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      fontSize: '0.95rem',
      color: '#666',
      margin: 0,
    },
    form: {
      marginBottom: '1.5rem',
    },
    inputGroup: {
      marginBottom: '1.25rem',
    },
    input: {
      width: '100%',
      padding: '0.875rem',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: '#fafafa',
      boxSizing: 'border-box',
    },
    optionsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: '#00bcd4',
    },
    checkboxLabel: {
      fontSize: '0.9rem',
      color: '#666',
      userSelect: 'none',
      cursor: 'pointer',
    },
    forgotLink: {
      color: '#00bcd4',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
    },
    loginButton: {
      width: '100%',
      backgroundColor: '#333',
      color: 'white',
      padding: '0.875rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '1.5rem',
    },
    divider: {
      position: 'relative',
      textAlign: 'center',
      margin: '1.5rem 0',
    },
    dividerLine: {
      height: '1px',
      backgroundColor: '#e0e0e0',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
    },
    dividerText: {
      backgroundColor: 'white',
      color: '#999',
      fontSize: '0.85rem',
      padding: '0 1rem',
      position: 'relative',
      display: 'inline-block',
    },
    googleButton: {
      width: '100%',
      backgroundColor: 'white',
      color: '#333',
      padding: '0.875rem',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '2rem',
    },
    googleIcon: {
      fontSize: '1.2rem',
    },
    footer: {
      textAlign: 'center',
      color: '#666',
      fontSize: '0.95rem',
    },
    signupLink: {
      color: '#00bcd4',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.3s ease',
      marginLeft: '0.25rem',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          .input-focus:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
            background-color: white;
          }
          
          .login-button:hover {
            background-color: #00bcd4;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
          }
          
          .google-button:hover {
            border-color: #00bcd4;
            box-shadow: 0 0 0 2px rgba(0, 188, 212, 0.1);
            transform: translateY(-1px);
          }
          
          .forgot-link:hover {
            color: #0097a7;
            text-decoration: underline;
          }
          
          .signup-link:hover {
            color: #0097a7;
            text-decoration: underline;
          }
          
          .login-card {
            animation: fadeInUp 0.6s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 480px) {
            .login-card {
              padding: 1.5rem;
              margin: 0.5rem;
            }
            
            .options-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }
            
            .title {
              font-size: 1.5rem;
            }
            
            .input, .login-button, .google-button {
              padding: 1rem;
            }
          }
        `}
      </style>
      
      <div style={styles.loginCard} className="login-card">
        {/* Title Section */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Login to Your Account</h1>
          <p style={styles.subtitle}>Welcome back! Please enter your details.</p>
        </div>

        {/* Form Section */}
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              className="input-focus"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              className="input-focus"
            />
          </div>

          {/* Options Row */}
          <div style={styles.optionsRow} className="options-row">
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                Remember me
              </label>
            </div>
            <a href="/forgot-password" style={styles.forgotLink} className="forgot-link">
              Forgot Password?
            </a>
          </div>
          {error && (
  <div style={{
    color: '#e53e3e',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    textAlign: 'center',
    backgroundColor: '#fed7d7',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #feb2b2',
  }}>
    {error}
  </div>
)}  
          {/* Submit Button */}
          <button
  type="button"
  onClick={handleLogin}
  disabled={loading}
  style={{...styles.loginButton, opacity: loading ? 0.7 : 1}}
  className="login-button"
>
  {loading ? 'Signing In...' : 'Login'}
</button>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={styles.googleButton}
          className="google-button"
        >
          <span style={styles.googleIcon}>🔍</span>
          Continue with Google
        </button>

        {/* Footer Section */}
        <div style={styles.footer}>
          Don't have an account?
          <a href="/signup" style={styles.signupLink} className="signup-link">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;