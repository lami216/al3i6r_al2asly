// Cart, Wishlist and Checkout management using localStorage
let cart = [];
let wishlist = [];
let addCooldown = false;
let checkoutData = {};

// inject styles for toast and wishlist button
const styleEl = document.createElement('style');
styleEl.textContent = `
#cartToast { position: fixed; bottom: 1rem; left:50%; transform:translateX(-50%); background:#16a34a; color:white; padding:0.75rem 1rem; border-radius:0.5rem; z-index:2000; display:flex; gap:0.5rem; align-items:center; animation:fadeIn 0.3s ease-out; }
#cartToast.fade-out { animation:fadeOut 0.3s forwards; }
#cartToast button { background:rgba(255,255,255,0.2); padding:0.25rem 0.5rem; border-radius:0.25rem; }
.wishlist-btn { position:absolute; top:0.25rem; left:0.25rem; z-index:20; color:#aaa; font-size:1.25rem; }
.wishlist-btn.active { color:#e11d48; }
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes fadeOut{from{opacity:1;}to{opacity:0;}}
`; 
const existingStyle = document.head.querySelector('#toastWishlistStyle');
if(!existingStyle){ styleEl.id = 'toastWishlistStyle'; document.head.appendChild(styleEl); }

// global add-to-cart button markup for product cards (removed top button)
window.addBtnHTML = '';

function loadCart(){
  try{ const data = localStorage.getItem('perfume_cart'); cart = data ? JSON.parse(data) : []; cart = cart.map(i=>({...i, qty:i.qty?Number(i.qty):1})); }
  catch(e){ cart = []; }
  return cart;
}
function saveCart(){ localStorage.setItem('perfume_cart', JSON.stringify(cart)); }

function loadWishlist(){
  try{ const data = localStorage.getItem('perfume_wishlist'); wishlist = data ? JSON.parse(data) : []; }
  catch(e){ wishlist = []; }
  return wishlist;
}
function saveWishlist(){ localStorage.setItem('perfume_wishlist', JSON.stringify(wishlist)); }

function loadCheckoutData(){
  try{ checkoutData = JSON.parse(localStorage.getItem('checkout_data')) || {}; }
  catch(e){ checkoutData = {}; }
  return checkoutData;
}
function saveCheckoutData(){ localStorage.setItem('checkout_data', JSON.stringify(checkoutData)); }

function addToCart(product){
  const existing = cart.find(item => item.id === product.id);
  if(existing){ existing.qty += 1; }
  else { product.qty = 1; cart.push(product); }
  saveCart();
  renderCart();
  showToast(t('toasts.added_cart',{name:product.name}), true);
}

function toggleWishlist(id){
  const idx = wishlist.indexOf(id);
  if(idx === -1){ wishlist.push(id); showToast(t('toasts.added_wishlist')); }
  else { wishlist.splice(idx,1); showToast(t('toasts.removed_wishlist')); }
  saveWishlist();
  initWishlistForProducts();
}

function removeFromCart(id){
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast(t('toasts.removed_cart'));
}

function renderCart(){
  const container = document.getElementById('cartItems');
  if(!container){ updateCartCount(); return; }
  if(cart.length === 0){
    container.innerHTML = `<p class="text-center text-gray-500 mt-4">${t('cart.empty')}</p>`;
    updateCartCount();
    return;
  }
  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = Number(item.price) * item.qty;
    total += itemTotal;
    return `<div class="flex items-center gap-2 border-b py-2" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-contain rounded"/>
      <div class="flex-1">
        <p class="text-sm">${item.name}</p>
        <p class="text-xs text-yellow-600 font-bold">${formatNumber(item.price)} ${t('currency')} × ${formatNumber(item.qty)}</p>
      </div>
      <button class="text-red-500 text-xl" onclick="removeFromCart('${item.id}')">&times;</button>
    </div>`;
  }).join('');
  container.innerHTML += `<div class="py-4 flex justify-between font-bold">
      <span>${t('cart.total')}</span>
      <span class="text-yellow-600">${formatNumber(total)} ${t('currency')}</span>
    </div>
    <div class="flex gap-2">
      <a href="index.html" class="flex-1 bg-gray-200 text-gray-800 py-2 rounded text-center">${t('buttons.continue_shopping')}</a>
      <a href="checkout.html" class="flex-1 bg-green-500 text-white py-2 rounded text-center">${t('buttons.checkout')}</a>
    </div>`;
  updateCartCount();
}

function updateCartCount(){
  const countEl = document.getElementById('cartCount');
  if(!countEl) return;
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  countEl.textContent = count;
  if(count>0){ countEl.classList.remove('hidden'); } else { countEl.classList.add('hidden'); }
}

function showToast(message, withCart){
  const existing = document.getElementById('cartToast');
  if(existing) existing.remove();
  const msg = document.createElement('div');
  msg.id = 'cartToast';
  msg.innerHTML = withCart ? `<span>${message}</span><a href="cart.html" class="underline">${t('titles.cart')}</a>` : `<span>${message}</span>`;
  document.body.appendChild(msg);
  setTimeout(()=>{ msg.classList.add('fade-out'); setTimeout(()=>msg.remove(),300); },2500);
}

function initWishlistForProducts(){
  document.querySelectorAll('.product').forEach(card => {
    const id = card.dataset.id;
    if(!id) return;
    let btn = card.querySelector('.wishlist-btn');
    if(!btn){
      btn = document.createElement('button');
      btn.className = 'wishlist-btn';
      btn.innerHTML = '<i class="fas fa-heart"></i>';
      btn.onclick = (e)=>{ e.stopPropagation(); toggleWishlist(id); };
      card.appendChild(btn);
    }
    if(wishlist.includes(id)) btn.classList.add('active'); else btn.classList.remove('active');
  });
}

function addToCartFromCard(btn){
  if(addCooldown) return;
  addCooldown = true;
  setTimeout(()=> (addCooldown=false), 500);
  const card = btn.closest('.product');
  if(!card) return;
  const product = { id: card.dataset.id, name: card.dataset.name, price: Number(card.dataset.price), image: card.dataset.image };
  addToCart(product);
}

function buildCheckoutItems(){
  return cart.map(item=>`<li class="flex justify-between"><span>${item.name} ×${formatNumber(item.qty)}</span><span>${formatNumber(item.price*item.qty)} ${t('currency')}</span></li>`).join('');
}

function initCheckoutPage(){
  const summary = document.getElementById('checkoutSummary');
  if(!summary) return;
  if(cart.length === 0){ window.location.href = 'cart.html'; return; }
  summary.innerHTML = buildCheckoutItems();
  const total = cart.reduce((s,i)=> s + Number(i.price)*i.qty,0);
  summary.innerHTML += `<div class="py-2 flex justify-between font-bold"><span>${t('cart.total')}</span><span class="text-yellow-600">${formatNumber(total)} ${t('currency')}</span></div>`;
  const nameInput = document.getElementById('coName');
  const phoneInput = document.getElementById('coPhone');
  const manual = document.getElementById('manualAddress');
  nameInput.value = checkoutData.name || '';
  phoneInput.value = checkoutData.phone || '';
  manual.value = checkoutData.address || '';
  nameInput.placeholder = t('labels.full_name');
  phoneInput.placeholder = t('labels.phone');
  manual.placeholder = t('labels.manual_address');
  document.getElementById('mapPreview').classList.add('hidden');
  if(checkoutData.lat && checkoutData.lng){
    showMap(checkoutData.lat, checkoutData.lng);
  } else {
    manual.classList.remove('hidden');
  }
  const locBtn = document.getElementById('useLocation');
  locBtn.textContent = t('buttons.use_my_location');
  const confirmBtn = document.getElementById('confirmCheckout');
  confirmBtn.textContent = t('buttons.confirm');
  locBtn.onclick = ()=>{ locBtn.disabled = true; getLocation(); };
  confirmBtn.onclick = confirmCheckout;
}

function getLocation(){
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    checkoutData.lat = lat; checkoutData.lng = lng; delete checkoutData.address; saveCheckoutData();
    showMap(lat,lng);
  }, err => {
    document.getElementById('manualAddress').classList.remove('hidden');
  });
}

function showMap(lat,lng){
  const mapPrev = document.getElementById('mapPreview');
  const frame = document.getElementById('mapFrame');
  const link = document.getElementById('viewMap');
  frame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  link.href = `https://maps.google.com/?q=${lat},${lng}`;
  mapPrev.classList.remove('hidden');
  document.getElementById('manualAddress').classList.add('hidden');
}

function confirmCheckout(){
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const manual = document.getElementById('manualAddress');
  if(!name || !phone){ alert(t('alerts.fill_name_phone')); return; }
  if(!checkoutData.lat){
    const address = manual.value.trim();
    if(!address){ alert(t('alerts.fill_address')); return; }
    checkoutData.address = address;
  }
  checkoutData.name = name; checkoutData.phone = phone; saveCheckoutData();
  const total = cart.reduce((s,i)=> s + Number(i.price)*i.qty,0);
  const itemsStr = cart.map(i=>`- ${i.name} ×${formatNumber(i.qty)} — ${formatNumber(i.price)} ${t('currency')}`).join('\n');
  const address = checkoutData.lat ? `https://maps.google.com/?q=${checkoutData.lat},${checkoutData.lng}` : (checkoutData.address||'');
  const template = config.whatsapp && config.whatsapp.template ? config.whatsapp.template : '';
  const message = buildWhatsAppMessage(template, { items: itemsStr, total: formatNumber(total), name, phone, address });
  const phoneNum = config.whatsapp && config.whatsapp.number ? config.whatsapp.number : '';
  const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`;
  try{
    window.open(url, '_blank');
    showToast(t('toasts.checkout_success'));
  }catch(e){
    showToast(t('toasts.checkout_failed'));
    return;
  }
  cart = []; saveCart(); renderCart(); updateCartCount();
  checkoutData = {}; saveCheckoutData();
  setTimeout(()=>{ window.location.href = 'index.html'; }, 500);
}

function checkout(){ if(cart.length>0) window.location.href="checkout.html"; }

// initialize
loadCart();
loadWishlist();
loadCheckoutData();
renderCart();
updateCartCount();
initWishlistForProducts();
initCheckoutPage();
