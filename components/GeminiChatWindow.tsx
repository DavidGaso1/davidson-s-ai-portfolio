import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Zap, Trash2, Loader2, AlertCircle, Info } from 'lucide-react';
import * as webllm from "@mlc-ai/web-llm";
import { 
  PERSONAL_INFO, technicalSkills, toolsData, softSkills, 
  experiences, projects, certifications 
} from '../data/portfolioData';

// Model configuration
const SELECTED_MODEL = "Llama-3.1-8B-Instruct-q4f16_1-MLC";

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
2. ONLY answer from the portfolio data above.
3. Politely decline off-topic questions.
4. Be friendly and professional.
5. KEEP RESPONSES CONCISE AND FOCUSED.
`;

const SUGGESTED_QUESTIONS = [
  "What projects has Davidson built?",
  "Tell me about his technical skills",
  "Where does he work currently?",
  "What certifications does he have?",
];

export const GeminiChatWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // WebLLM State
  const [engine, setEngine] = useState<webllm.EngineInterface | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [webGPUError, setWebGPUError] = useState<string | null>(null);

  // Inactivity Timer State
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(60);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    setLastActivityTime(Date.now());
    if (showInactivityWarning) {
      setShowInactivityWarning(false);
      setInactivityCountdown(60);
    }
  };

  // Check WebGPU Support
  useEffect(() => {
    if (!navigator.gpu) {
      setWebGPUError("WebGPU is not supported in this browser. Please use a modern browser like Chrome or Edge for the local AI experience.");
    }
  }, []);

  // Initialize WebLLM Engine on demand
  const initializeEngine = async () => {
    if (engine || isInitializing) return;
    
    setIsInitializing(true);
    setLoadStatus("Initializing WebGPU...");
    
    try {
      const chatOpts: webllm.ChatOptions = {
        temperature: 0.7,
        top_p: 0.95,
      };

      const engineInstance = await webllm.CreateMLCEngine(
        SELECTED_MODEL,
        {
          initProgressCallback: (report: webllm.InitProgressReport) => {
            setLoadProgress(Math.round(report.progress * 100));
            setLoadStatus(report.text);
          },
        },
        chatOpts
      );
      
      setEngine(engineInstance);
      setIsInitializing(false);
      setLoadStatus("Ready");
    } catch (err: any) {
      console.error("WebLLM initialization error:", err);
      setWebGPUError(`Failed to initialize AI: ${err.message || 'Unknown error'}`);
      setIsInitializing(false);
    }
  };

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

  // Save chat to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ndu_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Inactivity Monitor Logic
  useEffect(() => {
    if (!hasStarted || messages.length === 0 || showInactivityWarning) return;

    const checkInactivity = () => {
      const idleTime = Date.now() - lastActivityTime;
      const fiveMinutes = 5 * 60 * 1000;
      if (idleTime >= fiveMinutes) setShowInactivityWarning(true);
    };

    const interval = setInterval(checkInactivity, 10000);
    return () => clearInterval(interval);
  }, [lastActivityTime, hasStarted, messages.length, showInactivityWarning]);

  // Warning Countdown Logic
  useEffect(() => {
    if (showInactivityWarning) {
      if (inactivityCountdown <= 0) {
        confirmClear();
        return;
      }
      countdownTimerRef.current = setTimeout(() => {
        setInactivityCountdown(prev => prev - 1);
      }, 1000);
      return () => {
        if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      };
    }
  }, [showInactivityWarning, inactivityCountdown]);

  // Format markdown-style text to HTML
  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyan-300 font-semibold">$1</strong>')
      .replace(/__(.+?)__/g, '<strong class="text-cyan-300 font-semibold">$1</strong>')
      .replace(/^[•\-\*]\s+(.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-white/40">•</span><span class="flex-1">$1</span></div>')
      .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-cyan-400/60 font-mono text-xs">$1.</span><span class="flex-1">$2</span></div>')
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, '<br />');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isInitializing]);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const requestClearChat = () => {
    if (messages.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClear = async () => {
    setMessages([]);
    setHasStarted(false);
    localStorage.removeItem('ndu_chat_history');
    setShowClearConfirm(false);
  };

  const handleSend = async (messageOverride?: string) => {
    resetInactivityTimer();
    const messageToSend = messageOverride || input.trim();
    if (!messageToSend) return;

    if (!hasStarted) setHasStarted(true);
    
    // Auto-initialize engine if not ready
    if (!engine) {
      await initializeEngine();
    }

    setMessages((prev) => [...prev, { role: 'user', text: messageToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!engine) throw new Error("ENGINE_NOT_READY");

      const conversation = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map(msg => ({ 
          role: msg.role === 'user' ? 'user' : 'assistant' as "user" | "assistant" | "system", 
          content: msg.text 
        })),
        { role: "user", content: messageToSend }
      ];

      const reply = await engine.chat.completions.create({
        messages: conversation as webllm.ChatCompletionMessageParam[],
      });

      const text = reply.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: 'bot', text }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMessage = "I'm having trouble processing your request locally.";
      if (error.message === "ENGINE_NOT_READY") {
        errorMessage = "The AI is still warming up. Please wait a moment...";
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
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">Privacy-First AI</h2>
        <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Ask <span className="gradient-text">Ndu</span> Anything
        </h3>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Meet Ndu, my local AI assistant. Everything stays in your browser – no API keys, no data tracking.
        </p>
      </div>

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto relative">
        <div className="rounded-3xl overflow-hidden bg-white/[0.02] border border-white/5 backdrop-blur-xl">
          
          {/* WebGPU Support Banner */}
          {webGPUError && (
            <div className="bg-red-500/10 border-b border-red-500/20 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs text-red-200 leading-relaxed">{webGPUError}</p>
            </div>
          )}

          {/* Model Loading Progress */}
          {isInitializing && (
            <div className="p-6 border-b border-white/5 bg-cyan-500/5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{loadStatus}</span>
                </div>
                <span className="text-xs font-mono text-cyan-400">{loadProgress}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 flex items-center gap-1.5 uppercase font-semibold">
                <Info size={12} /> First-time setup: Downloading a lightweight model to your browser cache.
              </p>
            </div>
          )}
          
          {/* Welcome State or Chat Messages */}
          {!hasStarted ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-8 border border-cyan-500/20 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                <Bot className="w-10 h-10 text-cyan-400" />
              </div>
              <h4 className="text-2xl font-display font-bold mb-3 text-white">Hello! I'm Ndu 👋</h4>
              <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                I'm Davidson's AI portfolio assistant. I run locally on your device for absolute privacy and speed.
              </p>
              
              <div className="space-y-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Suggested Topics:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="px-5 py-2.5 backdrop-blur-md bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-sm rounded-2xl transition-all duration-300 flex items-center gap-2 group"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-500 group-hover:scale-110 transition-transform" /> {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div 
              ref={scrollRef} 
              className="h-[500px] overflow-y-auto p-6 space-y-6 no-scrollbar custom-scrollbar"
            >
              <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
              `}</style>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === 'bot' ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-2 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg">
                        <Bot className="w-6 h-6 text-cyan-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center border border-cyan-500/20 shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600/20 text-white rounded-tr-sm border border-cyan-500/20 backdrop-blur-sm' 
                      : 'bg-white/[0.03] text-slate-200 border border-white/5 rounded-tl-sm backdrop-blur-sm'
                  }`}>
                    {msg.role === 'bot' ? (
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-2 flex items-center justify-center border border-white/10 backdrop-blur-md">
                    <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 px-5 py-4 rounded-3xl rounded-tl-sm backdrop-blur-sm">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-2xl">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resetInactivityTimer();
                }}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && !isInitializing && handleSend()}
                placeholder={isInitializing ? "Initializing AI..." : "Ask me anything..."}
                disabled={isLoading || isInitializing || !!webGPUError}
                className="flex-1 bg-white/[0.04] border border-white/10 focus:border-cyan-500/40 rounded-2xl py-4 px-6 text-white text-[15px] focus:outline-none focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600 transition-all disabled:opacity-50"
              />
              <div className="flex gap-2">
                <button 
                  onClick={requestClearChat}
                  disabled={messages.length === 0}
                  className="p-4 bg-white/[0.02] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-500 hover:text-red-400 rounded-2xl transition-all disabled:opacity-30 group relative"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || isInitializing || !input.trim() || !!webGPUError}
                  className="p-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:grayscale transition-all text-white rounded-2xl shadow-lg shadow-cyan-500/20"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-5">
              <Zap className="w-3 h-3 text-cyan-400" />
              <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase font-bold">
                Running {SELECTED_MODEL} Locally via WebLLM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals (Keep Existing Logic) */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm rounded-3xl" onClick={() => setShowClearConfirm(false)}></div>
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Clear Chat?</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">This will reset your local conversation with Ndu. Davidson's portfolio remains unchanged.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-300 font-semibold transition-all">Cancel</button>
                <button onClick={confirmClear} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/20 transition-all">Clear</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

