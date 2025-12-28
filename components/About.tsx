import React from 'react';
import { User, Award, Briefcase, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const About: React.FC = () => {
  const stats = [
    { label: "Personal Projects", value: "4+", icon: Briefcase },
    { label: "Years Experience", value: "3", icon: User },
    { label: "Certifications", value: "8+", icon: Award },
    { label: "Specialized in", value: "AWS/DP", icon: ShieldCheck }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        {/* Profile Image Container */}
        <div className="relative w-full lg:w-1/2 max-w-md">
          <div className="aspect-square rounded-3xl overflow-hidden relative z-10 border-2 border-white/10">
            <img 
              src="/profile.jpg" 
              alt="Davidson Chiemezuo" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100" 
            />
          </div>
          {/* Decorative shapes */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-700" />
          <div className="absolute -inset-4 border-2 border-cyan-500/30 rounded-3xl -z-10 translate-x-4 translate-y-4" />
        </div>

        {/* Text Content */}
        <div className="lg:w-1/2">
          <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">About Me</h2>
          <h3 className="text-4xl font-display font-bold mb-8">
            Expertly blending <span className="text-purple-400">Social Insights</span> with <span className="text-cyan-400">Machine Intelligence</span>
          </h3>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-12">
            {PERSONAL_INFO.summary}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="fusion-card p-6 rounded-2xl hover:border-cyan-500/50 transition-colors group">
                <div className="p-3 bg-[var(--card-bg)] rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-3xl font-display font-bold text-[var(--text-primary)] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
