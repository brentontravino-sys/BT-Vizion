import { PROCESS_STEPS } from '../data/content';
import { Layers, ArrowRight } from 'lucide-react';
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  ScrollWordColorReveal,
  SpotlightCard,
  ScrollingTicker,
  ScrollHeaderGradientFill,
} from './ScrollReveal';

interface ProcessProps {
  onOpenContact: () => void;
}

export default function Process({ onOpenContact }: ProcessProps) {
  return (
    <section id="process" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 pb-16 md:pb-20">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ 04 // OUR METHODOLOGY ]
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text="FROM STRATEGIC DISCOVERY TO UNSTOPPABLE SCALE."
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="max-w-md">
            <ScrollWordColorReveal
              text="We follow a battle-tested engineering sprint protocol to guarantee prompt delivery without compromising system security or speed."
              className="text-neutral-400 text-sm md:text-base leading-relaxed font-normal"
            />
          </div>
        </ScrollReveal>

        {/* Process Steps Grid */}
        <ScrollStagger staggerDelay={0.12} className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <ScrollStaggerItem key={step.step} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(59, 130, 246, 0.12)"
                className="border border-blue-500/20 bg-black/90 p-6 md:p-8 flex flex-col justify-between h-full hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.14)] transition-all duration-300 relative group backdrop-blur-sm shadow-xl"
              >
                <div>
                  {/* Step number */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <span className="text-3xl md:text-4xl font-extrabold text-blue-400 font-mono tracking-tighter group-hover:text-blue-300 transition-colors">
                      {step.step}
                    </span>
                    <div className="w-8 h-8 border border-blue-500/30 bg-blue-950/40 flex items-center justify-center text-blue-400 group-hover:border-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Step title & text */}
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight mt-6 group-hover:text-blue-100 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Deliverable info */}
                <div className="mt-8 pt-4 border-t border-white/10">
                  <div className="text-[10px] font-mono uppercase text-blue-400">
                    Phase Deliverable
                  </div>
                  <div className="text-xs font-semibold text-neutral-200 mt-1">
                    {step.deliverable}
                  </div>
                </div>
              </SpotlightCard>
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>

        {/* Process CTA Banner */}
        <ScrollReveal variant="scale-up" delay={0.15} className="mt-12">
          <SpotlightCard
            spotlightColor="rgba(59, 130, 246, 0.12)"
            className="p-6 md:p-8 border border-blue-500/25 bg-neutral-950/90 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-400/40 transition-colors"
          >
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                Ready to accelerate your next sprint?
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Book a 30-minute technical discovery session with our senior solution architects.
              </p>
            </div>
            <button
              onClick={onOpenContact}
              className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Book Strategy Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </SpotlightCard>
        </ScrollReveal>
      </div>

      {/* Creovibe Reverse Scrolling Ticker for Tech Stack */}
      <ScrollingTicker
        direction="right"
        speed={38}
        items={[
          'REACT 19 & NEXT.JS',
          'PYTHON & FASTAPI',
          'GEMINI & CLAUDE AI',
          'CLOUD RUN & DOCKER',
          'PAYSTACK & STRIPE',
          'POSTGRESQL & REDIS',
          'WHATSAPP BUSINESS API',
          'TAILWIND CSS & FRAMER MOTION',
        ]}
      />
    </section>
  );
}
