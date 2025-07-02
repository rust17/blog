import Sidebar from '../sidebar/Sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isVisible: boolean;
}

function MobileSidebar({ isOpen, onClose, isVisible }: MobileSidebarProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* 遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 抽屉 */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>
    </>
  );
}

export default MobileSidebar;