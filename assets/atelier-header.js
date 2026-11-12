/**
 * Graffeine Tales — Premium Glass Header & UrbanDeco Mobile Drawer
 * Unified Architecture with responsive layout switching and real frosted glassmorphism
 */
window.gtCloseMobileDrawer = function() {
  const hdr = document.querySelector('atelier-header');
  if (hdr && typeof hdr.closeMobileDrawer === 'function') {
    hdr.closeMobileDrawer();
  } else {
    const drawer = document.getElementById('atelier-mobile-drawer');
    const scrim = document.querySelector('.atelier-scrim, [data-scrim]');
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (scrim) {
      scrim.classList.remove('is-visible');
    }
    document.body.style.overflow = '';
    document.documentElement.classList.remove('atelier-drawer-open');
    document.body.classList.remove('atelier-drawer-open');
  }
};
window.gtOpenMobileDrawer = function() {
  const hdr = document.querySelector('atelier-header');
  if (hdr && typeof hdr.openMobileDrawer === 'function') {
    hdr.openMobileDrawer();
  } else {
    const drawer = document.getElementById('atelier-mobile-drawer');
    const scrim = document.querySelector('.atelier-scrim, [data-scrim]');
    if (drawer) {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (scrim) {
      scrim.classList.add('is-visible');
    }
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('atelier-drawer-open');
    document.body.classList.add('atelier-drawer-open');
  }
};
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
      this.drawer = document.getElementById('atelier-mobile-drawer') || this.querySelector('[data-mobile-drawer]');
      this.scrim = document.querySelector('[data-scrim], .atelier-scrim');
      this.lastScrollY = window.scrollY;
      this.openMega = null;
      this.hideOnScroll = this.dataset.hideOnScroll === 'true';
      this._drawerOpen = false;

      // 1. Measure and set CSS variables & negative margin
      this.measure();
      window.addEventListener('resize', () => this.measure(), { passive: true });

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
            if (this.openMega === btn) this.closeMega();
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
            this.closeMega();
          } else {
            this.showMega(btn, panel);
          }
        });
      });

      // 4. Search Interactions
      this.querySelectorAll('[data-open-search]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleSearch();
        });
      });

      this.querySelectorAll('[data-close-search]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeSearch();
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

      // 5. Mobile Drawer Open Trigger
      this.querySelectorAll('[data-open-drawer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.openMobileDrawer();
        });
      });

      // 6. Mobile Drawer Close Triggers (dedicated button & scrim only)
      this.querySelectorAll('[data-close-drawer]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeMobileDrawer();
        });
      });

      if (this.scrim) {
        this.scrim.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.closeMobileDrawer();
          this.closeMega();
          this.closeSearch();
        });
      }

      // 7. Drawer Accordion Sub-Menus — Expanding NEVER Closes Drawer!
      this.setupDrawerAccordions();

      // 8. Smart drawer listener: handle close buttons and stop other bubbling
      const drawerEl = this.drawer || document.getElementById('atelier-mobile-drawer');
      if (drawerEl) {
        drawerEl.querySelectorAll('[data-close-drawer], .atelier-drawer__close').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.gtCloseMobileDrawer();
          });
        });
        drawerEl.addEventListener('click', (e) => {
          const closeBtn = e.target.closest('[data-close-drawer], .atelier-drawer__close');
          if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();
            window.gtCloseMobileDrawer();
            return;
          }
          // Do not close drawer on internal clicks
          e.stopPropagation();
        });
      }

      // 9. Escape Key listener
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this._drawerOpen) {
            this.closeMobileDrawer();
          } else {
            this.closeMega();
            this.closeSearch();
          }
        }
      });

      // 10. Outside click listener (closes desktop menus, never the drawer)
      document.addEventListener('click', (e) => {
        if (this._drawerOpen) return;
        if (!this.contains(e.target)) {
          this.closeMega();
          this.closeSearch();
        }
      });

      // 11. Wishlist Integration
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

      // 12. Cart Drawer Integration
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

      // 13. Observe Cart Drawer to hide WhatsApp widget when cart drawer opens
      const cartDrawerEl = document.querySelector('cart-drawer');
      if (cartDrawerEl) {
        const cartObserver = new MutationObserver(() => {
          const isCartOpen = cartDrawerEl.classList.contains('active') || cartDrawerEl.hasAttribute('open');
          document.documentElement.classList.toggle('cart-drawer-open', isCartOpen);
          document.body.classList.toggle('cart-drawer-open', isCartOpen);
        });
        cartObserver.observe(cartDrawerEl, { attributes: true, attributeFilter: ['class', 'open'] });
      }

    }

    setupDrawerAccordions() {
      const drawer = this.drawer || document.getElementById('atelier-mobile-drawer');
      if (!drawer) return;

      drawer.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
        if (trigger.__gtBound) return;
        trigger.__gtBound = true;
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const item = trigger.closest('[data-drawer-accordion], .atelier-drawer__accordion-item, details');
          if (!item) return;

          const isAlreadyOpen = item.classList.contains('is-open');

          // Smoothly close any other open accordions
          drawer.querySelectorAll('[data-drawer-accordion], .atelier-drawer__accordion-item, details').forEach((other) => {
            if (other !== item && (other.classList.contains('is-open') || other.hasAttribute('open'))) {
              other.classList.remove('is-open');
              setTimeout(() => {
                if (!other.classList.contains('is-open')) {
                  other.removeAttribute('open');
                }
              }, 360);
            }
          });

          if (isAlreadyOpen) {
            item.classList.remove('is-open');
            setTimeout(() => {
              if (!item.classList.contains('is-open')) {
                item.removeAttribute('open');
              }
            }, 360);
          } else {
            item.setAttribute('open', '');
            void item.offsetHeight;
            requestAnimationFrame(() => {
              item.classList.add('is-open');
            });
          }
        });
      });
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

      const isOverlayPage = document.body.classList.contains('template-index')
        || document.body.classList.contains('template-collection')
        || (document.body.className && document.body.className.indexOf('template-collection') !== -1);

      if (isOverlayPage) {
        this.section.style.marginBottom = '-' + pillH + 'px';
      } else {
        this.section.style.marginBottom = '0px';
      }

      if (mainFirst) {
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
      this.closeMega();
      panel.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      this.openMega = btn;
      const scrim = this.scrim || document.querySelector('.atelier-scrim');
      if (scrim) scrim.classList.add('is-visible');
    }

    closeMega() {
      this.querySelectorAll('[data-mega-panel].is-open').forEach((p) => p.classList.remove('is-open'));
      this.querySelectorAll('[data-mega-trigger][aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      this.openMega = null;
      if (!this._drawerOpen) {
        const scrim = this.scrim || document.querySelector('.atelier-scrim');
        if (scrim) scrim.classList.remove('is-visible');
      }
    }

    toggleSearch() {
      if (!this.searchPanel) return;
      if (this.searchPanel.classList.contains('is-open')) {
        this.closeSearch();
      } else {
        this.closeMega();
        this.searchPanel.classList.add('is-open');
        const scrim = this.scrim || document.querySelector('.atelier-scrim');
        if (scrim && !this._drawerOpen) scrim.classList.add('is-visible');
        if (this.searchInput) {
          setTimeout(() => this.searchInput.focus(), 60);
        }
      }
    }

    closeSearch() {
      if (this.searchPanel) this.searchPanel.classList.remove('is-open');
      if (!this._drawerOpen) {
        const scrim = this.scrim || document.querySelector('.atelier-scrim');
        if (scrim) scrim.classList.remove('is-visible');
      }
    }

    openMobileDrawer() {
      this.drawer = this.drawer || document.getElementById('atelier-mobile-drawer');
      this.scrim = this.scrim || document.querySelector('.atelier-scrim, [data-scrim]');
      if (this.drawer) {
        this.drawer.classList.add('is-open');
        this.drawer.setAttribute('aria-hidden', 'false');
        this.setupDrawerAccordions();
        this.drawer.querySelectorAll('[data-close-drawer], .atelier-drawer__close').forEach((btn) => {
          if (!btn.__boundClose) {
            btn.__boundClose = true;
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              window.gtCloseMobileDrawer();
            });
          }
        });
      }
      if (this.scrim) {
        this.scrim.classList.add('is-visible');
      }
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('atelier-drawer-open');
      document.body.classList.add('atelier-drawer-open');
      this._drawerOpen = true;

      // Ensure any floating WhatsApp widget is hidden
      document.querySelectorAll('.atelier-whatsapp-wrapper, [class*="whatsapp"]:not(.atelier-drawer *):not(.atelier-header *)').forEach((w) => {
        w.style.setProperty('display', 'none', 'important');
      });
    }

    closeMobileDrawer() {
      const drawer = this.drawer || document.getElementById('atelier-mobile-drawer');
      const scrim = this.scrim || document.querySelector('.atelier-scrim');
      if (drawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
      }
      if (scrim) {
        scrim.classList.remove('is-visible');
      }
      document.body.style.overflow = '';
      document.documentElement.classList.remove('atelier-drawer-open');
      document.body.classList.remove('atelier-drawer-open');
      this._drawerOpen = false;

      // Restore floating WhatsApp widget
      document.querySelectorAll('.atelier-whatsapp-wrapper, [class*="whatsapp"]:not(.atelier-drawer *):not(.atelier-header *)').forEach((w) => {
        w.style.removeProperty('display');
      });
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

  // Bulletproof delegated interactions for mobile drawer, accordions & outside click closing
  document.addEventListener('click', (e) => {
    // 1. Accordion trigger click inside mobile drawer
    const accordionTrigger = e.target.closest('#atelier-mobile-drawer [data-accordion-trigger]');
    if (accordionTrigger) {
      e.preventDefault();
      e.stopPropagation();
      const item = accordionTrigger.closest('[data-drawer-accordion], .atelier-drawer__accordion-item, details');
      if (item) {
        const isAlreadyOpen = item.classList.contains('is-open');
        const drawer = document.getElementById('atelier-mobile-drawer');
        if (drawer) {
          drawer.querySelectorAll('[data-drawer-accordion], .atelier-drawer__accordion-item, details').forEach((other) => {
            if (other !== item && (other.classList.contains('is-open') || other.hasAttribute('open'))) {
              other.classList.remove('is-open');
              setTimeout(() => {
                if (!other.classList.contains('is-open')) {
                  other.removeAttribute('open');
                }
              }, 360);
            }
          });
        }
        if (isAlreadyOpen) {
          item.classList.remove('is-open');
          setTimeout(() => {
            if (!item.classList.contains('is-open')) {
              item.removeAttribute('open');
            }
          }, 360);
        } else {
          item.setAttribute('open', '');
          void item.offsetHeight;
          requestAnimationFrame(() => {
            item.classList.add('is-open');
          });
        }
      }
      return;
    }

    // 2. Open drawer button
    const openBtn = e.target.closest('[data-open-drawer], .atelier-btn--menu');
    if (openBtn) {
      e.preventDefault();
      e.stopPropagation();
      const hdr = document.querySelector('atelier-header');
      if (hdr && typeof hdr.openMobileDrawer === 'function') {
        hdr.openMobileDrawer();
      } else if (typeof window.gtOpenMobileDrawer === 'function') {
        window.gtOpenMobileDrawer();
      }
      return;
    }

    // 3. Close drawer button (X button)
    const closeBtn = e.target.closest('#atelier-mobile-drawer [data-close-drawer], .atelier-drawer__close');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      window.gtCloseMobileDrawer();
      return;
    }

    // 4. Scrim / Backdrop click
    const scrim = e.target.closest('.atelier-scrim, [data-scrim]');
    if (scrim) {
      e.preventDefault();
      e.stopPropagation();
      window.gtCloseMobileDrawer();
      const hdr = document.querySelector('atelier-header');
      if (hdr) {
        if (typeof hdr.closeMega === 'function') hdr.closeMega();
        if (typeof hdr.closeSearch === 'function') hdr.closeSearch();
      }
      return;
    }

    // 5. OUTSIDE DRAWER CLICK: If mobile drawer is open and click was outside #atelier-mobile-drawer, CLOSE IT!
    const drawer = document.getElementById('atelier-mobile-drawer');
    const isDrawerOpen = drawer && (
      drawer.classList.contains('is-open') ||
      document.documentElement.classList.contains('atelier-drawer-open') ||
      document.body.classList.contains('atelier-drawer-open')
    );
    if (isDrawerOpen) {
      const insideDrawer = e.target.closest('#atelier-mobile-drawer');
      if (!insideDrawer && !openBtn) {
        e.preventDefault();
        e.stopPropagation();
        window.gtCloseMobileDrawer();
        return;
      }
    }

    // 6. Clicks inside drawer never bubble out
    if (e.target.closest('#atelier-mobile-drawer')) {
      e.stopPropagation();
    }
  });

  // Also bind touchstart / pointerdown on scrim for instant mobile dismissal
  document.addEventListener('pointerdown', (e) => {
    const scrim = e.target.closest('.atelier-scrim, [data-scrim]');
    if (scrim && (document.documentElement.classList.contains('atelier-drawer-open') || document.querySelector('#atelier-mobile-drawer.is-open'))) {
      e.preventDefault();
      e.stopPropagation();
      window.gtCloseMobileDrawer();
    }
  });

  customElements.define('atelier-header', AtelierHeader);
}
