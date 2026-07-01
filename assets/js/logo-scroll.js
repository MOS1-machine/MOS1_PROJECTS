(function () {
  var logo = document.getElementById('logoFloat');
  var slot = document.getElementById('logoSlot');
  var subtitle = document.getElementById('heroSubtitle');
  if (!logo || !slot) return;

  var CORNER_TOP = 16;
  var CORNER_LEFT = 16;

  var startTop, startWidth, cornerWidth, threshold;
  var ticking = false;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  function measure() {
    var r = slot.getBoundingClientRect();
    startTop  = r.top + window.scrollY;
    startWidth = r.width;
    cornerWidth = window.innerWidth < 560 ? 120 : 180;
    threshold = Math.min(window.innerHeight * 0.55, 420);
    if (threshold < 1) threshold = 1;
  }

  function apply() {
    ticking = false;
    var p = Math.min(window.scrollY / threshold, 1);
    var e = smoothstep(p);

    var w    = lerp(startWidth, cornerWidth, e);
    var top  = lerp(startTop - window.scrollY, CORNER_TOP, e);
    var left = lerp((window.innerWidth - w) / 2 - window.innerWidth * 0.20, CORNER_LEFT, e);

    logo.style.position  = 'fixed';
    logo.style.top       = top + 'px';
    logo.style.left      = left + 'px';
    logo.style.transform = 'none';
    logo.style.width     = w + 'px';

    if (subtitle) {
      subtitle.style.opacity   = String(1 - p);
      subtitle.style.transform = 'translateY(' + (-8 * p) + 'px)';
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  }

  logo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  measure();
  apply();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); apply(); });
})();
