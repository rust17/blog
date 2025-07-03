import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 自定义Hook：处理GitHub Pages SPA路由重定向
 * 当用户直接访问子路由时，GitHub Pages会显示404页面
 * 404页面会将路径保存到sessionStorage并重定向到根路径
 * 这个Hook会检查sessionStorage中的路径并进行相应的路由跳转
 */
export function useRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查是否有从404页面重定向过来的路径
    const redirectPath = sessionStorage.getItem('redirectPath');

    if (redirectPath) {
      // 清除sessionStorage中的路径信息
      sessionStorage.removeItem('redirectPath');

      // 跳转到正确的路径
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);
}
