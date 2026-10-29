if (!customElements.get('atelier-related-carousel')) {
  customElements.define(
    'atelier-related-carousel',
    class extends HTMLElement {
      connectedCallback() {
        if (this.abort) return;
        this.abort = new AbortController();
        this.track = this.querySelector('[data-related-track]');
        if (!this.track) return;

        this.prevBtn = this.querySelector('[data-related-direction="-1"]');
        this.nextBtn = this.querySelector('[data-related-direction="1"]');

        const updateArrows = () => {
          const maxScroll = Math.max(0, this.track.scrollWidth - this.track.clientWidth);
          if (maxScroll <= 4) {
            if (this.prevBtn) this.prevBtn.style.visibility = 'hidden';
            if (this.nextBtn) this.nextBtn.style.visibility = 'hidden';
            return;
          }
          if (this.prevBtn) {
            this.prevBtn.style.visibility = 'visible';
            this.prevBtn.disabled = this.track.scrollLeft <= 4;
          }
          if (this.nextBtn) {
            this.nextBtn.style.visibility = 'visible';
            this.nextBtn.disabled = this.track.scrollLeft >= maxScroll - 4;
          }
        };

        this.addEventListener(
          'click',
          (event) => {
            const button = event.target.closest('[data-related-direction]');
            if (!button) return;
            const dir = Number(button.dataset.relatedDirection);
            const firstCard = this.track.querySelector('.atelier-related-card');
            const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 24 : 300;
            this.track.scrollBy({
              left: dir * cardWidth,
              behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            });
          },
          { signal: this.abort.signal }
        );

        // Drag to scroll for desktop mouse
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const onMouseDown = (e) => {
          if (e.target.closest('a, button, input, select')) return;
          isDown = true;
          startX = e.pageX - this.track.offsetLeft;
          scrollLeft = this.track.scrollLeft;
        };

        const onMouseMove = (e) => {
          if (!isDown) return;
          const x = e.pageX - this.track.offsetLeft;
          const walk = (x - startX);
          if (Math.abs(walk) > 4) {
            this.track.classList.add('is-dragging');
            e.preventDefault();
            this.track.scrollLeft = scrollLeft - walk;
          }
        };

        const onMouseUp = () => {
          isDown = false;
          this.track.classList.remove('is-dragging');
        };

        this.track.addEventListener('mousedown', onMouseDown, { signal: this.abort.signal });
        window.addEventListener('mousemove', onMouseMove, { signal: this.abort.signal });
        window.addEventListener('mouseup', onMouseUp, { signal: this.abort.signal });

        this.track.addEventListener('scroll', updateArrows, { signal: this.abort.signal, passive: true });
        this.resize = new ResizeObserver(updateArrows);
        this.resize.observe(this.track);
        setTimeout(updateArrows, 150);
        updateArrows();
      }

      disconnectedCallback() {
        this.abort?.abort();
        this.abort = null;
        this.resize?.disconnect();
      }
    }
  );
}
