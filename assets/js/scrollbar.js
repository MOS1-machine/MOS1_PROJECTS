(function () {
  var altimeter = document.getElementById('altimeter');
  if (!altimeter) return;

  var tape = document.getElementById('altTape');
  var valueBox = document.getElementById('altValue');
  var PPU_BASE = 4.2;
  var TICK_MIN = -260;
  var TICK_MAX = 360;
  var ticksBuilt = false;

  function buildTicks() {
    if (ticksBuilt) return;
    for (var i = TICK_MIN; i <= TICK_MAX; i += 2) {
      var isMajor = (i % 10 === 0);
      var tick = document.createElement('div');
      tick.className = 'tick ' + (isMajor ? 'major' : 'minor');
      tick.style.top = (i * PPU_BASE) + 'px';
      tape.appendChild(tick);
      if (isMajor) {
        var label = document.createElement('span');
        label.className = 'tick-label';
        label.textContent = i;
        label.style.top = (i * PPU_BASE - 6) + 'px';
        tape.appendChild(label);
      }
    }
    ticksBuilt = true;
  }

  var ticking = false;

  function update() {
    ticking = false;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    pct = Math.max(0, Math.min(100, pct));
    var rounded = Math.round(pct);
    valueBox.textContent = String(rounded).padStart(3, '0');
    var housingHeight = window.innerHeight;
    var ty = housingHeight / 2 - pct * PPU_BASE;
    tape.style.transform = 'translateY(' + ty + 'px)';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  buildTicks();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
