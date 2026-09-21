const els = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((e) => e.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
} else {
  els.forEach(el => el.classList.add('in'));
}
