const fs = require('fs');
const path = require('path');

const themeDir = 'D:\\Work\\GraffeineTales\\GraffeineTalesTheme';

// Read build-perfect-header.js
let script = fs.readFileSync(path.join(themeDir, 'scratch/build-perfect-header.js'), 'utf8');

// The new CSS rules for logo_left and logo_center using explicit grid-template-areas:
const oldLogoLeftRegex = /\/\* =+\s*DESKTOP LAYOUT 2: LOGO LEFT[\s\S]*?\/\* =+\s*Mobile/m;

const newLayoutsSection = `/* ==========================================================================
   DESKTOP LAYOUT 2: LOGO LEFT, MENU CENTRE (Single Line)
   Logo on Left | Menu in Center | Search Icon + Action Icons on Right
   ========================================================================== */
@media (min-width: 990px) {
  .layout--logo_left .atelier-header__pill,
  .layout--logo-left .atelier-header__pill {
    display: grid !important;
    grid-template-columns: auto minmax(0, 1fr) auto !important;
    grid-template-areas: "logo nav right" !important;
    align-items: center !important;
    min-height: 64px !important;
    padding: 0 20px !important;
    gap: 12px !important;
  }
  .layout--logo_left .atelier-header__center,
  .layout--logo-left .atelier-header__center {
    grid-area: logo !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    padding-right: 16px !important;
    flex-shrink: 0 !important;
  }
  .layout--logo_left .atelier-header__left,
  .layout--logo-left .atelier-header__left {
    grid-area: nav !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 0 !important;
    overflow: hidden !important;
  }
  .layout--logo_left .atelier-search-pill,
  .layout--logo-left .atelier-search-pill {
    display: none !important;
  }
  .layout--logo_left .atelier-burger,
  .layout--logo-left .atelier-burger {
    display: none !important;
  }
  .layout--logo_left .atelier-header__nav,
  .layout--logo-left .atelier-header__nav {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
  }
  .layout--logo_left .atelier-header__nav::-webkit-scrollbar,
  .layout--logo-left .atelier-header__nav::-webkit-scrollbar {
    display: none !important;
  }
  .layout--logo_left .atelier-header__nav-list,
  .layout--logo-left .atelier-header__nav-list {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
    gap: 2px 8px !important;
    white-space: nowrap !important;
  }
  .layout--logo_left .atelier-nav__link,
  .layout--logo-left .atelier-nav__link {
    height: 40px !important;
    padding: 0 8px !important;
    font-size: 12px !important;
    letter-spacing: 0.04em !important;
  }
  .layout--logo_left .atelier-header__right,
  .layout--logo-left .atelier-header__right {
    grid-area: right !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 4px !important;
    flex-shrink: 0 !important;
  }
  .layout--logo_left .atelier-header__right .atelier-search-icon,
  .layout--logo-left .atelier-header__right .atelier-search-icon {
    display: grid !important;
  }
}

/* ==========================================================================
   DESKTOP LAYOUT 3: MENU LEFT, LOGO CENTRE (Single Line)
   Menu on Left | Logo in Center | Search Icon + Action Icons on Right
   ========================================================================== */
@media (min-width: 990px) {
  .layout--logo_center .atelier-header__pill,
  .layout--logo-center .atelier-header__pill {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important;
    grid-template-areas: "nav logo right" !important;
    align-items: center !important;
    min-height: 64px !important;
    padding: 0 20px !important;
    gap: 12px !important;
  }
  .layout--logo_center .atelier-header__left,
  .layout--logo-center .atelier-header__left {
    grid-area: nav !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    min-width: 0 !important;
    overflow: hidden !important;
  }
  .layout--logo_center .atelier-search-pill,
  .layout--logo-center .atelier-search-pill {
    display: none !important;
  }
  .layout--logo_center .atelier-burger,
  .layout--logo-center .atelier-burger {
    display: none !important;
  }
  .layout--logo_center .atelier-header__nav,
  .layout--logo-center .atelier-header__nav {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    min-width: 0 !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
  }
  .layout--logo_center .atelier-header__nav::-webkit-scrollbar,
  .layout--logo-center .atelier-header__nav::-webkit-scrollbar {
    display: none !important;
  }
  .layout--logo_center .atelier-header__nav-list,
  .layout--logo-center .atelier-header__nav-list {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    flex-wrap: nowrap !important;
    gap: 2px 6px !important;
    white-space: nowrap !important;
  }
  .layout--logo_center .atelier-nav__link,
  .layout--logo-center .atelier-nav__link {
    height: 40px !important;
    padding: 0 6px !important;
    font-size: 11.5px !important;
    letter-spacing: 0.03em !important;
  }
  .layout--logo_center .atelier-header__center,
  .layout--logo-center .atelier-header__center {
    grid-area: logo !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 16px !important;
    flex-shrink: 0 !important;
  }
  .layout--logo_center .atelier-header__right,
  .layout--logo-center .atelier-header__right {
    grid-area: right !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 4px !important;
    flex-shrink: 0 !important;
  }
  .layout--logo_center .atelier-header__right .atelier-search-icon,
  .layout--logo-center .atelier-header__right .atelier-search-icon {
    display: grid !important;
  }
}

/* ==========================================================================
   Mobile`;

script = script.replace(oldLogoLeftRegex, newLayoutsSection);
fs.writeFileSync(path.join(themeDir, 'scratch/build-perfect-header.js'), script, 'utf8');
console.log('Updated scratch/build-perfect-header.js');
