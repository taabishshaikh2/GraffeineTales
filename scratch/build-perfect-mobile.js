const fs = require('fs');
const path = require('path');

const themeDir = 'D:\\Work\\GraffeineTales\\GraffeineTalesTheme';

// 1. Read existing files
let headerLiquid = fs.readFileSync(path.join(themeDir, 'sections/atelier-header.liquid'), 'utf8');

// 2. Build the updated mobile CSS
const mobileCss = `
/* ==========================================================================
   MOBILE HEADER (Image 2 reference)
   2 - 1 - 2 Symmetrical Floating Frosted Pill
   Left: [ ≡ ] [ 🔍 ] | Center: Logo + Cup | Right: [ ♡ ] [ 🛍️ ]
   ========================================================================== */
@media screen and (max-width: 989px) {
  .atelier-header__bar {
    padding: var(--gap-top-mobile, 10px) var(--gap-side-mobile, 12px) 0 !important;
  }
  .atelier-header__pill {
    display: grid !important;
    grid-template-columns: 1fr auto 1fr !important;
    grid-template-areas: "left center right" !important;
    min-height: 52px !important;
    padding: 0 10px !important;
    align-items: center !important;
    border-radius: var(--header-radius, 20px) !important;
  }

  /* LEFT ZONE: Burger + Search Icon Button side-by-side */
  .atelier-header__left {
    grid-area: left !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 2px !important;
    min-width: 0 !important;
  }
  .atelier-burger {
    display: grid !important;
    place-items: center !important;
    width: 38px !important;
    height: 38px !important;
    padding: 0 !important;
    cursor: pointer !important;
  }
  .atelier-burger svg {
    width: 22px !important;
    height: 22px !important;
  }

  /* In mobile, .atelier-search-pill becomes a round 38x38 search icon button */
  .atelier-search-pill {
    display: grid !important;
    place-items: center !important;
    flex: 0 0 auto !important;
    width: 38px !important;
    height: 38px !important;
    padding: 0 !important;
    gap: 0 !important;
    border: 0 !important;
    border-radius: 50% !important;
    background: transparent !important;
    cursor: pointer !important;
  }
  .atelier-search-pill span {
    display: none !important;
  }
  .atelier-search-pill svg {
    width: 20px !important;
    height: 20px !important;
  }
  .atelier-header__nav {
    display: none !important;
  }

  /* CENTER ZONE: Centered Logo */
  .atelier-header__center {
    grid-area: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 0 !important;
    padding: 0 6px !important;
  }
  .atelier-logo {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
  }
  .atelier-logo img {
    max-width: var(--logo-width-mobile, 105px) !important;
    width: var(--logo-width-mobile, 105px) !important;
    height: auto !important;
  }
  .atelier-logo__text {
    font-family: 'DM Serif Display', Georgia, serif !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    letter-spacing: 0.12em !important;
    white-space: nowrap !important;
  }
  .atelier-cup {
    width: 18px !important;
    height: 26px !important;
  }

  /* RIGHT ZONE: Wishlist + Cart icons */
  .atelier-header__right {
    grid-area: right !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 2px !important;
  }
  .atelier-header__right .atelier-search-icon {
    display: none !important;
  }
  .atelier-desk-only {
    display: none !important;
  }
  .atelier-header__right .atelier-icon-btn {
    width: 38px !important;
    height: 38px !important;
  }
  .atelier-header__right .atelier-icon-btn svg {
    width: 20px !important;
    height: 20px !important;
  }
}

@media screen and (min-width: 990px) {
  .atelier-burger {
    display: none !important;
  }
}

/* ==========================================================================
   MOBILE DRAWER & PHOTO TILES (Image 3 reference)
   ========================================================================== */
.atelier-scrim {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(28, 24, 20, 0.45) !important;
  -webkit-backdrop-filter: blur(4px) !important;
  backdrop-filter: blur(4px) !important;
  z-index: 999 !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity 0.35s ease !important;
}
.atelier-scrim.is-visible {
  opacity: 1 !important;
  pointer-events: auto !important;
}

.atelier-drawer {
  position: fixed !important;
  top: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  width: min(92vw, 420px) !important;
  background: #FDFBF7 !important;
  z-index: 1000 !important;
  box-shadow: 24px 0 60px -20px rgba(28, 27, 25, 0.45) !important;
  border-radius: 0 24px 24px 0 !important;
  transform: translateX(-104%) !important;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  display: flex !important;
  flex-direction: column !important;
  pointer-events: auto !important;
  overflow: hidden !important;
}
.atelier-drawer.is-open {
  transform: translateX(0) !important;
}

.atelier-drawer__head {
  padding: 16px 20px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  border-bottom: 1px solid rgba(54, 54, 56, 0.08) !important;
  background: #F8F5ED !important;
}
.atelier-drawer__close {
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  background: #FFFFFF !important;
  border: 1px solid rgba(54, 54, 56, 0.1) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06) !important;
  display: grid !important;
  place-items: center !important;
  cursor: pointer !important;
  color: #363638 !important;
  transition: transform 0.2s ease, background 0.2s ease !important;
}
.atelier-drawer__close:hover {
  transform: scale(1.05) !important;
  background: #F8F5ED !important;
}
.atelier-drawer__close svg {
  width: 16px !important;
  height: 16px !important;
}

.atelier-drawer__body {
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 16px 18px 30px !important;
  -webkit-overflow-scrolling: touch !important;
}

/* Search input in drawer */
.atelier-drawer__search {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  height: 44px !important;
  margin-bottom: 14px !important;
  padding: 0 16px !important;
  border-radius: 999px !important;
  background: #FFFFFF !important;
  border: 1px solid rgba(54, 54, 56, 0.12) !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04) !important;
}
.atelier-drawer__search svg {
  width: 17px !important;
  height: 17px !important;
  color: rgba(54, 54, 56, 0.6) !important;
  flex-shrink: 0 !important;
}
.atelier-drawer__search input {
  flex: 1 !important;
  border: none !important;
  background: transparent !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 13.5px !important;
  color: #363638 !important;
  outline: none !important;
}

/* Promo Card in drawer */
.atelier-drawer__promo-banner {
  display: block !important;
  margin-bottom: 18px !important;
  padding: 16px 18px !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #4D351D 0%, #362514 100%) !important;
  color: #FFFFFF !important;
  text-decoration: none !important;
  box-shadow: 0 8px 20px -8px rgba(77, 53, 29, 0.35) !important;
  transition: transform 0.2s ease !important;
}
.atelier-drawer__promo-banner:hover {
  transform: translateY(-2px) !important;
}
.atelier-drawer__promo-h {
  display: block !important;
  font-family: 'DM Serif Display', Georgia, serif !important;
  font-size: 17px !important;
  font-weight: 600 !important;
  color: #FFFFFF !important;
  line-height: 1.3 !important;
}
.atelier-drawer__promo-cta {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin-top: 6px !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #E9DFC2 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
}

/* 2-Column Photo Tiles Grid */
.atelier-drawer__tiles-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 10px !important;
  margin-bottom: 18px !important;
}
.atelier-photo-tile {
  position: relative !important;
  aspect-ratio: 1 !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  background: #E9DFC2 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-end !important;
  padding: 12px !important;
  text-decoration: none !important;
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.12) !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
}
.atelier-photo-tile:hover {
  transform: scale(1.02) !important;
  box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.18) !important;
}
.atelier-photo-tile__img {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
}
.atelier-photo-tile__img img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  transition: transform 0.4s ease !important;
}
.atelier-photo-tile:hover .atelier-photo-tile__img img {
  transform: scale(1.08) !important;
}
.atelier-photo-tile__placeholder {
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(135deg, #4D351D 0%, #C6B58E 100%) !important;
}
.atelier-photo-tile__scrim {
  position: absolute !important;
  inset: 0 !important;
  z-index: 2 !important;
  background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.85) 100%) !important;
  pointer-events: none !important;
}
.atelier-photo-tile__info {
  position: relative !important;
  z-index: 3 !important;
  color: #FFFFFF !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
}
.atelier-photo-tile__title {
  font-family: 'DM Serif Display', Georgia, serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #FFFFFF !important;
  line-height: 1.25 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
}
.atelier-photo-tile__count {
  font-family: 'Inter', sans-serif !important;
  font-size: 10.5px !important;
  color: rgba(255, 255, 255, 0.85) !important;
  font-weight: 500 !important;
}

/* Text rows */
.atelier-drawer__rows {
  list-style: none !important;
  margin: 0 0 18px !important;
  padding: 0 !important;
  border-top: 1px solid rgba(54, 54, 56, 0.08) !important;
}
.atelier-drawer__row-link {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 13px 4px !important;
  border-bottom: 1px solid rgba(54, 54, 56, 0.08) !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #363638 !important;
  text-decoration: none !important;
  transition: color 0.2s ease !important;
}
.atelier-drawer__row-link svg {
  width: 14px !important;
  height: 14px !important;
  opacity: 0.5 !important;
}
.atelier-drawer__details summary {
  list-style: none !important;
  cursor: pointer !important;
}
.atelier-drawer__details summary::-webkit-details-marker {
  display: none !important;
}
.atelier-drawer__sublist {
  list-style: none !important;
  margin: 0 !important;
  padding: 4px 0 10px 14px !important;
}
.atelier-drawer__sublink {
  display: block !important;
  padding: 8px 0 !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 13px !important;
  color: rgba(54, 54, 56, 0.75) !important;
  text-decoration: none !important;
}

/* Call us & WhatsApp buttons (Image 3 reference) */
.atelier-drawer__actions {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 10px !important;
  margin-top: 10px !important;
  margin-bottom: 16px !important;
}
.atelier-drawer__btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  height: 44px !important;
  border-radius: 999px !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.atelier-drawer__btn:hover {
  transform: translateY(-1px) !important;
}
.atelier-drawer__btn--call {
  background: #FFFFFF !important;
  color: #363638 !important;
  border: 1.5px solid rgba(54, 54, 56, 0.25) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
}
.atelier-drawer__btn--call svg {
  width: 16px !important;
  height: 16px !important;
}
.atelier-drawer__btn--wa {
  background: #1E7E34 !important;
  color: #FFFFFF !important;
  border: 1.5px solid #1E7E34 !important;
  box-shadow: 0 4px 12px -2px rgba(30, 126, 52, 0.35) !important;
}

/* Footer metadata */
.atelier-drawer__meta {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 0 8px !important;
  font-size: 12px !important;
  color: rgba(54, 54, 56, 0.75) !important;
}
.atelier-drawer__login {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  color: #363638 !important;
  text-decoration: none !important;
  font-weight: 600 !important;
}
.atelier-drawer__login svg {
  width: 16px !important;
  height: 16px !important;
}
.atelier-drawer__hours {
  font-size: 11.5px !important;
  color: rgba(54, 54, 56, 0.6) !important;
}
.atelier-drawer__tagline {
  margin: 10px 0 0 !important;
  font-size: 11px !important;
  color: rgba(54, 54, 56, 0.5) !important;
  text-align: center !important;
}
`;

// Replace mobile CSS in assets/atelier-header.css
let fullCss = fs.readFileSync(path.join(themeDir, 'assets/atelier-header.css'), 'utf8');
const mobileRegex = /\/\* =+\s*Mobile \(< 990px\)[\s\S]*?\/\* Clearances for non-banner pages/m;

const replacementCss = `${mobileCss}

/* Clearances for non-banner pages`;

fullCss = fullCss.replace(mobileRegex, replacementCss);
fs.writeFileSync(path.join(themeDir, 'assets/atelier-header.css'), fullCss, 'utf8');
console.log('Saved assets/atelier-header.css with enhanced mobile styles');

// 3. Update sections/atelier-header.liquid
// Replace style block with updated fullCss
const stylePattern = /{%- style -%}[\s\S]*?{%- endstyle -%}/;
const newStyleBlock = `{%- style -%}
  #shopify-section-{{ section.id }} {
    --ann-bg: {{ s.announcement_bg }};
    --ann-color: {{ s.announcement_text_color }};
    --ann-size: {{ s.announcement_font_size }}px;
    --ann-speed: {{ s.announcement_speed }}s;

    --header-glass: {{ s.glass_color | color_modify: 'alpha', glass_alpha }};
    --header-solid: {{ s.glass_color }};
    --header-text: {{ s.text_color }};
    --header-accent: {{ s.accent_color }};
    --header-border: {{ s.border_color | color_modify: 'alpha', 0.4 }};
    --header-line: {{ s.text_color | color_modify: 'alpha', 0.1 }};
    --header-radius: {{ s.radius }}px;
    --header-blur: {{ s.blur }}px;

    --gap-top: {{ s.gap_top }}px;
    --gap-side: {{ s.gap_side }}px;
    --gap-top-mobile: {{ s.gap_top_mobile }}px;
    --gap-side-mobile: {{ s.gap_side_mobile }}px;

    --logo-width: {{ s.logo_width }}px;
    --logo-width-mobile: {{ s.logo_width_mobile }}px;

    --menu-size: {{ s.menu_font_size }}px;
    --menu-weight: {{ s.menu_font_weight }};
    --menu-transform: {{ s.menu_text_transform }};
    --menu-letter-spacing: {{ s.menu_letter_spacing | default: 1 }}px;
    --icon-size: {{ s.icon_size }}px;
  }

${fullCss}
{%- endstyle -%}`;

headerLiquid = headerLiquid.replace(stylePattern, newStyleBlock);

// 4. Update the Mobile Drawer HTML inside sections/atelier-header.liquid (matching Image 3)
const oldDrawerRegex = /{%- comment -%} =+ E\. MOBILE SLIDE-OUT DRAWER =+ {%- endcomment -%}[\s\S]*?<\/aside>/;

const newDrawerMarkup = `{%- comment -%} ==================== E. MOBILE SLIDE-OUT DRAWER (Image 3 reference) ==================== {%- endcomment -%}
  <div class="atelier-scrim" data-scrim aria-hidden="true"></div>

  <aside
    class="atelier-drawer"
    id="atelier-mobile-drawer"
    data-mobile-drawer
    role="dialog"
    aria-modal="true"
    aria-label="Mobile navigation"
    aria-hidden="true"
  >
    <!-- Top Header -->
    <div class="atelier-drawer__head">
      <div class="atelier-drawer__brand">
        {{ logo_markup }}
      </div>
      <button
        type="button"
        class="atelier-drawer__close"
        data-close-drawer
        aria-label="Close menu"
      >
        {{ icon_close }}
      </button>
    </div>

    <!-- Body Content -->
    <div class="atelier-drawer__body">
      <!-- Search Input -->
      <form class="atelier-drawer__search" action="{{ routes.search_url }}" method="get" role="search">
        {{ icon_search }}
        <input
          type="search"
          name="q"
          placeholder="{{ s.search_placeholder | default: 'Search journals, notebooks, gifts...' | escape }}"
          autocomplete="off"
          aria-label="Search"
        >
        <input type="hidden" name="type" value="product">
      </form>

      <!-- Promo Banner Card -->
      {%- if s.m_show_promo and s.promo_heading != blank -%}
        <a class="atelier-drawer__promo-banner" href="{{ s.promo_link | default: routes.all_products_collection_url }}">
          <span class="atelier-drawer__promo-h">{{ s.promo_heading | escape }}</span>
          {%- if s.promo_link_label != blank -%}
            <span class="atelier-drawer__promo-cta">{{ s.promo_link_label | escape }} &rarr;</span>
          {%- endif -%}
        </a>
      {%- endif -%}

      <!-- 2-Column Photo Tiles Grid (Image 3 reference) -->
      {%- if s.m_tiles > 0 and s.m_style != 'text' -%}
        <div class="atelier-drawer__tiles-grid">
          {%- assign tile_count = 0 -%}
          {%- assign tile_handles = ',' -%}
          {%- for link in mobile_menu -%}
            {%- if tile_count >= s.m_tiles -%}{%- break -%}{%- endif -%}
            {%- liquid
              assign tile_img = nil
              assign lt_m = link.title | downcase | strip

              # Check menu_photo blocks
              for b in section.blocks
                if b.type == 'menu_photo' and b.settings.image != blank
                  assign bt_m = b.settings.item | downcase | strip
                  if bt_m == lt_m
                    assign tile_img = b.settings.image
                    break
                  endif
                endif
              endfor

              # Check collection image
              if tile_img == nil and link.type == 'collection_link' and link.object
                if link.object.metafields.custom.collection_tab_image != blank
                  assign tile_img = link.object.metafields.custom.collection_tab_image
                elsif link.object.featured_image != blank
                  assign tile_img = link.object.featured_image
                elsif link.object.image != blank
                  assign tile_img = link.object.image
                endif
              endif

              # Check children for collection image
              if tile_img == nil
                for c in link.links
                  if c.type == 'collection_link' and c.object.featured_image != blank
                    assign tile_img = c.object.featured_image
                    break
                  endif
                endfor
              endif

              assign tile_count = tile_count | plus: 1
              assign tile_handles = tile_handles | append: forloop.index | append: ','
            -%}
            <a class="atelier-photo-tile" href="{{ link.url }}">
              <div class="atelier-photo-tile__img">
                {%- if tile_img != blank -%}
                  {{ tile_img | image_url: width: 400 | image_tag: widths: '200, 300, 400', sizes: '44vw', loading: 'lazy', alt: link.title | escape }}
                {%- else -%}
                  <div class="atelier-photo-tile__placeholder"></div>
                {%- endif -%}
              </div>
              <div class="atelier-photo-tile__scrim"></div>
              <div class="atelier-photo-tile__info">
                <span class="atelier-photo-tile__title">{{ link.title | escape }}</span>
                {%- if link.links.size > 0 -%}
                  <span class="atelier-photo-tile__count">{{ link.links.size }} categories</span>
                {%- else -%}
                  <span class="atelier-photo-tile__count">View collection</span>
                {%- endif -%}
              </div>
            </a>
          {%- endfor -%}
        </div>
      {%- endif -%}

      <!-- Remaining Menu Navigation Rows -->
      <ul class="atelier-drawer__rows" role="list">
        {%- for link in mobile_menu -%}
          {%- assign check_key = ',' | append: forloop.index | append: ',' -%}
          {%- if tile_handles contains check_key -%}{%- continue -%}{%- endif -%}
          <li>
            {%- if link.links.size > 0 -%}
              <details class="atelier-drawer__details">
                <summary class="atelier-drawer__row-link">
                  <span>{{ link.title | escape }}</span>
                  {{ icon_chev }}
                </summary>
                <ul class="atelier-drawer__sublist" role="list">
                  {%- for child in link.links -%}
                    <li>
                      <a class="atelier-drawer__sublink" href="{{ child.url }}">
                        {{ child.title | escape }}
                      </a>
                    </li>
                  {%- endfor -%}
                </ul>
              </details>
            {%- else -%}
              <a class="atelier-drawer__row-link" href="{{ link.url }}">
                <span>{{ link.title | escape }}</span>
                {{ icon_arrow }}
              </a>
            {%- endif -%}
          </li>
        {%- endfor -%}
      </ul>

      <!-- Action Buttons: Call Us & WhatsApp (Image 3 reference) -->
      {%- if s.m_show_contact -%}
        <div class="atelier-drawer__actions">
          {%- if phone_clean != blank -%}
            <a class="atelier-drawer__btn atelier-drawer__btn--call" href="tel:{{ phone_clean }}">
              {{ icon_phone }}
              <span>Call us</span>
            </a>
          {%- endif -%}
          {%- if whatsapp_clean != blank -%}
            <a class="atelier-drawer__btn atelier-drawer__btn--wa" href="https://wa.me/{{ whatsapp_clean }}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.4Z"/></svg>
              <span>WhatsApp</span>
            </a>
          {%- endif -%}
        </div>

        <div class="atelier-drawer__meta">
          {%- if shop.customer_accounts_enabled -%}
            <a class="atelier-drawer__login" href="{% if customer %}{{ routes.account_url }}{% else %}{{ routes.account_login_url }}{% endif %}">
              {{ icon_account }}
              <span>{% if customer %}My Account{% else %}Log in / Register{% endif %}</span>
            </a>
          {%- endif -%}
          {%- if s.m_hours != blank -%}
            <span class="atelier-drawer__hours">{{ s.m_hours | escape }}</span>
          {%- endif -%}
        </div>

        <p class="atelier-drawer__tagline">{{ s.tagline | default: 'Loved by thousands of storytellers across India' }}</p>
      {%- endif -%}
    </div>
  </aside>`;

// Move the drawer inside <atelier-header> before </atelier-header>
headerLiquid = headerLiquid.replace(oldDrawerRegex, '');
headerLiquid = headerLiquid.replace('</atelier-header>', `${newDrawerMarkup}\n  </atelier-header>`);

// Add menu_photo block to schema if not present
if (!headerLiquid.includes('"type": "menu_photo"')) {
  const promoBlockMatch = /{\s*"type":\s*"promo"[\s\S]*?}\s*\]/m;
  const newBlocksJson = `{
      "type": "promo",
      "name": "Mega menu promo card",
      "settings": [
        {
          "type": "text",
          "id": "menu_item",
          "label": "Navigation item title"
        },
        {
          "type": "image_picker",
          "id": "image",
          "label": "Promotional image"
        },
        {
          "type": "text",
          "id": "heading",
          "label": "Heading",
          "default": "Artisan Linen Journals"
        },
        {
          "type": "text",
          "id": "subheading",
          "label": "Subtitle / CTA",
          "default": "Discover Collection"
        },
        {
          "type": "url",
          "id": "link",
          "label": "Card link"
        }
      ]
    },
    {
      "type": "menu_photo",
      "name": "Mobile category photo tile",
      "settings": [
        {
          "type": "text",
          "id": "item",
          "label": "Menu item title",
          "info": "Exact title of the menu item (e.g. Quirky Stationary, Journals, Home Décor)"
        },
        {
          "type": "image_picker",
          "id": "image",
          "label": "Photo for mobile tile"
        }
      ]
    }
  ]`;
  headerLiquid = headerLiquid.replace(promoBlockMatch, newBlocksJson);
}

fs.writeFileSync(path.join(themeDir, 'sections/atelier-header.liquid'), headerLiquid, 'utf8');
console.log('Saved sections/atelier-header.liquid with mobile drawer inside custom element');

// 5. Update assets/atelier-header.js with rock-solid click listeners for hamburger
let headerJs = fs.readFileSync(path.join(themeDir, 'assets/atelier-header.js'), 'utf8');

// Replace openMobileDrawer and closeAll to be ultra-resilient
const oldDrawerMethods = /openMobileDrawer\(\)\s*{[\s\S]*?closeAll\(\)\s*{[\s\S]*?this\.openMega = null;\s*}/m;

const newDrawerMethods = `openMobileDrawer() {
      this.closeAll();
      const drawer = this.querySelector('[data-mobile-drawer]') || document.querySelector('[data-mobile-drawer]');
      const scrim = this.querySelector('[data-scrim]') || document.querySelector('[data-scrim]');
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
      const drawer = this.querySelector('[data-mobile-drawer]') || document.querySelector('[data-mobile-drawer]');
      const scrim = this.querySelector('[data-scrim]') || document.querySelector('[data-scrim]');
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
    }`;

headerJs = headerJs.replace(oldDrawerMethods, newDrawerMethods);

// Also make sure [data-open-drawer] is bound on document level as a fallback
if (!headerJs.includes('Global fallback listener for hamburger buttons')) {
  headerJs = headerJs.replace(
    "customElements.define('atelier-header', AtelierHeader);",
    `// Global fallback listener for hamburger buttons
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

  customElements.define('atelier-header', AtelierHeader);`
  );
}

fs.writeFileSync(path.join(themeDir, 'assets/atelier-header.js'), headerJs, 'utf8');
console.log('Saved assets/atelier-header.js with fallback drawer binding');

console.log('ALL MOBILE UPDATES COMPLETE!');
