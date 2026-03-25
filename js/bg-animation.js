const canvases = document.querySelectorAll(".bg-canvas");

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  canvases.forEach((canvas) => canvas.remove());
} else {
  canvases.forEach(initCanvas);
}

function initCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;

  if (!ctx || !parent) return;

  const bgContent = parent.querySelector(".bg-content");
  const density = 0.00015;
  let shapes = [];

  function createShape() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 20 + Math.random() * 45,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8
    };
  }

  function syncShapeCount() {
    const targetCount = Math.max(
      1,
      Math.floor(canvas.width * canvas.height * density)
    );

    if (shapes.length < targetCount) {
      shapes = shapes.concat(
        Array.from({ length: targetCount - shapes.length }, createShape)
      );
    } else if (shapes.length > targetCount) {
      shapes = shapes.slice(0, targetCount);
    }
  }

  function resize() {
    const rect = parent.getBoundingClientRect();
    const contentHeight = bgContent
      ? Math.max(bgContent.scrollHeight, bgContent.offsetHeight)
      : 0;
    const nextWidth = Math.ceil(rect.width);
    const nextHeight = Math.ceil(
      Math.max(rect.height, parent.scrollHeight, parent.offsetHeight, contentHeight)
    );

    if (!nextWidth || !nextHeight) return;

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    syncShapeCount();
  }

  resize();

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    if (bgContent) {
      observer.observe(bgContent);
    }
  } else {
    window.addEventListener("resize", resize);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape) => {
      shape.x += shape.dx;
      shape.y += shape.dy;

      if (shape.x < 0 || shape.x > canvas.width) shape.dx *= -1;
      if (shape.y < 0 || shape.y > canvas.height) shape.dy *= -1;

      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(248, 73, 76, 0.08)";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("load", () => {
    resize();
    setTimeout(resize, 250);
    setTimeout(resize, 1000);
  });

  const media = parent.querySelectorAll("img, video");
  media.forEach((element) => {
    if (element.tagName === "IMG") {
      if (!element.complete) {
        element.addEventListener("load", resize, { once: true });
        element.addEventListener("error", resize, { once: true });
      }
      return;
    }

    element.addEventListener("loadedmetadata", resize, { once: true });
    element.addEventListener("loadeddata", resize, { once: true });
    element.addEventListener("canplay", resize, { once: true });
    element.addEventListener("error", resize, { once: true });
  });
}
