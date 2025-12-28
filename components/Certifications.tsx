
import React from 'react';
import { Award, ExternalLink } from 'lucide-react';

import { certifications } from '../data/portfolioData';

export const Certifications: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Credentials</h2>
        <h3 className="text-4xl font-display font-bold">Certifications & Awards</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {certifications.map((cert, idx) => (
          <div 
            key={idx} 
            className="group glass-card p-8 rounded-3xl flex flex-col justify-between hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300"
          >
            <div>
              <div className="p-3 bg-white/5 rounded-xl w-fit mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all">
                <Award className="w-6 h-6 text-cyan-400 group-hover:text-white" />
              </div>
              <h4 className="font-display font-bold text-lg mb-2 leading-snug">{cert.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{cert.issuer}</p>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-4">
              <span className="text-xs font-mono text-cyan-500/80 uppercase">{cert.year}</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-500 rounded font-bold uppercase">{cert.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
