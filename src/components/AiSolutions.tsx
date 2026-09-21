import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Cpu, Workflow, FileText, ArrowUpRight, CheckCircle, Sparkles } from 'lucide-react';
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  ScrollWordColorReveal,
  SpotlightCard,
  ScrollParallaxWatermark,
  ScrollHeaderGradientFill,
} from './ScrollReveal';

interface AiSolutionsProps {
  onOpenContact: () => void;
}

export default function AiSolutions({ onOpenContact }: AiSolutionsProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<number>(0);

  const workflows = [
    {
      title: 'WhatsApp Customer Agent',
      icon: MessageSquare,
      summary: '24/7 autonomous enterprise WhatsApp assistant answering product queries, sending quotes, and checking order status.',
      stats: '8s avg response • 94% automation',
      features: [
        'Natural multilingual contextual understanding with high conversational accuracy',
        'Direct connection to your stock database & pricing spreadsheets',
        'Automatic booking & calendar appointment scheduling',
        'Seamless human agent escalation when required',
      ],
      samplePrompt: 'Client: "Hi, do you have 50 units of Model-X in stock in JHB, and what is the delivered price?"',
      sampleReply: 'AI Agent: "Yes! We currently have 74 units at our Johannesburg warehouse. Delivered price is R14,250 incl VAT. Would you like me to generate an official quote to your email?"',
    },
    {
      title: 'Automated Invoice & Document OCR',
      icon: FileText,
      summary: 'Extract vendor invoices, receipts, and shipping manifests straight into Xero, Sage, or QuickBooks without manual entry.',
      stats: '99.4% accuracy • 15 sec per batch',
      features: [
        'PDF and scan image parsing with layout preservation',
        'Line-item tax, VAT, and vendor reconciliation',
        'Anomaly detection flagging price discrepancies',
        'Zero manual keying for accounts payable teams',
      ],
      samplePrompt: 'System: PDF vendor invoice received from Transnet Logistics (24 line items).',
      sampleReply: 'AI Agent: "Processed in 3.4s. 24 line items reconciled with Purchase Order #8819. Exported to accounting ledger with tax code 15% Standard VAT."',
    },
    {
      title: 'Custom CRM & Lead Nurture Engine',
      icon: Workflow,
      summary: 'Automatically score incoming website leads, enrich company info, and trigger personalized follow-up emails and SMS.',
      stats: '3.4x lead conversion • Zero dropped leads',
      features: [
        'Instant lead qualification within 60 seconds of submission',
        'LinkedIn & company revenue data enrichment',
        'Autonomous calendar booking links customized per industry',
        'Automated reminders reducing ghosting by 45%',
      ],
      samplePrompt: 'Event: New web lead submitted consultation request on btvizion.co.za.',
      sampleReply: 'AI Agent: "Lead enriched: Mid-market logistics firm, 45 staff. Sent tailored case study on Vektor Telematics and booked calendar slot for Thursday 10:00 SAST."',
    },
  ];

  return (
    <section id="ai-solutions" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      {/* Background Watermark */}
      <ScrollParallaxWatermark text="AUTONOMOUS AI" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ 02 // INTELLIGENT AUTOMATION ]
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text="AUTONOMOUS AI AGENTS FOR MODERN BUSINESSES."
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="max-w-md">
            <ScrollWordColorReveal
              text="Eliminate tedious manual processes. We architect custom AI agents and workflow pipelines that operate around the clock with surgical precision."
              className="text-sm md:text-base text-neutral-400 leading-relaxed font-normal"
            />
          </div>
        </ScrollReveal>

        {/* Workflow Showcase */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Selection Column */}
          <ScrollStagger staggerDelay={0.1} className="lg:col-span-5 space-y-3">
            {workflows.map((wf, idx) => {
              const Icon = wf.icon;
              const isSelected = activeWorkflow === idx;
              return (
                <ScrollStaggerItem key={idx}>
                  <SpotlightCard
                    spotlightColor="rgba(59, 130, 246, 0.15)"
                    className={`w-full text-left p-6 border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-blue-400 bg-blue-950/30 shadow-[0_0_30px_rgba(59,130,246,0.18)]'
                        : 'border-blue-500/15 bg-neutral-950/75 hover:border-blue-400/40 text-neutral-400'
                    }`}
                  >
                    <div onClick={() => setActiveWorkflow(idx)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 border ${isSelected ? 'border-blue-400 bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-blue-500/30 bg-blue-950/40 text-blue-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className={`text-base font-bold uppercase tracking-tight ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                            {wf.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {wf.summary}
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-blue-300/90 font-medium">{wf.stats}</span>
                        <span className={`uppercase font-semibold ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`}>
                          {isSelected ? 'Active View' : 'Explore'}
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStagger>

          {/* Right Live Simulation Column */}
          <ScrollReveal variant="fade-left" delay={0.15} className="lg:col-span-7">
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.12)"
              className="border border-blue-500/25 bg-neutral-950/95 backdrop-blur-xl p-6 md:p-8 rounded-none shadow-2xl hover:border-blue-400/40 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white">
                    {workflows[activeWorkflow].title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 border border-blue-400/30 text-blue-300 bg-blue-950/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>SIMULATION PREVIEW</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Capability bullets */}
                <div>
                  <h5 className="text-xs uppercase font-mono text-neutral-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    Core Autonomous Capabilities
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {workflows[activeWorkflow].features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-200">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Conversation / Execution log */}
                <div className="border border-white/10 bg-black/90 p-5 space-y-3 font-mono text-xs backdrop-blur-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08)]">
                  <div className="text-[10px] uppercase text-neutral-500 tracking-wider flex items-center justify-between">
                    <span>Interactive Dialog Trace</span>
                    <span className="text-[9px] text-neutral-600">LATENCY // 14MS</span>
                  </div>
                  <div className="p-3 bg-neutral-950/80 border border-white/10 text-neutral-300">
                    <span className="text-neutral-500 block text-[10px] uppercase">Input</span>
                    {workflows[activeWorkflow].samplePrompt}
                  </div>
                  <div className="p-3 bg-white/5 border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.03)]">
                    <span className="text-blue-300 block text-[10px] uppercase font-bold">Autonomous Output</span>
                    {workflows[activeWorkflow].sampleReply}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-neutral-400">
                    Ready to deploy this AI agent in your company?
                  </div>
                  <button
                    onClick={onOpenContact}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg"
                  >
                    <span>Request AI Audit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
