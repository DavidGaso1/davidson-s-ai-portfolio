
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ArrowUp } from 'lucide-react';
import { NeuralMeshBackground } from './components/Background';
import { GeminiChatWindow } from './components/GeminiChatWindow';

import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen relative transition-colors duration-300">
        <NeuralMeshBackground />
        <Navbar />
        <main>
          <section id="home"><Hero /></section>
          <section id="ask-ndu" className="py-20 md:py-32"><GeminiChatWindow /></section>
          <section id="about" className="py-20 md:py-32 bg-[#0d122b]/50"><About /></section>
          <section id="skills" className="py-20 md:py-32"><Skills /></section>
          <section id="projects" className="py-20 md:py-32 bg-[#0d122b]/50"><Projects /></section>
          <section id="experience" className="py-20 md:py-32"><Experience /></section>
          <section id="certifications" className="py-20 md:py-32 bg-[#0d122b]/50"><Certifications /></section>
          <section id="contact" className="py-20 md:py-32"><Contact /></section>
        </main>
        <Footer />
        
        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-8 left-8 p-3 fusion-button rounded-full shadow-lg z-50 animate-[fadeIn_0.3s_ease-out]"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;