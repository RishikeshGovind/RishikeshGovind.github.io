const canvases = document.querySelectorAll(".bg-canvas");

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  canvases.forEach(c => c.remove());
} else {
  canvases.forEach(initCanvas);
}

function initCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  resize();

  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);

  const density = 0.00015;
  const shapeCount = Math.floor(canvas.width * canvas.height * density);

  const shapes = Array.from({ length: shapeCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 20 + Math.random() * 45,
    dx: (Math.random() - 0.5) * 0.8,
    dy: (Math.random() - 0.5) * 0.8
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(s => {
      s.x += s.dx;
      s.y += s.dy;

      if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
      if (s.y < 0 || s.y > canvas.height) s.dy *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(248, 73, 76, 0.08)";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
