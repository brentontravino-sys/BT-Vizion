import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe2,
  Clock,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { AGENCY_INFO } from '../data/content';
import BrowserMockup from '../components/BrowserMockup';

interface AboutPageProps {
  onNavigateHome: () => void;
  onOpenContact: () => void;
}

export default function AboutPage({ onNavigateHome, onOpenContact }: AboutPageProps) {
  const [selectedStandard, setSelectedStandard] = useState<number>(0);

  const agencyStandards = [
    {
      title: 'Performance & Velocity',
      subtitle: 'Sub-second page speeds as an immutable baseline',
      desc: 'We do not build bloated, slow websites. Every frontend is compiled to minimal bundle sizes, achieving 100/100 Core Web Vitals and instant user interactivity across both fiber and mobile 4G/5G connections.',
      metrics: '< 0.8s First Contentful Paint',
    },
    {
      title: 'Autonomous Systems Focus',
      subtitle: 'Eliminating repetitive human busywork through code',
      desc: 'Our engineering philosophy treats routine data entry, manual customer triage, and siloed spreadsheets as defects. We orchestrate autonomous AI agents that run 24 hours a day, 7 days a week with verifiable audit logs.',
      metrics: '85% repetitive inquiry automation',
    },
    {
      title: 'Rigorous Security & POPIA Compliance',
      subtitle: 'Enterprise & international data governance',
      desc: 'All customer databases and AI agent integrations comply strictly with POPIA and global GDPR standards, featuring encrypted vaults and automated daily off-site snapshots.',
      metrics: 'Zero security breaches since inception',
    },
    {
      title: 'Direct Engineering Access',
      subtitle: 'No middlemen account managers. Talk directly to the builders.',
      desc: 'When you work with BT Vizion, you collaborate directly with senior software architects and AI engineers who understand your domain, business models, and delivery timelines intimately.',
      metrics: '< 2-hour average response SLA',
    },
  ];

  const milestones = [
    { year: '2023', title: 'Agency Inception', desc: 'BT Vizion founded to bring world-class engineering and custom web development to ambitious enterprise clients.' },
    { year: '2024', title: 'AI Automation Division', desc: 'Pioneered custom multi-agent LLM systems and WhatsApp business bots, replacing manual logistics and customer support queues.' },
    { year: '2025', title: 'Business OS & Portals', desc: 'Delivered proprietary Command Center platforms uniting cash pipeline, Cartrack fleet telematics, and ERP data into real-time cockpits.' },
    { year: '2026', title: 'Enterprise & Global Scale', desc: 'Over 65 production systems deployed spanning the UK, Europe, Africa, and North America, generating over R48M in client business value.' },
  ];

  return (
    <div className="pt-24 pb-32 text-[#f4f4f5] relative z-10">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-8">
        <div className="flex items-center justify-between py-3 border-b border-white/10 text-xs font-mono">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-neutral-400 hover:text-blue-300 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO MAIN OVERVIEW</span>
          </button>
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="hover:text-white cursor-pointer" onClick={onNavigateHome}>
              BT VIZION
            </span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-300 font-semibold uppercase">ABOUT OUR AGENCY</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Video Backdrop */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-20">
        <div className="relative rounded-xl border border-blue-500/25 bg-[#0a0d14]/90 overflow-hidden shadow-2xl p-8 sm:p-12 md:p-16">
          {/* Ambient Video Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="https://cdn.pixabay.com/video/2021/04/12/70889-537446545_large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              JOHANNESBURG &amp; CAPE TOWN
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              PRECISION OVER HYPE. <span className="text-blue-400">CODE THAT SCALES.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              BT Vizion is an elite software engineering studio and AI automation consultancy. We partner with ambitious business founders, operational directors, and modern brands to build digital ecosystems that generate compounding commercial returns.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenContact}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2 cursor-pointer"
              >
                <span>Initiate Agency Engagement</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 px-4 py-2 border border-white/10 bg-black/40">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>SAST Timezone (UTC+2) · Global Delivery</span>
              </div>
            </div>
          </div>

          {/* Key Agency Statistics */}
          <div className="mt-12 pt-8 border-t border-blue-500/20 grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
            {AGENCY_INFO.stats.map((stat, i) => (
              <div key={i}>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-mono mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story & Philosophy Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
              [ THE BT VIZION METHOD ]
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mb-6">
              WHY WE REJECT GENERIC TEMPLATES &amp; SLOW VELOCITY
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
              <p>
                In an era dominated by cookie-cutter website builders and rushed AI wrappers, true competitive leverage comes from bespoke software that fits your exact commercial workflows like a bespoke tailored suit.
              </p>
              <p>
                We founded BT Vizion to eliminate the friction that holds modern enterprises back: siloed spreadsheets, missed customer inquiries, slow-loading platforms, and astronomical cloud bills.
              </p>
              <p>
                Every project we ship is treated as a piece of critical digital real estate. We write clean, strongly typed TypeScript codebases, configure hardened cloud infrastructure, and deploy autonomous agents that do real, measurable work.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded border border-blue-500/20 bg-[#0a0d14] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase text-white font-mono">Fixed Sprint Delivery</div>
                  <div className="text-xs text-neutral-400 mt-1">2 to 4-week delivery sprints with live staging access</div>
                </div>
              </div>
              <div className="p-4 rounded border border-blue-500/20 bg-[#0a0d14] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase text-white font-mono">100% Code Ownership</div>
                  <div className="text-xs text-neutral-400 mt-1">You own all IP, repositories, secrets, and architecture</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Work Sample Card */}
          <div className="lg:col-span-5">
            <div className="border border-blue-500/20 bg-black/80 p-4 rounded-xl shadow-2xl">
              <div className="text-xs font-mono uppercase text-neutral-400 mb-3 flex items-center justify-between">
                <span>OUR ENTERPRISE WORK</span>
                <span className="text-blue-400 font-semibold">LIVE PRODUCTION</span>
              </div>

              <BrowserMockup
                title="BT Vizion Business OS"
                domain="btv-bos.app"
                views={[
                  {
                    id: 'bos-view',
                    name: 'Command Centre',
                    urlPath: 'command-centre',
                    image: '/assets/images/project_btv_bos_1789635998962.jpg',
                    badge: 'R430k Collected · Live Telemetry',
                  },
                  {
                    id: 'flash-view',
                    name: 'Automotive Flagship',
                    urlPath: 'flash-motors.se',
                    image: '/assets/images/mockup_flash_ev_1789636223905.jpg',
                    badge: '402mi Range · Scandinavian Design',
                  },
                  {
                    id: 'aeris-view',
                    name: 'Executive Aviation',
                    urlPath: 'aeriswing.com',
                    image: '/assets/images/mockup_aeriswing_1789636205027.jpg',
                    badge: 'Private Jet Charter Engine',
                  },
                ]}
                aspectRatio="aspect-[16/10]"
                interactive={true}
              />
              <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-3 border-t border-white/10">
                <span>Johannesburg &amp; Cape Town Hubs</span>
                <span className="text-blue-400">Verified Client Deployments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Standards Accordion / Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ UNCOMPROMISING BENCHMARKS ]
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight mb-8">
          OUR FOUR ARCHITECTURAL FOUNDATIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agencyStandards.map((std, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                selectedStandard === idx
                  ? 'border-blue-400/60 bg-blue-950/20 shadow-[0_0_25px_rgba(59,130,246,0.15)]'
                  : 'border-blue-500/20 bg-[#0b0e17]/80 hover:border-blue-400/40'
              }`}
              onClick={() => setSelectedStandard(idx)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-blue-400 font-bold">
                  [ STANDARD 0{idx + 1} ]
                </span>
                <span className="text-[11px] font-mono text-blue-300/80 px-2 py-0.5 bg-blue-950/40 border border-blue-500/30">
                  {std.metrics}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
                {std.title}
              </h3>
              <p className="text-xs font-mono text-neutral-400 mb-3">
                {std.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {std.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Agency Timeline & Milestones */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ TRACK RECORD OF GROWTH ]
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight mb-12">
          JOURNEY OF TECHNICAL EXCELLENCE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-blue-500/20 bg-[#0a0d14]/90 relative overflow-hidden"
            >
              <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono mb-2">
                {m.year}
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-tight mb-2">
                {m.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="p-8 sm:p-10 rounded-xl border border-blue-500/20 bg-[#0b0e18]/90">
          <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
            [ VERIFIED TOOLING &amp; CLOUD PARTNERS ]
          </div>
          <h3 className="text-2xl font-extrabold uppercase text-white tracking-tight mb-6">
            ENTERPRISE TECHNOLOGIES WE DEPLOY DAILY
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {[
              { name: 'React & Next.js', role: 'Frontend Architecture' },
              { name: 'TypeScript', role: 'Type-Safe Runtime' },
              { name: 'Node & FastAPI', role: 'Microservice APIs' },
              { name: 'Gemini & OpenAI', role: 'Autonomous AI' },
              { name: 'PostgreSQL & Redis', role: 'Low-Latency Data' },
              { name: 'PayFast & Stripe', role: 'Secure Checkout' },
            ].map((tech, i) => (
              <div key={i} className="p-4 rounded bg-black/60 border border-blue-500/20 flex flex-col justify-center">
                <div className="text-xs font-bold text-blue-300 font-mono">{tech.name}</div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">{tech.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Prompt Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-black to-[#090e18] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
              BUILD WITH US
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
              CONNECT WITH OUR SENIOR ENGINEERS DIRECTLY
            </h3>
            <p className="mt-2 text-sm text-neutral-400 max-w-xl">
              We respond to inquiries within 2 hours during SAST business hours. No junior sales reps, just straight answers and clear execution roadmaps.
            </p>
          </div>
          <button
            onClick={onOpenContact}
            className="shrink-0 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-extrabold uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <span>Open Contact Hub</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
