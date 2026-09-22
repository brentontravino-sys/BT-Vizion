import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ArrowUpRight,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  Globe,
  Bot,
  TrendingUp,
  Server,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { AGENCY_INFO } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import BtvLogo from './BtvLogo';

interface NavbarProps {
  currentPage: 'home' | 'services' | 'portfolio' | 'about' | 'contact';
  onNavigate: (page: 'home' | 'services' | 'portfolio' | 'about' | 'contact', anchor?: string, serviceId?: string) => void;
  onOpenContact: () => void;
}

const SERVICE_DROPDOWN_ITEMS = [
  {
    id: 'web-development',
    title: 'Web & App Engineering',
    category: 'Development',
    desc: 'Custom web apps, portals & headless e-commerce',
    icon: Globe,
  },
  {
    id: 'ai-automation',
    title: 'AI Automation & Custom Agents',
    category: 'Artificial Intelligence',
    desc: 'Autonomous workflows, CRM bots & document intelligence',
    icon: Bot,
  },
  {
    id: 'digital-marketing',
    title: 'Conversion & Growth Engineering',
    category: 'Growth',
    desc: 'High-converting funnels, analytics & acquisition loops',
    icon: TrendingUp,
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Infrastructure & DevOps',
    category: 'Infrastructure',
    desc: 'AWS / GCP architecture, containerized scale & 99.9% SLA',
    icon: Server,
  },
  {
    id: 'consulting',
    title: 'Digital Transformation & Strategy',
    category: 'Strategy',
    desc: 'System audits, technical blueprints & AI roadmaps',
    icon: Sparkles,
  },
];

export default function Navbar({ currentPage, onNavigate, onOpenContact }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateSAST = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-ZA', {
          timeZone: 'Africa/Johannesburg',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
        setCurrentTime(`${timeStr} SAST`);
      } catch {
        setCurrentTime('SAST');
      }
    };
    updateSAST();
    const interval = setInterval(updateSAST, 30000);
    return () => clearInterval(interval);
  }, []);

  const serviceDropdownItems = [
    {
      id: 'web-development',
      title: language === 'en' ? 'Web & App Engineering' : 'Ingeniería Web y Apps',
      category: language === 'en' ? 'Development' : 'Desarrollo',
      desc: language === 'en' ? 'Custom web apps, portals & headless e-commerce' : 'Aplicaciones web a medida, portales y comercio headless',
      icon: Globe,
    },
    {
      id: 'ai-automation',
      title: language === 'en' ? 'AI Automation & Custom Agents' : 'Automatización con IA y Agentes',
      category: language === 'en' ? 'Artificial Intelligence' : 'Inteligencia Artificial',
      desc: language === 'en' ? 'Autonomous workflows, CRM bots & document intelligence' : 'Flujos autónomos, bots CRM e inteligencia de documentos',
      icon: Bot,
    },
    {
      id: 'digital-marketing',
      title: language === 'en' ? 'Conversion & Growth Engineering' : 'Ingeniería de Conversión y Crecimiento',
      category: language === 'en' ? 'Growth' : 'Crecimiento',
      desc: language === 'en' ? 'High-converting funnels, analytics & acquisition loops' : 'Embudos de alta conversión, analítica y bucles de adquisición',
      icon: TrendingUp,
    },
    {
      id: 'cloud-solutions',
      title: language === 'en' ? 'Cloud Infrastructure & DevOps' : 'Infraestructura Cloud y DevOps',
      category: language === 'en' ? 'Infrastructure' : 'Infraestructura',
      desc: language === 'en' ? 'AWS / GCP architecture, containerized scale & 99.9% SLA' : 'Arquitectura AWS / GCP, contenedores y SLA del 99.9%',
      icon: Server,
    },
    {
      id: 'consulting',
      title: language === 'en' ? 'Digital Transformation & Strategy' : 'Transformación Digital y Estrategia',
      category: language === 'en' ? 'Strategy' : 'Estrategia',
      desc: language === 'en' ? 'System audits, technical blueprints & AI roadmaps' : 'Auditorías de sistemas, planos técnicos y hojas de ruta de IA',
      icon: Sparkles,
    },
  ];

  const navLinks = [
    { name: t.nav.overview, page: 'home' as const, href: '#' },
    { name: t.nav.portfolio, page: 'portfolio' as const, href: '/portfolio' },
    { name: t.nav.aiStudio, page: 'home' as const, anchor: 'ai-studio', href: '#ai-studio' },
    { name: t.nav.about, page: 'about' as const, href: '/about' },
    { name: t.nav.contact, page: 'contact' as const, href: '/contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (link.page !== currentPage) {
      onNavigate(link.page, link.anchor);
    } else if (link.anchor) {
      const el = document.getElementById(link.anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.page === 'home' && !link.anchor) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAiSolutionsClick = () => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home', 'ai-solutions');
    } else {
      const el = document.getElementById('ai-solutions');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-blue-500/20 py-3.5 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          id="brand-logo"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="group flex items-center gap-3 text-white focus:outline-none py-1 cursor-pointer"
        >
          <BtvLogo className="h-[20.4px] sm:h-[23.8px] w-auto transition-opacity duration-200 group-hover:opacity-90" />
          <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-blue-400 uppercase pl-3 border-l border-white/20">
            {language === 'en' ? 'DIGITAL & AI' : 'DIGITAL E IA'}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {/* Overview Link */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage !== 'home') {
                onNavigate('home');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`text-xs font-mono uppercase tracking-wider transition-colors duration-200 py-1 cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'home'
                ? 'text-blue-300 font-bold'
                : 'text-neutral-300 hover:text-blue-300'
            }`}
          >
            {currentPage === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            )}
            <span>{t.nav.overview}</span>
          </a>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                onNavigate('services');
                setServicesDropdownOpen(false);
              }}
              className={`text-xs font-mono uppercase tracking-wider transition-colors duration-200 py-1 cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'services'
                  ? 'text-blue-300 font-bold'
                  : 'text-neutral-300 hover:text-blue-300'
              }`}
            >
              {currentPage === 'services' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              )}
              <span>{t.nav.services}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesDropdownOpen ? 'rotate-180 text-blue-400' : 'text-neutral-400'
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {servicesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute top-full -left-6 mt-2 w-96 rounded-lg bg-[#0b0e17]/95 border border-blue-500/30 p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      [ {language === 'en' ? 'Capabilities & Disciplines' : 'Capacidades y Disciplinas'} ]
                    </span>
                    <button
                      onClick={() => {
                        setServicesDropdownOpen(false);
                        onNavigate('services');
                      }}
                      className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {t.nav.allServices} <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="mt-1.5 flex flex-col gap-1">
                    {serviceDropdownItems.map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => {
                            setServicesDropdownOpen(false);
                            onNavigate('services', undefined, service.id);
                          }}
                          className="w-full text-left p-2.5 rounded-md hover:bg-white/[0.06] border border-transparent hover:border-blue-500/25 transition-all duration-150 flex items-start gap-3 group cursor-pointer"
                        >
                          <div className="p-2 rounded bg-blue-950/40 border border-blue-500/25 text-blue-400 group-hover:text-white group-hover:bg-blue-600/30 transition-colors shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-neutral-200 group-hover:text-blue-200 transition-colors truncate">
                                {service.title}
                              </span>
                              <span className="text-[9px] font-mono uppercase text-blue-400/80 border border-blue-500/20 px-1.5 py-0.5 rounded shrink-0">
                                {service.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 font-normal">
                              {service.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                    {/* AI Solutions Featured Section under Services */}
                    <div className="mt-1.5 pt-2 border-t border-white/10">
                      <button
                        onClick={handleAiSolutionsClick}
                        className="w-full text-left p-2.5 rounded-md bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/25 hover:border-blue-400/50 transition-all duration-150 flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-blue-500/20 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors shrink-0">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white group-hover:text-blue-200 transition-colors">
                                {t.nav.aiSolutions}
                              </span>
                              <span className="text-[9px] font-mono uppercase text-blue-300 bg-blue-500/20 border border-blue-400/30 px-1.5 py-0.5 rounded font-bold">
                                {t.nav.platform}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                              {t.nav.aiSolutionsDesc}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other Nav Links (Portfolio, AI Studio, About, Contact) */}
          {navLinks.slice(1).map((link) => {
            const isActive =
              link.page === currentPage &&
              (!link.anchor || (link.anchor && currentPage === 'home'));
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`text-xs font-mono uppercase tracking-wider transition-colors duration-200 py-1 cursor-pointer flex items-center gap-1.5 ${
                  link.page === currentPage && !link.anchor
                    ? 'text-blue-300 font-bold'
                    : 'text-neutral-300 hover:text-blue-300'
                }`}
              >
                {link.page === currentPage && !link.anchor && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                )}
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Action & Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Switcher Toggle (Desktop & Tablet) */}
          <div
            id="nav-language-toggle"
            className="flex items-center rounded border border-white/20 bg-neutral-950/80 p-0.5 text-[11px] font-mono backdrop-blur-sm shadow-sm"
            role="group"
            aria-label={language === 'en' ? 'Language Selector' : 'Selector de Idioma'}
          >
            <button
              id="lang-btn-en"
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded transition-all duration-150 cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
              aria-pressed={language === 'en'}
              title="Switch to English"
            >
              <span className="font-semibold">EN</span>
            </button>
            <button
              id="lang-btn-es"
              type="button"
              onClick={() => setLanguage('es')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded transition-all duration-150 cursor-pointer ${
                language === 'es'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
              aria-pressed={language === 'es'}
              title="Cambiar a Español"
            >
              <span className="font-semibold">ES</span>
            </button>
          </div>

          {/* SAST live time badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 border border-blue-500/25 text-xs text-blue-300 bg-blue-950/30 font-mono">
            <Clock className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>{currentTime || 'Johannesburg'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          </div>

          <button
            id="nav-cta-btn"
            onClick={() => onNavigate('contact')}
            className="hidden sm:inline-flex group relative items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.25)]"
          >
            <span>{t.nav.letsTalk}</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-blue-600" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-200 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-6 py-6 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {/* Mobile Language Switcher Banner */}
              <div
                id="mobile-language-toggle"
                className="flex items-center justify-between py-2.5 px-3 mb-2 rounded border border-white/10 bg-white/5 font-mono text-xs"
              >
                <div className="flex items-center gap-2 text-neutral-300">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>{t.nav.language}:</span>
                </div>
                <div className="flex items-center rounded border border-white/20 bg-black/60 p-0.5">
                  <button
                    id="mobile-lang-btn-en"
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded transition-colors text-xs font-mono cursor-pointer ${
                      language === 'en'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    EN (English)
                  </button>
                  <button
                    id="mobile-lang-btn-es"
                    type="button"
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1 rounded transition-colors text-xs font-mono cursor-pointer ${
                      language === 'es'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ES (Español)
                  </button>
                </div>
              </div>

              {/* Overview */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  if (currentPage !== 'home') onNavigate('home');
                  else window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm font-mono uppercase tracking-wider py-2 border-b border-white/5 flex items-center justify-between ${
                  currentPage === 'home' ? 'text-blue-300 font-bold' : 'text-neutral-200 hover:text-white'
                }`}
              >
                <span>{t.nav.overview}</span>
                {currentPage === 'home' && (
                  <span className="text-[10px] text-blue-400 font-mono">{t.nav.current}</span>
                )}
              </a>

              {/* Services with Expandable Sub-items */}
              <div className="border-b border-white/5 py-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('services');
                    }}
                    className={`text-sm font-mono uppercase tracking-wider text-left flex-1 cursor-pointer ${
                      currentPage === 'services' ? 'text-blue-300 font-bold' : 'text-neutral-200 hover:text-white'
                    }`}
                  >
                    {t.nav.services}
                  </button>
                  <button
                    onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
                    className="p-1 text-neutral-400 hover:text-blue-400 cursor-pointer"
                    aria-label="Toggle Services List"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileServicesExpanded ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                </div>

                {mobileServicesExpanded && (
                  <div className="mt-2 pl-3 border-l border-blue-500/30 flex flex-col gap-1.5 py-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate('services');
                      }}
                      className="text-xs font-mono uppercase text-blue-400 hover:text-blue-300 text-left py-1"
                    >
                      {t.nav.allServices}
                    </button>
                    {serviceDropdownItems.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigate('services', undefined, s.id);
                        }}
                        className="text-xs text-neutral-300 hover:text-blue-300 text-left py-1 flex items-center justify-between"
                      >
                        <span>{s.title}</span>
                        <span className="text-[9px] font-mono uppercase text-neutral-500">{s.category}</span>
                      </button>
                    ))}

                    <button
                      onClick={handleAiSolutionsClick}
                      className="mt-1 text-xs text-blue-300 hover:text-white text-left py-1.5 px-2 rounded bg-blue-950/40 border border-blue-500/25 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Cpu className="w-3.5 h-3.5 text-blue-400" />
                        {t.nav.aiSolutions}
                      </span>
                      <span className="text-[9px] font-mono text-blue-400 uppercase">Platform →</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Portfolio */}
              <a
                href="/portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onNavigate('portfolio');
                }}
                className={`text-sm font-mono uppercase tracking-wider py-2 border-b border-white/5 flex items-center justify-between ${
                  currentPage === 'portfolio' ? 'text-blue-300 font-bold' : 'text-neutral-200 hover:text-white'
                }`}
              >
                <span>{t.nav.portfolio}</span>
                {currentPage === 'portfolio' && (
                  <span className="text-[10px] text-blue-400 font-mono">{t.nav.current}</span>
                )}
              </a>

              {/* Other Links */}
              {navLinks.slice(2).map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-sm font-mono uppercase tracking-wider py-2 border-b border-white/5 flex items-center justify-between ${
                    link.page === currentPage && !link.anchor
                      ? 'text-blue-300 font-bold'
                      : 'text-neutral-200 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.page === currentPage && !link.anchor && (
                    <span className="text-[10px] text-blue-400 font-mono">{t.nav.current}</span>
                  )}
                </a>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <a
                  href={`tel:${AGENCY_INFO.phone}`}
                  className="flex items-center gap-2 text-xs text-neutral-300 font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  {AGENCY_INFO.phoneDisplay}
                </a>
                <a
                  href={`mailto:${AGENCY_INFO.email}`}
                  className="flex items-center gap-2 text-xs text-neutral-300 font-mono"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {AGENCY_INFO.email}
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('contact');
                  }}
                  className="w-full mt-2 py-3 bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs uppercase tracking-wider text-center transition-colors cursor-pointer"
                >
                  {t.nav.startProject}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
