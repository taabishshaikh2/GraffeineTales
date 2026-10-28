if(!customElements.get('journal-product'))customElements.define('journal-product',class extends HTMLElement{
 connectedCallback(){
  if(this.abort)return;this.abort=new AbortController();const on=(target,type,callback)=>target?.addEventListener(type,callback,{signal:this.abort.signal});
  const hero=this.querySelector('product-hero'),dialog=this.querySelector('[data-fabric-dialog]'),form=this.querySelector('form'),buy=this.querySelector('[data-pdp-add]'),sticky=this.querySelector('[data-journal-sticky]');
  on(this,'click',event=>{if(event.target.closest('[data-journal-enlarge]')){const current=hero.querySelector('[data-gallery-track]').children[hero.index||0]?.querySelector('img');if(current){this.lightboxTrigger=event.target.closest('button');const box=this.querySelector('[data-journal-lightbox]');const image=box.querySelector('img');image.src=current.currentSrc||current.src;image.alt=current.alt;box.showModal();}}if(event.target.closest('[data-journal-lightbox-close]'))this.querySelector('[data-journal-lightbox]').close();if(event.target.closest('[data-fabric-open]')){this.guideTrigger=event.target.closest('button');dialog.showModal();}if(event.target.closest('[data-fabric-close]'))dialog.close();if(event.target.closest('[data-sticky-submit]')&&!buy.disabled)form.requestSubmit(buy);});
  on(dialog,'close',()=>this.guideTrigger?.focus());on(this.querySelector('[data-journal-lightbox]'),'close',()=>this.lightboxTrigger?.focus());
  on(dialog,'click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  const syncVariant=()=>{const id=form.querySelector('[name=id]').value;document.querySelectorAll('input[data-journal-product="'+hero.dataset.productId+'"]').forEach(input=>{input.value=id;const submit=input.closest('form')?.querySelector('button');if(submit)submit.disabled=buy.disabled;});};on(form,'change',syncVariant);syncVariant();
  if(sticky){
   const update=()=>{const button=sticky.querySelector('button');button.disabled=buy.disabled;sticky.querySelector('[data-sticky-price]').textContent=hero.querySelector('[data-pdp-price]').textContent;button.querySelector('span').textContent=buy.textContent.trim();};
   this.mutation=new MutationObserver(update);this.mutation.observe(buy,{attributes:true,childList:true,subtree:true});on(form,'change',update);update();
   this.observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.target===buy)this.buyVisible=e.isIntersecting;else this.footerVisible=e.isIntersecting;}sticky.hidden=this.buyVisible!==false||this.footerVisible===true;},{threshold:0});this.observer.observe(buy);const footer=document.querySelector('footer');if(footer)this.observer.observe(footer);
  }
 }
 disconnectedCallback(){this.abort?.abort();this.abort=null;this.observer?.disconnect();this.mutation?.disconnect();this.querySelector('dialog[open]')?.close();}
});