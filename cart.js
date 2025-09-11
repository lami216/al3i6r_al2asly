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
.wishlist-btn { position:absolute; top:-0.75rem; left:2.5rem; z-index:20; color:#aaa; }
.wishlist-btn.active { color:#e11d48; }
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes fadeOut{from{opacity:1;}to{opacity:0;}}
`; 
const existingStyle = document.head.querySelector('#toastWishlistStyle');
if(!existingStyle){ styleEl.id = 'toastWishlistStyle'; document.head.appendChild(styleEl); }

// global add-to-cart button markup for product cards
window.addBtnHTML = `<button class="absolute -top-3 left-2 z-20 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm" onclick="addToCartFromCard(this)"><i class="fas fa-cart-plus"></i></button>`;

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
}

function renderCart(){
  const container = document.getElementById('cartItems');
  if(!container) return;
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
        <p class="text-xs text-yellow-600 font-bold">${item.price} أوقية × ${item.qty}</p>
      </div>
      <button class="text-red-500 text-xl" onclick="removeFromCart('${item.id}')">&times;</button>
    </div>`;
  }).join('');
  container.innerHTML += `<div class="py-4 flex justify-between font-bold">
      <span>${t('cart.total')}</span>
      <span class="text-yellow-600">${total} أوقية</span>
    </div>
    <button onclick="checkout()" class="w-full bg-green-500 text-white py-2 rounded">${t('cart.buy_all')}</button>`;
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
  msg.innerHTML = withCart ? `<span>${message}</span><button onclick="toggleCart()">${t('titles.cart')}</button>` : `<span>${message}</span>`;
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

function toggleCart(){
  const drawer = document.getElementById('cartDrawer');
  if(drawer) drawer.classList.toggle('open');
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

// Checkout modal creation
function buildCheckoutItems(){
  return cart.map(item=>`<li class="flex justify-between"><span>${item.name} ×${item.qty}</span><span>${item.price*item.qty} أوقية</span></li>`).join('');
}

function openCheckoutModal(){
  let modal = document.getElementById('checkoutModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50';
    modal.innerHTML = `<div class="bg-white p-4 rounded w-11/12 max-w-md max-h-full overflow-y-auto">
      <h2 class="text-xl font-bold mb-2" data-i18n="titles.checkout">${t('titles.checkout')}</h2>
      <ul id="checkoutSummary" class="mb-4 space-y-1"></ul>
      <input id="coName" class="w-full border p-2 mb-2" placeholder="${t('labels.full_name')}">
      <input id="coPhone" class="w-full border p-2 mb-2" placeholder="${t('labels.phone')}">
      <button id="useLocation" class="bg-blue-500 text-white px-3 py-2 rounded mb-2">${t('buttons.use_my_location')}</button>
      <div id="mapPreview" class="hidden mb-2">
        <iframe id="mapFrame" class="w-full h-40" loading="lazy"></iframe>
        <a id="viewMap" href="#" target="_blank" class="text-blue-600 underline" data-i18n="buttons.view_map">${t('buttons.view_map')}</a>
      </div>
      <input id="manualAddress" class="w-full border p-2 mb-2 hidden" placeholder="${t('labels.manual_address')}">
      <button id="confirmCheckout" class="w-full bg-green-500 text-white py-2 rounded">${t('buttons.confirm')}</button>
    </div>`;
    document.body.appendChild(modal);

    document.getElementById('useLocation').onclick = getLocation;
    document.getElementById('confirmCheckout').onclick = confirmCheckout;
  }
  document.getElementById('checkoutSummary').innerHTML = buildCheckoutItems();
  const nameInput = document.getElementById('coName');
  const phoneInput = document.getElementById('coPhone');
  const manualAddress = document.getElementById('manualAddress');
  nameInput.value = checkoutData.name || '';
  phoneInput.value = checkoutData.phone || '';
  manualAddress.value = checkoutData.address || '';
  document.getElementById('mapPreview').classList.add('hidden');
  if(checkoutData.lat && checkoutData.lng){
    showMap(checkoutData.lat, checkoutData.lng);
  }else if(checkoutData.address){
    manualAddress.classList.remove('hidden');
  }
  modal.classList.remove('hidden');
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
  if(!checkoutData.lat){ checkoutData.address = manual.value.trim(); }
  checkoutData.name = name; checkoutData.phone = phone; saveCheckoutData();
  const total = cart.reduce((s,i)=> s + Number(i.price)*i.qty,0);
  let msg = 'طلب جديد:\n';
  cart.forEach(i => { msg += `- ${i.name} ×${i.qty} — ${i.price} أوقية\n`; });
  msg += `الإجمالي: ${total} أوقية\n`;
  msg += `الاسم: ${name}\nالهاتف: ${phone}\n`;
  const address = checkoutData.lat ? `https://maps.google.com/?q=${checkoutData.lat},${checkoutData.lng}` : (checkoutData.address||'');
  msg += `العنوان: ${address}`;
  const phoneNum = config.whatsapp && config.whatsapp.number ? config.whatsapp.number : '';
  const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast(t('toasts.checkout_success'));
  cart = []; saveCart(); renderCart(); updateCartCount();
  document.getElementById('checkoutModal').classList.add('hidden');
}

function checkout(){ if(cart.length>0) openCheckoutModal(); }

// initialize
loadCart();
loadWishlist();
loadCheckoutData();
renderCart();
updateCartCount();
initWishlistForProducts();
