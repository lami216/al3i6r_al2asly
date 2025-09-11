(function(){
  const url = (p)=> new URL(p, window.location.href).href;

  // افتراضيات آمنة
  window.AppConfig = { brand:{ name:'مملكة العطور' }, languages:['ar','fr'] };
  window.I18N = {};

  async function loadConfig(){
    try{
      const r = await fetch(url('./config/store.json'));
      if(r.ok) window.AppConfig = { ...window.AppConfig, ...(await r.json()) };
    }catch(_){ }
    window.config = window.AppConfig; // توافق مع السكربتات القديمة
  }

  async function loadI18N(lang){
    try{
      const r = await fetch(url(`./lang/${lang}.json`));
      window.I18N = r.ok ? await r.json() : {};
    }catch(_){ window.I18N = {}; }
  }

  function t(key, vars){
    const v = key.split('.').reduce((o,k)=> o && o[k], window.I18N);
    if(!v) return null;
    return (v+"").replace(/\{(\w+)\}/g, (_,k)=> (vars&&vars[k]) ?? '');
  }

  function toWesternDigits(s){
    return (s+'').replace(/[٠-٩]/g, d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  }

  function formatNumber(num){
    try{ return toWesternDigits(Number(num).toLocaleString('en-US')); }
    catch(_){ return toWesternDigits(num); }
  }

  function translatePage(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      const txt = t(k);
      if(txt) el.textContent = toWesternDigits(txt);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const k = el.getAttribute('data-i18n-placeholder');
      const txt = t(k);
      if(txt) el.setAttribute('placeholder', toWesternDigits(txt));
    });
  }

  function applySEO(){
    const body = document.body;
    if(!body) return;
    const titleKey = body.getAttribute('data-title-key');
    const descKey = body.getAttribute('data-desc-key');
    const title = titleKey && t(titleKey);
    if(title) document.title = toWesternDigits(title);
    const desc = descKey && t(descKey);
    if(desc){
      const meta = document.querySelector('meta[name="description"]');
      if(meta) meta.setAttribute('content', toWesternDigits(desc));
    }
  }

  async function init(){
    await loadConfig();
    const saved = localStorage.getItem('ui_lang');
    const lang = saved || (window.AppConfig.languages && window.AppConfig.languages[0]) || 'ar';
    await loadI18N(lang);

    document.documentElement.setAttribute('dir', lang==='ar' ? 'rtl' : 'ltr');

    window.__i18n = { t, loadI18N, toWesternDigits, translatePage };
    window.t = t; // توافق مع السكربتات الحالية
    window.applyTranslations = translatePage; // توافق مع السكربتات القديمة
    window.formatNumber = formatNumber;

    translatePage();
    applySEO();
  }

  window.switchLang = async function(lang){
    localStorage.setItem('ui_lang', lang);
    await loadI18N(lang);
    document.documentElement.setAttribute('dir', lang==='ar' ? 'rtl' : 'ltr');
    translatePage();
    applySEO();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
