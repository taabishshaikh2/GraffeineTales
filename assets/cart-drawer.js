/* Graffeine Tales side cart. Shopify remains the source of prices and eligibility. */
(() => {
  if (customElements.get('cart-drawer')) return;
  class CartDrawer extends HTMLElement {
    connectedCallback() {
      this.abort?.abort();
      this.abort = new AbortController();
      this.queue = Promise.resolve();
      this.root = window.Shopify?.routes?.root || '/';
      this.readState();
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
      else if (button.dataset.cartCoupon) this.applyCoupon(button.dataset.cartCoupon);
      else if (button.hasAttribute('data-coupon-remove')) this.applyCoupon('');
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
    applyCoupon(code) {
      return this.mutate(async () => {
        const result = await this.request('cart/update.js', this.sectionBody({ discount: code }));
        this.replaceContents(result);
        const entry = result.discount_codes?.find(item => item.code.toLowerCase() === code.toLowerCase());
        const confirmed = this.config.discountApplications?.some(item => item.type === 'discount_code' && item.title.toLowerCase() === code.toLowerCase()) || entry?.applicable === true;
        this.pendingCode = entry?.applicable === false ? '' : code;
        const text = !code ? '' : entry?.applicable === false ? this.labels.coupon_invalid : confirmed ? this.labels.coupon_success.replace('[code]', code) : this.labels.coupon_pending;
        const feedback = this.querySelector('[data-coupon-feedback]');
        if (feedback) { feedback.hidden = !code; feedback.querySelector('span').textContent = text; }
        this.decorateCoupons();
      });
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
      this.decorateMilestones(); this.decorateCoupons();
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
      const total = this.cart.total_price || 0;
      const nodes = [...this.querySelectorAll('[data-reward-node]')].sort((a, b) => Number(a.dataset.threshold) - Number(b.dataset.threshold));
      const container = this.querySelector('[data-reward-nodes]'); nodes.forEach(node => container?.append(node));
      const max = Number(nodes.at(-1)?.dataset.threshold || 0);
      const positions = nodes.map(node => max ? Number(node.dataset.threshold) / max * 100 : 0);
      nodes.forEach((node, index) => { node.style.left = positions[index] + '%'; const unlocked = total >= Number(node.dataset.threshold); node.classList.toggle('unlocked', unlocked); const lock = node.querySelector('[data-reward-locked]'), check = node.querySelector('[data-reward-unlocked]'); if (lock) lock.hidden = unlocked; if (check) check.hidden = !unlocked; });
      const progress = max ? Math.max(0, Math.min(100, total / max * 100)) : 0;
      const fill = this.querySelector('[data-reward-fill]');
      if (fill) { fill.style.width = progress + '%'; fill.style.setProperty('--milestone-progress', progress + '%'); }
      this.querySelector('[data-reward-progress]')?.setAttribute('aria-valuenow', Math.round(progress));
      const next = nodes.find(node => total < Number(node.dataset.threshold)) || nodes.at(-1);
      const headline = this.querySelector('[data-reward-headline]');
      if (next && headline) headline.textContent = (total >= max ? this.labels.milestone_unlocked : this.labels.milestone_more).replace('[amount]', this.money(Math.max(0, Number(next.dataset.threshold) - total))).replace('[reward]', next.dataset.rewardTitle);
      this.querySelectorAll('[data-offer-threshold]').forEach(card => { const difference = Number(card.dataset.offerThreshold) - total; card.classList.toggle('unlocked', difference <= 0); const badge = card.querySelector('[data-milestone-badge]'); if (badge) badge.textContent = difference <= 0 ? this.labels.unlocked_label : this.labels.locked_label.replace('[amount]', this.money(difference)); });
      const unlockedCount = nodes.filter(node => total >= Number(node.dataset.threshold)).length;
      if (this.previousUnlocked !== undefined && unlockedCount > this.previousUnlocked && this.config.celebrate && !this.reducedMotion) this.celebrate();
      this.previousUnlocked = unlockedCount;
    }
    decorateCoupons() {
      const total = this.cart.total_price || 0;
      const actual = [...new Set((this.config.discountApplications || []).filter(item => item.type === 'discount_code').map(item => item.title))];
      const feedback = this.querySelector('[data-coupon-feedback]');
      if (feedback && actual.length) { feedback.hidden = false; feedback.querySelector('span').textContent = this.labels.coupon_success.replace('[code]', actual.join(', ')); }
      else if (feedback && this.pendingCode) { feedback.hidden = false; feedback.querySelector('span').textContent = this.labels.coupon_pending; }
      const cards = [...this.querySelectorAll('[data-coupon-carousel] [data-coupon-card]')];
      cards.sort((a, b) => (Number(a.dataset.minimum) > total) - (Number(b.dataset.minimum) > total) || Number(b.dataset.priority) - Number(a.dataset.priority)).forEach(card => card.parentNode.append(card));
      this.querySelectorAll('[data-coupon-card]').forEach(card => {
        const confirmed = this.config.discountApplications?.some(item => item.type === 'discount_code' && item.title.toLowerCase() === card.dataset.code.toLowerCase());
        card.classList.toggle('applied', !!confirmed); card.classList.toggle('locked', Number(card.dataset.minimum) > total);
        const button = card.querySelector('[data-cart-coupon]');
        if (button) {
          const gap = Math.max(0, Number(card.dataset.minimum) - total);
          button.textContent = confirmed ? this.labels.applied_label : gap ? this.labels.locked_label.replace('[amount]', this.money(gap)) : this.labels.apply_label;
          button.classList.toggle('btn-coupon-gap-pill', gap > 0 && !confirmed);
          button.disabled = !!confirmed || gap > 0;
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
    celebrate() {
      const canvas = this.querySelector('[data-cart-confetti]'); if (!canvas) return;
      const context = canvas.getContext('2d'); if (!context) return;
      canvas.width = this.clientWidth; canvas.height = this.clientHeight;
      const colors = [getComputedStyle(this).getPropertyValue('--cart-primary'), '#D4AF37', getComputedStyle(this).getPropertyValue('--cart-success')];
      const pieces = Array.from({ length: 32 }, () => ({ x: canvas.width / 2, y: 130, vx: (Math.random() - .5) * 8, vy: -Math.random() * 7, color: colors[Math.floor(Math.random() * colors.length)] }));
      let frame = 0;
      const draw = () => { context.clearRect(0, 0, canvas.width, canvas.height); pieces.forEach(piece => { piece.x += piece.vx; piece.y += piece.vy; piece.vy += .15; context.fillStyle = piece.color; context.fillRect(piece.x, piece.y, 5, 7); }); if (++frame < 100 && this.isConnected) requestAnimationFrame(draw); else context.clearRect(0, 0, canvas.width, canvas.height); }; draw();
    }
  }
  customElements.define('cart-drawer', CartDrawer);
})();
