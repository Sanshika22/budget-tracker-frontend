import React, { useState } from 'react';

// Backend Base URL
const API_URL = 'https://budget-tracker-backend-zwaa.onrender.com';

function SignUpForm({ onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ✅ Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 🔥 Important for cookies
        body: JSON.stringify({ username, password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed.');
      }

      setSuccess('✅ Registration successful! Redirecting to login...');
      setUsername('');
      setPassword('');

      // ⏳ Auto switch to login
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={styles.container}>
      <h3 style={styles.heading}>Create Your Identity</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Username */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            placeholder="Choose a username"
            style={styles.input}
          />
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Create a password"
              style={styles.input}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={styles.signUpBtn}
        >
          {loading ? 'Processing...' : 'Register Account'}
        </button>

        {/* Messages */}
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </form>

      {/* Switch to login */}
      <p style={styles.footerText}>
        Already a member?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={loading}
          style={styles.switchBtn}
        >
          Login here
        </button>
      </p>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  },
  heading: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#34495e',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    paddingRight: '45px',
    borderRadius: '8px',
    border: '1px solid #dfe6e9',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  signUpBtn: {
    padding: '12px',
    backgroundColor: '#2ecc71',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  success: {
    color: '#27ae60',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '0.9rem',
    color: '#636e72',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default SignUpForm;
