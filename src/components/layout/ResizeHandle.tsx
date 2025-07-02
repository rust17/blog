interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isVisible: boolean;
}

function ResizeHandle({ onMouseDown, isVisible }: ResizeHandleProps) {
  if (!isVisible) return null;

  return (
    <div
      className="w-0.5 bg-gray-200 dark:bg-slate-700 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors"
      onMouseDown={onMouseDown}
    />
  );
}

export default ResizeHandle;
