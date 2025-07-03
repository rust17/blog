import { useLocation } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';

export function usePageTitle() {
  const location = useLocation();
  const posts = usePosts();

  const getCurrentPageTitle = () => {
    const articlePath = location.pathname.startsWith('/')
      ? location.pathname.slice(1)
      : location.pathname;

    if (articlePath === '' || articlePath === '/') {
      return 'Home';
    }

    const currentPost = posts.find(post => post.path === articlePath);
    return currentPost?.frontmatter.title || '无标题';
  };

  return getCurrentPageTitle();
}