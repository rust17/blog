// 语言名称映射，用于显示更友好的名称
export const LANGUAGE_NAMES: { [key: string]: string } = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'bash': 'Bash',
  'shell': 'Shell',
  'yaml': 'YAML',
  'json': 'JSON',
  'html': 'HTML',
  'css': 'CSS',
  'jsx': 'JSX',
  'tsx': 'TSX',
  'java': 'Java',
  'cpp': 'C++',
  'c': 'C',
  'go': 'Go',
  'rust': 'Rust',
  'php': 'PHP',
  'ruby': 'Ruby',
  'sql': 'SQL',
  'markdown': 'Markdown',
  'text': 'Text',
};

// 代码高亮器的自定义样式配置
export const CODE_HIGHLIGHTER_STYLE = {
  margin: 0,
  borderRadius: 0,
  fontSize: '14px',
  lineHeight: '1.5',
  maxHeight: '500px', // 最大高度，超过后显示滚动条
  overflow: 'auto',
  paddingTop: '2.5rem', // 为复制按钮留出空间
} as const;

// 行号样式配置
export const LINE_NUMBER_STYLE = {
  minWidth: '3em',
  paddingRight: '1em',
  color: '#6e7681',
  backgroundColor: 'transparent',
  borderRight: '1px solid #30363d',
  marginRight: '1em',
} as const;

// 代码标签样式配置
export const CODE_TAG_STYLE = {
  fontSize: '14px',
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
} as const;