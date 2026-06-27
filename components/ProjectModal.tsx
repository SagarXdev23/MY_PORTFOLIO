'use client';

import React, { useEffect, useState } from 'react';
import { X, ExternalLink, RefreshCw, GitFork, Star } from 'lucide-react';
import { Marked } from 'marked';

interface ProjectModalProps {
  repoName: string;
  isOpen: boolean;
  onClose: () => void;
  stars?: number;
  forks?: number;
  htmlUrl?: string;
  homepage?: string | null;
}

const marked = new Marked();

export default function ProjectModal({
  repoName,
  isOpen,
  onClose,
  stars = 0,
  forks = 0,
  htmlUrl,
  homepage
}: ProjectModalProps) {
  const [readmeHtml, setReadmeHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadme = async (force = false) => {
    if (!repoName) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github?repo=${repoName}${force ? '&refresh=true' : ''}`);
      if (!res.ok) throw new Error('Failed to fetch README details');
      const data = await res.json();
      
      // Parse markdown to HTML
      const html = await marked.parse(data.readme || '');
      setReadmeHtml(html);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Could not load README.md');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && repoName) {
      fetchReadme();
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, repoName]);

  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{
        zIndex: 1050,
        background: 'rgba(3, 4, 9, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="glass-panel w-100 d-flex flex-column"
        style={{
          maxWidth: '850px',
          height: '80vh',
          maxHeight: '900px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Modal Header */}
        <div 
          className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.08)',
            background: 'rgba(13, 20, 38, 0.6)'
          }}
        >
          <div>
            <h5 className="m-0 fw-bold text-gradient d-flex align-items-center gap-2">
              {repoName}
            </h5>
            <div className="d-flex align-items-center gap-3 mt-1" style={{ fontSize: '12px' }}>
              <span className="text-white text-opacity-50 d-flex align-items-center gap-1">
                <Star size={12} className="text-warning" /> {stars}
              </span>
              <span className="text-white text-opacity-50 d-flex align-items-center gap-1">
                <GitFork size={12} className="text-cyan-400" /> {forks}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button 
              onClick={() => fetchReadme(true)}
              className="btn btn-sm btn-outline-secondary text-white text-opacity-60 border-0 p-2 d-flex align-items-center justify-content-center"
              title="Force Refresh README"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={onClose}
              className="btn btn-sm btn-outline-secondary text-white text-opacity-60 border-0 p-2 d-flex align-items-center justify-content-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div 
          className="flex-grow-1 p-4 overflow-y-auto text-white text-opacity-90"
          style={{
            background: 'rgba(4, 6, 15, 0.35)',
          }}
        >
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-3">
              <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="text-white text-opacity-50">Fetching project documentation...</span>
            </div>
          ) : error ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center gap-3">
              <span className="text-danger fw-semibold">{error}</span>
              <button onClick={() => fetchReadme()} className="btn btn-success btn-sm">
                Try Again
              </button>
            </div>
          ) : (
            <div 
              className="readme-content"
              dangerouslySetInnerHTML={{ __html: readmeHtml }}
              style={{
                fontSize: '15px',
                lineHeight: '1.7',
              }}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div 
          className="d-flex justify-content-end gap-3 px-4 py-3 border-top"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.08)',
            background: 'rgba(13, 20, 38, 0.6)'
          }}
        >
          {homepage && (
            <a 
              href={homepage} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 hover:text-white px-3"
            >
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
          {htmlUrl && (
            <a 
              href={htmlUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-sm btn-success d-flex align-items-center gap-1 text-black px-3 fw-semibold"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                border: 'none'
              }}
            >
              <ExternalLink size={14} /> View GitHub
            </a>
          )}
        </div>
      </div>

      {/* Styled Markdown inside Modal overrides */}
      <style jsx global>{`
        .readme-content h1, 
        .readme-content h2, 
        .readme-content h3 {
          color: #fff;
          margin-top: 1.5rem;
          margin-bottom: 0.8rem;
          font-weight: 700;
        }
        .readme-content h1 { font-size: 1.6rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem; }
        .readme-content h2 { font-size: 1.3rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.3rem; }
        .readme-content h3 { font-size: 1.1rem; }
        
        .readme-content p {
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .readme-content a {
          color: #10b981;
          text-decoration: underline !important;
        }
        .readme-content a:hover {
          color: #06b6d4;
        }
        
        .readme-content code {
          background: rgba(255,255,255,0.07);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-family: var(--font-geist-mono);
          font-size: 0.85em;
          color: #f43f5e;
        }
        
        .readme-content pre {
          background: rgba(13, 20, 38, 0.7);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        .readme-content pre code {
          background: transparent;
          padding: 0;
          color: #e2e8f0;
          font-size: 0.9em;
        }
        
        .readme-content ul, 
        .readme-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          color: rgba(255, 255, 255, 0.8);
        }
        .readme-content li {
          margin-bottom: 0.3rem;
        }
        
        .readme-content blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1rem;
          font-style: italic;
        }
        
        .readme-content img {
          max-width: 100%;
          border-radius: 6px;
          margin: 1rem 0;
          border: 1px solid rgba(255,255,255,0.05);
        }
        
        .readme-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        .readme-content th, 
        .readme-content td {
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.5rem 0.8rem;
          text-align: left;
        }
        .readme-content th {
          background: rgba(255,255,255,0.03);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
