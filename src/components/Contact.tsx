import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, Clock, ArrowUpRight, HelpCircle, ChevronDown } from 'lucide-react';
import { AGENCY_INFO, FAQS } from '../data/content';
import {
  ScrollReveal,
  ScrollHeaderGradientFill,
  ScrollWordColorReveal,
  SpotlightCard,
} from './ScrollReveal';

interface ContactProps {
  initialService?: string;
}

export default function Contact({ initialService = '' }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || 'Web & App Engineering',
    budget: 'R30,000 - R60,000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ 08 // START A CONVERSATION ]
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text="LET'S BUILD SOMETHING EXTRAORDINARY."
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="max-w-md">
            <ScrollWordColorReveal
              text="Have a project in mind, an existing system to overhaul, or need custom AI automations? Reach out directly or complete the brief below."
              className="text-neutral-400 text-sm md:text-base leading-relaxed font-normal"
            />
          </div>
        </ScrollReveal>

        {/* Contact Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Agency Channels & Meta */}
          <ScrollReveal variant="fade-right" delay={0.1} className="lg:col-span-5 space-y-8">
            <div className="p-6 md:p-8 border border-blue-500/25 bg-black/90 space-y-6 shadow-xl">
              <h3 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Immediate Connection Channels</span>
              </h3>

              <div className="space-y-4 pt-2">
                {/* Direct Phone */}
                <a
                  href={`tel:${AGENCY_INFO.phone}`}
                  className="group flex items-start gap-4 p-4 border border-blue-500/20 hover:border-blue-400/50 transition-colors bg-[#080808]/90"
                >
                  <div className="w-9 h-9 border border-blue-500/30 bg-blue-950/40 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-blue-400">Direct Phone / Call</div>
                    <div className="text-sm font-bold text-white mt-0.5 group-hover:text-blue-200 transition-colors">{AGENCY_INFO.phoneDisplay}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Direct Line (+27)</div>
                  </div>
                </a>

                {/* Direct Email */}
                <a
                  href={`mailto:${AGENCY_INFO.email}`}
                  className="group flex items-start gap-4 p-4 border border-blue-500/20 hover:border-blue-400/50 transition-colors bg-[#080808]/90"
                >
                  <div className="w-9 h-9 border border-blue-500/30 bg-blue-950/40 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-blue-400">Email Inquiries</div>
                    <div className="text-sm font-bold text-white mt-0.5 group-hover:text-blue-200 transition-colors">{AGENCY_INFO.email}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Alternative: {AGENCY_INFO.altEmail}</div>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 border border-blue-500/20 bg-[#080808]/90">
                  <div className="w-9 h-9 border border-blue-500/30 bg-blue-950/40 text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-blue-400">Location &amp; Availability</div>
                    <div className="text-sm font-bold text-white mt-0.5">{AGENCY_INFO.address}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{AGENCY_INFO.hours}</div>
                  </div>
                </div>
              </div>

              {/* SLA Response Badge */}
              <div className="p-4 border border-blue-500/25 bg-blue-950/30 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Guaranteed Response Time:</span>
                <span className="text-blue-300 font-bold">&lt; 2 Hours</span>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <a
              href={`https://wa.me/${AGENCY_INFO.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 border border-blue-500/30 bg-neutral-950/90 hover:bg-blue-500 hover:text-white text-blue-300 transition-all duration-300 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.14)]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Directly On WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </ScrollReveal>

          {/* Right Column: Interactive Inquiry Form */}
          <ScrollReveal variant="fade-left" delay={0.15} className="lg:col-span-7">
            <div className="border border-white/15 bg-black p-6 md:p-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 border border-white mx-auto flex items-center justify-center bg-white text-black">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                    Inquiry Transmitted Successfully
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. Our lead architect has received your project brief and will follow up at {formData.email} within 2 hours.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          service: 'Web & App Engineering',
                          budget: 'R30,000 - R60,000',
                          message: '',
                        });
                      }}
                      className="text-xs uppercase font-mono text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-6 flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-neutral-400">
                      Technical Discovery Brief
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      * All fields confidential
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sipho Mokoena"
                        className="w-full px-4 py-3 bg-[#0a0a0b] border border-white/10 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. sipho@company.co.za"
                        className="w-full px-4 py-3 bg-[#0a0a0b] border border-white/10 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone / WhatsApp */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +27 82 123 4567"
                        className="w-full px-4 py-3 bg-[#0a0a0b] border border-white/10 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    {/* Service Selection */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                        Primary Service Focus
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a0b] border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-400 transition-colors"
                      >
                        <option value="Web & App Engineering">Web & App Engineering</option>
                        <option value="AI Automation & Custom Agents">AI Automation & Custom Agents</option>
                        <option value="Digital Marketing & SEO">Digital Marketing & SEO</option>
                        <option value="Cloud Hosting & Infrastructure">Cloud Hosting & Infrastructure</option>
                        <option value="UI/UX & Multimedia Design">UI/UX & Multimedia Design</option>
                        <option value="Full Digital Ecosystem">Full Integrated Digital Ecosystem</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                      Estimated Project Scope / Budget (ZAR)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['R15k - R30k', 'R30k - R60k', 'R60k - R150k', 'R150k+'].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: tier })}
                          className={`py-2 px-3 text-xs font-mono border text-center transition-all cursor-pointer ${
                            formData.budget === tier
                              ? 'border-blue-400 bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                              : 'border-blue-500/20 bg-[#0a0a0b] text-neutral-400 hover:text-blue-300 hover:border-blue-400/40'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message / Brief */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                      Project Objective &amp; Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your current bottleneck, desired features, or target launch timeline..."
                      className="w-full px-4 py-3 bg-[#0a0a0b] border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                  >
                    <Send className="w-4 h-4 text-blue-500" />
                    <span>Transmit Project Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-24 pt-16 border-t border-white/10">
          <ScrollReveal variant="fade-up" className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-blue-400 mb-3">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              EVERYTHING YOU NEED TO KNOW BEFORE ENGAGING.
            </h3>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.1} className="mt-8 divide-y divide-white/10 max-w-4xl">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-5">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="text-base font-bold text-white uppercase tracking-tight group-hover:text-blue-300 transition-colors">
                      {faq.question}
                    </span>
                    <div className="w-7 h-7 border border-blue-500/30 bg-blue-950/40 flex items-center justify-center shrink-0 group-hover:border-blue-400 text-blue-400">
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-sm text-neutral-400 leading-relaxed font-normal pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
