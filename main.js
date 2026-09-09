function initHeroScrollParallax() {
  const aurora = document.querySelector('.hero-aurora');
  if (!aurora || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function update() {
    ticking = false;
    const rect = aurora.getBoundingClientRect();
    const vh = window.innerHeight;
    const range = Math.max(vh * 0.65 + rect.height, 1);
    const t = (vh * 0.45 - rect.top) / range;
    const y = Math.min(1, Math.max(-1, (t - 0.5) * 2));
    aurora.style.setProperty('--parallax-y', y.toFixed(4));
  }

  function onScrollOrResize() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  update();
}

initHeroScrollParallax();

const els = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
  );

  els.forEach((el) => io.observe(el));
} else {
  els.forEach((el) => el.classList.add('visible'));
}
