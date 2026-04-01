import { Setting, Moon, Sun, Translate } from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import './DashboardPage.css';
import './SettingsPage.css';

function SettingsPage() {
  const isDark = useChartStore((state) => state.isDark);
  const toggleTheme = useChartStore((state) => state.toggleTheme);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Settings</h2>
        <p>应用偏好与个性化设置</p>
      </div>

      <div className="dashboard-content">
        {/* 外观 */}
        <section className="dashboard-section">
          <h3 className="section-title">
            <Setting size={16} /> 外观
          </h3>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-label">主题模式</div>
              <div className="setting-desc">选择亮色或暗色界面</div>
            </div>
            <div className="theme-toggle-group">
              <button
                className={`theme-option ${!isDark ? 'active' : ''}`}
                onClick={() => isDark && toggleTheme()}
              >
                <Sun size={15} /> 亮色
              </button>
              <button
                className={`theme-option ${isDark ? 'active' : ''}`}
                onClick={() => !isDark && toggleTheme()}
              >
                <Moon size={15} /> 暗色
              </button>
            </div>
          </div>
        </section>

        {/* 语言（占位） */}
        <section className="dashboard-section">
          <h3 className="section-title">
            <Translate size={16} /> 语言与地区
          </h3>
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-label">界面语言</div>
              <div className="setting-desc">当前：简体中文</div>
            </div>
            <button className="btn btn-secondary" disabled>
              更多语言（即将推出）
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
