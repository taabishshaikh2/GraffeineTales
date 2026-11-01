const fs = require('fs');
const path = require('path');

const themeDir = 'D:\\Work\\GraffeineTales\\GraffeineTalesTheme';

// 1. Update sections/header-group.json to set glass_opacity to 50 and default layout to two_rows
const headerGroupPath = path.join(themeDir, 'sections/header-group.json');
let headerGroupRaw = fs.readFileSync(headerGroupPath, 'utf8');
const commentMatch = headerGroupRaw.match(/^(\/\*[\s\S]*?\*\/\s*)/);
const commentPrefix = commentMatch ? commentMatch[1] : '';
const cleanJson = headerGroupRaw.replace(/^(\/\*[\s\S]*?\*\/\s*)/, '');
let headerGroup = JSON.parse(cleanJson);
if (headerGroup.sections && headerGroup.sections.header && headerGroup.sections.header.settings) {
  headerGroup.sections.header.settings.glass_opacity = 50;
  headerGroup.sections.header.settings.layout = 'two_rows';
  fs.writeFileSync(headerGroupPath, commentPrefix + JSON.stringify(headerGroup, null, 2) + '\n', 'utf8');
  console.log('Updated sections/header-group.json: glass_opacity=50, layout=two_rows');
}

// 2. Build the unified, rock-solid CSS for the header
const headerCss = `/* ==========================================================================
   Graffeine Tales — Premium Frosted Glassmorphic Header System
   Exact reproduction of UrbanDeco Reference Architecture & Interaction Patterns
   ========================================================================== */

:root {
  --gt-warm-paper: #F8F5ED;
  --gt-espresso: #363638;
  --gt-logo-cream: #E9DFC2;
  --gt-sand: #C6B58E;
  --gt-deep-coffee: #4D351D;
  --gt-cream-card: #FDFBF7;
}

/* ==========================================================================
   Announcement Bar (Top Strip)
   ========================================================================== */
.atelier-announcement {
  width: 100%;
  position: relative;
  z-index: 45;
  background-color: var(--ann-bg, #1E1814);
  color: var(--ann-color, #F8F5ED);
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: var(--ann-size, 12px);
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 8px 16px;
  overflow: hidden;
  pointer-events: auto;
}

.atelier-announcement__inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.atelier-announcement__content {
  flex: 1;
  text-align: center;
  overflow: hidden;
}
.atelier-announcement__content--left { text-align: left; }
.atelier-announcement__content--center { text-align: center; }
.atelier-announcement__content--right { text-align: right; }

.atelier-announcement__link {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s ease;
}
.atelier-announcement__link:hover { opacity: 0.85; }

.atelier-announcement--marquee .atelier-announcement__content {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
}
.atelier-announcement__track {
  display: inline-flex;
  white-space: nowrap;
  animation: atelierMarquee var(--ann-speed, 25s) linear infinite;
  gap: 40px;
  padding-left: 100%;
}
@keyframes atelierMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

.atelier-announcement__country {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  opacity: 0.85;
  flex-shrink: 0;
}

.atelier-announcement--desktop-only { display: block; }
.atelier-announcement--mobile-only { display: none; }
@media screen and (max-width: 767px) {
  .atelier-announcement--desktop-only { display: none; }
  .atelier-announcement--mobile-only { display: block; }
}

/* ==========================================================================
   Section & Floating Pill Container
   ========================================================================== */
.atelier-header-section {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 40 !important;
  width: 100% !important;
  pointer-events: none !important;
  margin-bottom: calc(-1 * var(--header-pill-height, 108px)) !important;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.atelier-header-section.is-hidden {
  transform: translateY(-110%);
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

/* Outer Bar Padding & Width */
.atelier-header__bar {
  pointer-events: none !important;
  position: relative !important;
  max-width: calc(1400px + var(--gap-side, 24px) * 2) !important;
  margin-inline: auto !important;
  padding: var(--gap-top, 14px) var(--gap-side, 24px) 0 !important;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* ==========================================================================
   AUTHENTIC FROSTED GLASS PILL (UrbanDeco Reference)
   ========================================================================== */
.atelier-header__pill {
  pointer-events: auto !important;
  position: relative !important;
  isolation: isolate !important;
  background: transparent !important;
  border-radius: var(--header-radius, 18px) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 12px 32px -14px rgba(28, 27, 25, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease !important;
}

.atelier-header__pill::before {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: -1 !important;
  border-radius: inherit !important;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.05) 60%),
              var(--header-glass, rgba(248, 245, 237, 0.50)) !important;
  -webkit-backdrop-filter: blur(var(--header-blur, 20px)) saturate(170%) !important;
  backdrop-filter: blur(var(--header-blur, 20px)) saturate(170%) !important;
  transition: background 0.4s ease !important;
}

@supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
  .atelier-header__pill::before {
    background: var(--header-solid, #F8F5ED) !important;
  }
}

.atelier-header__bar.is-scrolled .atelier-header__pill {
  box-shadow: 0 18px 42px -14px rgba(28, 27, 25, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
}

/* ==========================================================================
   Header Elements (Left, Center, Right)
   ========================================================================== */
.atelier-header__left {
  display: flex !important;
  align-items: center !important;
  min-width: 0 !important;
}

.atelier-header__center {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.atelier-header__right {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 4px !important;
}

/* Logo */
.atelier-logo {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  min-height: 44px !important;
  line-height: 1 !important;
}
.atelier-logo img {
  display: block !important;
  width: var(--logo-width, 170px) !important;
  max-width: 100% !important;
  height: auto !important;
}
.atelier-logo__text {
  font-family: 'DM Serif Display', Georgia, serif !important;
  font-size: 20px !important;
  font-weight: 700 !important;
  letter-spacing: 0.16em !important;
  text-transform: uppercase !important;
  white-space: nowrap !important;
  color: var(--header-text, #363638) !important;
}

/* Coffee Cup & Animated Steam */
.atelier-cup {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 26px !important;
  height: 38px !important;
  flex-shrink: 0 !important;
}
.atelier-cup img {
  width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
}
.atelier-steam {
  position: absolute !important;
  top: -4px !important;
  left: 45% !important;
  width: 3.5px !important;
  height: 10px !important;
  background: linear-gradient(to top, rgba(198, 181, 142, 0.7), transparent) !important;
  border-radius: 4px !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
.atelier-steam--second {
  left: 60% !important;
  top: -2px !important;
  animation-delay: 1.2s !important;
}
.atelier-cup--steam .atelier-steam {
  animation: atelierSteamRise 2.8s ease-in-out infinite !important;
}
@keyframes atelierSteamRise {
  0% { transform: translateY(0) scaleX(0.8); opacity: 0; }
  40% { opacity: 0.7; transform: translateY(-8px) scaleX(1.1); }
  80% { opacity: 0.2; transform: translateY(-16px) scaleX(1.4); }
  100% { transform: translateY(-22px) scaleX(1.6); opacity: 0; }
}

/* Action Icons */
.atelier-icon-btn {
  position: relative !important;
  display: grid !important;
  place-items: center !important;
  width: 42px !important;
  height: 42px !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 50% !important;
  background: transparent !important;
  color: var(--header-text, #363638) !important;
  cursor: pointer !important;
  transition: background 0.25s ease, transform 0.25s ease !important;
}
.atelier-icon-btn svg {
  width: 20px !important;
  height: 20px !important;
  transition: transform 0.3s ease !important;
}
.atelier-icon-btn:hover {
  background: rgba(255, 255, 255, 0.45) !important;
}
.atelier-icon-btn:hover svg {
  transform: translateY(-1px) !important;
}

/* Badges (Wishlist & Cart) */
.atelier-badge,
.header__cart-count {
  position: absolute !important;
  top: 3px !important;
  right: 1px !important;
  min-width: 18px !important;
  height: 18px !important;
  padding: 0 5px !important;
  border-radius: 9px !important;
  background: var(--header-text, #363638) !important;
  color: #FFFFFF !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  line-height: 18px !important;
  text-align: center !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7) !important;
}
.atelier-badge[hidden] { display: none !important; }

/* Capsule Search Pill (UrbanDeco reference) */
.atelier-search-pill {
  display: none;
  align-items: center !important;
  gap: 10px !important;
  width: min(100%, 280px) !important;
  height: 40px !important;
  margin: 0 !important;
  padding: 0 16px !important;
  border: 1px solid var(--header-line, rgba(54, 54, 56, 0.12)) !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, 0.45) !important;
  color: var(--header-text, #363638) !important;
  opacity: 0.85 !important;
  font-size: 13px !important;
  text-align: left !important;
  cursor: pointer !important;
  transition: background 0.3s ease, border-color 0.3s ease, opacity 0.3s ease !important;
}
.atelier-search-pill:hover {
  background: rgba(255, 255, 255, 0.8) !important;
  border-color: rgba(54, 54, 56, 0.25) !important;
  opacity: 1 !important;
}
.atelier-search-pill svg {
  flex: 0 0 16px !important;
  width: 16px !important;
  height: 16px !important;
}
.atelier-search-pill span {
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

/* Navigation Links */
.atelier-header__nav-list {
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.atelier-nav__link {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  height: 44px !important;
  margin: 0 !important;
  padding: 0 12px !important;
  border: 0 !important;
  background: none !important;
  font-family: 'Inter', -apple-system, sans-serif !important;
  font-size: var(--menu-size, 13px) !important;
  font-weight: var(--menu-weight, 600) !important;
  letter-spacing: var(--menu-letter-spacing, 1px) !important;
  text-transform: var(--menu-transform, uppercase) !important;
  color: var(--header-text, #363638) !important;
  white-space: nowrap !important;
  cursor: pointer !important;
  transition: color 0.25s ease !important;
}
.atelier-nav__link svg {
  width: 13px !important;
  height: 13px !important;
  opacity: 0.65 !important;
  transition: transform 0.35s ease !important;
}
.atelier-nav__link::after {
  content: '' !important;
  position: absolute !important;
  left: 12px !important;
  right: 12px !important;
  bottom: 8px !important;
  height: 1.5px !important;
  background: currentColor !important;
  transform: scaleX(0) !important;
  transform-origin: right !important;
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1) !important;
}
.atelier-nav__link:hover::after,
.atelier-nav__link[aria-expanded="true"]::after,
.atelier-nav__link.is-current::after {
  transform: scaleX(1) !important;
  transform-origin: left !important;
}
.atelier-nav__link[aria-expanded="true"] svg {
  transform: rotate(180deg) !important;
}
.atelier-nav__link.is-bold { font-weight: 800 !important; }

/* ==========================================================================
   DESKTOP LAYOUT 1: TWO LINES (UrbanDeco reference)
   Row 1: Search Pill on Left | Logo in Center | Action Icons on Right
   DIVIDER LINE
   Row 2: Centered Navigation Menu
   ========================================================================== */
@media (min-width: 990px) {
  .layout--two_rows .atelier-header__pill,
  .layout--two-rows .atelier-header__pill {
    display: grid !important;
    grid-template-columns: 1fr auto 1fr !important;
    grid-template-areas: "left center right" "nav nav nav" !important;
    padding: 8px 20px 6px !important;
    align-items: center !important;
  }
  .layout--two_rows .atelier-header__left,
  .layout--two-rows .atelier-header__left {
    display: contents !important;
  }
  .layout--two_rows .atelier-search-pill,
  .layout--two-rows .atelier-search-pill {
    display: inline-flex !important;
    grid-area: left !important;
    justify-self: start !important;
  }
  .layout--two_rows .atelier-header__center,
  .layout--two-rows .atelier-header__center {
    grid-area: center !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .layout--two_rows .atelier-header__right,
  .layout--two-rows .atelier-header__right {
    grid-area: right !important;
    display: flex !important;
    justify-content: flex-end !important;
    align-items: center !important;
    gap: 4px !important;
  }
  .layout--two_rows .atelier-header__right .atelier-search-icon,
  .layout--two-rows .atelier-header__right .atelier-search-icon {
    display: none !important;
  }
  .layout--two_rows .atelier-header__nav,
  .layout--two-rows .atelier-header__nav {
    grid-area: nav !important;
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
    margin-top: 8px !important;
    padding-top: 4px !important;
    border-top: 1px solid var(--header-line, rgba(54, 54, 56, 0.1)) !important;
  }
  .layout--two_rows .atelier-header__nav-list,
  .layout--two-rows .atelier-header__nav-list {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 4px 16px !important;
  }
}

/* ==========================================================================
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
   Mobile (< 990px)
   ========================================================================== */
@media screen and (max-width: 989px) {
  .atelier-header__bar {
    padding: var(--gap-top-mobile, 10px) var(--gap-side-mobile, 10px) 0 !important;
  }
  .atelier-header__pill {
    display: grid !important;
    grid-template-columns: auto 1fr auto !important;
    grid-template-areas: none !important;
    min-height: 54px !important;
    padding: 0 12px !important;
  }
  .atelier-header__left {
    display: flex !important;
    align-items: center !important;
    gap: 2px !important;
  }
  .atelier-header__center {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 0 !important;
  }
  .atelier-header__right {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 2px !important;
  }
  .atelier-burger {
    display: grid !important;
  }
  .atelier-search-pill {
    display: none !important;
  }
  .atelier-header__nav {
    display: none !important;
  }
  .atelier-desk-only {
    display: none !important;
  }
  .atelier-logo img {
    width: var(--logo-width-mobile, 120px) !important;
  }
}

@media screen and (min-width: 990px) {
  .atelier-burger {
    display: none !important;
  }
}

/* ==========================================================================
   Desktop Mega Menu Floating Panel (UrbanDeco reference)
   ========================================================================== */
.atelier-mega {
  display: none;
  position: absolute;
  top: calc(100% + 10px);
  left: var(--gap-side, 24px);
  right: var(--gap-side, 24px);
  border-radius: var(--header-radius, 18px);
  padding: 32px 40px;
  background: rgba(248, 245, 237, 0.88);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 24px 60px -16px rgba(54, 54, 56, 0.22),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
  pointer-events: auto;
  z-index: 50;
  animation: atelierMegaSlide 0.35s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}
.atelier-mega.is-open { display: block; }
@keyframes atelierMegaSlide {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.atelier-mega__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 48px;
  align-items: start;
}
.atelier-mega__title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--header-text, #363638);
  margin-bottom: 24px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(54, 54, 56, 0.1);
}
.atelier-mega__title svg { width: 14px; height: 14px; transition: transform 0.25s ease; }
.atelier-mega__title:hover svg { transform: translateX(4px); }
.atelier-mega__cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px 32px;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.atelier-mega__head {
  display: block;
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--header-text, #363638);
  margin-bottom: 12px;
  text-decoration: none;
  transition: color 0.2s ease;
}
.atelier-mega__head:hover { color: var(--header-accent, #4D351D); }
.atelier-mega__sub {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}
.atelier-mega__a {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  color: rgba(54, 54, 56, 0.75);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}
.atelier-mega__a:hover {
  color: var(--header-text, #363638);
  transform: translateX(3px);
}

/* Promotional Card */
.atelier-promo-card {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: #FFFFFF;
  box-shadow: 0 8px 24px -8px rgba(54, 54, 56, 0.12);
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.atelier-promo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 36px -12px rgba(54, 54, 56, 0.2);
}
.atelier-promo-card__img {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: rgba(54, 54, 56, 0.05);
}
.atelier-promo-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.atelier-promo-card:hover .atelier-promo-card__img img { transform: scale(1.06); }
.atelier-promo-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.atelier-promo-card__h {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 16px;
  color: var(--header-text, #363638);
}
.atelier-promo-card__s {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--header-accent, #4D351D);
}
.atelier-promo-card__s svg { width: 12px; height: 12px; }

/* ==========================================================================
   Predictive Search Panel (Floating Glass Modal)
   ========================================================================== */
.atelier-search-panel {
  display: none;
  position: absolute;
  top: calc(100% + 10px);
  left: var(--gap-side, 24px);
  right: var(--gap-side, 24px);
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--header-radius, 18px);
  background: rgba(248, 245, 237, 0.92);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 24px 60px -16px rgba(54, 54, 56, 0.22);
  padding: 24px;
  z-index: 50;
  pointer-events: auto;
}
.atelier-search-panel.is-open { display: block; }
.atelier-search-form {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(54, 54, 56, 0.15);
  padding-bottom: 12px;
}
.atelier-search-form svg {
  width: 20px;
  height: 20px;
  color: var(--header-text, #363638);
  margin-right: 12px;
}
.atelier-search-form input[type="search"] {
  flex: 1;
  background: transparent;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: var(--header-text, #363638);
  outline: none;
}
.atelier-search-panel__close {
  padding: 6px;
  cursor: pointer;
}
.atelier-search-panel__close svg { width: 18px; height: 18px; }
.atelier-search-idle {
  margin-top: 18px;
}
.atelier-search-recents-h {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(54, 54, 56, 0.6);
  margin-bottom: 10px;
}
.atelier-search-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.atelier-search-chip {
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(54, 54, 56, 0.1);
  font-size: 13px;
  color: var(--header-text, #363638);
  cursor: pointer;
  transition: all 0.2s ease;
}
.atelier-search-chip:hover {
  background: #FFFFFF;
  border-color: rgba(54, 54, 56, 0.3);
}

/* ==========================================================================
   Mobile Drawer & Scrim
   ========================================================================== */
.atelier-scrim {
  position: fixed;
  inset: 0;
  background: rgba(28, 24, 20, 0.45);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}
.atelier-scrim.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.atelier-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: min(88vw, 400px);
  background: #F8F5ED;
  z-index: 100;
  box-shadow: 20px 0 50px rgba(0, 0, 0, 0.25);
  transform: translateX(-102%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}
.atelier-drawer.is-open {
  transform: translateX(0);
}
.atelier-drawer__head {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(54, 54, 56, 0.08);
}
.atelier-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
.atelier-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.atelier-drawer__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 600;
  color: var(--header-text, #363638);
  border-radius: 8px;
}
.atelier-drawer__link:hover {
  background: rgba(255, 255, 255, 0.6);
}

/* Clearances for non-banner pages */
body:not(.template-index):not(.template-collection) #MainContent > .shopify-section:first-child:not(:has(.atelier-col-hero)):not(:has(.atelier-hero)):not(:has(.image-banner)):not(:has(.slideshow)) {
  padding-top: calc(var(--header-height, 120px) + 24px) !important;
}
`;

fs.writeFileSync(path.join(themeDir, 'assets/atelier-header.css'), headerCss, 'utf8');
console.log('Saved updated assets/atelier-header.css');

// 3. Build sections/atelier-header.liquid
// The DOM structure is now unified, so ALL 3 layouts work automatically without HTML duplication!
const headerLiquid = `{{ 'atelier-header.css' | asset_url | stylesheet_tag }}
<script src="{{ 'atelier-header.js' | asset_url }}" defer="defer"></script>

{%- liquid
  assign s = section.settings
  assign menu = s.menu.links | default: linklists.main-menu.links
  assign mobile_menu = s.mobile_menu.links | default: menu
  assign glass_alpha = s.glass_opacity | default: 50 | divided_by: 100.0
  assign phone_clean = s.phone | remove: ' ' | remove: '-' | remove: '(' | remove: ')'
  assign whatsapp_clean = s.whatsapp | remove: ' ' | remove: '+' | remove: '-'
  assign logo_alt = s.logo.alt | default: shop.name

  # Announcement Bar Logic
  assign show_announcement = s.show_announcement
  if s.announcement_text == blank
    assign show_announcement = false
  endif
-%}

{%- capture icon_search -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.35-4.35"/></svg>{%- endcapture -%}
{%- capture icon_account -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.9-3.6 3.9-5.6 7.5-5.6s6.6 2 7.5 5.6"/></svg>{%- endcapture -%}
{%- capture icon_heart -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>{%- endcapture -%}
{%- capture icon_bag -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>{%- endcapture -%}
{%- capture icon_phone -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>{%- endcapture -%}
{%- capture icon_burger -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7h17M3.5 12h17M3.5 17h11"/></svg>{%- endcapture -%}
{%- capture icon_close -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>{%- endcapture -%}
{%- capture icon_arrow -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-5-6 6 6-6 6"/></svg>{%- endcapture -%}
{%- capture icon_chev -%}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>{%- endcapture -%}

{%- capture logo_markup -%}
  <a class="atelier-logo" href="{{ s.logo_link | default: routes.root_url }}" aria-label="{{ shop.name | escape }} — Home">
    {%- if s.show_cup -%}
      <span class="atelier-cup{% if s.animate_steam %} atelier-cup--steam{% endif %}">
        {%- if s.cup_image != blank -%}
          {{ s.cup_image | image_url: width: 120 | image_tag: loading: 'eager', fetchpriority: 'high', widths: '60,120', alt: '' }}
        {%- else -%}
          <img src="{{ 'header-cup.png' | asset_url }}" width="26" height="38" loading="eager" alt="">
        {%- endif -%}
        <span class="atelier-steam" aria-hidden="true"></span>
        <span class="atelier-steam atelier-steam--second" aria-hidden="true"></span>
      </span>
    {%- endif -%}

    {%- if s.logo != blank -%}
      {{ s.logo | image_url: width: 600 | image_tag: widths: '200, 300, 400, 600', sizes: '240px', loading: 'eager', fetchpriority: 'high', alt: logo_alt }}
    {%- else -%}
      <span class="atelier-logo__text">{{ s.logo_text | default: shop.name | escape }}</span>
    {%- endif -%}
  </a>
{%- endcapture -%}

{%- style -%}
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
{%- endstyle -%}

<section
  id="shopify-section-{{ section.id }}"
  class="atelier-header-section{% if s.sticky %} is-sticky{% endif %}"
  data-section-id="{{ section.id }}"
>
  {%- comment -%} ==================== A. ANNOUNCEMENT BAR ==================== {%- endcomment -%}
  {%- if show_announcement -%}
    <aside
      class="atelier-announcement atelier-announcement--{{ s.announcement_visibility }}{% if s.announcement_scroll %} atelier-announcement--marquee{% endif %}"
      aria-label="Announcement"
    >
      <div class="atelier-announcement__inner">
        <div class="atelier-announcement__content atelier-announcement__content--{{ s.announcement_align }}">
          {%- if s.announcement_scroll -%}
            <div class="atelier-announcement__track">
              <span>{{ s.announcement_text | escape }}</span>
              <span>{{ s.announcement_text | escape }}</span>
              <span>{{ s.announcement_text | escape }}</span>
            </div>
          {%- else -%}
            {%- if s.announcement_link != blank -%}
              <a href="{{ s.announcement_link }}" class="atelier-announcement__link">
                <span>{{ s.announcement_text | escape }}</span>
                {{ icon_arrow }}
              </a>
            {%- else -%}
              <span>{{ s.announcement_text | escape }}</span>
            {%- endif -%}
          {%- endif -%}
        </div>

        {%- if s.show_country_selector -%}
          <div class="atelier-announcement__country">
            <span>IN</span>
            <span>({{ cart.currency.iso_code }})</span>
          </div>
        {%- endif -%}
      </div>
    </aside>
  {%- endif -%}

  {%- comment -%} ==================== B. MAIN HEADER FLOATING CONTAINER ==================== {%- endcomment -%}
  <atelier-header
    id="atelier-header-{{ section.id }}"
    class="atelier-header layout--{{ s.layout }} layout--{{ s.layout | replace: '_', '-' }}"
    data-layout="{{ s.layout }}"
    data-hide-on-scroll="{{ s.hide_on_scroll }}"
    data-money-format="{{ shop.money_format | escape }}"
  >
    <div class="atelier-header__bar">
      <div class="atelier-header__pill">

        {%- comment -%} ---------- LEFT AREA ---------- {%- endcomment -%}
        <div class="atelier-header__left">
          {%- comment -%} Mobile hamburger trigger {%- endcomment -%}
          <button
            type="button"
            class="atelier-icon-btn atelier-burger"
            data-open-drawer
            aria-label="Open mobile menu"
            aria-expanded="false"
          >
            {{ icon_burger }}
          </button>

          {%- comment -%} Capsule Search Pill (Used in Two-Rows layout) {%- endcomment -%}
          <button
            type="button"
            class="atelier-search-pill"
            data-open-search
            aria-label="Search journals and gifts"
            aria-expanded="false"
          >
            {{ icon_search }}
            <span>{{ s.search_placeholder | escape }}</span>
          </button>

          {%- comment -%} Desktop Navigation Menu (Always in DOM; position controlled by layout CSS) {%- endcomment -%}
          <nav class="atelier-header__nav" aria-label="Main navigation">
            <ul class="atelier-header__nav-list" role="list">
              {%- for link in menu -%}
                {%- liquid
                  assign bold = false
                  assign t_down = link.title | downcase
                  if s.bold_words != blank
                    assign words = s.bold_words | downcase | split: ','
                    for w in words
                      assign ww = w | strip
                      if ww != blank and t_down contains ww
                        assign bold = true
                      endif
                    endfor
                  endif
                -%}
                <li>
                  {%- if link.links.size > 0 -%}
                    <button
                      type="button"
                      class="atelier-nav__link{% if link.active or link.child_active %} is-current{% endif %}{% if bold %} is-bold{% endif %}"
                      data-mega-trigger="{{ forloop.index }}"
                      aria-expanded="false"
                    >
                      {{ link.title | escape }}{{ icon_chev }}
                    </button>
                  {%- else -%}
                    <a
                      class="atelier-nav__link{% if link.active %} is-current{% endif %}{% if bold %} is-bold{% endif %}"
                      href="{{ link.url }}"
                    >
                      {{ link.title | escape }}
                    </a>
                  {%- endif -%}
                </li>
              {%- endfor -%}
            </ul>
          </nav>
        </div>

        {%- comment -%} ---------- CENTER AREA (LOGO) ---------- {%- endcomment -%}
        <div class="atelier-header__center">
          {%- if request.page_type == 'index' and s.logo_h1 -%}
            <h1 style="margin: 0; line-height: 1;">{{ logo_markup }}</h1>
          {%- else -%}
            {{ logo_markup }}
          {%- endif -%}
        </div>

        {%- comment -%} ---------- RIGHT AREA (ACTION ICONS) ---------- {%- endcomment -%}
        <div class="atelier-header__right">
          {%- comment -%} Search icon button (Used in single-row layouts) {%- endcomment -%}
          <button
            type="button"
            class="atelier-icon-btn atelier-search-icon"
            data-open-search
            aria-label="Search"
          >
            {{ icon_search }}
          </button>

          {%- if s.show_phone and phone_clean != blank -%}
            <a
              class="atelier-icon-btn atelier-desk-only"
              href="tel:{{ phone_clean }}"
              aria-label="Call customer support"
            >
              {{ icon_phone }}
            </a>
          {%- endif -%}

          {%- if s.show_account and shop.customer_accounts_enabled -%}
            <a
              class="atelier-icon-btn atelier-desk-only"
              href="{% if customer %}{{ routes.account_url }}{% else %}{{ routes.account_login_url }}{% endif %}"
              aria-label="Customer account"
            >
              {{ icon_account }}
            </a>
          {%- endif -%}

          {%- if s.show_wishlist -%}
            <button
              type="button"
              class="atelier-icon-btn"
              data-open-wishlist
              aria-label="Wishlist saved items"
            >
              {{ icon_heart }}
              <span class="atelier-badge" data-wishlist-count hidden>0</span>
            </button>
          {%- endif -%}

          {%- if s.show_cart -%}
            <a
              class="atelier-icon-btn"
              id="cart-icon-bubble"
              data-cart-btn
              href="{{ routes.cart_url }}"
              aria-label="Shopping Cart"
            >
              {{ icon_bag }}
              {%- if cart.item_count > 0 -%}
                <span class="atelier-badge cart-count-bubble">
                  <span aria-hidden="true">{{ cart.item_count }}</span>
                  <span class="visually-hidden">{{ cart.item_count }} items</span>
                </span>
              {%- endif -%}
            </a>
          {%- endif -%}
        </div>

      </div>

      {%- comment -%} ==================== C. DESKTOP MEGA MENUS ==================== {%- endcomment -%}
      {%- for link in menu -%}
        {%- if link.links.size == 0 -%}{%- continue -%}{%- endif -%}
        {%- assign lt = link.title | downcase | strip -%}
        <div
          class="atelier-mega"
          id="atelier-mega-{{ forloop.index }}"
          data-mega-panel="{{ forloop.index }}"
          role="region"
          aria-label="{{ link.title | escape }} sub-menu"
        >
          <div class="atelier-mega__inner">
            <div class="atelier-mega__main">
              <a class="atelier-mega__title" href="{{ link.url }}">
                Shop All {{ link.title | escape }}{{ icon_arrow }}
              </a>

              <ul class="atelier-mega__cols" role="list">
                {%- for child in link.links -%}
                  <li>
                    <a class="atelier-mega__head" href="{{ child.url }}">{{ child.title | escape }}</a>
                    {%- if child.links.size > 0 -%}
                      <ul class="atelier-mega__sub" role="list">
                        {%- for grandchild in child.links -%}
                          <li>
                            <a class="atelier-mega__a" href="{{ grandchild.url }}">{{ grandchild.title | escape }}</a>
                          </li>
                        {%- endfor -%}
                      </ul>
                    {%- endif -%}
                  </li>
                {%- endfor -%}
              </ul>
            </div>

            {%- comment -%} Promotional Photo Card on Right {%- endcomment -%}
            {%- for block in section.blocks -%}
              {%- if block.type == 'promo' -%}
                {%- assign bt = block.settings.menu_item | downcase | strip -%}
                {%- if bt == lt -%}
                  <a
                    class="atelier-promo-card"
                    href="{{ block.settings.link | default: link.url }}"
                    {{ block.shopify_attributes }}
                  >
                    <div class="atelier-promo-card__img">
                      {%- if block.settings.image != blank -%}
                        {{ block.settings.image | image_url: width: 600 | image_tag: widths: '300, 480, 600', sizes: '280px', loading: 'lazy', alt: block.settings.heading | escape }}
                      {%- else -%}
                        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #E9DFC2 0%, #C6B58E 100%);"></div>
                      {%- endif -%}
                    </div>
                    <div class="atelier-promo-card__body">
                      {%- if block.settings.heading != blank -%}
                        <span class="atelier-promo-card__h">{{ block.settings.heading | escape }}</span>
                      {%- endif -%}
                      {%- if block.settings.subheading != blank -%}
                        <span class="atelier-promo-card__s">{{ block.settings.subheading | escape }}{{ icon_arrow }}</span>
                      {%- endif -%}
                    </div>
                  </a>
                {%- endif -%}
              {%- endif -%}
            {%- endfor -%}
          </div>
        </div>
      {%- endfor -%}

      {%- comment -%} ==================== D. LIVE PREDICTIVE SEARCH DROPDOWN ==================== {%- endcomment -%}
      <div
        class="atelier-search-panel"
        data-search-panel
        role="dialog"
        aria-label="Product search"
      >
        <form class="atelier-search-form" action="{{ routes.search_url }}" method="get" role="search">
          {{ icon_search }}
          <input
            type="search"
            name="q"
            placeholder="{{ s.search_placeholder | escape }}"
            data-search-input
            autocomplete="off"
            aria-label="Search"
          >
          <input type="hidden" name="type" value="product">
          <button type="button" class="atelier-search-panel__close" data-close-search aria-label="Close search">
            {{ icon_close }}
          </button>
        </form>

        <div class="atelier-search-idle" data-search-idle>
          {%- if s.popular_searches != blank -%}
            <p class="atelier-search-recents-h">Popular Searches</p>
            <div class="atelier-search-chips">
              {%- assign popular = s.popular_searches | split: ',' -%}
              {%- for term in popular -%}
                {%- assign t_clean = term | strip -%}
                {%- if t_clean != blank -%}
                  <button type="button" class="atelier-search-chip" data-search-chip="{{ t_clean | escape }}">
                    {{ t_clean }}
                  </button>
                {%- endif -%}
              {%- endfor -%}
            </div>
          {%- endif -%}

          <div data-recent-searches-wrap style="display: none; margin-top: 18px;">
            <p class="atelier-search-recents-h">Recent Searches</p>
            <div class="atelier-search-chips" data-recent-searches-list></div>
          </div>
        </div>

        <div class="atelier-search-results" data-search-results style="display: none;"></div>
      </div>

    </div>
  </atelier-header>

  {%- comment -%} ==================== E. MOBILE SLIDE-OUT DRAWER ==================== {%- endcomment -%}
  <div class="atelier-scrim" data-scrim aria-hidden="true"></div>

  <aside
    class="atelier-drawer"
    id="atelier-mobile-drawer"
    data-mobile-drawer
    aria-label="Mobile navigation"
    aria-hidden="true"
  >
    <div class="atelier-drawer__head">
      <div class="atelier-drawer__brand">
        {{ logo_markup }}
      </div>
      <button
        type="button"
        class="atelier-icon-btn"
        data-close-drawer
        aria-label="Close mobile menu"
      >
        {{ icon_close }}
      </button>
    </div>

    <div class="atelier-drawer__body">
      {%- if s.m_show_promo and s.promo_heading != blank -%}
        <a class="atelier-drawer__promo" href="{{ s.promo_link | default: routes.all_products_collection_url }}">
          <p class="atelier-drawer__promo-h">{{ s.promo_heading | escape }}</p>
          {%- if s.promo_link_label != blank -%}
            <span class="atelier-drawer__promo-cta">{{ s.promo_link_label | escape }}{{ icon_arrow }}</span>
          {%- endif -%}
        </a>
      {%- endif -%}

      <nav class="atelier-drawer__nav" aria-label="Mobile main navigation">
        <ul role="list">
          {%- for link in mobile_menu -%}
            <li>
              {%- if link.links.size > 0 -%}
                <details class="atelier-drawer__accordion">
                  <summary class="atelier-drawer__link">
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
                <a class="atelier-drawer__link" href="{{ link.url }}">
                  {{ link.title | escape }}
                </a>
              {%- endif -%}
            </li>
          {%- endfor -%}
        </ul>
      </nav>

      {%- if s.m_show_contact -%}
        <div class="atelier-drawer__contact">
          <p class="atelier-drawer__contact-tagline">{{ s.tagline | default: 'Artful Things. Thoughtful Living.' }}</p>
          {%- if whatsapp_clean != blank -%}
            <a class="atelier-drawer__wa" href="https://wa.me/{{ whatsapp_clean }}" target="_blank" rel="noopener">
              Chat on WhatsApp
            </a>
          {%- endif -%}
          {%- if s.m_hours != blank -%}
            <p class="atelier-drawer__hours">{{ s.m_hours }}</p>
          {%- endif -%}
        </div>
      {%- endif -%}
    </div>
  </aside>
</section>

{% schema %}
{
  "name": "Atelier header",
  "tag": "section",
  "class": "atelier-header-section",
  "limit": 1,
  "enabled_on": {
    "groups": ["header"]
  },
  "settings": [
    {
      "type": "header",
      "content": "Announcement Bar"
    },
    {
      "type": "checkbox",
      "id": "show_announcement",
      "label": "Enable announcement bar",
      "default": false
    },
    {
      "type": "text",
      "id": "announcement_text",
      "label": "Announcement text",
      "default": "Artful Things. Thoughtful Living. | Free Shipping on orders over ₹999"
    },
    {
      "type": "url",
      "id": "announcement_link",
      "label": "Announcement link"
    },
    {
      "type": "select",
      "id": "announcement_align",
      "label": "Text alignment",
      "default": "center",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ]
    },
    {
      "type": "color",
      "id": "announcement_bg",
      "label": "Background colour",
      "default": "#1E1814"
    },
    {
      "type": "color",
      "id": "announcement_text_color",
      "label": "Text colour",
      "default": "#F8F5ED"
    },
    {
      "type": "range",
      "id": "announcement_font_size",
      "label": "Font size",
      "min": 10,
      "max": 16,
      "step": 1,
      "unit": "px",
      "default": 12
    },
    {
      "type": "checkbox",
      "id": "announcement_scroll",
      "label": "Enable scrolling marquee text",
      "default": false
    },
    {
      "type": "range",
      "id": "announcement_speed",
      "label": "Scrolling speed (seconds)",
      "min": 10,
      "max": 60,
      "step": 5,
      "unit": "s",
      "default": 25
    },
    {
      "type": "checkbox",
      "id": "show_country_selector",
      "label": "Show country/currency indicator",
      "default": true
    },
    {
      "type": "select",
      "id": "announcement_visibility",
      "label": "Device visibility",
      "default": "all",
      "options": [
        { "value": "all", "label": "Desktop & Mobile" },
        { "value": "desktop", "label": "Desktop only" },
        { "value": "mobile", "label": "Mobile only" }
      ]
    },

    {
      "type": "header",
      "content": "Logo"
    },
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Desktop logo"
    },
    {
      "type": "text",
      "id": "logo_text",
      "label": "Text fallback logo",
      "default": "GRAFFEINE TALES"
    },
    {
      "type": "range",
      "id": "logo_width",
      "label": "Desktop logo width",
      "min": 80,
      "max": 320,
      "step": 10,
      "unit": "px",
      "default": 170
    },
    {
      "type": "range",
      "id": "logo_width_mobile",
      "label": "Mobile logo width",
      "min": 60,
      "max": 200,
      "step": 10,
      "unit": "px",
      "default": 120
    },
    {
      "type": "checkbox",
      "id": "logo_h1",
      "label": "Logo is H1 on homepage",
      "default": false
    },
    {
      "type": "url",
      "id": "logo_link",
      "label": "Logo link destination"
    },
    {
      "type": "checkbox",
      "id": "show_cup",
      "label": "Show signature coffee cup icon",
      "default": true
    },
    {
      "type": "image_picker",
      "id": "cup_image",
      "label": "Custom cup icon (optional)"
    },
    {
      "type": "checkbox",
      "id": "animate_steam",
      "label": "Animate cup steam",
      "default": true
    },

    {
      "type": "header",
      "content": "Menu & Navigation"
    },
    {
      "type": "link_list",
      "id": "menu",
      "label": "Main menu",
      "default": "main-menu"
    },
    {
      "type": "link_list",
      "id": "mobile_menu",
      "label": "Phone menu (optional)"
    },
    {
      "type": "select",
      "id": "layout",
      "label": "Desktop layout",
      "default": "two_rows",
      "options": [
        { "value": "two_rows", "label": "Two lines: logo on top, menu below" },
        { "value": "logo_center", "label": "Menu left, logo centre" },
        { "value": "logo_left", "label": "Logo left, menu centre" }
      ]
    },
    {
      "type": "text",
      "id": "bold_words",
      "label": "Words to bold in menu",
      "default": "journal, sale, new"
    },
    {
      "type": "range",
      "id": "menu_font_size",
      "label": "Font size",
      "min": 11,
      "max": 18,
      "step": 1,
      "unit": "px",
      "default": 13
    },
    {
      "type": "select",
      "id": "menu_font_weight",
      "label": "Font weight",
      "default": "600",
      "options": [
        { "value": "400", "label": "Regular" },
        { "value": "500", "label": "Medium" },
        { "value": "600", "label": "Semi-bold" },
        { "value": "700", "label": "Bold" }
      ]
    },
    {
      "type": "select",
      "id": "menu_text_transform",
      "label": "Text transformation",
      "default": "uppercase",
      "options": [
        { "value": "none", "label": "Normal" },
        { "value": "uppercase", "label": "Uppercase" },
        { "value": "capitalize", "label": "Capitalize" }
      ]
    },
    {
      "type": "range",
      "id": "menu_letter_spacing",
      "label": "Letter spacing",
      "min": 0,
      "max": 6,
      "step": 1,
      "unit": "px",
      "default": 1
    },

    {
      "type": "header",
      "content": "Search"
    },
    {
      "type": "checkbox",
      "id": "show_search",
      "label": "Enable search",
      "default": true
    },
    {
      "type": "text",
      "id": "search_placeholder",
      "label": "Search placeholder",
      "default": "Search journals, notebooks, gifts…"
    },
    {
      "type": "text",
      "id": "popular_searches",
      "label": "Popular search suggestions",
      "default": "Linen Journals, Daily Planners, Bookmarks, Stickers, Gift Sets"
    },
    {
      "type": "collection_list",
      "id": "search_collections",
      "label": "Featured search collections"
    },
    {
      "type": "text",
      "id": "search_collections_title",
      "label": "Collections category title",
      "default": "Shop by category"
    },
    {
      "type": "checkbox",
      "id": "search_recent",
      "label": "Remember recent searches on this device",
      "default": true
    },

    {
      "type": "header",
      "content": "Action Icons"
    },
    {
      "type": "checkbox",
      "id": "show_phone",
      "label": "Show phone icon",
      "default": false
    },
    {
      "type": "text",
      "id": "phone",
      "label": "Phone number",
      "default": "919876543210"
    },
    {
      "type": "checkbox",
      "id": "show_account",
      "label": "Show customer account icon",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_account_mobile",
      "label": "Show customer account on mobile",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "show_wishlist",
      "label": "Show wishlist icon",
      "default": true
    },
    {
      "type": "page",
      "id": "wishlist_page",
      "label": "Wishlist destination page"
    },
    {
      "type": "checkbox",
      "id": "show_cart",
      "label": "Show cart icon",
      "default": true
    },
    {
      "type": "range",
      "id": "icon_size",
      "label": "Icon size",
      "min": 18,
      "max": 28,
      "step": 1,
      "unit": "px",
      "default": 22
    },

    {
      "type": "header",
      "content": "Frosted Glassmorphic Surface"
    },
    {
      "type": "color",
      "id": "glass_color",
      "label": "Glass tint colour",
      "default": "#F8F5ED"
    },
    {
      "type": "range",
      "id": "glass_opacity",
      "label": "Glass opacity (Lower = clearer/more transparent)",
      "min": 20,
      "max": 95,
      "step": 5,
      "unit": "%",
      "default": 50
    },
    {
      "type": "range",
      "id": "blur",
      "label": "Blur strength",
      "min": 0,
      "max": 40,
      "step": 2,
      "unit": "px",
      "default": 20
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text & icon colour",
      "default": "#363638"
    },
    {
      "type": "color",
      "id": "accent_color",
      "label": "Accent colour",
      "default": "#4D351D"
    },
    {
      "type": "color",
      "id": "border_color",
      "label": "Border colour",
      "default": "#C6B58E"
    },
    {
      "type": "range",
      "id": "radius",
      "label": "Corner rounding",
      "min": 0,
      "max": 32,
      "step": 2,
      "unit": "px",
      "default": 18
    },

    {
      "type": "header",
      "content": "Position & Spacing"
    },
    {
      "type": "select",
      "id": "sticky",
      "label": "Sticky header behavior",
      "default": "always",
      "options": [
        { "value": "always", "label": "Always stay at top" },
        { "value": "scroll_up", "label": "Show on scroll up" },
        { "value": "none", "label": "Not sticky" }
      ]
    },
    {
      "type": "checkbox",
      "id": "hide_on_scroll",
      "label": "Hide when scrolling down",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "overlay_home",
      "label": "Overlay homepage banner",
      "default": true
    },
    {
      "type": "range",
      "id": "gap_top",
      "label": "Space above pill (Desktop)",
      "min": 0,
      "max": 40,
      "step": 2,
      "unit": "px",
      "default": 14
    },
    {
      "type": "range",
      "id": "gap_side",
      "label": "Space at sides (Desktop)",
      "min": 0,
      "max": 80,
      "step": 4,
      "unit": "px",
      "default": 24
    },
    {
      "type": "range",
      "id": "gap_top_mobile",
      "label": "Space above pill (Mobile)",
      "min": 0,
      "max": 24,
      "step": 2,
      "unit": "px",
      "default": 10
    },
    {
      "type": "range",
      "id": "gap_side_mobile",
      "label": "Space at sides (Mobile)",
      "min": 0,
      "max": 24,
      "step": 2,
      "unit": "px",
      "default": 10
    },

    {
      "type": "header",
      "content": "Mobile Drawer"
    },
    {
      "type": "select",
      "id": "m_style",
      "label": "Mobile menu style",
      "default": "photos",
      "options": [
        { "value": "photos", "label": "With photo tiles" },
        { "value": "text", "label": "Text only" }
      ]
    },
    {
      "type": "range",
      "id": "m_tiles",
      "label": "Number of photo tiles",
      "min": 0,
      "max": 8,
      "step": 1,
      "default": 6
    },
    {
      "type": "checkbox",
      "id": "m_show_promo",
      "label": "Show top promo card in drawer",
      "default": true
    },
    {
      "type": "text",
      "id": "promo_heading",
      "label": "Promo heading",
      "default": "Handcrafted with Art & Intention"
    },
    {
      "type": "text",
      "id": "promo_link_label",
      "label": "Promo link label",
      "default": "Shop New Arrivals"
    },
    {
      "type": "url",
      "id": "promo_link",
      "label": "Promo link"
    },
    {
      "type": "color",
      "id": "promo_bg",
      "label": "Promo background",
      "default": "#4D351D"
    },
    {
      "type": "color",
      "id": "promo_text",
      "label": "Promo text color",
      "default": "#FFFFFF"
    },
    {
      "type": "checkbox",
      "id": "m_show_contact",
      "label": "Show contact details in drawer",
      "default": true
    },
    {
      "type": "text",
      "id": "whatsapp",
      "label": "WhatsApp phone number",
      "default": "919876543210"
    },
    {
      "type": "text",
      "id": "m_hours",
      "label": "Customer care hours",
      "default": "Mon–Sat 10am–7pm"
    },
    {
      "type": "link_list",
      "id": "drawer_menu",
      "label": "Extra drawer menu (optional)"
    },
    {
      "type": "text",
      "id": "tagline",
      "label": "Brand tagline in drawer",
      "default": "Artful Things. Thoughtful Living."
    }
  ],
  "blocks": [
    {
      "type": "promo",
      "name": "Mega menu promo card",
      "settings": [
        {
          "type": "text",
          "id": "menu_item",
          "label": "Navigation item title",
          "info": "Exact title of navigation link to attach this promo card to (e.g. Journals)"
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
    }
  ],
  "presets": [
    {
      "name": "Atelier header"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(themeDir, 'sections/atelier-header.liquid'), headerLiquid, 'utf8');
console.log('Saved sections/atelier-header.liquid');

// 4. Build assets/atelier-header.js
const headerJs = `/**
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
        const panel = this.querySelector(\`[data-mega-panel="\${index}"]\`);
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

      fetch(\`/search/suggest.json?q=\${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6\`)
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
            html += \`
              <li>
                <a href="\${p.url}" style="display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 14px; padding: 8px; border-radius: 8px; transition: background 0.2s;">
                  <img src="\${p.image || ''}" width="48" height="48" style="object-fit: cover; border-radius: 6px; background: #f0f0f0;" alt="">
                  <div>
                    <span style="display: block; font-size: 14px; font-weight: 600; color: #363638;">\${p.title}</span>
                    <span style="font-size: 13px; color: #4D351D;">\${p.price}</span>
                  </div>
                  <span style="font-size: 12px; color: #999;">&rarr;</span>
                </a>
              </li>
            \`;
          });
          html += '</ul>';
          html += \`<a href="/search?q=\${encodeURIComponent(query)}&type=product" style="display: block; text-align: center; margin-top: 16px; padding: 10px; background: #363638; color: #fff; border-radius: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase;">View all results &rarr;</a>\`;

          this.searchResults.innerHTML = html;
          this.searchResults.style.display = 'block';
          this.searchIdle.style.display = 'none';
        })
        .catch(() => {});
    }

    openMobileDrawer() {
      this.closeAll();
      if (this.drawer) this.drawer.classList.add('is-open');
      if (this.scrim) this.scrim.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }

    closeAll() {
      this.querySelectorAll('[data-mega-panel].is-open').forEach((p) => p.classList.remove('is-open'));
      this.querySelectorAll('[data-mega-trigger][aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      if (this.searchPanel) this.searchPanel.classList.remove('is-open');
      if (this.drawer) this.drawer.classList.remove('is-open');
      if (this.scrim) this.scrim.classList.remove('is-visible');
      document.body.style.overflow = '';
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
        list.innerHTML = recents.slice(0, 5).map((t) => \`<button type="button" class="atelier-search-chip" data-search-chip="\${t}">\${t}</button>\`).join('');
      } catch (e) {}
    }
  }

  customElements.define('atelier-header', AtelierHeader);
}
`;

fs.writeFileSync(path.join(themeDir, 'assets/atelier-header.js'), headerJs, 'utf8');
console.log('Saved assets/atelier-header.js');

console.log('BUILD COMPLETE!');
