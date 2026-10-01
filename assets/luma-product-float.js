/* Luma & Pause — floating product showcase.

   Each product image drifts at its own speed and eases its tilt while the
   section scrolls past (scrubbed ScrollTrigger tweens, transforms only), and
   its callout slides in from the image's side once. Without GSAP, or under
   reduced motion, nothing is hidden: the static zig-zag layout stays as is. */
(function () {
  var AMOUNT = { subtle: 8, medium: 16, strong: 26 };

  function init(section) {
    if (!section || section.dataset.floatReady === 'true') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var gsap = window.gsap;
    if (!gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(window.ScrollTrigger);
    section.dataset.floatReady = 'true';

    var base = AMOUNT[section.dataset.intensity] || AMOUNT.medium;
    var rotate = section.dataset.rotate !== 'false';
    var isMobile = window.matchMedia('(max-width: 749px)').matches;
    if (isMobile) base = base * 0.6;

    section.querySelectorAll('.luma-float__row').forEach(function (row) {
      var media = row.querySelector('[data-float-media]');
      var img = row.querySelector('[data-float-img]');
      var callout = row.querySelector('[data-float-callout]');
      var speed = parseFloat(row.dataset.speed || '1');
      var drift = base * (1 + Math.abs(speed) * 0.5) * (speed < 0 ? -1 : 1);
      var fromRight = row.classList.contains('luma-float__row--right');

      if (media) {
        gsap.fromTo(
          media,
          { yPercent: drift },
          {
            yPercent: -drift,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          }
        );
      }

      if (img) {
        var tilt = parseFloat(getComputedStyle(row).getPropertyValue('--tilt')) || 0;
        if (isMobile) tilt = tilt * 0.6;
        var swing = rotate ? (fromRight ? 6 : -6) : 0;
        gsap.fromTo(
          img,
          { rotation: tilt - swing, scale: 0.9 },
          {
            rotation: tilt + swing,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          }
        );
      }

      if (callout) {
        gsap.from(callout, {
          opacity: 0,
          x: fromRight ? -30 : 30,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 75%', once: true },
        });
      }
    });
  }

  function initAll() {
    document.querySelectorAll('[data-luma-float]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target.querySelector('[data-luma-float]'));
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
})();
