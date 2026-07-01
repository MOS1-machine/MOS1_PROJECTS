(function () {
  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function buildFlap(targets) {
    targets.forEach(function (el) {
      var text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-label', text);

      var row = document.createElement('span');
      row.className = 'flap-row';

      var cells = [];
      text.split('').forEach(function (ch) {
        var cell = document.createElement('span');
        cell.className = 'flap-cell';
        cell.textContent = ch === ' ' ? '\u00A0' : '';
        row.appendChild(cell);
        cells.push({ el: cell, target: ch });
      });

      el.appendChild(row);

      cells.forEach(function (cell, i) {
        if (cell.target === ' ') return;
        var steps = 7 + Math.floor(Math.random() * 5);
        var count = 0;
        setTimeout(function () {
          var iv = setInterval(function () {
            count++;
            if (count < steps) {
              cell.el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
            } else {
              cell.el.textContent = cell.target;
              clearInterval(iv);
            }
          }, 40);
        }, i * 70);
      });
    });
  }

  var targets = document.querySelectorAll('.flap-text');
  if (!targets.length) return;
  buildFlap(Array.prototype.slice.call(targets));
})();
