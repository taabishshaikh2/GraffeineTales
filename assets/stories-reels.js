if (!customElements.get('atelier-reels')) {
  customElements.define('atelier-reels', class extends HTMLElement {
    connectedCallback() {
      if (this.abort) return;
      this.abort = new AbortController();
      this.cards = [...this.querySelectorAll('[data-reel-card]')];
      this.cards.forEach((card,index)=>{const opener=card.querySelector('[data-open-reel]');if(opener)opener.dataset.openReel=String(index);});
      this.querySelectorAll('[data-reel-dot]').forEach((dot,index)=>{dot.dataset.reelDot=String(index);});
      this.viewport = this.querySelector('[data-reels-viewport]');
      this.dialog = this.querySelector('[data-reels-dialog]');
      this.stageVideo = this.querySelector('[data-stage-video]');
      this.stagePoster = this.querySelector('[data-stage-poster]');
      this.timeline = this.querySelector('[data-stage-timeline]');
      this.ratios = new Map();
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.activeIndex = 0;
      const on = (target,type,callback,options={}) => target?.addEventListener(type,callback,{...options,signal:this.abort.signal});
      on(this,'click',event => {
        const opener = event.target.closest('[data-open-reel]');
        const sound = event.target.closest('[data-card-sound]');
        const track = event.target.closest('[data-track-direction]');
        const dot = event.target.closest('[data-reel-dot]');
        if (opener) this.open(Number(opener.dataset.openReel),opener);
        else if (sound) this.toggleCardSound(sound);
        else if (track) this.viewport.scrollBy({left:Number(track.dataset.trackDirection)*(this.cards[0]?.offsetWidth+22||300),behavior:this.motion.matches?'instant':'smooth'});
        else if (dot) this.cards[Number(dot.dataset.reelDot)]?.scrollIntoView({block:'nearest',inline:'center',behavior:this.motion.matches?'instant':'smooth'});
        else if (event.target.closest('[data-close-reels]')) this.dialog.close();
        else if (event.target.closest('[data-viewer-direction]')) this.navigate(Number(event.target.closest('[data-viewer-direction]').dataset.viewerDirection));
        else if (event.target.closest('[data-stage-play]')) this.stageVideo.paused ? this.stageVideo.play().catch(()=>{}) : this.stageVideo.pause();
        else if (event.target.closest('[data-stage-sound]')) {this.stageVideo.muted=!this.stageVideo.muted;this.updateStageControls();}
        else if (event.target.closest('[data-load-instagram]')) this.loadInstagram();
        else if (event.target.closest('[data-save-reel]')) this.toggleSavedStory();
        else if (event.target.closest('[data-share-reel]')) this.share();
      });
      this.cards.forEach(card => {
        const video=card.querySelector('video');
        if (!video) return;
        on(video,'loadedmetadata',() => {
          const label=card.querySelector('[data-card-duration]');
          if (Number.isFinite(video.duration)) {label.textContent=this.time(video.duration);label.hidden=false;}
        });
        on(video,'volumechange',() => {const button=card.querySelector('[data-card-sound]');if(button)this.setSoundButton(button,video.muted);});
        on(video,'play',() => card.classList.add('is-playing'));
        on(video,'pause',() => card.classList.remove('is-playing'));
        on(video,'error',() => {video.hidden=true;card.classList.remove('is-playing');});
      });
      this.observer=new IntersectionObserver(entries => {
        entries.forEach(entry=>this.ratios.set(entry.target,entry.isIntersecting?entry.intersectionRatio:0));
        this.choosePreview();
        const active=this.cards.reduce((best,card)=> (this.ratios.get(card)||0)>(this.ratios.get(best)||0)?card:best,this.cards[0]);
        this.querySelectorAll('[data-reel-dot]').forEach((dot,index)=>{
          if (this.cards[index]===active) dot.setAttribute('aria-current','true');
          else dot.removeAttribute('aria-current');
        });
      },{threshold:[0,.25,.5,.75,1]});
      this.cards.forEach(card=>this.observer.observe(card));
      on(this.motion,'change',()=>this.choosePreview());
      on(document,'visibilitychange',()=>{
        if (document.hidden) {this.pausePreviews();this.stageVideo.pause();}
        else this.choosePreview();
      });
      on(document,'atelier:cart:update',()=>{if(this.dialog.open)this.dialog.close();});
      on(document,'shopify:block:select',event=>{
        const card=this.cards.find(item=>item.dataset.reelId===event.detail.blockId);
        if(card)card.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'});
      });
      on(this.dialog,'close',()=>{
        this.clearStage();
        document.body.classList.remove('atelier-reels-viewer-open');
        this.activeTrigger?.focus();
        this.choosePreview();
      });
      on(this.dialog,'click',event=>{if(event.target===this.dialog)this.dialog.close();});
      on(this.dialog,'keydown',event=>{
        if(event.target.matches('input,select,textarea'))return;
        if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();this.navigate(event.key==='ArrowRight'?1:-1);}
      });
      const stage=this.querySelector('.atelier-reels__stage');
      on(stage,'pointerdown',event=>{
        if(event.pointerType==='mouse'||event.target.closest('button,a,input,iframe'))return;
        this.gesture={x:event.clientX,y:event.clientY};
      });
      on(stage,'pointerup',event=>{
        if(!this.gesture)return;
        const x=event.clientX-this.gesture.x,y=event.clientY-this.gesture.y;
        this.gesture=null;
        if(Math.abs(x)>60&&Math.abs(x)>Math.abs(y)*1.3)this.navigate(x<0?1:-1);
      });
      on(stage,'pointercancel',()=>this.gesture=null);
      on(this.stageVideo,'play',()=>this.updateStageControls());
      on(this.stageVideo,'pause',()=>this.updateStageControls());
      on(this.stageVideo,'volumechange',()=>this.updateStageControls());
      on(this.stageVideo,'loadedmetadata',()=>{
        this.timeline.disabled=!Number.isFinite(this.stageVideo.duration)||this.stageVideo.duration<=0;
      });
      on(this.stageVideo,'timeupdate',()=>{
        if(Number.isFinite(this.stageVideo.duration)&&this.stageVideo.duration>0){
          this.timeline.value=String(this.stageVideo.currentTime/this.stageVideo.duration*100);
          this.timeline.setAttribute('aria-valuetext',this.time(this.stageVideo.currentTime)+' / '+this.time(this.stageVideo.duration));
        }
      });
      on(this.stageVideo,'error',()=>{
        if(!this.stageVideo.querySelector('source'))return;
        this.querySelector('[data-video-error]').hidden=false;
        this.stageVideo.hidden=true;
        this.setVideoControls(false);
      });
      on(this.timeline,'input',()=>{
        if(Number.isFinite(this.stageVideo.duration)&&this.stageVideo.duration>0)this.stageVideo.currentTime=Number(this.timeline.value)/100*this.stageVideo.duration;
      });
    }
    time(seconds) {
      const value=Math.max(0,Math.floor(seconds||0));
      return Math.floor(value/60)+':'+String(value%60).padStart(2,'0');
    }
    pausePreviews(except) {
      this.cards.forEach(card=>{
        const video=card.querySelector('video');
        if(video&&video!==except)video.pause();
      });
    }
    choosePreview() {
      if(this.dialog.open||document.hidden||this.dataset.autoplay!=='true'||this.motion.matches||navigator.connection?.saveData){this.pausePreviews();return;}
      const card=this.cards.filter(item=>item.querySelector('video')&&(this.ratios.get(item)||0)>=.5).sort((a,b)=>(this.ratios.get(b)||0)-(this.ratios.get(a)||0))[0];
      const video=card?.querySelector('video');
      this.pausePreviews(video);
      if(video){if(this.preview!==video)video.muted=true;this.preview=video;video.play().catch(()=>{});}
    }
    toggleCardSound(button) {
      const video=button.closest('[data-reel-card]').querySelector('video');
      if(!video)return;
      this.pausePreviews(video);
      video.muted=!video.muted;
      this.preview=video;
      this.setSoundButton(button,video.muted);
      video.play().catch(()=>{});
    }
    setSoundButton(button,muted) {
      button.setAttribute('aria-label',muted?this.dataset.unmuteLabel:this.dataset.muteLabel);
      button.setAttribute('aria-pressed',String(!muted));
      button.querySelector('[data-icon-muted]').hidden=!muted;
      button.querySelector('[data-icon-sound]').hidden=muted;
    }
    open(index,trigger) {
      if(!this.cards.length)return;
      this.activeIndex=(index+this.cards.length)%this.cards.length;
      this.activeTrigger=trigger||this.cards[this.activeIndex].querySelector('[data-open-reel]');
      this.pausePreviews();
      if(!this.dialog.open)this.dialog.showModal();
      document.body.classList.add('atelier-reels-viewer-open');
      this.renderStage();
    }
    navigate(direction) {this.open(this.activeIndex+direction);}
    clearStage() {
      this.stageVideo.pause();
      this.stageVideo.replaceChildren();
      this.stageVideo.removeAttribute('src');
      this.stageVideo.load();
      const embed=this.querySelector('[data-instagram-container]');
      embed.replaceChildren();
      embed.hidden=true;
      this.timeline.value='0';
      this.querySelector('[data-reel-share-status]').textContent='';
    }
    renderStage() {
      this.clearStage();
      const card=this.cards[this.activeIndex],sourceVideo=card.querySelector('video'),poster=card.querySelector('img');
      this.stagePoster.hidden=!poster;
      if(poster){this.stagePoster.src=poster.currentSrc||poster.src;this.stagePoster.alt='';}
      else this.stagePoster.removeAttribute('src');
      this.querySelector('[data-stage-title]').textContent=card.dataset.title;
      this.querySelector('[data-stage-caption]').textContent=card.dataset.caption;
      this.querySelector('[data-video-error]').hidden=true;
      const product=card.querySelector('[data-reel-product]'),slot=this.querySelector('[data-stage-product]');
      slot.replaceChildren();
      if(product){
        const copy=product.cloneNode(true);
        copy.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
        copy.querySelectorAll('[data-cart-error]').forEach(node=>node.hidden=true);
        slot.append(copy);
      }
      this.stageVideo.hidden=!sourceVideo;
      this.setVideoControls(Boolean(sourceVideo));
      this.querySelector('[data-load-instagram]').hidden=!this.instagramSource(card.dataset.instagram);
      if(sourceVideo){
        this.stageVideo.muted=true;
        if(sourceVideo.querySelector('track'))this.stageVideo.crossOrigin='anonymous';
        else this.stageVideo.removeAttribute('crossorigin');
        this.stageVideo.poster=poster?.src||'';
        sourceVideo.querySelectorAll('source,track').forEach(node=>this.stageVideo.append(node.cloneNode(true)));
        this.stageVideo.load();
        this.stageVideo.play().catch(()=>{});
      }
      this.updateStageControls();
      this.updateSavedStory();
    }
    setVideoControls(show) {
      this.querySelector('[data-stage-play]').hidden=!show;
      this.querySelector('[data-stage-sound]').hidden=!show;
      this.timeline.hidden=!show;
      this.timeline.disabled=true;
    }
    updateStageControls() {
      const button=this.querySelector('[data-stage-play]');
      button.setAttribute('aria-label',this.stageVideo.paused?this.dataset.playLabel:this.dataset.pauseLabel);
      button.querySelector('[data-icon-play]').hidden=!this.stageVideo.paused;
      button.querySelector('[data-icon-pause]').hidden=this.stageVideo.paused;
      this.setSoundButton(this.querySelector('[data-stage-sound]'),this.stageVideo.muted);
    }
    instagramSource(value) {
      try {
        const url=new URL(value);
        if(url.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(url.hostname))return '';
        const match=url.pathname.match(/^\/(reel|p)\/([a-zA-Z0-9_-]+)\/?$/);
        return match?'https://www.instagram.com/'+match[1]+'/'+match[2]+'/embed/':'';
      } catch{return '';}
    }
    loadInstagram() {
      const url=this.instagramSource(this.cards[this.activeIndex].dataset.instagram);
      if(!url)return;
      const frame=document.createElement('iframe');
      frame.src=url;
      frame.title=this.cards[this.activeIndex].dataset.title;
      frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen=true;
      frame.referrerPolicy='strict-origin-when-cross-origin';
      frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups allow-presentation');
      const container=this.querySelector('[data-instagram-container]');
      container.replaceChildren(frame);
      container.hidden=false;
      this.querySelector('[data-load-instagram]').hidden=true;
    }
    savedStories() {
      try {const values=JSON.parse(localStorage.getItem('graffeine-saved-stories')||'[]');return new Set(Array.isArray(values)?values.filter(value=>typeof value==='string'):[]);}
      catch{return new Set();}
    }
    toggleSavedStory() {
      const saved=this.savedStories(),id=this.cards[this.activeIndex].id;
      if(saved.has(id))saved.delete(id);else saved.add(id);
      try{localStorage.setItem('graffeine-saved-stories',JSON.stringify([...saved]));}catch{}
      this.updateSavedStory();
    }
    updateSavedStory() {
      const button=this.querySelector('[data-save-reel]');
      if(button)button.setAttribute('aria-pressed',String(this.savedStories().has(this.cards[this.activeIndex].id)));
    }
    async share() {
      const card=this.cards[this.activeIndex],url=new URL(window.location.href);
      url.hash=card.id;
      try {
        if(navigator.share){await navigator.share({title:card.dataset.title,url:url.href});return;}
        await navigator.clipboard.writeText(url.href);
        this.querySelector('[data-reel-share-status]').textContent=this.dataset.sharedLabel;
      } catch(error){if(error.name!=='AbortError')this.querySelector('[data-reel-share-status]').textContent=url.href;}
    }
    disconnectedCallback() {
      this.abort?.abort();
      this.abort=null;
      this.observer?.disconnect();
      this.pausePreviews();
      this.clearStage();
      if(this.dialog.open)this.dialog.close();
      document.body.classList.remove('atelier-reels-viewer-open');
    }
  });
}
