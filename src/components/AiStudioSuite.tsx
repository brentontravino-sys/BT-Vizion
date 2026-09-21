import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Mic,
  Image as ImageIcon,
  Film,
  Sparkles,
  Globe,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
  Newspaper,
} from 'lucide-react';
import AiChatAssistant from './AiChatAssistant';
import AiVoiceAssistant from './AiVoiceAssistant';
import AiImageStudio from './AiImageStudio';
import AiVideoStudio from './AiVideoStudio';
import AiIndustryNews from './AiIndustryNews';
import { ScrollReveal, ScrollHeaderGradientFill } from './ScrollReveal';

type StudioTab = 'chat' | 'news' | 'voice' | 'image' | 'video';

export default function AiStudioSuite() {
  const [activeTab, setActiveTab] = useState<StudioTab>('chat');

  const tabs: Array<{
    id: StudioTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
    model: string;
    description: string;
  }> = [
    {
      id: 'chat',
      label: 'Chat & Search',
      icon: Bot,
      badge: 'Free Tier Available',
      model: 'gemini-3.8-flash & 3.1-flash-lite',
      description: 'Multi-turn autonomous chat with Google Search grounding and persona customization',
    },
    {
      id: 'news',
      label: 'Live Tech Radar',
      icon: Newspaper,
      badge: 'Google Search',
      model: 'gemini-3.8-flash + search',
      description: 'Real-time industry breakthroughs in AI automation & web development via live Google Search grounding',
    },
    {
      id: 'voice',
      label: 'Live Voice',
      icon: Mic,
      badge: 'Free Tier Available',
      model: 'gemini-3.8-live',
      description: 'Full-duplex real-time audio interaction with sub-second latency',
    },
    {
      id: 'image',
      label: 'Create & Edit Images',
      icon: ImageIcon,
      badge: 'AI Studio Preview',
      model: 'gemini-3.1-flash-image',
      description: 'High-res image generation and multi-modal photo editing via natural language',
    },
    {
      id: 'video',
      label: 'Animate to Video',
      icon: Film,
      badge: 'Veo Engine',
      model: 'veo-3.1-fast-generate-preview',
      description: 'Transform uploaded stills into cinematic 16:9 or 9:16 videos with optical flow',
    },
  ];

  return (
    <section id="ai-studio" className="relative py-24 sm:py-32 bg-transparent overflow-hidden border-t border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>BT VIZION INTELLIGENCE PLATFORM</span>
          </div>

          <ScrollHeaderGradientFill
            as="h2"
            lines={['EXPERIENCE THE POWER OF', 'NEXT-GEN GEMINI & VEO']}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          />

          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            Test-drive the cutting edge of Google's multimodal AI stack built directly into our client platform—including live search grounding, real-time voice streaming, image synthesis, and Veo video generation.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2.5 px-4 sm:px-5 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 border-blue-500/40 text-white shadow-[0_0_25px_rgba(59,130,246,0.18)]'
                    : 'bg-[#0d0d0f]/70 hover:bg-[#121216] border-white/10 text-neutral-400 hover:text-blue-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-400'
                      : 'bg-white/5 text-neutral-400 border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        isActive
                          ? 'bg-blue-950/80 border-blue-500/40 text-blue-300'
                          : 'bg-white/5 border-white/10 text-neutral-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 hidden sm:block truncate max-w-[170px]">
                    {tab.model}
                  </div>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="active-ai-indicator"
                    className="absolute -bottom-px left-4 right-4 h-0.5 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AiChatAssistant />
              </motion.div>
            )}

            {activeTab === 'news' && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AiIndustryNews />
              </motion.div>
            )}

            {activeTab === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AiVoiceAssistant />
              </motion.div>
            )}

            {activeTab === 'image' && (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AiImageStudio />
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AiVideoStudio />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
