import { Link, useLocation } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import { buildDirectoryTree } from '../services/postService';
import type { TreeNode } from '../types/index';

// 递归渲染目录项的组件
function DirectoryItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const location = useLocation();

  // 使用固定的缩进类名来确保 Tailwind 正确编译
  const getIndentClass = (level: number) => {
    switch (level) {
      case 0: return '';
      case 1: return 'ml-4';
      case 2: return 'ml-8';
      case 3: return 'ml-12';
      default: return 'ml-16';
    }
  };

  const indentClass = getIndentClass(level);

  if (node.isDirectory) {
    // 目录节点
    return (
      <div>
        <div className={`flex items-center p-2 text-sm font-medium text-gray-600 ${indentClass}`}>
          <span className="mr-1">📁</span>
          {node.name}/
        </div>
        {node.children && (
          <div>
            {node.children.map((child, index) => (
              <DirectoryItem key={child.path || `${node.name}-${index}`} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    // 文件节点
    const linkPath = `/${node.path}`;
    const isActive = location.pathname === linkPath;

    return (
      <div className={indentClass}>
        <Link
          to={linkPath}
          className={`block p-2 text-sm rounded transition-colors ${
            isActive
              ? 'bg-blue-100 text-blue-800 font-bold border-l-4 border-blue-500'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1">📄</span>
          {node.name}
        </Link>
      </div>
    );
  }
}

function Sidebar() {
  const posts = usePosts(); // 确保posts已加载
  const tree = buildDirectoryTree();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">文章目录</h2>
      <div className="space-y-1">
        {tree.map((node, index) => (
          <DirectoryItem key={node.path || `root-${index}`} node={node} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
