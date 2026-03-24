import { Sun, Moon } from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import './ThemeToggle.css';

function ThemeToggle() {
  const isDark = useChartStore((state) => state.isDark);
  const toggleTheme = useChartStore((state) => state.toggleTheme);

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="theme-text">{isDark ? '浅色' : '深色'}</span>
    </button>
  );
}

export default ThemeToggle;