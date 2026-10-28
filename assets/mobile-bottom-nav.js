if(!customElements.get('mobile-bottom-nav')){
  customElements.define('mobile-bottom-nav',class extends HTMLElement{
    connectedCallback(){
      if(this.abort)return;
      this.abort=new AbortController();
      const on=(target,type,handler)=>target.addEventListener(type,handler,{signal:this.abort.signal});
      on(this,'click',event=>{
        const panel=event.target.closest('[data-dock-panel]');
        const cart=event.target.closest('[data-dock-cart]');
        if(panel)document.dispatchEvent(new CustomEvent('atelier:navigation:open',{detail:{panel:panel.dataset.dockPanel,trigger:panel}}));
        if(cart){
          const drawer=document.querySelector('cart-drawer');
          if(drawer){event.preventDefault();drawer.open(cart);}
        }
      });
      on(document,'atelier:wishlist:update',()=>this.updateWishlist());
      on(window,'storage',event=>{if(event.key==='graffeine-wishlist')this.updateWishlist();});
      on(document,'atelier:cart:update',()=>this.queueCartRefresh());
      on(window,'pageshow',()=>this.queueCartRefresh());
      if(typeof subscribe==='function'&&typeof PUB_SUB_EVENTS!=='undefined')this.unsubscribe=subscribe(PUB_SUB_EVENTS.cartUpdate,()=>this.queueCartRefresh());
      this.updateWishlist();
    }
    updateWishlist(){
      let count=0;
      try{const values=JSON.parse(localStorage.getItem('graffeine-wishlist')||'[]');if(Array.isArray(values))count=new Set(values.filter(value=>typeof value==='string'&&/^[a-z0-9-]+$/.test(value))).size;}catch{}
      const badge=this.querySelector('[data-dock-wishlist-count]');
      badge.textContent=String(count);
      badge.hidden=count===0;
    }
    queueCartRefresh(){
      clearTimeout(this.refreshTimer);
      this.refreshTimer=setTimeout(()=>this.refreshCart(),60);
    }
    async refreshCart(){
      this.request?.abort();
      const request=new AbortController();
      this.request=request;
      try{
        const response=await fetch((window.Shopify?.routes?.root||'/')+'cart.js',{signal:request.signal,headers:{Accept:'application/json'}});
        if(!response.ok)return;
        const cart=await response.json();
        if(request.signal.aborted||!Number.isInteger(cart.item_count))return;
        const badge=this.querySelector('[data-dock-cart-count]');
        badge.textContent=String(cart.item_count);
        badge.hidden=cart.item_count===0;
        const link=this.querySelector('[data-dock-cart]');
        link.setAttribute('aria-label',link.dataset.cartLabel+(cart.item_count?': '+cart.item_count:''));
      }catch{}
    }
    disconnectedCallback(){
      this.abort?.abort();
      this.abort=null;
      clearTimeout(this.refreshTimer);
      this.request?.abort();
      this.unsubscribe?.();
    }
  });
}
