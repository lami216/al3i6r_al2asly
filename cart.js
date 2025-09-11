// Cart management using localStorage
let cart = [];

// inject styles for add-to-cart message
const cartMsgStyle = document.createElement('style');
cartMsgStyle.textContent = `
#cartMessage {
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: #16a34a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  z-index: 2000;
  animation: cartMsgMove 0.6s forwards;
}
@keyframes cartMsgMove {
  from { top: 1rem; left: 1rem; opacity: 0; }
  to { top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 1; }
}`;
document.head.appendChild(cartMsgStyle);

function loadCart() {
  try {
    const data = localStorage.getItem('perfume_cart');
    cart = data ? JSON.parse(data) : [];
  } catch (e) {
    cart = [];
  }
  return cart;
}

function saveCart() {
  localStorage.setItem('perfume_cart', JSON.stringify(cart));
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  renderCart();
  showCartMessage();
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
      total += Number(item.price);
      return `<div class="flex items-center gap-2 border-b py-2" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-contain rounded"/>
        <div class="flex-1">
          <p class="text-sm">${item.name}</p>
          <p class="text-xs text-yellow-600 font-bold">${item.price} أوقية</p>
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
  countEl.textContent = cart.length;
  if (cart.length > 0) {
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }
}

function showCartMessage() {
  const existing = document.getElementById('cartMessage');
  if (existing) existing.remove();
  const msg = document.createElement('div');
  msg.id = 'cartMessage';
  msg.textContent = 'تم إضافة المنتج للسلة';
  document.body.appendChild(msg);
  setTimeout(() => {
    msg.remove();
  }, 1500);
}

function buildWhatsAppMessage() {
  let message = 'السلام عليكم، أريد شراء المنتجات التالية:\n';
  cart.forEach(item => {
    message += `- ${item.name} ×1 — ${item.price} أوقية\n`;
  });
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
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
