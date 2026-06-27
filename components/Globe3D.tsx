'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function Globe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0.005, y: 0.003 });
  const rotationAngle = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const radius = 130; // Radius of the globe
    const cx = 150;     // Center X of canvas
    const cy = 150;     // Center Y of canvas

    // Generate grid points of the sphere (latitudes and longitudes)
    const points: Point3D[] = [];
    const latLines = 10;
    const lonLines = 14;

    for (let i = 1; i < latLines; i++) {
      const lat = (Math.PI * i) / latLines; // Latitude angle from 0 to Pi
      for (let j = 0; j < lonLines; j++) {
        const lon = (Math.PI * 2 * j) / lonLines; // Longitude angle from 0 to 2*Pi
        
        // Spherical coordinates to Cartesian 3D coordinates
        points.push({
          x: radius * Math.sin(lat) * Math.cos(lon),
          y: radius * Math.cos(lat),
          z: radius * Math.sin(lat) * Math.sin(lon)
        });
      }
    }

    // Resize canvas
    canvas.width = 300;
    canvas.height = 300;

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      
      // Update velocities and rotation angles
      rotationVelocity.current.y = deltaX * 0.005;
      rotationVelocity.current.x = deltaY * 0.005;
      
      rotationAngle.current.x += rotationVelocity.current.x;
      rotationAngle.current.y += rotationVelocity.current.y;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Auto rotation when not dragging
      if (!isDraggingRef.current) {
        // Slowly decay velocity towards default automatic rotation
        rotationVelocity.current.y += (0.005 - rotationVelocity.current.y) * 0.03;
        rotationVelocity.current.x += (0.001 - rotationVelocity.current.x) * 0.03;

        rotationAngle.current.x += rotationVelocity.current.x;
        rotationAngle.current.y += rotationVelocity.current.y;
      }

      const cosX = Math.cos(rotationAngle.current.x);
      const sinX = Math.sin(rotationAngle.current.x);
      const cosY = Math.cos(rotationAngle.current.y);
      const sinY = Math.sin(rotationAngle.current.y);

      // Project and draw lines/connections
      const projected: { x: number; y: number; z: number }[] = [];

      points.forEach((p) => {
        // Rotate around X-axis
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.z * cosX + p.y * sinX;

        // Rotate around Y-axis
        let x2 = p.x * cosY + z1 * sinY;
        let z2 = z1 * cosY - p.x * sinY;

        // 3D perspective projection
        const fov = 350;
        const scale = fov / (fov + z2);
        const screenX = cx + x2 * scale;
        const screenY = cy + y1 * scale;

        projected.push({ x: screenX, y: screenY, z: z2 });
      });

      // Draw globe grid lines (Longitudinal lines)
      ctx.lineWidth = 0.5;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const hoverPulse = hovered ? Math.sin(Date.now() / 150) * 0.15 + 0.85 : 0.7;

      for (let j = 0; j < lonLines; j++) {
        ctx.beginPath();
        for (let i = 0; i < latLines - 1; i++) {
          const pIndex = i * lonLines + j;
          const nextIndex = ((i + 1) * lonLines + j) % projected.length;
          
          const p1 = projected[pIndex];
          const p2 = projected[nextIndex];

          // Draw only if on the facing side or slightly faded if on the back
          const isFacing = p1.z < 0 && p2.z < 0;
          const multiplier = isLight ? 1.8 : 1;
          ctx.strokeStyle = isFacing 
            ? `rgba(6, 182, 212, ${0.25 * hoverPulse * multiplier})` 
            : `rgba(6, 182, 212, ${0.05 * hoverPulse * multiplier})`;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw globe grid lines (Latitudinal lines)
      for (let i = 0; i < latLines - 1; i++) {
        for (let j = 0; j < lonLines; j++) {
          const pIndex = i * lonLines + j;
          const nextIndex = i * lonLines + ((j + 1) % lonLines);
          
          const p1 = projected[pIndex];
          const p2 = projected[nextIndex];

          const isFacing = p1.z < 0 && p2.z < 0;
          const multiplier = isLight ? 1.8 : 1;
          ctx.strokeStyle = isFacing 
            ? `rgba(16, 185, 129, ${0.25 * hoverPulse * multiplier})` // Emerald facing front
            : `rgba(16, 185, 129, ${0.05 * hoverPulse * multiplier})`;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw vertices / coordinate nodes
      projected.forEach((p) => {
        const isFacing = p.z < 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, isFacing ? 2 : 0.8, 0, Math.PI * 2);
        
        if (isFacing) {
          ctx.fillStyle = isLight ? 'rgba(6, 182, 212, 0.95)' : 'rgba(6, 182, 212, 0.8)';
          ctx.shadowBlur = isLight ? 0 : (hovered ? 8 : 4);
          ctx.shadowColor = '#06b6d4';
        } else {
          ctx.fillStyle = isLight ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.2)';
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });

      // Clear shadow properties for performance
      ctx.shadowBlur = 0;

      // Draw a subtle center core glow
      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
      gradient.addColorStop(0, isLight ? 'rgba(6, 182, 212, 0.03)' : 'rgba(6, 182, 212, 0.05)');
      gradient.addColorStop(1, 'rgba(4, 6, 15, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, [hovered]);

  return (
    <div 
      className="position-relative d-inline-block animate-float"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'grab' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.25))',
        }}
      />
      <div 
        className="position-absolute top-50 start-50 translate-middle pointer-events-none"
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '1px solid rgba(16, 185, 129, 0.05)',
          boxShadow: 'inset 0 0 40px rgba(6, 182, 212, 0.03)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
