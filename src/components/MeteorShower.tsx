import React, { useEffect, useRef } from 'react';

interface MeteorShowerProps {
  isDark: boolean;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  length: number;
  width: number;
  alpha: number;
}

/**
 * A sparse meteor shower behind the landing page.
 *
 * Deliberately cheap: a handful of line strokes on one viewport-sized canvas,
 * no images, no libraries, and the whole thing stands down when the reader has
 * asked for reduced motion. Streaks are drawn from head to tail with a gradient
 * that fades to nothing, so they read as light rather than as lines.
 */
export const MeteorShower: React.FC<MeteorShowerProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let meteors: Meteor[] = [];
    let nextSpawnAt = 0;
    let previous = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = () => {
      // 30–52° below the horizontal, always travelling leftwards, so the streaks
      // feel like one shower rather than random scratches.
      const angle = ((28 + Math.random() * 26) * Math.PI) / 180;
      const speed = 460 + Math.random() * 560;
      const narrow = width < 640;
      // One in eight is a fireball: brighter, longer, slower to fade.
      const fireball = Math.random() < 0.12;

      meteors.push({
        x: width * (0.3 + Math.random() * 0.95),
        y: -40 - Math.random() * 200,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: (fireball ? 1.25 : 0.8) + Math.random() * 0.85,
        length: ((narrow ? 70 : 120) + Math.random() * (narrow ? 110 : 200)) * (fireball ? 1.7 : 1),
        width: (0.9 + Math.random() * 1.3) * (fireball ? 1.9 : 1),
        alpha: (fireball ? 0.8 : 0.5) + Math.random() * 0.35,
      });
    };

    const draw = (delta: number) => {
      context.clearRect(0, 0, width, height);
      const ink = isDarkRef.current ? '255, 252, 245' : '90, 80, 68';
      const brightness = isDarkRef.current ? 1 : 0.55;

      for (const meteor of meteors) {
        meteor.age += delta;
        meteor.x += meteor.vx * delta;
        meteor.y += meteor.vy * delta;

        const progress = Math.min(meteor.age / meteor.life, 1);
        // Fade in fast, fade out slow — a meteor is brightest just after it
        // appears, not when it leaves the screen.
        const fade = Math.sin(progress * Math.PI) ** 0.7;
        const speed = Math.hypot(meteor.vx, meteor.vy) || 1;
        const tailX = meteor.x - (meteor.vx / speed) * meteor.length;
        const tailY = meteor.y - (meteor.vy / speed) * meteor.length;

        const gradient = context.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        const head = meteor.alpha * fade * brightness;
        gradient.addColorStop(0, `rgba(${ink}, ${head.toFixed(3)})`);
        gradient.addColorStop(0.28, `rgba(${ink}, ${(head * 0.4).toFixed(3)})`);
        gradient.addColorStop(1, `rgba(${ink}, 0)`);

        context.lineCap = 'round';

        // Glow pass: the same streak, wider and much fainter.
        context.strokeStyle = `rgba(${ink}, ${(head * 0.18).toFixed(3)})`;
        context.lineWidth = meteor.width * 4;
        context.beginPath();
        context.moveTo(meteor.x, meteor.y);
        context.lineTo(tailX, tailY);
        context.stroke();

        context.strokeStyle = gradient;
        context.lineWidth = meteor.width;
        context.beginPath();
        context.moveTo(meteor.x, meteor.y);
        context.lineTo(tailX, tailY);
        context.stroke();
      }

      meteors = meteors.filter(
        (meteor) =>
          meteor.age < meteor.life && meteor.y < height + 240 && meteor.x > -360
      );
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      if (!isDarkRef.current) {
        context.clearRect(0, 0, width, height);
        meteors = [];
        return;
      }

      if (now > nextSpawnAt) {
        spawn();
        // Bursts: a second streak a beat later, and sometimes a third, so it
        // reads as a shower rather than a metronome.
        if (Math.random() < 0.62) window.setTimeout(spawn, 90 + Math.random() * 220);
        if (Math.random() < 0.28) window.setTimeout(spawn, 260 + Math.random() * 420);
        nextSpawnAt = now + (width < 640 ? 900 : 260) + Math.random() * (width < 640 ? 1500 : 620);
      }

      draw(delta);
    };

    previous = performance.now();
    nextSpawnAt = previous + 500;
    frame = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      meteors = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
};
