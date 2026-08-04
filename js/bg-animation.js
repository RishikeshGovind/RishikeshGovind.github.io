(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.bg-canvas').forEach(function (c) { c.remove(); });
    return;
  }

  document.querySelectorAll('.bg-canvas').forEach(initCanvas);

  function initCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var parent = canvas.parentElement;
    if (!ctx || !parent) return;

    var W = 0, H = 0, particles = [], RAF;
    var MAX_DIST = 180;
    var SPEED    = 0.28;

    function countForArea() {
      return Math.min(100, Math.max(30, Math.floor(W * H / 10000)));
    }

    function resize() {
      var rect = parent.getBoundingClientRect();
      var nW   = Math.ceil(rect.width)  || window.innerWidth;
      var nH   = Math.ceil(Math.max(rect.height, parent.scrollHeight));
      if (nW === W && nH === H) return;
      W = canvas.width  = nW;
      H = canvas.height = nH;
      respawn();
    }

    function respawn() {
      var n = countForArea();
      // keep existing particles, add or trim
      while (particles.length < n) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          r: Math.random() * 1.8 + 0.8
        });
      }
      particles.length = n;
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      var len = particles.length;

      // move
      for (var i = 0; i < len; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)  { p.x = 0;  p.vx *= -1; }
        if (p.x > W)  { p.x = W;  p.vx *= -1; }
        if (p.y < 0)  { p.y = 0;  p.vy *= -1; }
        if (p.y > H)  { p.y = H;  p.vy *= -1; }
      }

      // connections
      ctx.lineWidth = 0.9;
      var md2 = MAX_DIST * MAX_DIST;
      for (var i = 0; i < len; i++) {
        for (var j = i + 1; j < len; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < md2) {
            var a = (1 - Math.sqrt(d2) / MAX_DIST) * 0.55;
            ctx.strokeStyle = 'rgba(255,77,36,' + a + ')';
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (var i = 0; i < len; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236,232,225,0.7)';
        ctx.fill();
      }

      RAF = requestAnimationFrame(tick);
    }

    resize();
    tick();

    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(resize).observe(parent);
    } else {
      window.addEventListener('resize', resize);
    }

    // handle media load triggering height changes
    parent.querySelectorAll('img,video').forEach(function (el) {
      ['load','loadeddata','canplay','error'].forEach(function (ev) {
        el.addEventListener(ev, resize, { once: true });
      });
    });
  }
})();
