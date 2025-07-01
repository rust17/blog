import { Routes, Route } from 'react-router-dom';
import { PostProvider } from './contexts/PostContext';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <PostProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PostPage />} />
      </Routes>
    </PostProvider>
  );
}

export default App
