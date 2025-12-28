
import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';

import { experiences } from '../data/portfolioData';

export const Experience: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Career Journey</h2>
        <h3 className="text-4xl font-display font-bold">Work Experience</h3>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Central Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-px"></div>

        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <div key={idx} className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] -translate-x-2 md:-translate-x-2 z-10 top-2"></div>

              {/* Content Card */}
              <div className="ml-8 md:ml-0 md:w-1/2">
                <div className={`glass-card p-8 rounded-3xl hover:border-cyan-500/30 transition-all ${idx % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold uppercase">
                      {exp.role}
                    </span>
                    {exp.badge && (
                      <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {exp.badge}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-2xl font-display font-bold mb-2">{exp.company}</h4>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {exp.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {exp.location}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-400 leading-relaxed text-sm">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Spacing for mobile layout */}
              <div className="hidden md:block md:w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
