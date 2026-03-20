import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {};
      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
      } else {
        setErrors({ general: err.response?.data?.error || 'Something went wrong' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 40,
        width: '100%',
        maxWidth: 420,
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>💰</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            FinTrack
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Personal Finance Dashboard
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg-secondary)', padding: 4, borderRadius: 10 }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none',
              background: isLogin ? 'var(--accent)' : 'transparent',
              color: isLogin ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-body)', transition: 'all 0.2s',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none',
              background: !isLogin ? 'var(--accent)' : 'transparent',
              color: !isLogin ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-body)', transition: 'all 0.2s',
            }}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {errors.general && (
          <div style={{
            background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            color: 'var(--danger)', marginBottom: 16,
          }}>
            {errors.general}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                style={errors.name ? { borderColor: 'var(--danger)' } : {}}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              style={errors.email ? { borderColor: 'var(--danger)' } : {}}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              style={errors.password ? { borderColor: 'var(--danger)' } : {}}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: 14, marginTop: 8 }}
          >
            {loading ? 'Please wait...' : isLogin ? '🔐 Login' : '✅ Create Account'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;