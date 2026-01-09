'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    radius: number;
    speedX: number;
    speedY: number;
}

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouseX = -1000;
        let mouseY = -1000;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(window.innerWidth / 10, 150); // Responsive count
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 1 + 0.5, // Falling down
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Particles
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();

            particles.forEach((p) => {
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                // Update Position (Snow effect)
                p.y += p.speedY;
                p.x += p.speedX;

                // Reset if out of bounds
                if (p.y > canvas.height) {
                    p.y = 0 - p.radius;
                    p.x = Math.random() * canvas.width;
                }

                // Cursor Interaction (Repel/Connect)
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    // Draw Line
                    ctx.save();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                    ctx.restore();

                    // Slight Repel
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (maxDistance - distance) / maxDistance;
                    p.x += forceDirectionX * force * 2;
                    p.y += forceDirectionY * force * 2;
                }
            });

            ctx.fill();
            animationFrameId = requestAnimationFrame(draw);
        };

        // Init
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-black"
        />
    );
}
