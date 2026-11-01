const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Work/GraffeineTales/GraffeineTalesTheme';

// ==========================================
// 1. CREATE snippets/cart-payment-icons.liquid
// ==========================================
const snippetPath = path.join(rootDir, 'snippets/cart-payment-icons.liquid');
const snippetContent = `{% liquid
  assign raw_icons = section.settings.payment_icons_list
  if raw_icons == blank
    assign raw_icons = settings.cart_payment_icons | default: 'visa,master,upi,rupay'
  endif
  assign icons = raw_icons | split: ','
  assign secure_text = section.settings.secure_label | default: settings.cart_secure_label | default: '100% Secured Payments'
%}
<div class="payment-trust-row">
  <div class="payment-logos-list" aria-label="Accepted payment methods">
    {% for icon in icons %}
      {% assign key = icon | strip | downcase %}
      {% case key %}
        {% when 'visa' %}
          <span class="pay-logo-badge pay-logo-badge--visa" title="Visa">
            <svg viewBox="0 0 48 24" width="46" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
              <path d="M19.4 3.5L14.2 19.5H9.6L6.2 7.1C5.9 5.8 5.6 5.4 4.5 4.7C2.9 3.8 0.8 3 0 2.8L0.1 2.5H7.7C9.3 2.5 10.7 3.6 11 5.3L13.1 16.5L17.3 3.5H19.4ZM36.5 14.3C36.5 8.9 29.1 8.6 29.2 6.1C29.2 5.3 30 4.5 31.6 4.3C32.4 4.2 34.6 4.1 36.6 5.1L37.3 1.8C36.3 1.4 34.9 1 33.2 1C29.2 1 26.3 3.1 26.3 6.2C26.2 10.7 33.6 11 33.6 13.5C33.6 14.5 32.7 15.3 30.9 15.4C29.2 15.5 27.2 15 25.9 14.3L25.1 17.7C26.5 18.3 29 18.9 31.5 18.9C35.7 18.9 36.5 16.8 36.5 14.3ZM47.4 19.5H51.4L47.9 3.5H44.2C43.3 3.5 42.6 4 42.3 4.8L36.1 19.5H40.7L41.6 17H47.2L47.4 19.5ZM42.8 13.6L45.1 7.4L46.4 13.6H42.8ZM26.2 3.5L22.6 19.5H18.2L21.8 3.5H26.2Z" fill="#1A1F71"/>
              <path d="M7.7 2.5H0.1L0 2.8C3.1 3.4 6 5.2 7.7 8.1L9.1 2.5H7.7Z" fill="#F7B600"/>
            </svg>
          </span>
        {% when 'master' or 'mastercard' %}
          <span class="pay-logo-badge pay-logo-badge--mastercard" title="Mastercard">
            <svg viewBox="0 0 38 24" width="36" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
              <rect x="0" y="2" width="22" height="20" rx="10" fill="#EB001B"/>
              <rect x="16" y="2" width="22" height="20" rx="10" fill="#F79E1B"/>
              <path d="M19 4.7C21.4 6.8 23 9.7 23 12C23 14.3 21.4 17.2 19 19.3C16.6 17.2 15 14.3 15 12C15 9.7 16.6 6.8 19 4.7Z" fill="#FF5F00"/>
            </svg>
          </span>
        {% when 'upi' %}
          <span class="pay-logo-badge pay-logo-badge--upi" title="UPI">
            <svg viewBox="0 0 46 22" width="44" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
              <path d="M12.5 3L8.5 18.5H5L9 3H12.5Z" fill="#097939"/>
              <path d="M7 3L3 18.5H0L4 3H7Z" fill="#ED7524"/>
              <text x="14" y="17" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="16" fill="#1A1F71" letter-spacing="-0.5">UPI</text>
            </svg>
          </span>
        {% when 'rupay' %}
          <span class="pay-logo-badge pay-logo-badge--rupay" title="RuPay">
            <svg viewBox="0 0 56 22" width="52" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="RuPay">
              <text x="0" y="17" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-style="italic" font-size="16.5" fill="#003B71" letter-spacing="-0.5">RuPay</text>
              <path d="M49 4L45 18H48L52 4H49Z" fill="#ED7524"/>
              <path d="M53 4L49 18H52L56 4H53Z" fill="#097939"/>
            </svg>
          </span>
        {% when 'paytm' %}
          <span class="pay-logo-badge pay-logo-badge--paytm" title="Paytm">
            <svg viewBox="0 0 48 18" width="46" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Paytm">
              <text x="0" y="14" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="13" fill="#002970">Pay</text>
              <text x="23" y="14" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="13" fill="#00BAF2">tm</text>
            </svg>
          </span>
        {% when 'gpay' or 'google_pay' %}
          <span class="pay-logo-badge pay-logo-badge--gpay" title="Google Pay">
            <svg viewBox="0 0 44 20" width="42" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Pay">
              <path d="M9.8 8.4V11.5H17.2C16.9 13.2 15.3 16.3 11.5 16.3C7.5 16.3 4.2 13 4.2 9C4.2 5 7.5 1.7 11.5 1.7C13.8 1.7 15.3 2.7 16.2 3.5L18.6 1.1C16.8 -0.6 14.4 -1.6 11.5 -1.6C5.6 -1.6 0.8 3.2 0.8 9C0.8 14.8 5.6 19.6 11.5 19.6C17.7 19.6 21.8 15.2 21.8 9.2C21.8 8.5 21.7 7.9 21.5 7.4H9.8V8.4Z" fill="#4285F4"/>
              <text x="21" y="15" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#5F6368">Pay</text>
            </svg>
          </span>
        {% when 'phonepe' %}
          <span class="pay-logo-badge pay-logo-badge--phonepe" title="PhonePe">
            <svg viewBox="0 0 22 22" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PhonePe">
              <circle cx="11" cy="11" r="11" fill="#6739B7"/>
              <path d="M12.8 5H9.4V8.4H11.5C12.4 8.4 13.1 8.8 13.1 9.7C13.1 10.6 12.4 11 11.5 11H9.4V17H7.2V5H12.8C14.2 5 15.4 6 15.4 7.5C15.4 8.8 14.4 9.8 13.2 10.1C14.7 10.5 15.8 11.8 15.8 13.4V17H13.6V13.6C13.6 12.5 12.7 11.7 11.6 11.7H9.4" stroke="white" stroke-width="1.2" fill="white"/>
            </svg>
          </span>
        {% when 'apple_pay' %}
          <span class="pay-logo-badge pay-logo-badge--apple" title="Apple Pay">
            <svg viewBox="0 0 42 20" width="40" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Apple Pay">
              <path d="M6.3 3.8C6.9 3.1 7.3 2.1 7.2 1C6.3 1.1 5.2 1.6 4.6 2.3C4.1 2.9 3.6 3.9 3.8 5C4.8 5.1 5.8 4.5 6.3 3.8ZM7.2 5.1C5.8 5.1 4.7 5.9 4 5.9C3.3 5.9 2.3 5.2 1.3 5.2C-0.3 5.2 -1.4 6.7 -1.4 9.3C-1.4 12 0.8 16 2.4 16C3.2 16 3.9 15.4 4.8 15.4C5.7 15.4 6.3 16 7.2 16C8.8 16 9.9 12.3 9.9 12.2C9.8 12.1 7.8 11.3 7.8 9C7.8 7.1 9.4 6.1 9.5 6C8.5 4.6 7 4.5 6.6 4.5" fill="#000000"/>
              <text x="14" y="14" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="13" fill="#000000">Pay</text>
            </svg>
          </span>
        {% else %}
          {% if shop.enabled_payment_types contains key %}
            <span class="pay-logo-badge">{{ key | payment_type_svg_tag }}</span>
          {% endif %}
      {% endcase %}
    {% endfor %}
  </div>
  {% if section.settings.show_secure_badge != false %}
    <div class="secured-shield">
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M9 0.5L1.5 3.5V9C1.5 14.25 4.7 19.12 9 20C13.3 19.12 16.5 14.25 16.5 9V3.5L9 0.5Z" fill="url(#blue_shield_grad)"/>
        <path d="M5.8 10L8 12.2L12.2 7.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="blue_shield_grad" x1="1.5" y1="0.5" x2="16.5" y2="20" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A90E2"/>
            <stop offset="1" stop-color="#1877F2"/>
          </linearGradient>
        </defs>
      </svg>
      <span>{{ secure_text | escape }}</span>
    </div>
  {% endif %}
</div>
`;
fs.writeFileSync(snippetPath, snippetContent, 'utf8');
console.log('Created snippets/cart-payment-icons.liquid');

// ==========================================
// 2. UPDATE sections/cart-drawer.liquid
// Replace old payment trust row with the new snippet call and add schema settings
// ==========================================
const cartLiquidPath = path.join(rootDir, 'sections/cart-drawer.liquid');
let cartLiquid = fs.readFileSync(cartLiquidPath, 'utf8').replace(/\r\n/g, '\n');

// Replace line 115 payment trust row
const oldTrustRowRegex = /<div class="payment-trust-row">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const newTrustRowMarkup = `{% liquid
        assign show_pay = true
        if section.settings.show_payment_icons != nil
          assign show_pay = section.settings.show_payment_icons
        elsif settings.cart_show_payment_icons != nil
          assign show_pay = settings.cart_show_payment_icons
        endif
      %}
      {% if show_pay %}
        {% render 'cart-payment-icons', section: section %}
      {% endif %}
    </section>`;

if (oldTrustRowRegex.test(cartLiquid)) {
  cartLiquid = cartLiquid.replace(oldTrustRowRegex, newTrustRowMarkup);
}

// Add customizer settings in cart-drawer schema for payment icons list & security badge
const oldPaymentSchema = `    {
      "type": "checkbox",
      "id": "show_payment_icons",
      "label": "Show active payment methods",
      "default": true
    },
    {
      "type": "text",
      "id": "secure_label",
      "label": "Payment security label",
      "default": "Secure Shopify checkout"
    },`;

const newPaymentSchema = `    {
      "type": "checkbox",
      "id": "show_payment_icons",
      "label": "Show payment icons & security badge",
      "default": true
    },
    {
      "type": "text",
      "id": "payment_icons_list",
      "label": "Payment icons list (comma-separated)",
      "default": "visa,master,upi,rupay",
      "info": "Supported: visa, master, upi, rupay, paytm, gpay, phonepe, apple_pay. Or leave empty for Shopify gateway icons."
    },
    {
      "type": "text",
      "id": "secure_label",
      "label": "Payment security label",
      "default": "100% Secured Payments"
    },
    {
      "type": "checkbox",
      "id": "show_secure_badge",
      "label": "Show security badge on right",
      "default": true
    },`;

if (cartLiquid.includes(oldPaymentSchema)) {
  cartLiquid = cartLiquid.replace(oldPaymentSchema, newPaymentSchema);
}

fs.writeFileSync(cartLiquidPath, cartLiquid, 'utf8');
console.log('Updated sections/cart-drawer.liquid');

// ==========================================
// 3. UPDATE assets/atelier-cart-drawer.css
// Styling for payment-trust-row matching Image 2
// ==========================================
const cartDrawerCssPath = path.join(rootDir, 'assets/atelier-cart-drawer.css');
let cartDrawerCss = fs.readFileSync(cartDrawerCssPath, 'utf8').replace(/\r\n/g, '\n');

const paymentTrustRowCss = `
/* Payment trust row matching reference (Image 2) */
cart-drawer.atelier-cart .payment-trust-row {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px !important;
  margin-top: 14px !important;
  padding-top: 14px !important;
  border-top: 1px solid #ECE4D8 !important;
  flex-wrap: wrap !important;
}

cart-drawer.atelier-cart .payment-logos-list {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  flex-wrap: wrap !important;
}

cart-drawer.atelier-cart .pay-logo-badge {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 22px !important;
}

cart-drawer.atelier-cart .pay-logo-badge svg {
  height: 18px !important;
  width: auto !important;
  max-width: 54px !important;
  object-fit: contain !important;
  display: block !important;
}

cart-drawer.atelier-cart .secured-shield {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 12.8px !important;
  font-weight: 600 !important;
  color: #1A5276 !important;
  letter-spacing: -0.01em !important;
  white-space: nowrap !important;
}

cart-drawer.atelier-cart .secured-shield svg {
  width: 17px !important;
  height: 19px !important;
  flex-shrink: 0 !important;
}

@media (max-width: 420px) {
  cart-drawer.atelier-cart .payment-trust-row {
    justify-content: center !important;
    gap: 10px !important;
  }
}
`;
cartDrawerCss += paymentTrustRowCss;
fs.writeFileSync(cartDrawerCssPath, cartDrawerCss, 'utf8');
console.log('Updated assets/atelier-cart-drawer.css');

// ==========================================
// 4. UPDATE assets/atelier-header.css
// Ensure all header typography rules strictly use theme font variables
// ==========================================
const headerCssPath = path.join(rootDir, 'assets/atelier-header.css');
let headerCss = fs.readFileSync(headerCssPath, 'utf8').replace(/\r\n/g, '\n');

// Replace hardcoded 'Inter' and 'DM Serif Display' with CSS variables
headerCss = headerCss.replace(/font-family:'Inter',sans-serif/g, 'font-family:var(--font-body-family, "Inter", sans-serif)');
headerCss = headerCss.replace(/font:600 10px\/1\.5 'Inter',sans-serif/g, 'font:600 10px/1.5 var(--font-body-family, "Inter", sans-serif)');
headerCss = headerCss.replace(/font:400 16px\/1\.4 'DM Serif Display',Georgia,serif/g, 'font:400 16px/1.4 var(--font-heading-family, "DM Serif Display", serif)');
headerCss = headerCss.replace(/font:400 28px\/1\.15 'DM Serif Display',Georgia,serif/g, 'font:400 28px/1.15 var(--font-heading-family, "DM Serif Display", serif)');

const headerThemeFontRules = `
/* Match Theme Font Hierarchy */
atelier-header,
.atelier-header,
.atelier-header__menu,
.atelier-header__dropdown > summary,
.atelier-header__top-link,
.atelier-header__submenu,
.atelier-header__submenu a,
.atelier-header__explore,
.atelier-header__mobile-drawer,
.atelier-header__mobile-group > summary,
.atelier-header__mobile-item a,
.atelier-header__mobile-footer-link {
  font-family: var(--font-body-family, "Inter", sans-serif) !important;
  font-size: var(--header-menu-size, 14px);
  font-weight: var(--header-menu-weight, 500);
  text-transform: var(--header-menu-transform, none);
}

.atelier-header__drawer-heading h2,
.atelier-header__feature strong {
  font-family: var(--font-heading-family, "DM Serif Display", Georgia, serif) !important;
}
`;
headerCss += headerThemeFontRules;
fs.writeFileSync(headerCssPath, headerCss, 'utf8');
console.log('Updated assets/atelier-header.css');

// ==========================================
// 5. UPDATE sections/atelier-header.liquid
// Add customizer settings for menu font size, weight, and text-transform
// ==========================================
const headerLiquidPath = path.join(rootDir, 'sections/atelier-header.liquid');
let headerLiquid = fs.readFileSync(headerLiquidPath, 'utf8').replace(/\r\n/g, '\n');

// Pass menu font variables in atelier-header style
headerLiquid = headerLiquid.replace(
  /(--header-width:\{\{\s*section\.settings\.width\s*\}\}px)/,
  `$1;--header-menu-size:{{ section.settings.menu_font_size | default: 14 }}px;--header-menu-weight:{{ section.settings.menu_font_weight | default: 500 }};--header-menu-transform:{{ section.settings.menu_text_transform | default: 'none' }}`
);

// Add customizer settings in schema
const headerSchemaInsertTarget = `    {
      "type": "select",
      "id": "sticky",`;

const headerFontSettings = `    {
      "type": "range",
      "id": "menu_font_size",
      "label": "Menu font size",
      "min": 12,
      "max": 18,
      "step": 1,
      "unit": "px",
      "default": 14
    },
    {
      "type": "select",
      "id": "menu_font_weight",
      "label": "Menu font weight",
      "options": [
        { "value": "400", "label": "Normal (400)" },
        { "value": "500", "label": "Medium (500)" },
        { "value": "600", "label": "Semi-bold (600)" },
        { "value": "700", "label": "Bold (700)" }
      ],
      "default": "500"
    },
    {
      "type": "select",
      "id": "menu_text_transform",
      "label": "Menu text casing",
      "options": [
        { "value": "none", "label": "Default (Normal)" },
        { "value": "uppercase", "label": "Uppercase" },
        { "value": "capitalize", "label": "Capitalize" }
      ],
      "default": "none"
    },
`;

if (headerLiquid.includes(headerSchemaInsertTarget)) {
  headerLiquid = headerLiquid.replace(headerSchemaInsertTarget, headerFontSettings + headerSchemaInsertTarget);
}
fs.writeFileSync(headerLiquidPath, headerLiquid, 'utf8');
console.log('Updated sections/atelier-header.liquid');

// ==========================================
// 6. UPDATE config/settings_schema.json
// Add theme-level Cart Payment Icons settings
// ==========================================
const schemaJsonPath = path.join(rootDir, 'config/settings_schema.json');
let schemaJson = JSON.parse(fs.readFileSync(schemaJsonPath, 'utf8'));

// Check if a Cart Payment Icons section already exists in schema
let cartPaymentSection = schemaJson.find(s => s.name === 'Cart Payment Icons' || s.name === 'Cart Payment Badges');
if (!cartPaymentSection) {
  schemaJson.push({
    name: "Cart Payment Icons",
    settings: [
      {
        type: "checkbox",
        id: "cart_show_payment_icons",
        label: "Show payment icons in cart",
        default: true
      },
      {
        type: "text",
        id: "cart_payment_icons",
        label: "Payment icons list (comma-separated)",
        default: "visa,master,upi,rupay",
        info: "Enter comma-separated icon codes: visa, master, upi, rupay, paytm, gpay, phonepe, apple_pay"
      },
      {
        type: "text",
        id: "cart_secure_label",
        label: "Security badge label",
        default: "100% Secured Payments"
      }
    ]
  });
}
fs.writeFileSync(schemaJsonPath, JSON.stringify(schemaJson, null, 2), 'utf8');
console.log('Updated config/settings_schema.json');

// ==========================================
// 7. UPDATE config/settings_data.json
// ==========================================
const dataJsonPath = path.join(rootDir, 'config/settings_data.json');
let dataContent = fs.readFileSync(dataJsonPath, 'utf8');
let leadComment = '';
const match = dataContent.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
if (match) {
  leadComment = match[0];
  dataContent = dataContent.substring(leadComment.length);
}
let dataJson = JSON.parse(dataContent);
if (dataJson.current) {
  dataJson.current.cart_show_payment_icons = true;
  dataJson.current.cart_payment_icons = "visa,master,upi,rupay";
  dataJson.current.cart_secure_label = "100% Secured Payments";

  // Also update cart-drawer section settings in settings_data.json
  if (dataJson.current.sections && dataJson.current.sections['cart-drawer'] && dataJson.current.sections['cart-drawer'].settings) {
    const s = dataJson.current.sections['cart-drawer'].settings;
    s.show_payment_icons = true;
    s.payment_icons_list = "visa,master,upi,rupay";
    s.secure_label = "100% Secured Payments";
    s.show_secure_badge = true;
  }
}
fs.writeFileSync(dataJsonPath, leadComment + JSON.stringify(dataJson, null, 2), 'utf8');
console.log('Updated config/settings_data.json');

// ==========================================
// 8. UPDATE sections/header-group.json
// ==========================================
const headerGroupPath = path.join(rootDir, 'sections/header-group.json');
let headerGroupContent = fs.readFileSync(headerGroupPath, 'utf8');
let hgLeadComment = '';
const hgMatch = headerGroupContent.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
if (hgMatch) {
  hgLeadComment = hgMatch[0];
  headerGroupContent = headerGroupContent.substring(hgLeadComment.length);
}
let headerGroupJson = JSON.parse(headerGroupContent);
if (headerGroupJson.sections && headerGroupJson.sections.header && headerGroupJson.sections.header.settings) {
  headerGroupJson.sections.header.settings.menu_font_size = 14;
  headerGroupJson.sections.header.settings.menu_font_weight = "500";
  headerGroupJson.sections.header.settings.menu_text_transform = "none";
}
fs.writeFileSync(headerGroupPath, hgLeadComment + JSON.stringify(headerGroupJson, null, 2), 'utf8');
console.log('Updated sections/header-group.json');
