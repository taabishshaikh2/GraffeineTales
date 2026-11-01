const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Work/GraffeineTales/GraffeineTalesTheme';

// 1. Update sections/product-editorial.liquid
const pdpLiquidPath = path.join(rootDir, 'sections/product-editorial.liquid');
let pdpLiquid = fs.readFileSync(pdpLiquidPath, 'utf8').replace(/\r\n/g, '\n');

// Add stylesheet tag at top if not present
if (!pdpLiquid.includes('atelier-pdp-icons.css')) {
  pdpLiquid = "{{ 'atelier-pdp-icons.css' | asset_url | stylesheet_tag }}\n" + pdpLiquid;
}

// Add markup for trust badges right after {% endform %} and before {% if product.description != blank %}
const targetMarkup = `   {% if section.settings.dynamic_checkout %}<div class="atelier-pdp__express">{{ form | payment_button }}</div>{% endif %}
   {% endform %}
   <p data-cart-error role="alert" hidden></p>`;

const trustBarMarkup = `   {% if section.settings.dynamic_checkout %}<div class="atelier-pdp__express">{{ form | payment_button }}</div>{% endif %}
   {% endform %}
   <p data-cart-error role="alert" hidden></p>
   {% assign trust_badge_blocks = section.blocks | where: 'type', 'trust_badge' %}
   {% if trust_badge_blocks.size > 0 %}
     <div class="atelier-trust-bar" style="margin-top: 18px; margin-bottom: 18px;">
       {% for block in trust_badge_blocks %}
         {% if block.settings.text != blank %}
           <div class="atelier-trust-bar__item" {{ block.shopify_attributes }} style="--icon-bg: {{ block.settings.icon_bg }}; --icon-color: {{ block.settings.icon_color }};">
             <div class="atelier-trust-bar__icon-bubble">
               {% render 'atelier-icon-render', icon: block.settings.icon, custom_icon: block.settings.custom_icon %}
             </div>
             <div class="atelier-trust-bar__text">
               {{ block.settings.text }}
             </div>
           </div>
         {% endif %}
       {% endfor %}
     </div>
   {% endif %}`;

if (pdpLiquid.includes(targetMarkup) && !pdpLiquid.includes('trust_badge_blocks')) {
  pdpLiquid = pdpLiquid.replace(targetMarkup, trustBarMarkup);
}

// Add trust_badge block definition in schema
const targetSchemaBlock = `  "blocks": [`;
const trustBadgeBlockSchema = `  "blocks": [
    {
      "type": "trust_badge",
      "name": "Trust badge (Image 2)",
      "settings": [
        {
          "type": "select",
          "id": "icon",
          "label": "Icon",
          "options": [
            { "value": "bag", "label": "Shopping bag / Package" },
            { "value": "shield", "label": "Security shield" },
            { "value": "truck", "label": "Delivery truck" },
            { "value": "heart", "label": "Heart" },
            { "value": "sparkles", "label": "Sparkles / Quality" },
            { "value": "gift", "label": "Gift box" },
            { "value": "leaf", "label": "Leaf / Eco" },
            { "value": "clock", "label": "Clock / Fast dispatch" },
            { "value": "check", "label": "Checkmark" },
            { "value": "lock", "label": "Secure lock" },
            { "value": "return", "label": "Easy return" },
            { "value": "award", "label": "Award / Guarantee" },
            { "value": "smile", "label": "Smile / Friendly" }
          ],
          "default": "bag"
        },
        {
          "type": "image_picker",
          "id": "custom_icon",
          "label": "Custom icon image (optional)"
        },
        {
          "type": "inline_richtext",
          "id": "text",
          "label": "Text",
          "default": "7-10 days from order confirmation / Dispatches in 2-3 business days"
        },
        {
          "type": "color",
          "id": "icon_bg",
          "label": "Icon circle background",
          "default": "#FDF0ED"
        },
        {
          "type": "color",
          "id": "icon_color",
          "label": "Icon symbol color",
          "default": "#9E3B2B"
        }
      ]
    },`;

if (pdpLiquid.includes(targetSchemaBlock) && !pdpLiquid.includes('"type": "trust_badge"')) {
  pdpLiquid = pdpLiquid.replace(targetSchemaBlock, trustBadgeBlockSchema);
}

fs.writeFileSync(pdpLiquidPath, pdpLiquid, 'utf8');
console.log('Updated sections/product-editorial.liquid with trust_badge block');

// 2. Update templates/product.json to include blocks in main and add pdp-features-banner
const productJsonPath = path.join(rootDir, 'templates/product.json');
let productJsonContent = fs.readFileSync(productJsonPath, 'utf8');
let leadComment = '';
const match = productJsonContent.match(/^\s*\/\*[\s\S]*?\*\/\s*/);
if (match) {
  leadComment = match[0];
  productJsonContent = productJsonContent.substring(leadComment.length);
}
let productJson = JSON.parse(productJsonContent);

if (productJson.sections && productJson.sections.main) {
  // Add 3 trust badges to main if not already present
  if (!productJson.sections.main.blocks.trust_badge_1) {
    productJson.sections.main.blocks.trust_badge_1 = {
      type: "trust_badge",
      settings: {
        icon: "bag",
        text: "7-10 days from order confirmation / Dispatches in 2-3 business days",
        icon_bg: "#FDF0ED",
        icon_color: "#9E3B2B"
      }
    };
    productJson.sections.main.blocks.trust_badge_2 = {
      type: "trust_badge",
      settings: {
        icon: "shield",
        text: "Secure Packaging",
        icon_bg: "#FDF0ED",
        icon_color: "#9E3B2B"
      }
    };
    productJson.sections.main.blocks.trust_badge_3 = {
      type: "trust_badge",
      settings: {
        icon: "truck",
        text: "Flat shipping ₹99 per order",
        icon_bg: "#FDF0ED",
        icon_color: "#9E3B2B"
      }
    };

    // Prepend to block_order
    productJson.sections.main.block_order = [
      "trust_badge_1",
      "trust_badge_2",
      "trust_badge_3",
      ...productJson.sections.main.block_order.filter(id => !id.startsWith('trust_badge_'))
    ];
  }
}

// Add pdp-features-banner section to templates/product.json
if (!productJson.sections['pdp-features']) {
  productJson.sections['pdp-features'] = {
    type: "pdp-features-banner",
    blocks: {
      feature_1: {
        type: "feature",
        settings: {
          icon: "heart",
          text: "Quirky, feel-good design",
          icon_bg: "#FDECE8",
          icon_color: "#C0392B"
        }
      },
      feature_2: {
        type: "feature",
        settings: {
          icon: "sparkles",
          text: "Premium print quality",
          icon_bg: "#FEF7E6",
          icon_color: "#D4A017"
        }
      },
      feature_3: {
        type: "feature",
        settings: {
          icon: "gift",
          text: "Perfect for gifting",
          icon_bg: "#FDF0ED",
          icon_color: "#9E3B2B"
        }
      },
      feature_4: {
        type: "feature",
        settings: {
          icon: "leaf",
          text: "Designed with love",
          icon_bg: "#EDF7EE",
          icon_color: "#2D7A3E"
        }
      }
    },
    block_order: ["feature_1", "feature_2", "feature_3", "feature_4"],
    settings: {
      heading: "",
      heading_size: 26,
      mobile_heading_size: 22,
      background: "#FFFFFF",
      border_color: "#EFECE6",
      border_radius: 20,
      padding_y: 24,
      padding_x: 26,
      columns_desktop: "4",
      columns_mobile: "2",
      max_width: 1320,
      padding_top: 24,
      padding_bottom: 24,
      mobile_padding_top: 16,
      mobile_padding_bottom: 16
    }
  };

  // Insert pdp-features right after 'main' in order
  const newOrder = [];
  for (const sId of productJson.order) {
    newOrder.push(sId);
    if (sId === 'main') {
      newOrder.push('pdp-features');
    }
  }
  if (!newOrder.includes('pdp-features')) {
    newOrder.push('pdp-features');
  }
  productJson.order = newOrder;
}

fs.writeFileSync(productJsonPath, leadComment + JSON.stringify(productJson, null, 2), 'utf8');
console.log('Updated templates/product.json with trust badges and pdp-features');
