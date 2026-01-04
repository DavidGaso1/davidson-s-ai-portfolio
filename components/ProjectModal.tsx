import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Github, Star, GitFork, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Project {
  title: string;
  description: string;
  tech: string[];
  primaryTech: string;
  github: string;
  repoOwner?: string;
  repoName?: string;
  stars: number;
  forks: number;
  imageUrl: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [readme, setReadme] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && project?.repoOwner && project?.repoName) {
      fetchReadme();
    } else {
      setReadme('');
      setError(null);
    }
  }, [isOpen, project]);

  const fetchReadme = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try main first, then master
      let response = await fetch(`https://raw.githubusercontent.com/${project?.repoOwner}/${project?.repoName}/main/README.md`);
      
      if (!response.ok) {
        response = await fetch(`https://raw.githubusercontent.com/${project?.repoOwner}/${project?.repoName}/master/README.md`);
      }

      if (!response.ok) {
        throw new Error('README not found');
      }

      const text = await response.text();
      setReadme(text);
    } catch (err) {
      console.error('Error fetching readme:', err);
      setError('Could not load README content from GitHub.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0b1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Left Side: Mock UI Preview */}
        <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden bg-slate-900/50 relative border-b md:border-b-0 md:border-r border-white/10">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-display font-bold text-white mb-2">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t, i) => (
                <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6 text-slate-400 text-sm font-mono">
              <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500" /> {project.stars}</span>
              <span className="flex items-center gap-1.5"><GitFork size={16} className="text-blue-500" /> {project.forks}</span>
            </div>
          </div>
        </div>

        {/* Right Side: README Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-slate-900/20">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all z-10"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Detail View</div>
              <div className="flex gap-3">
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 transition-all"
                >
                  <Github size={14} /> Repository
                </a>
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Live Demo <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="prose prose-invert max-w-none prose-slate prose-headings:font-display prose-headings:text-white prose-p:text-slate-400 prose-code:text-cyan-400 prose-a:text-cyan-400 markdown-content">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-slate-500 font-mono text-sm">Fetching documentation from GitHub...</p>
                </div>
              ) : error ? (
                <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                  <p className="text-slate-500 text-xs">{project.description}</p>
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {readme || `# ${project.title}\n\n${project.description}`}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .markdown-content h1 { font-size: 2rem; margin-bottom: 1.5rem; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
        .markdown-content h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; color: #fff; }
        .markdown-content h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; color: #e2e8f0; }
        .markdown-content p { margin-bottom: 1.25rem; line-height: 1.7; color: #94a3b8; }
        .markdown-content ul, .markdown-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .markdown-content li { margin-bottom: 0.5rem; color: #94a3b8; }
        .markdown-content pre { padding: 1.5rem; background: #010409 !important; border-radius: 1rem; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.1); overflow-x: auto; }
        .markdown-content code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 0.9em; }
        .markdown-content blockquote { border-left: 4px solid #0891b2; padding-left: 1rem; margin-left: 0; font-style: italic; color: #cbd5e1; }
        .markdown-content img { border-radius: 1rem; margin: 2rem 0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
      `}</style>
    </div>
  );
};
