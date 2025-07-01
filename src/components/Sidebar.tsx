import { Link, useLocation } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';

function Sidebar() {
  const posts = usePosts();
  const location = useLocation();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">文章目录</h2>
      <ul className="space-y-2">
        {posts.map(post => {
          const linkPath = `/${post.path}`;
          const isActive = location.pathname === linkPath;

          return (
            <li key={post.path}>
              <Link
                to={linkPath}
                className={`block p-2 text-sm rounded transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-800 font-bold border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {post.frontmatter.title || post.path}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;