import { useState } from 'react';
import { User, Mail, Key } from '@icon-park/react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import './DashboardPage.css';

function ProfilePage() {
  const { user } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', msg: '两次密码不一致' });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', msg: '密码至少需要 6 位' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', msg: error.message });
    } else {
      setStatus({ type: 'success', msg: '密码修改成功' });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>My Profile</h2>
        <p>管理你的账号信息</p>
      </div>

      <div className="dashboard-content">
        {/* 账号信息 */}
        <section className="dashboard-section">
          <h3 className="section-title">
            <User size={16} /> 账号信息
          </h3>
          <div className="info-row">
            <Mail size={15} />
            <div>
              <div className="info-label">邮箱地址</div>
              <div className="info-value">{user?.email}</div>
            </div>
          </div>
        </section>

        {/* 修改密码 */}
        <section className="dashboard-section">
          <h3 className="section-title">
            <Key size={16} /> 修改密码
          </h3>
          <form onSubmit={handleChangePassword} className="section-form">
            <div className="form-row">
              <label>新密码</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 6 位"
                required
              />
            </div>
            <div className="form-row">
              <label>确认新密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再输一次"
                required
              />
            </div>
            {status.msg && (
              <div className={`status-msg ${status.type}`}>{status.msg}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '保存中...' : '保存修改'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
