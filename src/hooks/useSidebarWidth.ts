import { useState, useCallback } from 'react';

export function useSidebarWidth(initialWidth = 256) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);

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

  return {
    sidebarWidth,
    handleMouseDown,
  };
}