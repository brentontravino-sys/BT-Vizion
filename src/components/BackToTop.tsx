import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero');
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate scroll progress percentage (0 - 100)
      if (scrollHeight > 0) {
        setScrollPercentage(Math.min(100, Math.round((scrollTop / scrollHeight) * 100)));
      }

      // Check if user has scrolled past the hero section
      if (heroElement) {
        const heroRect = heroElement.getBoundingClientRect();
        // If bottom of hero is above or near the viewport top
        setIsVisible(heroRect.bottom < 50);
      } else {
        // Fallback if hero id is not present
        setIsVisible(scrollTop > 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="back-to-top-button"
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top of page"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/20 hover:border-white/50 shadow-2xl backdrop-blur-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          {/* Circular SVG Scroll Progress Ring */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
              {/* Background circle */}
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-white/15"
              />
              {/* Progress arc */}
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray="56.5"
                strokeDashoffset={56.5 - (56.5 * scrollPercentage) / 100}
                className="text-white transition-all duration-150"
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="w-3 h-3 text-white absolute transition-transform duration-200 group-hover:-translate-y-0.5" />
          </div>

          <span className="text-xs font-mono font-medium tracking-wider uppercase text-neutral-200 group-hover:text-white select-none">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
