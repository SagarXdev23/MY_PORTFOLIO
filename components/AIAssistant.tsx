'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  "What projects has Sagar built?",
  "Tell me about the QuickBite app",
  "What certifications does Sagar hold?",
  "What is Sagar's educational background?",
  "What are Sagar's core skills?"
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I am Sagar's AI assistant powered by DeepSeek. Ask me anything about Sagar's work, technical skills, projects, or certifications! How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unread, setUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnread(false);
    }
  }, [messages, isOpen]);

  // Alert user once about the chat assistant
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setUnread(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history to send
      const history = [...messages, userMsg].map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || 'I encountered an error retrieving a response.'
      }]);
    } catch (error) {
      console.error('Error fetching chat completion:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I am facing an issue connecting to my brain server right now. Feel free to contact Sagar directly at sagar.mishra_cs23@gla.ac.in!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnread(false);
  };

  return (
    <div className="position-fixed" style={{ zIndex: 1000, bottom: '24px', right: '24px' }}>
      {/* Chat Button Toggle */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="btn d-flex align-items-center justify-content-center position-relative border-0"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
            color: '#fff',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }}
        >
          <MessageSquare size={26} />
          {unread && (
            <span 
              className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
              style={{
                animation: 'pulse 1.5s infinite',
                boxShadow: '0 0 10px rgba(220, 53, 69, 0.8)'
              }}
            />
          )}
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          className="glass-panel d-flex flex-column"
          style={{
            width: '380px',
            height: '520px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 100px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div 
            className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom"
            style={{
              background: 'rgba(13, 20, 38, 0.7)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <div 
                className="d-flex align-items-center justify-content-center bg-success bg-opacity-20 text-success rounded-circle"
                style={{ width: '36px', height: '36px' }}
              >
                <Bot size={20} className="text-success" />
              </div>
              <div>
                <h6 className="m-0 fw-bold d-flex align-items-center gap-1">
                  Sagar's Assistant <Sparkles size={12} className="text-success animate-pulse-slow" />
                </h6>
                <span className="text-success" style={{ fontSize: '10px' }}>Powered by DeepSeek AI</span>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="btn btn-sm btn-link text-white text-opacity-50 hover:text-white p-0 border-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            className="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-3"
            style={{ background: 'rgba(5, 7, 18, 0.3)' }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`d-flex gap-2 max-w-85 ${msg.role === 'user' ? 'align-self-end flex-row-reverse' : 'align-self-start'}`}
              >
                <div 
                  className={`d-flex align-items-center justify-content-center rounded-circle flex-shrink-0`}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: msg.role === 'user' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: msg.role === 'user' ? '#06b6d4' : '#10b981'
                  }}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div 
                  className="px-3 py-2 rounded-3 text-white text-opacity-95"
                  style={{
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)' 
                      : 'rgba(13, 20, 38, 0.8)',
                    border: '1px solid',
                    borderColor: msg.role === 'user' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="d-flex gap-2 align-self-start">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ width: '28px', height: '28px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
                >
                  <Bot size={14} />
                </div>
                <div 
                  className="px-3 py-2 rounded-3"
                  style={{ background: 'rgba(13, 20, 38, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="d-flex gap-1 align-items-center py-1">
                    <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '6px', height: '6px', animationDelay: '0s' }} />
                    <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '6px', height: '6px', animationDelay: '0.2s' }} />
                    <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '6px', height: '6px', animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions List (only shown when not loading and input is empty) */}
          {!isLoading && inputValue.trim() === '' && (
            <div 
              className="px-3 py-2 overflow-x-auto d-flex gap-2"
              style={{
                background: 'rgba(5, 7, 18, 0.5)',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none', // Hide scrollbar for clean carousel look
                msOverflowStyle: 'none'
              }}
            >
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug)}
                  className="btn btn-sm text-white text-opacity-80 py-1 px-2 border rounded-pill"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    fontSize: '11px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'hsl(var(--primary))';
                    e.currentTarget.style.color = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input form */}
          <form 
            onSubmit={handleFormSubmit}
            className="p-3 border-top d-flex gap-2"
            style={{
              background: 'rgba(13, 20, 38, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me something about Sagar..."
              disabled={isLoading}
              className="form-control text-white bg-dark bg-opacity-40 border-secondary-subtle"
              style={{
                fontSize: '13px',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="btn btn-success d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '38px',
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
