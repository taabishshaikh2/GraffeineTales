const fs = require('fs');
let content = fs.readFileSync('sections/product-editorial.liquid', 'utf8');

const target = '"purchase_padding",\n      "label": "Card inner spacing",\n      "min": 20,\n      "max": 48,\n      "step": 2,\n      "unit": "px",\n      "default": 36\n    },';

const addition = '\n    {\n      "type": "range",\n      "id": "description_top_spacing",\n      "label": "Description top spacing (desktop)",\n      "min": 0,\n      "max": 60,\n      "step": 2,\n      "default": 24,\n      "unit": "px"\n    },\n    {\n      "type": "range",\n      "id": "mobile_description_top_spacing",\n      "label": "Description top spacing (mobile)",\n      "min": 0,\n      "max": 60,\n      "step": 2,\n      "default": 20,\n      "unit": "px"\n    },';

const normalized = content.replace(/\r\n/g, '\n');
if (normalized.includes(target)) {
  content = normalized.replace(target, target + addition);
  fs.writeFileSync('sections/product-editorial.liquid', content, 'utf8');
  console.log('Successfully inserted description spacing settings into product-editorial.liquid schema');
} else {
  console.log('Target not found in normalized content');
}
