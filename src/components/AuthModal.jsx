import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import './AuthModal.css';

function AuthModal() {
  const { showAuthModal, setShowAuthModal, signIn, signUp } = useAuthStore();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const switchTab = (newTab) => {
    setTab(newTab);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tab === 'register' && password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要 6 位');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await signIn(email, password);
        setShowAuthModal(false);
      } else {
        await signUp(email, password);
        setSuccess('注册成功！请前往邮箱完成验证后登录。');
      }
    } catch (err) {
      const messages = {
        'Invalid login credentials': '邮箱或密码错误',
        'User already registered': '该邮箱已注册，请直接登录',
        'Email not confirmed': '邮箱尚未验证，请检查收件箱',
      };
      setError(messages[err.message] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={() => setShowAuthModal(false)}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            登录
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              required
            />
          </div>

          {tab === 'register' && (
            <div className="auth-field">
              <label>确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再输一次密码"
                required
              />
            </div>
          )}

          {error && <div className="auth-message auth-error">{error}</div>}
          {success && <div className="auth-message auth-success">{success}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? '处理中...' : tab === 'login' ? '登录' : '创建账号'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
