const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Work/GraffeineTales/GraffeineTalesTheme';

// ==========================================
// 1. UPDATE sections/cart-drawer.liquid
// Move canvas outside #CartDrawer so it is never trapped by panel transform or overflow:hidden
// ==========================================
const cartDrawerLiquidPath = path.join(rootDir, 'sections/cart-drawer.liquid');
let cartDrawerLiquid = fs.readFileSync(cartDrawerLiquidPath, 'utf8').replace(/\r\n/g, '\n');

// Remove canvas from inside #CartDrawer if it is there
cartDrawerLiquid = cartDrawerLiquid.replace(
  /<canvas class="atelier-cart-confetti-canvas" data-cart-confetti aria-hidden="true"><\/canvas>\s*/g,
  ''
);

// Place canvas right at the start of <cart-drawer> before #CartDrawer-Overlay
cartDrawerLiquid = cartDrawerLiquid.replace(
  /(<cart-drawer[^>]*>)\s*(<div id="CartDrawer-Overlay")/i,
  `$1\n  <canvas class="atelier-cart-confetti-canvas" data-cart-confetti aria-hidden="true"></canvas>\n  $2`
);
fs.writeFileSync(cartDrawerLiquidPath, cartDrawerLiquid, 'utf8');
console.log('Updated sections/cart-drawer.liquid');

// ==========================================
// 2. UPDATE assets/atelier-cart-drawer.css
// Ensure confetti canvas has fixed fullscreen styling and highest z-index
// ==========================================
const cartDrawerCssPath = path.join(rootDir, 'assets/atelier-cart-drawer.css');
let cartDrawerCss = fs.readFileSync(cartDrawerCssPath, 'utf8').replace(/\r\n/g, '\n');

const confettiCssRule = `
/* Global Fullscreen Cart Confetti Canvas */
.atelier-cart-confetti-canvas,
canvas[data-cart-confetti] {
  position: fixed !important;
  inset: 0 !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 99999999 !important;
  pointer-events: none !important;
  display: block !important;
  visibility: visible !important;
}
`;
cartDrawerCss += confettiCssRule;
fs.writeFileSync(cartDrawerCssPath, cartDrawerCss, 'utf8');
console.log('Updated assets/atelier-cart-drawer.css');

// ==========================================
// 3. UPDATE assets/cart-drawer.js
// Enhance CartConfetti class & milestone celebrate triggers
// ==========================================
const cartJsPath = path.join(rootDir, 'assets/cart-drawer.js');
let cartJs = fs.readFileSync(cartJsPath, 'utf8').replace(/\r\n/g, '\n');

// Replace CartConfetti class definition with robust viewport engine
const oldConfettiRegex = /\/\/ High-Performance Festive Confetti Engine[\s\S]*?class CartConfetti\s*\{[\s\S]*?\n\}\n/;

const newConfettiClass = `// High-Performance Festive Confetti Engine
class CartConfetti {
  constructor(canvas) {
    this.ensureCanvas(canvas);
    this.particles = [];
    this.animationFrame = null;
    this.palette = [
      '#5A3825', // Atelier Warm Brown
      '#D4AF37', // Wax Seal Gold
      '#C85A32', // Terracotta Clay
      '#2D6A4F', // Botanical Sage
      '#FACC15', // Radiant Yellow
      '#E6DCCB', // Parchment Bone
      '#FF6B6B', // Coral Pink
      '#4ECDC4', // Tiffany Mint
      '#FFFFFF'  // White
    ];
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  ensureCanvas(canvas) {
    if (!canvas) {
      canvas = document.querySelector('[data-cart-confetti]');
    }
    // If canvas doesn't exist or is not a direct child of body, attach directly to body
    // so no ancestor transform or overflow:hidden can ever clip or shift particles!
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'atelier-cart-confetti-canvas';
      canvas.setAttribute('data-cart-confetti', '');
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
    } else if (canvas.parentElement !== document.body) {
      document.body.appendChild(canvas);
    }
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerHeight * dpr);
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.zIndex = '99999999';
    this.canvas.style.pointerEvents = 'none';
    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
  }

  burst(tier = 1) {
    this.ensureCanvas(this.canvas);
    this.resize();
    if (!this.ctx) return;

    const count = tier >= 3 ? 180 : tier === 2 ? 140 : 100;
    const milestoneEl = document.querySelector('.milestone-track-section') ||
                        document.querySelector('.milestone-nodes-row') ||
                        document.querySelector('.reference-milestone-card') ||
                        document.querySelector('#CartDrawer');
    const rect = milestoneEl ? milestoneEl.getBoundingClientRect() : null;

    const originX = rect ? (rect.left + rect.width / 2) : (window.innerWidth - 240);
    const originY = rect ? (rect.top + (rect.height ? rect.height / 2 : 40)) : 120;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 2) + ((Math.random() - 0.5) * Math.PI * 1.7);
      const speed = 7 + Math.random() * 16;
      const size = 6 + Math.random() * 8;
      const color = this.palette[Math.floor(Math.random() * this.palette.length)];
      const spreadX = (Math.random() - 0.5) * (rect ? Math.min(rect.width * 0.95, 420) : 240);

      this.particles.push({
        x: originX + spreadX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) - 5,
        size,
        color,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 18,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.12 + Math.random() * 0.12,
        gravity: 0.24 + Math.random() * 0.08,
        drag: 0.962,
        opacity: 1,
        fadeSpeed: 0.005 + Math.random() * 0.004,
        shape: Math.random() > 0.35 ? (Math.random() > 0.5 ? 'ribbon' : 'rect') : 'circle'
      });
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.fadeSpeed;

      if (p.opacity <= 0 || p.y > window.innerHeight + 40) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x + Math.sin(p.wobble) * 3, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else if (p.shape === 'ribbon') {
        this.ctx.fillRect(-p.size / 2, -p.size * 0.2, p.size * 1.5, p.size * 0.4);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.animationFrame = null;
    }
  }
}
`;

if (oldConfettiRegex.test(cartJs)) {
  cartJs = cartJs.replace(oldConfettiRegex, newConfettiClass);
}

// Enhance decorateMilestones to reliably trigger celebrate and add node click interactions
const oldMilestonesCelebration = `      const unlockedCount = nodes.filter(node => total >= Number(node.dataset.threshold)).length;
      if (this.previousUnlocked !== undefined && unlockedCount > this.previousUnlocked && !this.reducedMotion) {
        this.celebrate(unlockedCount);
      }
      this.previousUnlocked = unlockedCount;`;

const newMilestonesCelebration = `      const unlockedCount = nodes.filter(node => total >= Number(node.dataset.threshold)).length;

      // Allow users to click any unlocked milestone node to re-trigger celebratory confetti
      nodes.forEach((node, idx) => {
        const threshold = Number(node.dataset.threshold);
        if (total >= threshold) {
          node.style.cursor = 'pointer';
          node.title = 'Milestone reached! Click to celebrate';
          node.onclick = () => this.celebrate(idx + 1);
        }
      });

      // Trigger celebratory confetti when a new milestone is unlocked
      const storedTier = Number(sessionStorage.getItem('graffeine_cart_celebrated_tier') || 0);
      const isNewTier = this.previousUnlocked !== undefined
        ? unlockedCount > this.previousUnlocked
        : (unlockedCount > 0 && unlockedCount > storedTier);

      if (isNewTier && !this.reducedMotion && unlockedCount > 0) {
        setTimeout(() => this.celebrate(unlockedCount), 180);
      }
      this.previousUnlocked = unlockedCount;
      if (unlockedCount > storedTier) {
        sessionStorage.setItem('graffeine_cart_celebrated_tier', String(unlockedCount));
      } else if (unlockedCount === 0) {
        sessionStorage.removeItem('graffeine_cart_celebrated_tier');
      }`;

if (cartJs.includes(oldMilestonesCelebration)) {
  cartJs = cartJs.replace(oldMilestonesCelebration, newMilestonesCelebration);
}

// Make celebrate method bulletproof
const oldCelebrate = `    celebrate(tier = 1) {
      if (this.reducedMotion) return;
      const canvas = this.querySelector('[data-cart-confetti]');
      if (!canvas) return;
      if (!this.confetti || this.confetti.canvas !== canvas) {
        this.confetti = new CartConfetti(canvas);
      }
      this.confetti.burst(tier);
    }`;

const newCelebrate = `    celebrate(tier = 1) {
      if (this.reducedMotion) return;
      if (!this.confetti) {
        this.confetti = new CartConfetti();
      }
      this.confetti.burst(tier);
    }`;

if (cartJs.includes(oldCelebrate)) {
  cartJs = cartJs.replace(oldCelebrate, newCelebrate);
}

// Expose triggerCartConfetti globally for live testing and preview
if (!cartJs.includes('window.triggerCartConfetti')) {
  cartJs = cartJs.replace(
    'customElements.define(\'cart-drawer\', CartDrawer);',
    `customElements.define('cart-drawer', CartDrawer);
  window.triggerCartConfetti = (tier = 2) => {
    const drawer = document.querySelector('cart-drawer');
    if (drawer && typeof drawer.celebrate === 'function') {
      drawer.celebrate(tier);
    } else {
      new CartConfetti().burst(tier);
    }
  };`
  );
}

fs.writeFileSync(cartJsPath, cartJs, 'utf8');
console.log('Updated assets/cart-drawer.js');

// ==========================================
// 4. UPDATE sections/atelier-footer.liquid
// Add textarea for pre-filled chat message + tooltip setting
// ==========================================
const footerLiquidPath = path.join(rootDir, 'sections/atelier-footer.liquid');
let footerLiquid = fs.readFileSync(footerLiquidPath, 'utf8').replace(/\r\n/g, '\n');

const oldWaFooterSchema = `    {
      "type": "text",
      "id": "whatsapp_message",
      "label": "Default WhatsApp message",
      "default": "Hi Graffeine Tales! I have a question about your collection."
    },`;

const newWaFooterSchema = `    {
      "type": "textarea",
      "id": "whatsapp_message",
      "label": "Pre-filled chat message",
      "default": "Hi Graffeine Tales! I have a question about your collection.",
      "info": "Customize the pre-filled message that customers see when opening WhatsApp chat."
    },
    {
      "type": "text",
      "id": "whatsapp_tooltip",
      "label": "Hover tooltip text",
      "default": "Chat with us",
      "info": "Text displayed in the tooltip on hover (desktop)."
    },`;

if (footerLiquid.includes(oldWaFooterSchema)) {
  footerLiquid = footerLiquid.replace(oldWaFooterSchema, newWaFooterSchema);
}
fs.writeFileSync(footerLiquidPath, footerLiquid, 'utf8');
console.log('Updated sections/atelier-footer.liquid');

// ==========================================
// 5. UPDATE snippets/whatsapp-widget.liquid
// Support custom message & tooltip
// ==========================================
const waSnippetPath = path.join(rootDir, 'snippets/whatsapp-widget.liquid');
let waSnippetContent = `{% liquid
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

  assign wa_tooltip = section.settings.whatsapp_tooltip
  if wa_tooltip == blank
    assign wa_tooltip = settings.whatsapp_tooltip | default: 'Chat with us'
  endif

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
      <span class="atelier-whatsapp-widget__tooltip" role="tooltip">{{ wa_tooltip | escape }}</span>
    </a>
  </aside>
{% endif %}
`;
fs.writeFileSync(waSnippetPath, waSnippetContent, 'utf8');
console.log('Updated snippets/whatsapp-widget.liquid');

// ==========================================
// 6. UPDATE config/settings_schema.json
// ==========================================
const schemaPath = path.join(rootDir, 'config/settings_schema.json');
let schemaJson = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const waSection = schemaJson.find(s => s.name === 'WhatsApp Support');
if (waSection) {
  const msgSetting = waSection.settings.find(s => s.id === 'whatsapp_message');
  if (msgSetting) {
    msgSetting.type = 'textarea';
    msgSetting.label = 'Pre-filled chat message';
    msgSetting.info = 'Customize the pre-filled message that customers see when opening WhatsApp chat.';
  }
  if (!waSection.settings.some(s => s.id === 'whatsapp_tooltip')) {
    waSection.settings.push({
      type: 'text',
      id: 'whatsapp_tooltip',
      label: 'Hover tooltip text',
      default: 'Chat with us'
    });
  }
}
fs.writeFileSync(schemaPath, JSON.stringify(schemaJson, null, 2), 'utf8');
console.log('Updated config/settings_schema.json');

// ==========================================
// 7. UPDATE config/settings_data.json
// ==========================================
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
  dataJson.current.whatsapp_message = dataJson.current.whatsapp_message || "Hi Graffeine Tales! I have a question about your collection.";
  dataJson.current.whatsapp_tooltip = "Chat with us";
}
fs.writeFileSync(dataPath, leadComment + JSON.stringify(dataJson, null, 2), 'utf8');
console.log('Updated config/settings_data.json');

// ==========================================
// 8. UPDATE sections/footer-group.json
// ==========================================
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
  footerGroupJson.sections.footer.settings.whatsapp_message = "Hi Graffeine Tales! I have a question about your collection.";
  footerGroupJson.sections.footer.settings.whatsapp_tooltip = "Chat with us";
}
fs.writeFileSync(footerGroupPath, fgLeadComment + JSON.stringify(footerGroupJson, null, 2), 'utf8');
console.log('Updated sections/footer-group.json');
