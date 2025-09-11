(function(){
  const defaults = {
    brand: { name: '' },
    whatsapp: {
      number: '',
      template: 'السلام عليكم، أريد: {{items}}\nالإجمالي: {{total}} أوقية\nالاسم: {{name}}\nالهاتف: {{phone}}\nالعنوان: {{address}}'
    },
    languages: ['ar','fr'],
    ui: { cardsPerRowMobile: 2 }
  };

  let cfg = defaults;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET','config/store.json', false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 400) {
      const data = JSON.parse(xhr.responseText);
      cfg = {
        ...defaults,
        ...data,
        brand: { ...defaults.brand, ...(data.brand||{}) },
        whatsapp: { ...defaults.whatsapp, ...(data.whatsapp||{}) },
        ui: { ...defaults.ui, ...(data.ui||{}) }
      };
    }
  } catch(e) {
    cfg = defaults;
  }
  window.config = cfg;

  window.getConfig = function(){
    return cfg;
  };

  window.applyBranding = function(config){
    const name = config.brand && config.brand.name ? config.brand.name : '';
    document.querySelectorAll('.logo__text').forEach(el => { el.textContent = name; });
  };

  window.buildWhatsAppMessage = function(template, data){
    return template.replace(/\{\{(\w+)\}\}/g, function(_, key){ return data[key] !== undefined ? data[key] : ''; });
  };

  function applyUISettings(config){
    const cols = config.ui && config.ui.cardsPerRowMobile;
    if(cols){
      const style = document.createElement('style');
      style.textContent = `@media(max-width:640px){ .products-grid{ grid-template-columns: repeat(${cols}, minmax(0,1fr)); }}`;
      document.head.appendChild(style);
    }
  }

  applyBranding(cfg);
  applyUISettings(cfg);
})();
