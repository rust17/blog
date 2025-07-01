import { Routes, Route } from 'react-router-dom';
import { PostProvider } from './contexts/PostContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <PostProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<PostPage />} />
        </Route>
      </Routes>
    </PostProvider>
  );
}

export default App
