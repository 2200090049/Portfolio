import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaEnvelope, FaKey } from 'react-icons/fa';
import './AdminAuth.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    secureKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAdmin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, email, password, confirmPassword, secureKey } = formData;

    // Validation
    if (!username || !email || !password || !confirmPassword || !secureKey) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    const result = await register(username, email, password, secureKey);

    if (result.success) {
      navigate('/portal-dk-sys-2025/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-bg">
        <div className="grid-bg"></div>
        <div className="gradient-overlay"></div>
      </div>

      <div className="admin-auth-card register-card">
        <div className="auth-header">
          <div className="shield-icon">
            <FaShieldAlt />
          </div>
          <h1>Create Admin Account</h1>
          <p>Register with your secure key</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>
              <FaUser /> Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username (min 3 chars)"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock /> Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a password (min 6 chars)"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaLock /> Confirm Password
            </label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaKey /> Secure Key
            </label>
            <input
              type="text"
              name="secureKey"
              value={formData.secureKey}
              onChange={handleChange}
              placeholder="Enter your secure registration key"
              disabled={loading}
              autoComplete="off"
              style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
            />
            <small style={{ color: '#888', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Format: DKADMIN-XXXX-XXXX-XXXX-XXXX
            </small>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creating Account...
              </>
            ) : (
              <>
                <FaShieldAlt /> Create Admin Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/portal-dk-sys-2025/login">
              Login here
            </Link>
          </p>
        </div>

        <div className="security-notice">
          <p>🔒 Each secure key can only be used once</p>
          <p style={{ fontSize: '11px', marginTop: '5px' }}>
            Maximum 10 admin accounts allowed
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
