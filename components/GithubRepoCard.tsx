import React from 'react';
import { ExternalLink, Star, GitFork, ArrowRight } from 'lucide-react';

interface RepoProps {
  name: string;
  description: string;
  stars: number;
  forks: number;
  tech: string;
  url: string;
  imageUrl?: string;
  onClick?: () => void;
}

export const GithubRepoCard: React.FC<RepoProps> = ({ name, description, stars, forks, tech, url, imageUrl, onClick }) => {
  return (
    <div 
      className="group relative h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Animated Gradient Border Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-500"></div>
      
      {/* Main Card Body */}
      <div className="relative h-full bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] overflow-hidden rounded-2xl flex flex-col hover:translate-y-[-8px] transition-all duration-500 shadow-xl">
        
        {/* Preview Image */}
        <div className="h-48 overflow-hidden relative">
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] to-transparent"></div>
          
          {/* External Link Overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-cyan-400 hover:border-cyan-500/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
              {name}
            </h3>
          </div>
          
          <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
            {description || "A cutting-edge project exploring the boundaries of modern technology and clean architecture."}
          </p>

          <div className="mt-auto">
            {/* Tech Tag */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-mono tracking-widest uppercase border border-cyan-500/20">
                {tech || "System Core"}
              </span>
              
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                Details <ArrowRight size={14} />
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-[var(--text-secondary)] text-xs font-mono pt-4 border-t border-white/5">
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
    </div>
  );
};

