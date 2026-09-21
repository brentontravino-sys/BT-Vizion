import { useRef, useState, ReactNode, Key, MouseEvent } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform, MotionValue } from 'motion/react';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'blur-in'
  | 'clip-reveal';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  amount?: number | 'some' | 'all';
  once?: boolean;
  rootMargin?: string;
  id?: string;
  key?: Key;
}

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.65,
  distance = 32,
  className = '',
  amount = 0.15,
  once = true,
  rootMargin = '-50px 0px -40px 0px',
  id,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount,
    margin: rootMargin as any,
  });

  const getInitialAndTarget = () => {
    switch (variant) {
      case 'fade-up':
        return {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
        };
      case 'fade-down':
        return {
          initial: { opacity: 0, y: -distance },
          animate: { opacity: 1, y: 0 },
        };
      case 'fade-left':
        return {
          initial: { opacity: 0, x: -distance },
          animate: { opacity: 1, x: 0 },
        };
      case 'fade-right':
        return {
          initial: { opacity: 0, x: distance },
          animate: { opacity: 1, x: 0 },
        };
      case 'scale-up':
        return {
          initial: { opacity: 0, scale: 0.94, y: distance * 0.5 },
          animate: { opacity: 1, scale: 1, y: 0 },
        };
      case 'blur-in':
        return {
          initial: { opacity: 0, filter: 'blur(8px)', y: distance * 0.6 },
          animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
        };
      case 'clip-reveal':
        return {
          initial: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
          animate: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
        };
      default:
        return {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const { initial, animate } = getInitialAndTarget();

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Cubic bezier for editorial luxury motion
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  amount?: number | 'some' | 'all';
  once?: boolean;
  rootMargin?: string;
  id?: string;
  key?: Key;
}

export function ScrollStagger({
  children,
  staggerDelay = 0.09,
  delay = 0,
  className = '',
  amount = 0.15,
  once = true,
  rootMargin = '-50px 0px -40px 0px',
  id,
}: ScrollStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount,
    margin: rootMargin as any,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerItemProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  id?: string;
  key?: Key;
}

export function ScrollStaggerItem({
  children,
  className = '',
  distance = 28,
  duration = 0.55,
  id,
}: ScrollStaggerItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.div id={id} variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-white z-50 origin-left pointer-events-none"
    />
  );
}

/* =========================================================================
   CREOVIBE-STYLE SCROLLING TEXT ANIMATIONS & COLOR REVEAL
   ========================================================================= */

interface ScrollWordColorRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  id?: string;
  offset?: any;
}

/**
 * ScrollWordColorReveal:
 * Clean, readable text without scroll coloring.
 */
export function ScrollWordColorReveal({
  text,
  className = '',
  id,
}: ScrollWordColorRevealProps) {
  return (
    <p id={id} className={className}>
      {text}
    </p>
  );
}

export interface StaggeredHeadingRevealProps {
  text?: string;
  lines?: string[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  className?: string;
  wordClassName?: string;
  id?: string;
  delay?: number;
  staggerDelay?: number;
  splitBy?: 'words' | 'lines';
  once?: boolean;
  amount?: number | 'some' | 'all';
  rootMargin?: string;
  offset?: any;
}

/**
 * StaggeredHeadingReveal:
 * High-performance viewport-triggered staggered text reveal.
 * Optimized for 60fps GPU rendering with composited transform & opacity.
 */
export function StaggeredHeadingReveal({
  text,
  lines,
  as: Component = 'h2',
  className = '',
  wordClassName = '',
  id,
  delay = 0.06,
  staggerDelay = 0.07,
  splitBy = 'words',
  once = true,
  amount = 0.15,
  rootMargin = '0px 0px -30px 0px',
}: StaggeredHeadingRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, {
    once,
    amount,
    margin: rootMargin as any,
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 28,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1], // snappy luxury cubic bezier
      },
    },
  };

  if (lines && lines.length > 0) {
    if (splitBy === 'lines') {
      return (
        <Component ref={ref} id={id} className={`text-white ${className}`}>
          <motion.span
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="block"
          >
            {lines.map((line, idx) => (
              <span key={idx} className="block overflow-hidden">
                <motion.span
                  variants={itemVariants}
                  className={`block will-change-[transform,opacity] ${wordClassName}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </Component>
      );
    }

    // Split words within lines
    return (
      <Component ref={ref} id={id} className={`text-white ${className}`}>
        <motion.span
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="block"
        >
          {lines.map((line, lineIdx) => {
            const words = line.split(/\s+/).filter(Boolean);
            return (
              <span key={lineIdx} className="block">
                {words.map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="inline-block mr-[0.24em] last:mr-0 align-top"
                  >
                    <motion.span
                      variants={itemVariants}
                      className={`inline-block will-change-[transform,opacity] ${wordClassName}`}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            );
          })}
        </motion.span>
      </Component>
    );
  }

  const words = (text || '').split(/\s+/).filter(Boolean);

  return (
    <Component ref={ref} id={id} className={`text-white ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="inline"
      >
        {words.map((word, idx) => (
          <span
            key={idx}
            className="inline-block mr-[0.24em] last:mr-0 align-top"
          >
            <motion.span
              variants={itemVariants}
              className={`inline-block will-change-[transform,opacity] ${wordClassName}`}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

export type ScrollHeaderGradientFillProps = StaggeredHeadingRevealProps;

/**
 * ScrollHeaderGradientFill:
 * Clean, solid white headings with viewport-triggered staggered text reveal.
 */
export function ScrollHeaderGradientFill(props: ScrollHeaderGradientFillProps) {
  return <StaggeredHeadingReveal {...props} />;
}

/**
 * Creovibe-style Infinite Scrolling Text Marquee / Ticker
 */
interface ScrollingTickerProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number; // seconds for complete loop
  className?: string;
  separator?: string;
  id?: string;
}

export function ScrollingTicker({
  items,
  direction = 'left',
  speed = 28,
  className = '',
  separator = '✦',
  id,
}: ScrollingTickerProps) {
  return (
    <div
      id={id}
      className={`overflow-hidden select-none whitespace-nowrap flex border-y border-white/10 bg-[#060607] py-3.5 ${className}`}
    >
      <motion.div
        className="flex shrink-0 items-center gap-6"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: speed,
          ease: 'linear',
        }}
      >
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-6">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-neutral-300 font-medium">
              {item}
            </span>
            <span className="text-[10px] text-white/40">{separator}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Creovibe Spotlight Card with mouse-following radial illumination and border glow
 */
interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
  id?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.08)',
  onClick,
  id,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPosition({ x: -1000, y: -1000 });
      }}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Radial spotlight layer following cursor */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

/**
 * Large drifting background watermark text for added depth on scroll
 */
export function ScrollParallaxWatermark({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div
      ref={ref}
      className={`pointer-events-none select-none overflow-hidden absolute inset-0 flex items-center justify-center opacity-[0.03] text-[16vw] font-black font-mono tracking-tighter leading-none whitespace-nowrap text-white ${className}`}
    >
      <motion.div style={{ x }}>{text}</motion.div>
    </div>
  );
}


