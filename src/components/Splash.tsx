import React from "react";

type Dot = { x: number; y: number; z: number };

export default function Splash() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [time, setTime] = React.useState(new Date().getTime());

  const render = React.useCallback(
    (ctx: CanvasRenderingContext2D, dots: Dot[], newTime: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const elapsed = newTime - time;

      for (const dot of dots) {
        dot.x += 0.0008 * elapsed;
        drawDot(ctx, dot.x, dot.y);
      }

      setTime(newTime);

      requestAnimationFrame(render.bind(this, ctx, dots, new Date().getTime()));
    },
    [time]
  );

  React.useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const dots = initDots();
      render(ctx, dots, new Date().getTime());
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute w-screen h-screen pointer-events-none top-0 left-0"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

function initDots() {
  const out: Dot[] = [];

  for (let i = 0; i < 100; i++) {
    out.push({
      x: Math.random() * window.innerWidth - window.innerWidth / 2,
      y: Math.random() * window.innerHeight - window.innerHeight / 2,
      z: Math.random() * 1000,
    });
  }

  return out;
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const intensity = 0.1 * 255;
  ctx.beginPath();
  ctx.fillStyle = `rgba(${intensity}, ${intensity}, ${intensity}, 0.5)`;
  ctx.ellipse(x, y, 1, 1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}
