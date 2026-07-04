import { useEffect, useRef } from "react";

export default function ForestBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrameId;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 0.5,
      speed: Math.random() * 0.25 + 0.08,
    }));

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear previous frame only
ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speed;

       if (p.y < -10) {
  p.y = height + 10;
  p.x = Math.random() * width;
}

        ctx.beginPath();

ctx.shadowBlur = 20;
ctx.shadowColor = "rgba(255,255,255,0.9)";

ctx.fillStyle = "rgba(255,255,255,0.9)";
ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
ctx.fill();

ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
