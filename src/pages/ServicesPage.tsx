import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Bot,
  TrendingUp,
  Server,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  Code2,
  Gauge,
  Play,
  Pause,
} from 'lucide-react';
import { SERVICES, AGENCY_INFO } from '../data/content';
import BrowserMockup from '../components/BrowserMockup';

interface ServicesPageProps {
  onNavigateHome: () => void;
  onSelectService: (serviceName: string) => void;
  onOpenContact: () => void;
  initialServiceId?: string;
}

interface ServiceHeroDetails {
  badge: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  subheading: string;
  metrics: Array<{ value: string; label: string }>;
  ctaText: string;
}

const SERVICE_HERO_MAP: Record<string, ServiceHeroDetails> = {
  'web-development': {
    badge: 'DISCIPLINE 01 // WEB & APPLICATION ARCHITECTURE',
    headingPrefix: 'ENTERPRISE-GRADE ',
    headingHighlight: 'WEB ARCHITECTURES',
    headingSuffix: ' CRAFTED FOR VELOCITY.',
    subheading: 'We engineer sub-second, fault-tolerant web applications, customer portals, and headless commerce engines with React, Next.js, and TypeScript engineered for <0.8s load times and 100/100 Core Web Vitals.',
    metrics: [
      { value: '< 0.8s', label: 'Target Page Speeds' },
      { value: '100/100', label: 'Core Web Vitals' },
      { value: '65+', label: 'Platforms Deployed' },
      { value: '99.9%', label: 'Infrastructure SLA' },
    ],
    ctaText: 'Commission Web Project',
  },
  'ai-automation': {
    badge: 'DISCIPLINE 02 // AUTONOMOUS AI & CUSTOM AGENTS',
    headingPrefix: 'AUTONOMOUS ',
    headingHighlight: 'AI AGENTS & WORKFLOWS',
    headingSuffix: ' RUNNING 24/7.',
    subheading: 'Eliminate manual operational drag with self-healing AI agent swarms, WhatsApp customer concierge bots, real-time document extraction, and seamless CRM/ERP pipeline orchestration.',
    metrics: [
      { value: '85%', label: 'Manual Tasks Cut' },
      { value: '< 5s', label: 'First-Response SLA' },
      { value: '24/7', label: 'Autonomous Uptime' },
      { value: '340+', label: 'Weekly Active Runs' },
    ],
    ctaText: 'Deploy Custom AI Agent',
  },
  'digital-marketing': {
    badge: 'DISCIPLINE 03 // SCIENTIFIC SEARCH & GROWTH',
    headingPrefix: 'HIGH-CONVERSION ',
    headingHighlight: 'SEARCH DOMINANCE',
    headingSuffix: ' & ACQUISITION LOOPS.',
    subheading: 'Capture high-intent commercial buyers and dominate Google search results through scientific technical SEO, hyper-targeted Google Ads funnels, and data-driven conversion rate optimization.',
    metrics: [
      { value: '+180%', label: 'Organic Search Lift' },
      { value: '3.8x', label: 'Average ROAS' },
      { value: 'Top 3', label: 'SERP Rankings' },
      { value: '0%', label: 'Ad-Budget Waste' },
    ],
    ctaText: 'Scale Customer Acquisition',
  },
  'cloud-hosting': {
    badge: 'DISCIPLINE 04 // HARDENED CLOUD INFRASTRUCTURE',
    headingPrefix: 'MISSION-CRITICAL ',
    headingHighlight: 'CLOUD CLUSTERS',
    headingSuffix: ' & 99.9% UPTIME.',
    subheading: 'Resilient containerized cloud infrastructure on Cloud Run and AWS, fortified with Cloudflare enterprise DDoS defense, automated daily off-site snapshots, and POPIA-compliant encryption.',
    metrics: [
      { value: '99.9%', label: 'Server SLA Uptime' },
      { value: '< 15ms', label: 'Edge Network Latency' },
      { value: 'Daily', label: 'Encrypted Backups' },
      { value: 'POPIA', label: 'Compliance Hardened' },
    ],
    ctaText: 'Audit Cloud Architecture',
  },
  'cloud-solutions': {
    badge: 'DISCIPLINE 04 // CLOUD INFRASTRUCTURE & DEVOPS',
    headingPrefix: 'MISSION-CRITICAL ',
    headingHighlight: 'CLOUD CLUSTERS',
    headingSuffix: ' & 99.9% UPTIME.',
    subheading: 'Resilient containerized cloud infrastructure on Cloud Run and AWS, fortified with Cloudflare enterprise DDoS defense, automated daily off-site snapshots, and POPIA-compliant encryption.',
    metrics: [
      { value: '99.9%', label: 'Server SLA Uptime' },
      { value: '< 15ms', label: 'Edge Network Latency' },
      { value: 'Daily', label: 'Encrypted Backups' },
      { value: 'POPIA', label: 'Compliance Hardened' },
    ],
    ctaText: 'Audit Cloud Architecture',
  },
  'ui-ux-design': {
    badge: 'DISCIPLINE 05 // BESPOKE UI/UX & BRAND SYSTEMS',
    headingPrefix: 'COGNITIVE ',
    headingHighlight: 'DESIGN SYSTEMS',
    headingSuffix: ' THAT COMMAND AUTHORITY.',
    subheading: 'First impressions dictate enterprise buyer trust. We engineer high-contrast design systems, interactive Figma prototypes, and intuitive micro-interactions that make complex software a pleasure to navigate.',
    metrics: [
      { value: '3.2x', label: 'Engagement Duration' },
      { value: 'Sub-2', label: 'Click Workflows' },
      { value: '100%', label: 'Design Tokens Ready' },
      { value: 'WCAG AA', label: 'Accessibility Pass' },
    ],
    ctaText: 'Design System Consultation',
  },
  'consulting': {
    badge: 'DISCIPLINE 05 // DIGITAL TRANSFORMATION & STRATEGY',
    headingPrefix: 'TRANSFORMATIVE ',
    headingHighlight: 'AI ROADMAPS',
    headingSuffix: ' & TECHNICAL BLUEPRINTS.',
    subheading: 'We audit legacy architectures, identify high-leverage AI automation opportunities, and construct comprehensive technical blueprints that guide ambitious organizations through hyper-scale expansion.',
    metrics: [
      { value: 'R48M+', label: 'Client Value Added' },
      { value: '3.8x', label: 'Average Enterprise ROI' },
      { value: '100%', label: 'Vendor Agnostic' },
      { value: '14 Days', label: 'Rapid Strategy Sprints' },
    ],
    ctaText: 'Request Strategic Audit',
  },
};

export default function ServicesPage({
  onNavigateHome,
  onSelectService,
  onOpenContact,
  initialServiceId,
}: ServicesPageProps) {
  const [activeServiceId, setActiveServiceId] = useState<string>(initialServiceId || SERVICES[0].id);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);

  // Sync if initialServiceId changes from external navigation
  useEffect(() => {
    if (initialServiceId && SERVICES.some((s) => s.id === initialServiceId)) {
      setActiveServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  const activeService = SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0];
  const heroDetails = SERVICE_HERO_MAP[activeService.id] || SERVICE_HERO_MAP['web-development'];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-blue-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      default:
        return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  const capabilityPillars = [
    {
      title: 'Full-Stack Web Engineering',
      desc: 'Blazing-fast responsive applications, customer portals, and telemetry cockpits crafted with React, Next.js, and TypeScript.',
      metrics: '< 0.8s load times & 100/100 Core Web Vitals',
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      tag: 'Tier 1 Engineering',
    },
    {
      title: 'Autonomous AI Orchestration',
      desc: 'Proprietary multi-agent systems, WhatsApp automation bots, and self-healing workflow pipelines connecting your CRM, ERP, and databases 24/7.',
      metrics: '85% repetitive task automation & <8s first-response',
      icon: <Bot className="w-5 h-5 text-blue-400" />,
      tag: 'Generative AI & LLMs',
    },
    {
      title: 'Enterprise Cloud & Uptime SLA',
      desc: 'Hardened container hosting, automatic daily off-site snapshots, Cloudflare DDoS defense, and POPIA data protection compliance.',
      metrics: '99.9% verifiable uptime guarantee',
      icon: <Server className="w-5 h-5 text-blue-400" />,
      tag: 'Zero Downtime',
    },
    {
      title: 'High-Conversion Search & Funnels',
      desc: 'Scientific search engine optimization (SEO), localized Google Business dominance, and high-ROI Google Ads campaigns that generate verified leads.',
      metrics: '+180% average organic traffic in 90 days',
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      tag: 'Performance Growth',
    },
  ];

  return (
    <div className="pt-24 pb-32 text-[#f4f4f5] relative z-10">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-6">
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
            <span className="text-neutral-400 hover:text-white cursor-pointer" onClick={() => setActiveServiceId(SERVICES[0].id)}>
              SERVICES DIRECTORY
            </span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-300 font-semibold uppercase">{activeService.title}</span>
          </div>
        </div>
      </div>

      {/* Interactive Discipline Selector Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-neutral-400 uppercase mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            DISCIPLINE:
          </span>
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveServiceId(s.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeServiceId === s.id
                  ? 'bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                  : 'bg-[#0d1017] border border-blue-500/20 text-neutral-400 hover:text-blue-300 hover:border-blue-400/40'
              }`}
            >
              {getServiceIcon(s.iconName)}
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section with Service-Relevant Heading & Ambient Backdrop */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-20">
        <div className="relative rounded-xl border border-blue-500/25 bg-[#0a0d14]/90 overflow-hidden shadow-2xl p-8 sm:p-12 md:p-16">
          {/* Ambient Video Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="https://cdn.pixabay.com/video/2019/04/16/22896-331571212_large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span>{heroDetails.badge}</span>
              </div>

              {/* Dynamic Service-Specific Hero Heading */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                {heroDetails.headingPrefix}
                <span className="text-blue-400">{heroDetails.headingHighlight}</span>
                {heroDetails.headingSuffix}
              </h1>

              {/* Dynamic Service-Specific Subheading */}
              <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
                {heroDetails.subheading}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectService(activeService.title)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <span>{heroDetails.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <a
                  href="#service-breakdown"
                  className="px-6 py-3 border border-blue-500/30 hover:border-blue-400 text-blue-200 text-xs font-mono uppercase tracking-wider hover:bg-blue-950/20 transition-all duration-200"
                >
                  Explore Complete {activeService.title} Specs ↓
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Service-Specific Metrics Banner */}
          <div className="mt-12 pt-8 border-t border-blue-500/20 grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
            {heroDetails.metrics.map((metric, idx) => (
              <div key={idx}>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">{metric.value}</div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-mono mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Core Architectural Pillars */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ ARCHITECTURAL STANDARDS ]
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight mb-10">
          HOW WE BUILD DIFFERENTLY
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-blue-500/20 bg-[#0c0f17]/90 hover:border-blue-400/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-blue-950/40 border border-blue-500/30 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-blue-300/80 px-2 py-0.5 border border-blue-500/20 bg-blue-950/20">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-blue-400 font-medium">
                {pillar.metrics}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive Interactive Service Explorer */}
      <div id="service-breakdown" className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ IN-DEPTH SPECIFICATIONS ]
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight mb-10">
          SELECT A DISCIPLINE TO INSPECT
        </h2>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-white/10 mb-10">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveServiceId(s.id)}
              className={`px-4 py-3 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2.5 rounded ${
                activeServiceId === s.id
                  ? 'bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                  : 'border border-blue-500/20 bg-black/60 text-neutral-400 hover:text-blue-200 hover:border-blue-400/40'
              }`}
            >
              {getServiceIcon(s.iconName)}
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Service Showcase Card */}
        <div className="rounded-xl border border-blue-500/25 bg-[#0b0e17]/95 p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Specification Column */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-3">
                  <span>DISCIPLINE SPECIFICATION</span>
                  <span>•</span>
                  <span>{activeService.category}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
                  {activeService.title}
                </h3>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8">
                  {activeService.fullDesc}
                </p>

                {/* Deliverables Checklist */}
                <div className="mb-8">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-blue-300 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    Key Deliverables &amp; Milestones
                  </h4>
                  <div className="space-y-2.5">
                    {activeService.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded bg-black/50 border border-blue-500/15 text-xs text-neutral-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-3">
                    Production Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeService.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-mono border border-blue-500/20 bg-blue-950/30 text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-blue-400">
                  Target Performance: <span className="text-white">{activeService.metrics}</span>
                </div>
                <button
                  onClick={() => {
                    onSelectService(activeService.title);
                    onOpenContact();
                  }}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                >
                  <span>Select &amp; Inquire</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Live Sample Column (Minimal Browser Mockup) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="border border-blue-500/20 bg-black/70 p-4 rounded-lg">
                <div className="text-xs font-mono uppercase text-neutral-400 mb-3 flex items-center justify-between">
                  <span>SAMPLE PRODUCTION WORK</span>
                  <span className="text-blue-400 font-semibold">VERIFIED ARCHITECTURE</span>
                </div>

                <BrowserMockup
                  title={activeService.title}
                  domain="app.btvizion.co.za"
                  views={[
                    {
                      id: 'view-1',
                      name: 'Executive View',
                      urlPath: 'command-centre',
                      image: '/assets/images/project_btv_bos_1789635998962.jpg',
                      badge: 'Live Dashboard',
                      description: 'Real-time telemetry and cash pipeline',
                    },
                    {
                      id: 'view-2',
                      name: 'Automation Engine',
                      urlPath: 'workflows',
                      image: '/assets/images/mockup_flowops_1789636161433.jpg',
                      badge: '341 Runs/Wk',
                      description: 'Autonomous orchestration flows',
                    },
                    {
                      id: 'view-3',
                      name: 'AI Spaces',
                      urlPath: 'spaces',
                      image: '/assets/images/mockup_atrium_1789636184637.jpg',
                      badge: 'Conversational',
                      description: 'Natural language booking prompt',
                    },
                  ]}
                  aspectRatio="aspect-[16/10]"
                  interactive={true}
                />

                <p className="mt-4 text-xs text-neutral-400 leading-relaxed">
                  Interactive preview of actual customer portals and workflow automations deployed by BT Vizion. Built on resilient, containerized infrastructure with sub-second response times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Standard Agency vs BT Vizion Engineering */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ THE ENGINEERING ADVANTAGE ]
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight mb-8">
          WHY AMBITIOUS BRANDS CHOOSE BT VIZION
        </h2>

        <div className="overflow-x-auto rounded-xl border border-blue-500/20 bg-[#0a0d14]/90">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-blue-500/20 bg-[#0e1320] text-neutral-300 font-mono uppercase tracking-wider">
                <th className="p-4 sm:p-5">Engineering Dimension</th>
                <th className="p-4 sm:p-5 text-neutral-400">Typical Agency / DIY Builders</th>
                <th className="p-4 sm:p-5 text-blue-400 font-bold bg-blue-950/30">BT Vizion Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Codebase &amp; Architecture</td>
                <td className="p-4 sm:p-5 text-neutral-400">Bloated WordPress / generic templates prone to plugins breaking</td>
                <td className="p-4 sm:p-5 text-blue-200 font-medium bg-blue-950/20">Custom React, TypeScript, Next.js, and clean Tailwind architectures</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">AI Capabilities</td>
                <td className="p-4 sm:p-5 text-neutral-400">Basic copy-pasted iframe chat widgets with generic responses</td>
                <td className="p-4 sm:p-5 text-blue-200 font-medium bg-blue-950/20">Autonomous multi-agent pipelines connected to ERP, CRM &amp; WhatsApp</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Speed &amp; Core Web Vitals</td>
                <td className="p-4 sm:p-5 text-neutral-400">3-6s average load times, mobile rendering shift</td>
                <td className="p-4 sm:p-5 text-blue-200 font-medium bg-blue-950/20">&lt; 0.8s load times with guaranteed 90+ Core Web Vitals score</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Security &amp; POPIA Compliance</td>
                <td className="p-4 sm:p-5 text-neutral-400">Shared hosting, outdated PHP versions, vulnerable to SQLi</td>
                <td className="p-4 sm:p-5 text-blue-200 font-medium bg-blue-950/20">Isolated cloud containers, encrypted vaults, automated off-site backups</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Turnaround Velocity</td>
                <td className="p-4 sm:p-5 text-neutral-400">Months of agency meetings with slow milestone delivery</td>
                <td className="p-4 sm:p-5 text-blue-200 font-medium bg-blue-950/20">Rapid 2 to 4-week structured sprint cycles with live staging access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Call to Action Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-black to-[#090e18] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
              READY TO INITIALIZE?
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
              BOOK A 30-MINUTE TECHNICAL SCOPE REVIEW
            </h3>
            <p className="mt-2 text-sm text-neutral-400 max-w-xl">
              Tell us what operational bottlenecks or digital targets you need solved. We will prepare an exact architectural scope and fixed-price timeline within 24 hours.
            </p>
          </div>
          <button
            onClick={onOpenContact}
            className="shrink-0 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-extrabold uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Contact Hub</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
