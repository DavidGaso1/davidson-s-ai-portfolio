
import React from 'react';
import { ExternalLink } from 'lucide-react';

import { GithubRepoCard } from './GithubRepoCard';

import { projects } from '../data/portfolioData';

export const Projects: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Portfolio</h2>
          <h3 className="text-4xl font-display font-bold">Featured Projects</h3>
        </div>
        <a href="https://github.com" className="text-cyan-400 hover:text-white transition-colors flex items-center gap-2 font-semibold">
          View all on GitHub <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <GithubRepoCard
            key={idx}
            name={project.title}
            description={project.description}
            stars={project.stars}
            forks={project.forks}
            tech={project.primaryTech}
            url={project.github}
          />
        ))}
      </div>
    </div>
  );
};
