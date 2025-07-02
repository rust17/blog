import { Link } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';

function HomePage() {
  const posts = usePosts();

  return (
    <div className="p-6 bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
      <p className="mb-4 text-gray-600 dark:text-gray-300">欢迎来到我的个人博客！</p>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">所有文章 ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">没有找到文章</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.path} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-slate-800 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-2">
                  <Link
                    to={`/${post.path}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {post.frontmatter.title || '无标题'}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  路径: {post.path} | 日期: {post.frontmatter.date || '未知'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {post.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">快速导航</h2>
        <div className="space-y-2">
          <div>
            <Link to="/introduction" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              → 关于我
            </Link>
          </div>
          <div>
            <Link to="/2023/my-first-post" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              → 我的第一篇文章
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
