const fs = require('fs');
const path = require('path');

const file = 'D:/Work/GraffeineTales/GraffeineTalesTheme/sections/about-story.liquid';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/"id":\s*"mobile_heading_size"([\s\S]*?)"default":\s*29/, '"id": "mobile_heading_size"$1"default": 28');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed about-story.liquid');
