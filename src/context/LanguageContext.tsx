import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es';

export interface Translations {
  nav: {
    overview: string;
    services: string;
    portfolio: string;
    aiStudio: string;
    about: string;
    contact: string;
    letsTalk: string;
    startProject: string;
    allServices: string;
    aiSolutions: string;
    aiSolutionsDesc: string;
    platform: string;
    language: string;
    current: string;
  };
  hero: {
    tagline: string;
    headline: string[];
    subtext: string;
    startProject: string;
    exploreServices: string;
    estimateRoi: string;
    badgeIp: string;
    badgeSpeed: string;
    badgeCompliance: string;
    badgeSla: string;
  };
  services: {
    tag: string;
    title: string;
    subtitle: string;
    exploreFull: string;
    requestScope: string;
  };
  aiSolutions: {
    tag: string;
    title: string;
    subtitle: string;
    deployAgent: string;
    viewArchitecture: string;
  };
  portfolio: {
    tag: string;
    title: string;
    subtitle: string;
    all: string;
    webApps: string;
    aiAutomation: string;
    ecommerce: string;
    viewLive: string;
    inquireProject: string;
  };
  process: {
    tag: string;
    title: string;
    subtitle: string;
  };
  roi: {
    tag: string;
    title: string;
    subtitle: string;
  };
  about: {
    tag: string;
    title: string;
    subtitle: string;
    viewTeamPage: string;
  };
  contact: {
    tag: string;
    title: string;
    subtitle: string;
    sendBrief: string;
    faqTitle: string;
    guarantee: string;
  };
  footer: {
    desc: string;
    rights: string;
    quickLinks: string;
    solutions: string;
    getInTouch: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      overview: 'Overview',
      services: 'Services',
      portfolio: 'Portfolio',
      aiStudio: 'AI Studio',
      about: 'About',
      contact: 'Contact',
      letsTalk: "Let's Talk",
      startProject: 'Start a Project',
      allServices: '→ All Services Overview',
      aiSolutions: 'AI Solutions',
      aiSolutionsDesc: 'Autonomous agents, voice intelligence & system integrations',
      platform: 'PLATFORM',
      language: 'Language',
      current: '[CURRENT]',
    },
    hero: {
      tagline: 'GLOBAL DIGITAL AGENCY',
      headline: ['ENGINEERING', 'INTELLIGENT', 'DIGITAL SYSTEMS.'],
      subtext:
        'We architect bespoke web platforms, autonomous AI agents, and high-conversion digital ecosystems for visionary enterprises.',
      startProject: 'START A PROJECT',
      exploreServices: 'EXPLORE CAPABILITIES',
      estimateRoi: 'ESTIMATE AUTOMATION ROI',
      badgeIp: '100% IP Ownership',
      badgeSpeed: 'Sub-Second Speeds',
      badgeCompliance: 'POPIA & GDPR Compliant',
      badgeSla: 'Dedicated SLA Response',
    },
    services: {
      tag: '[ 02 // CAPABILITIES & ENGINEERING ]',
      title: 'ARCHITECTED FOR MEASURABLE IMPACT.',
      subtitle:
        'From custom full-stack web platforms to autonomous AI agent swarms, we build scalable software tailored to your commercial objectives.',
      exploreFull: 'EXPLORE FULL SERVICE ARCHITECTURE',
      requestScope: 'Request Architecture Scope',
    },
    aiSolutions: {
      tag: '[ 03 // AUTONOMOUS WORKFLOWS ]',
      title: 'CUSTOM AI AGENTS BUILT FOR HIGH-VELOCITY TEAMS',
      subtitle:
        'Eliminate repetitive manual tasks, automate customer triage, and orchestrate business operations with bespoke intelligent agents.',
      deployAgent: 'DEPLOY AN AI AGENT',
      viewArchitecture: 'VIEW SYSTEM ARCHITECTURE',
    },
    portfolio: {
      tag: '[ 04 // SELECTED CLIENT WORK ]',
      title: 'PRODUCTION SYSTEMS DELIVERED.',
      subtitle:
        'A curated selection of high-velocity web platforms, autonomous AI pipelines, and headless commerce engines built for real enterprise impact.',
      all: 'All Projects',
      webApps: 'Web & Apps',
      aiAutomation: 'AI & Automation',
      ecommerce: 'E-Commerce',
      viewLive: 'View Live Viewport',
      inquireProject: 'Inquire Similar System',
    },
    process: {
      tag: '[ 05 // DELIVERY METHODOLOGY ]',
      title: 'PRECISION SPRINT CYCLES.',
      subtitle:
        'Our battle-tested 4-stage engineering methodology ensures transparent milestones, rapid deployments, and zero operational friction.',
    },
    roi: {
      tag: '[ 06 // BUSINESS IMPACT SIMULATOR ]',
      title: 'ESTIMATE YOUR AUTOMATION SAVINGS',
      subtitle:
        'Calculate your organization’s projected labor savings, workflow acceleration, and estimated return on automated AI infrastructure.',
    },
    about: {
      tag: '[ 07 // STUDIO CREDENTIALS ]',
      title: 'ENGINEERING WITH ARCHITECTURAL CRAFTSMANSHIP.',
      subtitle:
        'We are an elite digital agency blending high-performance software engineering with applied machine learning and measurable commercial conversion.',
      viewTeamPage: 'EXPLORE COMPANY BLUEPRINT & LEADERSHIP',
    },
    contact: {
      tag: '[ 08 // START A CONVERSATION ]',
      title: "LET'S BUILD SOMETHING EXTRAORDINARY.",
      subtitle:
        'Have a project in mind, an existing system to overhaul, or need custom AI automations? Reach out directly or complete the brief below.',
      sendBrief: 'Transmit Brief & Lock Technical Review',
      faqTitle: 'TRANSPARENT ENGAGEMENT ANSWERS',
      guarantee: 'Guaranteed response within 24 business hours • POPIA Compliant',
    },
    footer: {
      desc: 'Next-generation digital agency specializing in high-performance web development, AI automation agents, and intelligent marketing ecosystems.',
      rights: 'All Rights Reserved.',
      quickLinks: 'Navigation',
      solutions: 'Capabilities',
      getInTouch: 'Direct Inquiries',
    },
  },
  es: {
    nav: {
      overview: 'Inicio',
      services: 'Servicios',
      portfolio: 'Portafolio',
      aiStudio: 'Estudio IA',
      about: 'Nosotros',
      contact: 'Contacto',
      letsTalk: 'Hablemos',
      startProject: 'Iniciar Proyecto',
      allServices: '→ Ver Todos los Servicios',
      aiSolutions: 'Soluciones de IA',
      aiSolutionsDesc: 'Agentes autónomos, inteligencia de voz e integraciones de sistemas',
      platform: 'PLATAFORMA',
      language: 'Idioma',
      current: '[ACTUAL]',
    },
    hero: {
      tagline: 'AGENCIA DIGITAL GLOBAL',
      headline: ['INGENIERÍA DE', 'SISTEMAS DIGITALES', 'INTELIGENTES.'],
      subtext:
        'Diseñamos plataformas web a medida, agentes de IA autónomos y ecosistemas digitales de alta conversión para empresas visionarias.',
      startProject: 'INICIAR PROYECTO',
      exploreServices: 'EXPLORAR CAPACIDADES',
      estimateRoi: 'CALCULAR ROI DE AUTOMATIZACIÓN',
      badgeIp: '100% Propiedad del Código',
      badgeSpeed: 'Velocidad Subsegundo',
      badgeCompliance: 'Cumplimiento POPIA y GDPR',
      badgeSla: 'SLA Dedicado de Respuesta',
    },
    services: {
      tag: '[ 02 // CAPACIDADES E INGENIERÍA ]',
      title: 'DISEÑADO PARA UN IMPACTO MEDIBLE.',
      subtitle:
        'Desde plataformas web personalizadas hasta enjambres de agentes de IA autónomos, creamos software escalable adaptado a sus objetivos comerciales.',
      exploreFull: 'EXPLORAR ARQUITECTURA COMPLETA DE SERVICIOS',
      requestScope: 'Solicitar Alcance Técnico',
    },
    aiSolutions: {
      tag: '[ 03 // FLUJOS DE TRABAJO AUTÓNOMOS ]',
      title: 'AGENTES DE IA PERSONALIZADOS PARA EQUIPOS DE ALTA VELOCIDAD',
      subtitle:
        'Elimine tareas manuales repetitivas, automatice la atención a clientes y gestione operaciones comerciales con agentes inteligentes a medida.',
      deployAgent: 'DESPLEGAR UN AGENTE IA',
      viewArchitecture: 'VER ARQUITECTURA DEL SISTEMA',
    },
    portfolio: {
      tag: '[ 04 // PROYECTOS DESTACADOS ]',
      title: 'SISTEMAS EN PRODUCCIÓN ENTREGADOS.',
      subtitle:
        'Una selección de plataformas web de alta velocidad, flujos de IA autónomos y motores de comercio headless diseñados para un impacto real.',
      all: 'Todos los Proyectos',
      webApps: 'Web y Apps',
      aiAutomation: 'IA y Automatización',
      ecommerce: 'Comercio Electrónico',
      viewLive: 'Ver Demostración en Vivo',
      inquireProject: 'Consultar Sistema Similar',
    },
    process: {
      tag: '[ 05 // METODOLOGÍA DE ENTREGA ]',
      title: 'CICLOS SPRINT DE PRECISIÓN.',
      subtitle:
        'Nuestra metodología de ingeniería probada en 4 etapas garantiza entregas transparentes, despliegues rápidos y cero fricción operativa.',
    },
    roi: {
      tag: '[ 06 // SIMULADOR DE IMPACTO COMERCIAL ]',
      title: 'CALCULE SUS AHORROS CON AUTOMATIZACIÓN',
      subtitle:
        'Estime el ahorro de horas laborales, la aceleración de flujos de trabajo y el retorno proyectado de la infraestructura de IA.',
    },
    about: {
      tag: '[ 07 // CREDENCIALES DEL ESTUDIO ]',
      title: 'INGENIERÍA CON PRECISIÓN ARQUITECTÓNICA.',
      subtitle:
        'Somos una agencia digital de élite que combina desarrollo de software de alto rendimiento con aprendizaje automático y conversión comercial medible.',
      viewTeamPage: 'EXPLORAR ESTRUCTURA Y LIDERAZGO DE LA EMPRESA',
    },
    contact: {
      tag: '[ 08 // INICIAR UNA CONVERSACIÓN ]',
      title: 'CONSTRUYAMOS ALGO EXTRAORDINARIO.',
      subtitle:
        '¿Tiene un proyecto en mente, un sistema existente para modernizar o necesita automatizaciones de IA personalizadas? Contáctenos o complete el formulario.',
      sendBrief: 'Enviar Resumen y Solicitar Revisión Técnica',
      faqTitle: 'RESPUESTAS CLARAS SOBRE NUESTRO SERVICIO',
      guarantee: 'Respuesta garantizada en 24 horas hábiles • Cumplimiento POPIA',
    },
    footer: {
      desc: 'Agencia digital de próxima generación especializada en desarrollo web de alto rendimiento, agentes de automatización con IA y ecosistemas de marketing inteligente.',
      rights: 'Todos los derechos reservados.',
      quickLinks: 'Navegación',
      solutions: 'Capacidades',
      getInTouch: 'Contacto Directo',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'btv_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'en' || stored === 'es') {
        return stored;
      }
      // Detect browser language if starting with 'es'
      if (navigator.language && navigator.language.startsWith('es')) {
        return 'es';
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        document.documentElement.lang = lang;
      } catch {
        // Safe fallback if localStorage is disabled
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: TRANSLATIONS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
