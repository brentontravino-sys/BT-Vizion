import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { AGENCY_INFO, SERVICES } from '../data/content';

interface ContactPageProps {
  onNavigateHome: () => void;
  initialService?: string;
}

export default function ContactPage({ onNavigateHome, initialService }: ContactPageProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialService ? [initialService] : [SERVICES[0].title]
  );
  const [budgetTier, setBudgetTier] = useState<string>('R45k - R95k');
  const [timeline, setTimeline] = useState<string>('3-4 Weeks');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const budgetOptions = [
    'R20k - R45k',
    'R45k - R95k',
    'R95k - R180k',
    'R180k+ / Enterprise',
  ];

  const timelineOptions = [
    'Immediate (2-3 Weeks)',
    'Standard (3-4 Weeks)',
    'Next Quarter (1-2 Months)',
    'Ongoing Retainer',
  ];

  const toggleService = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(AGENCY_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi BT Vizion team, I would like to inquire about ${
      selectedServices.join(', ') || 'a new digital project'
    }. Budget tier: ${budgetTier}. Timeline: ${timeline}.`
  );
  const whatsappUrl = `https://wa.me/27626579548?text=${whatsappMessage}`;

  const faqs = [
    {
      q: 'How fast can our project begin and be deployed?',
      a: 'We work in dedicated, high-velocity 2 to 4-week structured sprint cycles. Upon approval of the technical blueprint and initial deposit, development initializes within 48 hours with continuous live staging access.',
    },
    {
      q: 'Do we retain full ownership of the source code and IP?',
      a: '100% yes. Upon final milestone signoff, all Git repositories, Figma design tokens, cloud configurations, API keys, and intellectual property belong exclusively to you with zero lock-in.',
    },
    {
      q: 'Are your AI agents and database integrations POPIA compliant?',
      a: 'Absolutely. We architect solutions according to POPIA and global GDPR data principles, including automated encryption, consent controls, and isolated cloud hosting.',
    },
    {
      q: 'What ongoing maintenance and cloud hosting support do you provide?',
      a: 'We offer guaranteed 99.9% uptime cloud management, automated off-site backups, daily security patch monitoring, and a guaranteed <2-hour response SLA for critical enterprise systems.',
    },
    {
      q: 'What budget range is required to work with BT Vizion?',
      a: 'Our project tiers start from R20,000 for focused landing engines and quick AI agent integrations up to R180,000+ for enterprise multi-tenant platforms and custom automation ecosystems. We provide transparent, fixed-scope proposals with zero hidden costs.',
    },
    {
      q: 'Can you integrate with our existing ERP, CRM, and payment systems?',
      a: 'Yes. We specialize in custom API integrations with platforms such as Salesforce, HubSpot, Zoho, SAP, Sage, PayFast, Ozow, Stripe, WhatsApp Business API, and bespoke legacy relational databases.',
    },
  ];

  // Schema.org FAQPage JSON-LD Structured Data
  const faqJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }),
    [faqs]
  );

  // Synchronize JSON-LD into document.head for search engine crawlers and rich snippets
  useEffect(() => {
    const scriptId = 'contact-faq-schema-head';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqJsonLd, null, 2);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [faqJsonLd]);

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
            <span className="text-blue-300 font-semibold uppercase">CONTACT &amp; DISCOVERY</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-blue-500/20">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ DIRECT CONSULTATION HUB ]
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              LET’S ARCHITECT YOUR <span className="text-blue-400">NEXT ADVANTAGE.</span>
            </h1>
          </div>
          <div className="max-w-md text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
            Directly connect with senior technical leadership. We review project requirements and return structured architectural scopes within 24 hours.
          </div>
        </div>
      </div>

      {/* Main Grid: Direct Channels (Left) & Project Scope Form (Right) */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* WhatsApp Fast Channel */}
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    FASTEST RESPONSE CHANNEL
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300/80 px-2 py-0.5 border border-emerald-500/30 bg-emerald-950/40">
                    &lt; 15 Min SLA
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">
                  Direct WhatsApp Engineering Chat
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-5">
                  Need an immediate answer regarding project feasibility or tech stack requirements? Text our senior team directly on WhatsApp.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Launch WhatsApp Conversation (+27 62 657 9548)</span>
                </a>
              </div>

              {/* Direct Details Card */}
              <div className="p-6 rounded-xl border border-blue-500/20 bg-[#0a0d14]/90 space-y-5">
                <div className="text-xs font-mono uppercase text-blue-400 tracking-wider">
                  DIRECT CONTACT CHANNELS
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-white/5">
                  <div className="w-9 h-9 rounded bg-blue-950/40 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-mono uppercase text-neutral-400">Direct Telephone</div>
                    <a
                      href={`tel:${AGENCY_INFO.phone}`}
                      className="text-sm font-semibold text-white hover:text-blue-300 transition-colors"
                    >
                      {AGENCY_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                {/* Email Primary */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-white/5">
                  <div className="w-9 h-9 rounded bg-blue-950/40 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase text-neutral-400">Technical Proposals</div>
                      <a
                        href={`mailto:${AGENCY_INFO.email}`}
                        className="text-sm font-semibold text-white hover:text-blue-300 transition-colors"
                      >
                        {AGENCY_INFO.email}
                      </a>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1.5 rounded text-neutral-400 hover:text-blue-300 hover:bg-white/5 transition-colors cursor-pointer"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Alternate Email */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-white/5">
                  <div className="w-9 h-9 rounded bg-blue-950/40 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-mono uppercase text-neutral-400">Direct Secondary</div>
                    <a
                      href={`mailto:${AGENCY_INFO.altEmail}`}
                      className="text-sm font-semibold text-white hover:text-blue-300 transition-colors"
                    >
                      {AGENCY_INFO.altEmail}
                    </a>
                  </div>
                </div>

                {/* Locations */}
                <div className="flex items-start gap-3.5 pb-4 border-b border-white/5">
                  <div className="w-9 h-9 rounded bg-blue-950/40 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-mono uppercase text-neutral-400">Headquarters &amp; Studios</div>
                    <div className="text-sm font-semibold text-white">
                      Johannesburg &amp; Cape Town
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      Available for on-site executive discovery across Gauteng &amp; Western Cape.
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-blue-950/40 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-mono uppercase text-neutral-400">Operating Hours</div>
                    <div className="text-sm font-semibold text-white">
                      {AGENCY_INFO.hours}
                    </div>
                    <div className="text-xs text-blue-400 mt-0.5">
                      24/7 Autonomous AI Bot &amp; Server Monitoring Active
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* POPIA / NDA Guarantee badge */}
            <div className="p-4 rounded border border-blue-500/25 bg-blue-950/20 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
              <div className="text-xs text-neutral-300 leading-relaxed">
                <strong className="text-white font-mono uppercase">POPIA &amp; NDA Protected:</strong> All project specifications, commercial models, and proprietary datasets shared with BT Vizion are governed by strict confidentiality agreements.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Project Discovery Brief Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-blue-500/25 bg-[#0a0d14]/95 p-8 sm:p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                    PROJECT DISCOVERY BRIEF
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight mt-1">
                    SUBMIT YOUR SPECIFICATIONS
                  </h2>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-mono text-blue-300 bg-blue-950/40 px-3 py-1 border border-blue-500/30">
                  Step 1 of 1
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center mx-auto text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase text-white tracking-tight">
                    Brief Initialized Successfully
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-blue-300 font-semibold">{formData.name || 'Partner'}</span>. Our technical director has received your specifications and will deliver an architectural scope and cost breakdown to <span className="text-blue-300 font-semibold">{formData.email || 'your inbox'}</span> within 24 hours.
                  </p>
                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 border border-blue-500/30 hover:border-blue-400 text-xs font-mono uppercase text-blue-300 transition-colors cursor-pointer"
                    >
                      Submit Another Brief
                    </button>
                    <button
                      onClick={onNavigateHome}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase text-xs transition-colors cursor-pointer"
                    >
                      Return Home
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Disciplines */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-3">
                      Required Disciplines (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SERVICES.map((s) => {
                        const active = selectedServices.includes(s.title);
                        return (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => toggleService(s.title)}
                            className={`p-3 text-left rounded border transition-all text-xs font-mono flex items-center justify-between cursor-pointer ${
                              active
                                ? 'bg-blue-500/25 border-blue-400 text-blue-200 font-bold'
                                : 'bg-black/50 border-white/10 text-neutral-400 hover:border-white/30'
                            }`}
                          >
                            <span className="truncate pr-2">{s.title}</span>
                            <span
                              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                                active ? 'bg-blue-500 border-blue-400 text-black' : 'border-neutral-600'
                              }`}
                            >
                              {active && <Check className="w-3 h-3 text-black stroke-[3]" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget & Timeline Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                        Estimated Budget Band (ZAR)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {budgetOptions.map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setBudgetTier(opt)}
                            className={`py-2 px-2 text-center rounded border text-xs font-mono transition-all cursor-pointer truncate ${
                              budgetTier === opt
                                ? 'bg-blue-500/25 border-blue-400 text-blue-200 font-bold'
                                : 'bg-black/50 border-white/10 text-neutral-400 hover:border-white/30'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                        Target Launch Velocity
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {timelineOptions.map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setTimeline(opt)}
                            className={`py-2 px-2 text-center rounded border text-xs font-mono transition-all cursor-pointer truncate ${
                              timeline === opt
                                ? 'bg-blue-500/25 border-blue-400 text-blue-200 font-bold'
                                : 'bg-black/50 border-white/10 text-neutral-400 hover:border-white/30'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Siyabonga Ndlovu"
                        className="w-full px-4 py-2.5 rounded bg-black/60 border border-white/15 focus:border-blue-400 focus:outline-none text-xs text-white placeholder:text-neutral-600 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="siyabonga@company.co.za"
                        className="w-full px-4 py-2.5 rounded bg-black/60 border border-white/15 focus:border-blue-400 focus:outline-none text-xs text-white placeholder:text-neutral-600 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                        WhatsApp / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+27 (0) 82 123 4567"
                        className="w-full px-4 py-2.5 rounded bg-black/60 border border-white/15 focus:border-blue-400 focus:outline-none text-xs text-white placeholder:text-neutral-600 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                        Company or Project Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Nexus Logistics"
                        className="w-full px-4 py-2.5 rounded bg-black/60 border border-white/15 focus:border-blue-400 focus:outline-none text-xs text-white placeholder:text-neutral-600 font-sans"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                      Technical Scope or Problem Statement *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      placeholder="Outline current operational bottlenecks, target user journeys, key integrations (ERP, WhatsApp, Cartrack, Payment Gateways), or expected outcomes..."
                      className="w-full px-4 py-3 rounded bg-black/60 border border-white/15 focus:border-blue-400 focus:outline-none text-xs text-white placeholder:text-neutral-600 font-sans leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Discovery Brief...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Brief &amp; Lock Technical Review</span>
                        </>
                      )}
                    </button>
                    <div className="mt-3 text-[11px] font-mono text-center text-neutral-400">
                      Guaranteed response within 24 business hours • POPIA Compliant
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions with JSON-LD Integration */}
      <div id="contact-faq-section" className="max-w-7xl mx-auto px-6 md:px-8">
        {/* In-DOM JSON-LD Schema.org FAQPage for search engine indexers */}
        <script
          id="contact-faq-schema-dom"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
          [ FREQUENTLY ASKED QUESTIONS ]
        </div>
        <h2 id="contact-faq-heading" className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight mb-8">
          TRANSPARENT ENGAGEMENT ANSWERS
        </h2>

        <div id="contact-faq-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div
              id={`contact-faq-card-${i}`}
              key={i}
              className="p-6 rounded-lg border border-blue-500/20 bg-[#0a0d14]/90 space-y-2 hover:border-blue-400/40 transition-colors"
            >
              <h4 id={`contact-faq-question-${i}`} className="text-sm font-bold text-white uppercase tracking-tight flex items-start gap-2">
                <span className="text-blue-400 font-mono">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p id={`contact-faq-answer-${i}`} className="text-xs text-neutral-300 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
