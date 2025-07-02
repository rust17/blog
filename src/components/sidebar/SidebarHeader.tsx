interface SidebarHeaderProps {
  allExpanded: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

function SidebarHeader({ allExpanded, onExpandAll, onCollapseAll }: SidebarHeaderProps) {
  const handleToggle = () => {
    if (allExpanded) {
      onCollapseAll();
    } else {
      onExpandAll();
    }
  };

  return (
    <div className="p-3 md:p-4 pb-2 flex-shrink-0 flex items-center justify-between">
      <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white"></h2>

      {/* 折叠/展开全部按钮 - 移动端优化 */}
      <button
        onClick={handleToggle}
        className="p-2 md:p-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center"
        title={allExpanded ? "折叠全部" : "展开全部"}
      >
        {allExpanded ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default SidebarHeader;
