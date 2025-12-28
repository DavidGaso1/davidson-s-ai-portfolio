import React from 'react';
import { ExternalLink, Star, GitFork } from 'lucide-react';

interface RepoProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  tech: string;
  url: string;
}

export const GithubRepoCard: React.FC<RepoProps> = ({ name, description, stars, forks, tech, url }) => {
  return (
    <div className="group relative h-full">
      {/* Animated Gradient Border Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-500"></div>
      
      {/* Main Card Body */}
      <div className="relative h-full bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] p-6 rounded-2xl flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-300 shadow-lg">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
              {name}
            </h3>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ExternalLink size={20} />
            </a>
          </div>
          
          <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-4 leading-relaxed">
            {description || "A cutting-edge project exploring the boundaries of modern technology and clean architecture."}
          </p>
        </div>

        <div>
          {/* Tech Tag */}
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-mono tracking-widest uppercase mb-4 border border-cyan-500/20">
            {tech || "System Core"}
          </span>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 text-[var(--text-secondary)] text-xs font-mono">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500/70" /> {stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={14} className="text-blue-500/70" /> {forks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
