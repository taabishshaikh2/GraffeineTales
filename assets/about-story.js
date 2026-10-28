if (!customElements.get('atelier-story')) {
  customElements.define('atelier-story', class extends HTMLElement {
    connectedCallback() {
      if (this.abort) return;
      this.abort = new AbortController();
      this.narrative = this.querySelector('[data-story-narrative]');
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.words = [];
      this.originals = new Map();
      this.readers = [];
      this.ranges = [];
      this.highlightedCount = 0;
      this.frontier = -1;
      this.editorCount = null;
      const on = (target, type, callback, options = {}) => target.addEventListener(type, callback, {...options, signal:this.abort.signal});
      if (this.dataset.highlight === 'true' && !this.motion.matches) this.prepareWords();
      on(window,'scroll',() => this.requestUpdate(),{passive:true});
      on(window,'resize',() => this.requestUpdate(true),{passive:true});
      on(this.motion,'change',() => {
        if (!this.motion.matches && this.dataset.highlight === 'true' && !this.words.length) this.prepareWords();
        this.requestUpdate(true);
      });
      this.observer = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.requestUpdate(true);
      },{threshold:0});
      this.observer.observe(this);
      this.resize = new ResizeObserver(() => this.requestUpdate(true));
      this.resize.observe(this.narrative);
      on(document,'shopify:block:select',event => {
        const range = this.ranges.find(item => item.id === event.detail.blockId);
        if (range) {this.editorCount = range.end; this.requestUpdate(true);}
      });
      on(document,'shopify:block:deselect',() => {this.editorCount = null; this.requestUpdate(true);});
      const trigger = this.querySelector('[data-story-open]');
      this.dialog = this.querySelector('dialog');
      if (trigger && this.dialog) {
        trigger.hidden = false;
        on(trigger,'click',() => {
          this.dialog.showModal();
          document.body.classList.add('atelier-story-dialog-open');
        });
        on(this.querySelector('[data-story-close]'),'click',() => this.dialog.close());
        on(this.dialog,'close',() => {
          document.body.classList.remove('atelier-story-dialog-open');
          trigger.focus();
        });
        on(this.dialog,'click',event => {
          if (event.target !== this.dialog) return;
          const rect = this.dialog.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.dialog.close();
        });
      }
      this.update();
    }
    prepareWords() {
      this.querySelectorAll('[data-story-text]').forEach(content => {
        if (this.originals.has(content) || content.querySelector('a,button,input,select,textarea,[tabindex]')) return;
        const original = content.cloneNode(true);
        this.originals.set(content,original);
        const reader = document.createElement('div');
        reader.className = 'visually-hidden';
        [...original.childNodes].forEach(node => reader.append(node.cloneNode(true)));
        const walker = document.createTreeWalker(content,NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        const start = this.words.length;
        nodes.forEach(node => {
          const fragment = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(token => {
            if (!token) return;
            if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
            else {
              const word = document.createElement('span');
              word.className = 'atelier-story__word';
              word.textContent = token;
              this.words.push(word);
              fragment.append(word);
            }
          });
          node.replaceWith(fragment);
        });
        content.setAttribute('aria-hidden','true');
        content.after(reader);
        this.readers.push(reader);
        this.ranges.push({id:content.closest('[data-story-block-id]').dataset.storyBlockId,start,end:this.words.length});
      });
      this.classList.add('is-enhanced');
    }
    requestUpdate(force = false) {
      if ((!this.visible && !force) || this.frame) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        if (!this.abort?.signal.aborted) this.update();
      });
    }
    update() {
      if (!this.words.length) return;
      if (this.motion.matches) {this.renderWords(this.words.length,false); return;}
      if (this.editorCount !== null) {this.renderWords(this.editorCount); return;}
      const rect = this.narrative.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * Number(this.dataset.start || 0.75);
      const end = viewport * Number(this.dataset.end || 0.25);
      const distance = Math.max(1,rect.height + start - end);
      const progress = Math.max(0,Math.min(1,(start - rect.top) / distance));
      const count = Math.min(this.words.length,Math.floor(progress * (this.words.length + 1)));
      this.renderWords(count);
    }
    renderWords(count, showFrontier = true) {
      count = Math.max(0,Math.min(this.words.length,count));
      if (count > this.highlightedCount) {
        for (let i=this.highlightedCount;i<count;i++) this.words[i].classList.add('is-highlighted');
      } else if (count < this.highlightedCount) {
        for (let i=count;i<this.highlightedCount;i++) this.words[i].classList.remove('is-highlighted');
      }
      const frontier = showFrontier && count > 0 ? count - 1 : -1;
      if (this.frontier !== frontier) {
        if (this.frontier >= 0) this.words[this.frontier]?.classList.remove('is-frontier');
        if (frontier >= 0) this.words[frontier].classList.add('is-frontier');
      }
      this.frontier = frontier;
      this.highlightedCount = count;
    }
    disconnectedCallback() {
      this.abort?.abort();
      this.abort = null;
      cancelAnimationFrame(this.frame);
      this.frame = null;
      this.observer?.disconnect();
      this.resize?.disconnect();
      this.originals?.forEach((original,content) => {
        content.replaceChildren(...[...original.childNodes].map(node => node.cloneNode(true)));
        content.removeAttribute('aria-hidden');
      });
      this.readers?.forEach(reader => reader.remove());
      this.classList.remove('is-enhanced');
      if (this.dialog?.open) this.dialog.close();
      document.body.classList.remove('atelier-story-dialog-open');
    }
  });
}
