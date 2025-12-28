import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Zap, Trash2, Download } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  PERSONAL_INFO, technicalSkills, toolsData, softSkills, 
  experiences, projects, certifications 
} from '../data/portfolioData';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Dynamically generated Portfolio Knowledge Base
const PORTFOLIO_KNOWLEDGE = `
=== DAVIDSON CHIEMEZUO - LIVE PORTFOLIO DATA ===

## PERSONAL INFORMATION
- Full Name: ${PERSONAL_INFO.name}
- Roles: ${PERSONAL_INFO.roles.join(', ')}
- Location: ${PERSONAL_INFO.location}
- Email: ${PERSONAL_INFO.email}
- GitHub: ${PERSONAL_INFO.github}
- LinkedIn: ${PERSONAL_INFO.linkedin}

## PROFESSIONAL SUMMARY
${PERSONAL_INFO.summary}

## WORK EXPERIENCE
${experiences.map((exp, i) => `${i+1}. ${exp.role} at ${exp.company} (${exp.period})
   - ${exp.achievements.join('\n   - ')}`).join('\n\n')}

## PROJECTS
${projects.map((p, i) => `${i+1}. ${p.title} (${p.primaryTech}) - ${p.description}
   • Tech: ${p.tech.join(', ')}
   • GitHub: ${p.github}`).join('\n')}

## TECHNICAL SKILLS
${technicalSkills.map(s => `- ${s.subject}: ${s.value}%`).join('\n')}

## TOOLS & INFRASTRUCTURE
${toolsData.map(t => `- ${t.name}: ${t.val}%`).join('\n')}

## SOFT SKILLS
${softSkills.map(s => `- ${s.name}: ${s.progress}%`).join('\n')}

## CERTIFICATIONS
${certifications.map(c => `- ${c.title} from ${c.issuer} (${c.year})`).join('\n')}
`;

const SYSTEM_PROMPT = `You are Ndu, Davidson Chiemezuo's AI portfolio assistant. Your ONLY purpose is to answer questions about Davidson's professional background, projects, skills, experience, and certifications.

${PORTFOLIO_KNOWLEDGE}

=== RESPONSE FORMATTING RULES ===
1. ALWAYS use structured formatting in your responses:
   - Use **bold** for project names, company names, and important terms
   - Use bullet points (•) for listing items
   - Add line breaks between sections for readability
   - When listing projects or skills, put each on its own line

2. Example format for listing projects:
   "Davidson has built the following projects:
   
   • **RAG System for ViZO Technologies** - Intelligent document querying with vector embeddings (Python, LangChain)
   
   • **AI Assistant Automation Workflow** - N8N workflow with Gemini and Supabase integration
   
   • **AI Academic Assignment Generator** - Automated essay generator with citations"

3. ONLY answer from the portfolio data above.
4. Politely decline off-topic questions.
5. Be friendly and professional.
`;

const SUGGESTED_QUESTIONS = [
  "What projects has Davidson built?",
  "Tell me about his skills",
  "Where does he work?",
  "What certifications does he have?",
];

export const GeminiChatWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat from localStorage on mount
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem('ndu_chat_history');
      if (savedChat) {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setHasStarted(true);
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  }, []);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('ndu_chat_history', JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
  }, [messages]);

  // Format markdown-style text to HTML
  const formatMessage = (text: string) => {
    return text
      // Bold: **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyan-300 font-semibold">$1</strong>')
      .replace(/__(.+?)__/g, '<strong class="text-cyan-300 font-semibold">$1</strong>')
      // Bullet lists: lines starting with •, -, or *
      .replace(/^[•\-\*]\s+(.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-white/40">•</span><span class="flex-1">$1</span></div>')
      // Numbered lists: lines starting with 1. 2. etc
      .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-cyan-400/60 font-mono text-xs">$1.</span><span class="flex-1">$2</span></div>')
      // Custom link/button detection for common portfolio links - Compact Version
      .replace(/(GitHub|LinkedIn|Email|Portfolio):\s*(https?:\/\/[^\s\n<]+|[\w\.\-]+@[\w\.\-]+\.[a-z]{2,})/gi, (match, type, url) => {
        const href = url.includes('@') ? `mailto:${url}` : url;
        const label = type || 'Visit';
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 rounded-lg text-[11px] font-medium text-slate-300 hover:text-cyan-400 transition-all no-underline shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          ${label}
        </a>`;
      })
      // Double line breaks for paragraph spacing
      .replace(/\n\n/g, '</p><p class="mt-3">')
      // Single line breaks
      .replace(/\n/g, '<br />');
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const requestClearChat = () => {
    if (messages.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClear = async () => {
    const historyData = {
      timestamp: new Date().toISOString(),
      messages: messages
    };

    try {
      // Send history to backend securely
      await fetch('http://localhost:3001/api/save-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyData),
      });
      console.log("Chat history synced with Davidson's backend.");
    } catch (err) {
      console.error("Failed to sync history with backend:", err);
    }

    // Clear local state
    setMessages([]);
    setHasStarted(false);
    localStorage.removeItem('ndu_chat_history');
    setShowClearConfirm(false);
  };

  const handleSend = async (messageOverride?: string) => {
    const messageToSend = messageOverride || input.trim();
    if (!messageToSend) return;

    if (!hasStarted) setHasStarted(true);
    
    setMessages((prev) => [...prev, { role: 'user', text: messageToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!API_KEY) throw new Error("API_KEY_MISSING");

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const chatHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(messageToSend);
      const text = result.response.text();

      setMessages((prev) => [...prev, { role: 'bot', text }]);
    } catch (error: any) {
      let errorMessage = "I'm having trouble connecting. Please try again.";
      if (error.message === "API_KEY_MISSING") {
        errorMessage = "⚠️ API not configured. Please contact Davidson.";
      } else if (error.message?.includes("429") || error.message?.includes("quota")) {
        errorMessage = "I'm busy right now! Please try again in a minute. 🙏";
      }
      setMessages((prev) => [...prev, { role: 'bot', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 relative">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Interactive</h2>
        <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Ask <span className="gradient-text">Ndu</span> Anything
        </h3>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Meet Ndu, my AI assistant. Ask about my projects, skills, experience, or certifications.
        </p>
      </div>

      {/* Chat Container - Fully transparent, no borders */}
      <div className="max-w-3xl mx-auto relative">
        <div className="rounded-3xl overflow-hidden">
          
          
          {/* Welcome State or Chat Messages */}
          {!hasStarted ? (
            <div className="p-8 md:p-12 text-center">
              <h4 className="text-xl font-display font-bold mb-3 text-white">Hello! I'm Ndu 👋</h4>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                I'm Davidson's AI portfolio assistant. Ask me about his projects, skills, work experience, and certifications.
              </p>
              
              {/* Suggested Questions */}
              <div className="space-y-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="px-4 py-2 backdrop-blur-sm bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-sm rounded-full transition-all duration-300 flex items-center gap-2"
                    >
                      <Zap className="w-3 h-3" /> {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div 
              ref={scrollRef} 
              className="h-[400px] overflow-y-auto p-6 space-y-4 no-scrollbar"
              style={{
                scrollbarWidth: 'none',   /* Firefox */
                msOverflowStyle: 'none',  /* IE and Edge */
              }}
            >
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none; /* Safari and Chrome */
                }
              `}</style>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.role === 'bot' ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex items-center justify-center">
                        <img src="/logo.png" alt="Ndu" className="w-7 h-7 object-contain" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Message */}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white rounded-br-sm backdrop-blur-sm' 
                      : 'bg-white/[0.05] text-slate-200 border border-white/10 rounded-bl-sm backdrop-blur-sm'
                  }`}>
                    {msg.role === 'bot' ? (
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <img src="/logo.png" alt="Ndu" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="bg-white/[0.05] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm backdrop-blur-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Questions after Bot Response */}
              {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'bot' && (
                <div className="flex flex-wrap gap-2 ml-12 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 rounded-full text-[11px] text-slate-400 hover:text-cyan-400 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Ask me about Davidson's work..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.05] border border-white/10 focus:border-cyan-500/50 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-500 transition-all backdrop-blur-sm disabled:opacity-50"
              />
              <button 
                onClick={requestClearChat}
                disabled={messages.length === 0}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group relative"
                title="Clear Chat & Save History"
              >
                <Trash2 size={18} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Clear & Save</span>
              </button>
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <p className="text-[10px] text-slate-500 font-mono">
                Powered by Gemini 2.5 Flash • Portfolio-focused AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-3xl"
            onClick={() => setShowClearConfirm(false)}
          ></div>
          <div className="relative w-full max-w-sm bg-[#0f172a] border border-white/10 p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Clear Conversation?</h3>
              <p className="text-slate-400 text-sm mb-6">
                This will clear your chat history. A secure copy will be saved to Davidson's backend for quality review.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClear}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-500/20 transition-all"
                >
                  Clear & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
