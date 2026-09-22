import { ArrowUp, ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
import { AGENCY_INFO } from '../data/content';
import BtvLogo from './BtvLogo';
import { useLanguage } from '../context/LanguageContext';
import {
  ScrollReveal,
  SpotlightCard,
  ScrollWordColorReveal,
  ScrollHeaderGradientFill,
} from './ScrollReveal';

interface FooterProps {
  onOpenContact: () => void;
  onNavigate?: (page: 'home' | 'services' | 'portfolio' | 'about' | 'contact', anchor?: string) => void;
}

export default function Footer({ onOpenContact, onNavigate }: FooterProps) {
  const { language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: 'home' | 'services' | 'portfolio' | 'about' | 'contact', anchor?: string) => {
    if (onNavigate) {
      onNavigate(page, anchor);
    } else if (anchor) {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-transparent border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Giant Creovibe / Webfolio Callout Banner */}
        <ScrollReveal variant="fade-up">
          <SpotlightCard
            spotlightColor="rgba(59, 130, 246, 0.14)"
            className="p-8 md:p-12 border border-blue-500/25 bg-neutral-950/90 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 hover:border-blue-400/50 shadow-[0_0_40px_rgba(59,130,246,0.12)] transition-colors"
          >
            <div>
              <div className="text-xs font-mono uppercase text-blue-400 tracking-widest mb-3">
                // {language === 'en' ? 'NEXT-GEN DIGITAL ARCHITECTURE' : 'ARQUITECTURA DIGITAL DE PRÓXIMA GENERACIÓN'}
              </div>
              <ScrollHeaderGradientFill
                as="h2"
                lines={
                  language === 'en'
                    ? ['READY TO SCALE YOUR', 'DIGITAL ADVANTAGE?']
                    : ['¿LISTO PARA ESCALAR', 'SU VENTAJA DIGITAL?']
                }
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase leading-tight"
              />
              <div className="mt-3 max-w-xl">
                <ScrollWordColorReveal
                  text={
                    language === 'en'
                      ? 'Partner with our Johannesburg and Cape Town engineering studios to build bespoke high-throughput software and autonomous AI workflows.'
                      : 'Colabore con nuestros estudios de ingeniería para desarrollar software de alto rendimiento y flujos de trabajo de IA autónomos.'
                  }
                  className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal"
                />
              </div>
            </div>

            <button
              onClick={onOpenContact}
              className="self-start lg:self-center px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all duration-300 flex items-center gap-3 cursor-pointer shrink-0 shadow-[0_0_25px_rgba(59,130,246,0.25)]"
            >
              <span>{language === 'en' ? 'Initiate Discovery Call' : 'Iniciar Llamada de Descubrimiento'}</span>
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
            </button>
          </SpotlightCard>
        </ScrollReveal>

        {/* Links & Details Grid */}
        <ScrollReveal variant="fade-up" delay={0.1} className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <BtvLogo className="h-[20.4px] sm:h-[23.8px] w-auto" />
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase pl-2 border-l border-white/20">
                GLOBAL STUDIO
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {language === 'en'
                ? 'BT Vizion engineers high-performance web applications, autonomous AI agents, and integrated marketing funnels for forward-thinking enterprises globally.'
                : 'BT Vizion diseña aplicaciones web de alto rendimiento, agentes de IA autónomos y embudos de marketing integrados para empresas innovadoras a nivel global.'}
            </p>
            <div className="pt-2 text-[11px] font-mono text-neutral-400">
              Johannesburg &amp; Cape Town
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase text-white tracking-wider flex items-center justify-between">
              <span>{language === 'en' ? 'Core Capabilities' : 'Capacidades Principales'}</span>
              <button
                onClick={() => handleNav('services')}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-mono underline cursor-pointer"
              >
                {language === 'en' ? 'Full Services Page →' : 'Página de Servicios →'}
              </button>
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'Web & App Development' : 'Desarrollo Web y Apps'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'Autonomous AI Agents' : 'Agentes Autónomos de IA'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'Digital Marketing & SEO' : 'Marketing Digital y SEO'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'Cloud Infrastructure Hosting' : 'Infraestructura y Alojamiento Cloud'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'UI/UX & Multimedia Design' : 'Diseño UI/UX y Multimedia'}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase text-white tracking-wider">
              {language === 'en' ? 'Navigation' : 'Navegación'}
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => handleNav('portfolio')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 text-blue-400 font-medium"
                >
                  <span>{language === 'en' ? 'Portfolio Directory →' : 'Directorio de Portafolio →'}</span>
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-950/60 px-1 py-0.5 border border-blue-500/20 rounded">ALL WORK</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home', 'work')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'Selected Work' : 'Trabajos Destacados'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home', 'process')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'Our Methodology' : 'Nuestra Metodología'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home', 'calculator')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer"
                >
                  {language === 'en' ? 'ROI Estimator' : 'Estimador de ROI'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer text-blue-400 font-medium"
                >
                  {language === 'en' ? 'About Agency Page →' : 'Acerca de la Agencia →'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-blue-300 transition-colors text-left cursor-pointer text-blue-400 font-medium"
                >
                  {language === 'en' ? 'Contact Hub Page →' : 'Página de Contacto →'}
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Channels Column */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase text-white tracking-wider">
              {language === 'en' ? 'Direct Contact' : 'Contacto Directo'}
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <a href={`tel:${AGENCY_INFO.phone}`} className="hover:text-blue-300 transition-colors">
                  {AGENCY_INFO.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <a href={`mailto:${AGENCY_INFO.email}`} className="hover:text-blue-300 transition-colors">
                  {AGENCY_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Johannesburg &amp; Cape Town (UTC+2)</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        {/* Bottom copyright & Scroll To Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            © {new Date().getFullYear()} {AGENCY_INFO.legalName}. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </div>

          <div className="flex items-center gap-6">
            <span>POPIA &amp; GDPR Compliant</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-blue-300 transition-colors cursor-pointer text-blue-400"
            >
              <span>{language === 'en' ? 'Back to Top' : 'Volver Arriba'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
