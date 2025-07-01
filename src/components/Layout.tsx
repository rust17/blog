import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex h-screen">
      {/* 侧边栏容器 */}
      <div className="w-64 bg-gray-50 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* 主内容容器 */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
