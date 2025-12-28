
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

import { technicalSkills, toolsData, softSkills } from '../data/portfolioData';

export const Skills: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Mastery</h2>
        <h3 className="text-4xl md:text-5xl font-display font-bold">Skills & Technologies</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Technical Radar Chart */}
        <div className="glass-card p-8 rounded-3xl h-[450px]">
          <h4 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-cyan-500 rounded-full"></span>
            Technical Expertise
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={technicalSkills}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Davidson"
                dataKey="value"
                stroke="#00d9ff"
                fill="#00d9ff"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Tools Horizontal Bar Chart */}
        <div className="glass-card p-8 rounded-3xl h-[450px]">
          <h4 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
            Tools & Infrastructure
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              layout="vertical"
              data={toolsData}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                width={100} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1a1d2e', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                itemStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`${value}%`, 'Proficiency']}
              />
              <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={20}>
                {toolsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Soft Skills Progress Bars */}
        <div className="lg:col-span-2 glass-card p-8 md:p-12 rounded-3xl">
          <h4 className="text-xl font-display font-bold mb-10 text-center">Interpersonal & Soft Skills</h4>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {softSkills.map((skill, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-gray-200">{skill.name}</span>
                  <span className="text-cyan-400 font-mono text-sm">{skill.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
