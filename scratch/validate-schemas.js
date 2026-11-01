const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Work/GraffeineTales/GraffeineTalesTheme';

let hasError = false;

// 1. Validate all JSON files in config and sections
const jsonFiles = [
  'config/settings_schema.json',
  'config/settings_data.json',
  'sections/footer-group.json',
  'sections/header-group.json'
];

for (const file of jsonFiles) {
  const filePath = path.join(rootDir, file);
  try {
    let raw = fs.readFileSync(filePath, 'utf8');
    raw = raw.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
    JSON.parse(raw);
    console.log(`[PASS] JSON valid: ${file}`);
  } catch (e) {
    console.error(`[FAIL] JSON invalid: ${file} - ${e.message}`);
    hasError = true;
  }
}

// 2. Validate liquid schemas in sections
const sectionsDir = path.join(rootDir, 'sections');
const liquidFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));

for (const file of liquidFiles) {
  const filePath = path.join(sectionsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      const validateSetting = (s, loc) => {
        if (s.default === '') {
          console.error(`[FAIL] ${file}: ${loc} "${s.id}" has empty string default!`);
          hasError = true;
        }
        if (s.type === 'range') {
          const range = s.max - s.min;
          if (s.step && range % s.step !== 0) {
            console.error(`[FAIL] ${file}: ${loc} "${s.id}" step ${s.step} does not evenly divide range (${s.max} - ${s.min} = ${range})!`);
            hasError = true;
          }
          if (s.default !== undefined) {
            if (s.default < s.min || s.default > s.max) {
              console.error(`[FAIL] ${file}: ${loc} "${s.id}" default ${s.default} is out of range [${s.min}, ${s.max}]!`);
              hasError = true;
            }
            if (s.step && (s.default - s.min) % s.step !== 0) {
              console.error(`[FAIL] ${file}: ${loc} "${s.id}" (default ${s.default} - min ${s.min}) is not divisible by step ${s.step}!`);
              hasError = true;
            }
          }
        }
      };

      (parsed.settings || []).forEach(s => validateSetting(s, 'setting'));
      (parsed.blocks || []).forEach(b => {
        (b.settings || []).forEach(s => validateSetting(s, `block "${b.type}" setting`));
      });
      // console.log(`[PASS] Schema valid: ${file}`);
    } catch (e) {
      console.error(`[FAIL] Schema invalid: ${file} - ${e.message}`);
      hasError = true;
    }
  }
}

if (!hasError) {
  console.log('ALL JSON & LIQUID SCHEMAS ARE 100% VALID!');
} else {
  process.exit(1);
}
