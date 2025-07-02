import LanguageLabel from './LanguageLabel';
import CopyButton from './CopyButton';

interface PlainCodeBlockProps {
  code: string;
  children: React.ReactNode;
}

function PlainCodeBlock({ code, children }: PlainCodeBlockProps) {
  return (
    <div className="group relative mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
      <LanguageLabel language="text" />
      <CopyButton code={code} />
      <pre className="p-4 text-sm font-mono max-h-96 overflow-y-auto pt-12">
        {children}
      </pre>
    </div>
  );
}

export default PlainCodeBlock;