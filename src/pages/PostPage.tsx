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
      <div className="p-4 md:p-6 bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        <h1 className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">文章未找到</h1>
        <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
          路径 "{articlePath}" 对应的文章不存在
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          可用的文章路径：
        </p>
        <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-h-40 overflow-y-auto">
          {posts.map(post => (
            <li key={post.path} className="break-all">• {post.path}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-none">
        <MarkdownRenderer content={currentPost.content} />
      </div>
      <div className="mt-4 text-sm gap-2 text-gray-600 dark:text-gray-300 flex justify-end">
        <p>发布于: {currentPost.frontmatter.date}</p>
      </div>
    </div>
  );
}

export default PostPage;
