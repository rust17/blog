import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import { buildDirectoryTree } from '../services/postService';
import type { TreeNode } from '../types/index';

// 递归渲染目录项的组件
function DirectoryItem({
  node,
  level = 0,
  expandedDirs,
  toggleDirectory,
  getDirectoryPath
}: {
  node: TreeNode;
  level?: number;
  expandedDirs: Set<string>;
  toggleDirectory: (path: string) => void;
  getDirectoryPath: (node: TreeNode, level: number) => string;
}) {
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
    const directoryPath = getDirectoryPath(node, level);
    const isExpanded = expandedDirs.has(directoryPath);

    return (
      <div>
        <div
          className={`flex items-center p-2 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 rounded transition-colors ${indentClass}`}
          onClick={() => toggleDirectory(directoryPath)}
        >
          <span className="mr-1">
            {isExpanded ? '📂' : '📁'}
          </span>
          <span className="mr-1">
            {isExpanded ? '▼' : '▶'}
          </span>
          {node.name}/
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
  const location = useLocation();

  // 状态：已展开的目录列表
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // 根据当前页面路径，计算应该默认展开的目录
  useEffect(() => {
    const currentPath = location.pathname.startsWith('/')
      ? location.pathname.slice(1)
      : location.pathname;

    if (currentPath) {
      const pathParts = currentPath.split('/');
      const dirsToExpand = new Set<string>();

      // 展开当前文章所在的所有父目录
      let currentDir = '';
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentDir = currentDir ? `${currentDir}/${pathParts[i]}` : pathParts[i];
        dirsToExpand.add(currentDir);
      }

      setExpandedDirs(prev => {
        const newSet = new Set(prev);
        dirsToExpand.forEach(dir => newSet.add(dir));
        return newSet;
      });
    }
  }, [location.pathname]);

  // 切换目录展开/收起状态
  const toggleDirectory = (dirPath: string) => {
    setExpandedDirs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dirPath)) {
        newSet.delete(dirPath);
      } else {
        newSet.add(dirPath);
      }
      return newSet;
    });
  };

  // 根据节点和层级计算目录路径
  const getDirectoryPath = (node: TreeNode, level: number) => {
    // 使用节点的path属性，如果是目录的话已经包含完整路径
    return node.path || node.name;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">文章目录</h2>
      <div className="space-y-1">
        {tree.map((node, index) => (
          <DirectoryItem
            key={node.path || `root-${index}`}
            node={node}
            expandedDirs={expandedDirs}
            toggleDirectory={toggleDirectory}
            getDirectoryPath={getDirectoryPath}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
