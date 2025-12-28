
import React, { useRef, useState } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, User, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Environment variables in Vite must start with VITE_
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      form.current!, 
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then((result) => {
        setSubmitStatus('success');
        setShowModal(true);
        setIsSending(false);
        form.current?.reset();
      }, (error) => {
        setSubmitStatus('error');
        setShowModal(true);
        setIsSending(false);
      });
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
          
          <form ref={form} onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="user_name"
                  required
                  placeholder="John Doe" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                <input 
                  type="email" 
                  name="user_email"
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
                name="subject"
                required
                placeholder="Collaboration Opportunity" 
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Message</label>
              <textarea 
                name="message"
                rows={5} 
                required
                placeholder="Hello Davidson, I'm interested in..." 
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className="w-full py-5 bg-cyan-500 text-white font-bold rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>Sending... <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Custom Success/Error Modal */}
          {showModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                onClick={() => setShowModal(false)}
              ></div>
              <div className="relative w-full max-w-sm bg-[#0f172a] border border-white/10 p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                  
                  {submitStatus === 'success' ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-slate-400 text-sm mb-6">
                        Thanks for reaching out! Davidson will get back to you as soon as possible.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <XCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Failed to Send</h3>
                      <p className="text-slate-400 text-sm mb-6">
                        Something went wrong. Please check your credentials or try emailing directly.
                      </p>
                    </>
                  )}

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
