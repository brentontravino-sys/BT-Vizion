import { useState, useRef, ReactNode, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number; // max tilt in degrees (default 12)
  perspective?: number; // perspective in px (default 1200)
  glareOpacity?: number;
  onClick?: () => void;
  id?: string;
}

export default function Tilt3DCard({
  children,
  className = '',
  maxRotation = 10,
  perspective = 1200,
  glareOpacity = 0.14,
  onClick,
  id,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for silky non-jittery 3D rotation
  const springConfig = { damping: 26, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxRotation, -maxRotation]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxRotation, maxRotation]), springConfig);

  // Dynamic light reflection position (0% to 100%)
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseRelativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseRelativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseRelativeX);
    y.set(mouseRelativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="relative w-full h-full"
    >
      <motion.div
        ref={cardRef}
        id={id}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: 1.015,
          transition: { duration: 0.25 },
        }}
        className={`relative overflow-hidden transition-shadow duration-300 ${
          isHovered
            ? 'shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),0_0_30px_rgba(255,255,255,0.06)]'
            : 'shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]'
        } ${className}`}
      >
        {/* Dynamic Specular Glare Layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: isHovered ? glareOpacity : 0,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 30%, transparent 65%)`
            ),
          }}
        />

        {/* 3D Machined Obsidian Bevel Edge highlight */}
        <div className="pointer-events-none absolute inset-0 z-20 border border-white/10 rounded-[inherit] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.18)]" />

        {/* Card Content with 3D transform preservation */}
        <div style={{ transformStyle: 'preserve-3d' }} className="relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
