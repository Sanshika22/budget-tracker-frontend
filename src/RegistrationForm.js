import React, { useState } from 'react';
import './LoginForm.css'; 

function RegistrationForm({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://budget-tracker-backend-zwaa.onrender.com/api';

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getStrength = (pass) => {
    if (!pass) return { label: '', color: '#222', width: '0%', valid: false };
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    
    if (pass.length < 8) return { label: 'MIN 8 CHARS', color: '#ff4b2b', width: '20%', valid: false };
    if (pass.length > 15) return { label: 'MAX 15 CHARS', color: '#ff4b2b', width: '20%', valid: false };
    if (!hasUpperCase) return { label: 'NEED UPPERCASE', color: '#ff9800', width: '40%', valid: false };
    if (!hasNumber) return { label: 'NEED NUMBER', color: '#ff9800', width: '70%', valid: false };
    
    return { label: 'SECURE ENCRYPTION READY', color: '#00d2ff', width: '100%', valid: true };
  };

  const strength = getStrength(formData.password);
  const isEmailValid = validateEmail(formData.email);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = isEmailValid && strength.valid && passwordsMatch && formData.username.trim() !== '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: 'Initializing secure registration...', type: 'info' });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Access Granted. Redirecting...', type: 'success' });
        setTimeout(() => onRegisterSuccess(formData.username), 1500);
      } else {
        setMessage({ text: `Protocol Error: ${data.error || 'Failed'}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'System Offline. Check server connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-full-page">
      <div className="dial-wrapper">
        
        <div className="dial-container">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="dial-bar" style={{ '--i': i }}></div>
          ))}
        </div>

        <div className="login-glass-box">
          <h2 className="login-header">New Identity</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                name="username" type="text" placeholder="IDENTITY NAME"
                value={formData.username} onChange={handleChange} required
                disabled={loading}
              />
            </div>

            <div className="input-container" style={{ borderColor: formData.email && !isEmailValid ? '#ff4b2b' : '' }}>
              <input
                name="email" type="email" placeholder="COMMUNICATION EMAIL"
                value={formData.email} onChange={handleChange} required
                disabled={loading}
              />
            </div>

            <div className="input-row-wrapper">
              <div className="input-container half-width">
                <input
                  name="password" placeholder="PASSWORD"
                  type={showPasswords ? "text" : "password"} 
                  value={formData.password} onChange={handleChange} required
                  disabled={loading}
                />
              </div>
              <div className="input-container half-width" style={{ borderColor: (formData.confirmPassword && !passwordsMatch) ? '#ff4b2b' : '' }}>
                <input
                  name="confirmPassword" placeholder="VERIFY"
                  type={showPasswords ? "text" : "password"} 
                  value={formData.confirmPassword} onChange={handleChange} required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Futuristic Strength Bar */}
            <div style={{ margin: '0 0 20px' }}>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: '0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 10px ${strength.color}` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '9px', color: strength.color, letterSpacing: '1px' }}>{strength.label}</span>
                {formData.confirmPassword && (
                  <span style={{ fontSize: '9px', color: passwordsMatch ? '#00d2ff' : '#ff4b2b', letterSpacing: '1px' }}>
                    {passwordsMatch ? 'MATCHED' : 'MISMATCH'}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }} onClick={() => setShowPasswords(!showPasswords)}>
               <div style={{ width: '12px', height: '12px', border: '1px solid #00d2ff', borderRadius: '2px', background: showPasswords ? '#00d2ff' : 'transparent', transition: '0.2s' }}></div>
               <span style={{ color: '#666', fontSize: '10px', letterSpacing: '1px' }}>REVEAL PASSCODES</span>
            </div>

            <button 
              type="submit" 
              className="glow-login-btn" 
              disabled={loading || !isFormValid}
            >
              {loading ? 'ENCRYPTING...' : 'AUTHORIZE ACCOUNT'}
            </button>
          </form>

          {message.text && (
            <p style={{ fontSize: '10px', marginTop: '20px', color: message.type === 'error' ? '#ff4b2b' : '#00d2ff', textAlign: 'center', letterSpacing: '1px' }}>
              {message.text}
            </p>
          )}

          <p className="register-footer">
            EXISTING MEMBER? <span onClick={onSwitchToLogin}>BYPASS TO LOGIN</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;