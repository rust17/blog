import { useLocation } from 'react-router-dom';

function PostPage() {
  const location = useLocation();

  return (
    <div>
      <h1>文章页面</h1>
      <p>这是文章详情页面</p>
      <p>当前路径: {location.pathname}</p>
    </div>
  );
}

export default PostPage;