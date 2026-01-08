
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-slate-900 text-slate-300 p-4 text-sm font-mono leading-relaxed">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto">
        <code>{code}</code>
      </pre>
      <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 uppercase font-sans">
        {language}
      </div>
    </div>
  );
};

export default CodeBlock;
