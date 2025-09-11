(function(){
  const langs = (typeof config !== 'undefined' && config.languages && config.languages.length)
    ? config.languages
    : ['ar','fr'];
  let currentLang = localStorage.getItem('ui_lang') || langs[0];
  const htmlEl = document.documentElement;
  window.i18nData = {};

  function setDir(lang){
    htmlEl.lang = lang;
    htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  function t(key, params={}){
    let parts = key.split('.');
    let res = parts.reduce((o,p)=> o ? o[p] : undefined, window.i18nData);
    if(typeof res === 'string'){
      for(const k in params){
        res = res.replace(new RegExp('\\{'+k+'\\}','g'), params[k]);
      }
      return res;
    }
    return key;
  }
  window.t = t;

  function applyTranslations(){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
  }
  window.applyTranslations = applyTranslations;

  async function loadLang(lang){
    try{
      const res = await fetch('i18n/'+lang+'.json');
      window.i18nData = await res.json();
    }catch(e){ window.i18nData = {}; }
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
  }
  window.changeLanguage = function(){
    const idx = langs.indexOf(currentLang);
    const next = langs[(idx+1)%langs.length];
    loadLang(next);
  }
  loadLang(currentLang);
})();
