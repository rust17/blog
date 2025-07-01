import { Routes, Route } from 'react-router-dom';
import { PostProvider } from './contexts/PostContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-900 dark:text-white">
      <ThemeProvider>
        <PostProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="*" element={<PostPage />} />
            </Route>
          </Routes>
        </PostProvider>
      </ThemeProvider>
    </div>
  );
}

export default App
