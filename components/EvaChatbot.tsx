'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FiSend,
  FiMinus,
  FiX,
  FiMessageCircle,
  FiMapPin,
  FiLoader,
} from 'react-icons/fi';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi, I'm Eva — your AI travel assistant! I can recommend destinations, plan itineraries, share travel tips, and help you explore Tripnowa. Where would you like to go?",
  suggestions: [
    'Recommend destinations',
    'Show trending places',
    'Plan a 3-day itinerary',
    'Travel tips',
  ],
};

function renderMessageContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part.split('\n').map((line, lineIndex) => (
      <span key={`${index}-${lineIndex}`}>
        {lineIndex > 0 && <br />}
        {line}
      </span>
    ));
  });
}

export default function EvaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsOpen(true);
    setIsMinimized(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        suggestions: data.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
          suggestions: ['Recommend destinations', 'Show trending places'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowPulse(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end gap-3">
      {isOpen && !isMinimized && (
        <div
          className="flex flex-col overflow-hidden animate-fade-up
            w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px]
            h-[min(560px,calc(100vh-6rem))] sm:h-[520px]
            rounded-2xl sm:rounded-3xl
            bg-[#111]/95 backdrop-blur-2xl
            border border-white/10 shadow-2xl shadow-blue-500/10"
          role="dialog"
          aria-label="Eva travel chatbot"
        >
          {/* Header */}
          <div className="relative px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm sm:text-base">E</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#111]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">Eva</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    AI Travel Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleMinimize}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Minimize chat"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 space-y-4 scrollbar-hide">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-md'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs text-purple-300">
                      <FiMapPin className="w-3 h-3" />
                      <span>Eva</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{renderMessageContent(message.content)}</div>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-white/10">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => sendMessage(suggestion)}
                          disabled={isLoading}
                          className="px-2.5 py-1 text-xs rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiLoader className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Eva is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 border-t border-white/10 bg-[#0f0f0f]/80"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Eva about travel..."
                disabled={isLoading}
                maxLength={500}
                className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                aria-label="Send message"
              >
                <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-2 text-center">
              Powered by Tripnowa AI • Ask about destinations, tips & itineraries
            </p>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={handleOpen}
          className="group relative flex items-center gap-2 sm:gap-3 pl-3 pr-4 sm:pl-4 sm:pr-5 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
          aria-label="Open Eva chatbot"
        >
          {showPulse && (
            <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20" />
          )}

          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
            <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="relative text-left hidden sm:block">
            <span className="block text-sm font-semibold leading-tight">Chat with Eva</span>
            <span className="block text-[11px] text-white/70">AI Travel Assistant</span>
          </div>

          <span className="relative sm:hidden text-sm font-semibold">Eva</span>
        </button>
      )}
    </div>
  );
}
