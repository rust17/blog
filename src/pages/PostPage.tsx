import { useLocation } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import MarkdownRenderer from '../components/MarkdownRenderer';

function PostPage() {
  const location = useLocation();
  const posts = usePosts();

  // 从路径中提取文章路径，去掉开头的 '/'
  const articlePath = location.pathname.startsWith('/')
    ? location.pathname.slice(1)
    : location.pathname;

  // 在文章列表中查找匹配的文章
  const currentPost = posts.find(post => post.path === articlePath);

  // 如果找不到文章，显示 404 信息
  if (!currentPost) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">文章未找到</h1>
        <p className="mt-2 text-gray-600">
          路径 "{articlePath}" 对应的文章不存在
        </p>
        <p className="mt-2 text-sm text-gray-500">
          可用的文章路径：
        </p>
        <ul className="mt-2 text-sm text-gray-500">
          {posts.map(post => (
            <li key={post.path}>• {post.path}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {currentPost.frontmatter.title || '无标题'}
      </h1>
      <div className="mb-4 text-sm text-gray-600">
        <p>路径: {currentPost.path}</p>
        <p>日期: {currentPost.frontmatter.date}</p>
      </div>
      <div className="border rounded-lg p-4 bg-gray-50">
        <MarkdownRenderer content={currentPost.content} />
      </div>
    </div>
  );
}

export default PostPage;