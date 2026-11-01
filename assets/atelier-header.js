/**
 * Graffeine Tales — Premium Glass Header Web Component
 * Unified Architecture with responsive layout switching and real frosted glassmorphism
 */
if (!customElements.get('atelier-header')) {
  class AtelierHeader extends HTMLElement {
    connectedCallback() {
      if (this.__initialized) return;
      this.__initialized = true;

      this.section = this.closest('.shopify-section') || this.parentElement;
      this.bar = this.querySelector('.atelier-header__bar');
      this.pill = this.querySelector('.atelier-header__pill');
      this.megaPanels = this.querySelectorAll('[data-mega-panel]');
      this.searchPanel = this.querySelector('[data-search-panel]');
      this.searchInput = this.querySelector('[data-search-input]');
      this.searchResults = this.querySelector('[data-search-results]');
      this.searchIdle = this.querySelector('[data-search-idle]');
      this.drawer = this.querySelector('[data-mobile-drawer]');
      this.scrim = this.querySelector('[data-scrim]');
      this.lastScrollY = window.scrollY;
      this.openMega = null;
      this.hideOnScroll = this.dataset.hideOnScroll === 'true';

      // 1. Measure and set CSS variables & negative margin
      this.measure();
      window.addEventListener('resize', () => this.measure(), { passive: true });

      // Shopify Editor Section Listeners
      document.addEventListener('shopify:section:load', (e) => {
        if (e.target.contains(this) || e.target === this.section) this.measure();
      });
      document.addEventListener('shopify:section:select', (e) => {
        if (e.target.contains(this) || e.target === this.section) this.measure();
      });

      // 2. Scroll listener
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
          this.enterTimer = setTimeout(() => this.showMega(btn, panel), this.openMega ? 0 : 80);
        };

        const close = () => {
          if (window.innerWidth < 990) return;
          clearTimeout(this.enterTimer);
          this.leaveTimer = setTimeout(() => {
            if (this.openMega === btn) this.closeAll();
          }, 180);
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

      this.querySelectorAll('[data-close-search]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeAll();
        });
      });

      if (this.searchInput) {
        this.searchInput.addEventListener('input', () => {
          clearTimeout(this.searchTimer);
          this.searchTimer = setTimeout(() => this.suggest(this.searchInput.value.trim()), 240);
        });
      }

      this.querySelectorAll('[data-search-chip]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (this.searchInput) {
            this.searchInput.value = btn.dataset.searchChip;
            this.suggest(btn.dataset.searchChip);
          }
        });
      });

      // 5. Mobile Drawer
      this.querySelectorAll('[data-open-drawer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.openMobileDrawer();
        });
      });

      this.querySelectorAll('[data-close-drawer], [data-scrim]').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeAll();
        });
      });

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

      // Check if current page begins with a banner
      const mainFirst = document.querySelector('#MainContent > .shopify-section:first-child');
      const isBanner = mainFirst && (
        mainFirst.querySelector('.atelier-col-hero, .atelier-hero, .image-banner, .slideshow, .hero-carousel, [data-hero-banner]')
        || document.body.classList.contains('template-index')
        || document.body.classList.contains('template-collection')
      );

      // Negative margin pulls subsequent banner directly behind the header!
      this.section.style.marginBottom = '-' + pillH + 'px';

      if (!isBanner && mainFirst) {
        mainFirst.style.paddingTop = (totalH + 20) + 'px';
      } else if (mainFirst) {
        mainFirst.style.paddingTop = '';
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

    suggest(query) {
      if (!this.searchResults || !this.searchIdle) return;
      if (!query || query.length < 2) {
        this.searchResults.style.display = 'none';
        this.searchIdle.style.display = 'block';
        return;
      }

      fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6`)
        .then((res) => res.json())
        .then((data) => {
          const products = data.resources && data.resources.results && data.resources.results.products;
          if (!products || products.length === 0) {
            this.searchResults.innerHTML = '<p style="padding: 18px 0; color: #888; text-align: center;">No matching products found.</p>';
            this.searchResults.style.display = 'block';
            this.searchIdle.style.display = 'none';
            return;
          }

          let html = '<ul style="list-style: none; margin: 16px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px;">';
          products.forEach((p) => {
            html += `
              <li>
                <a href="${p.url}" style="display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 14px; padding: 8px; border-radius: 8px; transition: background 0.2s;">
                  <img src="${p.image || ''}" width="48" height="48" style="object-fit: cover; border-radius: 6px; background: #f0f0f0;" alt="">
                  <div>
                    <span style="display: block; font-size: 14px; font-weight: 600; color: #363638;">${p.title}</span>
                    <span style="font-size: 13px; color: #4D351D;">${p.price}</span>
                  </div>
                  <span style="font-size: 12px; color: #999;">&rarr;</span>
                </a>
              </li>
            `;
          });
          html += '</ul>';
          html += `<a href="/search?q=${encodeURIComponent(query)}&type=product" style="display: block; text-align: center; margin-top: 16px; padding: 10px; background: #363638; color: #fff; border-radius: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase;">View all results &rarr;</a>`;

          this.searchResults.innerHTML = html;
          this.searchResults.style.display = 'block';
          this.searchIdle.style.display = 'none';
        })
        .catch(() => {});
    }

        openMobileDrawer() {
      this.closeAll();
      const drawer = document.getElementById('atelier-mobile-drawer') || this.querySelector('[data-mobile-drawer]');
      const scrim = document.querySelector('[data-scrim], .atelier-scrim') || this.querySelector('[data-scrim]');
      if (drawer) {
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
      }
      if (scrim) {
        scrim.classList.add('is-visible');
      }
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('atelier-drawer-open');
    }

    closeAll() {
      this.querySelectorAll('[data-mega-panel].is-open').forEach((p) => p.classList.remove('is-open'));
      this.querySelectorAll('[data-mega-trigger][aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      if (this.searchPanel) this.searchPanel.classList.remove('is-open');
      const drawer = document.getElementById('atelier-mobile-drawer') || this.querySelector('[data-mobile-drawer]');
      const scrim = document.querySelector('[data-scrim], .atelier-scrim') || this.querySelector('[data-scrim]');
      if (drawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
      }
      if (scrim) {
        scrim.classList.remove('is-visible');
      }
      document.body.style.overflow = '';
      document.documentElement.classList.remove('atelier-drawer-open');
      this.openMega = null;
    }

    updateWishlistCount() {
      try {
        const items = JSON.parse(localStorage.getItem('graffeine-wishlist') || '[]');
        const count = Array.isArray(items) ? items.length : 0;
        this.querySelectorAll('[data-wishlist-count]').forEach((badge) => {
          badge.textContent = count;
          badge.hidden = count === 0;
        });
      } catch (e) {}
    }

    renderRecentSearches() {
      try {
        const wrap = this.querySelector('[data-recent-searches-wrap]');
        const list = this.querySelector('[data-recent-searches-list]');
        if (!wrap || !list) return;
        const recents = JSON.parse(localStorage.getItem('gt_recent_searches') || '[]');
        if (!Array.isArray(recents) || recents.length === 0) {
          wrap.style.display = 'none';
          return;
        }
        wrap.style.display = 'block';
        list.innerHTML = recents.slice(0, 5).map((t) => `<button type="button" class="atelier-search-chip" data-search-chip="${t}">${t}</button>`).join('');
      } catch (e) {}
    }
  }

  // Global fallback listener for hamburger buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-drawer]');
    if (btn) {
      e.preventDefault();
      const hdr = document.querySelector('atelier-header');
      if (hdr && typeof hdr.openMobileDrawer === 'function') {
        hdr.openMobileDrawer();
      }
    }
  });

  customElements.define('atelier-header', AtelierHeader);
}
