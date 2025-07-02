import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LanguageLabel from './LanguageLabel';
import CopyButton from './CopyButton';
import { CODE_HIGHLIGHTER_STYLE, LINE_NUMBER_STYLE, CODE_TAG_STYLE } from './constants';

interface CodeBlockProps {
  language: string;
  code: string;
  showLineNumbers?: boolean;
}

function CodeBlock({ language, code, showLineNumbers = true }: CodeBlockProps) {
  return (
    <div className="group relative mb-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
      <LanguageLabel language={language} />
      <CopyButton code={code} />
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        showLineNumbers={showLineNumbers}
        customStyle={CODE_HIGHLIGHTER_STYLE}
        lineNumberStyle={LINE_NUMBER_STYLE}
        codeTagProps={{ style: CODE_TAG_STYLE }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;