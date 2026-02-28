import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Terminal,
  Cpu,
  Rocket,
  BookOpen,
  Settings,
  Plus,
  MessageSquare,
  User,
  Bot,
  ChevronRight,
  Zap,
  Shield,
  Layers,
  MoreVertical,
  Trash2,
  Share2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jarvis } from './services/jarvisService';
import { Message, JarvisMode } from './types';

const MODES: { id: JarvisMode; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { id: 'General', label: 'General', icon: Bot, color: 'text-blue-400', desc: 'Standard Jarvis persona for general assistance.' },
  { id: 'Developer', label: 'Developer', icon: Terminal, color: 'text-emerald-400', desc: 'Deep technical focus, code quality, and architecture.' },
  { id: 'Exam', label: 'Exam', icon: BookOpen, color: 'text-purple-400', desc: 'Structured theory, definitions, and academic success.' },
  { id: 'Startup', label: 'Startup', icon: Rocket, color: 'text-orange-400', desc: 'Business strategy, scalability, and monetization.' },
  { id: 'Research', label: 'Research', icon: Cpu, color: 'text-cyan-400', desc: 'Academic depth and comprehensive exploration.' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<JarvisMode>('General');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const stream = await jarvis.streamChat(input, history, mode);

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: '',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      let fullContent = '';
      for await (const chunk of stream) {
        const text = chunk.text || '';
        fullContent += text;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.content = fullContent;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Jarvis Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: 'I encountered an error in my neural pathways. Please check my configuration or try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-jarvis-bg overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="glass-panel border-r border-jarvis-border flex flex-col relative z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-jarvis-accent/20 flex items-center justify-center border border-jarvis-accent/30 accent-glow">
            <Zap className="w-6 h-6 text-jarvis-accent" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white tracking-tight">JARVIS</h1>
            <p className="text-[10px] text-jarvis-accent font-mono uppercase tracking-widest opacity-70">Strategic Co-Pilot</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-6 py-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-3 px-2">Operational Modes</p>
            <div className="space-y-1">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${mode === m.id
                      ? 'bg-jarvis-accent/10 border border-jarvis-accent/20 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                >
                  <m.icon className={`w-4 h-4 ${mode === m.id ? m.color : 'group-hover:text-gray-200'}`} />
                  <span className="text-sm font-medium">{m.label}</span>
                  {mode === m.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-jarvis-accent shadow-[0_0_8px_#00F0FF]" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-3 px-2">System Controls</p>
            <div className="space-y-1">
              <button onClick={clearChat} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Purge Memory</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Export Logs</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-jarvis-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-jarvis-accent to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Pooja</p>
              <p className="text-[10px] text-gray-500 truncate">Lead Architect</p>
            </div>
            <Settings className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 glass-panel border-b border-jarvis-border flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
            >
              <Layers className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-jarvis-accent" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-jarvis-accent" />
                <span>Neural Engine v2.0</span>
              </div>
            </div>
            <div className="h-4 w-[1px] bg-jarvis-border hidden md:block" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-jarvis-accent/10 border border-jarvis-accent/20">
              {React.createElement(MODES.find(m => m.id === mode)?.icon || Bot, { className: "w-3 h-3 text-jarvis-accent" })}
              <span className="text-[10px] font-bold text-jarvis-accent uppercase tracking-wider">{mode}</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-3xl bg-jarvis-accent/10 flex items-center justify-center border border-jarvis-accent/20 accent-glow"
              >
                <Zap className="w-10 h-10 text-jarvis-accent" />
              </motion.div>
              <div className="space-y-4">
                <h2 className="text-4xl font-display font-bold text-white tracking-tight">How can I assist you, Pooja?</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  I am Jarvis, your strategic AI co-pilot. I'm currently operating in <span className="text-jarvis-accent font-semibold">{mode} Mode</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {[
                  { title: "Architect a RAG Pipeline", desc: "Design a scalable vector search system.", icon: Layers },
                  { title: "Optimize React Performance", desc: "Identify bottlenecks and suggest fixes.", icon: Zap },
                  { title: "Startup Growth Strategy", desc: "Analyze market fit and monetization.", icon: Rocket },
                  { title: "Deep Dive: Neural Nets", desc: "Explain backpropagation with analogies.", icon: Cpu },
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setInput(item.title)}
                    className="p-4 rounded-2xl glass-panel text-left hover:border-jarvis-accent/50 hover:bg-jarvis-accent/5 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-4 h-4 text-jarvis-accent group-hover:scale-110 transition-transform" />
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-10 h-10 rounded-xl bg-jarvis-accent/10 border border-jarvis-accent/20 flex-shrink-0 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-jarvis-accent" />
                    </div>
                  )}
                  <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-5 rounded-2xl ${msg.role === 'user'
                        ? 'bg-jarvis-accent text-black font-medium shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                        : 'glass-panel'
                      }`}>
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Jarvis Core</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1].role !== 'model' && (
                <div className="flex gap-6 justify-start">
                  <div className="w-10 h-10 rounded-xl bg-jarvis-accent/10 border border-jarvis-accent/20 flex-shrink-0 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-jarvis-accent animate-pulse" />
                  </div>
                  <div className="glass-panel p-5 rounded-2xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-jarvis-accent animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-jarvis-accent animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-jarvis-accent animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-jarvis-bg via-jarvis-bg to-transparent">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="px-4 py-1.5 rounded-full bg-jarvis-accent/10 border border-jarvis-accent/20 backdrop-blur-md flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse" />
                    <span className="text-[10px] font-mono text-jarvis-accent uppercase tracking-widest">Processing Neural Input...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="glass-panel rounded-2xl p-2 flex items-end gap-2 focus-within:border-jarvis-accent/50 transition-all shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Message Jarvis (${mode} Mode)...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-3 px-4 resize-none min-h-[56px] max-h-48 text-sm"
                rows={1}
              />
              <div className="flex items-center gap-1 p-1">
                <button className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2.5 rounded-xl transition-all ${input.trim() && !isLoading
                      ? 'bg-jarvis-accent text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-3 font-mono uppercase tracking-widest">
              Jarvis v2.0 // Neural Engine Status: Optimal // Built by Pooja
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
