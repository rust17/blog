import { Outlet, useLocation } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import ThemeToggle from './ThemeToggle';
import { usePosts } from '../contexts/PostContext';

function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState(256); // 默认宽度 256px (w-64)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const posts = usePosts();

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md 断点
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false); // 桌面端自动关闭移动菜单
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 移动端路由变化时关闭菜单
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* 桌面端侧边栏 */}
      <div
        className={`${
          isMobile ? 'hidden' : 'block'
        } bg-gray-50 border-r border-gray-200 dark:bg-slate-800 dark:border-slate-700 h-full overflow-hidden flex flex-col pb-4`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar />
      </div>

      {/* 桌面端拖拽手柄 */}
      {!isMobile && (
        <div
          className="w-0.5 bg-gray-200 dark:bg-slate-700 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />
      )}

      {/* 移动端侧边栏遮罩 */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 移动端侧边栏抽屉 */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar />
        </div>
      )}

      {/* 主内容容器 */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* 顶部栏 */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-3 md:p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* 移动端汉堡菜单按钮 */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors md:hidden"
                aria-label="打开菜单"
              >
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
              {getCurrentPageTitle()}
            </h2>
          </div>

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
