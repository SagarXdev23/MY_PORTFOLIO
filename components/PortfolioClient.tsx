'use client';

// Override console.error before hydration starts to silence browser-extension attribute mismatch warnings
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = function(...args) {
    const msg = args[0] ? String(args[0]).toLowerCase() : '';
    if (
      msg.includes('hydrat') ||
      msg.includes('mismatch') ||
      msg.includes('bis_skin') ||
      msg.includes('suppress')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

import React, { useState, useEffect } from 'react';
import { 
  FileText, Mail, Award, Briefcase, GraduationCap, 
  Terminal, Layers, Database, Cpu, Search, ExternalLink, Download, 
  Eye, ShieldCheck, ChevronRight, CheckCircle2, ShieldAlert,
  Sun, Moon, Monitor
} from 'lucide-react';

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import Background3D from './Background3D';
import Globe3D from './Globe3D';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import AIAssistant from './AIAssistant';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
}

interface PortfolioClientProps {
  repos: Repo[];
  profile: any;
}

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    icon: <Terminal className="text-success animate-pulse-slow" size={20} />,
    skills: ['Java', 'JavaScript (ES6+)', 'Python', 'HTML5', 'CSS3']
  },
  {
    title: 'Frontend Frameworks',
    icon: <Layers className="text-info animate-pulse-slow" size={20} />,
    skills: ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'Bootstrap']
  },
  {
    title: 'Backend & APIs',
    icon: <Cpu className="text-primary-color animate-pulse-slow" size={20} />,
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Socket.io', 'JWT Auth']
  },
  {
    title: 'Databases & Tools',
    icon: <Database className="text-warning animate-pulse-slow" size={20} />,
    skills: ['MongoDB', 'MySQL', 'Git & GitHub', 'VS Code', 'IntelliJ IDEA']
  }
];

const CERTIFICATES = [
  {
    title: 'Excel Certification',
    issuer: 'Coursera',
    filename: 'excel.pdf',
    skills: ['Spreadsheets', 'Data Analysis', 'Formulas', 'Data Visualization'],
    date: '2024'
  },
  {
    title: 'Google Generative AI Specialist',
    issuer: 'Google',
    filename: 'G-GENAI-I-m1-l2-en-file-2.en.pdf',
    skills: ['Large Language Models', 'Prompt Engineering', 'AI Safety'],
    date: '2025'
  },
  {
    title: 'Software Engineering',
    issuer: 'NPTEL (IIT Kharagpur)',
    filename: 'software_engineer_intern certificate.pdf',
    skills: ['Software Life Cycle', 'System Design', 'Agile Methodology'],
    date: '2025'
  },
  {
    title: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    filename: 'problem_solving_basic certificate.pdf',
    skills: ['Data Structures', 'Algorithms', 'Logic & Analysis'],
    date: '2024'
  },
  {
    title: 'Java (Basic)',
    issuer: 'HackerRank',
    filename: 'java_basic certificate.pdf',
    skills: ['OOPs', 'Java Syntax', 'Exception Handling', 'Collections'],
    date: '2024'
  },
  {
    title: 'CSS Certificate',
    issuer: 'HackerRank',
    filename: 'css certificate.pdf',
    skills: ['CSS3 Grid & Flexbox', 'Responsive Web Design', 'Animations'],
    date: '2024'
  },
  {
    title: 'HackerRank Python / Coding',
    issuer: 'HackerRank',
    filename: 'Hackerrank Certificate.pdf',
    skills: ['Python Basics', 'File Handling', 'Data Processing'],
    date: '2024'
  }
];

function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setError('Please provide both your email address and a message.');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      // Direct client-side POST to Formspree — no server, no filesystem issues
      const response = await fetch('https://formspree.io/f/mbdvoezg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name || 'Anonymous',
          email,
          message
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSucceeded(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        if (data.errors) {
          setError(data.errors.map((err: any) => err.message).join(', '));
        } else {
          setError('Failed to send message. Please try again later.');
        }
      }
    } catch (err) {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };


  if (succeeded) {
    return (
      <div className="glass-panel p-4 text-center border-0 animate-float">
        <CheckCircle2 className="text-success mb-3 mx-auto" size={40} />
        <h5 className="fw-bold text-foreground mb-2">Message Sent!</h5>
        <p className="text-foreground-muted mb-0" style={{ fontSize: '13px' }}>
          Thank you for reaching out. Sagar will get back to you as soon as possible.
        </p>
        <button 
          onClick={() => setSucceeded(false)} 
          className="btn btn-custom-outline btn-sm mt-3 px-3"
          style={{ borderRadius: '6px' }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-4 border-0 d-flex flex-column gap-3">
      {error && (
        <div 
          className="alert alert-danger d-flex align-items-center gap-2 border-0 bg-danger bg-opacity-10 text-danger py-2 px-3 m-0"
          style={{ fontSize: '13px', borderRadius: '8px' }}
        >
          <ShieldAlert size={16} className="flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="form-name" className="form-label text-foreground-muted fw-medium" style={{ fontSize: '12px' }}>
          Full Name
        </label>
        <input
          id="form-name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          disabled={submitting}
          className="form-control py-2 px-3"
          style={{ fontSize: '13.5px' }}
        />
      </div>

      <div>
        <label htmlFor="form-email" className="form-label text-foreground-muted fw-medium" style={{ fontSize: '12px' }}>
          Email Address <span className="text-danger">*</span>
        </label>
        <input
          id="form-email"
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          disabled={submitting}
          className="form-control py-2 px-3"
          style={{ fontSize: '13.5px' }}
        />
      </div>

      <div>
        <label htmlFor="form-message" className="form-label text-foreground-muted fw-medium" style={{ fontSize: '12px' }}>
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          id="form-message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi Sagar, I would like to discuss..."
          disabled={submitting}
          className="form-control py-2 px-3"
          style={{ fontSize: '13.5px', resize: 'vertical' }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-gradient py-2.5 w-100 fw-bold mt-2 d-flex align-items-center justify-content-center gap-2"
        style={{
          borderRadius: '8px'
        }}
      >
        {submitting ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}

export default function PortfolioClient({ repos, profile }: PortfolioClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (t === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', t);
    }
  };

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => applyTheme('system');
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [theme]);

  const cycleTheme = () => {
    let nextTheme: 'light' | 'dark' | 'system' = 'dark';
    if (theme === 'dark') nextTheme = 'light';
    else if (theme === 'light') nextTheme = 'system';
    
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };
  
  // Modal state
  const [modalRepo, setModalRepo] = useState<Repo | null>(null);

  // Get unique languages for filter
  const languages = ['All', ...new Set(repos.map(r => r.language).filter(Boolean) as string[])];

  // Filter repositories
  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  return (
    <>
      {/* 3D Moving Particles Canvas */}
      <Background3D />

      {/* Sticky Navigation Bar */}
      <nav className="navbar navbar-expand-lg sticky-top glass-panel px-4 py-3 mx-4 mt-3 border-0">
        <div className="container-fluid p-0">
          <a className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" href="#home">
            <span className="text-success fw-extrabold">&lt;</span>
            <span className="text-foreground">Sagar</span>
            <span className="text-success">Mishra /&gt;</span>
          </a>
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`navbar-collapse justify-content-end ${isNavOpen ? 'd-block' : 'd-none d-lg-flex'}`} id="navbarNav">
            <ul className="navbar-nav gap-2 mt-3 mt-lg-0 align-items-center">
              <li className="nav-item">
                <a className="nav-link px-3" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#projects">Projects</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#certs">Certifications</a>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="#contact">Contact</a>
              </li>
              {/* Theme Toggle Button */}
              <li className="nav-item ms-lg-2">
                <button
                  onClick={cycleTheme}
                  className="btn btn-custom-outline btn-sm px-3 py-2 d-flex align-items-center gap-1.5"
                  style={{ fontSize: '13px' }}
                  title={`Current Theme: ${theme.toUpperCase()} (Click to toggle)`}
                >
                  {theme === 'dark' && <Moon size={14} className="text-info" />}
                  {theme === 'light' && <Sun size={14} className="text-warning" />}
                  {theme === 'system' && <Monitor size={14} className="text-success" />}
                  <span className="d-none d-lg-inline text-capitalize" style={{ fontSize: '12px' }}>{theme}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="container min-vh-90 d-flex align-items-center py-5">
        <div className="row w-100 align-items-center gy-5">
          <div className="col-lg-7 text-center text-lg-start">
            <span 
              className="px-3 py-1.5 rounded-pill text-success bg-success bg-opacity-10 border border-success border-opacity-20 d-inline-flex align-items-center gap-1.5 mb-4"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              <ShieldCheck size={14} /> Available for Internships & Projects
            </span>
            <h1 className="display-4 fw-extrabold text-foreground mb-2 leading-tight">
              Hi, I am <span className="text-gradient">Sagar Mishra</span>
            </h1>
            <h3 className="h4 fw-bold text-foreground-muted mb-3">
              MERN Stack Developer | Java & DSA Enthusiast
            </h3>
            <p className="lead text-foreground-muted mb-4 max-w-lg mx-auto mx-lg-0" style={{ fontSize: '16px', lineHeight: '1.7' }}>
              I am a B.Tech Computer Science student at GLA University expected to graduate in 2027. I specialize in building responsive, high-performance web applications using MongoDB, Express, React, and Node.js, combined with strong problem-solving skills in Java and DSA.
            </p>
            
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
              <a 
                href="/assets/Sagar_Mishra_Resume_2027_2315001915.pdf" 
                target="_blank"
                rel="noreferrer"
                className="btn btn-gradient d-flex align-items-center gap-2 px-4 py-2.5 fw-bold"
                style={{ borderRadius: '8px' }}
              >
                <Eye size={18} /> See Resume
              </a>
              <a 
                href="#about"
                className="btn btn-custom-outline d-flex align-items-center gap-2 px-4 py-2.5"
                style={{ borderRadius: '8px' }}
              >
                Explore Skills <ChevronRight size={16} />
              </a>
            </div>

            {/* Social Links */}
            <div className="d-flex justify-content-center justify-content-lg-start gap-3 mt-4 text-foreground-muted">
              <a href="https://github.com/SagarXdev23" target="_blank" rel="noreferrer" className="hover:text-success transition-colors">
                <GithubIcon size={22} />
              </a>
              <a href="https://www.linkedin.com/in/sagar-mishra-5035a4280/" target="_blank" rel="noreferrer" className="hover:text-success transition-colors">
                <LinkedinIcon size={22} />
              </a>
              <a href="mailto:sagar.mishra_cs23@gla.ac.in" className="hover:text-success transition-colors">
                <Mail size={22} />
              </a>
            </div>
          </div>
          
          <div className="col-lg-5 text-center">
            <Globe3D />
          </div>
        </div>
      </section>

      {/* About & Skills Section */}
      <section id="about" className="py-5 bg-bg-secondary/40 border-top border-bottom border-border-color/30">
        <div className="container py-4">
          <div className="row justify-content-between gy-5">
            <div className="col-lg-5">
              <h2 className="fw-bold text-foreground mb-4 d-flex align-items-center gap-2">
                <GraduationCap className="text-success" size={28} /> Education & Focus
              </h2>
              
              <div className="d-flex flex-column gap-4">
                {/* University card */}
                <div className="glass-panel p-4 border-0">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-foreground mb-0">GLA University, Mathura</h5>
                    <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-20 px-2.5 py-1">2023 - 2027</span>
                  </div>
                  <p className="text-foreground/80 fw-medium" style={{ fontSize: '14px' }}>B.Tech in Computer Science & Engineering</p>
                  <p className="text-foreground-muted" style={{ fontSize: '13px' }}>Current CPI: 6.7. Extensive coursework in Data Structures & Algorithms, Object-Oriented Programming (OOPs), DBMS, Operating Systems, and Computer Networks.</p>
                </div>

                {/* School card */}
                <div className="glass-panel p-4 border-0">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-foreground mb-0">Lucknow Public School</h5>
                    <span className="badge bg-secondary bg-opacity-25 text-foreground-muted border border-secondary border-opacity-20 px-2.5 py-1">Class XII, 2022</span>
                  </div>
                  <p className="text-foreground/80 fw-medium" style={{ fontSize: '14px' }}>Intermediate Board Examination</p>
                  <p className="text-foreground-muted" style={{ fontSize: '13px' }}>Completed with a final score of 75% majoring in Science & Mathematics.</p>
                </div>
              </div>

              {/* Achievements */}
              <div className="mt-5">
                <h4 className="fw-bold text-foreground mb-3 d-flex align-items-center gap-2">
                  <Award className="text-success animate-float" size={22} /> Key Achievements
                </h4>
                <ul className="list-unstyled text-foreground-muted d-flex flex-column gap-2" style={{ fontSize: '14px' }}>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-success fw-bold">✓</span>
                    <span>Led a 5-member developer team to build and launch a live MERN food delivery application.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-success fw-bold">✓</span>
                    <span>Built 3 independent full-stack AI-integrated projects with Stripe payments and real-time Socket.io chat.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-success fw-bold">✓</span>
                    <span>Completed 6 industry-recognized tech certifications within the last 12 months.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-success fw-bold">✓</span>
                    <span>Solved 100+ algorithmic questions on LeetCode; achieved a 5-Star rating on HackerRank for Java.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-6">
              <h2 className="fw-bold text-foreground mb-4 d-flex align-items-center gap-2">
                <Briefcase className="text-success" size={28} /> Core Skills System
              </h2>
              
              <div className="row g-4">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="glass-card p-3 h-100 rounded-3 border-0">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        {cat.icon}
                        <h6 className="m-0 fw-bold text-foreground">{cat.title}</h6>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {cat.skills.map((skill, sIdx) => (
                          <span 
                            key={sIdx} 
                            className="px-2.5 py-1 rounded text-foreground-muted"
                            style={{ 
                              background: 'hsl(var(--bg-secondary) / 0.5)',
                              border: '1px solid hsl(var(--border) / 0.5)',
                              fontSize: '12px'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5">
          <div>
            <h2 className="fw-bold text-foreground m-0 d-flex align-items-center gap-2">
                <GithubIcon className="text-success" size={28} /> Projects & Repositories
            </h2>
            <p className="text-foreground-muted m-0 mt-1" style={{ fontSize: '14px' }}>
              Fetched in real-time from GitHub. Click on README.md to view detailed project descriptions.
            </p>
          </div>

          {/* Filters */}
          <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
            <div className="position-relative flex-grow-1 flex-md-grow-0">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control px-3 py-2 ps-5"
                style={{ fontSize: '13px', minWidth: '220px', borderRadius: '8px' }}
              />
              <Search className="position-absolute text-foreground-muted top-50 start-0 translate-middle-y ms-3" size={15} />
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="form-select px-3 py-2"
              style={{ fontSize: '13px', width: '130px', borderRadius: '8px' }}
            >
              {languages.map((lang, idx) => (
                <option key={idx} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredRepos.length === 0 ? (
          <div className="text-center py-5 text-foreground-muted border border-secondary border-opacity-10 rounded-4 glass-panel">
            <p className="mb-0">No projects found matching the criteria.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="col-md-6 col-lg-4">
                <ProjectCard
                  name={repo.name}
                  description={repo.description}
                  language={repo.language}
                  stars={repo.stargazers_count}
                  forks={repo.forks_count}
                  htmlUrl={repo.html_url}
                  homepage={repo.homepage}
                  onReadReadme={() => setModalRepo(repo)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certifications Section */}
      <section id="certs" className="py-5 bg-bg-secondary/40 border-top border-border-color/30">
        <div className="container py-4">
          <div className="mb-5">
            <h2 className="fw-bold text-foreground m-0 d-flex align-items-center gap-2">
              <Award className="text-success animate-float" size={28} /> Professional Certifications
            </h2>
            <p className="text-foreground-muted m-0 mt-1" style={{ fontSize: '14px' }}>
              Verified credentials and certificates in Cybersecurity, Artificial Intelligence, and Software Engineering.
            </p>
          </div>

          <div className="row g-4">
            {CERTIFICATES.map((cert, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card glass-card h-100 border-0 p-3 rounded-4">
                  <div className="card-body p-0 d-flex flex-column justify-content-between h-100">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-foreground m-0 lh-base" style={{ fontSize: '15px' }}>
                          {cert.title}
                        </h6>
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10" style={{ fontSize: '10px' }}>
                          {cert.date}
                        </span>
                      </div>
                      <p className="text-success fw-semibold mb-3" style={{ fontSize: '12px' }}>{cert.issuer}</p>
                      
                      {/* Skills Tags */}
                      <div className="d-flex flex-wrap gap-1.5 mb-4">
                        {cert.skills.map((skill, sIdx) => (
                          <span 
                            key={sIdx} 
                            className="px-2 py-0.5 rounded text-foreground-muted"
                            style={{ 
                              background: 'hsl(var(--bg-secondary) / 0.5)',
                              border: '1px solid hsl(var(--border) / 0.5)',
                              fontSize: '10px'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex w-100">
                      <a 
                        href={`/assets/${encodeURIComponent(cert.filename)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-sm btn-gradient fw-bold d-flex align-items-center justify-content-center gap-1.5 w-100 py-2.5"
                        style={{
                          fontSize: '12px',
                          borderRadius: '8px'
                        }}
                      >
                        <Eye size={14} /> View Certificate
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-bg-secondary/40 border-top border-border-color/30">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center mb-5">
              <h2 className="fw-bold text-foreground mb-2 d-flex align-items-center justify-content-center gap-2">
                <Mail className="text-success" size={28} /> Get In Touch
              </h2>
              <p className="text-foreground-muted m-0" style={{ fontSize: '14px' }}>
                Have an internship opportunity, a project request, or a general question? Fill out the form below.
              </p>
            </div>
            
            <div className="col-lg-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 border-top border-border-color/30" style={{ background: 'hsl(var(--bg-secondary) / 0.8)' }}>
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <h5 className="fw-bold text-success mb-2 text-gradient">Made with curiosity with deep interest.</h5>
              <p className="text-foreground-muted m-0" style={{ fontSize: '13.5px' }}>
                Thank you for visiting my Portfolio Website.
              </p>
              <p className="text-foreground-muted/60 m-0 mt-2" style={{ fontSize: '11px' }}>
                © {new Date().getFullYear()} Sagar Mishra. Built with Next.js, Tailwind CSS v4, Bootstrap, and HTML5/CSS3.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-3 text-foreground-muted">
                <a href="#home" className="hover:text-primary" style={{ fontSize: '13px' }}>Home</a>
                <a href="#about" className="hover:text-primary" style={{ fontSize: '13px' }}>About</a>
                <a href="#projects" className="hover:text-primary" style={{ fontSize: '13px' }}>Projects</a>
                <a href="#certs" className="hover:text-primary" style={{ fontSize: '13px' }}>Certifications</a>
                <a href="#contact" className="hover:text-primary" style={{ fontSize: '13px' }}>Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Project Modal */}
      {modalRepo && (
        <ProjectModal
          repoName={modalRepo.name}
          isOpen={!!modalRepo}
          onClose={() => setModalRepo(null)}
          stars={modalRepo.stargazers_count}
          forks={modalRepo.forks_count}
          htmlUrl={modalRepo.html_url}
          homepage={modalRepo.homepage}
        />
      )}

      {/* AI Assistant Chat Widget */}
      <AIAssistant />
    </>
  );
}
