const fs = require('fs');
const file = 'D:/Work/GraffeineTales/GraffeineTalesTheme/sections/atelier-header.liquid';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix menu_letter_spacing unit
content = content.replace(
  /"id":\s*"menu_letter_spacing"[\s\S]*?"default":\s*10/,
  `"id": "menu_letter_spacing",
      "label": "Letter spacing",
      "min": 0,
      "max": 6,
      "step": 1,
      "unit": "px",
      "default": 1`
);

// 2. Fix sticky setting to be string select
content = content.replace(
  /{\s*"type":\s*"checkbox",\s*"id":\s*"sticky",\s*"label":\s*"Stay at top when scrolling \(sticky\)",\s*"default":\s*true\s*}/,
  `{
      "type": "select",
      "id": "sticky",
      "label": "Sticky header",
      "default": "always",
      "options": [
        { "value": "always", "label": "Always sticky" },
        { "value": "scroll_up", "label": "On scroll up only" },
        { "value": "none", "label": "None" }
      ]
    }`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed atelier-header.liquid schema');
