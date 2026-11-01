const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Work/GraffeineTales/GraffeineTalesTheme';

// 1. Update assets/atelier-pdp-icons.css
const cssPath = path.join(rootDir, 'assets/atelier-pdp-icons.css');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

const newTrustBarCss = `/* ===================================================
   IMAGE 2: Horizontal Trust Bar (Pill / Row of Badges)
   =================================================== */
.atelier-trust-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--trust-bar-bg, #FFFFFF);
  border: 1px solid var(--trust-bar-border, #EFECE6);
  border-radius: var(--trust-bar-radius, 14px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  padding: var(--trust-bar-padding-y, 10px) var(--trust-bar-padding-x, 12px);
  margin-top: var(--trust-bar-margin-top, 16px);
  margin-bottom: var(--trust-bar-margin-bottom, 16px);
  width: 100%;
  box-sizing: border-box;
}

.atelier-trust-bar__standalone-wrap {
  max-width: var(--trust-bar-max-width, 1320px);
  margin: 0 auto;
  padding-top: var(--trust-bar-top, 20px);
  padding-bottom: var(--trust-bar-bottom, 20px);
  padding-left: max(20px, env(safe-area-inset-left));
  padding-right: max(20px, env(safe-area-inset-right));
  box-sizing: border-box;
}

.atelier-trust-bar__item {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1 1 0;
  min-width: 0;
  padding: 2px 8px;
  position: relative;
  box-sizing: border-box;
}

/* Distribute width based on text volume so item 1 fits in 1-2 lines */
.atelier-trust-bar__item:first-child:not(:last-child) {
  flex: 1.65 1 0;
  padding-left: 0;
}

.atelier-trust-bar__item:nth-child(2):not(:last-child) {
  flex: 0.95 1 0;
}

.atelier-trust-bar__item:last-child {
  flex: 1.05 1 0;
  padding-right: 0;
}

.atelier-trust-bar__item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 15%;
  height: 70%;
  width: 1px;
  background: var(--trust-bar-divider, #EFECE6);
}

.atelier-trust-bar__icon-bubble {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--icon-bg, #FDF0ED);
  color: var(--icon-color, #9E3B2B);
  transition: transform 0.2s ease;
}

.atelier-trust-bar__item:hover .atelier-trust-bar__icon-bubble {
  transform: scale(1.06);
}

.atelier-trust-bar__icon-bubble svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  display: block;
}

.atelier-trust-bar__icon-bubble img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}

.atelier-trust-bar__text {
  font-family: var(--font-body-family, 'Inter', sans-serif);
  font-size: var(--trust-bar-font-size, 10.5px);
  font-weight: 500;
  line-height: 1.25;
  color: var(--trust-bar-text, #363638);
  word-break: normal !important;
  overflow-wrap: normal !important;
  white-space: normal;
  hyphens: none;
}

.atelier-trust-bar__text p {
  margin: 0;
  font-size: inherit;
  line-height: inherit;
}

@media (max-width: 640px) {
  .atelier-trust-bar {
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
  }
  .atelier-trust-bar__standalone-wrap {
    padding-top: var(--trust-bar-mobile-top, 14px);
    padding-bottom: var(--trust-bar-mobile-bottom, 14px);
  }
  .atelier-trust-bar__item {
    padding: 6px 0 !important;
    width: 100% !important;
    flex: none !important;
    gap: 10px;
  }
  .atelier-trust-bar__item:not(:last-child)::after {
    display: none;
  }
  .atelier-trust-bar__item:not(:last-child) {
    border-bottom: 1px solid var(--trust-bar-divider, #EFECE6);
    padding-bottom: 8px !important;
  }
  .atelier-trust-bar__icon-bubble {
    width: 34px;
    height: 34px;
  }
  .atelier-trust-bar__icon-bubble svg {
    width: 17px;
    height: 17px;
  }
  .atelier-trust-bar__text {
    font-size: 11.5px;
    line-height: 1.35;
  }
}`;

// Replace the old IMAGE 2 block in css
const oldImage2Regex = /\/\* =+\s*IMAGE 2:[\s\S]*?@media \(max-width: 749px\) \{[\s\S]*?padding-bottom:\s*8px;\s*\}\s*\}/;
if (oldImage2Regex.test(css)) {
  css = css.replace(oldImage2Regex, newTrustBarCss);
} else {
  // If regex doesn't match, replace from start of Image 2 to Image 3
  const idxImage2 = css.indexOf('IMAGE 2:');
  const idxImage3 = css.indexOf('IMAGE 3:');
  if (idxImage2 !== -1 && idxImage3 !== -1) {
    css = css.substring(0, idxImage2 - 5) + newTrustBarCss + '\n\n' + css.substring(idxImage3 - 57);
  }
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Updated assets/atelier-pdp-icons.css');

// 2. Update templates/product.json
const productJsonPath = path.join(rootDir, 'templates/product.json');
let productJsonContent = fs.readFileSync(productJsonPath, 'utf8');
let leadComment = '';
const match = productJsonContent.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
if (match) {
  leadComment = match[0];
  productJsonContent = productJsonContent.substring(leadComment.length);
}
let productJson = JSON.parse(productJsonContent);

if (productJson.sections && productJson.sections.main && productJson.sections.main.blocks) {
  if (productJson.sections.main.blocks.trust_badge_1) {
    productJson.sections.main.blocks.trust_badge_1.settings.text = "7-10 days confirmation<br>Dispatches in 2-3 days";
  }
  if (productJson.sections.main.blocks.trust_badge_2) {
    productJson.sections.main.blocks.trust_badge_2.settings.text = "Secure<br>Packaging";
  }
  if (productJson.sections.main.blocks.trust_badge_3) {
    productJson.sections.main.blocks.trust_badge_3.settings.text = "Flat shipping<br>₹99 per order";
  }
}

fs.writeFileSync(productJsonPath, leadComment + JSON.stringify(productJson, null, 2), 'utf8');
console.log('Updated templates/product.json with 1-2 line formatting');

// 3. Update presets in sections/pdp-trust-bar.liquid
const trustBarLiquidPath = path.join(rootDir, 'sections/pdp-trust-bar.liquid');
let trustBarLiquid = fs.readFileSync(trustBarLiquidPath, 'utf8').replace(/\r\n/g, '\n');

trustBarLiquid = trustBarLiquid.replace(
  '"text": "7-10 days from order confirmation / Dispatches in 2-3 business days"',
  '"text": "7-10 days confirmation<br>Dispatches in 2-3 days"'
);
trustBarLiquid = trustBarLiquid.replace(
  '"text": "Secure Packaging"',
  '"text": "Secure<br>Packaging"'
);
trustBarLiquid = trustBarLiquid.replace(
  '"text": "Flat shipping ₹99 per order"',
  '"text": "Flat shipping<br>₹99 per order"'
);

fs.writeFileSync(trustBarLiquidPath, trustBarLiquid, 'utf8');
console.log('Updated sections/pdp-trust-bar.liquid presets');
