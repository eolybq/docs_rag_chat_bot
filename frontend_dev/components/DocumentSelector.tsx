import React from 'react';

interface DocumentSelectorProps {
  selectedDoc: string;
  onDocChange: (doc: string) => void;
  availableDocs;
  isLoading: boolean;
}

const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
  </svg>
);

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  selectedDoc,
  onDocChange,
  availableDocs,
  isLoading,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-3 shadow-md">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <DocumentIcon className="w-5 h-5 text-sky-400 flex-shrink-0" />
        <label htmlFor="doc-select" className="text-sm font-medium text-gray-300 flex-shrink-0">
          Dokumentace:
        </label>
        <select
          id="doc-select"
          value={selectedDoc}
          onChange={(e) => onDocChange(e.target.value)}
          disabled={isLoading || availableDocs.length === 0}
          className="flex-1 p-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {availableDocs.length === 0 ? (
            <option value="">Načítání...</option>
          ) : (
            <>
              <option value="">-- Vyberte dokumentaci --</option>
              {availableDocs.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
    </div>
  );
};

export default DocumentSelector;
