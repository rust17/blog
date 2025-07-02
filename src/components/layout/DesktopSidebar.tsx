import Sidebar from '../sidebar/Sidebar';

interface DesktopSidebarProps {
  sidebarWidth: number;
  isVisible: boolean;
}

function DesktopSidebar({ sidebarWidth, isVisible }: DesktopSidebarProps) {
  if (!isVisible) return null;

  return (
    <div
      className="bg-gray-50 border-r border-gray-200 dark:bg-slate-800 dark:border-slate-700 h-full overflow-hidden flex flex-col pb-4"
      style={{ width: `${sidebarWidth}px` }}
    >
      <Sidebar />
    </div>
  );
}

export default DesktopSidebar;