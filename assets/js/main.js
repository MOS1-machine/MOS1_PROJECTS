/* =========================================================
   main.js: shared behaviour across all pages
   - scroll-reveal for cards / steps
   - lightbox for gallery images & gifs
   ========================================================= */
(function () {
  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Lightbox for gallery media
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbContent = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item[data-full]').forEach((item) => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-full');
        const isVideo = /\.(mp4|webm)$/i.test(src);
        lbContent.innerHTML = isVideo
          ? `<video src="${src}" autoplay loop muted playsinline></video>`
          : `<img src="${src}" alt="">`;
        lightbox.classList.add('is-open');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lbContent.innerHTML = '';
    }
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
})();
