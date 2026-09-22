import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

export interface FloatingChatMessage {
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

interface ChatRole {
  id: string;
  nameEn: string;
  nameEs: string;
  descEn: string;
  descEs: string;
  instruction: string;
}

const CHAT_ROLES: ChatRole[] = [
  {
    id: 'solutions',
    nameEn: 'Solutions Advisor',
    nameEs: 'Asesor de Soluciones',
    descEn: 'General advisory, client strategy & digital capabilities',
    descEs: 'Asesoría general, estrategia y capacidades digitales',
    instruction:
      'You are the official BTV AI Chatbot for BT Vizion (btvizion.com), an elite next-generation digital studio. You assist executives, developers, and potential clients in discovering BT Vizion’s core capabilities: custom modern web development (React, Next.js, Node.js), autonomous AI agent systems, workflow automation, and digital performance ecosystems. Keep your answers concise, intelligent, practical, and highly polished.',
  },
  {
    id: 'architect',
    nameEn: 'Systems Architect',
    nameEs: 'Arquitecto de Sistemas',
    descEn: 'Technical architecture, AI pipelines & cloud infrastructure',
    descEs: 'Arquitectura técnica, pipelines de IA e infraestructura cloud',
    instruction:
      'You are the Lead Systems Architect at BT Vizion. You specialize in full-stack web engineering, TypeScript, high-performance distributed architectures, vector databases, and multi-agent AI pipelines. Provide rigorous, structured technical insights with clear recommendations and modular patterns.',
  },
  {
    id: 'growth',
    nameEn: 'Growth Strategist',
    nameEs: 'Estratega de Crecimiento',
    descEn: 'Conversion rate optimization, ROI calculation & funnels',
    descEs: 'Optimización de conversión, cálculo de ROI y embudos',
    instruction:
      'You are the Head of Growth and Automation ROI at BT Vizion. You assist clients in calculating potential operational savings, automating customer touchpoints, and driving conversion through intelligent digital experiences.',
  },
];

interface ModelOption {
  id: string;
  name: string;
  badge: string;
  desc: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    badge: 'General Tasks',
    desc: 'Balanced reasoning, fast responses & Google search grounding',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    badge: 'Fast & Lite',
    desc: 'Ultra-low latency for instant interactions and high-speed Q&A',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    badge: 'Complex Logic',
    desc: 'Advanced problem solving, complex code & enterprise reasoning',
  },
];

const STARTER_PROMPTS_EN = [
  'What enterprise AI services does BT Vizion engineer?',
  'How do autonomous agent swarms cut operational costs?',
  'What is the typical timeline for a custom web project?',
];

const STARTER_PROMPTS_ES = [
  '¿Qué servicios de IA empresarial desarrolla BT Vizion?',
  '¿Cómo reducen costos operativos los agentes autónomos?',
  '¿Cuál es el tiempo estimado para un proyecto web a medida?',
];

export default function FloatingChatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ChatRole>(CHAT_ROLES[0]);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [useSearch, setUseSearch] = useState<boolean>(true);

  const initialGreetingEn =
    'Hello! I am the BTV AI Assistant. How can I assist you with your digital strategy, custom software architecture, or AI automation initiatives?';
  const initialGreetingEs =
    '¡Hola! Soy el Asistente de IA de BT Vizion. ¿Cómo puedo ayudarte con tu estrategia digital, arquitectura de software o automatización con IA?';

  const [messages, setMessages] = useState<FloatingChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: language === 'es' ? initialGreetingEs : initialGreetingEn,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages or loading state
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus textarea on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, messages, isLoading]);

  // Update welcome message if user toggles language and no user messages sent yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          content: language === 'es' ? initialGreetingEs : initialGreetingEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language]);

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: language === 'es' ? initialGreetingEs : initialGreetingEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
    setInput('');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);

    const userMessage: FloatingChatMessage = {
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
      // Build server request payload with multi-turn conversation history
      const historyPayload = newMessages
        .filter((m) => !m.id.startsWith('welcome'))
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // Augment system instruction with language awareness
      const fullSystemInstruction = `${selectedRole.instruction}\n\nIMPORTANT: Please answer the user in ${
        language === 'es' ? 'Spanish (Español)' : 'English'
      } unless the user explicitly asks for another language. Always maintain a professional, concise, and helpful tone.`;

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
          systemInstruction: fullSystemInstruction,
          model: selectedModel,
          useSearch,
        }),
      });

      if (!result.ok && !result.data?.reply) {
        if (result.isQuota) {
          throw new Error(
            language === 'es'
              ? 'Límite de cuota alcanzado. Cambiando automáticamente al modo de alta velocidad.'
              : 'Gemini API limit reached. Switching to high-speed mode.'
          );
        }
        throw new Error(
          result.error ||
            (language === 'es'
              ? 'No se pudo recibir respuesta del servidor.'
              : 'Failed to receive response from server.')
        );
      }

      const botMessage: FloatingChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: result.data.reply || (language === 'es' ? 'Sin respuesta.' : 'No response.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingChunks: result.data.groundingChunks,
        webSearchQueries: result.data.webSearchQueries,
        modelUsed: result.data.modelUsed,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('BTV Floating Chatbot Error:', err);
      setErrorMessage(
        err.message ||
          (language === 'es'
            ? 'Error de conexión con el asistente.'
            : 'Unable to connect to BTV AI Assistant.')
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

  const starterPrompts = language === 'es' ? STARTER_PROMPTS_ES : STARTER_PROMPTS_EN;
  const currentRoleName = language === 'es' ? selectedRole.nameEs : selectedRole.nameEn;

  return (
    <>
      {/* Floating Trigger Button (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              id="btv-chatbot-trigger"
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open BTV AI Chatbot"
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-[#111114]/90 hover:bg-[#18181d] text-white border border-white/20 hover:border-white/50 shadow-2xl backdrop-blur-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {/* Online Pulse Indicator */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>

              {/* Bot Icon */}
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>

              {/* Text Label */}
              <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider">
                <span className="font-bold text-white">BTV</span>
                <span className="text-blue-400 uppercase text-[10px] hidden sm:inline">AI Chat</span>
              </div>

              {/* Sparkle Accent */}
              <Sparkles className="w-3 h-3 text-blue-400/80 group-hover:text-blue-300 transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window (Bottom-Left) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="btv-chatbot-window"
            initial={{ opacity: 0, scale: 0.92, y: 20, x: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20, x: -10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 w-[calc(100vw-2.5rem)] sm:w-[390px] h-[540px] max-h-[82vh] bg-[#0c0c0f]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-neutral-100"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#131318]/90 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#131318]"></span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold tracking-tight text-white">BTV CHATBOT</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-blue-500/15 text-blue-300 border border-blue-500/20">
                      Gemini
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1 truncate max-w-[170px]">
                    <span className="w-1 h-1 rounded-full bg-blue-400 inline-block"></span>
                    <span className="truncate">{currentRoleName}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                {/* Settings toggle */}
                <button
                  id="btv-chat-toggle-settings"
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  title={language === 'es' ? 'Configuración de Modelo y Rol' : 'Model & Role Configuration'}
                  className={`p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors ${
                    showSettings ? 'bg-white/10 text-white' : 'hover:bg-white/5'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>

                {/* Reset Chat */}
                <button
                  id="btv-chat-reset-button"
                  type="button"
                  onClick={handleReset}
                  title={language === 'es' ? 'Reiniciar conversación' : 'Reset conversation'}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Close Button */}
                <button
                  id="btv-chat-close-button"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title={language === 'es' ? 'Cerrar chat' : 'Close chat'}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors ml-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collapsible Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="bg-[#101015] border-b border-white/10 px-4 py-2.5 text-xs overflow-hidden shrink-0 space-y-2.5"
                >
                  {/* Role Selector */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      {language === 'es' ? 'Rol del Chatbot' : 'Chatbot Persona'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CHAT_ROLES.map((role) => {
                        const isSelected = selectedRole.id === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-medium border text-center transition-all truncate ${
                              isSelected
                                ? 'bg-blue-600/30 border-blue-500/60 text-white font-semibold shadow-sm'
                                : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {language === 'es' ? role.nameEs : role.nameEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Model Selector */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      {language === 'es' ? 'Modelo Gemini' : 'Gemini Model Engine'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {MODEL_OPTIONS.map((m) => {
                        const isSelected = selectedModel === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedModel(m.id)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] border text-center transition-all flex flex-col items-center gap-0.5 ${
                              isSelected
                                ? 'bg-white/15 border-white/40 text-white font-medium shadow-sm'
                                : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="font-semibold truncate w-full">{m.name.replace('Gemini ', '')}</span>
                            <span className="text-[8px] text-neutral-400 truncate">{m.badge}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Google Search Grounding toggle */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-400" />
                      {language === 'es' ? 'Búsqueda Google en vivo' : 'Google Search Grounding'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUseSearch(!useSearch)}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                        useSearch ? 'bg-blue-600' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                          useSearch ? 'translate-x-3.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 font-sans text-xs scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`relative group max-w-[84%] rounded-2xl p-3 ${
                        isUser
                          ? 'bg-neutral-800/90 text-white rounded-tr-sm border border-white/15'
                          : 'bg-[#15151b] text-neutral-200 rounded-tl-sm border border-white/10 shadow-sm'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="whitespace-pre-wrap select-text leading-relaxed text-[12px]">
                        {msg.content}
                      </div>

                      {/* Google Search Grounding Sources */}
                      {!isUser && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1 text-[10px] text-blue-400 font-medium mb-1">
                            <Globe className="w-2.5 h-2.5" />
                            <span>{language === 'es' ? 'Fuentes en tiempo real' : 'Grounding Sources'}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {msg.groundingChunks.slice(0, 3).map((chunk, idx) => {
                              const uri = chunk.web?.uri;
                              const title = chunk.web?.title || uri;
                              if (!uri) return null;
                              return (
                                <a
                                  key={idx}
                                  href={uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-950/40 border border-blue-500/20 text-blue-300 hover:bg-blue-900/40 text-[9px] max-w-[170px] truncate"
                                >
                                  <span className="truncate">{title}</span>
                                  <ExternalLink className="w-2 h-2 shrink-0 opacity-70" />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Message Meta & Copy */}
                      <div className="mt-1.5 flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
                        <span className="font-mono">{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title={language === 'es' ? 'Copiar texto' : 'Copy text'}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-white"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 justify-start">
                  <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 animate-spin-slow" />
                  </div>
                  <div className="bg-[#15151b] border border-white/10 rounded-2xl rounded-tl-sm p-3 text-neutral-400 flex items-center gap-2">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                    </div>
                    <span className="text-[10px] font-mono">
                      {useSearch
                        ? language === 'es'
                          ? 'Buscando en Google...'
                          : 'Grounding via Google Search...'
                        : language === 'es'
                        ? 'Sintetizando...'
                        : 'Thinking...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-[11px] flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Prompts (Shown if only welcome message) */}
            {messages.length === 1 && (
              <div className="px-3.5 py-1.5 bg-[#0f0f13] border-t border-white/5 flex flex-col gap-1 shrink-0">
                <span className="text-[9px] text-neutral-400 uppercase font-mono tracking-wider flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {language === 'es' ? 'Consultas rápidas:' : 'Quick Prompts:'}
                </span>
                <div className="flex flex-col gap-1">
                  {starterPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-[10px] text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md border border-white/5 transition-all truncate"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-2.5 bg-[#121217] border-t border-white/10 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-1.5 bg-[#18181f] border border-white/10 rounded-xl p-1.5 focus-within:border-white/30 transition-colors"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    language === 'es'
                      ? 'Escribe tu consulta a BTV...'
                      : 'Ask BTV AI anything...'
                  }
                  rows={1}
                  className="flex-1 bg-transparent text-white placeholder-neutral-500 text-xs px-2 py-1 resize-none focus:outline-none max-h-20 min-h-[28px] leading-relaxed"
                />

                <button
                  id="btv-chat-send-button"
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  title={language === 'es' ? 'Enviar mensaje' : 'Send message'}
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 text-white transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Minimal Footer Info */}
              <div className="mt-1.5 px-1 flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                <span>{selectedModel.replace('gemini-', 'Gemini ')}</span>
                <span>Enter ↵</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
