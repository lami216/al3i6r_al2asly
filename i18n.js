(function(){
  const langs = (typeof config !== 'undefined' && config.languages && config.languages.length)
    ? config.languages
    : ['ar','fr'];
  let currentLang = localStorage.getItem('ui_lang') || langs[0];
  const htmlEl = document.documentElement;
  window.i18nData = {};
  const fallbackLang = 'fr';
  let fallbackData = {};

  function setDir(lang){
    htmlEl.lang = lang;
    htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  function t(key, params={}){
    const parts = key.split('.');
    let res = parts.reduce((o,p)=> o ? o[p] : undefined, window.i18nData);
    if(res === undefined && fallbackData){
      res = parts.reduce((o,p)=> o ? o[p] : undefined, fallbackData);
    }
    if(typeof res === 'string'){
      for(const k in params){
        res = res.replace(new RegExp('\\{'+k+'\\}','g'), params[k]);
      }
      return res;
    }
    return key;
  }
  window.t = t;

  function formatNumber(num){
    return Number(num).toLocaleString('fr-FR');
  }
  window.formatNumber = formatNumber;

  function applyTranslations(){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });
    document.querySelectorAll('[data-i18n-value]').forEach(el=>{
      const key = el.getAttribute('data-i18n-value');
      el.value = t(key);
    });
  }
  window.applyTranslations = applyTranslations;

  async function loadLangData(lang){
    try{
      const res = await fetch('lang/'+lang+'.json');
      return await res.json();
    }catch(e){
      return {};
    }
  }

  async function loadLang(lang){
    window.i18nData = await loadLangData(lang);
    if(lang !== fallbackLang){
      fallbackData = await loadLangData(fallbackLang);
    }else{
      fallbackData = {};
    }
    currentLang = lang;
    localStorage.setItem('ui_lang', lang);
    setDir(lang);
    applyTranslations();
    const toggle = document.getElementById('langToggle');
    if(toggle){
      const next = langs[(langs.indexOf(lang)+1)%langs.length] || '';
      toggle.textContent = next.toUpperCase();
    }
    if(typeof renderCart === 'function') renderCart();
    if(typeof initWishlistForProducts === 'function') initWishlistForProducts();
    if(typeof window.updateSEO === 'function') window.updateSEO();
  }
  window.changeLanguage = function(){
    const idx = langs.indexOf(currentLang);
    const next = langs[(idx+1)%langs.length];
    loadLang(next);
  }
  loadLang(currentLang);
})();
