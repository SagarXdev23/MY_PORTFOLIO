'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, RefreshCw, Eye, MessageSquare, Clock, ArrowLeft, Search, 
  Trash2, Database, ShieldAlert, CheckCircle2 
} from 'lucide-react';

interface ChatLog {
  timestamp: string;
  user: string;
  bot: string;
}

interface ContactLog {
  timestamp: string;
  name: string;
  email: string;
  message: string;
}

interface AdminDashboardClientProps {
  chatLogs: ChatLog[];
  contactLogs: ContactLog[];
}

export default function AdminDashboardClient({ chatLogs: initialChatLogs, contactLogs: initialContactLogs }: AdminDashboardClientProps) {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>(initialChatLogs);
  const [contactLogs, setContactLogs] = useState<ContactLog[]>(initialContactLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'contact'>('chat');
  const [loadingCache, setLoadingCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  // Filter chat logs based on search query
  const filteredChatLogs = chatLogs.filter(log => 
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.bot.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter contact logs based on search query
  const filteredContactLogs = contactLogs.filter(log => 
    log.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleClearCache = async () => {
    setLoadingCache(true);
    setCacheMessage(null);
    try {
      const res = await fetch('/api/admin/clear-cache', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setCacheMessage({ type: 'success', text: 'GitHub cache has been successfully refreshed!' });
      } else {
        setCacheMessage({ type: 'error', text: data.error || 'Failed to refresh cache.' });
      }
    } catch (err) {
      setCacheMessage({ type: 'error', text: 'An error occurred while clearing cache.' });
    } finally {
      setLoadingCache(false);
    }
  };

  // Helper to format date nicely
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container py-5">
      {/* Dashboard Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5 pb-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <h2 className="fw-bold text-white m-0 d-flex align-items-center gap-2">
            <Database className="text-success" size={28} /> Admin Control Dashboard
          </h2>
          <p className="text-white text-opacity-50 m-0 mt-1" style={{ fontSize: '14px' }}>
            Manage portfolio cache, sync real-time API integrations, and review visitor AI logs.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2.5">
          <a 
            href="/"
            className="btn btn-outline-light d-flex align-items-center gap-1.5 px-3 py-2 border-secondary border-opacity-30 hover:bg-white hover:bg-opacity-5"
            style={{ borderRadius: '8px', fontSize: '13px' }}
          >
            <ArrowLeft size={16} /> View Portfolio
          </a>
          <button 
            onClick={handleLogout}
            className="btn btn-danger d-flex align-items-center gap-1.5 px-3 py-2 text-white bg-danger bg-opacity-20 border border-danger border-opacity-20 hover:bg-danger hover:bg-opacity-30"
            style={{ borderRadius: '8px', fontSize: '13px' }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Controls */}
        <div className="col-lg-4">
          <h5 className="fw-bold text-white mb-3">System Actions</h5>
          
          <div className="glass-panel p-4 border-0 mb-4 d-flex flex-column gap-4">
            {/* Cache Control */}
            <div>
              <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-1.5" style={{ fontSize: '14px' }}>
                GitHub Integration Cache
              </h6>
              <p className="text-white text-opacity-60 mb-3" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                GitHub repository data (stars, forks, and readmes) is cached locally for 5 minutes. Clear cache to force a fresh fetch from the GitHub API.
              </p>
              
              {cacheMessage && (
                <div 
                  className={`alert ${cacheMessage.type === 'success' ? 'alert-success text-success bg-success' : 'alert-danger text-danger bg-danger'} bg-opacity-10 border-0 py-2 px-3 mb-3 d-flex align-items-center gap-2`}
                  style={{ fontSize: '12px', borderRadius: '8px' }}
                >
                  {cacheMessage.type === 'success' ? <CheckCircle2 size={15} /> : <ShieldAlert size={15} />}
                  <div>{cacheMessage.text}</div>
                </div>
              )}

              <button
                onClick={handleClearCache}
                disabled={loadingCache}
                className="btn btn-success btn-sm w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5 text-black border-0"
                style={{
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)'
                }}
              >
                <RefreshCw size={14} className={loadingCache ? 'animate-spin' : ''} />
                Force Sync GitHub Data
              </button>
            </div>
            
            {/* Stats Summary */}
            <div className="border-top pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h6 className="fw-bold text-white mb-3" style={{ fontSize: '14px' }}>
                Activity Summary
              </h6>
              <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '13px' }}>
                <span className="text-white text-opacity-60">AI Chat Queries:</span>
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-15">{chatLogs.length}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '13px' }}>
                <span className="text-white text-opacity-60">Contact Form Messages:</span>
                <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-15">{contactLogs.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Log Tabs and Items List */}
        <div className="col-lg-8">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
            {/* Tab Toggles */}
            <div className="d-flex gap-2">
              <button 
                onClick={() => { setActiveTab('chat'); setSearchQuery(''); }}
                className={`btn btn-sm py-2 px-3 fw-bold d-flex align-items-center gap-1.5 ${activeTab === 'chat' ? 'btn-success text-black' : 'btn-outline-light text-white text-opacity-75 border-secondary border-opacity-20 hover:bg-white hover:bg-opacity-5'}`}
                style={{ borderRadius: '6px', fontSize: '12.5px' }}
              >
                <MessageSquare size={14} /> AI Conversations ({filteredChatLogs.length})
              </button>
              <button 
                onClick={() => { setActiveTab('contact'); setSearchQuery(''); }}
                className={`btn btn-sm py-2 px-3 fw-bold d-flex align-items-center gap-1.5 ${activeTab === 'contact' ? 'btn-success text-black' : 'btn-outline-light text-white text-opacity-75 border-secondary border-opacity-20 hover:bg-white hover:bg-opacity-5'}`}
                style={{ borderRadius: '6px', fontSize: '12.5px' }}
              >
                <Database size={14} /> Contact Messages ({filteredContactLogs.length})
              </button>
            </div>
            
            {/* Filter Search Input */}
            <div className="position-relative w-100 w-sm-auto">
              <input
                type="text"
                placeholder={activeTab === 'chat' ? "Filter AI conversations..." : "Filter contact messages..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control text-white bg-dark bg-opacity-40 border-secondary-subtle px-3 py-1.5 ps-5"
                style={{ fontSize: '12px', minWidth: '240px', borderRadius: '6px' }}
              />
              <Search className="position-absolute text-white text-opacity-45 top-50 start-0 translate-middle-y ms-3" size={13} />
            </div>
          </div>

          {/* AI Conversations Tab Content */}
          {activeTab === 'chat' && (
            filteredChatLogs.length === 0 ? (
              <div className="text-center py-5 text-white text-opacity-50 glass-panel border-0">
                <p className="mb-0">No conversational logs found.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 overflow-y-auto" style={{ maxHeight: '580px', paddingRight: '4px' }}>
                {filteredChatLogs.map((log, index) => (
                  <div key={index} className="glass-card p-3.5 rounded-3 border-0">
                    <div className="d-flex align-items-center gap-1.5 text-white text-opacity-45 mb-2" style={{ fontSize: '11px' }}>
                      <Clock size={12} /> {formatDate(log.timestamp)}
                    </div>
                    
                    {/* User message */}
                    <div className="mb-2">
                      <div className="fw-bold text-info mb-1" style={{ fontSize: '12px' }}>Visitor Asked:</div>
                      <div className="text-white text-opacity-90 bg-white bg-opacity-5 p-2 rounded" style={{ fontSize: '13px' }}>
                        {log.user}
                      </div>
                    </div>

                    {/* AI response */}
                    <div>
                      <div className="fw-bold text-success mb-1" style={{ fontSize: '12px' }}>DeepSeek AI Answered:</div>
                      <div className="text-white text-opacity-80 bg-black bg-opacity-25 p-2 rounded border border-secondary border-opacity-5" style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                        {log.bot}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Contact Messages Tab Content */}
          {activeTab === 'contact' && (
            filteredContactLogs.length === 0 ? (
              <div className="text-center py-5 text-white text-opacity-50 glass-panel border-0">
                <p className="mb-0">No contact messages found.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 overflow-y-auto" style={{ maxHeight: '580px', paddingRight: '4px' }}>
                {filteredContactLogs.map((log, index) => (
                  <div key={index} className="glass-card p-3.5 rounded-3 border-0">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-1.5 text-white text-opacity-45 mb-2" style={{ fontSize: '11px' }}>
                      <span className="d-flex align-items-center gap-1.5"><Clock size={12} /> {formatDate(log.timestamp)}</span>
                      <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-15 font-monospace">{log.email}</span>
                    </div>
                    
                    <div>
                      <div className="fw-bold text-info mb-1" style={{ fontSize: '12px' }}>Sender name: <span className="text-white">{log.name}</span></div>
                      <div className="fw-bold text-success mb-1" style={{ fontSize: '12px' }}>Message submitted:</div>
                      <div className="text-white text-opacity-90 bg-black bg-opacity-25 p-3 rounded border border-secondary border-opacity-5" style={{ fontSize: '13.5px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {log.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
