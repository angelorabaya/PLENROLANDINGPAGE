'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, AlertCircle, Trash2 } from 'lucide-react';

export default function OrdinanceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastQuery = useRef('');

  // Load chat history from localStorage on mount (U3)
  useEffect(() => {
    const savedHistory = localStorage.getItem('plenro-chat-history');
    const savedId = localStorage.getItem('plenro-conversation-id');
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
    if (savedId) {
      setConversationId(savedId);
    }
  }, []);

  // Save chat history to localStorage when changed (U3)
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('plenro-chat-history', JSON.stringify(chatHistory));
    } else {
      localStorage.removeItem('plenro-chat-history');
    }
  }, [chatHistory]);

  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('plenro-conversation-id', conversationId);
    } else {
      localStorage.removeItem('plenro-conversation-id');
    }
  }, [conversationId]);

  // FAB entrance and tooltip timers
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      return () => clearTimeout(tooltipTimer);
    }, 3500); // 3.5s delay before chat button appears

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom of chat history when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, loading, isOpen]);

  // Send message to Dify API proxy
  const sendMessageToAPI = async (textToSend: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, conversationId, website: honeypot }),
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      setChatHistory(prev => [...prev, { role: 'bot', text: data.answer || 'I am sorry, but I received an empty response.' }]);
    } catch (err) {
      console.error(err);
      setError('Connection trouble. Please check back in a moment.');
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble reaching the database right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    // Reject immediately if the honeypot field is filled (bot activity)
    if (honeypot) {
      setMessage('');
      setHoneypot('');
      return;
    }

    const queryToSend = message.trim();
    if (queryToSend.length > 500) {
      setError('Message cannot exceed 500 characters.');
      return;
    }

    setMessage('');
    lastQuery.current = queryToSend;

    // Add user message to history
    setChatHistory(prev => [...prev, { role: 'user', text: queryToSend }]);
    await sendMessageToAPI(queryToSend);
  };

  const handleSendSuggestion = async (suggestionText: string) => {
    if (loading) return;
    lastQuery.current = suggestionText;

    // Add user message to history
    setChatHistory(prev => [...prev, { role: 'user', text: suggestionText }]);
    await sendMessageToAPI(suggestionText);
  };

  const handleRetry = async () => {
    if (!lastQuery.current || loading) return;
    
    // Add user message again to show retry intent
    setChatHistory(prev => [...prev, { role: 'user', text: lastQuery.current }]);
    await sendMessageToAPI(lastQuery.current);
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setConversationId('');
    setError(null);
    localStorage.removeItem('plenro-chat-history');
    localStorage.removeItem('plenro-conversation-id');
  };
  return (
    <>
      {/* Backdrop Click Overlay (U2) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-xs cursor-pointer"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <div className="fixed bottom-6 right-6 z-50 font-sans pointer-events-none">
            <div className="pointer-events-auto relative">
              {/* Tooltip (A7) */}
              <AnimatePresence>
                {showTooltip && !isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-16 top-2.5 bg-gray-900 dark:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl border border-gray-850 dark:border-gray-700 whitespace-nowrap flex items-center gap-2"
                  >
                    <Sparkles size={14} className="text-amber-400 animate-pulse" />
                    <span>Need help? Ask PLENRO AI</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(false);
                      }}
                      className="text-gray-400 hover:text-white p-0.5 hover:bg-white/10 rounded transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 border-r border-t border-gray-800/80 dark:border-gray-700 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Trigger Button */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                onClick={() => {
                  setIsOpen(!isOpen);
                  setShowTooltip(false);
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer focus:outline-none"
                aria-label="Toggle chat assistant"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chat"
                      initial={{ rotate: 45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -45, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <MessageSquare size={24} />
                      {/* Pulse glow effect */}
                      <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping -z-10 group-hover:opacity-40 transition-opacity" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Chat Window Panel (U1: adaptive mobile sizes) */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute bottom-18 right-0 w-[90vw] sm:w-[400px] h-[500px] sm:h-[550px] max-h-[75vh] sm:max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-800 flex flex-col overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-4 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner relative">
                          <Bot size={22} className="text-white" />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm leading-tight flex items-center gap-1.5">
                            PLENRO AI Assistant
                            <Sparkles size={12} className="text-emerald-200 animate-pulse" />
                          </h4>
                          <p className="text-[11px] text-emerald-100/90 font-medium">Ordinance &amp; Regulations Expert</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {chatHistory.length > 0 && (
                          <button
                            onClick={handleClearChat}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Clear conversation"
                            aria-label="Clear conversation"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                          aria-label="Close chat"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/40">
                      {chatHistory.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-pulse">
                            <Bot size={24} />
                          </div>
                          <div>
                            <h5 className="font-display font-bold text-gray-800 dark:text-gray-200 text-sm">Welcome to PLENRO Support</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[240px] leading-relaxed font-medium mt-1">
                              Ask me anything about local town ordinances, environmental permits, and quarry regulations.
                            </p>
                          </div>
                          {/* Suggested Onboarding Questions (U5) */}
                          <div className="w-full max-w-[280px] space-y-2 pt-2">
                            {[
                              "How do I apply for a quarry permit?",
                              "What are the fines for excess loads?",
                              "Where is the PLENRO office located?"
                            ].map((suggestion, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handleSendSuggestion(suggestion)}
                                className="w-full text-left text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-gray-600 dark:text-gray-300 shadow-xs cursor-pointer"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {chatHistory.map((chat, idx) => (
                        <div
                          key={idx}
                          className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                              chat.role === 'user'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700/50'
                            }`}
                          >
                            <span className={`block text-[10px] uppercase tracking-wider mb-1 font-bold ${
                              chat.role === 'user' ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {chat.role === 'user' ? 'You' : 'Ordinance Assistant'}
                            </span>
                            <p className="whitespace-pre-line font-medium">{chat.text}</p>
                          </div>
                        </div>
                      ))}

                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl rounded-bl-none px-4 py-3 text-xs border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center gap-2">
                            <span className="flex gap-1 items-center justify-center">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                            <span className="italic font-semibold">Consulting legal framework...</span>
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="flex flex-col items-center gap-2 p-2">
                          <div className="bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 border border-red-500/20 font-semibold">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{error}</span>
                          </div>
                          {/* Retry trigger button (U9) */}
                          <button
                            type="button"
                            onClick={handleRetry}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline cursor-pointer focus:outline-none"
                          >
                            Try again
                          </button>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form Footer */}
                    <form onSubmit={handleSend} className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-2">
                      {/* Honeypot field (hidden visually and from assistive technologies) */}
                      <div className="absolute opacity-0 pointer-events-none -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="website"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about legal codes, fines..."
                        className="flex-grow bg-gray-50 dark:bg-gray-950 px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors font-medium"
                        disabled={loading}
                        maxLength={500}
                      />
                      <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2.5 rounded-xl hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:scale-100 disabled:shadow-none cursor-pointer flex items-center justify-center shrink-0"
                        aria-label="Send message"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
