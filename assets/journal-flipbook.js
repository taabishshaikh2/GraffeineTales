if(!customElements.get('journal-flipbook'))customElements.define('journal-flipbook',class extends HTMLElement{
 connectedCallback(){
  if(this.abort)return;this.abort=new AbortController();this.images=JSON.parse(this.querySelector('[data-book-images]').textContent);this.stage=this.querySelector('[data-book-stage]');this.fallback=this.querySelector('[data-book-fallback]');this.peel=this.querySelector('[data-book-peel]');this.back=this.querySelector('[data-book-back]');this.next=this.querySelector('[data-book-next]');this.index=0;this.ready=false;this.busy=false;
  const on=(target,type,fn)=>target?.addEventListener(type,fn,{signal:this.abort.signal});
  on(this.back,'click',()=>this.turn(-1));on(this.next,'click',()=>this.turn(1));on(this.peel,'click',event=>{event.stopPropagation();this.turn(1);});
  on(this.stage,'keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();this.turn(event.key==='ArrowRight'?1:-1);}});
  on(window,'resize',()=>this.queueResize());on(window.visualViewport,'resize',()=>this.queueResize());
  this.stage.tabIndex=0;this.stage.setAttribute('role','group');this.update();
  this.viewportObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){this.viewportObserver.disconnect();this.build();this.resizeObserver=new ResizeObserver(()=>{const width=this.stage.clientWidth;if(this.lastWidth&&Math.abs(width-this.lastWidth)>2){this.queueResize();}});this.resizeObserver.observe(this.stage);}},{rootMargin:'250px'});this.viewportObserver.observe(this);
 }
 queueResize(){if(!this.mount)return;clearTimeout(this.resizeTimer);this.resizeTimer=setTimeout(()=>this.build(),150);}
 measure(){
  const px=(element,name)=>parseFloat(getComputedStyle(element)[name])||0;
  const heading=this.querySelector('h2'),controls=this.querySelector('.journal-flipbook__controls'),desk=this.querySelector('[data-book-desk]'),instructions=this.querySelector('.journal-flipbook__instructions');
  const header=document.querySelector('.atelier-header');const dock=document.querySelector('.atelier-mobile-dock');const sticky=document.querySelector('.journal-sticky-purchase');
  const occupied=(header?.getBoundingClientRect().height||0)+(dock?.getBoundingClientRect().height||0)+(sticky&&!sticky.hidden?sticky.getBoundingClientRect().height:0);
  const chrome=heading.getBoundingClientRect().height+px(heading,'marginBottom')+controls.getBoundingClientRect().height+px(controls,'marginTop')+px(this,'paddingTop')+px(this,'paddingBottom')+px(desk,'paddingTop')+px(desk,'paddingBottom')+(instructions?instructions.getBoundingClientRect().height+px(instructions,'marginBottom'):0)+occupied+16;
  const availableHeight=Math.max(120,(window.visualViewport?.height||window.innerHeight)-chrome);
  const mobile=window.innerWidth<750;
  const width=Math.max(90,Math.floor(Math.min(Number(this.dataset.width)||380,this.stage.clientWidth/2,availableHeight*.75)));
  return {width,height:Math.round(width*4/3)};
 }
 build(){
  if(!this.isConnected||this.images.length<2)return;this.lastWidth=this.stage.clientWidth;
  const {width,height}=this.measure();
  const current=Math.min(this.images.length-2,Math.floor(this.index/2)*2);
  this.flip?.destroy();this.flip=null;this.mount?.remove();this.ready=false;this.busy=false;
  this.mount=document.createElement('div');this.mount.className='journal-flipbook__mount';this.mount.style.width=width*2+'px';this.mount.style.height=height+'px';this.stage.prepend(this.mount);
  if(!window.St?.PageFlip){this.mount.remove();this.showFallback();return;}
  try{
   this.stage.style.minHeight=height+'px';this.stage.style.height=height+'px';this.fallback.hidden=true;
   this.flip=new window.St.PageFlip(this.mount,{width,height,size:'fixed',startPage:current,showCover:false,usePortrait:false,autoSize:false,flippingTime:Number(this.dataset.duration)||700,maxShadowOpacity:.55,drawShadow:true,mobileScrollSupport:true,showPageCorners:true,useMouseEvents:true,disableFlipByClick:false});
   this.flip.on('init',()=>{if(!this.isConnected)return;this.ready=true;this.fallback.hidden=true;this.index=this.flip.getCurrentPageIndex();this.update();});
   this.flip.on('flip',event=>{this.index=event.data;this.update();});
   this.flip.on('changeState',event=>{this.busy=event.data!=='read';if(this.peel)this.peel.hidden=this.busy||this.isLast();this.update();});
   this.flip.on('changeOrientation',()=>this.update());
   this.flip.loadFromImages(this.images.map(image=>image.src));
  }catch{this.flip?.destroy();this.flip=null;this.mount?.remove();this.showFallback();}
 }
 isLast(){return this.index>=this.images.length-1||(this.ready&&this.flip.getOrientation()==='landscape'&&this.index>=this.images.length-2);}
 turn(direction){
  if(this.busy||(direction<0&&this.index===0)||(direction>0&&this.isLast()))return;
  if(this.ready){
   if(matchMedia('(prefers-reduced-motion: reduce)').matches){if(direction>0)this.flip.turnToNextPage();else this.flip.turnToPrevPage();}
   else if(direction>0)this.flip.flipNext('bottom');else this.flip.flipPrev('bottom');
  }else{this.index=Math.max(0,Math.min(this.images.length-1,this.index+direction*2));this.showFallback();}
 }
 showFallback(){this.fallback.hidden=false;const pair=Math.floor(this.index/2)*2;this.fallback.querySelectorAll('img').forEach((image,offset)=>{const page=this.images[pair+offset];image.hidden=!page;if(page){image.src=page.src;image.removeAttribute('srcset');image.alt=page.alt;}});this.querySelector('[data-book-status]').textContent=this.dataset.errorLabel;this.update();}
 update(){
  this.back.disabled=this.index===0||this.busy;this.next.disabled=this.isLast()||this.busy;
  this.querySelector('[data-book-count]').textContent=(this.dataset.counterLabel||'Page')+' '+(this.index+1)+' / '+this.images.length;
  if(this.peel){
   this.peel.hidden=!this.ready||this.busy||this.isLast();
   if(this.ready){const bounds=this.flip.getBoundsRect(),host=this.mount.getBoundingClientRect(),stage=this.stage.getBoundingClientRect();const size=this.peel.offsetWidth||56;const right=Math.min(stage.width,host.left-stage.left+bounds.left+bounds.width);const bottom=Math.min(stage.height,host.top-stage.top+bounds.top+bounds.height);this.peel.style.left=Math.max(0,right-size)+'px';this.peel.style.top=Math.max(0,bottom-size)+'px';}
  }
 }
 disconnectedCallback(){this.abort?.abort();this.abort=null;this.viewportObserver?.disconnect();this.resizeObserver?.disconnect();clearTimeout(this.resizeTimer);this.flip?.destroy();this.flip=null;this.ready=false;}
});