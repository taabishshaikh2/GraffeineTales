const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Work/GraffeineTales/GraffeineTalesTheme';

// 1. Update assets/atelier-whatsapp.css
const waCssPath = path.join(rootDir, 'assets/atelier-whatsapp.css');
let waCss = fs.readFileSync(waCssPath, 'utf8');

const oldWrapperRule = `/* WhatsApp Floating Widget */
.atelier-whatsapp-wrapper {
  position: fixed;
  left: 20px;
  bottom: calc(24px + var(--wa-bottom-offset, 0px));
  z-index: 52;
  transition: bottom 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}`;

const newWrapperRule = `/* WhatsApp Floating Widget */
.atelier-whatsapp-wrapper {
  position: fixed;
  bottom: calc(24px + var(--wa-bottom-offset, 0px));
  z-index: 52;
  transition: bottom 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.atelier-whatsapp-wrapper--bottom-left,
.atelier-whatsapp-wrapper--left {
  left: 20px;
  right: auto;
}

.atelier-whatsapp-wrapper--bottom-right,
.atelier-whatsapp-wrapper--right {
  right: 20px;
  left: auto;
}

.atelier-whatsapp-wrapper--bottom-right .atelier-whatsapp-widget__tooltip,
.atelier-whatsapp-wrapper--right .atelier-whatsapp-widget__tooltip {
  left: auto;
  right: calc(100% + 12px);
  transform: translateY(-50%) translateX(6px);
}

.atelier-whatsapp-wrapper--bottom-right .atelier-whatsapp-widget__tooltip::before,
.atelier-whatsapp-wrapper--right .atelier-whatsapp-widget__tooltip::before {
  right: auto;
  left: 100%;
  border-right-color: transparent;
  border-left-color: #2b2523;
}

.atelier-whatsapp-wrapper--bottom-right .atelier-whatsapp-widget:hover .atelier-whatsapp-widget__tooltip,
.atelier-whatsapp-wrapper--right .atelier-whatsapp-widget:hover .atelier-whatsapp-widget__tooltip {
  transform: translateY(-50%) translateX(0);
}`;

if (waCss.includes(oldWrapperRule)) {
  waCss = waCss.replace(oldWrapperRule, newWrapperRule);
} else {
  // Try CRLF / LF normalization
  const normalizedWaCss = waCss.replace(/\r\n/g, '\n');
  const normalizedOld = oldWrapperRule.replace(/\r\n/g, '\n');
  if (normalizedWaCss.includes(normalizedOld)) {
    waCss = normalizedWaCss.replace(normalizedOld, newWrapperRule);
  }
}

const oldMobileRule = `  body:not(.template-product) .atelier-whatsapp-wrapper {
    bottom: calc(var(--dock-height, 60px) + env(safe-area-inset-bottom, 0px) + 16px + var(--wa-bottom-offset, 0px));
    left: 16px;
  }`;

const newMobileRule = `  body:not(.template-product) .atelier-whatsapp-wrapper {
    bottom: calc(var(--dock-height, 60px) + env(safe-area-inset-bottom, 0px) + 16px + var(--wa-bottom-offset, 0px));
  }
  body:not(.template-product) .atelier-whatsapp-wrapper--bottom-left,
  body:not(.template-product) .atelier-whatsapp-wrapper--left {
    left: 16px;
    right: auto;
  }
  body:not(.template-product) .atelier-whatsapp-wrapper--bottom-right,
  body:not(.template-product) .atelier-whatsapp-wrapper--right {
    right: 16px;
    left: auto;
  }`;

waCss = waCss.replace(/\r\n/g, '\n');
if (waCss.includes(oldMobileRule.replace(/\r\n/g, '\n'))) {
  waCss = waCss.replace(oldMobileRule.replace(/\r\n/g, '\n'), newMobileRule);
}

fs.writeFileSync(waCssPath, waCss, 'utf8');
console.log('Updated atelier-whatsapp.css successfully');

// 2. Update assets/atelier-whatsapp.js to reinit on shopify section load
const waJsPath = path.join(rootDir, 'assets/atelier-whatsapp.js');
let waJs = fs.readFileSync(waJsPath, 'utf8').replace(/\r\n/g, '\n');
if (!waJs.includes('shopify:section:load')) {
  waJs = waJs.replace(
    'document.addEventListener(\'DOMContentLoaded\', initWhatsApp);',
    `document.addEventListener('DOMContentLoaded', initWhatsApp);
    document.addEventListener('shopify:section:load', initWhatsApp);`
  );
  fs.writeFileSync(waJsPath, waJs, 'utf8');
  console.log('Updated atelier-whatsapp.js with shopify:section:load');
}

// 3. Update snippets/whatsapp-widget.liquid
const waSnippetPath = path.join(rootDir, 'snippets/whatsapp-widget.liquid');
const waSnippetContent = `{% liquid
  assign wa_enabled = true
  if section.settings.show_whatsapp != nil
    assign wa_enabled = section.settings.show_whatsapp
  elsif settings.enable_whatsapp != nil
    assign wa_enabled = settings.enable_whatsapp
  endif

  assign raw_phone = section.settings.whatsapp_number
  if raw_phone == blank
    assign raw_phone = settings.whatsapp_number | default: '919876543210'
  endif
  assign wa_phone = raw_phone | remove: '+' | remove: ' ' | remove: '-'

  assign raw_msg = section.settings.whatsapp_message
  if raw_msg == blank
    assign raw_msg = settings.whatsapp_message | default: 'Hi Graffeine Tales! I have a question about your collection.'
  endif
  assign wa_message = raw_msg | url_encode

  assign wa_pos = section.settings.whatsapp_position
  if wa_pos == blank
    assign wa_pos = settings.whatsapp_position | default: 'bottom-left'
  endif
%}
{% if wa_enabled %}
  <aside class="atelier-whatsapp-wrapper atelier-whatsapp-wrapper--{{ wa_pos }}" aria-label="Customer support" data-whatsapp-position="{{ wa_pos }}">
    <a
      href="https://wa.me/{{ wa_phone }}?text={{ wa_message }}"
      class="atelier-whatsapp-widget"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Graffeine Tales on WhatsApp"
      data-whatsapp-widget
    >
      <span class="atelier-whatsapp-widget__pulse" aria-hidden="true"></span>
      <span class="atelier-whatsapp-widget__icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 2.656.738 5.143 2.022 7.27L2.24 29.232a1 1 0 0 0 1.22 1.22l6.09-1.74A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm-3.14 7.64c-.31-.69-.64-.7-.94-.71-.24-.01-.52-.01-.8-.01s-.73.1-1.11.52c-.38.41-1.46 1.43-1.46 3.49s1.49 4.05 1.7 4.33c.2.27 2.87 4.59 7.08 6.26 3.5 1.39 4.22 1.11 4.98 1.04.76-.07 2.45-1 2.8-1.97.35-.96.35-1.79.24-1.97-.1-.17-.38-.27-.8-.48s-2.45-1.21-2.83-1.35c-.38-.14-.66-.21-.94.21-.28.41-1.07 1.35-1.31 1.63-.24.27-.48.31-.9.1-.41-.21-1.75-.64-3.33-2.05-1.23-1.1-2.06-2.46-2.3-2.88-.24-.41-.03-.64.18-.84.19-.19.41-.48.62-.73.21-.24.28-.41.41-.69.14-.28.07-.52-.03-.73-.11-.2-1.01-2.49-1.41-3.41Z"/>
        </svg>
      </span>
      <span class="atelier-whatsapp-widget__tooltip" role="tooltip">Chat with us</span>
    </a>
  </aside>
{% endif %}
`;
fs.writeFileSync(waSnippetPath, waSnippetContent, 'utf8');
console.log('Updated snippets/whatsapp-widget.liquid');

// 4. Update sections/atelier-footer.liquid
const footerLiquidPath = path.join(rootDir, 'sections/atelier-footer.liquid');
let footerLiquid = fs.readFileSync(footerLiquidPath, 'utf8').replace(/\r\n/g, '\n');

// Style tag in footer div
const oldFooterDiv = `<div class="atelier-footer" id="main-footer" style="--footer-background:{{ section.settings.background }};--footer-text:{{ section.settings.text }};`;
const newFooterDiv = `<div class="atelier-footer" id="main-footer" style="--footer-background:{{ section.settings.background }};{% if section.settings.footer_background_image != blank %}--footer-bg-image:url('{{ section.settings.footer_background_image | image_url: width: 2400 }}');{% endif %}--footer-text:{{ section.settings.text }};`;

if (footerLiquid.includes(oldFooterDiv)) {
  footerLiquid = footerLiquid.replace(oldFooterDiv, newFooterDiv);
}

// Add whatsapp-widget render before closing </div> of atelier-footer if not already there
if (!footerLiquid.includes("{% render 'whatsapp-widget'")) {
  footerLiquid = footerLiquid.replace(
    '  </div>\n</div>\n{% schema %}',
    '  </div>\n  {% render \'whatsapp-widget\', section: section %}\n</div>\n{% schema %}'
  );
}

// Schema update in atelier-footer.liquid
// Replace "Artwork" header section and add "WhatsApp chat widget"
const oldArtworkSection = `    {
      "type": "header",
      "content": "Artwork"
    },
    {
      "type": "checkbox",
      "id": "show_vines",
      "label": "Show botanical corners",
      "default": true
    },
    {
      "type": "image_picker",
      "id": "vine_left",
      "label": "Left botanical image"
    },
    {
      "type": "image_picker",
      "id": "vine_right",
      "label": "Right botanical image"
    },
    {
      "type": "checkbox",
      "id": "show_desk",
      "label": "Show illustrated desk border",
      "default": true
    },
    {
      "type": "image_picker",
      "id": "desk_image",
      "label": "Desk illustration"
    },
    {
      "type": "range",
      "id": "art_crop_top",
      "label": "Trim illustration top",
      "min": 0,
      "max": 30,
      "step": 1,
      "unit": "%",
      "default": 17
    },
    {
      "type": "checkbox",
      "id": "show_flourishes",
      "label": "Show bottom floral artwork",
      "default": true
    },
    {
      "type": "image_picker",
      "id": "flourish_left",
      "label": "Bottom left artwork"
    },
    {
      "type": "image_picker",
      "id": "flourish_right",
      "label": "Bottom right artwork"
    },`;

const newArtworkSection = `    {
      "type": "header",
      "content": "Footer background & artwork"
    },
    {
      "type": "image_picker",
      "id": "footer_background_image",
      "label": "Footer background image",
      "info": "Upload an overall background image or texture for the entire footer."
    },
    {
      "type": "checkbox",
      "id": "show_desk",
      "label": "Show desk stationery illustration banner",
      "default": true
    },
    {
      "type": "image_picker",
      "id": "desk_image",
      "label": "Desk illustration / banner art image",
      "info": "Upload custom artwork to replace the stationery desk illustration banner above the bottom bar."
    },
    {
      "type": "range",
      "id": "art_crop_top",
      "label": "Trim illustration top",
      "min": 0,
      "max": 30,
      "step": 1,
      "unit": "%",
      "default": 17
    },
    {
      "type": "checkbox",
      "id": "show_vines",
      "label": "Show botanical corners",
      "default": true
    },
    {
      "type": "image_picker",
      "id": "vine_left",
      "label": "Left botanical image"
    },
    {
      "type": "image_picker",
      "id": "vine_right",
      "label": "Right botanical image"
    },
    {
      "type": "checkbox",
      "id": "show_flourishes",
      "label": "Show bottom floral artwork",
      "default": true
    },
    {
      "type": "image_picker",
      "id": "flourish_left",
      "label": "Bottom left artwork"
    },
    {
      "type": "image_picker",
      "id": "flourish_right",
      "label": "Bottom right artwork"
    },
    {
      "type": "header",
      "content": "WhatsApp chat widget"
    },
    {
      "type": "checkbox",
      "id": "show_whatsapp",
      "label": "Show WhatsApp floating button",
      "default": true,
      "info": "Displays the floating WhatsApp button across the storefront."
    },
    {
      "type": "select",
      "id": "whatsapp_position",
      "label": "Widget position",
      "options": [
        {
          "value": "bottom-left",
          "label": "Bottom left (recommended)"
        },
        {
          "value": "bottom-right",
          "label": "Bottom right"
        }
      ],
      "default": "bottom-left",
      "info": "Choose whether the button floats at the bottom-left or bottom-right."
    },
    {
      "type": "text",
      "id": "whatsapp_number",
      "label": "WhatsApp phone number",
      "default": "919876543210",
      "info": "Enter number with country code, without + or spaces (e.g. 919876543210)."
    },
    {
      "type": "text",
      "id": "whatsapp_message",
      "label": "Default WhatsApp message",
      "default": "Hi Graffeine Tales! I have a question about your collection."
    },`;

if (footerLiquid.includes(oldArtworkSection)) {
  footerLiquid = footerLiquid.replace(oldArtworkSection, newArtworkSection);
}

fs.writeFileSync(footerLiquidPath, footerLiquid, 'utf8');
console.log('Updated sections/atelier-footer.liquid');

// 5. Update layout/theme.liquid to avoid rendering whatsapp-widget twice
const themeLiquidPath = path.join(rootDir, 'layout/theme.liquid');
let themeLiquid = fs.readFileSync(themeLiquidPath, 'utf8').replace(/\r\n/g, '\n');
themeLiquid = themeLiquid.replace(/\s*\{%\s*render\s*'whatsapp-widget'\s*%\}/g, '');
fs.writeFileSync(themeLiquidPath, themeLiquid, 'utf8');
console.log('Updated layout/theme.liquid');

// 6. Update config/settings_schema.json to add whatsapp_position
const schemaPath = path.join(rootDir, 'config/settings_schema.json');
let schemaJson = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const waSection = schemaJson.find(s => s.name === 'WhatsApp Support');
if (waSection && !waSection.settings.some(s => s.id === 'whatsapp_position')) {
  waSection.settings.splice(1, 0, {
    type: "select",
    id: "whatsapp_position",
    label: "Widget position",
    options: [
      {
        value: "bottom-left",
        label: "Bottom left (recommended)"
      },
      {
        value: "bottom-right",
        label: "Bottom right"
      }
    ],
    default: "bottom-left"
  });
}
fs.writeFileSync(schemaPath, JSON.stringify(schemaJson, null, 2), 'utf8');
console.log('Updated config/settings_schema.json');

// 7. Update config/settings_data.json
const dataPath = path.join(rootDir, 'config/settings_data.json');
let dataContent = fs.readFileSync(dataPath, 'utf8');
let leadComment = '';
const match = dataContent.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
if (match) {
  leadComment = match[0];
  dataContent = dataContent.substring(leadComment.length);
}
let dataJson = JSON.parse(dataContent);
if (dataJson.current) {
  dataJson.current.whatsapp_position = 'bottom-left';
}
fs.writeFileSync(dataPath, leadComment + JSON.stringify(dataJson, null, 2), 'utf8');
console.log('Updated config/settings_data.json');

// 8. Update sections/footer-group.json
const footerGroupPath = path.join(rootDir, 'sections/footer-group.json');
let footerGroupContent = fs.readFileSync(footerGroupPath, 'utf8');
let fgLeadComment = '';
const fgMatch = footerGroupContent.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
if (fgMatch) {
  fgLeadComment = fgMatch[0];
  footerGroupContent = footerGroupContent.substring(fgLeadComment.length);
}
let footerGroupJson = JSON.parse(footerGroupContent);
if (footerGroupJson.sections && footerGroupJson.sections.footer && footerGroupJson.sections.footer.settings) {
  footerGroupJson.sections.footer.settings.footer_background_image = "";
  footerGroupJson.sections.footer.settings.show_whatsapp = true;
  footerGroupJson.sections.footer.settings.whatsapp_position = "bottom-left";
  footerGroupJson.sections.footer.settings.whatsapp_number = "919876543210";
  footerGroupJson.sections.footer.settings.whatsapp_message = "Hi Graffeine Tales! I have a question about your collection.";
}
fs.writeFileSync(footerGroupPath, fgLeadComment + JSON.stringify(footerGroupJson, null, 2), 'utf8');
console.log('Updated sections/footer-group.json');
