import { Link } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';

function Sidebar() {
  const posts = usePosts();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">文章目录</h2>
      <ul className="space-y-2">
        {posts.map(post => (
          <li key={post.path}>
            <Link
              to={`/${post.path}`}
              className="block p-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              {post.frontmatter.title || post.path}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;