import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, FileText, ChevronRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const Hero: React.FC = () => {
  const roles = PERSONAL_INFO.roles;
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRoleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(role.substring(0, displayText.length + 1));
        if (displayText.length === role.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setDisplayText(role.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRoleIndex]);

  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background blobs - Now Animated */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float-delayed" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Hi, I'm <span className="gradient-text">Davidson</span> 👋
          </h1>
          <div className="h-12 md:h-16 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-[var(--text-secondary)]">
              I am an <span className="text-[var(--text-primary)] border-r-2 border-cyan-400 pr-1">{displayText}</span>
            </h2>
          </div>
          <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Bridging AI Innovation with Data-Driven Automation Solutions. 
            I craft intelligent systems that optimize workflows and protect critical data infrastructures.
          </p>

          <div className="flex flex-wrap gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <a 
              href="#projects" 
              className="fusion-button flex items-center gap-2 px-8 py-4 bg-cyan-500/10 text-cyan-400 font-bold rounded-xl"
            >
              View Projects <ChevronRight className="w-4 h-4" />
            </a>
            <button 
              onClick={async () => {
                try {
                  // alert('Starting download...'); // Optional debugging
                  const response = await fetch('/Ahuruezenma Davidson Chiemezuo.pdf');
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = "Ahuruezenma Davidson Chiemezuo.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Download failed:', error);
                  alert('Download failed. Please try again.');
                }
              }}
              className="flex items-center gap-2 px-8 py-4 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] font-bold rounded-xl hover:bg-[var(--card-bg)] hover:opacity-80 transition-all cursor-pointer shadow-lg"
            >
              Download Resume <FileText className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-6 opacity-0 animate-[slideUp_0.7s_ease-out_1s_forwards]">
            {[
              { icon: Github, link: PERSONAL_INFO.github, label: "GitHub" },
              { icon: Linkedin, link: PERSONAL_INFO.linkedin, label: "LinkedIn" },
              { icon: Mail, link: `mailto:${PERSONAL_INFO.email}`, label: "Gmail" }
            ].map((social, idx) => (
              <a 
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:-translate-y-1 transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};
