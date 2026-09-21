import { Star, Quote, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/content';
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  ScrollWordColorReveal,
  SpotlightCard,
  ScrollParallaxWatermark,
  ScrollHeaderGradientFill,
} from './ScrollReveal';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      {/* Background Watermark */}
      <ScrollParallaxWatermark text="REPUTATION" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ 07 // CLIENT TESTIMONIALS ]
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text="TRUSTED BY OPERATIONAL LEADERS."
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="max-w-md">
            <ScrollWordColorReveal
              text="Real outcomes from forward-thinking enterprise and global businesses that partner with BT Vizion to outpace their competition."
              className="text-neutral-400 text-sm md:text-base leading-relaxed font-normal"
            />
          </div>
        </ScrollReveal>

        {/* Testimonials Grid with Creovibe Spotlight Cards */}
        <ScrollStagger staggerDelay={0.12} className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <ScrollStaggerItem key={t.id} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(59, 130, 246, 0.12)"
                className="border border-blue-500/20 bg-[#0b0b0c]/90 p-8 flex flex-col justify-between h-full hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.14)] transition-all duration-300"
              >
                <div>
                  {/* Rating & Highlight Pill */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-blue-400/30 text-blue-300 bg-blue-950/40">
                      {t.highlight}
                    </span>
                  </div>

                  {/* Quote body */}
                  <div className="mt-6 relative">
                    <Quote className="w-6 h-6 text-blue-400/30 mb-3" />
                    <p className="text-sm text-neutral-200 leading-relaxed font-normal italic">
                      "{t.quote}"
                    </p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      {t.clientName}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {t.role}, <span className="text-blue-300">{t.company}</span>
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                      {t.location}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-none border border-blue-500/30 bg-blue-950/40 flex items-center justify-center text-blue-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
              </SpotlightCard>
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>
      </div>
    </section>
  );
}
