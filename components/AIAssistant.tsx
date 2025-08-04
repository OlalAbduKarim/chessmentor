
import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, SendIcon, CloseIcon, LoadingSpinner } from './icons/Icons';
import { Button } from './common/Button';
import { getAIResponseStream } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AIAssistantProps {
  lessonTitle: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ lessonTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessage: Message = { sender: 'ai', text: '' };
    setMessages(prev => [...prev, aiMessage]);
    
    try {
        const stream = await getAIResponseStream(lessonTitle, input);
        
        let currentText = '';
        for await (const chunk of stream) {
            currentText += chunk.text;
            setMessages(prev => prev.map((msg, index) => 
                index === prev.length - 1 ? { ...msg, text: currentText } : msg
            ));
        }
    } catch (error) {
        setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 ? { ...msg, text: 'Sorry, I encountered an error. Please try again.' } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-transform hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <SparklesIcon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-light-surface dark:bg-dark-surface rounded-xl shadow-2xl border border-light-border dark:border-dark-border flex flex-col z-50">
      <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-6 w-6 text-brand-primary" />
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">AI Lesson Assistant</h3>
        </div>
        <Button variant="ghost" size-sm="true" onClick={() => setIsOpen(false)} aria-label="Close AI Assistant">
          <CloseIcon className="h-5 w-5" />
        </Button>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
           <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                Hi! I'm your AI assistant. Ask me anything about "{lessonTitle}".
            </div>
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-dark-border text-light-text-primary dark:text-dark-text-primary'}`}>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.sender === 'ai' && (
             <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-200 dark:bg-dark-border text-light-text-primary dark:text-dark-text-primary">
                  <div className="flex items-center gap-2">
                      <LoadingSpinner className="w-4 h-4 animate-spin"/>
                      <span>Thinking...</span>
                  </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-4 border-t border-light-border dark:border-dark-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-gray-100 dark:bg-gray-900 border border-light-border dark:border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-light-text-primary dark:text-dark-text-primary"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || input.trim() === ''}>
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};
