import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  if (!email.trim()) {
    setError('Please enter your email address');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Password reset email sent:', email);
      setIsSubmitted(true);
    } else {
      // Even if user doesn't exist, show success message for security
      setIsSubmitted(true);
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    // Show success anyway for security (don't reveal if email exists)
    setIsSubmitted(true);
  } finally {
    setLoading(false);
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
    forgotCard: {
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
      lineHeight: 1.5,
    },
    form: {
      marginBottom: '1.5rem',
    },
    inputGroup: {
      marginBottom: '1.5rem',
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
    submitButton: {
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
    successMessage: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32',
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '0.95rem',
      textAlign: 'center',
      marginBottom: '1.5rem',
      border: '1px solid #c8e6c9',
    },
    footer: {
      textAlign: 'center',
      color: '#666',
      fontSize: '0.95rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    linkRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    backLink: {
      color: '#00bcd4',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.3s ease',
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
          
          .submit-button:hover {
            background-color: #00bcd4;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
          }
          
          .submit-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          
          .back-link:hover,
          .signup-link:hover {
            color: #0097a7;
            text-decoration: underline;
          }
          
          .forgot-card {
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
          
          .success-message {
            animation: slideIn 0.4s ease-out;
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @media (max-width: 480px) {
            .forgot-card {
              padding: 1.5rem;
              margin: 0.5rem;
            }
            
            .title {
              font-size: 1.5rem;
            }
            
            .input,
            .submit-button {
              padding: 1rem;
            }
            
            .link-row {
              flex-direction: column;
              gap: 0.5rem;
            }
          }
        `}
      </style>
      
      <div style={styles.forgotCard} className="forgot-card">
        {/* Title Section */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Reset Your Password</h1>
          <p style={styles.subtitle}>
            Enter your registered email and we'll send you reset instructions.
          </p>
        </div>
        {error && !isSubmitted && (
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
        {/* Success Message */}
        {isSubmitted && (
          <div style={styles.successMessage} className="success-message">
            Reset instructions have been sent to {email}. Check your inbox!
          </div>
        )}

        {/* Form Section */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                className="input-focus"
                required
              />
            </div>

            {/* Submit Button */}
            <button
  type="submit"
  style={{...styles.submitButton, opacity: loading ? 0.7 : 1}}
  className="submit-button"
  disabled={!email.trim() || loading}
>
  {loading ? 'Sending...' : 'Send Reset Link'}
</button>
          </form>
        )}

        {/* Footer Links */}
        <div style={styles.footer}>
          <div style={styles.linkRow} className="link-row">
            <a href="/auth" style={styles.backLink} className="back-link">
              ← Back to Login
            </a>
          </div>
          
          <div>
            Don't have an account?
            <a href="/signup" style={styles.signupLink} className="signup-link">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;