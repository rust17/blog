import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 自定义Hook：路由跳转时自动滚动到页面顶部
 * 解决SPA中路由切换时保持滚动位置的问题
 */
export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // 延迟执行，确保新页面内容已经渲染
    const timer = setTimeout(() => {
      // 尝试滚动主内容区域（优先级更高）
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      } else {
        // 降级方案：滚动整个window
        window.scrollTo(0, 0);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]); // 只在路径变化时触发
}
