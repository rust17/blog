import { Routes, Route } from 'react-router-dom';
import { PostProvider } from './contexts/PostContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';

function App() {
  return (
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
  );
}

export default App
