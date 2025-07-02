import { Outlet, useLocation } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Sidebar from './sidebar/Sidebar';
import ThemeToggle from './ThemeToggle';
import { usePosts } from '../contexts/PostContext';

function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState(256); // 默认宽度 256px (w-64)
  const location = useLocation();
  const posts = usePosts();

  // 获取当前页面标题
  const getCurrentPageTitle = () => {
    const articlePath = location.pathname.startsWith('/')
      ? location.pathname.slice(1)
      : location.pathname;

    if (articlePath === '' || articlePath === '/') {
      return '我的博客';
    }

    const currentPost = posts.find(post => post.path === articlePath);
    return currentPost?.frontmatter.title || '无标题';
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      // 限制宽度在 200px 到 500px 之间
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* 侧边栏容器 */}
      <div
        className="bg-gray-50 border-r border-gray-200 dark:bg-slate-800 dark:border-slate-700 h-full overflow-hidden flex flex-col pb-4 pt-4"
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar />
      </div>

      {/* 拖拽手柄 */}
      <div
        className="w-0.5 bg-gray-200 dark:bg-slate-700 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown}
      />

      {/* 主内容容器 */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* 顶部栏 */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getCurrentPageTitle()}
          </h2>
          <ThemeToggle />
        </div>

        {/* 页面内容 */}
        <div className="flex-1 overflow-auto pb-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
