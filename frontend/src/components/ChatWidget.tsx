"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, MessageCircle, Sparkles, Loader2, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isPublicPage = pathname === '/' || pathname.startsWith('/careers') || pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const initialMsg = isPublicPage 
        ? "Bonjour ! Je suis l'assistant NEXUS. Comment puis-je vous renseigner sur Annassim 2 ou nos carrières ?" 
        : "Bonjour ! Je suis votre copilote RH NEXUS. Comment puis-je vous aider avec vos tâches aujourd'hui ?";
      setMessages([{ role: 'assistant', content: initialMsg }]);
    }
  }, [isOpen, isPublicPage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const endpoint = isPublicPage ? '/ai/public/chat' : '/ai/copilot';
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
      
      const res = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(isPublicPage ? {} : { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          employeeId: !isPublicPage ? 1 : null // Mock ID for internal chat
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai rencontré une erreur. Réessayez plus tard." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-6 w-[380px] h-[550px] bg-white rounded-[32px] shadow-2xl border border-brand-stone overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-brand-green text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/20">
                  <Bot size={20} className="text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">NEXUS AI</h3>
                  <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={10} /> {isPublicPage ? 'Mode Public' : 'Assistant RH'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-stone/10">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      msg.role === 'user' ? 'bg-brand-gold text-brand-green' : 'bg-white border border-brand-stone text-brand-green'
                    }`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-brand-green text-white rounded-tr-none shadow-lg' 
                        : 'bg-white border border-brand-stone text-brand-dark rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-brand-stone flex items-center justify-center shadow-sm">
                      <Bot size={14} className="text-brand-green" />
                    </div>
                    <div className="p-4 bg-white border border-brand-stone rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-brand-gold" />
                      <span className="text-xs font-black text-brand-green/40 uppercase tracking-widest">Réflexion...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-brand-stone flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-3 bg-brand-stone/30 rounded-xl border-none focus:ring-1 focus:ring-brand-gold text-sm font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 bg-brand-green text-brand-gold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-green rounded-full shadow-2xl flex items-center justify-center text-brand-gold relative group border-4 border-white"
      >
        <div className="absolute inset-0 bg-brand-gold rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
        {isOpen ? <X size={24} className="relative z-10" /> : <MessageCircle size={28} className="relative z-10" />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
