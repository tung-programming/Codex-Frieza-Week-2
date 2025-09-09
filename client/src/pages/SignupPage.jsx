import React, { useState, useEffect } from 'react';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  setError('');
  useEffect(() => {
  // Initialize Google Sign-In
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
    });
  }
}, []);
  
  
  // Basic client-side validation
  if (!username || !email || !password || !confirmPassword) {
    setError('All fields are required');
    return;
  }
  
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    setError('Password must be at least 6 characters long');
    return;
  }

  setLoading(true);
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Signup successful:', result);
      // TODO: Store token in localStorage and redirect
      // localStorage.setItem('token', result.token);
      // localStorage.setItem('user', JSON.stringify(result));
    } else {
      setError(result.message || 'Signup failed');
    }
  } catch (err) {
    console.error('Signup error:', err);
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};
const handleGoogleResponse = async (response) => {
  try {
    console.log('Google ID Token:', response.credential);
    
    // Send token to your backend
    const backendResponse = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: response.credential }),
    });
    
    const result = await backendResponse.json();
    
    if (backendResponse.ok) {
      console.log('Google auth successful:', result);
      // Store token and redirect
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result));
      // Redirect to dashboard/gallery
    } else {
      setError(result.message || 'Google authentication failed');
    }
  } catch (err) {
    console.error('Google auth error:', err);
    setError('Google authentication failed');
  }
};
const handleGoogleSignup = () => {
  if (window.google) {
    window.google.accounts.id.prompt(); // Shows Google sign-in popup
  } else {
    alert('Google Sign-In is not implemented yet. Stay tuned.');
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
    signupCard: {
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
    errorMessage: {
      color: '#e53e3e',
      fontSize: '0.85rem',
      marginBottom: '1rem',
      textAlign: 'center',
      backgroundColor: '#fed7d7',
      padding: '0.5rem',
      borderRadius: '6px',
      border: '1px solid #feb2b2',
    },
    signupButton: {
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
      opacity: loading ? 0.7 : 1,
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
    loginLink: {
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
          
          .signup-button:hover:not(:disabled) {
            background-color: #00bcd4;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
          }
          
          .signup-button:disabled {
            cursor: not-allowed;
          }
          
          .google-button:hover {
            border-color: #00bcd4;
            box-shadow: 0 0 0 2px rgba(0, 188, 212, 0.1);
            transform: translateY(-1px);
          }
          
          .login-link:hover {
            color: #0097a7;
            text-decoration: underline;
          }
          
          .signup-card {
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
            .signup-card {
              padding: 1.5rem;
              margin: 0.5rem;
            }
            
            .title {
              font-size: 1.5rem;
            }
            
            .input, .signup-button, .google-button {
              padding: 1rem;
            }
          }
        `}
      </style>
      
      <div style={styles.signupCard} className="signup-card">
        {/* Title Section */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Create Your Account</h1>
          <p style={styles.subtitle}>Join the modern media gallery today.</p>
        </div>

        {/* Form Section */}
        <div style={styles.form}>
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              className="input-focus"
            />
          </div>
          
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
          
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              className="input-focus"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={styles.signupButton}
            className="signup-button"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          style={styles.googleButton}
          className="google-button"
        >
          <span style={styles.googleIcon}>🔍</span>
          Sign Up with Google
        </button>

        {/* Footer Section */}
        <div style={styles.footer}>
          Already have an account?
          <a href="/login" style={styles.loginLink} className="login-link">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;