import type { Components } from 'react-markdown';
import CodeBlock from './CodeBlock';
import PlainCodeBlock from './PlainCodeBlock';

export const markdownComponents: Components = {
  // 标题组件
  h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,

  // 段落和列表
  p: ({ children }) => <p className="mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="ml-4">{children}</li>,

  // 处理代码块（pre + code 组合）
  pre: ({ children }) => {
    // 检查是否包含 code 元素
    if (children && typeof children === 'object' && 'props' in children) {
      const codeElement = children as any;
      const className = codeElement.props?.className || '';
      const match = /language-(\w+)/.exec(className);
      const language = match ? match[1] : 'text';
      const codeContent = String(codeElement.props?.children || '').replace(/\n$/, '');

      return <CodeBlock language={language} code={codeContent} />;
    }

    // 如果不是标准的代码块结构，使用普通代码块
    const codeContent = String(children || '');
    return <PlainCodeBlock code={codeContent}>{children}</PlainCodeBlock>;
  },

  // 内联代码
  code: ({ children }) => (
    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),

  // 链接
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
    >
      {children}
    </a>
  ),
};