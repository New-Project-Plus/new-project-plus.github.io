// Boop: pops a burst of pencil-coloured confetti at a random spot on the page.
(function () {
  var button = document.querySelector('[data-boop]');
  if (!button) return;

  var COLORS = ['#3D7BD9', '#8C5BD6', '#E0A42C', '#E8806F'];
  var canvas = document.createElement('canvas');
  canvas.id = 'confetti';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var parts = [];
  var running = false;

  function resize() {
    var r = window.devicePixelRatio || 1;
    canvas.width = innerWidth * r;
    canvas.height = innerHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function burst(x, y, still) {
    var palette = COLORS.concat(COLORS, [cssVar('--ink'), cssVar('--paper')]);
    for (var i = 0; i < 70; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = still ? 0 : 6 * (0.35 + Math.random());
      var px = still ? x + Math.cos(a) * 60 * Math.random() : x;
      var py = still ? y + Math.sin(a) * 60 * Math.random() : y;
      parts.push({
        x: px, y: py, vx: Math.cos(a) * sp, vy: still ? 0 : Math.sin(a) * sp - 2.5, g: still ? 0 : 0.16,
        life: 1, decay: 0.011 * (0.7 + Math.random() * 0.6), color: palette[i % palette.length],
        size: 7 * (0.6 + Math.random() * 0.8), rot: Math.random() * 6, vr: still ? 0 : (Math.random() - 0.5) * 0.3,
        shape: i % 3 === 0 ? 'stroke' : 'square'
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.life > 0 && p.y < innerHeight + 40; });
    parts.forEach(function (p) {
      p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.shape === 'square') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.strokeStyle = 'rgba(43, 43, 43, .85)';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-p.size, 0);
        ctx.lineTo(0, p.size * 0.4);
        ctx.lineTo(p.size, -p.size * 0.2);
        ctx.stroke();
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(tick); else running = false;
  }

  button.addEventListener('click', function () {
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    burst(innerWidth * (0.12 + Math.random() * 0.76), innerHeight * (0.12 + Math.random() * 0.6), still);
  });
})();
