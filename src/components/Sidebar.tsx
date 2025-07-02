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
          className={`flex items-center p-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors ${indentClass}`}
          onClick={() => toggleDirectory(directoryPath)}
        >
          <span className="mr-1">
            {isExpanded ? '📂' : '📁'}
          </span>
          <span className="mr-1">
            {isExpanded ? '▼' : '▶'}
          </span>
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
          <span className="mr-1">📄</span>
          {node.name}
        </Link>
      </div>
    );
  }
}

function Sidebar() {
  usePosts(); // 确保posts已加载
  const tree = buildDirectoryTree();
  const location = useLocation();

  // 状态：已展开的目录列表
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // 获取所有目录路径的函数
  const getAllDirectoryPaths = (nodes: TreeNode[], currentPath = ''): string[] => {
    const paths: string[] = [];

    nodes.forEach(node => {
      if (node.isDirectory) {
        const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;
        paths.push(fullPath);

        if (node.children) {
          paths.push(...getAllDirectoryPaths(node.children, fullPath));
        }
      }
    });

    return paths;
  };

  // 展开所有目录
  const expandAll = () => {
    const allPaths = getAllDirectoryPaths(tree);
    setExpandedDirs(new Set(allPaths));
  };

  // 折叠所有目录
  const collapseAll = () => {
    setExpandedDirs(new Set());
  };

  // 判断是否所有目录都已展开
  const allExpanded = () => {
    const allPaths = getAllDirectoryPaths(tree);
    return allPaths.length > 0 && allPaths.every(path => expandedDirs.has(path));
  };

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
  const getDirectoryPath = (node: TreeNode) => {
    // 使用节点的path属性，如果是目录的话已经包含完整路径
    return node.path || node.name;
  };

  return (
    <div className="h-full flex flex-col">
      {/* 固定标题 */}
      <div className="p-4 pb-2 flex-shrink-0 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">文章目录</h2>

        {/* 折叠/展开全部按钮 */}
        <button
          onClick={allExpanded() ? collapseAll : expandAll}
          className="p-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
          title={allExpanded() ? "折叠全部" : "展开全部"}
        >
          {allExpanded() ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
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
    </div>
  );
}

export default Sidebar;
