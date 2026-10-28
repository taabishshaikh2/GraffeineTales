if (!customElements.get('atelier-reviews')) {
  customElements.define('atelier-reviews', class extends HTMLElement {
    connectedCallback() {
      if(this.abort)return;
      this.abort=new AbortController();
      this.viewport=this.querySelector('[data-reviews-viewport]');
      this.track=this.querySelector('[data-reviews-track]');
      this.group=this.querySelector('[data-reviews-group]');
      this.motion=matchMedia('(prefers-reduced-motion: reduce)');
      this.visible=false;
      this.paused=false;
      this.manual=false;
      const on=(target,type,callback,options={})=>target?.addEventListener(type,callback,{...options,signal:this.abort.signal});
      on(this.viewport,'pointerenter',()=>{this.hovered=true;this.updatePause();});
      on(this.viewport,'pointerleave',()=>{this.hovered=false;this.updatePause();});
      on(this.viewport,'focusin',()=>{this.focused=true;this.updatePause();});
      on(this.viewport,'focusout',()=>queueMicrotask(()=>{this.focused=this.viewport.contains(document.activeElement);this.updatePause();}));
      on(this.viewport,'pointerdown',()=>this.startManualBrowsing());
      on(this.viewport,'wheel',event=>{if(Math.abs(event.deltaX)>0||event.shiftKey)this.startManualBrowsing();},{passive:true});
      on(this.viewport,'keydown',event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        this.startManualBrowsing();
        const first=this.group.firstElementChild;
        const distance=(first?.offsetWidth||300)+parseFloat(getComputedStyle(this.group).gap||0);
        if(event.key==='Home')this.viewport.scrollTo({left:0,behavior:'instant'});
        else if(event.key==='End')this.viewport.scrollTo({left:this.group.scrollWidth,behavior:'instant'});
        else this.viewport.scrollBy({left:distance*(event.key==='ArrowRight'?1:-1),behavior:this.motion.matches?'instant':'smooth'});
      });
      const toggle=this.querySelector('[data-reviews-toggle]');
      on(toggle,'click',()=>{
        if(this.manual){this.manual=false;this.paused=false;this.viewport.scrollLeft=0;this.measure();}
        else this.paused=!this.paused;
        this.updatePause();
      });
      on(this.motion,'change',()=>this.measure());
      on(document,'visibilitychange',()=>this.updatePause());
      on(document,'shopify:block:select',event=>{
        const card=[...this.group.children].find(item=>item.dataset.reviewId===event.detail.blockId);
        if(!card)return;
        this.startManualBrowsing();
        card.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'});
      });
      this.resize=new ResizeObserver(()=>this.scheduleMeasure());
      this.resize.observe(this.viewport);
      this.resize.observe(this.group);
      this.observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.updatePause();},{threshold:.05});
      this.observer.observe(this);
      this.measure();
    }
    scheduleMeasure() {
      if(this.frame)return;
      this.frame=requestAnimationFrame(()=>{this.frame=null;if(!this.abort?.signal.aborted)this.measure();});
    }
    measure() {
      const gap=parseFloat(getComputedStyle(this.track).gap||0);
      const width=this.group.getBoundingClientRect().width;
      this.canAnimate=this.dataset.autoplay==='true'&&!this.motion.matches&&this.group.children.length>1&&width>this.viewport.clientWidth;
      if(this.canAnimate&&!this.manual) {
        if(!this.clone) {
          this.clone=this.group.cloneNode(true);
          this.clone.removeAttribute('data-reviews-group');
          this.clone.removeAttribute('role');
          this.clone.setAttribute('aria-hidden','true');
          this.clone.inert=true;
          this.clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
          this.clone.querySelectorAll('[data-shopify-editor-block]').forEach(node=>node.removeAttribute('data-shopify-editor-block'));
          this.clone.querySelectorAll('[data-review-id]').forEach(node=>node.removeAttribute('data-review-id'));
          this.track.append(this.clone);
        }
        this.style.setProperty('--reviews-distance',(width+gap)+'px');
        this.classList.add('is-looping');
      } else this.removeLoop();
      const toggle=this.querySelector('[data-reviews-toggle]');
      if(toggle)toggle.disabled=!this.canAnimate;
      this.updatePause();
    }
    removeLoop() {
      this.classList.remove('is-looping');
      this.clone?.remove();
      this.clone=null;
    }
    startManualBrowsing() {
      if(this.manual)return;
      let offset=0;
      if(this.classList.contains('is-looping')) {
        const transform=getComputedStyle(this.track).transform;
        if(transform&&transform!=='none')offset=Math.max(0,-new DOMMatrixReadOnly(transform).m41);
      }
      this.manual=true;
      this.removeLoop();
      this.viewport.scrollLeft=offset;
      this.updatePause();
    }
    updatePause() {
      const paused=this.paused||this.manual||this.hovered||this.focused||document.hidden||!this.visible;
      this.classList.toggle('is-paused',Boolean(paused));
      const toggle=this.querySelector('[data-reviews-toggle]');
      if(toggle){toggle.textContent=this.paused||this.manual?toggle.dataset.resumeLabel:toggle.dataset.pauseLabel;toggle.setAttribute('aria-pressed',String(this.paused||this.manual));}
    }
    disconnectedCallback() {
      this.abort?.abort();
      this.abort=null;
      cancelAnimationFrame(this.frame);
      this.frame=null;
      this.resize?.disconnect();
      this.observer?.disconnect();
      this.removeLoop();
    }
  });
}
