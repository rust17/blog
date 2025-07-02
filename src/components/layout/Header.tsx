import ThemeToggle from '../ThemeToggle';

interface HeaderProps {
  title: string;
  isMobile: boolean;
  onMenuToggle: () => void;
}

function Header({ title, isMobile, onMenuToggle }: HeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-3 md:p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        {/* 移动端汉堡菜单按钮 */}
        {isMobile && (
          <button
            onClick={onMenuToggle}
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
          {title}
        </h2>
      </div>

      <ThemeToggle />
    </div>
  );
}

export default Header;