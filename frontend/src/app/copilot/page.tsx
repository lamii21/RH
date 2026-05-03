"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your SmartHR Copilot. How can I assist you with your HR tasks today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const employeeId = localStorage.getItem('demoEmployeeId') || '1';
      const response = await api.post('/ai/copilot', {
        messages: [...messages, userMessage],
        employeeId: parseInt(employeeId)
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      console.error('Copilot error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      <div className="page-header flex justify-between items-center mb-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bot className="text-primary-color" />
            AI HR Copilot
          </h1>
          <p className="page-subtitle">Your intelligent assistant for HR policies and tasks.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800">
          <Sparkles size={14} />
          Powered by Gemini 2.0
        </div>
      </div>

      <div className="flex-1 overflow-y-auto card p-4 mb-4 flex flex-col gap-4 bg-gray-50/50 dark:bg-slate-900/50">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-primary-color text-white' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-primary-color" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-color text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-tl-none text-gray-800 dark:text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <Bot size={16} className="text-primary-color" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary-color" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Copilot is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 p-2 card shadow-lg dark:bg-slate-800 dark:border-slate-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about HR policies, leaves, or attendance..."
          className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-primary-color hover:bg-primary-hover text-white rounded-xl transition-all shadow-md disabled:opacity-50 disabled:shadow-none"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
