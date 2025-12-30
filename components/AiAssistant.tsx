
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getShoppingAdvice } from '../services/geminiService';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Habari! I am the Crubs Concierge. Looking for premium medical gear in Nyahururu or shipping across Kenya?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const advice = await getShoppingAdvice(input, messages);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: advice }]);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-700 transition-all transform hover:scale-110 active:scale-95 group"
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark text-2xl"></i>
        ) : (
          <div className="relative">
            <i className="fa-solid fa-user-nurse text-2xl group-hover:animate-pulse"></i>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-300"></span>
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] h-[75vh] bg-white rounded-3xl shadow-[0_32px_128px_-32px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-inner">
              <i className="fa-solid fa-stethoscope text-white text-lg"></i>
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-none">Crubs Concierge</h3>
              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1">Medical Assistant</p>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-teal-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about scrubs, sizing, or bulk orders..."
                className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <i className="fa-solid fa-shield-heart text-teal-600"></i> HIPAA Compliant Tone
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <i className="fa-solid fa-truck text-teal-600"></i> G4S Delivery Info
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
