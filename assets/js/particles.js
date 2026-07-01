(function () {
  var canvas = document.createElement('canvas');
  canvas.id = 'bg-particles';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var w, h, particles, scanY, dpr;
  var mouseX = -9999, mouseY = -9999;
  var lastScrollY = window.scrollY;
  var MOUSE_RADIUS = 300;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });
  window.addEventListener('mouseleave', function () {
    mouseX = -9999;
    mouseY = -9999;
  });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    var count = reduced ? 170 : Math.min(748, Math.floor((w * h) / 1618));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        ky: 0,
        r: Math.random() * 1.5 + 0.5
      });
    }
    scanY = -200;
  }

  function frame() {
    var scrollY = window.scrollY;
    var scrollDelta = scrollY - lastScrollY;
    lastScrollY = scrollY;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!reduced) {
        p.ky += scrollDelta * 0.0018;
        if (p.ky > 2.4) p.ky = 2.4;
        if (p.ky < -2.4) p.ky = -2.4;
        p.x += p.vx;
        p.y += p.vy + p.ky;
        p.ky *= 0.93;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = 'rgba(255,155,15,' + (0.2 * (1 - dist / 130)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < particles.length; k++) {
      var d = particles[k];
      var mdx = d.x - mouseX, mdy = d.y - mouseY;
      var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      var glow = mdist < MOUSE_RADIUS ? (1 - mdist / MOUSE_RADIUS) : 0;
      var alpha = Math.min(1, 0.55 + glow * 0.585);
      var radius = d.r * (1 + glow * 1.1);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,' + Math.round(176 + glow * 78) + ',' + Math.round(60 + glow * 117) + ',' + alpha + ')';
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (glow > 0.15) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,176,60,' + (glow * 0.234) + ')';
        ctx.arc(d.x, d.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!reduced) {
      scanY += 0.35;
      if (scanY > h + 200) scanY = -200;
      var grad = ctx.createLinearGradient(0, scanY - 100, 0, scanY + 100);
      grad.addColorStop(0, 'rgba(255,176,60,0)');
      grad.addColorStop(0.5, 'rgba(255,176,60,0.06)');
      grad.addColorStop(1, 'rgba(255,176,60,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 100, w, 200);
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  frame();
})();
