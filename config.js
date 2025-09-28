(function(){
  const defaults = {
    brand: { name: '' },
    whatsapp: {
      number: '',
      template: 'السلام عليكم، أريد: {{items}}\nالإجمالي: {{total}} MRU\nالاسم: {{name}}\nالهاتف: {{phone}}\nالعنوان: {{address}}'
    },
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

  window.i18nData = {
    "titles": {
      "brand": "متجر الصاحب alsahib-dd",
      "cart": "السلة",
      "wishlist": "المفضّلة",
      "checkout": "ملخّص الطلب",
      "men": "عطور رجالية",
      "women": "عطور نسائية",
      "unisex": "عطور مختلطة",
      "all": "جميع العطور",
      "best": "الأكثر مبيعاً",
      "discounts": "العروض والتخفيضات"
    },
    "buttons": {
      "checkout": "إتمام الطلب",
      "confirm": "تأكيد وإرسال عبر واتساب",
      "use_my_location": "استخدام موقعي الحالي",
      "view_map": "عرض على الخريطة",
      "continue_shopping": "متابعة التسوق",
      "cancel": "إلغاء والعودة للسلة",
      "add_to_cart": "أضف للسلة",
      "order_now": "اطلب الآن",
      "add_to_wishlist": "إضافة إلى المفضلة",
      "best_sellers": "الأكثر مبيعاً",
      "browse_perfumes": "تصفح العطور",
      "unavailable": "غير متوفر حالياً"
    },
    "labels": {
      "full_name": "الاسم الكامل",
      "phone": "رقم الهاتف",
      "manual_address": "العنوان اليدوي",
      "discount": "خصم"
    },
    "categories": {
      "men": "عطور رجالية",
      "women": "عطور نسائية",
      "unisex": "عطور مختلطة",
      "all": "جميع العطور",
      "best": "الأكثر مبيعاً",
      "discounts": "العروض والتخفيضات"
    },
    "availability": {
      "yes": "متوفر",
      "no": "غير متوفر"
    },
    "currency": "MRU",
    "badges": {
      "best_seller": "الأكثر مبيعاً",
      "new": "جديد",
      "special": "عرض خاص"
    },
    "alerts": {
      "fill_name_phone": "يرجى إدخال الاسم والهاتف",
      "fill_address": "يرجى إدخال العنوان",
      "enter_address_manually": "أدخل عنوانك يدوياً"
    },
    "toasts": {
      "added_cart": "تمت إضافة {name} إلى السلة",
      "added_wishlist": "أُضيف للمفضّلة",
      "removed_wishlist": "أُزيل من المفضّلة",
      "checkout_success": "تم إرسال الطلب عبر واتساب",
      "removed_cart": "أُزيل من السلة",
      "checkout_failed": "فشل إرسال الطلب"
    },
    "cart": {
      "empty": "سلتك فارغة",
      "total": "الإجمالي:",
      "buy_all": "شراء الجميع"
    },
    "wishlist": {
      "empty": "لا توجد عناصر مفضلة بعد"
    },
    "home": {
      "hero_title": "أهلاً بكم في متجر الصاحب alsahib-dd",
      "hero_text": "نقدّم لكم في متجر الصاحب alsahib-dd تشكيلة منتقاة من العطور الأصلية مع خدمة موثوقة وتوصيل سريع إلى جميع المناطق",
      "categories_title": "الفئات الرئيسية",
      "about_title": "نبذة عن المتجر",
      "about_text": "في متجر الصاحب alsahib-dd نمنحك أكثر من مجرد عطر؛ نقدم لك تجربة راقية تجمع بين الأصالة والجودة العالمية وخدمة عملاء تهتم بأدق التفاصيل لعشاق الروائح المميزة.",
      "footer_rights": "جميع الحقوق محفوظة"
    },
    "footer": {
      "links": {
        "about": "من نحن",
        "contact": "تواصل معنا",
        "privacy": "سياسة الخصوصية",
        "terms": "الشروط والأحكام"
      }
    },
    "search": {
      "placeholder": "ابحث..."
    },
    "pages": {
      "home": {
        "title": "الصفحة الرئيسية",
        "description": "متجر الصاحب alsahib-dd يقدم أجود أنواع العطور الأصلية مع خدمة عملاء مميزة وتوصيل سريع لجميع المناطق",
        "keywords": "متجر الصاحب, alsahib-dd, عطور أصلية"
      },
      "cart": {
        "title": "السلة",
        "description": "مراجعة منتجاتك المختارة قبل الدفع"
      },
      "wishlist": {
        "title": "المفضّلة",
        "description": "قائمة العطور التي أضفتها للمفضّلة"
      },
      "discounts": {
        "title": "العروض والتخفيضات",
        "description": "عطور ضمن عروض وتخفيضات خاصة"
      },
      "best": {
        "title": "الأكثر مبيعاً",
        "description": "أفضل العطور مبيعاً"
      },
      "men": {
        "title": "عطر رجالية",
        "description": "تشكيلة واسعة من العطور الرجالية"
      },
      "women": {
        "title": "عطور نسائية",
        "description": "أفضل العطور النسائية"
      },
      "unisex": {
        "title": "عطور مختلطة",
        "description": "عطور تناسب الجنسين"
      },
      "all": {
        "title": "جميع العطور",
        "description": "كل العطور المتوفرة"
      },
      "about": {
        "title": "من نحن",
        "content": "في متجر الصاحب alsahib-dd نرافقك في رحلة عطرية أصيلة تجمع بين الخبرة والابتكار لنختار لك الروائح التي تعبّر عنك.",
        "description": "تعرف على متجر الصاحب alsahib-dd"
      },
      "contact": {
        "title": "تواصل معنا",
        "content": "راسلنا عبر الواتساب",
        "description": "تواصل مع فريقنا"
      },
      "privacy": {
        "title": "سياسة الخصوصية",
        "content": "نحترم خصوصيتك ولا نشارك بياناتك مع أي طرف ثالث",
        "description": "سياسة الخصوصية لمتجر الصاحب alsahib-dd"
      },
      "terms": {
        "title": "الشروط والأحكام",
        "content": "باستخدامك للموقع فإنك توافق على الشروط والأحكام التالية",
        "description": "شروط استخدام متجر الصاحب alsahib-dd"
      },
      "not_found": {
        "title": "الصفحة غير موجودة",
        "message": "الصفحة غير موجودة — العودة للرئيسية",
        "back_home": "العودة للرئيسية",
        "description": "لم يتم العثور على الصفحة المطلوبة"
      }
    }
  };

  function t(key, params={}){
    const parts = key.split('.');
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

  function formatNumber(num){
    const n = Number(num);
    if (n === 0) return '0000';
    return n.toLocaleString('fr-FR');
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

  function applyCanonical(){
    const page = document.body.dataset.page || 'home';
    let url = window.location.origin + '/';
    if(page !== 'home') url += page + '.html';
    let link = document.querySelector('link[rel="canonical"]');
    if(!link){
      link = document.createElement('link');
      link.setAttribute('rel','canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  function applyStructuredData(){
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": cfg.brand && cfg.brand.name ? cfg.brand.name : '',
      "url": window.location.origin,
      "logo": window.location.origin + '/image/logo.png'
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function init(){
    window.i18nData.titles.brand = cfg.brand && cfg.brand.name ? cfg.brand.name : window.i18nData.titles.brand;
    applyBranding(cfg);
    applyUISettings(cfg);
    applyTranslations();
    if(typeof renderCart === 'function') renderCart();
    if(typeof initWishlistForProducts === 'function') initWishlistForProducts();
    if(typeof window.updateSEO === 'function') window.updateSEO();
    applyCanonical();
    applyStructuredData();
  }

  init();
})();
