
(() => {
  const initWhatsApp = () => {
    const wrapper = document.querySelector('.atelier-whatsapp-wrapper');
    if (!wrapper) return;

    const updatePosition = () => {
      const stickyBar = document.querySelector('[data-pdp-sticky-bar]');
      if (!stickyBar) {
        document.body.classList.remove('has-sticky-bar-visible');
        wrapper.style.removeProperty('--wa-sticky-offset');
        return;
      }

      const isVisible = stickyBar.classList.contains('is-visible') || stickyBar.getAttribute('aria-hidden') === 'false';
      if (isVisible) {
        const barHeight = stickyBar.offsetHeight || 72;
        document.body.classList.add('has-sticky-bar-visible');
        wrapper.style.setProperty('--wa-sticky-offset', barHeight + 'px');
      } else {
        document.body.classList.remove('has-sticky-bar-visible');
        wrapper.style.removeProperty('--wa-sticky-offset');
      }
    };

    const stickyBar = document.querySelector('[data-pdp-sticky-bar]');
    if (stickyBar) {
      const observer = new MutationObserver(updatePosition);
      observer.observe(stickyBar, { attributes: true, attributeFilter: ['class', 'aria-hidden', 'style'] });
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
    }
    updatePosition();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsApp);
    document.addEventListener('shopify:section:load', initWhatsApp);
  } else {
    initWhatsApp();
  }
})();
