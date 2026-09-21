import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Cpu, Code2, LineChart, ArrowRight, Box, Sparkles, Database } from 'lucide-react';
import { AGENCY_INFO } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  ScrollingTicker,
  ScrollHeaderGradientFill,
  SpotlightCard,
} from './ScrollReveal';
import ThreeDSceneCanvas from './ThreeDSceneCanvas';

interface HeroProps {
  onOpenContact: () => void;
}

export default function Hero({ onOpenContact }: HeroProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'web' | 'ai' | 'growth'>('web');

  return (
    <section id="hero" className="relative pt-32 pb-0 md:pt-44 md:pb-0 overflow-hidden bg-transparent">
      {/* Layer 1: Ambient animated radial glow & depth grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_25%,#000_65%,transparent_100%)] pointer-events-none z-[1]" />

      {/* Layer 2: Volumetric light flares adding multi-plane atmospheric depth */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,rgba(147,51,234,0.06)_40%,transparent_70%)] blur-[110px] pointer-events-none z-[1]" />
      <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)] blur-[100px] pointer-events-none z-[1]" />

      {/* Layer 3: Animated floating coordinate HUD rings */}
      <div className="absolute top-28 right-8 w-72 h-72 rounded-full border border-blue-500/10 pointer-events-none z-[1] hidden xl:block animate-[spin_60s_linear_infinite]">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 border border-blue-400/40 bg-blue-500/20" />
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400/50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 pb-20 md:pb-24">
        {/* Top Hero Section: Headline, Tagline, CTAs alongside Centered 3D Holographic Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Eyebrow, Main Headline (reduced by 10px), Subtext, CTAs, Trust */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Tagline / Eyebrow badge with glowing HUD indicator */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 px-4 py-2 border border-white/20 bg-neutral-950/80 mb-8 text-xs text-neutral-300 uppercase tracking-widest backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              <span className="font-semibold text-white">BT VIZION</span>
              <span className="text-neutral-500">•</span>
              <span>{t.hero.tagline}</span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-blue-400/80 pl-2 border-l border-white/15">
                {language === 'en' ? '3D ORBITAL MATRIX ACTIVE' : 'MATRIZ ORBITAL 3D ACTIVA'}
              </span>
            </motion.div>

            {/* Main Headline with luminous gradient fill on scroll */}
            <ScrollHeaderGradientFill
              as="h1"
              lines={t.hero.headline}
              className="text-[26px] sm:text-[50px] md:text-[62px] lg:text-[86px] font-extrabold tracking-tight leading-[1.05]"
              offset={['start 0.08', 'end -0.35']}
            />

            {/* Sub-text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-7 text-base sm:text-lg lg:text-xl text-neutral-300 max-w-2xl leading-relaxed font-normal"
            >
              {t.hero.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                id="hero-primary-cta"
                onClick={onOpenContact}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(255,255,255,0.2)]"
              >
                <span>{language === 'en' ? 'Start Your Project' : 'Iniciar Proyecto'}</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>

              <a
                id="hero-secondary-cta"
                href="#work"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-medium text-xs uppercase tracking-wider hover:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/40"
              >
                <span>{language === 'en' ? 'Explore Portfolio' : 'Explorar Portafolio'}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-y-3 gap-x-8 text-xs text-neutral-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>{language === 'en' ? 'POPIA & GDPR Aligned' : 'Alineado con POPIA y GDPR'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>{language === 'en' ? '99.9% Verified Uptime SLA' : 'SLA de Disponibilidad 99.9%'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>{language === 'en' ? 'Rapid 2-4 Week Delivery' : 'Entrega Rápida en 2-4 Semanas'}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Holographic Globe Centered next to Heading */}
          <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] aspect-square flex items-center justify-center">
              {/* Radial focal glow behind globe */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,rgba(147,51,234,0.06)_45%,transparent_72%)] blur-2xl pointer-events-none" />

              {/* Decorative Holographic HUD Corner Accents */}
              <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-blue-400/40 pointer-events-none" />
              <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-blue-400/40 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-blue-400/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-blue-400/40 pointer-events-none" />

              {/* Orbit HUD badge */}
              <div className="absolute -bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/85 border border-white/15 text-[10px] font-mono text-neutral-300 uppercase tracking-widest backdrop-blur-md flex items-center gap-2 pointer-events-none z-10 shadow-lg whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                <span>3D ORBITAL MATRIX // ACTIVE</span>
              </div>

              {/* 3D Scene Canvas - Centered directly next to heading */}
              <ThreeDSceneCanvas className="w-full h-full relative z-0" interactive={true} />
            </div>
          </div>
        </div>

        {/* Relocated Section: Below the Hero, right next to the "65+ Solutions Deployed" metrics */}
        <div className="mt-20 pt-16 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: The "65+ Solutions Deployed" Key Performance Stats */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-blue-400 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  [ 01 // PRODUCTION RECORD ]
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
                  Verified Enterprise Scale &amp; Performance
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  Real-time indicators across our global digital infrastructure, demonstrating business impact and system reliability.
                </p>
              </div>

              {/* Stats Grid */}
              <ScrollStagger staggerDelay={0.1} className="grid grid-cols-2 gap-4">
                {AGENCY_INFO.stats.map((stat, i) => (
                   <ScrollStaggerItem key={i}>
                    <div className="border border-blue-500/20 bg-neutral-950/80 backdrop-blur-md p-4 sm:p-5 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.14)] transition-all">
                      <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight font-mono">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-wider text-neutral-300 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </ScrollStaggerItem>
                ))}
              </ScrollStagger>

              {/* Verified Trust Statement */}
              <div className="p-4 border border-blue-500/30 bg-blue-950/30 backdrop-blur-sm flex items-start gap-3 text-xs text-neutral-300">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Every solution deployed is backed by automated CI/CD pipelines, global edge caching, and strict data privacy compliance.
                </span>
              </div>
            </div>

            {/* Right Column: Clean Interactive Ecosystem Architecture Terminal (Clean 2D styling, no 3D card tilt) */}
            <div className="lg:col-span-7">
              <SpotlightCard
                spotlightColor="rgba(59, 130, 246, 0.12)"
                className="border border-blue-500/25 bg-neutral-950/90 backdrop-blur-xl p-6 md:p-8 rounded-none shadow-2xl hover:border-blue-400/40 transition-colors"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="text-[11px] font-mono text-neutral-300 ml-2">btvizion.engine // live-telemetry</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono px-2 py-0.5 border border-blue-400/30 text-blue-300 bg-blue-950/50">
                    <Box className="w-3 h-3 text-blue-400" />
                    <span>SYSTEM RUNTIME</span>
                  </div>
                </div>

                {/* Interactive Tabs */}
                <div className="grid grid-cols-3 gap-1 mb-6 border border-white/10 p-1 bg-[#09090b]">
                  <button
                    onClick={() => setActiveTab('web')}
                    className={`py-2 text-[11px] font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                      activeTab === 'web'
                        ? 'bg-blue-500 text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                        : 'text-neutral-400 hover:text-blue-300'
                    }`}
                  >
                    Web Stack
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`py-2 text-[11px] font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                      activeTab === 'ai'
                        ? 'bg-blue-500 text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                        : 'text-neutral-400 hover:text-blue-300'
                    }`}
                  >
                    AI Agents
                  </button>
                  <button
                    onClick={() => setActiveTab('growth')}
                    className={`py-2 text-[11px] font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                      activeTab === 'growth'
                        ? 'bg-blue-500 text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                        : 'text-neutral-400 hover:text-blue-300'
                    }`}
                  >
                    Growth SEO
                  </button>
                </div>

                {/* Dynamic Tab Content */}
                <div>
                  {activeTab === 'web' && (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                              High-Performance Web Architecture
                            </h4>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            React 19 + TypeScript + Edge acceleration
                          </p>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          99.98% Healthy
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="border border-white/10 p-3 bg-black/80 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
                          <div className="text-[10px] uppercase text-neutral-500 font-mono">Core Web Vitals</div>
                          <div className="text-xl font-bold text-white mt-0.5">100 / 100</div>
                          <div className="text-[10px] text-neutral-400 mt-1">Google PageSpeed score</div>
                        </div>
                        <div className="border border-white/10 p-3 bg-black/80 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
                          <div className="text-[10px] uppercase text-neutral-500 font-mono">Average Latency</div>
                          <div className="text-xl font-bold text-white mt-0.5">&lt; 380ms</div>
                          <div className="text-[10px] text-neutral-400 mt-1">Global Edge Caching</div>
                        </div>
                      </div>

                      <div className="border border-white/10 p-3 bg-black/80 font-mono text-[11px] text-neutral-300 space-y-1">
                        <div className="text-neutral-500">&gt; npm run deploy:production</div>
                        <div className="text-white">✔ Optimized asset bundles generated (128kb gzipped)</div>
                        <div className="text-neutral-400">✔ SSL certificates verified &amp; edge distributed</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ai' && (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                              Autonomous AI Triage Engine
                            </h4>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            WhatsApp + Web LLM knowledge retrieval (RAG)
                          </p>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          24/7 Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="border border-white/10 p-3 bg-black/80 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
                          <div className="text-[10px] uppercase text-neutral-500 font-mono">Resolution Rate</div>
                          <div className="text-xl font-bold text-white mt-0.5">92.4%</div>
                          <div className="text-[10px] text-neutral-400 mt-1">Without human handoff</div>
                        </div>
                        <div className="border border-white/10 p-3 bg-black/80 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
                          <div className="text-[10px] uppercase text-neutral-500 font-mono">Response Speed</div>
                          <div className="text-xl font-bold text-white mt-0.5">4.2 sec</div>
                          <div className="text-[10px] text-neutral-400 mt-1">Instant contextual reply</div>
                        </div>
                      </div>

                      <div className="border border-white/10 p-3 bg-black/80 font-mono text-[11px] text-neutral-300 space-y-1">
                        <div className="text-neutral-500">&gt; agent.sync('whatsapp_lead_inquiry')</div>
                        <div className="text-white">✔ Customer authenticated &amp; quoted in ZAR</div>
                        <div className="text-neutral-400">✔ CRM invoice pipeline triggered automatically</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'growth' && (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <LineChart className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                              Search &amp; Ads Performance Engine
                            </h4>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            High-intent Google Search &amp; Local Business Dominance
                          </p>
                        </div>
                        <span className="text-xs font-mono text-white">Top 3 Rank</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="border border-white/10 p-3 bg-black/80 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
                          <div className="text-[10px] uppercase text-neutral-500 font-mono">Average ROAS</div>
                          <div className="text-xl font-bold text-white mt-0.5">4.2x</div>
                          <div className="text-[10px] text-neutral-400 mt-1">Return on Google Ad spend</div>
                        </div>
                        <div className="border border-white/10 p-3 bg-black/80 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
                          <div className="text-[10px] uppercase text-neutral-500 font-mono">Organic Lift</div>
                          <div className="text-xl font-bold text-white mt-0.5">+184%</div>
                          <div className="text-[10px] text-neutral-400 mt-1">First page keyword surge</div>
                        </div>
                      </div>

                      <div className="border border-white/10 p-3 bg-black/80 font-mono text-[11px] text-neutral-300 space-y-1">
                        <div className="text-neutral-500">&gt; funnel.track('qualified_consultation')</div>
                        <div className="text-white">✔ Cost Per Acquisition lowered by 38%</div>
                        <div className="text-neutral-400">✔ Verified Google Business Profile leads surging</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Action */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Production Telemetry Terminal
                  </span>
                  <button
                    onClick={onOpenContact}
                    className="text-white hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    Deploy your solution <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>

      {/* Creovibe Infinite Scrolling Text Marquee */}
      <ScrollingTicker
        speed={32}
        items={[
          'NEXT-GEN WEB ARCHITECTURE',
          'AUTONOMOUS AI AGENTS',
          'BESPOKE SOFTWARE SYSTEMS',
          '99.9% UPTIME SLA',
          'SUB-SECOND PERFORMANCE',
          'DATA DRIVEN ROI',
          'GLOBAL DEPLOYMENTS',
        ]}
      />
    </section>
  );
}
