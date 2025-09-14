    const localProductsData = {
      products: [
           { name: 'jean paul gaultier le male elixir', desc: 'عطر شبابي عصري بنفحات حارة - 100000 أوقية', img: 'image/jean_paul_gaultier_le_male_elixir.png', category: 'men', price: 100000, available: true },
        { name: 'Dior sauvage', desc: 'أحد أشهر العطور الرجالية حول العالم - 100000 أوقية', img: 'image/Dior_sauvage_200ml.png', category: 'men', price: 100000, available: true, badge: 'الأكثر مبيعاً' },
        { name: 'officer', desc: 'عطر رسمي أنيق يلائم جميع المناسبات - 10000 أوقية', img: 'image/officer.png', category: 'men', price: 10000, available: true, badge: 'الأكثر مبيعاً' },
        { name: 'jean_paul_gaultier_paradise', desc: 'عطر شبابي فاخر بنفحات برية منعشة - 76200 أوقية', img: 'image/jean_paul_gaultier_paradise.png', category: 'men', price: 76200, available: true, badge: 'جديد' },
        { name: 'tom_ford_noir', desc: 'عطر رجالي غامض بنفحات خشبية دافئة - 72000 أوقية', img: 'image/tom_ford_noir.png', category: 'men', price: 72000, available: false, badge: 'الأكثر مبيعاً' },
        { name: '212_VIP_black', desc: 'عطر شبابي جريء بنكهات عصرية - 61000 أوقية', img: 'image/212_VIP_black.png', category: 'men', price: 61000, available: true },
        { name: 'Acqua_di_Gio_Armani', desc: 'عطر رجالي منعش مستوحى من البحر - 61000 أوقية', img: 'image/Acqua_di_Gio_Armani.png', category: 'men', price: 61000, available: true },
        { name: 'La_Nuit_Trésor', desc: 'عطر نسائي رومانسي بنفحات الفانيليا - 58000 أوقية', img: 'image/La_Nuit_Tresor.png', category: 'women', price: 58000, available: true, badge: 'الأكثر مبيعاً' },
        { name: 'MY_WAY', desc: 'عطر نسائي أنيق بنكهات زهرية مشرقة - 58000 أوقية', img: 'image/MY_WAY.png', category: 'women', price: 58000, available: true, badge: 'الأكثر مبيعاً' },
        { name: 'Dolce_and_Gabbana_the_one', desc: 'عطر نسائي فاخر بنفحات شرقية دافئة - 57000 أوقية', img: 'image/Dolce_and_Gabbana_the_one.png', category: 'women', price: 57000, available: false },
        { name: 'You_Intensely', desc: 'عطر نسائي قوي بنكهات فاكهية جذابة - 54000 أوقية', img: 'image/You_Intensely.png', category: 'women', price: 54000, available: true },
        { name: 'Supremacy_Collectors_Edition', desc: 'عطر رجالي مميز بنفحات شرقية فاخرة - 38000 أوقية', img: 'image/Supremacy_Collector_s_Edition.png', category: 'men', price: 38000, available: true },
        { name: 'Hawas_Black_Rasasi', desc: 'هوس اسود عطر رجالي قوي بنكهات خشبية منعشة - 38000 أوقية', img: 'image/Hawas_Black_Rasasi.png', category: 'men', price: 38000, available: true },
        { name: 'Club_de_Nuit_Intense_Man_200ml', desc: 'عطر رجالي مكثف بنفحات فاكهية وعنبرية - 35000 أوقية', img: 'image/Club_de_Nuit_Intense_Man_200ml.png', category: 'men', price: 35000, available: true },
        { name: 'Supremacy_Not_Only_Intense', desc: 'عطر رجالي عصري بنكهات قوية ومنعشة - 29000 أوقية', img: 'image/Supremacy_Not_Only_Intense.png', category: 'men', price: 29000, available: true },
        { name: 'Oud_lavender', desc: 'عود لافندر عطر شرقي مميز يمزج العود واللافندر - 26000 أوقية', img: 'image/Oud_lavender.png', category: 'unisex', price: 26000, available: true },
        { name: '9PM_rebel', desc: 'عطر شبابي مفعم بالحيوية بنكهات جريئة - 25000 أوقية', img: 'image/9PM_Rebel.png', category: 'men', price: 25000, available: true },
        { name: 'Liquid_Brun', desc: 'عطر رجالي كلاسيكي بنفحات خشبية دافئة - 23000 أوقية', img: 'image/Liquid_Brun.png', category: 'men', price: 23000, available: true },
        { name: 'Odyssey_Spectra', desc: 'عطر منعش بنكهات مائية وفاكهية - 21000 أوقية', img: 'image/Odyssey_Spectra.png', category: 'unisex', price: 21000, available: true, badge: 'الأكثر مبيعاً' },
        { name: 'Club_de_Nuit_Sillage', desc: 'عطر رجالي فاخر بلمسة فاكهية ومنعشة - 20000 أوقية', img: 'image/Club_de_Nuit_Sillage.png', category: 'men', price: 20000, available: true },
        { name: 'hawas_elixir', desc: 'هوس الكسير عطر رجالي منعش بنكهات حمضية قوية - 20000 أوقية', img: 'image/hawas_elixir.png', category: 'men', price: 20000, available: true },
        { name: 'Club_De_Nuit_Urban_Elixir', desc: 'عطر شبابي عصري بنكهات منعشة - 19000 أوقية', img: 'image/Club_De_Nuit_Urban_Elixir.png', category: 'men', price: 19000, available: true },
        { name: '9am_Dive', desc: 'عطر منعش مستوحى من الصباح البارد', img: 'image/9am_Dive.png', category: 'unisex', price: 16000, originalPrice: 19000, available: true },
        { name: 'Turathi_Blue', desc: 'عطر شرقي منعش بنفحات بحرية - 19000 أوقية', img: 'image/Turathi_Blue.png', category: 'unisex', price: 19000, available: true },
        { name: 'Hawas_for_Him', desc: 'هوس فور هيم عطر رجالي منعش بنكهات مائية وحمضية - 16000 أوقية', img: 'image/Hawas_for_Him.png', category: 'men', price: 16000, available: true },
        { name: '9PM', desc: 'عطر شبابي جذاب بنكهات فاكهية دافئة - 16000 أوقية', img: 'image/9PM.png', category: 'men', price: 16000, available: true },
        { name: 'Hawas_Ice_for_Him', desc: 'هوس آيس عطر رجالي منعش بنكهات جليدية - 16000 أوقية', img: 'image/Hawas_Ice_for_Him.png', category: 'men', price: 16000, available: true },
        { name: 'Al_Wisam', desc: 'الوسام عطر شرقي كلاسيكي بنكهات دافئة - 15000 أوقية', img: 'image/Al_Wisam.png', category: 'unisex', price: 15000, available: true },
        { name: 'Confidential', desc: 'عطر أنيق بنفحات غامضة وفاخرة - 15000 أوقية', img: 'image/Confidential.png', category: 'unisex', price: 15000, available: true },
        { name: 'Supremacy Incense', desc: 'عطر رجالي فاخر - 15000 أوقية', img: 'image/Supremacy Incense.png', category: 'men', price: 15000, available: true },
        { name: 'Mandarin Sky', desc: 'عطر رجالي منعش - 15000 أوقية', img: 'image/Mandarin Sky.png', category: 'men', price: 15000, available: true },
        { name: 'Khamrah', desc: 'خمرة عطر مختلط برائحة القرفة والفانيليا - 13000 أوقية', img: 'image/Khamrah.png', category: 'unisex', price: 13000, available: true, badge: 'عرض خاص' },
        { name: 'Khamrah Qahwa', desc: 'خمرة قهوة عطر مختلط بنفحات القهوة والتوابل - 13000 أوقية', img: 'image/Khamrah Qahwa.png', category: 'unisex', price: 13000, available: true },
        { name: 'Ra\'ed', desc: 'الرائد عطر رجالي شرقي - 12000 أوقية', img: 'image/Raed.png', category: 'men', price: 12000, available: true },
        { name: 'Fakhar Lattafa Black', desc: 'فخر الطافة عطر رجالي فاخر - 12000 أوقية', img: 'image/Fakhar Lattafa Black.png', category: 'men', price: 12000, available: true },
        { name: 'Fakhar Lattafa White', desc: 'فخر الطافة عطر نسائي أنيق - 12000 أوقية', img: 'image/Fakhar Lattafa White.png', category: 'women', price: 12000, available: true },
        { name: 'Saheb White', desc: 'الصاحب عطر رجالي كلاسيكي - 10000 أوقية', img: 'image/Saheb White.png', category: 'men', price: 10000, available: true },
        { name: 'Saheb Brown', desc: 'الصاحب عطر رجالي دافئ - 10000 أوقية', img: 'image/Saheb Brown.png', category: 'men', price: 10000, available: true },
        { name: 'Asad', desc: 'أسد عطر رجالي قوي - 10000 أوقية', img: 'image/Asad.png', category: 'men', price: 10000, available: true },
        { name: 'Asala', desc: 'عطر اصالة عطر فاخر من الاخر - 10000 أوقية', img: 'image/facebook-icon.png', category: 'women', price: 10000, available: true },
        { name: 'Box Musoof', desc: 'بوكس موصوف مجموعة عطور متنوعة - 10000 أوقية', img: 'image/Box Musoof.png', category: 'unisex', price: 10000, available: true },
        { name: 'Bade\'e Al Oud', desc: 'بديع العود عطر مختلط برائحة العود - 10000 أوقية', img: 'image/Badee Al Oud.png', category: 'unisex', price: 10000, available: true },
        { name: 'Mayar', desc: 'ميار عطر نسائي ناعم', img: 'image/Mayar.png', category: 'women', price: 7000, originalPrice: 10000, available: true },
        { name: 'Gissah', desc: 'قصة عطر نسائي جذاب', img: 'image/Gissah.png', category: 'women', price: 6500, originalPrice: 9500, available: true },
        { name: 'Asad Zanzibar', desc: 'أسد عطر رجالي بنفحات الزنجبيل - 8200 أوقية', img: 'image/Asad Zanzibar.png', category: 'men', price: 8200, available: true },
        { name: 'Saif Al Batal', desc: 'سيف البطل عطر رجالي شرقي - 8000 أوقية', img: 'image/Saif Al Batal.png', category: 'men', price: 8000, available: true },
        { name: 'EL GHAWAS', desc: 'الغواص عطر رجالي بحري - 8000 أوقية', img: 'image/EL GHAWAS.png', category: 'men', price: 8000, available: true },
        { name: 'Fakhar Lattafa Gold', desc: 'فخر عطر رجالي فاخر - 8000 أوقية', img: 'image/Fakhar Lattafa Gold.png', category: 'men', price: 8000, available: true },
        { name: 'Yara', desc: 'يارا عطر نسائي زهري', img: 'image/Yara.png', category: 'women', price: 4000, originalPrice: 7000, available: true },
        { name: 'Tamima', desc: 'تميمة عطر نسائي أنيق - 7000 أوقية', img: 'image/Tamima.png', category: 'women', price: 7000, available: true },
        { name: 'Ramz Lattafa', desc: 'رمز الطافة عطر رجالي شرقي - 7000 أوقية', img: 'image/Ramz Lattafa.png', category: 'men', price: 7000, available: true },
        { name: 'Ameerat Al Arab', desc: 'اميرة العرب عطر نسائي فاخر - 7000 أوقية', img: 'image/Ameerat Al Arab.png', category: 'women', price: 7000, available: true },
        { name: 'Ana Abiyedh', desc: 'أنا الأبيض عطر مختلط برائحة المسك - 7000 أوقية', img: 'image/Ana Abiyedh.png', category: 'unisex', price: 7000, available: true },
        { name: 'Sayaad Al Quloob', desc: 'صياد عطر رجالي جذاب - 7000 أوقية', img: 'image/Sayaad Al Quloob.png', category: 'men', price: 7000, available: true },
        { name: 'moosouf', desc: 'موصوف عطر رجالي شرقي فاخر يدوم طويلاً - 5000 أوقية', img: 'image/Moosouf.png', category: 'men', price: 5000, available: true },
        { name: 'In The Stars Body Lotion', desc: 'لوشن معطر برائحة النجوم مع مزيج من الفواكه والمسك الدافئ - 12000 أوقية', img: 'image/In_The_Stars_Body_Lotion.png', category: 'unisex', price: 12000, available: true },
        { name: 'Into the Night perfume', desc: 'عطر نسائي غامض بنفحات التوت الأسود والفانيليا - 12000 أوقية', img: 'image/Into_the_Night_perfume.png', category: 'women', price: 12000, available: true },
        { name: 'INTO THE NIGHT Body Lotion', desc: 'لوشن برائحة العطر الشهير Into the Night - 12000 أوقية', img: 'image/INTO_THE_NIGHT_Body_Lotion.png', category: 'women', price: 12000, available: false },
        { name: 'You\'re The One', desc: 'عطر زهري فاخر بمزيج من الورد والفراولة - 12000 أوقية', img: 'image/Youre_The_0ne.png', category: 'women', price: 12000, available: true },
        { name: 'Gingham', desc: 'عطر نقي ومنعش برائحة الزهور البيضاء والليمون - 12000 أوقية', img: 'image/Gingham.png', category: 'unisex', price: 12000, available: true },
        { name: 'In the Stars', desc: 'عطر يجمع بين رائحة الكشمير والتمر الهندي - 12000 أوقية', img: 'image/In_the_Stars.png', category: 'unisex', price: 12000, available: true },
        { name: 'Sense Laverne', desc: 'عطر جورجينا قوي بنفحات الفلفل الأسود والعود - 25000 أوقية', img: 'image/Sense_Laverne.png', category: 'women', price: 25000, available: false },
     
      ],
       
      symbols: {
      'moosouf': '🍁❄️🌙',
        'jean paul gaultier le male elixir': '🍁❄️🌙',
        'Dior sauvage': '🌱☂️☀️',
        'officer': '🌱🍁☀️',
        'jean_paul_gaultier_paradise': '☂️🌱☀️',
        'tom_ford_noir': '🍁❄️🌙',
        '212_VIP_black': '🍁🌙',
        'Acqua_di_Gio_Armani': '☂️🌱☀️',
        'La_Nuit_Trésor': '🍁❄️🌙',
        'MY_WAY': '🌱☂️☀️',
        'Club_de_Nuit_Sillage': '☀️☂️🌱',
        'Dolce_and_Gabbana_the_one': '🍁❄️🌙',
        'You_Intensely': '🍁❄️🌙',
        'Supremacy_Collectors_Edition': '🍁❄️🌙',
        'Hawas_Black_Rasasi': '🌱☂️☀️',
        'Club_de_Nuit_Intense_Man_200ml': '☂️☀️',
        'Supremacy_Not_Only_Intense': '☂️🌱☀️',
        'Oud_lavender': '🍁❄️🌙',
        '9PM_rebel': '🍁🌙',
        'Liquid_Brun': '🍁❄️🌙',
        'Odyssey_Spectra': '☂️☀️',
        'hawas_elixir': '☂️☀️',
        'Club_De_Nuit_Urban_Elixir': '☂️🌱☀️',
        '9am_Dive': '☂️🌱☀️',
        'Turathi_Blue': '☂️☀️',
        'Hawas_for_Him': '☂️☀️',
        '9PM': '🍁🌙',
        'Hawas_Ice_for_Him': '☂️☀️',
        'Confidential': '🍁❄️🌙',
        'Al_Wisam': '🍁❄️🌙',       
        'Supremacy Incense': '🍁❄️🌙',
        'Mandarin Sky': '🌱☀️',
        'Khamrah': '🍁❄️🌙',
        'Khamrah Qahwa': '🍁❄️🌙',
        'Ra\'ed': '🍁❄️🌙',
        'Fakhar Lattafa Black': '🍁❄️🌙',
        'Fakhar Lattafa White': '🌱☀️',
        'Saheb White': '🌱☀️',
        'Saheb Brown': '🍁❄️🌙',
        'Asad': '🍁❄️🌙',
        'Asala': '🫧☀️🌞',
        'Bade\'e Al Oud': '🍁❄️🌙',
        'Mayar': '🌱☀️',
        'Gissah': '🍁❄️🌙',
        'Asad Zanzibar': '🍁❄️🌙',
        'Saif Al Batal': '🍁❄️🌙',
        'EL GHAWAS': '🌱☀️',
        'Fakhar Lattafa Gold': '🍁❄️🌙',
        'Yara': '🌱☀️',
        'Tamima': '🌱☀️',
        'Ramz Lattafa': '🍁❄️🌙',
        'Ameerat Al Arab': '🍁❄️🌙',
        'Ana Abiyedh': '🌱☀️',
        'Sayaad Al Quloob': '🍁❄️🌙',
        'Box Musoof': '🍁❄️🌙',
        'In The Stars Body Lotion': '❄️🌙',
        'Into the Night perfume': '🌙🍁',
        'INTO THE NIGHT Body Lotion': '🌙🍁',
        'You\'re The One': '☀️🌱',
        'Gingham': '☀️☂️',
        'In the Stars': '❄️🌙',
        'Sense Laverne': '🍁❄️'
     
      }
    };

    let productsData = JSON.parse(JSON.stringify(localProductsData));
    window.productsData = productsData;

    async function loadProducts(category = 'all') {
      const filter = (p) => {
        if (category === 'men' || category === 'women' || category === 'unisex') {
          return p.category === category;
        }
        if (category === 'best') return p.badge === 'الأكثر مبيعاً';
        if (category === 'discounts') return !!p.originalPrice;
        return true;
      };
      const baseProducts = localProductsData.products.filter(filter);
      const baseSymbols = {};
      baseProducts.forEach(p => {
        if (localProductsData.symbols[p.name]) {
          baseSymbols[p.name] = localProductsData.symbols[p.name];
        }
      });
      productsData = { products: baseProducts, symbols: baseSymbols };

      if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL &&
          typeof SUPABASE_ANON_KEY !== 'undefined' && SUPABASE_ANON_KEY &&
          window.supabase) {
        try {
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          const { data, error } = await client.from('products').select('*');
          if (!error && Array.isArray(data) && data.length > 0) {
            data.forEach(p => {
              const mapped = {
                name: p.name,
                desc: p.description ?? undefined,
                img: p.image_url ?? undefined,
                price: p.price ?? undefined,
                available: p.available ?? undefined,
                category: p.category ?? undefined
              };
              const idx = productsData.products.findIndex(lp => lp.name === p.name);
              if (idx >= 0) {
                const existing = productsData.products[idx];
                Object.keys(mapped).forEach(key => {
                  if (mapped[key] != null) existing[key] = mapped[key];
                });
              } else {
                const newProduct = {
                  name: mapped.name || '',
                  desc: mapped.desc || '',
                  img: mapped.img || '',
                  price: mapped.price != null ? mapped.price : 0,
                  available: mapped.available != null ? mapped.available : false,
                  category: mapped.category || ''
                };
                productsData.products.push(newProduct);
              }
              if (p.symbols != null) {
                productsData.symbols[p.name] = p.symbols;
              }
            });
            productsData.products = productsData.products.filter(filter);
          }
        } catch (err) {
          console.error('Failed to fetch products from Supabase', err);
        }
      }
      window.productsData = productsData;
      return productsData;
    }

    window.loadProducts = loadProducts;
