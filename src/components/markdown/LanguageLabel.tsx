import { LANGUAGE_NAMES } from './constants';

interface LanguageLabelProps {
  language: string;
}

function LanguageLabel({ language }: LanguageLabelProps) {
  const displayName = LANGUAGE_NAMES[language.toLowerCase()] || language.toUpperCase();

  return (
    <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-black/20 text-gray-400 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
      {displayName}
    </span>
  );
}

export default LanguageLabel;