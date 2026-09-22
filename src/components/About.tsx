import { MapPin, Shield, Zap, Target, ArrowUpRight } from 'lucide-react';
import { AGENCY_INFO } from '../data/content';
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  ScrollWordColorReveal,
  SpotlightCard,
  ScrollHeaderGradientFill,
} from './ScrollReveal';

interface AboutProps {
  onOpenContact: () => void;
  onNavigateToAboutPage?: () => void;
}

export default function About({ onOpenContact, onNavigateToAboutPage }: AboutProps) {
  return (
    <section id="about" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ 06 // ABOUT BT VIZION ]
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text="ARCHITECTS OF NEXT-GEN DIGITAL ECOSYSTEMS."
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-300 border border-blue-500/30 px-3 py-1.5 bg-blue-950/40">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Global Deployment • Enterprise Scale</span>
          </div>
        </ScrollReveal>

        {/* Narrative Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            {/* Scroll-Driven Text Coloring on Headline (Creovibe style) */}
            <ScrollWordColorReveal
              text="WE BRIDGE THE GAP BETWEEN AMBITIOUS VISION AND HIGH-SPEED TECHNICAL EXECUTION."
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight font-sans"
            />
            
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal">
              BT Vizion was founded on a simple premise: modern businesses cannot afford disconnected digital tools. A slow website destroys ad spend. An inefficient manual workflow stalls growth. Isolated customer inquiries cause churn.
            </p>

            {/* Scroll-Driven Text Coloring on Mission */}
            <ScrollWordColorReveal
              text="We design and engineer integrated digital ecosystems. By unifying blazing-fast web platforms, autonomous AI agents, and high-intent digital marketing, we create compounding momentum for our clients across the globe."
              className="text-base sm:text-lg leading-relaxed font-normal"
            />

            {/* Core Values / Tenets */}
            <ScrollStagger staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <ScrollStaggerItem className="h-full">
                <SpotlightCard className="p-4 border border-blue-500/20 bg-black/85 h-full hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.14)] transition-all">
                  <div className="w-8 h-8 border border-blue-500/30 bg-blue-950/40 flex items-center justify-center mb-3 text-blue-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Radical Speed
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Sub-second load times &amp; sprint-based delivery.
                  </p>
                </SpotlightCard>
              </ScrollStaggerItem>

              <ScrollStaggerItem className="h-full">
                <SpotlightCard className="p-4 border border-blue-500/20 bg-black/85 h-full hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.14)] transition-all">
                  <div className="w-8 h-8 border border-blue-500/30 bg-blue-950/40 flex items-center justify-center mb-3 text-blue-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Engineered ROI
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Obsessed with conversion and revenue metrics.
                  </p>
                </SpotlightCard>
              </ScrollStaggerItem>

              <ScrollStaggerItem className="h-full">
                <SpotlightCard className="p-4 border border-blue-500/20 bg-black/85 h-full hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.14)] transition-all">
                  <div className="w-8 h-8 border border-blue-500/30 bg-blue-950/40 flex items-center justify-center mb-3 text-blue-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Bulletproof SLA
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    99.9% uptime and enterprise compliance.
                  </p>
                </SpotlightCard>
              </ScrollStaggerItem>
            </ScrollStagger>
          </div>

          {/* Right Agency Blueprint Card */}
          <ScrollReveal variant="fade-left" delay={0.15} className="lg:col-span-5">
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.12)"
              className="border border-blue-500/25 bg-neutral-950/90 p-6 sm:p-8 space-y-6 hover:border-blue-400/40 shadow-2xl transition-colors"
            >
              <div className="text-xs font-mono uppercase tracking-wider text-blue-400 border-b border-white/10 pb-3 flex justify-between items-center">
                <span>Agency Credentials</span>
                <span className="text-white font-bold">{AGENCY_INFO.legalName}</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500 uppercase">Primary Specialization</span>
                  <span className="text-blue-200">Web Apps &amp; AI Agents</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500 uppercase">Geographic Reach</span>
                  <span className="text-neutral-200">Global Remote &amp; Distributed</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500 uppercase">Core Frameworks</span>
                  <span className="text-neutral-200">React 19, TypeScript, Next, Python</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500 uppercase">Compliance</span>
                  <span className="text-neutral-200">POPIA, GDPR, SSL Encryption</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-500 uppercase">Client Status</span>
                  <span className="text-emerald-400">Accepting Q2/Q3 Projects</span>
                </div>
              </div>

              <div className="pt-4 space-y-2.5">
                {onNavigateToAboutPage && (
                  <button
                    onClick={onNavigateToAboutPage}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    <span>Read Full Agency Story &amp; Standards</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onOpenContact}
                  className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Connect With Our Team</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
