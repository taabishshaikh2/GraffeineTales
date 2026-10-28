if(!customElements.get('footer-menu')){
  customElements.define('footer-menu',class extends HTMLElement{
    connectedCallback(){
      if(this.abort)return;
      this.abort=new AbortController();
      this.details=this.querySelector('details');
      this.summary=this.querySelector('summary');
      this.mobile=matchMedia('(max-width: 749px)');
      const update=()=>{this.details.open=!this.mobile.matches;this.summary.tabIndex=this.mobile.matches?0:-1;};
      this.mobile.addEventListener('change',update,{signal:this.abort.signal});
      this.summary.addEventListener('click',event=>{if(!this.mobile.matches)event.preventDefault();},{signal:this.abort.signal});
      update();
    }
    disconnectedCallback(){this.abort?.abort();this.abort=null;}
  });
}