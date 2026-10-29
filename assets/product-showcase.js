if (!customElements.get('atelier-product-showcase')) {
  let cartQueue = Promise.resolve();
  customElements.define('atelier-product-showcase', class extends HTMLElement {
    connectedCallback() {
      if (this.abort) return;
      this.abort = new AbortController();
      this.dialog = this.querySelector('[data-quick-view-dialog]');
      this.root = window.Shopify?.routes?.root || '/';
      const on = (target, event, handler) => target?.addEventListener(event, handler, {signal:this.abort.signal});
      on(this, 'click', event => {
        const wishlist = event.target.closest('[data-wishlist-toggle]');
        const preview = event.target.closest('[data-quick-view]');
        const close = event.target.closest('[data-close-quick-view]');
        const stepper = event.target.closest('[data-quantity-change]');
        if (wishlist) {this.toggleWishlist(wishlist.dataset.wishlistToggle); return;}
        if (preview) {event.preventDefault(); this.openQuickView(preview.dataset.quickView, preview); return;}
        if (close) this.dialog.close();
        if (stepper) {
          const input = this.dialog.querySelector('input[name=quantity]');
          const value = Number(input.value) || 1;
          input.value = String(Math.max(1, value + Number(stepper.dataset.quantityChange)));
        }
      });
      on(this, 'submit', event => {
        const form = event.target.matches('form') ? event.target : event.target.closest('form');
        if (!form) return;
        event.preventDefault();
        event.stopPropagation();
        this.addToCart(form);
      });
      on(document, 'atelier:wishlist:update', () => this.updateWishlist());
      on(window, 'storage', event => {if (event.key === 'graffeine-wishlist') this.updateWishlist();});
      on(this.dialog, 'close', () => {
        this.quickViewRequest?.abort();
        document.body.classList.remove('atelier-quick-view-open');
        this.quickViewTrigger?.focus();
      });
      on(this.dialog, 'click', event => {
        if (event.target !== this.dialog) return;
        const rect = this.dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.dialog.close();
      });
      on(this.dialog?.querySelector('[data-quick-view-variants]'), 'change', () => this.updateQuickViewVariant());
      this.updateWishlist();
    }
    savedHandles() {
      try {
        const data = JSON.parse(localStorage.getItem('graffeine-wishlist') || '[]');
        return Array.isArray(data) ? data.filter(handle => typeof handle === 'string' && /^[a-z0-9-]+$/.test(handle)) : [];
      } catch {return [];}
    }
    toggleWishlist(handle) {
      const saved = new Set(this.savedHandles());
      if (saved.has(handle)) saved.delete(handle);
      else saved.add(handle);
      try {localStorage.setItem('graffeine-wishlist', JSON.stringify([...saved]));}
      catch {this.announce(this.dataset.errorLabel); return;}
      document.dispatchEvent(new CustomEvent('atelier:wishlist:update'));
    }
    updateWishlist() {
      const saved = new Set(this.savedHandles());
      this.querySelectorAll('[data-wishlist-toggle]').forEach(button => button.setAttribute('aria-pressed', String(saved.has(button.dataset.wishlistToggle))));
    }
    announce(message) {this.querySelector('[data-showcase-status]').textContent = message;}
    money(amount) {
      return new Intl.NumberFormat(document.documentElement.lang || 'en-IN', {style:'currency',currency:window.Shopify?.currency?.active || this.dataset.currency || 'INR'}).format(amount / 100);
    }
    async addToCart(form) {
      if (!form.reportValidity()) return;
      const input = new FormData(form);
      const quantity = Math.max(1, Number(input.get('quantity')) || 1);
      const variantId = Number(input.get('id'));
      const sellingPlan = input.get('selling_plan');
      if (!Number.isSafeInteger(variantId) || variantId < 1) return;

      const button = form.querySelector('[type=submit]') || form.querySelector('button[data-pdp-add]');
      if (button?.disabled) return;
      const label = button?.textContent;
      const preservedContents = button?.hasAttribute?.('data-preserve-button-content') ? [...button.childNodes].map(node => node.cloneNode(true)) : null;
      const error = form.closest('.atelier-product-card')?.querySelector('.atelier-product-card__error') || form.parentElement?.querySelector('[data-cart-error]') || this.querySelector('[data-quick-view-error]');
      if (error) error.hidden = true;
      if (button) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        if (!preservedContents) button.textContent = this.dataset.addingLabel || 'Adding…';
      }
      const operation = async () => {
        try {
          const drawer = document.querySelector('cart-drawer');
          const sections = drawer?.getSectionsToRender?.().map(section => section.id) || ['cart-drawer', 'cart-icon-bubble'];

          const postData = new FormData();
          postData.append('id', String(variantId));
          postData.append('quantity', String(quantity));
          if (sellingPlan) postData.append('selling_plan', String(sellingPlan));
          sections.forEach(s => postData.append('sections[]', s));
          postData.append('sections', sections.join(','));
          postData.append('sections_url', window.location.pathname);

          const response = await fetch(this.root + 'cart/add.js', {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json'
            },
            body: postData
          });
          const result = await response.json();
          if (!response.ok || result.status) {
            throw new Error(typeof result.description === 'string' ? result.description : (this.dataset.errorLabel || 'Could not add to bag'));
          }

          this.announce(this.dataset.addedLabel || 'Added to bag');
          const trigger = this.dialog?.open ? this.quickViewTrigger : button;
          if (this.dialog?.open) this.dialog.close();

          document.dispatchEvent(new CustomEvent('atelier:cart:update', { detail: result }));
          if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'product-showcase', cartData: result });
          }

          // Open side cart drawer directly
          if (drawer) {
            drawer.classList.remove('is-empty');
            if (result.sections && result.sections['cart-drawer']) {
              drawer.renderContents(result);
            } else {
              await drawer.refresh();
              drawer.open(trigger || document.querySelector('#cart-icon-bubble'), false);
            }
          }
        } catch (failure) {
          const message = failure.message || this.dataset.errorLabel || 'Could not add to bag';
          if (error) { error.textContent = message; error.hidden = false; }
          this.announce(message);
        } finally {
          if (button) {
            button.disabled = false;
            button.removeAttribute('aria-busy');
            if (preservedContents) button.replaceChildren(...preservedContents);
            else button.textContent = label;
          }
        }
      };
      cartQueue = cartQueue.catch(() => {}).then(operation);
      await cartQueue;
    }
    description(html) {
      const parsed = new DOMParser().parseFromString(html || '', 'text/html');
      const output = document.createDocumentFragment();
      const allowed = new Set(['P','UL','OL','LI','STRONG','EM','B','I','BR','H2','H3','H4']);
      const copy = (source, target) => {
        source.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) target.append(document.createTextNode(node.textContent));
          else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT','STYLE','IFRAME','OBJECT','FORM'].includes(node.tagName)) {
            if (allowed.has(node.tagName)) {const element = document.createElement(node.tagName.toLowerCase()); copy(node,element); target.append(element);}
            else copy(node,target);
          }
        });
      };
      copy(parsed.body,output);
      return output;
    }
    async openQuickView(handle, trigger) {
      if (!this.dialog) return;
      if (!/^[a-z0-9-]+$/.test(handle)) return;
      this.quickViewRequest?.abort();
      const request = new AbortController();
      this.quickViewRequest = request;
      this.quickViewTrigger = trigger;
      this.dialog.querySelector('[data-quick-view-body]').hidden = true;
      const loading = this.dialog.querySelector('[data-quick-view-loading]');
      const loadingText = loading.dataset.defaultText || loading.textContent;
      loading.dataset.defaultText = loadingText;
      loading.textContent = loadingText;
      loading.hidden = false;
      const error = this.dialog.querySelector('[data-quick-view-error]');
      error.hidden = true;
      this.dialog.querySelector('input[name=quantity]').value = '1';
      if (!this.dialog?.open) this.dialog.showModal();
      document.body.classList.add('atelier-quick-view-open');
      try {
        const response = await fetch(this.root + 'products/' + encodeURIComponent(handle) + '.js', {signal:request.signal});
        if (!response.ok) throw new Error(this.dataset.errorLabel);
        const product = await response.json();
        if (request.signal.aborted) return;
        if (product.requires_selling_plan) {window.location.assign(this.root + 'products/' + handle); return;}
        this.currentProduct = product;
        this.dialog.querySelector('[data-quick-view-title]').textContent = product.title;
        const image = this.dialog.querySelector('[data-quick-view-image]');
        image.hidden = !product.featured_image;
        if (product.featured_image) image.src = product.featured_image;
        image.alt = product.title;
        this.dialog.querySelector('[data-quick-view-description]').replaceChildren(this.description(product.description));
        const link = this.dialog.querySelector('[data-quick-view-link]');
        link.href = this.root + 'products/' + handle;
        const select = this.dialog.querySelector('[data-quick-view-variants]');
        select.replaceChildren();
        product.variants.forEach(variant => {
          const option = document.createElement('option');
          option.value = String(variant.id);
          option.textContent = variant.title + (variant.available ? '' : ' — ' + this.dataset.soldOutLabel);
          select.append(option);
        });
        const firstAvailable = product.variants.find(variant => variant.available) || product.variants[0];
        select.value = String(firstAvailable.id);
        this.dialog.querySelector('[data-quick-view-variant-row]').hidden = product.variants.length === 1;
        this.updateQuickViewVariant();
        loading.hidden = true;
        this.dialog.querySelector('[data-quick-view-body]').hidden = false;
      } catch (failure) {
        if (request.signal.aborted) return;
        loading.textContent = this.dataset.errorLabel;
      }
    }
    updateQuickViewVariant() {
      const id = Number(this.dialog.querySelector('[data-quick-view-variants]').value);
      const variant = this.currentProduct?.variants.find(item => item.id === id);
      if (!variant) return;
      this.dialog.querySelector('[data-quick-view-price]').textContent = this.money(variant.price);
      const button = this.dialog.querySelector('[data-quick-view-add]');
      button.disabled = !variant.available;
      button.textContent = variant.available ? this.dataset.addLabel : this.dataset.soldOutLabel;
      if (variant.featured_image?.src) this.dialog.querySelector('[data-quick-view-image]').src = variant.featured_image.src;
    }
    disconnectedCallback() {
      this.abort?.abort();
      this.abort = null;
      this.quickViewRequest?.abort();
      if (this.dialog?.open) this.dialog.close();
      document.body.classList.remove('atelier-quick-view-open');
    }
  });
}