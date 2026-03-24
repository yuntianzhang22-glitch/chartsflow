import { useChartStore } from './store/chartStore';
import HomePage from './pages/HomePage';
import DataInputPage from './pages/DataInputPage';
import EditorPage from './pages/EditorPage';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const currentPage = useChartStore((state) => state.currentPage);
  const isDark = useChartStore((state) => state.isDark);

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`} data-theme={isDark ? 'dark' : 'light'}>
      <ThemeToggle />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'dataInput' && <DataInputPage />}
      {currentPage === 'editor' && <EditorPage />}
    </div>
  );
}

export default App;