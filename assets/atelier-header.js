if (!customElements.get('atelier-header')) {
  customElements.define('atelier-header', class extends HTMLElement {
    connectedCallback() {
      if (this.abort) return;
      this.abort = new AbortController();
      const signal = this.abort.signal;
      const on = (target, event, callback, options = {}) => target.addEventListener(event, callback, {...options, signal});
      this.wrapper = this.closest('.shopify-section');
      this.lastScroll = Math.max(0, window.scrollY);
      const reveal = () => this.wrapper.classList.remove('is-hidden');
      this.resize = new ResizeObserver(() => document.documentElement.style.setProperty('--header-height', this.offsetHeight + 'px'));
      this.resize.observe(this);
      const mobileViewport = matchMedia('(max-width: 1023px)');
      const updateSticky = () => {this.dataset.activeSticky=mobileViewport.matches?'up':this.dataset.sticky;reveal();};
      on(mobileViewport,'change',updateSticky);
      updateSticky();
      let pending = false;
      on(window, 'scroll', () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          const y = Math.max(0, window.scrollY);
          const keyboardFocus=this.contains(document.activeElement)&&document.activeElement?.matches(':focus-visible');
          const expanded=this.querySelector('details[open],dialog[open]')||keyboardFocus||document.querySelector('cart-drawer.active');
          if(this.dataset.activeSticky!=='up'||expanded||y<this.offsetHeight){reveal();this.lastScroll=y;}
          else if(Math.abs(y-this.lastScroll)>=5){this.wrapper.classList.toggle('is-hidden',y>this.lastScroll);this.lastScroll=y;}
          pending = false;
        });
      }, {passive:true});
      on(this, 'focusin', reveal);
      const dropdowns = [...this.querySelectorAll('[data-header-dropdown]')];
      const hover = matchMedia('(hover: hover)');
      dropdowns.forEach(dropdown => {
        on(dropdown, 'pointerenter', () => {if (!hover.matches) return; dropdowns.forEach(other => {other.open = other === dropdown;});});
        on(dropdown, 'pointerleave', () => {if (hover.matches && !dropdown.contains(document.activeElement)) dropdown.open = false;});
        on(dropdown, 'toggle', () => {if (dropdown.open) dropdowns.forEach(other => {if (other !== dropdown) other.open = false;});});
        on(dropdown, 'focusout', () => queueMicrotask(() => {if (!dropdown.contains(document.activeElement)) dropdown.open = false;}));
      });
      on(document, 'click', event => {if (!this.contains(event.target)) dropdowns.forEach(dropdown => dropdown.open = false);});
      on(this, 'keydown', event => {if (event.key === 'Escape') dropdowns.forEach(dropdown => {if (dropdown.open) {dropdown.open = false; dropdown.querySelector('summary').focus();}});});
      const openDialog = (dialog, trigger) => {
        if (!dialog || dialog.open) return;
        if (dialog.hasAttribute('data-mobile-dialog') && window.innerWidth >= 1024) return;
        this.trigger = trigger;
        reveal();
        dropdowns.forEach(dropdown => dropdown.open = false);
        dialog.showModal();
        document.body.classList.add('atelier-dialog-open');
      };
      on(document,'atelier:navigation:open',event=>{
        const {panel,trigger}=event.detail||{};
        if(panel==='categories')openDialog(this.querySelector('[data-mobile-dialog]'),trigger);
        if(panel==='wishlist'){openDialog(this.querySelector('[data-wishlist-dialog]'),trigger);this.renderWishlist();}
      });
      on(this, 'click', event => {
        const mobile = event.target.closest('[data-open-mobile]');
        const wishlist = event.target.closest('[data-open-wishlist]');
        const wishlistFromMenu = event.target.closest('[data-open-wishlist-from-menu]');
        const close = event.target.closest('[data-close-dialog]');
        if (mobile) openDialog(this.querySelector('[data-mobile-dialog]'), mobile);
        if (wishlist) {openDialog(this.querySelector('[data-wishlist-dialog]'), wishlist); this.renderWishlist();}
        if (wishlistFromMenu) {
          this.querySelector('[data-mobile-dialog]')?.close();
          openDialog(this.querySelector('[data-wishlist-dialog]'), wishlistFromMenu);
          this.renderWishlist();
        }
        if (close) close.closest('dialog').close();
      });
      this.querySelectorAll('dialog').forEach(dialog => {
        dialog.querySelectorAll('[data-close-dialog]').forEach(btn => {
          on(btn, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dialog.close();
          });
        });
        on(dialog, 'close', () => {
          document.body.classList.remove('atelier-dialog-open');
          this.trigger?.focus();
        });
        on(dialog, 'click', event => {
          if (event.target === dialog) dialog.close();
          const rect = dialog.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
        });
      });
      on(window, 'resize', () => {
        if (window.innerWidth >= 1024) {
          const mobileDialog = this.querySelector('[data-mobile-dialog]');
          if (mobileDialog?.open) mobileDialog.close();
        }
      }, { passive: true });
      on(document, 'keydown', event => {
        if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k' || event.altKey) return;
        const summary = this.querySelector('.header__search summary');
        if (!summary) return;
        event.preventDefault();
        reveal();
        if (!summary.closest('details').open) summary.click();
        this.querySelector('input[type=search]')?.focus();
      });
      on(document, 'atelier:wishlist:update', () => {this.updateWishlistCount(); if (this.querySelector('[data-wishlist-dialog]')?.open) this.renderWishlist();});
      on(window, 'storage', event => {if (event.key === 'graffeine-wishlist') {this.updateWishlistCount(); if (this.querySelector('[data-wishlist-dialog]')?.open) this.renderWishlist();}});
      on(document, 'shopify:block:select', event => {const block = this.querySelector('[data-shopify-editor-block*="' + event.detail.blockId + '"]'); if (block) {reveal(); const dropdown = block.querySelector('details'); if (dropdown) dropdown.open = true;}});
      this.updateWishlistCount();
    }
    savedHandles() {
      try {
        const values = JSON.parse(localStorage.getItem('graffeine-wishlist') || '[]');
        return Array.isArray(values) ? [...new Set(values.filter(handle => typeof handle === 'string' && /^[a-z0-9-]+$/.test(handle)))] : [];
      } catch {return [];}
    }
    updateWishlistCount() {
      const count = this.savedHandles().length;
      this.querySelectorAll('[data-wishlist-count]').forEach(badge => {badge.textContent = String(count); badge.hidden = count === 0;});
    }
    async renderWishlist() {
      const dialog = this.querySelector('[data-wishlist-dialog]');
      if (!dialog) return;
      this.wishlistRequest?.abort();
      const request = new AbortController();
      this.wishlistRequest = request;
      const handles = this.savedHandles();
      const list = dialog.querySelector('[data-saved-items]');
      const empty = dialog.querySelector('[data-wishlist-empty]');
      list.replaceChildren();
      empty.hidden = handles.length !== 0;
      list.setAttribute('aria-busy', 'true');
      const root = window.Shopify?.routes?.root || '/';
      const results = await Promise.allSettled(handles.map(async handle => {
        const response = await fetch(root + 'products/' + encodeURIComponent(handle) + '.js', {signal:request.signal});
        if (!response.ok) throw new Error('Product unavailable');
        return response.json();
      }));
      if (request.signal.aborted) return;
      results.forEach((result, index) => {
        const row = document.createElement('div');
        row.className = 'atelier-header__saved-item';
        const info = document.createElement('div');
        if (result.status === 'fulfilled') {
          const product = result.value;
          const image = document.createElement('img');
          image.src = product.featured_image || '';
          image.alt = '';
          image.loading = 'lazy';
          row.append(image);
          const link = document.createElement('a');
          link.href = root + 'products/' + handles[index];
          link.textContent = product.title;
          const price = document.createElement('p');
          price.textContent = new Intl.NumberFormat(document.documentElement.lang, {style:'currency',currency:this.dataset.currency || 'INR'}).format(product.price / 100);
          info.append(link, price);
        } else {
          const label = document.createElement('p');
          label.textContent = handles[index].replaceAll('-', ' ');
          info.append(label);
        }
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = dialog.dataset.removeLabel;
        remove.addEventListener('click', () => {
          try {localStorage.setItem('graffeine-wishlist', JSON.stringify(this.savedHandles().filter(handle => handle !== handles[index])));} catch {}
          document.dispatchEvent(new CustomEvent('atelier:wishlist:update'));
        });
        info.append(remove);
        row.append(info);
        list.append(row);
      });
      list.removeAttribute('aria-busy');
    }
    disconnectedCallback() {
      this.abort?.abort();
      this.abort = null;
      this.resize?.disconnect();
      this.wishlistRequest?.abort();
      document.body.classList.remove('atelier-dialog-open');
    }
  });
}
