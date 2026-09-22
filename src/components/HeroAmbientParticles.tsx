import { useEffect, useRef } from 'react';

export default function HeroAmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 900);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 900;
    };
    window.addEventListener('resize', handleResize);

    // Ambient floating particles with multi-layer depth (optimized & kept small)
    const particleCount = width < 768 ? 18 : 36;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.35 + Math.random() * 0.45, // small, crisp particles without bulky blobs
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -0.12 - Math.random() * 0.25, // gentle upward drift
      opacity: 0.15 + Math.random() * 0.5,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Ambient digital coordinate crosshairs / pulses
    const crosshairs = [
      { x: 0.15, y: 0.25, size: 6, label: 'SEC.01' },
      { x: 0.88, y: 0.45, size: 6, label: 'LAT.26' },
      { x: 0.45, y: 0.85, size: 5, label: 'SYS.89' },
    ];

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle drifting ambient stars
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(time * 2 + p.pulsePhase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${currentOpacity * 0.7})`;
        ctx.fill();
      }

      // Draw subtle telemetry crosshairs
      ctx.lineWidth = 0.75;
      for (const ch of crosshairs) {
        const cx = ch.x * width;
        const cy = ch.y * height;
        const opacity = 0.2 + 0.15 * Math.sin(time + ch.x * 10);

        ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(cx - ch.size, cy);
        ctx.lineTo(cx + ch.size, cy);
        ctx.moveTo(cx, cy - ch.size);
        ctx.lineTo(cx, cy + ch.size);
        ctx.stroke();

        ctx.fillStyle = `rgba(147, 197, 253, ${opacity * 0.85})`;
        ctx.font = '8px monospace';
        ctx.fillText(ch.label, cx + 8, cy + 3);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full z-[2] opacity-70"
    />
  );
}
