import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { GithubRepoCard } from './GithubRepoCard';
import { ProjectModal } from './ProjectModal';
import { projects } from '../data/portfolioData';

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

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Portfolio</h2>
          <h3 className="text-4xl font-display font-bold">Featured Projects</h3>
          <p className="mt-4 text-slate-400 max-w-lg">
            A showcase of my recent work in AI engineering, automation, and full-stack development. Click any project to view detailed documentation and mock interfaces.
          </p>
        </div>
        <a 
          href="https://github.com/DavidGaso1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-white transition-colors flex items-center gap-2 font-semibold bg-cyan-500/5 px-6 py-3 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 shadow-lg shadow-cyan-500/5 group"
        >
          View all on GitHub <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <GithubRepoCard
            key={idx}
            name={project.title}
            description={project.description}
            stars={project.stars}
            forks={project.forks}
            tech={project.primaryTech}
            url={project.github}
            imageUrl={project.imageUrl}
            onClick={() => setSelectedProject(project as Project)}
          />
        ))}
      </div>

      <ProjectModal 
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
