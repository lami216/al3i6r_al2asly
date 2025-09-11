(async function(){
  async function loadConfig(){
    if(window.AppConfig) return window.AppConfig;
    try{
      const res = await fetch('/config/store.json');
      window.AppConfig = await res.json();
    }catch(e){
      window.AppConfig = {brand:{name:''}, languages:['ar','fr']};
    }
    return window.AppConfig;
  }

  function toWesternDigits(str){
    const map = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
    return String(str).replace(/[٠-٩]/g, d => map[d] || d);
  }
  window.toWesternDigits = toWesternDigits;

  function formatNumber(num){ return Number(num).toLocaleString('en-US'); }
  window.formatNumber = formatNumber;

  function buildWhatsAppMessage(template,data){ return template.replace(/\{\{(\w+)\}\}/g, (_,k)=> data[k]!==undefined?data[k]:'' ); }
  window.buildWhatsAppMessage = buildWhatsAppMessage;


  let fallbackData = {};
  let currentLang = 'ar';

  async function loadI18N(lang){
    try{
      const res = await fetch(`/i18n/${lang}.json`);
      window.I18N = await res.json();
    }catch(e){ window.I18N = {}; }
    const fallbackLang = (AppConfig.languages.find(l=>l!==lang)) || 'fr';
    if(fallbackLang){
      try{ fallbackData = await (await fetch(`/i18n/${fallbackLang}.json`)).json(); }
      catch(e){ fallbackData = {}; }
    }
    currentLang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('ui_lang', lang);
  }
  window.loadI18N = loadI18N;

  function t(key, vars={}){
    const segs = key.split('.');
    let val = segs.reduce((o,p)=>o?o[p]:undefined, window.I18N);
    if(val === undefined){
      val = segs.reduce((o,p)=>o?o[p]:undefined, fallbackData);
    }
    if(typeof val === 'string'){
      Object.keys(vars).forEach(k=>{
        val = val.replace(new RegExp(`\\{${k}\\}`,'g'), vars[k]);
      });
      return toWesternDigits(val);
    }
    return key;
  }
  window.t = t;

  function setBrandName(){
    const name = AppConfig?.brand?.name || '';
    document.querySelectorAll('.logo__text, .brand-name').forEach(el=>{ el.textContent = name; });
  }
  window.setBrandName = setBrandName;

  function translatePage(){
    const brand = AppConfig?.brand?.name || '';
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key, {brand});
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key, {brand}));
    });
    document.querySelectorAll('[data-i18n-value]').forEach(el=>{
      const key = el.getAttribute('data-i18n-value');
      el.value = t(key, {brand});
    });
  }
  window.translatePage = translatePage;

  function applySEO(){
    const body = document.body;
    const titleKey = body.getAttribute('data-title-key');
    const descKey = body.getAttribute('data-desc-key');
    const brand = AppConfig?.brand?.name || '';
    const titleText = titleKey ? `${t(titleKey)} | ${brand}` : brand;
    const descText = descKey ? t(descKey) : '';
    if(titleText) document.title = titleText;
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute('content', descText);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if(ogTitle) ogTitle.setAttribute('content', titleText);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if(ogDesc) ogDesc.setAttribute('content', descText);
  }
  window.applySEO = applySEO;

  function updateCartCount(){
    const countEl = document.getElementById('cartCount');
    if(!countEl || !window.cart) return;
    const count = window.cart.reduce((s,i)=>s + (i.qty||0),0);
    countEl.textContent = count;
    if(count>0) countEl.classList.remove('hidden'); else countEl.classList.add('hidden');
  }
  window.updateCartCount = updateCartCount;

  function renderHeader(){
    const header = document.getElementById('siteHeader');
    if(!header) return;
    header.innerHTML = `
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <a href="index.html" class="flex items-center space-x-2">
        <i class="fas fa-spray-can text-white text-2xl"></i>
        <h1 class="text-xl font-bold logo__text"></h1>
      </a>
      <div class="flex items-center gap-4">
        <button id="langToggle" class="text-sm"></button>
        <a href="wishlist.html" class="text-white"><i class="fas fa-heart text-2xl"></i></a>
        <a href="cart.html" class="relative text-white p-2 bg-transparent">
          <i class="fas fa-shopping-cart text-2xl"></i>
          <span id="cartCount" class="hidden absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"></span>
        </a>
      </div>
    </div>`;
    setBrandName();
    const langs = AppConfig.languages || ['ar','fr'];
    const toggle = document.getElementById('langToggle');
    const next = langs[(langs.indexOf(currentLang)+1)%langs.length];
    toggle.textContent = next ? next.toUpperCase() : '';
    toggle.onclick = ()=>{
      const n = langs[(langs.indexOf(currentLang)+1)%langs.length];
      loadI18N(n).then(()=>{ translatePage(); setBrandName(); applySEO(); renderHeader(); });
    };
    updateCartCount();
  }
  window.renderHeader = renderHeader;

  function renderFooter(){
    const footer = document.getElementById('siteFooter');
    if(!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `
      <p>&copy; <span id="year">${year}</span> <span class="brand-name"></span> - <span data-i18n="home.footer_rights"></span></p>
      <div class="mt-2 flex justify-center gap-4">
        <a href="about.html" data-i18n="footer.links.about"></a>
        <a href="contact.html" data-i18n="footer.links.contact"></a>
        <a href="privacy.html" data-i18n="footer.links.privacy"></a>
        <a href="terms.html" data-i18n="footer.links.terms"></a>
      </div>`;
    setBrandName();
    translatePage();
  }
  window.renderFooter = renderFooter;

  document.addEventListener('DOMContentLoaded', async ()=>{
    await loadConfig();
    const lang = localStorage.getItem('ui_lang') || AppConfig.languages[0];
    await loadI18N(lang);
    translatePage();
    setBrandName();
    applySEO();
    renderHeader();
    renderFooter();
  });
})();
