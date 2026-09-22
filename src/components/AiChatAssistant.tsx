import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Sparkles,
  Globe,
  RefreshCw,
  Copy,
  Check,
  User,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  groundingChunks?: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
  webSearchQueries?: string[];
  modelUsed?: string;
}

const ROLES = [
  {
    id: 'consultant',
    name: 'Digital Strategy Consultant',
    description: 'Enterprise digital transformation, ROI analysis & digital ecosystems',
    instruction:
      'You are the Senior Digital Strategy Consultant at BT Vizion, a premier global digital agency. You advise enterprise leaders on digital transformation, AI adoption, revenue systems, and custom web engineering. Be analytical, articulate, practical, and highly strategic.',
  },
  {
    id: 'architect',
    name: 'Lead AI Systems Architect',
    description: 'Full-stack software engineering, autonomous agents & cloud scale',
    instruction:
      'You are the Lead Systems Architect at BT Vizion. You specialize in full-stack web applications, TypeScript, Next.js, Node.js, autonomous AI agent pipelines, vector databases, and resilient cloud architecture. Provide clear, modular technical answers with code snippets and system diagrams where helpful.',
  },
  {
    id: 'growth',
    name: 'Growth & Performance Lead',
    description: 'Data-driven marketing, SEO optimization & conversion engines',
    instruction:
      'You are the Head of Growth Engineering at BT Vizion. You specialize in conversion rate optimization (CRO), search engine visibility, hyper-targeted digital funnels, and algorithmic marketing systems. Provide data-backed recommendations with actionable metrics.',
  },
];

const MODELS = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    badge: 'Standard & Free',
    desc: 'Deep reasoning, multimodal context and Google search support',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    badge: 'Ultra Fast',
    desc: 'Instant latency for high-speed queries and rapid iterations',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    badge: 'Complex Logic',
    desc: 'Advanced problem solving, intricate code & STEM reasoning',
  },
];

const QUICK_PROMPTS = [
  'How can AI agents reduce operational overhead for a modern enterprise?',
  'What are the best architectural practices for modern high-performance web apps?',
  'Latest trends in AI-driven conversion rate optimization in 2026',
  'Draft a 90-day digital modernization roadmap for an enterprise',
];

export default function AiChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Hello! I am the BT Vizion Autonomous Intelligence Assistant. How can I assist you with your digital strategy, custom software architecture, or AI automation initiatives today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [useSearch, setUseSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build server request payload with conversation history
      const historyPayload = newMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const result = await safeFetchJson<{
        reply?: string;
        groundingChunks?: any[];
        webSearchQueries?: string[];
        modelUsed?: string;
        isQuotaFallback?: boolean;
        quotaNotice?: string;
        error?: string;
      }>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          systemInstruction: selectedRole.instruction,
          model: selectedModel,
          useSearch,
        }),
      });

      if (!result.ok && !result.data?.reply) {
        if (result.isQuota) {
          throw new Error(
            'Gemini API Quota Exceeded (429): The active API key has reached its rate limit. Please switch to Gemini 3.1 Flash Lite or try again in a moment.'
          );
        }
        throw new Error(result.error || 'Failed to receive response from server.');
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: result.data.reply || 'No response returned from model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingChunks: result.data.groundingChunks,
        webSearchQueries: result.data.webSearchQueries,
        modelUsed: result.data.modelUsed,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat submit error:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the Gemini server. Please verify your connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Conversation reset. Acting as ${selectedRole.name}. What shall we explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="w-full bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[740px] shadow-2xl">
      {/* Top Configuration Header */}
      <div className="p-4 bg-[#121216] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* Role Selector */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/15">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-neutral-400 font-mono">ROLE:</label>
              <select
                value={selectedRole.id}
                onChange={(e) => {
                  const role = ROLES.find((r) => r.id === e.target.value) || ROLES[0];
                  setSelectedRole(role);
                }}
                className="bg-neutral-900 border border-white/15 text-white text-xs font-semibold rounded-md px-2.5 py-1 focus:outline-none focus:border-white/40 cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-neutral-400 truncate max-w-[260px] sm:max-w-xs">
              {selectedRole.description}
            </p>
          </div>
        </div>

        {/* Controls: Model & Google Search Toggle */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-neutral-900 border border-white/15 text-white text-xs font-mono rounded-md px-2.5 py-1.5 focus:outline-none focus:border-white/40 cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.badge})
              </option>
            ))}
          </select>

          {/* Google Search Grounding Toggle */}
          <button
            type="button"
            onClick={() => setUseSearch(!useSearch)}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-md border font-medium transition-all ${
              useSearch
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Search Grounding with Google Search tool"
          >
            <Globe className={`w-3.5 h-3.5 ${useSearch ? 'text-blue-400 animate-spin-slow' : ''}`} />
            <span>Google Search</span>
            {useSearch && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-0.5" />
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleClearHistory}
            className="p-1.5 rounded-md border border-white/10 bg-neutral-900 text-neutral-400 hover:text-white hover:border-white/25 transition-all"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-white text-black border-white'
                    : 'bg-[#18181f] text-white border-white/15'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-400" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed border ${
                  isUser
                    ? 'bg-white text-neutral-950 border-white font-medium rounded-tr-sm'
                    : 'bg-[#141419] text-neutral-200 border-white/10 rounded-tl-sm'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5 border-b border-white/5 pb-1">
                  <span className="font-semibold uppercase tracking-wider">
                    {isUser ? 'You' : selectedRole.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {msg.modelUsed && !isUser && (
                      <span className="font-mono text-[9px] text-neutral-400 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                        {msg.modelUsed}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap select-text font-sans">{msg.content}</div>

                {/* Google Search Grounding Sources */}
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-blue-400 mb-1.5">
                      <Globe className="w-3 h-3" />
                      <span>Google Search Grounding Sources ({msg.groundingChunks.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingChunks.map((chunk, idx) => {
                        const uri = chunk.web?.uri;
                        const title = chunk.web?.title || uri;
                        if (!uri) return null;
                        return (
                          <a
                            key={idx}
                            href={uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-blue-300 hover:bg-blue-900/50 hover:border-blue-400 text-[11px] transition-all max-w-[240px] truncate"
                          >
                            <span className="truncate">{title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#18181f] text-blue-400 border border-white/15 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-[#141419] border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-neutral-400 flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
              </div>
              <span className="text-xs font-mono">
                {useSearch ? 'Grounding with Google Search...' : 'Generating strategic response...'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts quick bar */}
      <div className="px-4 py-2 bg-[#0f0f13] border-t border-white/5 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Prompts:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Input Field */}
      <div className="p-4 bg-[#121216] border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${selectedRole.name}... (Press Enter to send, Shift+Enter for newline)`}
              rows={2}
              className="w-full bg-[#0a0a0d] border border-white/15 focus:border-white/40 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none resize-none font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 px-5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
