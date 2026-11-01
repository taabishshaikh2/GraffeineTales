/**
 * Graffeine Tales — Premium Glass Header Web Component
 * Handles layout sizing, sticky scroll, mega menu hover/click, live search, wishlist, cart drawer & mobile drawer.
 */
if (!customElements.get('atelier-header')) {
  class AtelierHeader extends HTMLElement {
    connectedCallback() {
      if (this.__initialized) return;
      this.__initialized = true;

      this.section = this.closest('.shopify-section') || this.parentElement;
      this.pill = this.querySelector('.atelier-header__pill');
      this.megaPanels = this.querySelectorAll('[data-mega-panel]');
      this.searchPanel = this.querySelector('[data-search-panel]');
      this.searchInput = this.querySelector('[data-search-input]');
      this.searchResults = this.querySelector('[data-search-results]');
      this.searchIdle = this.querySelector('[data-search-idle]');
      this.drawer = this.querySelector('[data-mobile-drawer]');
      this.scrim = this.querySelector('[data-scrim]');
      this.moneyFormat = this.dataset.moneyFormat || '₹';
      this.lastScrollY = window.scrollY;
      this.openMega = null;
      this.hideOnScroll = this.dataset.hideOnScroll === 'true';

      // 1. Measure and set CSS variables
      this.measure();
      window.addEventListener('resize', () => this.measure(), { passive: true });

      // 2. Scroll listener for sticky header
      this.onScroll = () => {
        if (this.raf) return;
        this.raf = requestAnimationFrame(() => {
          this.raf = null;
          this.handleScroll();
        });
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });

      // 3. Desktop Mega Menu (Hover & Click)
      this.querySelectorAll('[data-mega-trigger]').forEach((btn) => {
        const index = btn.dataset.megaTrigger;
        const panel = this.querySelector(`[data-mega-panel="${index}"]`);
        const parentLi = btn.closest('li');

        const open = () => {
          if (window.innerWidth < 990) return;
          clearTimeout(this.leaveTimer);
          clearTimeout(this.enterTimer);
          this.enterTimer = setTimeout(() => this.showMega(btn, panel), this.openMega ? 0 : 100);
        };

        const close = () => {
          if (window.innerWidth < 990) return;
          clearTimeout(this.enterTimer);
          this.leaveTimer = setTimeout(() => {
            if (this.openMega === btn) this.closeAll();
          }, 200);
        };

        if (parentLi) {
          parentLi.addEventListener('mouseenter', open);
          parentLi.addEventListener('mouseleave', close);
        }

        if (panel) {
          panel.addEventListener('mouseenter', () => clearTimeout(this.leaveTimer));
          panel.addEventListener('mouseleave', close);
        }

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.openMega === btn) {
            this.closeAll();
          } else {
            this.showMega(btn, panel);
          }
        });
      });

      // 4. Search Interactions
      this.querySelectorAll('[data-open-search]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleSearch();
        });
      });

      if (this.searchInput) {
        this.searchInput.addEventListener('input', () => {
          clearTimeout(this.searchTimer);
          this.searchTimer = setTimeout(() => this.suggest(this.searchInput.value.trim()), 240);
        });
      }

      // 5. Mobile Drawer
      this.querySelectorAll('[data-open-drawer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openMobileDrawer();
        });
      });

      this.querySelectorAll('[data-close-drawer], [data-scrim]').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeAll();
        });
      });

      // Swipe Left to close drawer on mobile
      if (this.drawer) {
        let startX = 0, currentX = 0, isDragging = false;
        this.drawer.addEventListener('touchstart', (e) => {
          if (!this.drawer.classList.contains('is-open') || e.touches.length !== 1) return;
          startX = e.touches[0].clientX;
          isDragging = false;
        }, { passive: true });

        this.drawer.addEventListener('touchmove', (e) => {
          if (!startX) return;
          const diff = e.touches[0].clientX - startX;
          if (diff < -10) {
            isDragging = true;
            this.drawer.style.transform = `translateX(${Math.min(0, diff)}px)`;
          }
        }, { passive: true });

        const onTouchEnd = () => {
          if (isDragging) {
            this.drawer.style.transform = '';
            if (currentX < -60) this.closeAll();
          }
          startX = 0;
          isDragging = false;
        };

        this.drawer.addEventListener('touchend', onTouchEnd);
        this.drawer.addEventListener('touchcancel', onTouchEnd);
      }

      // 6. Global Escape key & outside clicks
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeAll();
      });

      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
          this.closeAll();
        }
      });

      // 7. Wishlist Integration
      this.updateWishlistCount();
      window.addEventListener('storage', (e) => {
        if (e.key === 'graffeine-wishlist') this.updateWishlistCount();
      });
      document.addEventListener('atelier:wishlist:update', () => this.updateWishlistCount());

      this.querySelectorAll('[data-open-wishlist]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const dialog = document.querySelector('[data-wishlist-dialog]');
          if (dialog) {
            e.preventDefault();
            dialog.showModal();
          }
        });
      });

      // 8. Cart Drawer Integration
      this.querySelectorAll('#cart-icon-bubble, [data-cart-btn]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const cartDrawer = document.querySelector('cart-drawer');
          if (cartDrawer && typeof cartDrawer.open === 'function') {
            e.preventDefault();
            cartDrawer.open();
          }
        });
      });

      // Render recent searches
      this.renderRecentSearches();
    }

    measure() {
      const bar = this.querySelector('.atelier-header__bar');
      const pill = this.querySelector('.atelier-header__pill');
      const ann = this.section.querySelector('.atelier-announcement');
      
      const pillH = bar ? bar.offsetHeight : (pill ? pill.offsetHeight + 14 : this.offsetHeight);
      const annH = (ann && ann.offsetParent !== null) ? ann.offsetHeight : 0;
      const totalH = pillH + annH;

      document.documentElement.style.setProperty('--header-height', totalH + 'px');
      document.documentElement.style.setProperty('--header-pill-height', pillH + 'px');

      // Check if the first section is a hero banner (collections, homepage hero, image-banner)
      const mainFirst = document.querySelector('#MainContent > .shopify-section:first-child');
      const isBanner = mainFirst && (
        mainFirst.querySelector('.atelier-col-hero, .atelier-hero, .image-banner, .slideshow, .hero-carousel, [data-hero-banner]')
        || document.body.classList.contains('template-index')
        || document.body.classList.contains('template-collection')
      );

      // Float header over banners
      this.section.style.marginBottom = '-' + pillH + 'px';
      if (!isBanner && mainFirst) {
        mainFirst.style.paddingTop = (totalH + 24) + 'px';
      } else if (mainFirst) {
        mainFirst.style.paddingTop = '';
      }
    }
    }

    handleScroll() {
      const y = window.scrollY;
      const bar = this.querySelector('.atelier-header__bar');
      if (bar) bar.classList.toggle('is-scrolled', y > 15);

      if (this.hideOnScroll) {
        if (y > this.lastScrollY + 6 && y > 250) {
          this.section.classList.add('is-hidden');
        } else if (y < this.lastScrollY - 6 || y < 100) {
          this.section.classList.remove('is-hidden');
        }
      }
      this.lastScrollY = y;
    }

    showMega(btn, panel) {
      if (!panel) return;
      this.closeAll();
      panel.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      this.openMega = btn;
      if (this.scrim) this.scrim.classList.add('is-visible');
    }

    toggleSearch() {
      if (!this.searchPanel) return;
      if (this.searchPanel.classList.contains('is-open')) {
        this.closeAll();
      } else {
        this.closeAll();
        this.searchPanel.classList.add('is-open');
        if (this.scrim) this.scrim.classList.add('is-visible');
        if (this.searchInput) {
          setTimeout(() => this.searchInput.focus(), 60);
        }
      }
    }

    openMobileDrawer() {
      if (!this.drawer) return;
      this.closeAll();
      this.drawer.classList.add('is-open');
      if (this.scrim) this.scrim.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }

    closeAll() {
      if (this.openMega) {
        this.openMega.setAttribute('aria-expanded', 'false');
        this.openMega = null;
      }
      this.megaPanels.forEach((p) => p.classList.remove('is-open'));
      if (this.searchPanel) this.searchPanel.classList.remove('is-open');
      if (this.drawer) this.drawer.classList.remove('is-open');
      if (this.scrim) this.scrim.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    // Live Predictive Search
    suggest(query) {
      if (!this.searchResults || !this.searchIdle) return;
      if (!query || query.length < 2) {
        this.searchResults.innerHTML = '';
        this.searchIdle.hidden = false;
        return;
      }

      const url = `${window.Shopify?.routes?.root || '/'}search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const products = data?.resources?.results?.products || [];
          if (!products.length) {
            this.searchResults.innerHTML = `<p style="padding: 12px; color: #666; font-size: 13px;">No journals or products found for “${query}”.</p>`;
            this.searchIdle.hidden = true;
            return;
          }

          this.searchIdle.hidden = true;
          this.searchResults.innerHTML = products.map((p) => {
            const img = p.featured_image?.url || p.image;
            const price = this.formatMoney(p.price);
            return `
              <a href="${p.url}" class="atelier-search-item" data-search-term="${query}">
                ${img ? `<img src="${img}" alt="" width="48" height="48" loading="lazy">` : `<div style="width:48px;height:48px;background:#eee;border-radius:6px;"></div>`}
                <div class="atelier-search-item__info">
                  <span class="atelier-search-item__title">${p.title}</span>
                  <span class="atelier-search-item__price">${price}</span>
                </div>
              </a>
            `;
          }).join('');

          this.rememberSearch(query);
        })
        .catch(() => {
          this.searchIdle.hidden = false;
        });
    }

    formatMoney(cents) {
      if (!cents) return '';
      const amount = (cents / 100).toFixed(0);
      return `${this.moneyFormat}${amount}`;
    }

    // Recent Searches
    getRecentSearches() {
      try {
        return JSON.parse(localStorage.getItem('graffeine_recent_searches') || '[]');
      } catch {
        return [];
      }
    }

    rememberSearch(q) {
      if (!q || q.length < 2) return;
      let list = this.getRecentSearches().filter((item) => item.toLowerCase() !== q.toLowerCase());
      list.unshift(q);
      try {
        localStorage.setItem('graffeine_recent_searches', JSON.stringify(list.slice(0, 5)));
        this.renderRecentSearches();
      } catch {}
    }

    renderRecentSearches() {
      const container = this.querySelector('[data-recent-chips]');
      if (!container) return;
      const list = this.getRecentSearches();
      if (!list.length) {
        const wrap = container.closest('[data-recent-wrapper]');
        if (wrap) wrap.hidden = true;
        return;
      }
      const wrap = container.closest('[data-recent-wrapper]');
      if (wrap) wrap.hidden = false;

      container.innerHTML = list.map((term) => `
        <li>
          <a class="atelier-chip" href="${window.Shopify?.routes?.root || '/'}search?q=${encodeURIComponent(term)}&type=product">
            ${term}
          </a>
        </li>
      `).join('');
    }

    // Wishlist Badges
    updateWishlistCount() {
      try {
        const list = JSON.parse(localStorage.getItem('graffeine-wishlist') || '[]');
        const count = Array.isArray(list) ? list.length : 0;
        this.querySelectorAll('[data-wishlist-count]').forEach((badge) => {
          badge.textContent = String(count);
          badge.hidden = count === 0;
        });
      } catch {}
    }
  }

  customElements.define('atelier-header', AtelierHeader);
}
