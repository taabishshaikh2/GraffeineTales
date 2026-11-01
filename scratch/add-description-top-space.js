const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Work/GraffeineTales/GraffeineTalesTheme';

// 1. Update sections/product-editorial.liquid
const pdpLiquidPath = path.join(rootDir, 'sections/product-editorial.liquid');
let pdpLiquid = fs.readFileSync(pdpLiquidPath, 'utf8').replace(/\r\n/g, '\n');

// Add CSS variables to style attribute of product-hero
const styleSearch = '--pdp-purchase-padding:{{ section.settings.purchase_padding }}px';
const styleReplace = '--pdp-purchase-padding:{{ section.settings.purchase_padding }}px;--pdp-desc-top:{{ section.settings.description_top_spacing | default: 24 }}px;--pdp-mobile-desc-top:{{ section.settings.mobile_description_top_spacing | default: 20 }}px';

if (pdpLiquid.includes(styleSearch) && !pdpLiquid.includes('--pdp-desc-top:')) {
  pdpLiquid = pdpLiquid.replace(styleSearch, styleReplace);
}

// Add schema settings under Layout and appearance / Information card
const schemaTarget = `    {
      "type": "range",
      "id": "purchase_padding",`;

const schemaNewSettings = `    {
      "type": "range",
      "id": "description_top_spacing",
      "label": "Description top spacing (desktop)",
      "min": 0,
      "max": 60,
      "step": 2,
      "default": 24,
      "unit": "px"
    },
    {
      "type": "range",
      "id": "mobile_description_top_spacing",
      "label": "Description top spacing (mobile)",
      "min": 0,
      "max": 60,
      "step": 2,
      "default": 20,
      "unit": "px"
    },
`;

if (pdpLiquid.includes(schemaTarget) && !pdpLiquid.includes('description_top_spacing')) {
  pdpLiquid = pdpLiquid.replace(schemaTarget, schemaNewSettings + schemaTarget);
}

fs.writeFileSync(pdpLiquidPath, pdpLiquid, 'utf8');
console.log('Updated sections/product-editorial.liquid');

// 2. Update assets/product-hero.css
const cssPath = path.join(rootDir, 'assets/product-hero.css');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

const descRule = `
/* PDP Description Spacing */
.atelier-pdp__description {
  margin-top: var(--pdp-desc-top, 24px) !important;
  margin-bottom: 24px !important;
}
@media (max-width: 749px) {
  .atelier-pdp__description {
    margin-top: var(--pdp-mobile-desc-top, 20px) !important;
  }
}
`;

if (!css.includes('PDP Description Spacing')) {
  css += descRule;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Updated assets/product-hero.css');
}

// 3. Update templates/product.json
const productJsonPath = path.join(rootDir, 'templates/product.json');
let productJsonContent = fs.readFileSync(productJsonPath, 'utf8');
let leadComment = '';
const match = productJsonContent.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
if (match) {
  leadComment = match[0];
  productJsonContent = productJsonContent.substring(leadComment.length);
}
let productJson = JSON.parse(productJsonContent);
if (productJson.sections && productJson.sections['product-editorial'] && productJson.sections['product-editorial'].settings) {
  productJson.sections['product-editorial'].settings.description_top_spacing = 24;
  productJson.sections['product-editorial'].settings.mobile_description_top_spacing = 20;
}
fs.writeFileSync(productJsonPath, leadComment + JSON.stringify(productJson, null, 2), 'utf8');
console.log('Updated templates/product.json');
