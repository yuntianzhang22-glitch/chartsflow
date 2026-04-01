import { useEffect } from 'react';
import { useChartStore } from './store/chartStore';
import { useAuthStore } from './store/authStore';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import BillingPage from './pages/BillingPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  const currentPage = useChartStore((state) => state.currentPage);
  const isDark = useChartStore((state) => state.isDark);
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`} data-theme={isDark ? 'dark' : 'light'}>
      <Header />

      {currentPage === 'home'      && <HomePage />}
      {currentPage === 'projects'  && <ProjectsPage />}
      {currentPage === 'editor'    && <EditorPage />}
      {currentPage === 'profile'   && <ProfilePage />}
      {currentPage === 'billing'   && <BillingPage />}
      {currentPage === 'settings'  && <SettingsPage />}

      <AuthModal />
    </div>
  );
}

export default App;
