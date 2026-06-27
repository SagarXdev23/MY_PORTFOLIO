'use client';

import React from 'react';
import { Star, GitFork, BookOpen, ExternalLink, Code2 } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  htmlUrl: string;
  homepage: string | null;
  onReadReadme: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
};

export default function ProjectCard({
  name,
  description,
  language,
  stars,
  forks,
  htmlUrl,
  homepage,
  onReadReadme,
}: ProjectCardProps) {
  const langColor = language ? LANGUAGE_COLORS[language] || '#8b949e' : null;

  return (
    <div className="card glass-card text-white h-100 d-flex flex-column border-0 p-3 rounded-4 overflow-hidden">
      <div className="card-body p-0 d-flex flex-column justify-content-between h-100">
        <div>
          {/* Header & Lang */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title m-0 fw-bold text-gradient text-glow-emerald truncate-1">
              {name.replace(/-/g, ' ')}
            </h5>
            
            {language && (
              <span 
                className="d-flex align-items-center gap-1.5 px-2 py-0.5 rounded-pill"
                style={{
                  fontSize: '11px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <span 
                  className="d-inline-block rounded-circle" 
                  style={{ width: '8px', height: '8px', backgroundColor: langColor || '#fff' }} 
                />
                {language}
              </span>
            )}
          </div>

          {/* Description */}
          <p 
            className="card-text text-white text-opacity-70 mt-2 mb-3"
            style={{
              fontSize: '13px',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '58px' // Keeps height consistent for alignment
            }}
          >
            {description || 'No description provided for this GitHub repository. Click below to read documentation.'}
          </p>
        </div>

        <div>
          {/* Stars & Forks Stats */}
          <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '12px' }}>
            <span className="text-white text-opacity-50 d-flex align-items-center gap-1">
              <Star size={13} className="text-warning" /> {stars}
            </span>
            <span className="text-white text-opacity-50 d-flex align-items-center gap-1">
              <GitFork size={13} className="text-info" /> {forks}
            </span>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2">
            <button
              onClick={onReadReadme}
              className="btn btn-sm btn-outline-light text-white text-opacity-80 border-secondary border-opacity-20 d-flex align-items-center justify-content-center gap-1 flex-grow-1 py-2 hover:bg-white hover:bg-opacity-5"
              style={{ fontSize: '12px', borderRadius: '8px' }}
            >
              <BookOpen size={13} /> README.md
            </button>
            <a
              href={htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-1 px-3 py-2 text-black fw-bold"
              style={{
                fontSize: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                border: 'none'
              }}
            >
              <ExternalLink size={13} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
