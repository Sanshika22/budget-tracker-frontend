import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api/signup';

function SignUpForm({ onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed.');
      }

      setSuccess('✅ Registration successful! Please proceed to login.');
      setUsername('');
      setPassword('');
      setTimeout(onSwitchToLogin, 1500); 

    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={styles.container}>
      <h3 style={{ textAlign: 'center', color: '#2c3e50' }}>Register for Budget Tracker</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-group" style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            style={styles.input}
            placeholder="Choose a username"
          />
        </div>

        <div className="form-group" style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
              placeholder="Create a password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.signUpBtn}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>

        {error && <p className="error-message" style={styles.error}>{error}</p>}
        {success && <p className="success-message" style={styles.success}>{success}</p>}
      </form>

      <p style={styles.footerText}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} disabled={loading} style={styles.switchBtn}>
          Login
        </button>
      </p>
    </div>
  );
}

const styles = {
  container: { padding: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#34495e' },
  passwordWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: { 
    width: '100%', 
    padding: '12px', 
    paddingRight: '45px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#7f8c8d'
  },
  signUpBtn: {
    padding: '12px',
    backgroundColor: '#2ecc71', // Green for sign-up
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '10px'
  },
  error: { color: '#e74c3c', fontSize: '0.85rem', textAlign: 'center', marginTop: '5px' },
  success: { color: '#27ae60', fontSize: '0.85rem', textAlign: 'center', marginTop: '5px' },
  footerText: { textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#7f8c8d' },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: '600',
    padding: 0
  }
};

export default SignUpForm;