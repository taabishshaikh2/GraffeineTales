const fs = require('fs');
const path = require('path');

const themeDir = 'D:\\Work\\GraffeineTales\\GraffeineTalesTheme';

// 1. Read files
let headerCss = fs.readFileSync(path.join(themeDir, 'assets/atelier-header.css'), 'utf8');
let headerLiquid = fs.readFileSync(path.join(themeDir, 'sections/atelier-header.liquid'), 'utf8');
let headerJs = fs.readFileSync(path.join(themeDir, 'assets/atelier-header.js'), 'utf8');
let colBannerCss = fs.readFileSync(path.join(themeDir, 'assets/atelier-collection-banner.css'), 'utf8');
let colBannerLiquid = fs.readFileSync(path.join(themeDir, 'sections/atelier-collection-banner.liquid'), 'utf8');

// 2. Enhance headerCss
headerCss = headerCss.replace(/\.layout--two-rows/g, '.layout--two-rows, .layout--two_rows');
headerCss = headerCss.replace(/\.layout--logo-center/g, '.layout--logo-center, .layout--logo_center');
headerCss = headerCss.replace(/\.layout--logo-left/g, '.layout--logo-left, .layout--logo_left');

const strictHeaderPrefix = `
/* ==========================================================================
   Graffeine Tales - Universal Header Core Styles
   Guarantees zero FOUC, no bullet points, correct flex/grid layout and floating pill
   ========================================================================== */
.atelier-header-section {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 40 !important;
  pointer-events: none !important;
  margin-bottom: calc(-1 * var(--header-pill-height, 108px)) !important;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

atelier-header {
  display: block !important;
  width: 100% !important;
  pointer-events: none !important;
  font-family: 'Inter', -apple-system, sans-serif !important;
  color: var(--header-text, #363638) !important;
}

atelier-header, atelier-header * {
  box-sizing: border-box !important;
}

atelier-header a {
  color: inherit !important;
  text-decoration: none !important;
}

atelier-header button {
  font: inherit !important;
  color: inherit !important;
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
}

atelier-header ul,
atelier-header li,
.atelier-header__nav-list,
.atelier-header__nav-list li {
  list-style: none !important;
  list-style-type: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.atelier-header__bar {
  pointer-events: none !important;
  position: relative !important;
  max-width: calc(1400px + var(--gap-side, 24px) * 2) !important;
  margin-inline: auto !important;
  padding: var(--gap-top, 14px) var(--gap-side, 24px) 0 !important;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.atelier-header__pill {
  pointer-events: auto !important;
  position: relative !important;
  isolation: isolate !important;
  border-radius: var(--header-radius, 18px) !important;
  padding: 8px 24px !important;
  min-height: 60px !important;
  background: var(--header-glass, rgba(248, 245, 237, 0.78)) !important;
  -webkit-backdrop-filter: blur(var(--header-blur, 20px)) saturate(160%) !important;
  backdrop-filter: blur(var(--header-blur, 20px)) saturate(160%) !important;
  border: 1px solid var(--header-border, rgba(198, 181, 142, 0.35)) !important;
  box-shadow: 0 12px 36px -12px rgba(54, 54, 56, 0.12), 0 2px 8px -2px rgba(54, 54, 56, 0.04) !important;
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease !important;
}

/* Two-rows layout explicit rules */
.layout--two-rows .atelier-header__pill,
.layout--two_rows .atelier-header__pill {
  display: grid !important;
  grid-template-columns: 1fr auto 1fr !important;
  grid-template-areas: "left center right" "nav nav nav" !important;
  align-items: center !important;
  padding-top: 10px !important;
  padding-bottom: 8px !important;
}

.layout--two-rows .atelier-header__left,
.layout--two_rows .atelier-header__left {
  grid-area: left !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  min-width: 0 !important;
}

.layout--two-rows .atelier-header__center,
.layout--two_rows .atelier-header__center {
  grid-area: center !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.layout--two-rows .atelier-header__right,
.layout--two_rows .atelier-header__right {
  grid-area: right !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 8px !important;
}

.layout--two-rows .atelier-header__nav,
.layout--two_rows .atelier-header__nav {
  grid-area: nav !important;
  display: flex !important;
  justify-content: center !important;
  margin-top: 8px !important;
  padding-top: 8px !important;
  border-top: 1px solid var(--header-line, rgba(54, 54, 56, 0.08)) !important;
  width: 100% !important;
}

.layout--two-rows .atelier-header__nav-list,
.layout--two_rows .atelier-header__nav-list {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-wrap: wrap !important;
  gap: 4px 16px !important;
  list-style: none !important;
  width: 100% !important;
}

/* Fallback padding for pages that don't have a hero banner */
body:not(.template-index):not(.template-collection) #MainContent > .shopify-section:first-child:not(:has(.atelier-col-hero)):not(:has(.atelier-hero)):not(:has(.image-banner)):not(:has(.slideshow)) {
  padding-top: calc(var(--header-height, 120px) + 24px) !important;
}
`;

headerCss = strictHeaderPrefix + '\n' + headerCss;
fs.writeFileSync(path.join(themeDir, 'assets/atelier-header.css'), headerCss, 'utf8');
console.log('Saved assets/atelier-header.css');

// 3. Update sections/atelier-header.liquid:
// Replace <atelier-header class="layout--{{ s.layout }}"
headerLiquid = headerLiquid.replace(
  '<atelier-header\n    class="layout--{{ s.layout }}"',
  '<atelier-header\n    class="layout--{{ s.layout }} layout--{{ s.layout | replace: \'_\', \'-\' }}"'
);

// Embed the CSS directly in {%- style -%} inside atelier-header.liquid
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

${headerCss}
{%- endstyle -%}`;

headerLiquid = headerLiquid.replace(stylePattern, newStyleBlock);
fs.writeFileSync(path.join(themeDir, 'sections/atelier-header.liquid'), headerLiquid, 'utf8');
console.log('Saved sections/atelier-header.liquid with embedded styles');

// 4. Update assets/atelier-header.js measure() method
const oldMeasurePattern = /measure\(\)\s*{[\s\S]*?this\.section\.style\.marginBottom = '';[\s\S]*?}/;
const newMeasureMethod = `measure() {
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
    }`;

headerJs = headerJs.replace(oldMeasurePattern, newMeasureMethod);
fs.writeFileSync(path.join(themeDir, 'assets/atelier-header.js'), headerJs, 'utf8');
console.log('Saved assets/atelier-header.js with enhanced measure()');

// 5. Update collection banner CSS to have proper padding for floating header
if (!colBannerCss.includes('calc(var(--header-height, 120px) + 24px)')) {
  colBannerCss = colBannerCss.replace(
    /padding:\s*56px\s*24px\s*64px;/,
    'padding: calc(var(--header-height, 120px) + 24px) 24px 64px !important;'
  );
  colBannerCss = colBannerCss.replace(
    /padding:\s*40px\s*20px\s*44px;/,
    'padding: calc(var(--header-height, 120px) + 16px) 20px 44px !important;'
  );
  fs.writeFileSync(path.join(themeDir, 'assets/atelier-collection-banner.css'), colBannerCss, 'utf8');
  console.log('Saved assets/atelier-collection-banner.css with floating header clearance');
}

// 6. Embed collection banner CSS in sections/atelier-collection-banner.liquid
const colStylePattern = /{%- style -%}[\s\S]*?{%- endstyle -%}/;
const newColStyleBlock = `{%- style -%}
  #shopify-section-{{ section.id }} {
    --hero-min-height-desktop: {{ section.settings.hero_height_desktop }}px;
    --hero-min-height-mobile: {{ section.settings.hero_height_mobile }}px;
    --hero-image-position: {{ section.settings.image_position | default: 'center center' }};
    --avatar-size-desktop: {{ section.settings.avatar_size_desktop }}px;
    --avatar-size-mobile: {{ section.settings.avatar_size_mobile }}px;
    --tab-item-width: {{ section.settings.avatar_size_desktop | plus: 20 }}px;
    --tab-item-width-mobile: {{ section.settings.avatar_size_mobile | plus: 16 }}px;
  }

  #shopify-section-{{ section.id }} .atelier-col-hero__overlay {
    opacity: {{ section.settings.overlay_opacity | divided_by: 100.0 }};
  }

${colBannerCss}
{%- endstyle -%}`;

colBannerLiquid = colBannerLiquid.replace(colStylePattern, newColStyleBlock);
fs.writeFileSync(path.join(themeDir, 'sections/atelier-collection-banner.liquid'), colBannerLiquid, 'utf8');
console.log('Saved sections/atelier-collection-banner.liquid with embedded styles');

console.log('ALL UPDATES COMPLETE!');
