import { Outlet } from 'react-router-dom';
import { useResponsive, useSidebarWidth, useMobileMenu, usePageTitle, useScrollToTop } from '../hooks';
import { DesktopSidebar, MobileSidebar, ResizeHandle, Header } from './layout';

function Layout() {
  const isMobile = useResponsive();
  const { sidebarWidth, handleMouseDown } = useSidebarWidth();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu(isMobile);
  const pageTitle = usePageTitle();

  // 添加滚动到顶部的功能
  useScrollToTop();

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* 桌面端侧边栏 */}
      <DesktopSidebar
        sidebarWidth={sidebarWidth}
        isVisible={!isMobile}
      />

      {/* 桌面端拖拽手柄 */}
      <ResizeHandle
        onMouseDown={handleMouseDown}
        isVisible={!isMobile}
      />

      {/* 移动端侧边栏 */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isVisible={isMobile}
      />

      {/* 主内容容器 */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* 顶部栏 */}
        <Header
          title={pageTitle}
          isMobile={isMobile}
          onMenuToggle={toggleMobileMenu}
        />

        {/* 页面内容 */}
        <div id="main-content" className="flex-1 overflow-auto pb-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
