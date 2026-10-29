/* Graffeine Tales side cart. Shopify remains the source of prices and eligibility. */
(() => {
  if (customElements.get('cart-drawer')) return;
  // High-Performance Festive Confetti Engine matching Vercel reference
class CartConfetti {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.animationFrame = null;
    this.palette = [
      '#5A3825', // Atelier Warm Brown
      '#D4AF37', // Wax Seal Gold
      '#C85A32', // Terracotta Clay
      '#2D6A4F', // Botanical Sage
      '#FACC15', // Radiant Yellow
      '#E6DCCB', // Parchment Bone
      '#FFFFFF'  // White
    ];
    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(tier = 1) {
    if (!this.canvas) return;
    if (!this.ctx) this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;
    this.resize();

    const count = tier === 3 ? 120 : tier === 2 ? 90 : 70;
    const originX = window.innerWidth / 2;
    const originY = Math.min(window.innerHeight * 0.28, 200);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 2) + ((Math.random() - 0.5) * Math.PI * 1.5);
      const speed = 6 + Math.random() * 10;
      const size = 6 + Math.random() * 6;
      const color = this.palette[Math.floor(Math.random() * this.palette.length)];

      this.particles.push({
        x: originX + (Math.random() - 0.5) * 60,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) - 2.5,
        size,
        color,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.1 + Math.random() * 0.1,
        gravity: 0.22 + Math.random() * 0.08,
        drag: 0.965,
        opacity: 1,
        fadeSpeed: 0.007 + Math.random() * 0.006,
        shape: Math.random() > 0.35 ? 'rect' : 'circle'
      });
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.fadeSpeed;

      if (p.opacity <= 0 || p.y > this.canvas.height + 30) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x + Math.sin(p.wobble) * 2, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationFrame = null;
    }
  }
}

  class CartDrawer extends HTMLElement {
    getRawSubtotal() {
      if (this.cart.original_total_price && this.cart.original_total_price > 0) {
        return this.cart.original_total_price;
      }
      if (this.cart.items_subtotal_price && this.cart.items_subtotal_price > 0) {
        return this.cart.items_subtotal_price;
      }
      if (this.cart.items && this.cart.items.length) {
        return this.cart.items.reduce((sum, item) => {
          const unit = item.original_price || item.price || 0;
          return sum + (unit * item.quantity);
        }, 0);
      }
      return this.cart.total_price || 0;
    }
    enableDragScroll(container) {
      if (!container || container.dataset.dragScrollInit) return;
      container.dataset.dragScrollInit = 'true';
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('is-dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });
      window.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('is-dragging');
      });
      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('is-dragging');
      });
      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
      });
    }

    connectedCallback() {
      this.abort?.abort();
      this.abort = new AbortController();
      this.queue = Promise.resolve();
      this.root = window.Shopify?.routes?.root || '/';
      this.readState();
      this.confetti = new CartConfetti(this.querySelector('[data-cart-confetti]'));
      this.addEventListener('click', e => this.onClick(e), { signal: this.abort.signal });
      this.addEventListener('change', e => this.onChange(e), { signal: this.abort.signal });
      this.addEventListener('submit', e => this.onSubmit(e), { signal: this.abort.signal });
      this.addEventListener('keydown', e => this.onKey(e), { signal: this.abort.signal });
      document.addEventListener('click', e => {
        const trigger = e.target.closest('#cart-icon-bubble');
        if (!trigger) return;
        e.preventDefault(); this.open(trigger);
      }, { signal: this.abort.signal });
      document.addEventListener('shopify:section:select', e => {
        if (e.detail?.sectionId === this.dataset.sectionId) this.open();
      }, { signal: this.abort.signal });
      this.decorate();
    }
    disconnectedCallback() {
      this.abort?.abort(); clearInterval(this.timer); clearInterval(this.carouselTimer);
      if (this.classList.contains('active')) document.body.classList.remove('overflow-hidden');
    }
    readState() {
      const read = selector => { try { return JSON.parse(this.querySelector(selector)?.textContent || '{}'); } catch { return {}; } };
      this.cart = read('[data-side-cart-state]');
      this.config = read('[data-side-cart-config]');
      this.labels = this.config.labels || {};
    }
    getSectionsToRender() { return [{ id: 'cart-drawer', selector: '#CartDrawer' }, { id: 'cart-icon-bubble' }]; }
    setActiveElement(element) { this.activeElement = element; }
    open(element, refresh = true) {
      document.querySelectorAll('dialog.atelier-quick-view[open],dialog.atelier-reels__theater[open],dialog.atelier-header__drawer[open]').forEach(dialog => dialog.close());
      if (element) this.setActiveElement(element);
      if (!this.classList.contains('active')) this.returnFocus = this.activeElement || document.activeElement;
      this.classList.add('active'); this.removeAttribute('inert');
      document.body.classList.add('overflow-hidden');
      this.querySelector('#CartDrawer').setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => this.querySelector('[data-cart-close].btn-header-close')?.focus());
      if (refresh && !this.config.designMode) this.refresh().catch(() => {});
    }
    close() {
      this.closeSheet(false); this.classList.remove('active'); this.setAttribute('inert', '');
      this.querySelector('#CartDrawer').setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
      if (this.returnFocus?.isConnected) this.returnFocus.focus();
    }
    onKey(event) {
      if (!this.classList.contains('active')) return;
      if (event.key === 'Escape') { event.preventDefault(); this.sheet ? this.closeSheet() : this.close(); }
      if (event.key !== 'Tab') return;
      const scope = this.sheet || this.querySelector('#CartDrawer');
      const focusable = [...scope.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(el => !el.disabled && !el.hidden && !el.closest('[aria-hidden="true"]') && el.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (!first) { event.preventDefault(); scope.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !scope.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !scope.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
    async request(endpoint, body) {
      const response = await fetch(this.root + endpoint, body ? { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) } : { headers: { Accept: 'application/json' } });
      const result = await response.json();
      if (!response.ok || result.status >= 400) throw new Error(typeof result.description === 'string' ? result.description : typeof result.message === 'string' ? result.message : this.labels.error_label);
      return result;
    }
    sectionBody(body) { return { ...body, sections: this.getSectionsToRender().map(s => s.id), sections_url: location.pathname }; }
    async refresh() {
      if (this.busy || this.refreshing) return;
      this.refreshing = true;
      const revision = this.revision || 0;
      try {
        const response = await fetch(this.root + '?sections=cart-drawer,cart-icon-bubble', { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(this.labels.error_label);
        const sections = await response.json();
        if (!this.busy && revision === (this.revision || 0)) this.replaceContents({ sections });
      } finally { this.refreshing = false; }
    }
    renderContents(result) { this.replaceContents(result); this.open(undefined, false); }
    replaceContents(result) {
      const markup = result.sections?.['cart-drawer'];
      if (!markup) return false;
      const parsed = new DOMParser().parseFromString(markup, 'text/html');
      const next = parsed.querySelector('#CartDrawer');
      if (!next) return false;
      const scroll = this.querySelector('[data-cart-scroll]')?.scrollTop || 0;
      const focused = document.activeElement;
      const focusKey = focused?.dataset.lineKey;
      const focusQuantity = focused?.dataset.cartQuantity;
      const hadFocus = this.contains(focused);
      this.closeSheet(false);
      this.querySelector('#CartDrawer').innerHTML = next.innerHTML;
      this.readState();
      if (this.confetti) this.confetti.canvas = this.querySelector('[data-cart-confetti]');
      this.classList.toggle('is-empty', !this.cart.item_count);
      const scroller = this.querySelector('[data-cart-scroll]'); if (scroller) scroller.scrollTop = scroll;
      const bubble = result.sections?.['cart-icon-bubble'];
      if (bubble) {
        const bubbleDoc = new DOMParser().parseFromString(bubble, 'text/html');
        const target = document.getElementById('cart-icon-bubble');
        if (target) target.innerHTML = bubbleDoc.querySelector('.shopify-section')?.innerHTML || bubble;
      }
      this.decorate();
      if (hadFocus) {
        const replacement = [...this.querySelectorAll('[data-line-key]')].find(el => el.dataset.lineKey === focusKey && (focusQuantity === undefined || el.dataset.cartQuantity === focusQuantity));
        (replacement || this.querySelector('.btn-header-close'))?.focus({ preventScroll: true });
      }
      return true;
    }
    announce(message, error = false) {
      const node = this.querySelector(error ? '[data-cart-error]' : '[data-cart-status]');
      if (node) { node.textContent = message || ''; node.hidden = !message; }
    }
    mutate(task) {
      this.queue = this.queue.catch(() => {}).then(async () => {
        this.busy = true; this.setAttribute('aria-busy', 'true'); this.announce('', true);
        this.revision = (this.revision || 0) + 1;
        this.querySelectorAll('[data-cart-quantity],[data-cart-quantity-input],[data-cart-variant],[data-cart-add],[data-cart-addon],[data-cart-coupon], [data-cart-option-add]').forEach(el => { if (!el.disabled) { el.disabled = true; el.dataset.cartBusy = ''; } });
        try { await task(); this.notify(); }
        catch (error) { await this.reconcile(); this.announce(error.message || this.labels.error_label, true); }
        finally { this.busy = false; this.removeAttribute('aria-busy'); this.querySelectorAll('[data-cart-busy]').forEach(el => { el.disabled = false; delete el.dataset.cartBusy; }); }
      });
      return this.queue;
    }
    async reconcile() {
      try {
        const response = await fetch(this.root + '?sections=cart-drawer,cart-icon-bubble');
        if (response.ok) this.replaceContents({ sections: await response.json() });
      } catch { /* Preserve the last confirmed cart when offline. */ }
    }
    notify() {
      document.dispatchEvent(new CustomEvent('atelier:cart:update', { detail: { cart: this.cart } }));
      if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') publish(PUB_SUB_EVENTS.cartUpdate, { source: 'side-cart', cartData: this.cart });
    }
    async change(key, quantity) {
      const result = await this.request('cart/change.js', this.sectionBody({ id: key, quantity }));
      if (!this.replaceContents(result)) await this.reconcile();
    }
    async add(id, quantity = 1, extra = {}) {
      const result = await this.request('cart/add.js', this.sectionBody({ items: [{ id: Number(id), quantity, ...extra }] }));
      if (!this.replaceContents(result)) await this.reconcile();
      const added = [...this.querySelectorAll('[data-cart-add]')].find(button => Number(button.dataset.cartAdd) === Number(id));
      if (added) {
        added.classList.add('rapid-added'); added.textContent = this.labels.added_label;
        setTimeout(() => { if (added.isConnected) { added.classList.remove('rapid-added'); added.textContent = this.labels.add_label; } }, 1400);
      }
    }
    async switchVariant(key, variantId) {
      const item = this.cart.items?.find(line => line.key === key);
      if (!item || Number(variantId) === item.variant_id) return;
      const extra = { properties: item.properties || {} };
      if (item.selling_plan_allocation) extra.selling_plan = item.selling_plan_allocation.selling_plan.id;
      await this.request('cart/add.js', { items: [{ id: Number(variantId), quantity: item.quantity, ...extra }] });
      try {
        // Automatic discounts can change line keys after an add. Resolve the original line again.
        const fresh = await this.request('cart.js');
        const properties = value => JSON.stringify(Object.entries(value || {}).sort(([a], [b]) => a.localeCompare(b)));
        const previous = fresh.items.find(line => line.variant_id === item.variant_id && properties(line.properties) === properties(item.properties) && line.selling_plan_allocation?.selling_plan.id === item.selling_plan_allocation?.selling_plan.id);
        if (previous) await this.change(previous.key, 0); else await this.reconcile();
      }
      catch { throw new Error(this.labels.variant_partial_error); }
    }
    onClick(event) {
      const button = event.target.closest('button,a,[data-cart-close]');
      if (!button || !this.contains(button)) return;
      if (button.hasAttribute('data-cart-close')) { event.preventDefault(); this.close(); }
      else if (button.hasAttribute('data-cart-sheet-close')) this.closeSheet();
      else if (button.dataset.cartSheetOpen) this.openSheet(button.dataset.cartSheetOpen, button);
      else if (button.hasAttribute('data-cart-quantity')) this.mutate(() => this.change(button.dataset.lineKey, Number(button.dataset.cartQuantity)));
      else if (button.dataset.cartAdd) this.mutate(() => this.add(button.dataset.cartAdd));
      else if (button.dataset.cartChoose) this.chooseProduct(button.dataset.cartChoose, button);
      else if (button.dataset.cartCoupon) {
        const card = button.closest('[data-coupon-card]');
        const minimum = Number(card?.dataset.minimum || 0);
        const rawSubtotal = this.getRawSubtotal();
        if (rawSubtotal < minimum) return;
        this.userDismissedCode = '';
        this.userDismissedSubtotal = 0;
        this.applyCoupon(button.dataset.cartCoupon);
      }
      else if (button.hasAttribute('data-coupon-remove')) {
        this.userDismissedCode = this.activeCouponCode || 'dismissed';
        this.userDismissedSubtotal = this.getRawSubtotal();
        this.activeCouponCode = '';
        this.updateDiscountState();
        this.applyCoupon('');
      }
      else if (button.hasAttribute('data-cart-note-save')) this.mutate(async () => { const result = await this.request('cart/update.js', this.sectionBody({ note: this.querySelector('[data-cart-note]').value })); this.replaceContents(result); });
      else if (button.hasAttribute('data-cross-sell')) this.scrollRecommendations(Number(button.dataset.crossSell));
      else if (button.hasAttribute('data-cart-summary-scroll')) this.querySelector('[data-cart-summary]')?.scrollIntoView({ behavior: this.reducedMotion ? 'auto' : 'smooth', block: 'start' });
      else if (button.hasAttribute('data-cart-top')) this.querySelector('[data-cart-scroll]')?.scrollTo({ top: 0, behavior: 'smooth' });
      else if (button.hasAttribute('data-cart-checkout')) {
        event.preventDefault();
        this.queue.finally(() => {
          if (!this.cart.item_count || this.querySelector('[data-cart-error]:not([hidden])')) return;
          const note = this.querySelector('[data-cart-note]');
          const go = () => { location.href = this.root + 'checkout' + (this.pendingCode ? '?discount=' + encodeURIComponent(this.pendingCode) : ''); };
          if (note && note.value !== (this.cart.note || '')) this.request('cart/update.js', { note: note.value }).then(go).catch(error => this.announce(error.message, true)); else go();
        });
      }
    }
    onChange(event) {
      const input = event.target;
      if (input.hasAttribute('data-cart-quantity-input')) {
        const quantity = Number(input.value), min = Number(input.min || 1), step = Number(input.step || 1), max = Number(input.max || Infinity);
        if (!Number.isInteger(quantity) || quantity < min || quantity > max || (quantity - min) % step) { input.reportValidity(); return; }
        this.mutate(() => this.change(input.dataset.lineKey, quantity));
      } else if (input.hasAttribute('data-cart-variant')) this.mutate(() => this.switchVariant(input.dataset.lineKey, input.value));
      else if (input.hasAttribute('data-cart-addon')) {
        const checked = input.checked;
        this.mutate(async () => {
          if (checked) await this.add(input.dataset.variant, 1, { properties: { _atelier_addon: 'true' } });
          else { const lines = this.cart.items.filter(line => line.properties?._atelier_addon === 'true' && line.variant_id === Number(input.dataset.variant)); for (const line of lines) await this.change(line.key, 0); }
        });
      } else if (input.hasAttribute('data-cart-option-select')) this.renderOption();
    }
    onSubmit(event) {
      if (event.target.hasAttribute('data-cart-coupon-form')) { event.preventDefault(); this.applyCoupon(new FormData(event.target).get('discount').trim()); }
      if (event.target.hasAttribute('data-cart-variant-form')) { event.preventDefault(); const id = this.querySelector('[data-cart-option-select]').value; this.mutate(() => this.add(id)); }
    }
    applyCoupon(code, isAuto = false) {
      return this.mutate(async () => {
        const result = await this.request('cart/update.js', this.sectionBody({ discount: code }));
        this.replaceContents(result);
        this.currentAppliedCoupon = code;
        this.updateCheckoutUrl(code);
        const entry = result.discount_codes?.find(item => item.code.toLowerCase() === code.toLowerCase());
        const confirmed = this.config.discountApplications?.some(item => item.type === 'discount_code' && item.title.toLowerCase() === code.toLowerCase()) || entry?.applicable === true;
        this.pendingCode = entry?.applicable === false ? '' : code;
        const text = !code ? '' : entry?.applicable === false ? this.labels.coupon_invalid : confirmed ? this.labels.coupon_success.replace('[code]', code) : this.labels.coupon_pending;
        const feedback = this.querySelector('[data-coupon-feedback]');
        if (feedback) { feedback.hidden = !code; feedback.querySelector('span').textContent = text; }
        this.decorateCoupons();
      });
    }
    updateCheckoutUrl(code) {
      const checkoutBtn = this.querySelector('[data-cart-checkout]');
      if (!checkoutBtn) return;
      const root = this.root || window.Shopify?.routes?.root || '/';
      if (code) {
        checkoutBtn.href = `${root}discount/${encodeURIComponent(code)}?redirect=/checkout`;
      } else {
        checkoutBtn.href = `${root}checkout`;
      }
    }
    updateDiscountState() {
      const rawSubtotal = this.getRawSubtotal();
      let targetCode = '';
      let discountPercent = 0;

      if (rawSubtotal >= 189900) {
        targetCode = '10';
        discountPercent = 10;
      } else if (rawSubtotal >= 149900) {
        targetCode = '5';
        discountPercent = 5;
      }

      // If user explicitly clicked Remove on this subtotal, respect user choice
      if (this.userDismissedCode && this.userDismissedSubtotal === rawSubtotal) {
        targetCode = '';
        discountPercent = 0;
      }

      this.activeCouponCode = targetCode;
      const discountAmount = discountPercent > 0 ? Math.round(rawSubtotal * (discountPercent / 100)) : 0;
      const finalTotal = Math.max(0, rawSubtotal - discountAmount);

      // 1. Update checkout button href
      const checkoutBtn = this.querySelector('[data-cart-checkout]');
      if (checkoutBtn) {
        const root = this.root || window.Shopify?.routes?.root || '/';
        if (targetCode) {
          checkoutBtn.href = `${root}discount/${encodeURIComponent(targetCode)}?redirect=/checkout`;
        } else {
          checkoutBtn.href = `${root}checkout`;
        }
      }

      // 2. Update feedback banner
      const feedback = this.querySelector('[data-coupon-feedback]');
      if (feedback) {
        if (targetCode) {
          feedback.hidden = false;
          const span = feedback.querySelector('span');
          if (span) span.textContent = `${targetCode} applied (${discountPercent}% OFF)`;
        } else {
          feedback.hidden = true;
        }
      }

      // 3. Update coupon cards
      this.querySelectorAll('[data-coupon-card]').forEach(card => {
        const cardCode = (card.dataset.code || '').trim();
        const minimum = Number(card.dataset.minimum || 0);
        const isLocked = rawSubtotal < minimum;
        const isApplied = (targetCode === cardCode) && !isLocked;

        card.classList.toggle('applied', isApplied);
        card.classList.toggle('locked', isLocked);

        const button = card.querySelector('[data-cart-coupon]');
        if (button) {
          const gap = Math.max(0, minimum - rawSubtotal);
          if (isApplied) {
            button.textContent = this.labels.applied_label || 'Applied';
            button.disabled = true;
            button.classList.remove('btn-coupon-gap-pill');
          } else if (isLocked) {
            button.textContent = (this.labels.locked_label || 'Add [amount]').replace('[amount]', this.money(gap));
            button.disabled = true;
            button.classList.add('btn-coupon-gap-pill');
          } else {
            button.textContent = this.labels.apply_label || 'Apply';
            button.disabled = false;
            button.classList.remove('btn-coupon-gap-pill');
          }
        }
      });

      // 4. Update Summary Rows and Totals
      const summary = this.querySelector('[data-cart-summary]');
      if (summary) {
        let discountRow = summary.querySelector('.summary-row.milestone-discount-row');
        if (discountAmount > 0) {
          if (!discountRow) {
            discountRow = document.createElement('div');
            discountRow.className = 'summary-row savings milestone-discount-row';
            const grandTotalRow = summary.querySelector('.grand-total-row');
            if (grandTotalRow) summary.insertBefore(discountRow, grandTotalRow);
            else summary.append(discountRow);
          }
          discountRow.innerHTML = `<span>Discount (${discountPercent}% OFF)</span><span>−${this.money(discountAmount)}</span>`;
          discountRow.hidden = false;
        } else if (discountRow) {
          discountRow.hidden = true;
        }

        const grandTotalSpan = summary.querySelector('.grand-total-row span:last-child');
        if (grandTotalSpan) {
          grandTotalSpan.textContent = this.money(finalTotal);
        }
      }

      // 5. Update bottom sticky checkout bar total
      const bottomTotal = this.querySelector('.bottom-grand-total');
      if (bottomTotal) {
        bottomTotal.textContent = this.money(finalTotal);
      }

      // 6. Sync with Shopify Cart API in background quietly
      if (this.lastSyncedDiscountCode !== targetCode) {
        this.lastSyncedDiscountCode = targetCode;
        fetch((this.root || '/') + 'cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ discount: targetCode || '' })
        }).catch(() => {});
      }
    }
    openSheet(name, trigger) {
      const sheet = this.querySelector('[data-cart-sheet="' + name + '"]');
      if (!sheet) return;
      this.closeSheet(false); this.sheetTrigger = trigger || document.activeElement; this.sheet = sheet;
      sheet.classList.add('active'); sheet.setAttribute('aria-hidden', 'false');
      this.querySelector('[data-cart-shell]').setAttribute('inert', '');
      setTimeout(() => sheet.querySelector('button,input,select')?.focus(), 50);
    }
    closeSheet(restore = true) {
      if (!this.sheet) return;
      this.sheet.classList.remove('active'); this.sheet.setAttribute('aria-hidden', 'true');
      this.querySelector('[data-cart-shell]')?.removeAttribute('inert'); this.sheet = null;
      if (restore && this.sheetTrigger?.isConnected) this.sheetTrigger.focus();
    }
    async chooseProduct(handle, trigger) {
      if (!/^[a-z0-9-]+$/i.test(handle)) return;
      trigger.disabled = true;
      try {
        this.optionProduct = await this.request('products/' + encodeURIComponent(handle) + '.js');
        const select = this.querySelector('[data-cart-option-select]'); select.replaceChildren();
        for (const variant of this.optionProduct.variants) { const option = document.createElement('option'); option.value = variant.id; option.textContent = variant.title; option.disabled = !variant.available; select.append(option); }
        select.value = this.optionProduct.variants.find(variant => variant.available)?.id || '';
        this.querySelector('[data-cart-option-title]').textContent = this.optionProduct.title;
        this.renderOption(); this.openSheet('variant', trigger);
      } catch (error) { this.announce(error.message, true); }
      finally { trigger.disabled = false; }
    }
    renderOption() {
      const variant = this.optionProduct?.variants.find(item => item.id === Number(this.querySelector('[data-cart-option-select]').value));
      const image = this.querySelector('[data-cart-option-image]');
      const src = variant?.featured_image?.src || this.optionProduct?.featured_image;
      image.hidden = !src; if (src) { image.src = src; image.alt = this.optionProduct.title; }
      this.querySelector('[data-cart-option-price]').textContent = variant ? this.money(variant.price) : '';
      this.querySelector('[data-cart-option-add]').disabled = !variant?.available;
    }
    money(cents) { try { return new Intl.NumberFormat(document.documentElement.lang || 'en-IN', { style: 'currency', currency: this.config.currency || 'INR', maximumFractionDigits: 2 }).format(cents / 100); } catch { return (this.config.symbol || '') + (cents / 100).toFixed(2); } }
    decorate() {
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!this.classList.contains('active')) this.setAttribute('inert', '');
      this.decorateMilestones();
      this.decorateCoupons();
      this.updateCheckoutUrl(this.currentAppliedCoupon || (this.config.discountApplications?.find(d => d.type === 'discount_code')?.title) || '');
      this.updateDiscountState();
      const addon = this.querySelector('[data-addon-copy]');
      if (addon) addon.textContent = (this.labels.addon_copy || '').replace('[product]', addon.dataset.productTitle).replace('[price]', this.money(Number(addon.dataset.addonPrice)));
      clearInterval(this.timer); this.updateDeadline();
      if (this.config.deadline && !this.reducedMotion) this.timer = setInterval(() => this.updateDeadline(), 1000);
      clearInterval(this.carouselTimer);
      const track = this.querySelector('[data-cross-sell-track]');
      if (track && this.config.autoRotate && !this.reducedMotion) this.carouselTimer = setInterval(() => {
        if (!this.classList.contains('active') || document.hidden || this.sheet || this.busy || this.touchUntil > Date.now()) return;
        this.scrollRecommendations(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 ? -100 : 1);
      }, 5000);
      track?.addEventListener('pointerdown', () => { this.touchUntil = Date.now() + 6000; }, { passive: true });
      track?.addEventListener('keydown', () => { this.touchUntil = Date.now() + 6000; });
      this.querySelectorAll('[data-cart-sheet]').forEach(sheet => { sheet.onclick = e => { if (e.target === sheet) this.closeSheet(); }; });
    }
    decorateMilestones() {
      const total = this.getRawSubtotal();
      const nodes = [...this.querySelectorAll('[data-reward-node]')].sort((a, b) => Number(a.dataset.threshold) - Number(b.dataset.threshold));
      const container = this.querySelector('[data-reward-nodes]');
      nodes.forEach(node => container?.append(node));
      const count = nodes.length;
      if (count === 0) return;

      // Evenly spaced milestone node positions across the bar (matching Vercel reference)
      let positions = [];
      if (count === 1) positions = [50];
      else if (count === 2) positions = [35, 75];
      else if (count === 3) positions = [25, 58, 88];
      else positions = nodes.map((_, i) => Math.round(20 + (i / (count - 1)) * 68));

      const thresholds = nodes.map(node => Number(node.dataset.threshold));

      nodes.forEach((node, index) => {
        node.style.left = positions[index] + '%';
        const unlocked = total >= thresholds[index];
        node.classList.toggle('unlocked', unlocked);
        const lock = node.querySelector('[data-reward-locked]');
        const check = node.querySelector('[data-reward-unlocked]');
        if (lock) lock.hidden = unlocked;
        if (check) check.hidden = !unlocked;
      });

      // Segmented visual progress bar
      let progressPct = 0;
      if (total <= 0) {
        progressPct = 0;
      } else if (total < thresholds[0]) {
        progressPct = Math.min(positions[0], Math.round((total / thresholds[0]) * positions[0]));
      } else {
        let inSegment = false;
        for (let i = 0; i < count - 1; i++) {
          if (total >= thresholds[i] && total < thresholds[i + 1]) {
            const inRange = total - thresholds[i];
            const span = thresholds[i + 1] - thresholds[i];
            const posSpan = positions[i + 1] - positions[i];
            progressPct = positions[i] + Math.min(posSpan, Math.round((inRange / span) * posSpan));
            inSegment = true;
            break;
          }
        }
        if (!inSegment) {
          progressPct = 100;
        }
      }

      const fill = this.querySelector('[data-reward-fill]');
      if (fill) {
        fill.style.width = progressPct + '%';
        fill.style.setProperty('--milestone-progress', progressPct + '%');
      }
      this.querySelector('[data-reward-progress]')?.setAttribute('aria-valuenow', Math.round(progressPct));

      // Caret pointer and Active Headline
      const caret = this.querySelector('[data-reward-caret]');
      const headline = this.querySelector('[data-reward-headline]');

      let nextIndex = 0;
      while (nextIndex < count && total >= thresholds[nextIndex]) {
        nextIndex++;
      }

      if (nextIndex < count) {
        const nextNode = nodes[nextIndex];
        const gap = Math.max(0, thresholds[nextIndex] - total);
        if (caret) caret.style.left = positions[nextIndex] + '%';
        if (headline) {
          headline.textContent = (this.labels.milestone_more || 'Add [amount] more for [reward]!')
            .replace('[amount]', this.money(gap))
            .replace('[reward]', nextNode.dataset.rewardTitle);
        }
      } else {
        if (caret) caret.style.left = positions[count - 1] + '%';
        if (headline) {
          headline.textContent = (this.labels.milestone_unlocked || '🎉 All rewards unlocked!')
            .replace('[reward]', nodes[count - 1].dataset.rewardTitle);
        }
      }

      this.querySelectorAll('[data-offer-threshold]').forEach(card => {
        const diff = Number(card.dataset.offerThreshold) - total;
        card.classList.toggle('unlocked', diff <= 0);
        const badge = card.querySelector('[data-milestone-badge]');
        if (badge) badge.textContent = diff <= 0 ? this.labels.unlocked_label : this.labels.locked_label.replace('[amount]', this.money(diff));
      });

      const unlockedCount = nodes.filter(node => total >= Number(node.dataset.threshold)).length;
      if (this.previousUnlocked !== undefined && unlockedCount > this.previousUnlocked && this.config.celebrate && !this.reducedMotion) {
        this.celebrate(unlockedCount);
      }
      this.previousUnlocked = unlockedCount;
    }
    decorateCoupons() {
      const rawSubtotal = this.getRawSubtotal();
      const actual = [...new Set((this.config.discountApplications || []).filter(item => item.type === 'discount_code').map(item => item.title))];
      const activeCode = (this.currentAppliedCoupon || actual[0] || '').toLowerCase();

      const feedback = this.querySelector('[data-coupon-feedback]');
      if (feedback) {
        if (activeCode) {
          feedback.hidden = false;
          feedback.querySelector('span').textContent = (this.labels.coupon_success || '[code] applied').replace('[code]', activeCode);
        } else {
          feedback.hidden = true;
        }
      }

      const carousel = this.querySelector('[data-coupon-carousel]');
      if (carousel) this.enableDragScroll(carousel);

      this.querySelectorAll('[data-coupon-card]').forEach(card => {
        const cardCode = (card.dataset.code || '').toLowerCase();
        const minimum = Number(card.dataset.minimum || 0);
        const isLocked = rawSubtotal < minimum;
        const isConfirmed = !isLocked && (activeCode === cardCode);

        card.classList.toggle('applied', isConfirmed);
        card.classList.toggle('locked', isLocked);

        const button = card.querySelector('[data-cart-coupon]');
        if (button) {
          const gap = Math.max(0, minimum - rawSubtotal);
          if (isConfirmed) {
            button.textContent = this.labels.applied_label || 'Applied';
            button.disabled = true;
            button.classList.remove('btn-coupon-gap-pill');
          } else if (isLocked) {
            button.textContent = (this.labels.locked_label || 'Add [amount]').replace('[amount]', this.money(gap));
            button.disabled = true;
            button.classList.add('btn-coupon-gap-pill');
          } else {
            button.textContent = this.labels.apply_label || 'Apply';
            button.disabled = false;
            button.classList.remove('btn-coupon-gap-pill');
          }
        }
      });
    }
    updateDeadline() {
      const timer = this.querySelector('[data-reward-timer]'); if (!timer) return;
      const end = Date.parse(this.config.deadline), remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
      timer.hidden = !Number.isFinite(end);
      if (!Number.isFinite(end)) return;
      const hours = Math.floor(remaining / 3600), minutes = Math.floor(remaining % 3600 / 60), seconds = remaining % 60;
      const time = [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
      timer.textContent = remaining ? this.labels.timer_label.replace('[time]', time) : this.labels.offer_expired;
    }
    scrollRecommendations(direction) {
      const track = this.querySelector('[data-cross-sell-track]'); if (!track) return;
      if (direction === -100) track.scrollTo({ left: 0, behavior: 'smooth' }); else track.scrollBy({ left: direction * (track.firstElementChild?.getBoundingClientRect().width + 12 || 230), behavior: this.reducedMotion ? 'auto' : 'smooth' });
    }
    celebrate(tier = 1) {
      if (this.reducedMotion) return;
      if (!this.confetti) {
        this.confetti = new CartConfetti(this.querySelector('[data-cart-confetti]'));
      }
      this.confetti?.burst(tier);
    }
  }
  customElements.define('cart-drawer', CartDrawer);
})();
