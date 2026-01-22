import React, { useState } from 'react';
import './LoginForm.css'; // Uses the Titanium-themed CSS

function LoginForm({ onLoginSuccess, onSwitchToSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Endpoint matches your existing backend setup
  const API_URL = 'https://budget-tracker-backend-zwaa.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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
        throw new Error(data.error || 'ACCESS DENIED: Invalid Credentials');
      }

      // Passes the username back to App.js to load "sticky" budget data
      onLoginSuccess(data.username); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-full-page">
      <div className="dial-wrapper">
        
        {/* --- THE PULSING CYBER DIAL --- */}
        <div className="dial-container">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="dial-bar" style={{ '--i': i }}></div>
          ))}
        </div>

        {/* --- THE TITANIUM LOGIN CARD --- */}
        <div className="login-glass-box">
          <h2 className="login-header">User Access</h2>

          <form onSubmit={handleSubmit} className="futuristic-form">
            
            {/* Identity Field */}
            <div className="input-container">
              <input
                type="text"
                placeholder="IDENTITY NAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Access Key Field */}
            <div className="input-container" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ACCESS KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  background: 'none', border: 'none', color: '#00d2ff', 
                  fontSize: '0.65rem', cursor: 'pointer', letterSpacing: '1px',
                  fontWeight: 'bold'
                }}
              >
                {showPassword ? 'CANCEL' : 'REVEAL'}
              </button>
            </div>

            <p style={{ 
              color: '#918e8e', fontSize: '9px', textAlign: 'right', 
              marginBottom: '25px', cursor: 'pointer', letterSpacing: '1px' 
            }}>
              RECOVER ACCESS KEY?
            </p>

            {/* Neon Action Button */}
            <button 
              type="submit" 
              className="glow-login-btn" 
              disabled={loading}
            >
              {loading ? 'SYNCHRONIZING...' : 'INITIALIZE LOGIN'}
            </button>

            {/* Error Protocol Messaging */}
            {error && (
              <p style={{ 
                color: '#ff4b2b', fontSize: '10px', marginTop: '20px', 
                textAlign: 'center', letterSpacing: '1px' 
              }}>
                SYSTEM ALERT: {error}
              </p>
            )}
          </form>

          {/* Linked Services Section */}
          <div style={{ marginTop: '35px', textAlign: 'center' }}>
            <p style={{ color: '#333', fontSize: '9px', letterSpacing: '2px', marginBottom: '15px' }}>
              EXTERNAL SYNC
            </p>
            <div className="social-row" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button type="button" className="social-circle" style={{ border: '1px solid #333', background: 'none', color: '#666', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>G</button>
              <button type="button" className="social-circle" style={{ border: '1px solid #333', background: 'none', color: '#666', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>𝕏</button>
            </div>
          </div>

          {/* Footer Navigation */}
          <p className="register-footer">
            UNREGISTERED? <span onClick={onSwitchToSignup}>CREATE NEW IDENTITY</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;