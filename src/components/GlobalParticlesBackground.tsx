import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  depth: number;
  size: number;
  baseAlpha: number;
  vx: number;
  vy: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: string;
}

export default function GlobalParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Scroll state tracking for 3D parallax depth
    let currentScrollY = window.scrollY || 0;
    let targetScrollY = window.scrollY || 0;
    let lastScrollY = window.scrollY || 0;

    // Mouse coordinates for subtle interactive deflection
    let mouseX = -1000;
    let mouseY = -1000;

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Optimized, lightweight ambient particles across depth layers (Desktop: 38, Mobile: 18)
    const isMobile = width < 768;
    const particleCount = isMobile ? 18 : 38;
    const particles: Particle[] = [];

    const colorPalette = [
      'rgba(186, 230, 253, ', // Light ice blue
      'rgba(147, 197, 253, ', // Soft sky blue
      'rgba(96, 165, 250, ',  // Azure blue
      'rgba(255, 255, 255, ',  // Pure white spark
    ];

    for (let i = 0; i < particleCount; i++) {
      const depth = 0.2 + Math.random() * 0.8; // 0.2 (far/tiny/slow) to 1.0 (near/crisp)
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth,
        size: 0.35 + depth * 0.45, // Kept small & crisp (0.4px to 0.8px max), no bulky particles
        baseAlpha: 0.15 + depth * 0.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.10 - depth * 0.22, // gentle upward drift
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.02,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      });
    }

    // Sparse technical telemetry nodes (Johannesburg / Cape Town coords & system indices)
    const telemetryNodes = [
      { xNorm: 0.08, yNorm: 0.22, label: 'SYS.01 // CORE', size: 5 },
      { xNorm: 0.92, yNorm: 0.38, label: 'JHB.LAT -26.20', size: 5 },
      { xNorm: 0.14, yNorm: 0.72, label: 'CPT.LAT -33.92', size: 5 },
      { xNorm: 0.88, yNorm: 0.82, label: 'AUTON.NET // OK', size: 5 },
    ];

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth scroll delta calculation
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      const scrollShift = (targetScrollY - lastScrollY) * 0.04;
      lastScrollY = targetScrollY;

      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // 1. NEURAL CONSTELLATION THREADS (Subtle connection between nearby particles)
      // =========================================================================
      const maxDistance = isMobile ? 36 : 52;
      const maxDistSq = maxDistance * maxDistance;

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            const lineAlpha = (1 - distance / maxDistance) * 0.05 * p1.depth;
            ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // =========================================================================
      // 2. AMBIENT PARTICLES (Drifting, breathing, mouse-reactive, parallax-driven)
      // =========================================================================
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Velocity drift + scroll parallax shift based on depth plane
        p.x += p.vx;
        p.y += p.vy - scrollShift * p.depth;

        // Subtle interactive mouse deflection
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 90 && distToMouse > 0) {
          const force = (1 - distToMouse / 90) * 0.45 * p.depth;
          p.x += (dx / distToMouse) * force;
          p.y += (dy / distToMouse) * force;
        }

        // Viewport wrapping
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        // Dynamic pulsing alpha
        const pulse = Math.sin(time * 2 + p.pulsePhase);
        const currentAlpha = Math.max(0.04, p.baseAlpha * (0.8 + 0.2 * pulse));

        // Draw crisp micro particle (no large blurry halo)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();
      }

      // =========================================================================
      // 3. MINIMAL TELEMETRY MARKERS (Crisp, subtle coordinates)
      // =========================================================================
      ctx.lineWidth = 0.75;
      for (const node of telemetryNodes) {
        const cx = node.xNorm * width;
        const cy = node.yNorm * height;
        const opacity = 0.18 + 0.12 * Math.sin(time * 1.5 + node.xNorm * 10);

        // Crosshair
        ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(cx - node.size, cy);
        ctx.lineTo(cx + node.size, cy);
        ctx.moveTo(cx, cy - node.size);
        ctx.lineTo(cx, cy + node.size);
        ctx.stroke();

        // Technical Label
        ctx.fillStyle = `rgba(186, 230, 253, ${opacity * 0.8})`;
        ctx.font = '8px monospace';
        ctx.fillText(node.label, cx + 8, cy + 3);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      id="global-particles-background-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-75"
      aria-hidden="true"
    />
  );
}
