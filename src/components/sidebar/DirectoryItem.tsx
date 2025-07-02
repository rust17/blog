import { Link, useLocation } from 'react-router-dom';
import type { TreeNode } from '../../types/index';

interface DirectoryItemProps {
  node: TreeNode;
  level?: number;
  expandedDirs: Set<string>;
  toggleDirectory: (path: string) => void;
  getDirectoryPath: (node: TreeNode) => string;
}

function DirectoryItem({
  node,
  level = 0,
  expandedDirs,
  toggleDirectory,
  getDirectoryPath
}: DirectoryItemProps) {
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
    const directoryPath = getDirectoryPath(node);
    const isExpanded = expandedDirs.has(directoryPath);

    return (
      <div>
        <div
          className={`flex items-center p-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors ${indentClass}`}
          onClick={() => toggleDirectory(directoryPath)}
        >
          <svg
            className="w-3 h-3 mr-1 transition-transform duration-200"
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {node.name}
        </div>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child, index) => (
              <DirectoryItem
                key={child.path || `${node.name}-${index}`}
                node={child}
                level={level + 1}
                expandedDirs={expandedDirs}
                toggleDirectory={toggleDirectory}
                getDirectoryPath={getDirectoryPath}
              />
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
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold border-l-4 border-blue-500 dark:border-blue-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
        >
          {node.name}
        </Link>
      </div>
    );
  }
}

export default DirectoryItem;
