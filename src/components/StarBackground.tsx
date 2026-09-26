import { useEffect, useRef } from "react";
export default function StarBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stars = Array.from({ length: 190 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.65 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: 0.85 + Math.random() * 0.55,
      gold: Math.random() > 0.82,
    }));
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) requestAnimationFrame(draw);
    };
    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        const alpha = reduced
          ? 0.35
          : 0.1 + (Math.sin(time * 0.0012 * s.speed + s.phase) + 1) * 0.2;
        ctx.beginPath();
        ctx.fillStyle = s.gold
          ? `rgba(234,201,125,${alpha})`
          : `rgba(201,243,224,${alpha})`;
        ctx.shadowBlur = s.r * 2.5;
        ctx.shadowColor = s.gold ? "#dfbe74" : "#91cdb0";
        ctx.arc(
          s.x * width,
          (s.y * height + (reduced ? 0 : time * 0.0008 * s.speed)) % height,
          s.r,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="star-background" aria-hidden="true" />;
}
