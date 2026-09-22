import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ScrollProgressBar } from './components/ScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import AiSolutions from './components/AiSolutions';
import AiStudioSuite from './components/AiStudioSuite';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import RoiCalculator from './components/RoiCalculator';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingChatbot from './components/FloatingChatbot';
import CinematicDepthStage from './components/CinematicDepthStage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export type PageRoute = 'home' | 'services' | 'portfolio' | 'about' | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [contactServicePreset, setContactServicePreset] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  // Handle initial route from URL hash or pathname
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      if (hash === '#services-page' || window.location.pathname === '/services') {
        setCurrentPage('services');
      } else if (hash === '#portfolio-page' || hash === '#portfolio' || window.location.pathname === '/portfolio') {
        setCurrentPage('portfolio');
      } else if (hash === '#about-page' || window.location.pathname === '/about') {
        setCurrentPage('about');
      } else if (hash === '#contact-page' || window.location.pathname === '/contact') {
        setCurrentPage('contact');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigateTo = (page: PageRoute, anchor?: string, serviceId?: string) => {
    setCurrentPage(page);
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'services') {
      window.history.pushState({}, '', '#services-page');
    } else if (page === 'portfolio') {
      window.history.pushState({}, '', '#portfolio-page');
    } else if (page === 'about') {
      window.history.pushState({}, '', '#about-page');
    } else if (page === 'contact') {
      window.history.pushState({}, '', '#contact-page');
    } else {
      window.history.pushState({}, '', '#');
      if (anchor) {
        setTimeout(() => {
          const el = document.getElementById(anchor);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleOpenContact = () => {
    if (currentPage !== 'home') {
      navigateTo('contact');
    } else {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigateTo('contact');
      }
    }
  };

  const handleSelectService = (serviceName: string) => {
    setContactServicePreset(serviceName);
    handleOpenContact();
  };

  const handleSelectPlan = (_details: string) => {
    setContactServicePreset('AI Automation & Custom Agents');
    handleOpenContact();
  };

  const handleInquireProject = (projectName: string) => {
    setContactServicePreset(`Inquiry regarding: ${projectName}`);
    handleOpenContact();
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#080808] text-[#f4f4f5] font-sans antialiased selection:bg-white selection:text-black relative">
        {/* Cinematic Analog Texture & Volumetric Light Stage */}
        <CinematicDepthStage />

        {/* Top scroll progress indicator */}
        <ScrollProgressBar />

        {/* Top sticky navigation */}
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenContact={handleOpenContact}
        />

        {/* Page Routing Views */}
        <main>
          {currentPage === 'services' && (
            <ServicesPage
              onNavigateHome={() => navigateTo('home')}
              onSelectService={handleSelectService}
              onOpenContact={() => navigateTo('contact')}
              initialServiceId={selectedServiceId}
            />
          )}

          {currentPage === 'portfolio' && (
            <PortfolioPage
              onNavigateHome={() => navigateTo('home')}
              onOpenContact={() => navigateTo('contact')}
              onInquireProject={handleInquireProject}
            />
          )}

          {currentPage === 'about' && (
            <AboutPage
              onNavigateHome={() => navigateTo('home')}
              onOpenContact={() => navigateTo('contact')}
            />
          )}

          {currentPage === 'contact' && (
            <ContactPage
              onNavigateHome={() => navigateTo('home')}
              initialService={contactServicePreset}
            />
          )}

          {currentPage === 'home' && (
            <>
              {/* 1. Hero Section */}
              <Hero onOpenContact={handleOpenContact} />

              {/* 2. Core Capabilities / Services Accordion with link to dedicated page */}
              <Services
                onSelectService={handleSelectService}
                onNavigateToServicesPage={() => navigateTo('services')}
              />

              {/* 3. Autonomous AI Solutions Feature */}
              <AiSolutions onOpenContact={handleOpenContact} />

              {/* 4. Interactive Multimodal AI Studio (Chat, Voice, Images & Veo Video) */}
              <AiStudioSuite />

              {/* 5. Selected Work / Filterable Portfolio with BrowserMockups */}
              <Portfolio
                onInquireProject={handleInquireProject}
                onNavigateToPortfolioPage={() => navigateTo('portfolio')}
              />

              {/* 6. Our 4-Stage Methodology */}
              <Process onOpenContact={handleOpenContact} />

              {/* 7. Interactive Automation ROI Estimator */}
              <RoiCalculator onPlanSelected={handleSelectPlan} />

              {/* 8. About BT Vizion & Credentials with link to dedicated page */}
              <About
                onOpenContact={handleOpenContact}
                onNavigateToAboutPage={() => navigateTo('about')}
              />

              {/* 9. Client Testimonials */}
              <Testimonials />

              {/* 10. Contact Brief & FAQ Accordion */}
              <Contact initialService={contactServicePreset} />
            </>
          )}
        </main>

        {/* Footer */}
        <Footer
          onOpenContact={handleOpenContact}
          onNavigate={navigateTo}
        />

        {/* Floating Back to Top Navigation (Bottom-Right) */}
        <BackToTop />

        {/* Floating BTV Chatbot (Bottom-Left, Entire Site) */}
        <FloatingChatbot />
      </div>
    </LanguageProvider>
  );
}
