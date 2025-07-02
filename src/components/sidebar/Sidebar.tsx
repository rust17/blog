import { usePosts } from '../../contexts/PostContext';
import { useSidebarState } from './useSidebarState';
import SidebarHeader from './SidebarHeader';
import DirectoryItem from './DirectoryItem';

function Sidebar() {
  usePosts(); // 确保posts已加载

  const {
    tree,
    expandedDirs,
    expandAll,
    collapseAll,
    allExpanded,
    toggleDirectory,
    getDirectoryPath,
  } = useSidebarState();

  return (
    <div className="h-full flex flex-col">
      {/* 固定标题 */}
      <SidebarHeader
        allExpanded={allExpanded()}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-1">
          {tree.map((node, index) => (
            <DirectoryItem
              key={node.path || `root-${index}`}
              node={node}
              expandedDirs={expandedDirs}
              toggleDirectory={toggleDirectory}
              getDirectoryPath={getDirectoryPath}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
