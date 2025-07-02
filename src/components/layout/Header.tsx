import ThemeToggle from '../ThemeToggle';

interface HeaderProps {
  title: string;
  isMobile: boolean;
  onMenuToggle: () => void;
}

function Header({ title, isMobile, onMenuToggle }: HeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-3 md:p-4 flex items-center relative">
      {/* 移动端汉堡菜单按钮 - 绝对定位到左侧 */}
      {isMobile && (
        <button
          onClick={onMenuToggle}
          className="absolute left-3 md:left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors md:hidden"
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

      {/* 居中的标题 */}
      <h2 className="flex-1 text-lg md:text-2xl font-bold text-gray-900 dark:text-white text-center truncate px-12 md:px-16">
        {title}
      </h2>

      {/* 主题切换按钮 - 绝对定位到右侧 */}
      <div className="absolute right-3 md:right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Header;