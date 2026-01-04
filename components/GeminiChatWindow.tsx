import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Zap, Trash2, Loader2, AlertCircle, Info } from 'lucide-react';
import * as webllm from "@mlc-ai/web-llm";
import { 
  PERSONAL_INFO, technicalSkills, toolsData, softSkills, 
  experiences, projects, certifications 
} from '../data/portfolioData';

// Model configuration
// Selected Model for Local Inference - Optimizing for speed/size (1B vs 8B)
const SELECTED_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

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

export const NduChatWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // WebLLM State
  const [engine, setEngine] = useState<webllm.MLCEngineInterface | null>(null);
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
    if (!(navigator as any).gpu) {
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
      {/* Tech-Savvy Header */}
      <div className="text-center mb-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 group cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Neural Core: Active</span>
        </div>
        
        <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">
          PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">NDU-AI</span>
        </h3>
        
        <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] max-w-2xl mx-auto">
          // Private Local Inference // Llama 3.2 1B // WebGPU Accelerated
        </p>
      </div>

      {/* Main Glass UI Container */}
      <div className="max-w-4xl mx-auto relative group">
        {/* Glow behind container */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-600/10 rounded-[40px] blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative rounded-[40px] overflow-hidden bg-transparent shadow-none">
          
          {/* Diagnostic Banner (Errors) */}
          {webGPUError && (
            <div className="bg-red-500/10 border-b border-red-500/20 p-4 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">{webGPUError}</p>
            </div>
          )}

          {/* Boot Sequence (Loading) - Transparent */}
          {isInitializing && (
            <div className="p-10 border-b border-white/[0.05] bg-white/[0.01]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full"></div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400/80 uppercase tracking-[0.2em] animate-pulse">{loadStatus}</span>
                </div>
                <span className="text-lg font-mono font-black text-cyan-400">{loadProgress}%</span>
              </div>
              <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Interaction Buffer (Chat Window) - No solid bg */}
          {!hasStarted ? (
            <div className="p-16 md:p-24 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/5 flex items-center justify-center mx-auto mb-6 border border-cyan-500/20 shadow-xl transform hover:rotate-6 transition-all duration-500 group-welcome">
                  <Bot className="w-8 h-8 text-cyan-500" />
                </div>
                <h4 className="text-xl font-black mb-2 text-slate-900 dark:text-white uppercase tracking-tight">System Ready</h4>
                <p className="text-slate-400/70 mb-14 max-w-sm mx-auto font-mono text-xs uppercase tracking-widest leading-loose">
                  Select a prompt to begin neural synchronization
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="group p-6 bg-transparent hover:bg-cyan-500/5 border-none text-left transition-all duration-500"
                    >
                      <div className="text-[10px] font-mono text-cyan-500 uppercase mb-3 tracking-widest font-bold opacity-40 group-hover:opacity-100">Protocol 0{idx+1}</div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-500 dark:group-hover:text-white transition-colors">{q}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorative light effects */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] -z-10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] -z-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          ) : (
            <div 
              ref={scrollRef} 
              className="h-[650px] overflow-y-auto p-10 space-y-10 no-scrollbar custom-scrollbar"
            >
              <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
              `}</style>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === 'bot' ? (
                      <div className="w-12 h-12 rounded-2xl bg-slate-900/5 dark:bg-white/[0.02] p-3 flex items-center justify-center border border-slate-900/10 dark:border-white/10 backdrop-blur-xl shadow-xl">
                        <Bot className="w-8 h-8 text-cyan-600 dark:text-cyan-400 relative z-10" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center border border-white/20 shadow-xl">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className={`max-w-[80%] px-8 py-6 rounded-[32px] text-[15px] leading-relaxed transition-all ${
                    msg.role === 'user' 
                      ? 'bg-transparent text-slate-900 dark:text-white border-l-2 border-cyan-500/50 pl-6' 
                      : 'bg-transparent text-slate-700 dark:text-slate-200 border-l-2 border-white/10 pl-6'
                  }`}>
                    {msg.role === 'bot' ? (
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} className="markdown-content" />
                    ) : (
                      <span className="font-medium tracking-wide">{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-6 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/5 dark:bg-white/[0.02] p-3 flex items-center justify-center border border-slate-900/5 dark:border-white/10 backdrop-blur-xl">
                    <Loader2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-spin" />
                  </div>
                  <div className="bg-slate-900/[0.03] dark:bg-white/[0.01] border border-slate-900/5 dark:border-white/[0.05] px-7 py-5 rounded-[32px] rounded-tl-sm backdrop-blur-md">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Terminal Input Line - Zero Borders */}
          <div className="p-10 border-none bg-transparent">
            <div className="flex items-center gap-6 p-2 rounded-[28px] bg-transparent border-none transition-all duration-500">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resetInactivityTimer();
                }}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && !isInitializing && handleSend()}
                placeholder={isInitializing ? "TERMINAL_BUSY ..." : "EXECUTE_QUERY_ ..."}
                disabled={isLoading || isInitializing || !!webGPUError}
                className="flex-1 bg-transparent border-none py-5 px-6 text-slate-950 dark:text-white text-[15px] font-mono tracking-wider focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-800 disabled:opacity-30 uppercase"
              />
              <div className="flex gap-3 pr-2">
                <button 
                  onClick={requestClearChat}
                  disabled={messages.length === 0}
                  className="w-14 h-14 flex items-center justify-center bg-transparent hover:bg-red-500/10 border border-slate-900/5 dark:border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-600 rounded-2xl transition-all disabled:opacity-10 group"
                  title="WIPE HISTORY"
                >
                  <Trash2 size={20} className="transform group-hover:scale-90 transition-transform" />
                </button>
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || isInitializing || !input.trim() || !!webGPUError}
                  className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-20 disabled:grayscale transition-all text-white rounded-2xl group"
                >
                  <Send size={20} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-8">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <p className="text-[10px] text-slate-700 font-mono tracking-[0.4em] uppercase font-black">
                Neural Proxy Optimized for Davidson.v1.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Overlays */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 p-12 rounded-[40px] shadow-3xl text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8 mx-auto">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Execute Purge?</h3>
            <p className="text-slate-500 text-sm mb-12 font-mono uppercase tracking-widest leading-loose">Destroy all local conversational telemetry stored in the synaptic buffer?</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmClear} className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl transition-all transform active:scale-95 uppercase text-xs tracking-widest">Confirm Purge</button>
              <button onClick={() => setShowClearConfirm(false)} className="w-full py-5 text-slate-600 hover:text-slate-300 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

