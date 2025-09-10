import React, { useState, useEffect } from 'react';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        ux_mode: 'popup',
        cancel_on_tap_outside: false
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-signup-button'),
        { 
          theme: 'outline', 
          size: 'large',
          width: '100%',
          text: 'signup_with',
          shape: 'rectangular'
        }
      );
    }
  }, []);

  const handleGoogleCredentialResponse = (response) => {
    handleGoogleSignup(response.credential);
  };

  const handleGoogleSignup = async (idToken) => {
    setGoogleLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      

      const data = await response.json();

      if (data.success) {
        console.log('Google signup successful:', data.user);
        // TODO: Store token and redirect to dashboard
        // localStorage.setItem('token', data.user.token);
        // navigate('/dashboard');
      } else {
        setError(data.message || 'Google signup failed');
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Network error during Google signup');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegularSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Regular signup successful:', data.user);
        // TODO: Store token and redirect
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Create Account
        </h1>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Google Sign-Up Button */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <div id="google-signup-button"></div>
          {googleLoading && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #ddd',
                borderTop: '2px solid #4285f4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          color: '#666',
          position: 'relative'
        }}>
          <span style={{
            background: 'white',
            padding: '0 15px',
            fontSize: '14px'
          }}>
            or create account with email
          </span>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            background: '#ddd',
            zIndex: '-1'
          }}></div>
        </div>

        {/* Regular Signup Form */}
        <form onSubmit={handleRegularSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '16px',
              marginBottom: '15px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '16px',
              marginBottom: '15px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '16px',
              marginBottom: '15px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '10px',
              fontSize: '16px',
              marginBottom: '20px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#666'
        }}>
          Already have an account? <a href="/login" style={{ color: '#667eea', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;