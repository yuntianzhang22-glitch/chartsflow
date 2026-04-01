import { useRef, useState, useEffect } from 'react';
import {
  ChartHistogram, Moon, Sun, Add,
  User, ChartHistogram as ChartIcon, PaymentMethod, Setting, Logout,
} from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import { useAuthStore } from '../store/authStore';
import './Header.css';

// 下拉菜单项配置 —— 以后新增功能只需在这里加一行
const USER_MENU_ITEMS = [
  { icon: User,           label: 'My Profile',           page: 'profile'   },
  { icon: ChartIcon,      label: 'My Projects',          page: 'projects'  },
  // { icon: PaymentMethod,  label: 'Billing & Payments',  page: 'billing'   },  // 暂未开放
  { icon: Setting,        label: 'Settings',             page: 'settings'  },
];

function UserAvatar({ email }) {
  const letter = email ? email[0].toUpperCase() : '?';
  return <div className="user-avatar">{letter}</div>;
}

function UserDropdown({ user, onNavigate, onSignOut }) {
  return (
    <div className="user-dropdown">
      <div className="dropdown-user-info">
        <UserAvatar email={user.email} />
        <div className="dropdown-email">{user.email}</div>
      </div>

      <div className="dropdown-divider" />

      {USER_MENU_ITEMS.map(({ icon: Icon, label, page }) => (
        <button key={page} className="dropdown-item" onClick={() => onNavigate(page)}>
          <Icon size={15} />
          {label}
        </button>
      ))}

      <div className="dropdown-divider" />

      <button className="dropdown-item dropdown-item-danger" onClick={onSignOut}>
        <Logout size={15} />
        Log Out
      </button>
    </div>
  );
}

function Header() {
  const setPage = useChartStore((state) => state.setPage);
  const isDark = useChartStore((state) => state.isDark);
  const toggleTheme = useChartStore((state) => state.toggleTheme);
  const { user, signOut, setShowAuthModal } = useAuthStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (page) => {
    setPage(page);
    setDropdownOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setDropdownOpen(false);
    setPage('home');
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => setPage('home')}>
        <div className="header-logo-icon">
          <ChartHistogram size={18} />
        </div>
        <span className="header-logo-text">ChartFlow</span>
      </div>

      <div className="header-actions">
        <button className="btn btn-primary header-btn" onClick={() => setPage('projects')}>
          <Add size={14} /> 我的项目
        </button>

        <button className="icon-btn" onClick={toggleTheme} title={isDark ? '切换亮色' : '切换暗色'}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div className="avatar-wrapper" ref={dropdownRef}>
            <button
              className={`avatar-btn ${dropdownOpen ? 'active' : ''}`}
              onClick={() => setDropdownOpen((o) => !o)}
            >
              <UserAvatar email={user.email} />
            </button>

            {dropdownOpen && (
              <UserDropdown
                user={user}
                onNavigate={handleNavigate}
                onSignOut={handleSignOut}
              />
            )}
          </div>
        ) : (
          <button className="btn btn-secondary header-btn" onClick={() => setShowAuthModal(true)}>
            登录 / 注册
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
