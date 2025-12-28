
import React from 'react';
import { Cpu, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
            <img src="/logo.png" alt="Davidson Logo" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Designed & Built with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> by Davidson
          </p>
          <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em]">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
