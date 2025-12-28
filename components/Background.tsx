import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const NeuralMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, radius: 150 });
  const { theme } = useTheme(); // Consume theme context

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    
    const PARTICLE_COUNT = window.innerWidth < 768 ? 80 : 180;
    const CONNECTION_DISTANCE = 150;
    const SPEED_MULTIPLIER = 1.2;

    class Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 2 * SPEED_MULTIPLIER;
        this.vy = (Math.random() - 0.5) * 2 * SPEED_MULTIPLIER;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.current.radius) {
          const force = (mouse.current.radius - distance) / mouse.current.radius;
          this.x -= dx * force * 0.05;
          this.y -= dy * force * 0.05;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Using computed styles or simple switch based on theme prop
        ctx!.fillStyle = theme === 'dark' ? '#22d3ee' : '#0369a1';
        ctx!.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = 1 - distance / CONNECTION_DISTANCE;
            // Line color based on theme
            const color = theme === 'dark' ? '34, 211, 238' : '2, 132, 199';
            ctx!.strokeStyle = `rgba(${color}, ${opacity * 0.4})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      
      if (theme === 'dark') {
        grad.addColorStop(0, 'rgba(15, 23, 42, 0)');
        grad.addColorStop(1, '#020617');
      } else {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, '#f1f5f9'); // Slate-100 edges for light mode
      }
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawLines();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', init);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', init);
    };
  }, [theme]); // Re-run effect when theme changes

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-[var(--bg-primary)] transition-colors duration-300" />;
};