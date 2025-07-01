import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

function Layout() {
  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* 侧边栏容器 */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 dark:bg-slate-800 dark:border-slate-700">
        <Sidebar />
      </div>

      {/* 主内容容器 */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* 顶部栏 */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-4 flex justify-end">
          <ThemeToggle />
        </div>

        {/* 页面内容 */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
