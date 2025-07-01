import { useLocation } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';

function PostPage() {
  const location = useLocation();
  const posts = usePosts();

  // 打印文章数据到控制台
  console.log('Posts from Context:', posts);
  console.log('Number of posts:', posts.length);

  return (
    <div>
      <h1>文章页面</h1>
      <p>这是文章详情页面</p>
      <p>当前路径: {location.pathname}</p>
      <p>文章数量: {posts.length}</p>
    </div>
  );
}

export default PostPage;