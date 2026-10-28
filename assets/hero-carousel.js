if (!customElements.get('hero-banner-slider')) {
  customElements.define('hero-banner-slider', class extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true;
      this.abort = new AbortController();
      this.track = this.querySelector('.atelier-hero__track');
      this.slides = [...this.track.children];
      this.dots = [...this.querySelectorAll('[data-slide]')];
      this.dots.forEach((dot,index)=>{dot.dataset.slide=String(index);});
      this.position = 1;
      this.active = 0;
      this.locked = false;
      this.paused = this.dataset.autoplay !== 'true';
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, {...options, signal: this.abort.signal});
      if (this.slides.length < 2) return;
      const clone = slide => {
        const copy = slide.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.inert = true;
        copy.removeAttribute('data-shopify-editor-block');
        copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
        copy.querySelectorAll('h1').forEach(node => {
          const heading = document.createElement('h2');
          heading.textContent = node.textContent;
          node.replaceWith(heading);
        });
        return copy;
      };
      this.track.prepend(clone(this.slides.at(-1)));
      this.track.append(clone(this.slides[0]));
      this.classList.add('is-ready');
      this.render(false);
      this.querySelector('.atelier-hero__controls').hidden = false;
      this.dots.forEach(dot => on(dot, 'click', () => this.go(Number(dot.dataset.slide) + 1)));
      const previous = this.querySelector('[data-hero-previous]');
      const next = this.querySelector('[data-hero-next]');
      if (previous) on(previous, 'click', () => this.go(this.position - 1));
      if (next) on(next, 'click', () => this.go(this.position + 1));
      on(this.track, 'transitionend', event => {if (event.target === this.track && event.propertyName === 'transform') this.settle();});
      on(this, 'keydown', event => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        if (this.dots.includes(event.target)) {
          const index = (this.active + direction + this.slides.length) % this.slides.length;
          this.go(index + 1);
          this.dots[index].focus();
        } else this.go(this.position + direction);
      });
      on(this, 'focusin', () => {this.focused = Boolean(document.activeElement?.matches(':focus-visible')); this.schedule();});
      on(this, 'focusout', () => queueMicrotask(() => {this.focused = this.contains(document.activeElement) && Boolean(document.activeElement?.matches(':focus-visible')); this.schedule();}));
      on(document, 'visibilitychange', () => this.schedule());
      on(this.motion, 'change', () => this.schedule());
      const viewport = this.querySelector('.atelier-hero__viewport');
      on(viewport, 'pointerdown', event => {if (event.pointerType === 'mouse' || event.target.closest('a,button')) return; this.pointer = {x:event.clientX,y:event.clientY}; clearTimeout(this.timer);});
      on(viewport, 'pointerup', event => {
        if (!this.pointer) return;
        const dx = event.clientX - this.pointer.x;
        const dy = event.clientY - this.pointer.y;
        this.pointer = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) this.go(this.position + (dx < 0 ? 1 : -1));
        this.schedule();
      });
      on(viewport, 'pointercancel', () => {this.pointer = null; this.schedule();});
      on(document, 'shopify:block:select', event => {
        const index = this.slides.findIndex(slide => slide.dataset.blockId === event.detail.blockId);
        if (index < 0) return;
        if (this.locked) this.settle();
        this.editing = true;
        this.go(index + 1, false);
        this.schedule();
      });
      on(document, 'shopify:block:deselect', () => {this.editing = false; this.schedule();});
      this.observer = new IntersectionObserver(entries => {this.visible = entries[0].isIntersecting; this.schedule();}, {threshold:0.15});
      this.observer.observe(this);
    }
    render(animate = true) {
      this.track.style.transitionDuration = animate && !this.motion.matches ? '' : '0ms';
      this.track.style.transform = 'translateX(-' + this.position * 100 + '%)';
      this.active = (this.position - 1 + this.slides.length) % this.slides.length;
      this.slides.forEach((slide, index) => {
        slide.inert = index !== this.active;
        slide.setAttribute('aria-hidden', String(index !== this.active));
      });
      this.style.setProperty('--hero-active-slide', String(this.active));
      this.dots.forEach((dot, index) => {
        if (index === this.active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }
    go(position, animate = true) {
      if (this.locked) return;
      clearTimeout(this.timer);
      this.position = position;
      this.locked = animate && !this.motion.matches;
      this.render(animate);
      if (this.locked) this.transitionTimer = setTimeout(() => this.settle(), 650);
      else this.settle();
    }
    settle() {
      clearTimeout(this.transitionTimer);
      if (this.position === 0) this.position = this.slides.length;
      if (this.position === this.slides.length + 1) this.position = 1;
      this.render(false);
      this.locked = false;
      this.schedule();
    }
    schedule() {
      clearTimeout(this.timer);
      if (this.paused || this.motion.matches || this.focused || this.editing || !this.visible || document.hidden || this.locked) return;
      this.timer = setTimeout(() => this.go(this.position + 1), Number(this.dataset.interval) || 5000);
    }
    disconnectedCallback() {
      clearTimeout(this.timer);
      clearTimeout(this.transitionTimer);
      this.abort?.abort();
      this.observer?.disconnect();
      if (this.slides?.length > 1) {
        this.track.firstElementChild.remove();
        this.track.lastElementChild.remove();
      }
      this.ready = false;
      this.classList.remove('is-ready');
    }
  });
}