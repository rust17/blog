import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex h-screen">
      {/* 侧边栏容器 */}
      <div className="w-64 bg-gray-50 border-r border-gray-200">
        {/* 侧边栏内容将在后续任务中添加 */}
      </div>

      {/* 主内容容器 */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;