import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from './types';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import DocumentSelector from './components/DocumentSelector';
import 'highlight.js/styles/atom-one-dark.css';

const API_BASE_URL = 'http://localhost:8000';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-ai-message',
      text: 'Dobrý den! Jsem Váš AI asistent. Nejprve prosím vyberte dokumentaci ze seznamu nahoře, a pak se mě zeptejte na cokoli z této dokumentace.',
      sender: 'ai',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDocs, setAvailableDocs] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Načtení dostupných dokumentací při startu
  useEffect(() => {
    const fetchAvailableDocs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_tables`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();

        const docList = Array.isArray(data.tables) ? data.tables : data.tables || [];
        setAvailableDocs(docList);
      } catch (error) {
        console.error('Failed to fetch available documents:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `error-${Date.now()}`,
            text: 'Nepodařilo se načíst seznam dostupných dokumentací. Zkontrolujte prosím, zda server běží.',
            sender: 'ai',
          },
        ]);
      } finally {
        setIsLoadingDocs(false);
      }
    };

    fetchAvailableDocs();
  }, []);

  const handleDocChange = (doc: string) => {
    setSelectedDoc(doc);
    if (doc) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `system-${Date.now()}`,
          text: `Vybrali jste dokumentaci: **${doc}**. Nyní se mě můžete zeptat na cokoli z této dokumentace.`,
          sender: 'ai',
        },
      ]);
    }
  };

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (isLoading || !inputText.trim()) return;

    // Kontrola, zda je vybraná dokumentace
    if (!selectedDoc) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: `error-${Date.now()}`,
          text: 'Prosím nejprve vyberte dokumentaci ze seznamu nahoře.',
          sender: 'ai',
        },
      ]);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const aiMessagePlaceholder: Message = {
      id: `ai-${Date.now()}`,
      text: '',
      sender: 'ai',
    };
    setMessages((prevMessages) => [...prevMessages, aiMessagePlaceholder]);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: inputText,
          doc_name: selectedDoc,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponseText = data.response || 'Omlouvám se, došlo k chybě při zpracování vaší odpovědi.';
      
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessagePlaceholder.id ? { ...msg, text: aiResponseText } : msg
        )
      );
    } catch (error) {
      console.error('Failed to fetch from backend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Nepodařilo se navázat spojení se serverem. Zkuste to prosím později.';
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessagePlaceholder.id
            ? { ...msg, text: `Chyba: ${errorMessage}` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, selectedDoc]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <DocumentSelector
        selectedDoc={selectedDoc}
        onDocChange={handleDocChange}
        availableDocs={availableDocs}
        isLoading={isLoadingDocs}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={isLoading && message.sender === 'ai' && !message.text}
          />
        ))}
        <div ref={messagesEndRef} />
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
