if (!customElements.get('catalogue-filters')) {
  customElements.define('catalogue-filters', class extends HTMLElement {
    connectedCallback() {
      if (this.abort) return;
      this.abort = new AbortController();
      this.grid = this.querySelector('[data-catalogue-grid]');
      this.buttons = [...this.querySelectorAll('[data-catalogue-filter]')];
      this.templates = new Map([...this.querySelectorAll('[data-catalogue-template]')].map(template => [template.dataset.catalogueTemplate, template]));
      const controls = this.querySelector('[data-catalogue-filter-controls]');
      controls.hidden = false;
      const on = (target,type,callback) => target.addEventListener(type,callback,{signal:this.abort.signal});
      on(controls,'click',event => {
        const button = event.target.closest('[data-catalogue-filter]');
        if (button) this.select(button.dataset.catalogueFilter);
      });
      on(controls,'keydown',event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        const button = event.target.closest('[data-catalogue-filter]');
        if (!button) return;
        event.preventDefault();
        let index = this.buttons.indexOf(button);
        if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = this.buttons.length - 1;
        else index = (index + (event.key === 'ArrowRight' ? 1 : -1) + this.buttons.length) % this.buttons.length;
        this.buttons[index].focus();
        this.buttons[index].scrollIntoView({block:'nearest',inline:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      });
      on(document,'shopify:block:select',event => {
        const button = this.buttons.find(item => item.dataset.blockId === event.detail.blockId);
        if (button) this.select(button.dataset.catalogueFilter);
      });
    }
    select(key) {
      const template = this.templates.get(key);
      if (!template) return;
      this.grid.replaceChildren(template.content.cloneNode(true));
      this.buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.catalogueFilter === key)));
      const link = this.querySelector('[data-catalogue-collection-link]');
      if (link) link.href = template.dataset.collectionUrl;
      this.closest('atelier-product-showcase')?.updateWishlist?.();
      const count = this.grid.querySelectorAll('.atelier-product-card').length;
      this.querySelector('[data-catalogue-status]').textContent = this.dataset.resultsLabel + ': ' + count;
    }
    disconnectedCallback() {
      this.abort?.abort();
      this.abort = null;
    }
  });
}
