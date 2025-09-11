// Cart management using localStorage
let cart = [];
let addCooldown = false;

// inject styles for add-to-cart message
const cartMsgStyle = document.createElement('style');
cartMsgStyle.textContent = `
#cartToast {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: #16a34a;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  z-index: 2000;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  animation: fadeIn 0.3s ease-out;
}
#cartToast.fade-out {
  animation: fadeOut 0.3s forwards;
}
#cartToast button {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}`;
document.head.appendChild(cartMsgStyle);

function loadCart() {
  try {
    const data = localStorage.getItem('perfume_cart');
    cart = data ? JSON.parse(data) : [];
    cart = cart.map(item => ({ ...item, qty: item.qty ? Number(item.qty) : 1 }));
  } catch (e) {
    cart = [];
  }
  return cart;
}

function saveCart() {
  localStorage.setItem('perfume_cart', JSON.stringify(cart));
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }
  saveCart();
  renderCart();
  showCartMessage(product.name);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 mt-4">سلة التسوق فارغة</p>';
    updateCartCount();
    return;
  }
  let total = 0;
  container.innerHTML = cart
    .map(item => {
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
    })
    .join('');
  container.innerHTML += `<div class="py-4 flex justify-between font-bold">
      <span>الإجمالي:</span>
      <span class="text-yellow-600">${total} أوقية</span>
    </div>
    <button onclick="checkout()" class="w-full bg-green-500 text-white py-2 rounded">شراء الجميع</button>`;
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = count;
  if (count > 0) {
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }
}

function showCartMessage(name) {
  const existing = document.getElementById('cartToast');
  if (existing) existing.remove();
  const msg = document.createElement('div');
  msg.id = 'cartToast';
  msg.innerHTML = `<span>تمت إضافة ${name} إلى السلة</span><button onclick="toggleCart()">عرض السلة</button>`;
  document.body.appendChild(msg);
  setTimeout(() => {
    msg.classList.add('fade-out');
    setTimeout(() => msg.remove(), 300);
  }, 2500);
}

function buildWhatsAppMessage() {
  let message = 'السلام عليكم، أريد شراء المنتجات التالية:\n';
  cart.forEach(item => {
    message += `- ${item.name} ×${item.qty} — ${item.price} أوقية\n`;
  });
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  message += `الإجمالي: ${total} أوقية`;
  return message;
}

function checkout() {
  if (cart.length === 0) return;
  const phone = (typeof config !== 'undefined' && config.whatsapp && config.whatsapp.number) ? config.whatsapp.number : '';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
  window.open(url, '_blank');
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.toggle('open');
}

function addToCartFromCard(btn) {
  if (addCooldown) return;
  addCooldown = true;
  setTimeout(() => (addCooldown = false), 500);
  const card = btn.closest('.product');
  if (!card) return;
  const product = {
    id: card.dataset.id,
    name: card.dataset.name,
    price: Number(card.dataset.price),
    image: card.dataset.image
  };
  addToCart(product);
}

// initialize
loadCart();
renderCart();
updateCartCount();
