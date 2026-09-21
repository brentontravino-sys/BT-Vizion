import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  layer?: number;
}

interface ThreeDSceneCanvasProps {
  className?: string;
  interactive?: boolean;
}

export default function ThreeDSceneCanvas({
  className = '',
  interactive = true,
}: ThreeDSceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    // Mouse tracking for 3D orbital camera tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetRotY = Math.max(-1.6, Math.min(1.6, x * 1.5));
      targetRotX = Math.max(-1.6, Math.min(1.6, -y * 1.5));
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 750;
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 1. Generate 3D spherical core nodes
    const isMobile = width < 768;
    const SPHERE_RADIUS = isMobile ? Math.min(width, height) * 0.28 : Math.min(width, height) * 0.29;
    const points: Point3D[] = [];
    const numPoints = isMobile ? 80 : 120;

    // Fibonacci sphere distribution for uniform points
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * SPHERE_RADIUS,
        y: y * SPHERE_RADIUS,
        z: z * SPHERE_RADIUS,
        vx: 0,
        vy: 0,
        vz: 0,
        baseRadius: 2.2 + Math.random() * 2.2,
      });
    }

    // 2. Add multiple concentric orbital rings at various 3D inclination angles
    const ring1: { x: number; y: number; z: number }[] = [];
    const ring2: { x: number; y: number; z: number }[] = [];
    const ring3: { x: number; y: number; z: number }[] = [];
    const ringCount = 64;

    const R1 = SPHERE_RADIUS * 1.28;
    const R2 = SPHERE_RADIUS * 1.48;
    const R3 = SPHERE_RADIUS * 1.62;

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      // Ring 1: equatorial tilt
      ring1.push({
        x: Math.cos(angle) * R1,
        y: Math.sin(angle) * (R1 * 0.28),
        z: Math.sin(angle) * R1,
      });
      // Ring 2: polar incline
      ring2.push({
        x: Math.cos(angle) * (R2 * 0.4),
        y: Math.cos(angle) * R2,
        z: Math.sin(angle) * R2,
      });
      // Ring 3: diagonal wide halo
      ring3.push({
        x: Math.cos(angle) * R3,
        y: Math.sin(angle * 2) * (R3 * 0.15),
        z: Math.sin(angle) * (R3 * 0.75),
      });
    }

    // 3. Floating 3D Starfield & Data Streams (multi-depth ambient particles)
    const starfield: Point3D[] = [];
    const starCount = isMobile ? 60 : 110;
    for (let i = 0; i < starCount; i++) {
      starfield.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: (Math.random() - 0.5) * 1100,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.4,
        baseRadius: 0.9 + Math.random() * 2.0,
      });
    }

    let time = 0;
    const FOV = 520; // Perspective projection distance

    const render = () => {
      time += 0.0075;

      // Smooth inertia rotation interpolation
      currentRotX += (targetRotX - currentRotX) * 0.045;
      currentRotY += (targetRotY - currentRotY) * 0.045;

      const autoRotY = time * 0.55 + currentRotY;
      const autoRotX = Math.sin(time * 0.3) * 0.22 + currentRotX;

      ctx.clearRect(0, 0, width, height);

      // Sphere placement: centered on canvas
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // 3D Perspective Rotation Math
      const cosY = Math.cos(autoRotY);
      const sinY = Math.sin(autoRotY);
      const cosX = Math.cos(autoRotX);
      const sinX = Math.sin(autoRotX);

      const project = (x: number, y: number, z: number, customCenterX = centerX, customCenterY = centerY) => {
        // Rotate around Y axis
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate around X axis
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Perspective division
        const scale = FOV / (FOV + z2 + 350);
        return {
          px: customCenterX + x1 * scale,
          py: customCenterY + y2 * scale,
          scale,
          z: z2,
        };
      };

      // --- LAYER 1: Deep Volumetric Atmosphere Glow behind sphere ---
      const haloGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        SPHERE_RADIUS * 1.7
      );
      haloGradient.addColorStop(0, 'rgba(59, 130, 246, 0.14)');
      haloGradient.addColorStop(0.4, 'rgba(37, 99, 235, 0.06)');
      haloGradient.addColorStop(0.7, 'rgba(147, 51, 234, 0.025)');
      haloGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, SPHERE_RADIUS * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // --- LAYER 2: 3D Deep Space Starfield with Depth Perspective ---
      for (const star of starfield) {
        star.x += star.vx;
        star.y += star.vy;
        star.z += star.vz;

        if (star.z < -550) star.z = 550;
        if (star.z > 550) star.z = -550;
        if (star.x < -width) star.x = width;
        if (star.x > width) star.x = -width;

        const p = project(star.x, star.y, star.z, width / 2, height / 2);
        if (p.scale > 0 && p.px >= 0 && p.px <= width && p.py >= 0 && p.py <= height) {
          const alpha = Math.max(0.1, Math.min(0.65, (p.z + 550) / 1100));
          ctx.beginPath();
          ctx.arc(p.px, p.py, star.baseRadius * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
          ctx.fill();
        }
      }

      // --- LAYER 3: 3D Grid Wave Floor beneath the sphere (Cyber Depth Grid) ---
      const gridCols = 16;
      const gridRows = 12;
      const gridSpacing = 70;
      const gridYOffset = SPHERE_RADIUS * 1.45;

      ctx.lineWidth = 0.6;
      for (let r = 0; r < gridRows; r++) {
        ctx.beginPath();
        let started = false;
        for (let c = 0; c < gridCols; c++) {
          const gx = (c - gridCols / 2) * gridSpacing;
          const gz = (r - gridRows / 2) * gridSpacing;
          // Animated wave undulation
          const gy = gridYOffset + Math.sin(time * 2 + gx * 0.01 + gz * 0.015) * 12;

          const p = project(gx, gy, gz);
          if (p.scale > 0) {
            const alpha = Math.max(0.01, Math.min(0.12, (p.z + 400) / 800));
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * 0.8})`;
            if (!started) {
              ctx.moveTo(p.px, p.py);
              started = true;
            } else {
              ctx.lineTo(p.px, p.py);
            }
          }
        }
        ctx.stroke();
      }

      // --- LAYER 4: Project Sphere Points with Organic Breathing ---
      const projectedSpherePoints = points.map((pt) => {
        const breath = 1 + Math.sin(time * 2.2 + pt.y * 0.02) * 0.045;
        return {
          ...project(pt.x * breath, pt.y * breath, pt.z * breath),
          baseRadius: pt.baseRadius,
        };
      });

      // --- LAYER 5: 3D Constellation Vector Lines (Interconnecting Neural Links) ---
      ctx.lineWidth = 0.85;
      for (let i = 0; i < projectedSpherePoints.length; i++) {
        const p1 = projectedSpherePoints[i];
        if (p1.scale <= 0) continue;

        for (let j = i + 1; j < projectedSpherePoints.length; j++) {
          const p2 = projectedSpherePoints[j];
          if (p2.scale <= 0) continue;

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 72 * ((p1.scale + p2.scale) / 2)) {
            const avgZ = (p1.z + p2.z) / 2;
            const normalizedZ = (avgZ + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);
            const alpha = Math.max(0.03, Math.min(0.42, normalizedZ * 0.5));

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // --- LAYER 6: 3D Orbital Rings (3 Different Angles & Radii) ---
      const drawRing = (ringPts: { x: number; y: number; z: number }[], strokeColor: string, lineW: number, dash?: number[]) => {
        ctx.beginPath();
        let started = false;
        if (dash) ctx.setLineDash(dash);
        else ctx.setLineDash([]);

        for (let i = 0; i < ringPts.length; i++) {
          const pt = ringPts[i];
          const p = project(pt.x, pt.y, pt.z);
          if (p.scale > 0) {
            if (!started) {
              ctx.moveTo(p.px, p.py);
              started = true;
            } else {
              ctx.lineTo(p.px, p.py);
            }
          }
        }
        ctx.closePath();
        ctx.lineWidth = lineW;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.setLineDash([]);
      };

      drawRing(ring1, 'rgba(96, 165, 250, 0.28)', 1.2);
      drawRing(ring2, 'rgba(255, 255, 255, 0.14)', 0.9, [4, 6]);
      drawRing(ring3, 'rgba(192, 132, 252, 0.20)', 1.0);

      // --- LAYER 7: Sphere Nodes & Glowing Pulsing Vertices ---
      const sortedPoints = [...projectedSpherePoints].sort((a, b) => a.z - b.z);

      for (const pt of sortedPoints) {
        if (pt.scale <= 0) continue;

        const normalizedZ = (pt.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);
        const alpha = Math.max(0.12, Math.min(0.98, normalizedZ));
        const radius = pt.baseRadius * pt.scale;

        // Front glowing vertices receive outer atmospheric halo
        if (normalizedZ > 0.55) {
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, radius * 3.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.18})`;
          ctx.fill();
        }

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, radius, 0, Math.PI * 2);
        if (normalizedZ > 0.6) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.75})`;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
}
