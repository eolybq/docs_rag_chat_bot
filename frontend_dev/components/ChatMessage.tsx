import React from 'react'; // Odebrán useState
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
// Import stylů pro syntax highlighting (nutné pro barvy kódu)
import 'highlight.js/styles/atom-one-dark.css'; 

import { Message } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ChatMessageProps {
  message: Message;
  isLoading: boolean;
}

// --- IKONY PRO KOPÍROVÁNÍ BYLY ODSTRANĚNY ---


// --- KOMPONENTA PRO VYKRESLENÍ KÓDOVÉHO BLOKU (nahrazuje CodeBlock) ---
const PreBlock: React.FC<React.HTMLProps<HTMLPreElement>> = ({ children, className, ...props }) => {
    
    // Detekce, zda se jedná o kódový blok s definovaným jazykem (ne output bez jazyka)
    const isCodeBlock = className && className.includes('language-'); 
    
    // Styling: Tmavé pozadí pro všechny bloky, ale mírně světlejší pro output
    const backgroundClass = isCodeBlock ? 'bg-gray-800' : 'bg-gray-600/50';

    return (
        // Standardní obal pro <pre>
        <div className="my-4"> 
            {/* Vykreslení samotného bloku kódu (<pre>) */}
            <pre className={`p-4 rounded-lg overflow-x-auto ${backgroundClass} ${className || ''}`} {...props}>
                {children}
            </pre>
        </div>
    );
};
// --- KONEC KOMPONENTY PRO BLOK ---


// --- IKONY UŽIVATELE A AI (BEZE ZMĚN) ---
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

const AiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.25 7.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM8.25 4.5a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z" clipRule="evenodd" />
    <path d="M3 13.5a.75.75 0 0 0-1.5 0v2.625a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v2.625a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V13.5Z" />
  </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
  const isUser = message.sender === 'user';

  const messageClasses = `flex items-start gap-3 max-w-xl md:max-w-2xl lg:max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`;
  const bubbleClasses = `p-4 rounded-2xl ${isUser ? 'bg-sky-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`;

  return (
    <div className={messageClasses}>
      {isUser ? <UserIcon className="w-6 h-6 text-white" /> : <AiIcon className="w-6 h-6 text-white" />}
      <div className={bubbleClasses}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Používáme novou komponentu PreBlock pro <pre>
                pre: PreBlock, 

                // Vlastní vykreslování in-line kódu
                code: ({ children, className, ...props }) => {
                  // Pokud existuje className, jedná se o kódový blok (ten stylován komponentou <pre>)
                  if (className) {
                    return <code className={className} {...props}>{children}</code>;
                  }
                  
                  // In-line kód (např. 'dim(df)') – přidáme viditelné pozadí
                  return (
                    <code 
                      className="px-1 py-0.5 rounded text-pink-300 bg-gray-800 font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                // Vlastní vykreslování tabulky
                table: ({ children }) => (
                  <table className="table-auto w-full text-left border-collapse border border-gray-600 my-4">
                    {children}
                  </table>
                ),
                th: ({ children }) => (
                  <th className="p-2 border border-gray-600 bg-gray-600 text-white font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="p-2 border border-gray-600">
                    {children}
                  </td>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;