if(!customElements.get('product-hero')){
 customElements.define('product-hero',class extends HTMLElement{
  connectedCallback(){
   if(this.abort)return;
   this.abort=new AbortController();
   const on=(target,type,handler)=>target?.addEventListener(type,handler,{signal:this.abort.signal});
   this.variants=JSON.parse(this.querySelector('[data-product-variants]').textContent);
   this.delivery=JSON.parse(this.querySelector('[data-delivery-config]')?.textContent||'{}');
   this.variantImages=JSON.parse(this.querySelector('[data-variant-images]')?.textContent||'{}');
   this.form=this.querySelector('form');
   this.track=this.querySelector('[data-gallery-track]');
   this.allSlides=[...this.track.children];
   this.slides=[...this.allSlides];
   this.querySelectorAll('[data-gallery-index]').forEach(button=>button.dataset.originalGalleryIndex=button.dataset.galleryIndex);
   this.index=0;
   on(this,'click',event=>{
    const thumb=event.target.closest('[data-gallery-index]');
    const arrow=event.target.closest('[data-gallery-direction]');
    const step=event.target.closest('[data-pdp-step]');
    if(thumb)this.go(Number(thumb.dataset.galleryIndex));
    if(arrow)this.go((this.index+Number(arrow.dataset.galleryDirection)+this.slides.length)%this.slides.length);
    if(step){const input=this.form.elements.quantity;const increment=Number(input.step)||1;const min=Number(input.min)||1;const max=input.max?Number(input.max):Infinity;input.value=String(Math.min(max,Math.max(min,(Number(input.value)||min)+Number(step.dataset.pdpStep)*increment)));input.dispatchEvent(new Event('change',{bubbles:true}));}
    if(event.target.closest('[data-check-pincode]'))this.checkPincode();
   });
   on(this,'change',event=>{if(event.target.matches('[data-option-index] input'))this.updateVariant();});
   on(this.querySelector('[data-pincode]'),'input',event=>{if(event.target.value.trim().length===6)this.checkPincode();});
   on(this.querySelector('[data-pincode]'),'keydown',event=>{if(event.key==='Enter'){event.preventDefault();this.checkPincode();}});
   on(this.track,'scroll',()=>{cancelAnimationFrame(this.frame);this.frame=requestAnimationFrame(()=>this.updateGallery());});
   on(this.track,'keydown',event=>{if(event.target!==this.track||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();this.go((this.index+(event.key==='ArrowRight'?1:-1)+this.slides.length)%this.slides.length);});
   this.querySelectorAll('.atelier-pdp__accordions details').forEach(details=>{
    const summary=details.querySelector('summary');
    on(summary,'click',event=>{
     if(matchMedia('(prefers-reduced-motion: reduce)').matches||!details.animate)return;
     event.preventDefault();
     const running=this.animations?.get(details);
     const closing=running?this.accordionTargets.get(details):details.open;
     running?.cancel();
     this.animations ||= new Map();
     const start=details.offsetHeight;
     this.accordionTargets ||= new Map();
     this.accordionTargets.set(details,!closing);
     details.style.overflow='hidden';
     details.open=true;
     const finish=closing?summary.offsetHeight:details.scrollHeight;
     const animation=details.animate({height:[start+'px',finish+'px']},{duration:220,easing:'cubic-bezier(.2,.6,.3,1)'});
     this.animations.set(details,animation);
     animation.onfinish=()=>{details.open=!closing;details.style.overflow='';this.animations.delete(details);};
    });
   });
   this.filterVariantGallery(this.variants.find(variant=>String(variant.id)===this.form.querySelector('[name=id]').value));
   this.updateGallery();
  }
  go(index){index=Math.max(0,Math.min(this.slides.length-1,index));this.track.scrollTo({left:this.track.clientWidth*index,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  updateGallery(){
   this.index=Math.max(0,Math.min(this.slides.length-1,Math.round(this.track.scrollLeft/(this.track.clientWidth||1))));
   this.querySelectorAll('[data-gallery-index]').forEach(button=>{if(Number(button.dataset.galleryIndex)===this.index)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
   this.slides.forEach((slide,index)=>{if(index!==this.index)slide.querySelectorAll('video').forEach(video=>video.pause());});
  }
  filterVariantGallery(variant){
   if(!this.allSlides)return;
   const image=this.variantImages?.[String(variant?.id)]||variant?.featured_media;
   const start=image?this.allSlides.findIndex(slide=>String(slide.dataset.mediaId)===String(image.id)):-1;
   const anchors=[...new Set(Object.values(this.variantImages||{}).map(media=>this.allSlides.findIndex(slide=>String(slide.dataset.mediaId)===String(media.id))).filter(index=>index>=0))].sort((a,b)=>a-b);
   const end=start<0?this.allSlides.length:(anchors.find(index=>index>start)??this.allSlides.length);
   this.allSlides.forEach((slide,index)=>{slide.hidden=start>=0&&(index<start||index>=end);if(slide.hidden)slide.querySelectorAll('video').forEach(video=>video.pause());});
   this.slides=this.allSlides.filter(slide=>!slide.hidden);
   this.querySelectorAll('[data-gallery-index]').forEach(button=>{
    const original=Number(button.dataset.originalGalleryIndex);
    const local=this.slides.indexOf(this.allSlides[original]);
    button.hidden=local<0;
    if(local>=0)button.dataset.galleryIndex=String(local);
   });
   this.querySelectorAll('[data-gallery-direction],.atelier-pdp__dots,.atelier-pdp__thumbnails').forEach(control=>control.hidden=this.slides.length<2);
   this.slides.forEach((slide,index)=>slide.setAttribute('aria-label',(index+1)+' / '+this.slides.length));
   this.index=0;this.track.scrollLeft=0;
   this.updateGallery();
  }
  money(amount){if(this.dataset.compactMoney==='true')return (this.dataset.currencySymbol||'')+new Intl.NumberFormat(document.documentElement.lang||'en-IN',{minimumFractionDigits:0,maximumFractionDigits:2}).format(amount/100);return new Intl.NumberFormat(document.documentElement.lang||'en-IN',{style:'currency',currency:this.dataset.currency||'INR'}).format(amount/100);}
  updateVariant(){
   const options=[...this.querySelectorAll('[data-option-index]')].map(field=>{const value=field.querySelector('input:checked')?.value;field.querySelector('[data-selected-option]').textContent=value||'';return value;});
   const variant=this.variants.find(item=>item.options.every((value,index)=>value===options[index]));
   const button=this.querySelector('[data-pdp-add]');
   const id=this.form.querySelector('[name=id]');
   id.value=variant?.id||'';
   button.disabled=!variant?.available;
   button.querySelector('span').textContent=variant?(variant.available?this.dataset.addLabel:this.dataset.soldLabel):this.dataset.unavailableLabel;
   const express=this.querySelector('.atelier-pdp__express');if(express)express.hidden=!variant?.available;
   if(!variant)return;
   this.querySelector('[data-pdp-price]').textContent=this.money(variant.price);
   const compare=this.querySelector('[data-pdp-compare]');const save=this.querySelector('[data-pdp-saving]');
   const discounted=variant.compare_at_price>variant.price;compare.hidden=!discounted||this.dataset.showCompare==='false';save.hidden=!discounted||this.dataset.showSaving==='false';
   compare.textContent=discounted?this.money(variant.compare_at_price):'';
   save.textContent=discounted?this.delivery.save+' '+Math.round((variant.compare_at_price-variant.price)*100/variant.compare_at_price)+'%':'';
   const quantity=this.form.elements.quantity;const rules=variant.quantity_rule||{min:1,increment:1};quantity.min=rules.min||1;quantity.step=rules.increment||1;if(rules.max)quantity.max=rules.max;else quantity.removeAttribute('max');quantity.value=rules.min||1;
   const url=new URL(location.href);url.searchParams.set('variant',variant.id);history.replaceState({},'',url);
   this.filterVariantGallery(variant);
   this.form.dispatchEvent(new Event('change',{bubbles:true}));
  }
  checkPincode(){
   const input=this.querySelector('[data-pincode]');const result=this.querySelector('[data-delivery-result]');
   if(!input||!result)return;
   const pincode=input.value.trim();const valid=/^[1-9][0-9]{5}$/.test(pincode);input.setAttribute('aria-invalid',String(!valid));result.dataset.invalid=String(!valid);
   if(!valid){result.textContent=this.delivery.invalid;return;}
   const zone=this.delivery.zones.find(zone=>(zone.prefixes||'').split(',').map(value=>value.trim()).filter(value=>/^[1-9][0-9]{0,5}$/.test(value)).some(prefix=>pincode.startsWith(prefix)));
   result.textContent=zone?.message||this.delivery.fallback;
  }
  disconnectedCallback(){this.abort?.abort();this.abort=null;cancelAnimationFrame(this.frame);this.animations?.forEach(animation=>animation.cancel());}
 });
}