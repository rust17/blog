import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { buildDirectoryTree } from '../../services/postService';
import type { TreeNode } from '../../types/index';

export function useSidebarState() {
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
    return node.path || node.name;
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

  return {
    tree,
    expandedDirs,
    expandAll,
    collapseAll,
    allExpanded,
    toggleDirectory,
    getDirectoryPath,
  };
}