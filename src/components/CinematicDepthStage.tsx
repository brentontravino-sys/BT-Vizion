import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import GlobalParticlesBackground from './GlobalParticlesBackground';

export default function CinematicDepthStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Multi-plane parallax translations on scroll
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ['10%', '80%']);
  const gridRotate = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const ringScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.25, 0.95]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 0. Live Ambient Floating Particles Field (All Pages) */}
      <GlobalParticlesBackground />

      {/* 1. Cinematic Analog Film Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.028] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Deep Volumetric Luminescent Light Orbs */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute -top-[10%] left-[15%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.075)_0%,rgba(147,51,234,0.035)_40%,transparent_70%)] blur-[90px]"
      />

      <motion.div
        style={{ y: orb2Y }}
        className="absolute top-[45%] -right-[10%] w-[750px] h-[750px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,rgba(99,102,241,0.03)_45%,transparent_70%)] blur-[100px]"
      />

      <motion.div
        style={{ y: orb3Y }}
        className="absolute top-[75%] left-[5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,rgba(59,130,246,0.025)_40%,transparent_70%)] blur-[90px]"
      />

      {/* 3. Subtle 3D Geometric Depth Concentric Rings */}
      <motion.div
        style={{ rotate: gridRotate, scale: ringScale }}
        className="absolute top-[18%] right-[5%] w-[480px] h-[480px] rounded-full border border-white/[0.03] pointer-events-none flex items-center justify-center opacity-40 hidden lg:flex"
      >
        <div className="w-[340px] h-[340px] rounded-full border border-dashed border-white/[0.04]" />
        <div className="w-[200px] h-[200px] rounded-full border border-white/[0.05]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-white/20">
          [ 3D_AXIS // 01 ]
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[9px] font-mono text-white/20">
          [ DEPTH_FIELD // Z_POS ]
        </div>
      </motion.div>
    </div>
  );
}
