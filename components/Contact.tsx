
import React from 'react';
import { Mail, MapPin, Send, Github, Linkedin, Instagram, User } from 'lucide-react';

export const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, integrate with an email service
    alert("Message sent! (Simulation)");
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Get in touch</h2>
          <h3 className="text-5xl font-display font-bold mb-8">Let's build something <span className="gradient-text">amazing</span> together</h3>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-lg">
            Whether you have a question about my experience, want to discuss a potential project, or just want to say hi, my inbox is always open.
          </p>

          <div className="space-y-8 mb-12">
            <a href="mailto:derocton@gmail.com" className="flex items-center gap-6 group">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-cyan-500 transition-all group-hover:scale-110">
                <Mail className="w-6 h-6 text-cyan-400 group-hover:text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-1">Email Me</div>
                <div className="text-xl font-medium">derocton@gmail.com</div>
              </div>
            </a>

            <div className="flex items-center gap-6 group">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-purple-500 transition-all group-hover:scale-110">
                <MapPin className="w-6 h-6 text-purple-400 group-hover:text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-1">Location</div>
                <div className="text-xl font-medium">Abuja, Nigeria</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {[
              { Icon: Github, href: "https://github.com/DavidGaso1" },
              { Icon: Linkedin, href: "https://linkedin.com/in/davidson-ahuruezenma-33a773294" },
              { Icon: User, href: "https://gravatar.com/profoundlyhopefuledea400b06.card" }
            ].map(({ Icon, href }, idx) => (
              <a 
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400 hover:text-cyan-400 hover:-translate-y-1 transition-all"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[40px] relative overflow-hidden">
          {/* Decorative mesh inside the card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Subject</label>
              <input 
                type="text" 
                required
                placeholder="Collaboration Opportunity" 
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Message</label>
              <textarea 
                rows={5} 
                required
                placeholder="Hello Davidson, I'm interested in..." 
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-cyan-500 text-white font-bold rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20 group"
            >
              Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
