'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speedZ: number;
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const particleCount = 100;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles in a 3D space
    const initParticles = () => {
      particles = [];
      const colors = ['rgba(16, 185, 129, 0.4)', 'rgba(6, 182, 212, 0.4)', 'rgba(139, 92, 246, 0.3)'];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: (Math.random() - 0.5) * canvas.width * 2,
          y: (Math.random() - 0.5) * canvas.height * 2,
          z: Math.random() * 1000 + 100, // Depth
          size: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedZ: Math.random() * 0.5 + 0.2, // Moving forward in space
        });
      }
    };
    initParticles();

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) * 0.15;
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) * 0.15;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const animate = () => {
      // Clear canvas - adapting to theme
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      ctx.fillStyle = currentTheme === 'light' ? 'rgba(240, 244, 248, 0.15)' : 'rgba(4, 6, 15, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse tracking (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const fov = 350; // Field of View (Perspective factor)
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      particles.forEach((p) => {
        // Move particle closer (reducing depth Z)
        p.z -= p.speedZ;

        // Reset particle if it passes the viewer (Z <= 0)
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * canvas.width * 2;
          p.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        // Apply mouse inertia/drift to particle coordinates
        const rx = p.x + mouseRef.current.x;
        const ry = p.y + mouseRef.current.y;

        // 3D to 2D projection
        const scale = fov / (fov + p.z);
        const screenX = cx + rx * scale;
        const screenY = cy + ry * scale;

        // Only draw if within bounds
        if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
          const drawSize = p.size * scale * 2;
          ctx.beginPath();
          ctx.arc(screenX, screenY, drawSize, 0, Math.PI * 2);
          
          const isLight = currentTheme === 'light';
          ctx.fillStyle = isLight 
            ? p.color.replace('0.4', '0.75').replace('0.3', '0.6') 
            : p.color;
          ctx.shadowBlur = isLight ? 0 : 10 * scale;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
      });

      // Draw subtle connecting lines for close particles in 3D
      ctx.shadowBlur = 0; // Turn off shadows for lines to improve performance
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          // Calculate 3D distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < 120) {
            const rx1 = p1.x + mouseRef.current.x;
            const ry1 = p1.y + mouseRef.current.y;
            const rx2 = p2.x + mouseRef.current.x;
            const ry2 = p2.y + mouseRef.current.y;

            const scale1 = fov / (fov + p1.z);
            const scale2 = fov / (fov + p2.z);

            const x1 = cx + rx1 * scale1;
            const y1 = cy + ry1 * scale1;
            const x2 = cx + rx2 * scale2;
            const y2 = cy + ry2 * scale2;

            // Draw line with opacity based on proximity
            const isLight = currentTheme === 'light';
            const alpha = (1 - dist3D / 120) * 0.15 * (isLight ? 2 : 1);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = isLight 
              ? `rgba(16, 185, 129, ${alpha})`
              : `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.5 * scale1;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ zIndex: -1, pointerEvents: 'none' }}
    />
  );
}
